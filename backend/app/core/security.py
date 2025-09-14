from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from .config import settings
import requests

pwd_context= CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_refresh_token(token: str) -> str:
    return pwd_context.hash(token)

def verify_refresh_token(plain_token: str, hashed_token: str) -> bool:
    return pwd_context.verify(plain_token, hashed_token)

def create_access_token(data:dict)->str:
    to_encode=data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode=data.copy()
    expire=datetime.utcnow()+timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)

def verify_refresh_token(raw_token: str, hashed_token: str) -> bool:
    return pwd_context.verify(raw_token, hashed_token)


def exchange_code_for_tokens(code: str) -> dict:
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    token_res = requests.post("https://oauth2.googleapis.com/token", data=data)

    if token_res.status_code != 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to exchange authorization code")
    return token_res.json()


def verify_google_id_token(id_token: str) -> dict:
    try:
        id_info = google_id_token.verify_oauth2_token(
            id_token,
            google_requests.Request(),
            audience=settings.GOOGLE_CLIENT_ID
        )
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid issuer")
        return id_info
    except ValueError as e:
        print("invalid id?")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid ID token")

