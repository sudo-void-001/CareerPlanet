from datetime import timedelta
import os, shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.user import User, UserRole
from app.schemas.auth import UserCreate, UserOut, Token, RecruiterProfileUpdate, StudentProfileUpdate

router = APIRouter()

AVATAR_DIR = "uploads/avatars"
LOGO_DIR = "uploads/logos"
os.makedirs(AVATAR_DIR, exist_ok=True)
os.makedirs(LOGO_DIR, exist_ok=True)

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="The user with this email already exists in the system.")
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        company_id=user_in.company_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from app.models.resume import Resume

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    current_user.resume_url = f"/api/resume/download/{current_user.id}" if resume else None
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(profile: RecruiterProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.RECRUITER:
        raise HTTPException(status_code=403, detail="Only recruiters can update company profile")
    current_user.company_name = profile.company_name
    current_user.company_origin = profile.company_origin
    current_user.company_website = profile.company_website
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/profile/student", response_model=UserOut)
def update_student_profile(profile: StudentProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Student updates their bio, phone, social links."""
    current_user.bio = profile.bio
    current_user.phone = profile.phone
    current_user.linkedin_url = profile.linkedin_url
    current_user.github_url = profile.github_url
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/upload-avatar", response_model=UserOut)
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Upload profile picture for any user (student or recruiter)."""
    allowed = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Only image files are allowed (jpg, png, webp)")
    file_path = os.path.join(AVATAR_DIR, f"avatar_{current_user.id}{ext}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    current_user.avatar_url = f"/api/auth/avatar/{current_user.id}{ext}"
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/avatar/{filename}")
def get_avatar(filename: str):
    """Serve avatar image file."""
    file_path = os.path.join(AVATAR_DIR, f"avatar_{filename}")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Avatar not found")
    return FileResponse(file_path)

@router.post("/upload-company-logo", response_model=UserOut)
def upload_company_logo(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Upload company logo for recruiters."""
    if current_user.role != UserRole.RECRUITER:
        raise HTTPException(status_code=403, detail="Only recruiters can upload a company logo")
    allowed = {'.jpg', '.jpeg', '.png', '.webp', '.svg'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    file_path = os.path.join(LOGO_DIR, f"logo_{current_user.id}{ext}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    current_user.company_logo_url = f"/api/auth/logo/{current_user.id}{ext}"
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/logo/{filename}")
def get_logo(filename: str):
    """Serve company logo image file."""
    file_path = os.path.join(LOGO_DIR, f"logo_{filename}")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Logo not found")
    return FileResponse(file_path)
