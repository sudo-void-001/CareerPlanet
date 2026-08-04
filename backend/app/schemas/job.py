from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobBase(BaseModel):
    title: str
    description: str
    location: str
    job_type: str
    salary: Optional[str] = None
    skills: Optional[str] = None
    company_name: str
    company_id: int = 1
    expires_at: Optional[datetime] = None

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    recruiter_id: int
    is_active: bool

    class Config:
        from_attributes = True
