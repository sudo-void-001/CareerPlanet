from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.application import Application, ApplicationStatus
from app.models.resume import Resume
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationUpdate

router = APIRouter()

@router.post("/", response_model=ApplicationOut)
def apply_to_job(application_in: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can apply")
    
    existing = db.query(Application).filter(
        Application.job_id == application_in.job_id,
        Application.student_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
        
    application = Application(
        job_id=application_in.job_id,
        student_id=current_user.id,
        resume_id=application_in.resume_id if application_in.resume_id else None
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/", response_model=List[ApplicationOut])
def get_my_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Students: get their own applications. Recruiters: get all applications for their jobs."""
    if current_user.role == UserRole.STUDENT:
        apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    elif current_user.role == UserRole.RECRUITER:
        from app.models.job import Job
        recruiter_job_ids = [j.id for j in db.query(Job).filter(Job.recruiter_id == current_user.id).all()]
        apps = db.query(Application).filter(Application.job_id.in_(recruiter_job_ids)).all()
    else:
        # Admin: get all
        apps = db.query(Application).all()
    return apps

@router.get("/my-applications", response_model=List[ApplicationOut])
def get_my_applications_alt(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Not a student")
    apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    return apps

@router.get("/{app_id}/detail")
def get_application_detail(app_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Recruiter/Admin: get full details of an application including student info and resume URL."""
    if current_user.role not in (UserRole.RECRUITER, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Only recruiters/admins can view application details")

    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    student = db.query(User).filter(User.id == app.student_id).first()
    resume = db.query(Resume).filter(Resume.student_id == app.student_id).first()

    import os
    resume_filename = os.path.basename(resume.file_path) if resume else None

    return {
        "id": app.id,
        "job_id": app.job_id,
        "status": app.status,
        "student": {
            "id": student.id if student else None,
            "name": student.full_name if student else "Unknown",
            "email": student.email if student else "Unknown",
        },
        "resume": {
            "id": resume.id if resume else None,
            "filename": resume_filename,
            "download_url": f"/api/resume/download/{app.student_id}" if resume else None,
        } if resume else None,
    }

@router.put("/{app_id}/status", response_model=ApplicationOut)
def update_application_status(app_id: int, app_update: ApplicationUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (UserRole.RECRUITER, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Only recruiters/admins can update status")
        
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    application.status = app_update.status
    db.commit()
    db.refresh(application)
    return application
