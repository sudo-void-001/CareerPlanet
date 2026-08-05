from typing import List
import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.application import Application, ApplicationStatus
from app.models.resume import Resume
from app.models.job import Job
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationUpdate

logger = logging.getLogger(__name__)
router = APIRouter()


def _get_resume_download_url(student_id: int) -> str:
    return f"/api/resume/download/{student_id}"


@router.post("/", response_model=ApplicationOut)
def apply_to_job(
    application_in: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can apply")

    # Prevent duplicate applications
    existing = db.query(Application).filter(
        Application.job_id == application_in.job_id,
        Application.student_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    application = Application(
        job_id=application_in.job_id,
        student_id=current_user.id,
        resume_id=application_in.resume_id if application_in.resume_id else None,
        cover_letter=application_in.cover_letter
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # Queue recruiter notification email in background
    background_tasks.add_task(
        _send_application_email_task,
        app_id=application.id,
        student_id=current_user.id,
    )

    return application


def _send_application_email_task(app_id: int, student_id: int):
    """Background task: send application email to recruiter."""
    from app.core.database import SessionLocal
    from app.api.email_service import send_application_email

    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app or app.application_email_sent:
            return  # Prevent duplicate sends

        student = db.query(User).filter(User.id == app.student_id).first()
        job = db.query(Job).filter(Job.id == app.job_id).first()
        recruiter = db.query(User).filter(User.id == job.recruiter_id).first() if job else None
        resume = db.query(Resume).filter(Resume.student_id == app.student_id).first()

        if not all([student, job, recruiter]):
            logger.warning(f"Missing data for app {app_id}: student={student}, job={job}, recruiter={recruiter}")
            return

        success = send_application_email(
            recruiter_email=recruiter.email,
            recruiter_name=recruiter.full_name,
            student_name=student.full_name,
            student_email=student.email,
            job_title=job.title,
            company_name=job.company_name or recruiter.company_name or "Company",
            resume_download_url=_get_resume_download_url(student.id),
            ai_summary=resume.summary if resume else "",
            match_score=resume.match_score or 0 if resume else 0,
            matched_skills=resume.missing_skills or "" if resume else "",
            missing_skills=resume.missing_skills or "" if resume else "",
            recommendations=resume.recommendations if resume else "",
            cover_letter=app.cover_letter
        )

        if success:
            app.application_email_sent = True
            db.commit()

    except Exception as e:
        logger.error(f"Error sending application email for app {app_id}: {e}")
    finally:
        db.close()


@router.get("/", response_model=List[ApplicationOut])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Students: get their own applications. Recruiters: get all applications for their jobs."""
    if current_user.role == UserRole.STUDENT:
        apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    elif current_user.role == UserRole.RECRUITER:
        recruiter_job_ids = [j.id for j in db.query(Job).filter(Job.recruiter_id == current_user.id).all()]
        apps = db.query(Application).filter(Application.job_id.in_(recruiter_job_ids)).all()
    else:
        # Admin: get all
        apps = db.query(Application).all()
    return apps


@router.get("/my-applications", response_model=List[ApplicationOut])
def get_my_applications_alt(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Not a student")
    apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    return apps


@router.get("/{app_id}/detail")
def get_application_detail(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Recruiter/Admin: get full details of an application."""
    if current_user.role not in (UserRole.RECRUITER, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Only recruiters/admins can view details")

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
        "applied_at": app.applied_at,
        "application_email_sent": app.application_email_sent,
        "shortlist_email_sent": app.shortlist_email_sent,
        "interview_email_sent": app.interview_email_sent,
        "selection_email_sent": app.selection_email_sent,
        "rejection_email_sent": app.rejection_email_sent,
        "cover_letter": app.cover_letter,
        "recruiter_message": app.recruiter_message,
        "student": {
            "id": student.id if student else None,
            "name": student.full_name if student else "Unknown",
            "email": student.email if student else "Unknown",
            "bio": student.bio if student else None,
        },
        "ai_analysis": {
            "summary": resume.summary if resume else None,
            "match_score": resume.match_score if resume else None,
            "missing_skills": resume.missing_skills if resume else None,
            "recommendations": resume.recommendations if resume else None,
        } if resume else None,
        "resume": {
            "id": resume.id if resume else None,
            "filename": resume_filename,
            "download_url": _get_resume_download_url(app.student_id) if resume else None,
        } if resume else None,
    }


@router.put("/{app_id}/status", response_model=ApplicationOut)
def update_application_status(
    app_id: int,
    app_update: ApplicationUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in (UserRole.RECRUITER, UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Only recruiters/admins can update status")

    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = application.status
    application.status = app_update.status
    
    if app_update.recruiter_message:
        application.recruiter_message = app_update.recruiter_message
        
    db.commit()
    db.refresh(application)

    # Queue appropriate email notification if status changed
    if app_update.status != old_status:
        background_tasks.add_task(
            _send_status_email_task,
            app_id=app_id,
            new_status=app_update.status.value
        )
        
    # Send custom message email if recruiter_message was provided
    if app_update.recruiter_message:
        background_tasks.add_task(
            _send_custom_message_task,
            app_id=app_id,
            message=app_update.recruiter_message
        )

    return application


def _send_status_email_task(app_id: int, new_status: str):
    """Background task: send status-change email to student."""
    from app.core.database import SessionLocal
    from app.api.email_service import (
        send_shortlist_email, send_interview_email,
        send_selection_email, send_rejection_email
    )

    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            return

        student = db.query(User).filter(User.id == app.student_id).first()
        job = db.query(Job).filter(Job.id == app.job_id).first()
        recruiter = db.query(User).filter(User.id == job.recruiter_id).first() if job else None

        if not all([student, job]):
            return

        recruiter_name = recruiter.full_name if recruiter else "The Hiring Team"
        company_name = (job.company_name or (recruiter.company_name if recruiter else "") or "Company")

        if new_status == "shortlisted" and not app.shortlist_email_sent:
            success = send_shortlist_email(
                student_email=student.email,
                student_name=student.full_name,
                job_title=job.title,
                company_name=company_name,
                recruiter_name=recruiter_name
            )
            if success:
                app.shortlist_email_sent = True

        elif new_status == "interview" and not app.interview_email_sent:
            success = send_interview_email(
                student_email=student.email,
                student_name=student.full_name,
                job_title=job.title,
                company_name=company_name,
                recruiter_name=recruiter_name
            )
            if success:
                app.interview_email_sent = True

        elif new_status in ("selected", "hired") and not app.selection_email_sent:
            success = send_selection_email(
                student_email=student.email,
                student_name=student.full_name,
                job_title=job.title,
                company_name=company_name,
                recruiter_name=recruiter_name
            )
            if success:
                app.selection_email_sent = True

        elif new_status == "rejected" and not app.rejection_email_sent:
            success = send_rejection_email(
                student_email=student.email,
                student_name=student.full_name,
                job_title=job.title,
                company_name=company_name
            )
            if success:
                app.rejection_email_sent = True

        db.commit()

    except Exception as e:
        logger.error(f"Error sending status email for app {app_id} ({new_status}): {e}")
        db.close()

def _send_custom_message_task(app_id: int, message: str):
    """Background task: send custom message email to student."""
    from app.core.database import SessionLocal
    from app.api.email_service import send_custom_message_email

    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            return

        student = db.query(User).filter(User.id == app.student_id).first()
        job = db.query(Job).filter(Job.id == app.job_id).first()
        recruiter = db.query(User).filter(User.id == job.recruiter_id).first() if job else None

        if not all([student, job]):
            return

        recruiter_name = recruiter.full_name if recruiter else "The Hiring Team"
        company_name = (job.company_name or (recruiter.company_name if recruiter else "") or "Company")

        send_custom_message_email(
            student_email=student.email,
            student_name=student.full_name,
            job_title=job.title,
            company_name=company_name,
            recruiter_name=recruiter_name,
            recruiter_message=message
        )

    except Exception as e:
        logger.error(f"Error sending custom message email for app {app_id}: {e}")
    finally:
        db.close()
