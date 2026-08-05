import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, jobs, applications, resume, admin, ai
from app.core.database import engine, Base
from dotenv import load_dotenv

load_dotenv()

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Planet API", version="1.0.0", docs_url="/docs")

# Dynamic CORS: reads from env for production, defaults to localhost for dev
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Career Planet API"}
