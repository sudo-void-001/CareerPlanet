from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    job_type = Column(String, nullable=False) # e.g. Full-time, Part-time, Internship
    salary = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    
    # Company info
    company_name = Column(String, nullable=True)
    company_id = Column(Integer, nullable=False, index=True, default=1)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)  # Optional job expiry date

