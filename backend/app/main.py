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
from urllib.parse import urlparse

origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if origins_env.strip() == "*":
    ALLOWED_ORIGINS = ["*"]
    allow_creds = False
else:
    raw_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
    ALLOWED_ORIGINS = []
    for origin in raw_origins:
        if origin == "*":
            ALLOWED_ORIGINS.append("*")
            continue
        # Standardize origin to scheme://netloc (no trailing slashes or subpaths like /api)
        parsed = urlparse(origin)
        if parsed.scheme and parsed.netloc:
            ALLOWED_ORIGINS.append(f"{parsed.scheme}://{parsed.netloc}")
        else:
            # Fallback string manipulation
            clean = origin.rstrip("/")
            if "/api" in clean:
                clean = clean.split("/api")[0]
            ALLOWED_ORIGINS.append(clean)
    
    ALLOWED_ORIGINS = list(set(ALLOWED_ORIGINS))
    allow_creds = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=allow_creds,
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
