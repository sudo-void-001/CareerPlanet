from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.STUDENT
    company_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    bio: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    company_name: Optional[str] = None
    company_origin: Optional[str] = None
    company_website: Optional[str] = None
    avatar_url: Optional[str] = None
    company_logo_url: Optional[str] = None
    resume_url: Optional[str] = None

    class Config:
        from_attributes = True

class RecruiterProfileUpdate(BaseModel):
    company_name: str
    company_origin: str
    company_website: Optional[str] = None

class StudentProfileUpdate(BaseModel):
    bio: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
