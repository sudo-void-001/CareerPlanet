import sys
import os

# Add the backend folder to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.job import Job
from app.models.application import Application, ApplicationStatus
from app.core.security import get_password_hash
import random

def seed_db():
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(User).first():
        print("Database already seeded.")
        return

    password = get_password_hash("password123")

    # 1. Create Admin
    admin = User(email="admin@careerplanet.com", hashed_password=password, full_name="System Admin", role=UserRole.ADMIN)
    db.add(admin)

    # 2. Create 5 Recruiters
    recruiters = []
    for i in range(1, 6):
        r = User(email=f"recruiter{i}@company{i}.com", hashed_password=password, full_name=f"Recruiter {i}", role=UserRole.RECRUITER, company_id=i)
        db.add(r)
        recruiters.append(r)

    # 3. Create 5 Students
    students = []
    for i in range(1, 6):
        s = User(email=f"student{i}@university.edu", hashed_password=password, full_name=f"Student {i}", role=UserRole.STUDENT)
        db.add(s)
        students.append(s)

    db.commit()

    # 4. Create 5 Jobs (1 per recruiter)
    titles = ["Frontend Engineer", "Data Scientist", "Product Manager", "Backend Developer", "UI/UX Designer"]
    jobs = []
    for i, r in enumerate(recruiters):
        job = Job(
            title=titles[i],
            description=f"We are looking for a talented {titles[i]} to join our team.",
            location="Remote" if i % 2 == 0 else "New York, NY",
            job_type="Full-time" if i != 4 else "Internship",
            company_id=r.company_id,
            recruiter_id=r.id
        )
        db.add(job)
        jobs.append(job)
    
    db.commit()

    # 5. Create 15 Applications
    statuses = [ApplicationStatus.PENDING, ApplicationStatus.REVIEWING, ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.HIRED]
    for i in range(15):
        student = random.choice(students)
        job = random.choice(jobs)
        
        # Check if already applied to this job
        exists = db.query(Application).filter(Application.student_id == student.id, Application.job_id == job.id).first()
        if exists:
            continue
            
        status = random.choice(statuses)
        # Ensure only 1 hired (just probabilistically making it rare or explicitly handling)
        if status == ApplicationStatus.HIRED:
            status = ApplicationStatus.SHORTLISTED # downgrade randomly to keep Hired rare

        app = Application(
            job_id=job.id,
            student_id=student.id,
            resume_id=random.randint(1, 5), # mock resume id
            status=status
        )
        db.add(app)
    
    # Explicitly make 1 hired
    hired_app = Application(
        job_id=jobs[0].id,
        student_id=students[0].id,
        resume_id=1,
        status=ApplicationStatus.HIRED
    )
    db.add(hired_app)

    db.commit()
    print("Database seeded successfully with Demo Data (5 Students, 5 Recruiters, 5 Jobs, ~15 Applications)!")
    db.close()

if __name__ == "__main__":
    seed_db()
