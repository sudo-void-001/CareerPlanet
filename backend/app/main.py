import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, jobs, applications, resume, admin, ai
from app.core.database import engine, Base
from dotenv import load_dotenv

load_dotenv()

# Create all database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Planet API", version="1.0.0", docs_url="/docs")

# Dynamic CORS configuration for local development and Render/Vercel production
origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if origins_env.strip() == "*":
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Career Planet API", "status": "ok"}

# UptimeRobot and Render Health Check Endpoint
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
