from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.application import ApplicationStatus

class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: int | None = None
    cover_letter: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    job_id: int
    student_id: int
    resume_id: int | None
    status: ApplicationStatus
    applied_at: Optional[datetime] = None
    cover_letter: Optional[str] = None
    recruiter_message: Optional[str] = None
    application_email_sent: Optional[bool] = False
    shortlist_email_sent: Optional[bool] = False
    interview_email_sent: Optional[bool] = False
    selection_email_sent: Optional[bool] = False
    rejection_email_sent: Optional[bool] = False

    class Config:
        from_attributes = True

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus
    recruiter_message: Optional[str] = None

