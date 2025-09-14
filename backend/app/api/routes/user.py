from fastapi import APIRouter, Depends
from app.models import User
from ..utils import get_current_user

router = APIRouter()

@router.get("/profile")
def profile_route(current_user: User = Depends(get_current_user)):
    res={
        "name": current_user.name,
        "email": current_user.email,
        "created_at":current_user.created_at,
        "is_active":current_user.is_active,
        "message":f"Hello {current_user.name}!"
    }
    return res