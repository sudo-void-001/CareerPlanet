from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.job import Job
from app.schemas.job import JobCreate, JobOut

router = APIRouter()

@router.get("/", response_model=List[JobOut])
def get_jobs(db: Session = Depends(get_db)):
    """Public: all active, non-expired jobs (student job board)."""
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    jobs = db.query(Job).filter(
        Job.is_active == True,
        (Job.expires_at == None) | (Job.expires_at > now)
    ).all()
    return jobs

@router.get("/my-jobs", response_model=List[JobOut])
def get_my_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Recruiter-only: returns ALL jobs posted by this recruiter (including expired)."""
    if current_user.role != UserRole.RECRUITER:
        raise HTTPException(status_code=403, detail="Only recruiters can access this")
    jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).all()
    return jobs

@router.post("/", response_model=JobOut)
def create_job(job_in: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.RECRUITER:
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")
    
    job = Job(
        title=job_in.title,
        description=job_in.description,
        location=job_in.location,
        job_type=job_in.job_type,
        salary=job_in.salary,
        skills=job_in.skills,
        company_name=job_in.company_name,
        company_id=job_in.company_id,
        recruiter_id=current_user.id,
        expires_at=job_in.expires_at.replace(tzinfo=None) if job_in.expires_at else None,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
