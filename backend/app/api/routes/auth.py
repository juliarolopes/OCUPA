from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

from app.api.dependencies import CurrentUser, DBSession
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserRead

router = APIRouter(prefix="/auth", tags=["Authentication"])


def token_response(user: User) -> TokenResponse:
    token, expires_in = create_access_token(user.id)
    return TokenResponse(access_token=token, expires_in=expires_in, user=user)


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar conta",
    description="Cria um usuário, armazena a senha com Argon2 e retorna um JWT Bearer.",
)
async def register(payload: RegisterRequest, session: DBSession) -> TokenResponse:
    email = str(payload.email).lower()
    exists = await session.scalar(select(User.id).where(func.lower(User.email) == email))
    if exists is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Este e-mail já está cadastrado.")
    user = User(name=payload.name.strip(), email=email, password_hash=hash_password(payload.password))
    session.add(user)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Este e-mail já está cadastrado.") from None
    await session.refresh(user)
    return token_response(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Entrar",
    description="Valida e-mail e senha e retorna um JWT Bearer.",
)
async def login(payload: LoginRequest, session: DBSession) -> TokenResponse:
    email = str(payload.email).lower()
    user = await session.scalar(select(User).where(func.lower(User.email) == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "E-mail ou senha inválidos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_response(user)


@router.get(
    "/me",
    response_model=UserRead,
    summary="Consultar usuário autenticado",
    description="Retorna a identidade associada ao JWT sem expor o hash da senha.",
)
async def auth_me(current_user: CurrentUser) -> User:
    return current_user
