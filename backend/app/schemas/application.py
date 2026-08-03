from pydantic import BaseModel
from app.models.application import ApplicationStatus

class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: int | None = None

class ApplicationOut(BaseModel):
    id: int
    job_id: int
    student_id: int
    resume_id: int | None
    status: ApplicationStatus

    class Config:
        from_attributes = True

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus
