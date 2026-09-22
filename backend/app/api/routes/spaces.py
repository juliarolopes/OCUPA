import math
import re
import unicodedata
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import selectinload

from app.api.dependencies import CurrentUser, DBSession
from app.models import Amenity, Purpose, Space
from app.schemas import SpaceCreate, SpacePage, SpaceRead, SpaceUpdate

router = APIRouter(prefix="/spaces", tags=["Spaces"])


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


def normalized_names(values: list[str]) -> list[str]:
    return list(dict.fromkeys(value.strip() for value in values if value.strip()))


async def resolve_named_resources(session: DBSession, model, names: list[str]):
    clean_names = normalized_names(names)
    if not clean_names:
        return []
    slugs = [slugify(name) for name in clean_names]
    existing = {
        item.slug: item for item in (await session.scalars(select(model).where(model.slug.in_(slugs)))).all()
    }
    resources = []
    for name, slug in zip(clean_names, slugs, strict=True):
        resource = existing.get(slug)
        if resource is None:
            resource = model(name=name, slug=slug)
            session.add(resource)
            existing[slug] = resource
        resources.append(resource)
    await session.flush()
    return resources


def eager_space_query():
    return select(Space).options(selectinload(Space.purposes), selectinload(Space.amenities))


async def get_space_or_404(session: DBSession, space_id: int) -> Space:
    space = await session.scalar(eager_space_query().where(Space.id == space_id))
    if space is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Espaço não encontrado.")
    return space


def split_filters(values: list[str] | None) -> list[str]:
    if not values:
        return []
    return normalized_names(part for value in values for part in value.split(","))


@router.get(
    "",
    response_model=SpacePage,
    summary="Buscar espaços",
    description="Lista espaços com filtros por finalidade, localização, preço, área e taxonomias.",
)
async def list_spaces(
    session: DBSession,
    necessidade: str | None = None,
    localizacao: str | None = None,
    cidade: str | None = None,
    tipo: str | None = None,
    price_min: Annotated[float | None, Query(ge=0)] = None,
    price_max: Annotated[float | None, Query(ge=0)] = None,
    area_min: Annotated[float | None, Query(gt=0)] = None,
    area_max: Annotated[float | None, Query(gt=0)] = None,
    amenities: Annotated[list[str] | None, Query()] = None,
    purposes: Annotated[list[str] | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> SpacePage:
    if price_min is not None and price_max is not None and price_min > price_max:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "price_min cannot exceed price_max.")
    if area_min is not None and area_max is not None and area_min > area_max:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "area_min cannot exceed area_max.")

    filters = []
    if necessidade:
        term = f"%{necessidade.strip()}%"
        filters.append(Space.purposes.any(Purpose.name.ilike(term)))
    if localizacao:
        term = f"%{localizacao.strip()}%"
        filters.append(or_(Space.city.ilike(term), Space.neighborhood.ilike(term), Space.address.ilike(term)))
    if cidade:
        filters.append(Space.city.ilike(cidade.strip()))
    if tipo:
        filters.append(Space.type.ilike(tipo.strip()))
    if price_min is not None:
        filters.append(Space.price_value >= price_min)
    if price_max is not None:
        filters.append(Space.price_value <= price_max)
    if area_min is not None:
        filters.append(Space.area >= area_min)
    if area_max is not None:
        filters.append(Space.area <= area_max)
    for amenity in split_filters(amenities):
        filters.append(Space.amenities.any(Amenity.name.ilike(amenity)))
    for purpose in split_filters(purposes):
        filters.append(Space.purposes.any(Purpose.name.ilike(purpose)))

    total = await session.scalar(select(func.count(Space.id)).where(*filters)) or 0
    result = await session.scalars(
        eager_space_query()
        .where(*filters)
        .order_by(Space.created_at.desc(), Space.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return SpacePage(
        items=list(result.all()),
        page=page,
        page_size=page_size,
        total=total,
        pages=math.ceil(total / page_size),
    )


@router.get("/{space_id}", response_model=SpaceRead, summary="Consultar espaço")
async def get_space(space_id: int, session: DBSession) -> Space:
    return await get_space_or_404(session, space_id)


@router.post(
    "",
    response_model=SpaceRead,
    status_code=status.HTTP_201_CREATED,
    summary="Criar espaço",
    description="Cria um espaço pertencente ao usuário autenticado.",
)
async def create_space(
    payload: SpaceCreate, current_user: CurrentUser, session: DBSession
) -> Space:
    data = payload.model_dump(exclude={"purposes", "amenities"})
    data["state"] = payload.state.upper()

    # Resolve every persistent related object before creating the bidirectional
    # associations. A query between the two assignments would trigger autoflush
    # while the transient Space is already present in Purpose.spaces/Amenity.spaces.
    purposes = await resolve_named_resources(session, Purpose, payload.purposes)
    amenities = await resolve_named_resources(session, Amenity, payload.amenities)

    space = Space(
        owner_id=current_user.id,
        **data,
        purposes=purposes,
        amenities=amenities,
    )
    session.add(space)
    await session.commit()
    await session.refresh(space, attribute_names=["purposes", "amenities"])
    return space


@router.patch(
    "/{space_id}",
    response_model=SpaceRead,
    summary="Atualizar espaço",
    description="Atualiza um espaço; somente seu proprietário possui autorização.",
)
async def update_space(
    space_id: int, payload: SpaceUpdate, current_user: CurrentUser, session: DBSession
) -> Space:
    space = await get_space_or_404(session, space_id)
    if space.owner_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Somente o proprietário pode editar o espaço.")
    fields = payload.model_dump(exclude_unset=True, exclude={"purposes", "amenities"})
    for field, value in fields.items():
        if value is not None:
            setattr(space, field, value.upper() if field == "state" else value)
    if "purposes" in payload.model_fields_set:
        space.purposes = await resolve_named_resources(session, Purpose, payload.purposes or [])
    if "amenities" in payload.model_fields_set:
        space.amenities = await resolve_named_resources(session, Amenity, payload.amenities or [])
    await session.commit()
    await session.refresh(
        space,
        attribute_names=["updated_at", "purposes", "amenities"],
    )
    return space


@router.delete(
    "/{space_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Excluir espaço",
    description="Exclui um espaço; somente seu proprietário possui autorização.",
)
async def delete_space(
    space_id: int, current_user: CurrentUser, session: DBSession
) -> Response:
    space = await get_space_or_404(session, space_id)
    if space.owner_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Somente o proprietário pode excluir o espaço.")
    await session.delete(space)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
