import sys
import os

# Add the backend folder to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.job import Job
from app.models.application import Application, ApplicationStatus
from app.models.resume import Resume
from app.core.security import get_password_hash
import random

def seed_db():
    # Create tables if they do not exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if already seeded
    try:
        if db.query(User).first():
            print("Database already seeded. Cleaning existing database to refresh tables...")
            db.query(Application).delete()
            db.query(Resume).delete()
            db.query(Job).delete()
            db.query(User).delete()
            db.commit()
    except Exception as e:
        print(f"Error checking existing tables: {e}. Retrying with fresh recreation...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)


    print("Seeding database...")

    # 1. Create Admins
    admin_pw = get_password_hash("raju2007")
    admin1 = User(
        email="admin@careerplanet.demo",
        hashed_password=admin_pw,
        full_name="System Admin (raju2007)",
        role=UserRole.ADMIN
    )
    admin2 = User(
        email="admin",
        hashed_password=admin_pw,
        full_name="Platform Administrator",
        role=UserRole.ADMIN
    )
    db.add_all([admin1, admin2])

    # 2. Create Students
    student_pw = get_password_hash("Student@123")
    student1 = User(
        email="arjun@student.demo",
        hashed_password=student_pw,
        full_name="Arjun Patel",
        role=UserRole.STUDENT,
        bio="Final year Computer Science student specializing in Full Stack Engineering and Machine Learning. Highly skilled in React, Python, and FastAPI.",
        phone="+91 98765 43210",
        linkedin_url="https://linkedin.com/in/arjun-patel",
        github_url="https://github.com/arjunpatel"
    )
    
    student2 = User(
        email="student@careerplanet.demo",
        hashed_password=student_pw,
        full_name="Neha Sharma",
        role=UserRole.STUDENT,
        bio="UX Research & UI Design enthusiast. Passionate about creating accessible, beautiful and scalable digital products.",
        phone="+91 91234 56789",
        linkedin_url="https://linkedin.com/in/neha-sharma",
        github_url="https://github.com/nehasharma"
    )
    db.add_all([student1, student2])
    db.commit()

    # 3. Create Recruiters
    recruiter_pw = get_password_hash("Microsoft@123")
    recruiter1 = User(
        email="rahul@microsoft.demo",
        hashed_password=recruiter_pw,
        full_name="Rahul Kumar",
        role=UserRole.RECRUITER,
        company_id=1,
        company_name="Microsoft",
        company_origin="Redmond, WA",
        company_website="https://microsoft.com",
        company_logo_url="https://logo.clearbit.com/microsoft.com"
    )
    
    recruiter2 = User(
        email="recruiter@careerplanet.demo",
        hashed_password=recruiter_pw,
        full_name="Sarah Jenkins",
        role=UserRole.RECRUITER,
        company_id=2,
        company_name="Google",
        company_origin="Mountain View, CA",
        company_website="https://google.com",
        company_logo_url="https://logo.clearbit.com/google.com"
    )
    db.add_all([recruiter1, recruiter2])
    db.commit()

    # 4. Create Resume analysis caches for the students
    resume1 = Resume(
        student_id=student1.id,
        file_path="uploads/resumes/arjun_resume.pdf",
        parsed_text="Arjun Patel Resume. Skills: Python, React, FastAPI, SQL, Git, JavaScript. Education: B.Tech CS.",
        is_primary=True,
        summary="Arjun is a highly competent developer with strong foundations in FastAPI, React, and database systems. His skill alignment for technology positions is excellent.",
        match_score=85,
        missing_skills="Docker, Kubernetes, AWS",
        recommendations="Add experience with cloud infrastructure deployment (AWS/GCP); Mention containerization toolsets like Docker in project descriptions."
    )
    
    resume2 = Resume(
        student_id=student2.id,
        file_path="uploads/resumes/neha_resume.pdf",
        parsed_text="Neha Sharma. Skills: Figma, UI Design, Wireframing, User Research. Education: Design Academy.",
        is_primary=True,
        summary="Neha has a comprehensive design portfolio covering mobile UI design and accessibility audits. Strong skills in Figma and visual hierarchy.",
        match_score=90,
        missing_skills="HTML, CSS, Webflow",
        recommendations="Include links to interactive prototypes in your portfolio; Describe collaborative handoffs with engineering teams."
    )
    db.add_all([resume1, resume2])
    db.commit()

    # Mark user resume_urls
    student1.resume_url = f"/api/resume/download/{student1.id}"
    student2.resume_url = f"/api/resume/download/{student2.id}"
    db.commit()

    # 5. Create Jobs
    jobs = [
        Job(
            title="Software Development Engineer (SDE-1)",
            description="Join our team at Microsoft to build next-generation cloud platforms and web portals. Looking for strong fundamentals in frontend development.",
            location="Hyderabad, India",
            job_type="Full Time",
            salary="₹18 LPA",
            skills="React, JavaScript, CSS, Git",
            company_name="Microsoft",
            company_id=1,
            recruiter_id=recruiter1.id
        ),
        Job(
            title="AI/ML Engineer Intern",
            description="Work closely with Google researchers to design, train, and test models in natural language processing and recommendation systems.",
            location="Remote",
            job_type="Internship",
            salary="₹60,000/mo",
            skills="Python, SQL, PyTorch",
            company_name="Google",
            company_id=2,
            recruiter_id=recruiter2.id
        )
    ]
    db.add_all(jobs)
    db.commit()

    # 6. Create Applications
    app1 = Application(
        job_id=jobs[0].id,
        student_id=student1.id,
        resume_id=resume1.id,
        status=ApplicationStatus.PENDING,
        application_email_sent=True,
        cover_letter="Hi, I am highly interested in the SDE-1 position at Microsoft. I have strong experience in React and FastAPI."
    )
    
    app2 = Application(
        job_id=jobs[1].id,
        student_id=student2.id,
        resume_id=resume2.id,
        status=ApplicationStatus.SHORTLISTED,
        application_email_sent=True,
        shortlist_email_sent=True,
        cover_letter="I am very excited about the AI/ML Intern position at Google. My experience with PyTorch and NLP models aligns perfectly.",
        recruiter_message="Hi Neha, your profile looks great! We would like to move forward with the next steps."
    )
    db.add_all([app1, app2])
    db.commit()

    print("Database successfully seeded with realistic competition-ready demo data!")
    db.close()

if __name__ == "__main__":
    seed_db()
