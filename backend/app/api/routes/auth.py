from fastapi import APIRouter,Depends,HTTPException,status, Response, Request
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.models import User, UserAuth
from app.core.db import get_db
from app.schemas import UserCreate, Token, UserLogin, GoogleAuth
from app.core.security import (
    hash_password,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    verify_password,
    verify_refresh_token,
    exchange_code_for_tokens,
    verify_google_id_token
)
from app.core.config import settings
from ..utils import get_current_user
import requests

router = APIRouter()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_create: UserCreate, response: Response, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(
        name=user_create.name,
        email=user_create.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    hashed_pwd = hash_password(user_create.password)
    new_auth = UserAuth(
        user_id=new_user.id,
        provider="local",
        hashed_password=hashed_pwd
    )
    db.add(new_auth)
    db.commit()

    access_token = create_access_token({"sub": new_user.email})
    refresh_token_raw = create_refresh_token({"sub": new_user.email})
    hashed_refresh = hash_refresh_token(refresh_token_raw)

    new_auth.refresh_token = hashed_refresh
    new_auth.token_expiry = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(new_auth)
    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_raw,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=False,  # Set True in production with HTTPS
        samesite="lax"
    )

    return {
        "access_token": access_token
    }


@router.post("/login", response_model=Token)
def login(user_login: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_login.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    auth = db.query(UserAuth).filter(
        UserAuth.user_id == user.id,
        UserAuth.provider == "local"
    ).first()

    if not auth or not verify_password(user_login.password, auth.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.email})
    refresh_token_raw = create_refresh_token({"sub": user.email})
    hashed_refresh = hash_refresh_token(refresh_token_raw)

    auth.refresh_token = hashed_refresh
    auth.token_expiry = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(auth)
    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_raw,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True, # Set True in production with HTTPS
        samesite="lax"
    )

    return {
        "access_token": access_token
    }


@router.post("/logout")
def logout(response: Response,db: Session=Depends(get_db), current_user: User = Depends(get_current_user)):
    auth = db.query(UserAuth).filter(
        UserAuth.user_id == current_user.id,
        UserAuth.provider == "local"
    ).first()

    if auth:
        auth.refresh_token = None
        auth.token_expiry = None
        db.add(auth)
        db.commit()

    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        samesite="lax",
        secure=True  # Set True in production with HTTPS
    )

    return {"detail": "Logged out successfully"}


@router.post("/refresh", response_model=Token)
def refresh_token(response: Response, request: Request, db: Session = Depends(get_db)):
    refresh_token_raw = request.cookies.get("refresh_token")
    if not refresh_token_raw:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")

    try:
        payload = jwt.decode(refresh_token_raw, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    auth = db.query(UserAuth).filter(
        UserAuth.user_id == user.id,
        UserAuth.provider == "local"
    ).first()

    if not auth or not auth.refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if not verify_refresh_token(refresh_token_raw, auth.refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if auth.token_expiry < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    access_token = create_access_token({"sub": user.email})
    new_refresh_token_raw = create_refresh_token({"sub": user.email})
    hashed_refresh = hash_refresh_token(new_refresh_token_raw)

    auth.refresh_token = hashed_refresh
    auth.token_expiry = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(auth)
    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token_raw,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True, # Set True in production with HTTPS
        samesite="lax"
    )

    return {
        "access_token": access_token,
    }

    
@router.post("/google", response_model=Token)
def google_login(google_auth: GoogleAuth, response: Response, db: Session=Depends(get_db)):

    token_json = exchange_code_for_tokens(google_auth.code)
    id_token = token_json.get("id_token")

    if not id_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID token not provided")
    
    
    payload = verify_google_id_token(id_token)
    email = payload.get("email")
    name = payload.get("name")
    sub = payload.get("sub")

    if not email or not name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")

    user=db.query(User).filter(User.email==email).first()
    if not user:
        user=User(name=name,email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    auth=db.query(UserAuth).filter(
        UserAuth.user_id==user.id,
        UserAuth.provider=="google"
    ).first()

    if not auth:
        auth=UserAuth(
            user_id=user.id,
            provider="google",
            provider_user_id=sub
        )
    
    access_token = create_access_token({"sub": user.email})
    refresh_token_raw = create_refresh_token({"sub": user.email})
    hashed_refresh = hash_refresh_token(refresh_token_raw)

    auth.refresh_token = hashed_refresh
    auth.token_expiry = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(auth)
    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_raw,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True,  # Set True in production with HTTPS
        samesite="lax"
    )

    return {
        "access_token": access_token
    }
    