from fastapi import APIRouter

from app.api.routes import auth, favorites, reservations, spaces, users

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(spaces.router)
api_router.include_router(favorites.router)
api_router.include_router(reservations.router)
