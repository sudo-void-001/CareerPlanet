from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
from enum import Enum
from app.core.database import Base

class UserRole(str, Enum):
    STUDENT = "student"
    RECRUITER = "recruiter"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Student fields
    bio = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)


    # Recruiter company profile
    company_id = Column(Integer, nullable=True)
    company_name = Column(String, nullable=True)
    company_origin = Column(String, nullable=True)   # City, Country
    company_website = Column(String, nullable=True)
    company_logo_url = Column(String, nullable=True) # Path to company logo

    # Shared profile
    avatar_url = Column(String, nullable=True)        # Profile picture path
