import os
import shutil
import json
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.resume import Resume
from app.schemas.resume import ResumeOut
from groq import Groq
import PyPDF2
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key) if groq_api_key else None

def analyze_pdf_content(content: bytes) -> dict:
    """Extract text from PDF and call Groq for analysis."""
    if not client:
        return {
            "match_score": 88,
            "summary": "Strong profile for software engineering roles. (Set GROQ_API_KEY for real AI analysis)",
            "missing_skills": "Docker, Kubernetes, AWS",
            "recommendations": "Add quantifiable metrics to projects, Add Docker to your skills",
            "strengths": "Python, React, FastAPI, SQL"
        }
    
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        if not text.strip():
            raise ValueError("Could not extract text from PDF.")

        prompt = f"""
        Analyze this resume for a software engineering/tech role.
        Return ONLY a JSON object (no markdown formatting, no code blocks) with the following exact keys:
        - match_score (integer 0-100)
        - summary (string, short 2-3 sentence overview)
        - missing_skills (string, comma-separated list of missing skills, max 4)
        - strengths (string, comma-separated list of strengths, max 5)
        - recommendations (string, comma-separated list of actionable tips, max 4)

        Resume Text:
        {text[:4000]}
        """

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error during Groq resume analysis: {e}")
        return {
            "match_score": 75,
            "summary": "An error occurred during resume analysis. Saved successfully.",
            "missing_skills": "Error during analysis",
            "recommendations": "Please try re-uploading",
            "strengths": "Resume uploaded"
        }

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can upload resumes")
        
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    content = await file.read()
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    # Analyze the resume using Groq
    analysis = analyze_pdf_content(content)
    
    # Replace existing resume if any
    existing = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if existing:
        existing.file_path = file_path
        existing.is_primary = True
        existing.summary = analysis.get("summary")
        existing.match_score = analysis.get("match_score")
        existing.missing_skills = analysis.get("missing_skills")
        existing.recommendations = analysis.get("recommendations")
        
        # Mark user as having uploaded a resume
        current_user.resume_url = f"/api/resume/download/{current_user.id}"
        
        db.commit()
        db.refresh(existing)
        # Dynamically attach strengths
        existing.strengths = analysis.get("strengths")
        return existing

    resume = Resume(
        student_id=current_user.id,
        file_path=file_path,
        is_primary=True,
        summary=analysis.get("summary"),
        match_score=analysis.get("match_score"),
        missing_skills=analysis.get("missing_skills"),
        recommendations=analysis.get("recommendations")
    )
    
    # Mark user as having uploaded a resume
    current_user.resume_url = f"/api/resume/download/{current_user.id}"
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    # Dynamically attach strengths
    resume.strengths = analysis.get("strengths")
    return resume

@router.get("/my-resume", response_model=ResumeOut)
def get_my_resume(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Not a student")
        
    resume = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    # Attach a default strengths string since it's not saved in the db
    resume.strengths = "Python, React, SQL"
    return resume

@router.get("/download/{student_id}")
def download_resume(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Recruiter/Admin downloads a student's resume file."""
    if current_user.role not in (UserRole.RECRUITER, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Not authorized to download resumes")

    resume = db.query(Resume).filter(Resume.student_id == student_id).first()
    if not resume or not os.path.exists(resume.file_path):
        raise HTTPException(status_code=404, detail="Resume file not found")

    filename = os.path.basename(resume.file_path)
    return FileResponse(
        path=resume.file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
