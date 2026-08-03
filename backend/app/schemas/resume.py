from pydantic import BaseModel

class ResumeOut(BaseModel):
    id: int
    student_id: int
    file_path: str
    is_primary: bool
    summary: str | None
    match_score: int | None
    missing_skills: str | None
    recommendations: str | None

    class Config:
        from_attributes = True

class ResumeAnalysisUpdate(BaseModel):
    summary: str
    match_score: int
    missing_skills: str
    recommendations: str
