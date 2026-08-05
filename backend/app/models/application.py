from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, Boolean, DateTime
from sqlalchemy.sql import func
from enum import Enum
from app.core.database import Base

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    HIRED = "hired"
    SELECTED = "selected"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, nullable=True)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING, nullable=False)
    applied_at = Column(DateTime, server_default=func.now())
    
    # Custom Communication
    cover_letter = Column(String, nullable=True)
    recruiter_message = Column(String, nullable=True)
    
    # Email tracking
    application_email_sent = Column(Boolean, default=False)
    shortlist_email_sent = Column(Boolean, default=False)
    interview_email_sent = Column(Boolean, default=False)
    selection_email_sent = Column(Boolean, default=False)
    rejection_email_sent = Column(Boolean, default=False)

