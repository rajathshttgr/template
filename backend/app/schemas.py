from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

class UserLogin(BaseModel):
    email: EmailStr
    password: str 

class GoogleAuth(BaseModel):
    code: str 

class Token(BaseModel):
    access_token: str

class TokenRefresh(BaseModel):
    refresh_token: str


