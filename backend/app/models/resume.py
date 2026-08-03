from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False) # Path to stored file
    parsed_text = Column(Text, nullable=True) # Text extracted from resume
    is_primary = Column(Boolean, default=True)
    
    # AI Analysis Cache (simplified as per optimization guide)
    summary = Column(Text, nullable=True)
    match_score = Column(Integer, nullable=True)
    missing_skills = Column(Text, nullable=True) # Stored as comma separated or JSON string
    recommendations = Column(Text, nullable=True)
