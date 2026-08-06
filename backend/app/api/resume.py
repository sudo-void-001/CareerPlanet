import os
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.resume import Resume
from app.schemas.resume import ResumeOut
import PyPDF2
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def analyze_pdf_content(content: bytes) -> dict:
    """Extract text from PDF and analyze using shared AI module."""
    from app.api.ai import _analyze_text
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if not text.strip():
            return {
                "match_score": 50,
                "summary": "Could not extract text from this PDF. Try saving as text-based PDF.",
                "missing_skills": "PDF parsing failed",
                "recommendations": "Use a text-based PDF (not a scanned image)",
                "strengths": "",
                "_full": None,
            }

        result = _analyze_text(text)
        # Map comprehensive result to resume model fields (strings for DB storage)
        return {
            "match_score": result.get("overall_score", 70),
            "summary": result.get("summary", ""),
            "missing_skills": ", ".join(result.get("missing_skills", [])) if isinstance(result.get("missing_skills"), list) else result.get("missing_skills", ""),
            "recommendations": "; ".join(result.get("improvements", [])) if isinstance(result.get("improvements"), list) else result.get("improvements", ""),
            "strengths": ", ".join(result.get("strengths", [])) if isinstance(result.get("strengths"), list) else result.get("strengths", ""),
            # Full result passed through for frontend (not stored in DB)
            "_full": result,
        }
    except Exception as e:
        return {
            "match_score": 65,
            "summary": f"Analysis encountered an issue: {str(e)[:100]}",
            "missing_skills": "",
            "recommendations": "Please re-upload your resume",
            "strengths": "",
            "_full": None,
        }


@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can upload resumes")

    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Analyze the resume using shared AI module
    analysis = analyze_pdf_content(content)

    # Replace existing resume or create new
    existing = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if existing:
        existing.file_path = file_path
        existing.is_primary = True
        existing.summary = analysis.get("summary")
        existing.match_score = analysis.get("match_score")
        existing.missing_skills = analysis.get("missing_skills")
        existing.recommendations = analysis.get("recommendations")

        current_user.resume_url = f"/api/resume/download/{current_user.id}"
        db.commit()
        db.refresh(existing)
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

    current_user.resume_url = f"/api/resume/download/{current_user.id}"
    db.add(resume)
    db.commit()
    db.refresh(resume)
    resume.strengths = analysis.get("strengths")
    return resume


@router.get("/my-resume", response_model=ResumeOut)
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Not a student")

    resume = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Ensure strengths is present (fallback to parsing stored summary)
    if not hasattr(resume, 'strengths') or not resume.strengths:
        resume.strengths = "Resume uploaded"
    return resume


@router.get("/download/{student_id}")
def download_resume(
    student_id: int,
    db: Session = Depends(get_db)
):
    """Downloads a student's resume file."""
    resume = db.query(Resume).filter(Resume.student_id == student_id).first()
    if not resume or not os.path.exists(resume.file_path):
        raise HTTPException(status_code=404, detail="Resume file not found")

    filename = os.path.basename(resume.file_path)
    return FileResponse(
        path=resume.file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
