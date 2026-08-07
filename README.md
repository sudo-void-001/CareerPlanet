# Career Planet  🚀

An AI-powered job and placement portal built for the **WebVerse Hackathon**.
Transforming the traditional job application process into an intelligent, seamless, and premium experience.

## ✨ Premium Features

- **AI Career Assistant:** A floating, context-aware AI widget that provides job recommendations, auto-generates cover letters, conducts interview prep, and runs skill gap analysis.
- **Smart Job Matching:** AI-driven matching algorithm that scores a student's skills against job requirements (0-100%).
- **AI Resume Health Checker:** Upload a resume to receive an instant ATS score, strength analysis, and actionable recommendations.
- **Role-Based Portals:**
  - **Student Portal:** Dynamic job board, one-click application processing, and application tracking.
  - **Recruiter Dashboard:** Complete pipeline management with real-time status updates (Pending → Hired).
  - **Admin Dashboard:** Platform-wide analytics with funnel visualization and job type breakdowns.
- **Premium UI/UX:** Built with React, Vite, Framer Motion, and a highly polished custom glassmorphism design system. 

## 🛠 Tech Stack

**Frontend:**
- React 18 (Vite)
- Framer Motion (Animations)
- React Router (Routing)
- Axios (API Client)
- Vanilla CSS + Custom Design System

**Backend:**
- Python 3 + FastAPI
- SQLAlchemy (ORM) + SQLite (Database)
- Pydantic (Schema Validation)
- JWT (JSON Web Tokens) for Authentication
- Bcrypt (Password Hashing)
- Python-Multipart (File Handling)

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Note: The SQLite database (`careerverse.db`) will auto-initialize on the first run.*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*The app will be running at `http://localhost:5173`.*

## 🧪 Demo Accounts
You can register your own account or use the pre-configured quick-fill demo buttons on the Login page:
- **Student:** `arjun@student.demo`
- **Recruiter:** `rahul@microsoft.demo`
- **Admin:** `admin@careerplanet.demo`

## 📁 Project Structure
```text
CarrerVerse/
├── backend/
│   ├── app/
│   │   ├── api/          # Routers (auth, jobs, applications, resume)
│   │   ├── core/         # DB config, Auth dependencies
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic models
│   │   └── main.py       # FastAPI application entry point
│   ├── uploads/          # Student resume storage
│   └── requirements.txt
└── frontend/
    ├── public/
    └── src/
        ├── api/          # Axios interceptors 
        ├── components/   # Navbar, UI primitives, AIAssistant
        ├── pages/
        │   ├── admin/    # AdminDashboard
        │   ├── auth/     # Login, Register
        │   ├── public/   # Landing
        │   ├── recruiter/# Recruiter Dashboard
        │   └── student/  # Jobs, Applications, Resume, Onboarding
        └── App.jsx       # Routing logic
```

## 🎯 Built for WebVerse Hackathon
This project focuses on Innovation, UI/UX, and Technical Implementation.
