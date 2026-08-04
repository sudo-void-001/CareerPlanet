from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.auth import UserOut
from app.core.security import get_password_hash
from typing import List

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can perform this action")
    return current_user

@router.post("/create-first-admin", response_model=UserOut)
def create_first_admin(db: Session = Depends(get_db)):
    """Create the first admin user (admin@careerplanet.demo / raju2007) if no admin currently exists."""
    admin_exists = db.query(User).filter(User.role == UserRole.ADMIN).first()
    if admin_exists:
        raise HTTPException(status_code=400, detail="An admin user already exists on this platform.")
    
    admin_email = "admin@careerplanet.demo"
    new_admin = User(
        email=admin_email,
        full_name="Admin User",
        hashed_password=get_password_hash("raju2007"),
        role=UserRole.ADMIN,
        is_active=True
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """List all users (students and recruiters) except admins."""
    users = db.query(User).filter(User.role != UserRole.ADMIN).all()
    return users

@router.put("/users/{user_id}/status", response_model=UserOut)
def update_user_status(user_id: int, is_active: bool, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """Freeze (deactivate) or unfreeze a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == UserRole.ADMIN:
        raise HTTPException(status_code=400, detail="Cannot freeze an admin account")
    
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """Permanently remove a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == UserRole.ADMIN:
        raise HTTPException(status_code=400, detail="Cannot delete an admin account")
    
    db.delete(user)
    db.commit()
    return {"detail": f"User {user_id} deleted"}
