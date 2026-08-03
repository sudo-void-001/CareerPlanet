from pydantic import BaseModel

class JobBase(BaseModel):
    title: str
    description: str
    location: str
    job_type: str
    salary: str | None = None
    skills: str | None = None
    company_name: str
    company_id: int = 1

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    recruiter_id: int
    is_active: bool

    class Config:
        from_attributes = True
