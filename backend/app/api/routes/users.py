from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.api.dependencies import CurrentUser, DBSession
from app.models import Space, User
from app.schemas import SpaceRead, UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserRead,
    summary="Consultar meu perfil",
)
async def get_profile(current_user: CurrentUser) -> User:
    return current_user


@router.patch(
    "/me",
    response_model=UserRead,
    summary="Atualizar meu perfil",
    description="Permite alterar somente nome e e-mail do usuário autenticado.",
)
async def update_profile(
    payload: UserUpdate, current_user: CurrentUser, session: DBSession
) -> User:
    if payload.name is not None:
        current_user.name = payload.name.strip()
    if payload.email is not None:
        email = str(payload.email).lower()
        existing = await session.scalar(
            select(User.id).where(func.lower(User.email) == email, User.id != current_user.id)
        )
        if existing is not None:
            raise HTTPException(status.HTTP_409_CONFLICT, "Este e-mail já está cadastrado.")
        current_user.email = email
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Este e-mail já está cadastrado.") from None
    await session.refresh(current_user)
    return current_user


@router.get(
    "/me/spaces",
    response_model=list[SpaceRead],
    summary="Listar meus espaços",
    description="Lista os espaços pertencentes ao usuário autenticado.",
)
async def list_my_spaces(current_user: CurrentUser, session: DBSession) -> list[Space]:
    result = await session.scalars(
        select(Space)
        .where(Space.owner_id == current_user.id)
        .options(selectinload(Space.purposes), selectinload(Space.amenities))
        .order_by(Space.created_at.desc())
    )
    return list(result.all())
