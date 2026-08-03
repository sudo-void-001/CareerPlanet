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
    
    # Optional fields based on role
    bio = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    # Recruiter specific
    company_id = Column(Integer, nullable=True) # Will be foreign key later
