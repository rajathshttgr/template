from fastapi import APIRouter
from app.api.routes import auth, user

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(user.router,prefix="/user", tags=["User"])
