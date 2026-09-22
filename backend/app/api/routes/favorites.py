from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.api.dependencies import CurrentUser, DBSession
from app.models import Favorite, Space
from app.schemas import FavoriteCheck, FavoriteRead, SpaceRead

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get(
    "",
    response_model=list[SpaceRead],
    summary="Listar favoritos",
    description="Lista os espaços favoritados pelo usuário autenticado.",
)
async def list_favorites(current_user: CurrentUser, session: DBSession) -> list[Space]:
    result = await session.scalars(
        select(Space)
        .join(Favorite)
        .where(Favorite.user_id == current_user.id)
        .options(selectinload(Space.purposes), selectinload(Space.amenities))
        .order_by(Favorite.created_at.desc())
    )
    return list(result.all())


@router.post(
    "/{space_id}",
    response_model=FavoriteRead,
    status_code=status.HTTP_201_CREATED,
    summary="Adicionar favorito",
)
async def add_favorite(
    space_id: int, current_user: CurrentUser, session: DBSession
) -> Favorite:
    if await session.get(Space, space_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Espaço não encontrado.")
    favorite = Favorite(user_id=current_user.id, space_id=space_id)
    session.add(favorite)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Este espaço já está nos favoritos.") from None
    await session.refresh(favorite)
    return favorite


@router.delete(
    "/{space_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remover favorito",
)
async def remove_favorite(
    space_id: int, current_user: CurrentUser, session: DBSession
) -> Response:
    favorite = await session.get(Favorite, (current_user.id, space_id))
    if favorite is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Favorito não encontrado.")
    await session.delete(favorite)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{space_id}/check",
    response_model=FavoriteCheck,
    summary="Verificar favorito",
)
async def check_favorite(
    space_id: int, current_user: CurrentUser, session: DBSession
) -> FavoriteCheck:
    favorite = await session.get(Favorite, (current_user.id, space_id))
    return FavoriteCheck(space_id=space_id, is_favorite=favorite is not None)
