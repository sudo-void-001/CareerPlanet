> **CRITICAL NOTE:** This blueprint has been overridden by the [SCOPE_OPTIMIZATION_GUIDE.md](./SCOPE_OPTIMIZATION_GUIDE.md). Please ignore any features, files, or complexities (like Redis, WebSockets, advanced charts, about/contact pages, etc.) that are listed under the REMOVE sections of the optimization guide. The focus is strictly on a 3-day MVP development.

# BACKEND_BLUEPRINT.md
## Career Planet — AI-Powered Job & College Placement Portal
### Version 2.0 | Strictly follows PROJECT_STRUCTURE.txt

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Environment Files](#2-environment-files)
3. [Database Architecture](#3-database-architecture)
4. [Models](#4-models)
5. [Schemas](#5-schemas)
6. [Core Layer](#6-core-layer)
7. [Services](#7-services)
8. [API Modules](#8-api-modules)
9. [Utilities](#9-utilities)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [AI Integration — Groq](#11-ai-integration--groq)
12. [Email Service — Resend](#12-email-service--resend)
13. [Storage — Supabase](#13-storage--supabase)
14. [Error Handling & Logging](#14-error-handling--logging)
15. [Deployment — Render](#15-deployment--render)
16. [Development Priorities & Hours](#16-development-priorities--hours)

---

## 1. Folder Structure

This is the **exact and final** backend structure. No additional folders or files beyond this.

```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, CORS, middleware, router registration
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py              # /auth/* routes + controllers
│   │   ├── jobs.py              # /jobs/* routes + controllers
│   │   ├── applications.py      # /applications/* routes + controllers
│   │   ├── resume.py            # /resumes/* routes + controllers
│   │   ├── ai.py                # /ai/* routes + controllers
│   │   └── admin.py             # /admin/* routes + controllers
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py              # User model (all roles, profiles embedded)
│   │   ├── company.py           # Company model
│   │   ├── job.py               # Job model
│   │   ├── application.py       # Application model
│   │   └── resume.py            # Resume + AIAnalysis models
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py              # RegisterRequest, LoginRequest, TokenResponse, UserOut
│   │   ├── job.py               # JobCreate, JobOut, JobUpdate, JobSearch
│   │   ├── application.py       # ApplicationCreate, ApplicationOut, StatusUpdate
│   │   ├── resume.py            # ResumeOut, AIAnalysisOut, AnalysisRequest
│   │   └── company.py           # CompanyCreate, CompanyOut, CompanyUpdate
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py              # register, login, token creation
│   │   ├── jobs.py              # job CRUD, search, filter, pagination
│   │   ├── applications.py      # apply, list, status update
│   │   ├── resume.py            # upload, delete, signed URL, storage ops
│   │   ├── ai.py                # Groq analysis, PDF extraction, scoring
│   │   ├── email.py             # Resend transactional emails
│   │   └── admin.py             # platform stats, user management
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # pydantic-settings, all env vars
│   │   ├── database.py          # SQLAlchemy engine, session, Base
│   │   ├── security.py          # bcrypt hashing, JWT encode/decode
│   │   └── dependencies.py      # get_db(), get_current_user(), role guards
│   │
│   └── utils/
│       ├── __init__.py
│       ├── helpers.py           # pagination builder, response wrapper, file validation
│       └── constants.py         # enums: Role, JobType, AppStatus, CompanySize
│
├── uploads/                     # local temp storage only (not used in prod — Supabase handles it)
│
├── migrations/
│   ├── env.py                   # Alembic env config
│   ├── script.py.mako
│   └── versions/                # auto-generated migration files
│
├── requirements.txt
├── alembic.ini
├── .env                         # actual secrets (gitignored)
└── .env.example                 # committed template
```

### Architectural Notes

- **api/ files combine routes + controllers.** No separate controller layer. Each `api/*.py` defines the FastAPI router and the request-handler functions directly. Business logic lives in `services/`.
- **models/ has 5 files.** StudentProfile and RecruiterProfile fields are stored directly on the `User` model using nullable columns — no separate profile tables needed for 3-day build.
- **utils/ has 2 files.** `helpers.py` covers pagination, response shaping, and file validation. `constants.py` holds all Python Enum classes.
- **No separate middleware file.** CORS, logging middleware, and security headers are all registered in `main.py`.

---

## 2. Environment Files

### `.env.example` (committed to repo)

```env
# ─── Application ────────────────────────────────────────
APP_ENV=development
APP_SECRET_KEY=your-very-long-random-secret-key-here
APP_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7

# ─── Database ───────────────────────────────────────────
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/Career Planet

# ─── Supabase Storage ───────────────────────────────────
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
SUPABASE_RESUME_BUCKET=resumes
SUPABASE_LOGO_BUCKET=company-logos

# ─── Groq AI ────────────────────────────────────────────
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama3-70b-8192

# ─── Resend Email ───────────────────────────────────────
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@Career Planet.app
RESEND_FROM_NAME=Career Planet

# ─── CORS ───────────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:5173,https://Career Planet.vercel.app

# ─── Admin Seed ─────────────────────────────────────────
ADMIN_EMAIL=admin@Career Planet.app
ADMIN_PASSWORD=change-this-in-production
```

### `.gitignore` (backend root)

```gitignore
# Python
__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
*.egg-info/
dist/
build/
*.egg

# Virtual environments
venv/
env/
.venv/
.env/

# Environment secrets
.env

# Uploads (local temp)
uploads/*
!uploads/.gitkeep

# Database
*.db
*.sqlite3

# Alembic
migrations/versions/*.pyc

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Coverage
.coverage
htmlcov/
```

---

## 3. Database Architecture

### 3.1 Design Decisions

- **5 model files, 6 tables total.** User carries all profile fields (student and recruiter). AIAnalysis lives in `resume.py` alongside Resume — they are always used together.
- **Supabase PostgreSQL.** All tables created via Alembic migrations. No direct Supabase schema editor — migrations are the source of truth.
- **UUIDs for all PKs.** `gen_random_uuid()` server-default.

### 3.2 Entity Relationships

```
users (1) ──── (M) resumes
users (1) ──── (M) applications         [as student]
users (1) ──── (M) jobs                 [as recruiter, posted_by]
users (1) ──── (M) companies            [as recruiter, created_by]
companies (1) ──── (M) jobs
jobs (1) ──── (M) applications
resumes (1) ──── (1) ai_analyses
resumes (M) ──── (1) applications       [optional — resume used to apply]
```

### 3.3 Table Definitions

#### `users`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK, default gen_random_uuid() | |
| email | VARCHAR(255) | UNIQUE NOT NULL | |
| hashed_password | VARCHAR(255) | NOT NULL | bcrypt |
| role | VARCHAR(20) | NOT NULL | 'student','recruiter','admin' |
| is_active | BOOLEAN | default TRUE | |
| full_name | VARCHAR(100) | NOT NULL | shared field |
| phone | VARCHAR(20) | nullable | |
| bio | TEXT | nullable | |
| avatar_url | VARCHAR(500) | nullable | |
| active_resume_id | UUID | FK→resumes.id nullable | student only |
| college | VARCHAR(200) | nullable | student only |
| degree | VARCHAR(100) | nullable | student only |
| graduation_year | INTEGER | nullable | student only |
| cgpa | NUMERIC(3,2) | nullable | student only |
| skills | TEXT[] | default '{}' | student only |
| linkedin_url | VARCHAR(300) | nullable | |
| github_url | VARCHAR(300) | nullable | |
| portfolio_url | VARCHAR(300) | nullable | |
| designation | VARCHAR(100) | nullable | recruiter only |
| company_id | UUID | FK→companies.id nullable | recruiter only |
| created_at | TIMESTAMPTZ | default now() | |
| updated_at | TIMESTAMPTZ | auto-update | |

> **Why one table?** Profile data for student and recruiter has significant overlap (name, phone, bio, links). Nullable columns for role-specific fields avoid a join on every profile fetch — critical for a 3-day build.

---

#### `companies`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(200) | UNIQUE NOT NULL | |
| industry | VARCHAR(100) | nullable | |
| website | VARCHAR(300) | nullable | |
| description | TEXT | nullable | |
| logo_url | VARCHAR(500) | nullable | Supabase public URL |
| location | VARCHAR(200) | nullable | |
| size | VARCHAR(20) | nullable | startup/small/medium/large/enterprise |
| created_by | UUID | FK→users.id NOT NULL | |
| created_at | TIMESTAMPTZ | default now() | |
| updated_at | TIMESTAMPTZ | auto-update | |

---

#### `jobs`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| company_id | UUID | FK→companies.id NOT NULL | |
| posted_by | UUID | FK→users.id NOT NULL | recruiter |
| title | VARCHAR(200) | NOT NULL | |
| description | TEXT | NOT NULL | |
| requirements | TEXT | nullable | |
| responsibilities | TEXT | nullable | |
| skills_required | TEXT[] | default '{}' | |
| job_type | VARCHAR(20) | NOT NULL | full_time/part_time/internship/contract |
| location | VARCHAR(200) | nullable | |
| is_remote | BOOLEAN | default FALSE | |
| salary_min | INTEGER | nullable | INR/month |
| salary_max | INTEGER | nullable | |
| experience_min | INTEGER | default 0 | years |
| experience_max | INTEGER | nullable | |
| openings | INTEGER | default 1 | |
| deadline | DATE | nullable | |
| status | VARCHAR(20) | default 'active' | active/closed/draft |
| created_at | TIMESTAMPTZ | default now() | |
| updated_at | TIMESTAMPTZ | auto-update | |

---

#### `applications`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| job_id | UUID | FK→jobs.id NOT NULL | |
| student_id | UUID | FK→users.id NOT NULL | |
| resume_id | UUID | FK→resumes.id nullable | |
| cover_letter | TEXT | nullable | |
| status | VARCHAR(20) | default 'applied' | applied/reviewing/shortlisted/rejected/hired |
| recruiter_notes | TEXT | nullable | internal only |
| applied_at | TIMESTAMPTZ | default now() | |
| updated_at | TIMESTAMPTZ | auto-update | |
| UNIQUE(job_id, student_id) | | | no duplicate applications |

---

#### `resumes`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK→users.id NOT NULL | |
| file_name | VARCHAR(300) | NOT NULL | original name |
| file_path | VARCHAR(500) | NOT NULL | Supabase storage path |
| file_size | INTEGER | NOT NULL | bytes |
| is_primary | BOOLEAN | default FALSE | |
| uploaded_at | TIMESTAMPTZ | default now() | |

---

#### `ai_analyses`

Lives in `models/resume.py` alongside Resume.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| resume_id | UUID | FK→resumes.id UNIQUE | 1-to-1 |
| job_id | UUID | FK→jobs.id nullable | if matched to job |
| match_score | INTEGER | nullable | 0–100 |
| candidate_summary | TEXT | nullable | AI paragraph |
| strengths | TEXT[] | default '{}' | |
| missing_skills | TEXT[] | default '{}' | |
| recommendations | TEXT[] | default '{}' | |
| analyzed_at | TIMESTAMPTZ | default now() | |

---

### 3.4 Migration Order

Alembic must generate and apply migrations in this order:

```
1. users (no FK dependencies initially)
2. companies (FK: users.created_by)
3. users.company_id FK (add after companies exists)
4. jobs (FK: companies.id, users.id)
5. resumes (FK: users.id)
6. users.active_resume_id FK (add after resumes exists)
7. applications (FK: jobs.id, users.id, resumes.id)
8. ai_analyses (FK: resumes.id, jobs.id)
```

---

## 4. Models

All models in `app/models/`. Each inherits from `Base` in `core/database.py`.

### `models/user.py`

```
Class: User
Table: users
Columns: all fields from section 3.3 users table
Relationships:
  - resumes: relationship("Resume", back_populates="user", foreign_keys=[Resume.user_id])
  - applications: relationship("Application", back_populates="student", foreign_keys=[Application.student_id])
  - posted_jobs: relationship("Job", back_populates="recruiter", foreign_keys=[Job.posted_by])
  - companies: relationship("Company", back_populates="creator")
  - company: relationship("Company", foreign_keys=[User.company_id])  # recruiter's company
  - active_resume: relationship("Resume", foreign_keys=[User.active_resume_id])

SQLAlchemy Enum strings used as VARCHAR — no DB-level ENUM type (simpler migrations).
updated_at: onupdate=func.now()
```

### `models/company.py`

```
Class: Company
Table: companies
Relationships:
  - jobs: relationship("Job", back_populates="company")
  - creator: relationship("User", back_populates="companies", foreign_keys=[Company.created_by])
  - recruiters: relationship("User", back_populates="company", foreign_keys=[User.company_id])
```

### `models/job.py`

```
Class: Job
Table: jobs
Relationships:
  - company: relationship("Company", back_populates="jobs")
  - recruiter: relationship("User", back_populates="posted_jobs")
  - applications: relationship("Application", back_populates="job")
```

### `models/application.py`

```
Class: Application
Table: applications
Relationships:
  - job: relationship("Job", back_populates="applications")
  - student: relationship("User", back_populates="applications")
  - resume: relationship("Resume", back_populates="applications")
UniqueConstraint("job_id", "student_id", name="uq_application_job_student")
```

### `models/resume.py`

```
Class: Resume
Table: resumes
Relationships:
  - user: relationship("User", back_populates="resumes", foreign_keys=[Resume.user_id])
  - analysis: relationship("AIAnalysis", back_populates="resume", uselist=False)
  - applications: relationship("Application", back_populates="resume")

Class: AIAnalysis
Table: ai_analyses
Relationships:
  - resume: relationship("Resume", back_populates="analysis")
  - job: relationship("Job")
```

---

## 5. Schemas

All Pydantic v2 schemas. Each file handles request + response shapes for its domain.

### `schemas/auth.py`

```
RegisterRequest:
  email: EmailStr (required)
  password: str (min 8, validator: 1 uppercase + 1 number)
  role: Literal["student", "recruiter"] (required)
  full_name: str (min 2, max 100, required)

LoginRequest:
  email: EmailStr
  password: str

TokenResponse:
  access_token: str
  token_type: str = "bearer"

UserOut:
  id: UUID
  email: str
  role: str
  full_name: str
  is_active: bool
  is_verified: bool (if added later)
  college: str | None
  degree: str | None
  graduation_year: int | None
  cgpa: float | None
  skills: list[str]
  bio: str | None
  phone: str | None
  designation: str | None
  company_id: UUID | None
  linkedin_url: str | None
  github_url: str | None
  portfolio_url: str | None
  avatar_url: str | None
  active_resume_id: UUID | None
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)

UserUpdate:
  full_name: str | None
  phone: str | None
  bio: str | None
  college: str | None
  degree: str | None
  graduation_year: int | None (validator: 2015–2035)
  cgpa: float | None (validator: 0.0–10.0)
  skills: list[str] | None (max 20 items)
  designation: str | None
  linkedin_url: AnyHttpUrl | None
  github_url: AnyHttpUrl | None
  portfolio_url: AnyHttpUrl | None

AuthResponse:
  access_token: str
  token_type: str
  user: UserOut
```

---

### `schemas/job.py`

```
JobCreate:
  title: str (min 3, max 200, required)
  description: str (min 50, required)
  requirements: str | None
  responsibilities: str | None
  skills_required: list[str] (default [])
  job_type: str (required, one of: full_time/part_time/internship/contract)
  location: str | None
  is_remote: bool = False
  salary_min: int | None (positive)
  salary_max: int | None (>= salary_min if both set)
  experience_min: int = 0
  experience_max: int | None
  openings: int = 1 (min 1)
  deadline: date | None (must be future date)
  status: str = "active"

  @model_validator: salary_max >= salary_min if both provided
  @model_validator: deadline >= today if provided

JobUpdate:
  All fields from JobCreate but all optional

JobOut:
  id: UUID
  title: str
  description: str
  requirements: str | None
  responsibilities: str | None
  skills_required: list[str]
  job_type: str
  location: str | None
  is_remote: bool
  salary_min: int | None
  salary_max: int | None
  experience_min: int
  experience_max: int | None
  openings: int
  deadline: date | None
  status: str
  posted_by: UUID
  company_id: UUID
  company_name: str    # joined from company
  company_logo: str | None
  application_count: int | None  # populated for recruiter view
  created_at: datetime
  updated_at: datetime

  model_config = ConfigDict(from_attributes=True)

JobStatusUpdate:
  status: str (one of: active/closed/draft)

JobSearchParams: (used as Query params, not body)
  keyword: str | None
  job_type: str | None
  location: str | None
  is_remote: bool | None
  company_id: UUID | None
  salary_min: int | None
  skills: list[str] | None
  page: int = 1
  limit: int = 10 (max 50)
  sort_by: str = "created_at"
```

---

### `schemas/application.py`

```
ApplicationCreate:
  job_id: UUID (required)
  resume_id: UUID | None
  cover_letter: str | None (max 2000)

ApplicationOut:
  id: UUID
  job_id: UUID
  job_title: str        # joined
  company_name: str     # joined
  company_logo: str | None
  student_id: UUID
  student_name: str | None  # joined (recruiter view)
  resume_id: UUID | None
  cover_letter: str | None
  status: str
  applied_at: datetime
  updated_at: datetime

  model_config = ConfigDict(from_attributes=True)

StatusUpdate:
  status: str (one of: reviewing/shortlisted/rejected/hired)
  recruiter_notes: str | None (max 500)
```

---

### `schemas/resume.py`

```
ResumeOut:
  id: UUID
  user_id: UUID
  file_name: str
  file_size: int
  is_primary: bool
  uploaded_at: datetime

  model_config = ConfigDict(from_attributes=True)

ResumeURLResponse:
  url: str
  expires_in: int  # seconds

AIAnalysisRequest:
  resume_id: UUID
  job_id: UUID | None

AIAnalysisOut:
  id: UUID
  resume_id: UUID
  job_id: UUID | None
  match_score: int | None
  candidate_summary: str | None
  strengths: list[str]
  missing_skills: list[str]
  recommendations: list[str]
  analyzed_at: datetime

  model_config = ConfigDict(from_attributes=True)
```

---

### `schemas/company.py`

```
CompanyCreate:
  name: str (min 2, max 200, required)
  industry: str | None
  website: AnyHttpUrl | None
  location: str | None
  size: str | None (one of: startup/small/medium/large/enterprise)
  description: str | None (max 500)

CompanyUpdate:
  All fields from CompanyCreate, all optional

CompanyOut:
  id: UUID
  name: str
  industry: str | None
  website: str | None
  location: str | None
  size: str | None
  description: str | None
  logo_url: str | None
  created_by: UUID
  active_job_count: int | None
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)
```

---

## 6. Core Layer

### `core/config.py`

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_SECRET_KEY: str
    APP_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_RESUME_BUCKET: str = "resumes"
    SUPABASE_LOGO_BUCKET: str = "company-logos"
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama3-70b-8192"
    RESEND_API_KEY: str
    RESEND_FROM_EMAIL: str
    RESEND_FROM_NAME: str = "Career Planet"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()
```

---

### `core/database.py`

```
- Create SQLAlchemy engine from settings.DATABASE_URL
- SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
- Base = declarative_base()

get_db() generator:
  db = SessionLocal()
  try: yield db
  finally: db.close()
```

---

### `core/security.py`

```
Functions:
  hash_password(plain: str) -> str
    Uses bcrypt with rounds=12

  verify_password(plain: str, hashed: str) -> bool
    bcrypt.checkpw

  create_access_token(user: User) -> str
    payload = { sub: str(user.id), role: user.role, email: user.email, exp: now + timedelta(days) }
    return jwt.encode(payload, settings.APP_SECRET_KEY, settings.APP_ALGORITHM)

  decode_token(token: str) -> dict
    return jwt.decode(token, settings.APP_SECRET_KEY, [settings.APP_ALGORITHM])
    Raises: JWTError → caught in dependencies
```

---

### `core/dependencies.py`

```
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

get_db()
  → yields db session

get_current_user(token=Depends(oauth2_scheme), db=Depends(get_db)) -> User
  1. decode_token(token) → payload
  2. user = db.get(User, payload["sub"])
  3. if not user or not user.is_active → raise 401
  4. return user

require_student(user=Depends(get_current_user)) -> User
  if user.role != "student" → raise HTTPException(403, "Students only")
  return user

require_recruiter(user=Depends(get_current_user)) -> User
  if user.role != "recruiter" → raise HTTPException(403, "Recruiters only")
  return user

require_admin(user=Depends(get_current_user)) -> User
  if user.role != "admin" → raise HTTPException(403, "Admins only")
  return user
```

---

## 7. Services

Each service file contains pure business logic functions. They receive a db session and return data or raise HTTPException.

### `services/auth.py`

**`register(data: RegisterRequest, db) -> AuthResponse`**
1. `db.query(User).filter(User.email == data.email).first()` → if exists raise 409
2. `hash_password(data.password)`
3. `User(**data, hashed_password=hashed)` → `db.add()` → `db.commit()`
4. `create_access_token(user)` → build AuthResponse
5. `email.send_welcome(user.email, user.full_name)` — non-blocking try/except
6. Return AuthResponse

**`login(data: LoginRequest, db) -> AuthResponse`**
1. Fetch user by email → 401 if not found
2. `verify_password(data.password, user.hashed_password)` → 401 if fails
3. `if not user.is_active` → raise 403
4. Return AuthResponse with token

**`update_profile(user: User, data: UserUpdate, db) -> UserOut`**
1. Apply only non-None fields from data onto user object
2. `db.commit()` → `db.refresh(user)`
3. Return UserOut

**`set_active_resume(user: User, resume_id: UUID, db) -> UserOut`**
1. Verify resume.user_id == user.id → 403 if not
2. `user.active_resume_id = resume_id` → commit
3. Return updated UserOut

---

### `services/jobs.py`

**`create_job(data: JobCreate, recruiter: User, db) -> JobOut`**
1. If not recruiter.company_id → raise 400 "Set up a company first"
2. `Job(company_id=recruiter.company_id, posted_by=recruiter.id, **data)` → add, commit
3. Return JobOut (with company name joined)

**`search_jobs(params: JobSearchParams, db, requester_role=None) -> PaginatedResponse`**
1. Base query: `db.query(Job).join(Company)`
2. If not admin/recruiter: filter `Job.status == "active"`
3. Apply filters:
   - `keyword` → `Job.title.ilike(f"%{keyword}%") | Job.description.ilike(...)`
   - `job_type` → exact match
   - `location` → `Job.location.ilike(...)`
   - `is_remote` → exact match
   - `company_id` → exact match
   - `salary_min` → `Job.salary_min >= value`
   - `skills` → `Job.skills_required.overlap(value)` (PostgreSQL ANY)
4. `sort_by == "salary_min"` → order by salary_min DESC else created_at DESC
5. Count total → paginate with offset/limit
6. Return PaginatedResponse

**`get_job(job_id: UUID, db) -> JobOut`**
1. Fetch job with company join → 404 if not found
2. If status == "draft" and not owner → 404
3. Return JobOut

**`get_recruiter_jobs(recruiter: User, status_filter, page, limit, db) -> PaginatedResponse`**
1. Filter by `posted_by == recruiter.id`
2. Add application count per job via subquery
3. Return paginated JobOut list

**`update_job(job_id, data: JobUpdate, user: User, db) -> JobOut`**
1. Fetch job → 404 if not found
2. Verify `job.posted_by == user.id or user.role == "admin"` → 403 if not
3. Apply non-None fields → commit
4. Return updated JobOut

**`delete_job(job_id, user: User, db)`**
1. Verify ownership or admin
2. db.delete(job) → commit (cascade on applications handled by DB FK)

**`update_job_status(job_id, status: str, user: User, db) -> JobOut`**
1. Verify ownership or admin
2. `job.status = status` → commit

---

### `services/applications.py`

**`apply(data: ApplicationCreate, student: User, db) -> ApplicationOut`**
1. Fetch job → 404
2. `if job.status != "active"` → raise 400 "Job not accepting applications"
3. Existing check: `db.query(Application).filter(job_id=..., student_id=...).first()` → 409 if exists
4. Resolve resume_id: use data.resume_id if given, else student.active_resume_id → 400 if neither
5. Verify resume.user_id == student.id → 403
6. `Application(...)` → add, commit
7. `email.send_application_confirmation(student, job)` try/except
8. `email.send_new_application_alert(recruiter_email, job, student)` try/except
9. Return ApplicationOut

**`get_student_applications(student: User, status_filter, page, limit, db) -> PaginatedResponse`**
1. Query applications where student_id == student.id
2. Join job and company for title and logo
3. Apply status filter if provided
4. Order by applied_at DESC
5. Return paginated ApplicationOut

**`get_job_applications(job_id, recruiter: User, status_filter, page, limit, db) -> PaginatedResponse`**
1. Fetch job → 404
2. Verify job.posted_by == recruiter.id or admin → 403
3. Query applications for job_id, join student profile fields
4. Apply status filter, order by applied_at DESC
5. Return paginated ApplicationOut (with student_name)

**`update_status(app_id, data: StatusUpdate, recruiter: User, db) -> ApplicationOut`**
1. Fetch application → 404
2. Fetch job, verify recruiter owns it → 403
3. `application.status = data.status`
4. `if data.recruiter_notes` → set notes
5. Commit
6. `email.send_status_update(student_email, job, data.status)` try/except
7. Return ApplicationOut

---

### `services/resume.py`

**`upload_resume(file: UploadFile, user: User, db) -> ResumeOut`**
1. `validate_file(file)` from helpers.py → 400 if invalid (not PDF or > 5MB)
2. Read file bytes
3. Generate path: `f"{settings.SUPABASE_RESUME_BUCKET}/{user.id}/{uuid4()}.pdf"`
4. Supabase upload: `supabase.storage.from_(bucket).upload(path, bytes)`
5. `Resume(user_id=user.id, file_name=file.filename, file_path=path, file_size=...)` → add, commit
6. If user has no active_resume_id → set it
7. Return ResumeOut

**`get_resume_signed_url(resume_id, user: User, db) -> ResumeURLResponse`**
1. Fetch resume → 404
2. Verify resume.user_id == user.id OR (recruiter who has application access) OR admin
3. Generate: `supabase.storage.from_(bucket).create_signed_url(path, expires_in=3600)`
4. Return ResumeURLResponse

**`get_user_resumes(user: User, db) -> list[ResumeOut]`**
1. `db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.uploaded_at.desc())`
2. Return list

**`delete_resume(resume_id, user: User, db)`**
1. Fetch resume → 404
2. Verify ownership → 403
3. `supabase.storage.from_(bucket).remove([resume.file_path])` try/except
4. If user.active_resume_id == resume_id → clear it
5. db.delete(resume) → commit

---

### `services/ai.py`

**`analyze_resume(data: AIAnalysisRequest, user: User, db) -> AIAnalysisOut`**

Full flow:
1. Fetch resume → 404, verify ownership → 403
2. Get signed URL → download PDF via `httpx.get(url)`
3. Extract text: `pypdf.PdfReader(BytesIO(pdf_bytes))` → join all page texts
4. Clean text: strip excess whitespace, normalize, truncate to 6000 chars
5. If data.job_id: fetch job for title, description, skills_required
6. Build prompt (see section 11.2)
7. `groq_client.chat.completions.create(model=settings.GROQ_MODEL, messages=[...])`
8. Strip markdown fences, `json.loads(response_text)`
9. Validate keys present, clamp match_score 0–100
10. Upsert AIAnalysis (update if resume_id already has one)
11. Return AIAnalysisOut

**`get_analysis(resume_id, user: User, db) -> AIAnalysisOut`**
1. Fetch resume → 404, verify ownership (or recruiter/admin with access)
2. Fetch ai_analyses where resume_id == resume_id → 404 if not analyzed
3. Return AIAnalysisOut

---

### `services/admin.py`

**`get_stats(db) -> dict`**
```
Returns:
  total_users:              COUNT(users)
  total_students:           COUNT(users WHERE role='student')
  total_recruiters:         COUNT(users WHERE role='recruiter')
  total_companies:          COUNT(companies)
  total_jobs:               COUNT(jobs)
  active_jobs:              COUNT(jobs WHERE status='active')
  total_applications:       COUNT(applications)
  applications_by_status:   GROUP BY status on applications
  jobs_by_type:             GROUP BY job_type on jobs
  signups_last_7_days:      SELECT DATE(created_at), COUNT per day for last 7 days
  hired_count:              COUNT(applications WHERE status='hired')
```

**`list_users(role, is_active, search, page, limit, db) -> PaginatedResponse`**
1. Base query on users
2. Apply filters: role, is_active, search (email ILIKE OR full_name ILIKE)
3. Order by created_at DESC
4. Return paginated UserOut

**`toggle_user_active(user_id, db) -> UserOut`**
1. Fetch user → 404
2. `user.is_active = not user.is_active` → commit
3. Return UserOut

---

### `services/email.py`

All functions: non-fatal. Wrapped in try/except. Failures logged, never raise.

```python
import resend
# resend.api_key set at module load from settings

def send_welcome(to_email: str, name: str):
    resend.Emails.send({
        "from": f"{settings.RESEND_FROM_NAME} <{settings.RESEND_FROM_EMAIL}>",
        "to": [to_email],
        "subject": "Welcome to Career Planet 🚀",
        "html": _welcome_template(name)
    })

def send_application_confirmation(to_email: str, name: str, job_title: str, company: str):
    # Subject: "Application Received — {job_title} at {company}"

def send_new_application_alert(to_email: str, recruiter_name: str, job_title: str, student_name: str):
    # Subject: "New Application — {job_title}"

def send_status_update(to_email: str, name: str, job_title: str, company: str, status: str):
    # Subject: "Application Update — {company}"
    # Body varies by status: Shortlisted (positive), Rejected (encouraging), Hired (celebratory)
```

HTML templates: Inline strings. Plain branded layout. Dark background, accent blue CTA button.

---

## 8. API Modules

Each file in `app/api/` contains:
- One `APIRouter` instance
- All route handler functions for that domain
- Route handlers call services, return response envelope

All routers registered in `main.py` with prefix `/api`.

### Response Envelope (defined in `utils/helpers.py`)

```python
def success(data, message="OK", pagination=None):
    resp = {"success": True, "data": data, "message": message}
    if pagination: resp["pagination"] = pagination
    return resp

def error(code: str, message: str, status: int):
    raise HTTPException(status_code=status, detail={"error": code, "message": message})
```

---

### `api/auth.py`

Router prefix: `/api/auth`

---

#### `POST /api/auth/register`

| Field | Value |
|---|---|
| Permission | Public |
| Rate Limit | 5/min per IP (slowapi) |
| Request Body | RegisterRequest |
| Success | 201 → AuthResponse |
| Errors | 409 EMAIL_EXISTS, 422 validation |
| DB Tables | users |
| Side Effects | welcome email |
| Hours | 1h |
| Priority | P0 |

---

#### `POST /api/auth/login`

| Field | Value |
|---|---|
| Permission | Public |
| Rate Limit | 10/min per IP |
| Request Body | LoginRequest |
| Success | 200 → AuthResponse |
| Errors | 401 INVALID_CREDENTIALS, 403 ACCOUNT_DISABLED |
| Hours | 0.5h |
| Priority | P0 |

---

#### `GET /api/auth/me`

| Field | Value |
|---|---|
| Permission | Authenticated |
| Success | 200 → UserOut |
| Errors | 401 UNAUTHORIZED |
| Hours | 0.5h |
| Priority | P0 |

---

#### `PUT /api/auth/profile`

| Field | Value |
|---|---|
| Permission | Authenticated (any role) |
| Request Body | UserUpdate (all optional) |
| Success | 200 → UserOut |
| Errors | 422 validation |
| Hours | 1h |
| Priority | P1 |

**Note:** Both student and recruiter profiles are updated through this single endpoint since all fields live on the `users` table.

---

#### `PATCH /api/auth/active-resume`

| Field | Value |
|---|---|
| Permission | Student |
| Request Body | `{ "resume_id": "uuid" }` |
| Success | 200 → UserOut |
| Errors | 404, 403 |
| Hours | 0.25h |
| Priority | P2 |

---

#### `PATCH /api/auth/company`

| Field | Value |
|---|---|
| Permission | Recruiter |
| Request Body | `{ "company_id": "uuid" }` |
| Success | 200 → UserOut |
| Errors | 404 company not found |
| Hours | 0.25h |
| Priority | P1 |

---

### `api/jobs.py`

Router prefix: `/api/jobs`

---

#### `POST /api/jobs`

| Field | Value |
|---|---|
| Permission | Recruiter |
| Request Body | JobCreate |
| Success | 201 → JobOut |
| Errors | 400 NO_COMPANY, 422 |
| DB Tables | jobs |
| Hours | 1.5h |
| Priority | P0 |

---

#### `GET /api/jobs`

| Field | Value |
|---|---|
| Permission | Public |
| Query Params | keyword, job_type, location, is_remote, company_id, salary_min, skills[], page, limit, sort_by |
| Success | 200 → PaginatedResponse[JobOut] |
| Hours | 2h |
| Priority | P0 |

---

#### `GET /api/jobs/mine`

| Field | Value |
|---|---|
| Permission | Recruiter |
| Query Params | status, page, limit |
| Success | 200 → PaginatedResponse[JobOut] (with application_count) |
| Hours | 0.5h |
| Priority | P1 |

---

#### `GET /api/jobs/{job_id}`

| Field | Value |
|---|---|
| Permission | Public |
| Success | 200 → JobOut |
| Errors | 404 |
| Hours | 0.5h |
| Priority | P0 |

---

#### `PUT /api/jobs/{job_id}`

| Field | Value |
|---|---|
| Permission | Recruiter (owner), Admin |
| Request Body | JobUpdate |
| Success | 200 → JobOut |
| Errors | 404, 403 |
| Hours | 0.5h |
| Priority | P1 |

---

#### `DELETE /api/jobs/{job_id}`

| Field | Value |
|---|---|
| Permission | Recruiter (owner), Admin |
| Success | 204 |
| Errors | 404, 403 |
| Hours | 0.5h |
| Priority | P2 |

---

#### `PATCH /api/jobs/{job_id}/status`

| Field | Value |
|---|---|
| Permission | Recruiter (owner), Admin |
| Request Body | JobStatusUpdate |
| Success | 200 → JobOut |
| Hours | 0.25h |
| Priority | P1 |

---

### `api/applications.py`

Router prefix: `/api/applications`

---

#### `POST /api/applications`

| Field | Value |
|---|---|
| Permission | Student |
| Request Body | ApplicationCreate |
| Success | 201 → ApplicationOut |
| Errors | 404 job, 409 ALREADY_APPLIED, 400 JOB_CLOSED, 400 NO_RESUME |
| Side Effects | 2 emails |
| Hours | 1.5h |
| Priority | P0 |

---

#### `GET /api/applications/mine`

| Field | Value |
|---|---|
| Permission | Student |
| Query Params | status, page, limit |
| Success | 200 → PaginatedResponse[ApplicationOut] |
| Hours | 0.5h |
| Priority | P0 |

---

#### `GET /api/applications/job/{job_id}`

| Field | Value |
|---|---|
| Permission | Recruiter (job owner), Admin |
| Query Params | status, page, limit |
| Success | 200 → PaginatedResponse[ApplicationOut] (with student_name, college) |
| Errors | 404, 403 |
| Hours | 0.5h |
| Priority | P1 |

---

#### `PATCH /api/applications/{app_id}/status`

| Field | Value |
|---|---|
| Permission | Recruiter (job owner), Admin |
| Request Body | StatusUpdate |
| Success | 200 → ApplicationOut |
| Side Effects | status update email to student |
| Hours | 0.75h |
| Priority | P1 |

---

#### `GET /api/applications/{app_id}`

| Field | Value |
|---|---|
| Permission | Student (own), Recruiter (their job), Admin |
| Success | 200 → ApplicationOut |
| Errors | 404, 403 |
| Hours | 0.25h |
| Priority | P2 |

---

### `api/resume.py`

Router prefix: `/api/resume`

---

#### `POST /api/resume/upload`

| Field | Value |
|---|---|
| Permission | Student |
| Content-Type | multipart/form-data |
| Request | `file` field |
| Validation | PDF only, ≤5MB |
| Success | 201 → ResumeOut |
| Errors | 400 INVALID_TYPE, 400 TOO_LARGE, 500 UPLOAD_FAILED |
| Hours | 1.5h |
| Priority | P0 |

---

#### `GET /api/resume`

| Field | Value |
|---|---|
| Permission | Student |
| Success | 200 → list[ResumeOut] |
| Hours | 0.25h |
| Priority | P0 |

---

#### `GET /api/resume/{resume_id}/url`

| Field | Value |
|---|---|
| Permission | Student (own), Recruiter (via application), Admin |
| Success | 200 → ResumeURLResponse (signed URL, expires_in) |
| Errors | 404, 403 |
| Hours | 0.5h |
| Priority | P1 |

---

#### `DELETE /api/resume/{resume_id}`

| Field | Value |
|---|---|
| Permission | Student (own) |
| Success | 204 |
| Errors | 404, 403 |
| Hours | 0.5h |
| Priority | P2 |

---

### `api/ai.py`

Router prefix: `/api/ai`

---

#### `POST /api/ai/analyze`

| Field | Value |
|---|---|
| Permission | Student |
| Request Body | AIAnalysisRequest |
| Success | 200 → AIAnalysisOut |
| Errors | 404 resume, 403, 502 AI_FAILED, 429 RATE_LIMITED |
| Hours | 3h |
| Priority | P1 |

---

#### `GET /api/ai/analysis/{resume_id}`

| Field | Value |
|---|---|
| Permission | Student (own), Recruiter (via app), Admin |
| Success | 200 → AIAnalysisOut |
| Errors | 404 |
| Hours | 0.25h |
| Priority | P1 |

---

### `api/admin.py`

Router prefix: `/api/admin`

---

#### `GET /api/admin/stats`

| Field | Value |
|---|---|
| Permission | Admin |
| Success | 200 → stats dict |
| Hours | 1.5h |
| Priority | P1 |

---

#### `GET /api/admin/users`

| Field | Value |
|---|---|
| Permission | Admin |
| Query Params | role, is_active, search, page, limit |
| Success | 200 → PaginatedResponse[UserOut] |
| Hours | 0.5h |
| Priority | P1 |

---

#### `PATCH /api/admin/users/{user_id}/toggle`

| Field | Value |
|---|---|
| Permission | Admin |
| Success | 200 → UserOut |
| Errors | 404 |
| Hours | 0.25h |
| Priority | P2 |

---

#### `GET /api/admin/jobs`

| Field | Value |
|---|---|
| Permission | Admin |
| Query Params | status, page, limit |
| Success | 200 → PaginatedResponse[JobOut] |
| Hours | 0.25h |
| Priority | P2 |

---

#### `DELETE /api/admin/jobs/{job_id}`

| Field | Value |
|---|---|
| Permission | Admin |
| Success | 204 |
| Hours | 0.25h |
| Priority | P2 |

---

## 9. Utilities

### `utils/helpers.py`

```
validate_file(file: UploadFile) -> None
  Checks MIME type is application/pdf
  Checks file.size <= 5_242_880 (5MB)
  Raises HTTPException 400 with appropriate code if fails

build_pagination(total: int, page: int, limit: int) -> dict
  Returns { page, limit, total, pages: ceil(total/limit) }

paginated_response(data: list, total: int, page: int, limit: int) -> dict
  Returns { success: True, data: data, pagination: build_pagination(...) }

generate_storage_path(bucket: str, user_id: str, ext: str) -> str
  Returns f"{bucket}/{user_id}/{uuid4()}.{ext}"
```

### `utils/constants.py`

```python
class Role:
    STUDENT = "student"
    RECRUITER = "recruiter"
    ADMIN = "admin"

class JobType:
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"

class AppStatus:
    APPLIED = "applied"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"

class CompanySize:
    STARTUP = "startup"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"

class JobStatus:
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"
```

---

## 10. Authentication & Authorization

### JWT Flow

```
Registration / Login
    │
    └── create_access_token(user)
            payload = { sub: user.id, role: user.role, email: user.email, exp: +7 days }
            signed with HS256 + APP_SECRET_KEY

Every Protected Request
    │
    ├── Header: Authorization: Bearer <token>
    ├── OAuth2PasswordBearer extracts token
    ├── decode_token(token) → payload
    ├── db.get(User, payload["sub"]) → user
    ├── Check is_active
    └── Return user to handler

Role Guards (Depends)
    ├── require_student  → role check
    ├── require_recruiter → role check
    └── require_admin    → role check
```

### Authorization Matrix

| Endpoint | Guest | Student | Recruiter | Admin |
|---|---|---|---|---|
| POST /auth/register | ✓ | — | — | — |
| POST /auth/login | ✓ | — | — | — |
| GET /auth/me | — | ✓ | ✓ | ✓ |
| PUT /auth/profile | — | ✓ | ✓ | ✓ |
| GET /jobs (list) | ✓ | ✓ | ✓ | ✓ |
| GET /jobs/:id | ✓ | ✓ | ✓ | ✓ |
| POST /jobs | — | — | ✓ | ✓ |
| PUT/DELETE /jobs/:id | — | — | Owner | ✓ |
| POST /applications | — | ✓ | — | — |
| GET /applications/mine | — | ✓ | — | — |
| GET /applications/job/:id | — | — | Owner | ✓ |
| PATCH /applications/:id/status | — | — | Owner | ✓ |
| POST /resume/upload | — | ✓ | — | — |
| GET /resume | — | ✓ | — | — |
| GET /resume/:id/url | — | Owner | Via app | ✓ |
| POST /ai/analyze | — | ✓ | — | — |
| GET /admin/* | — | — | — | ✓ |

---

## 11. AI Integration — Groq

### 11.1 Setup in `services/ai.py`

```python
from groq import Groq
client = Groq(api_key=settings.GROQ_API_KEY)
```

### 11.2 Prompts

**General resume analysis:**
```
System:
  You are an expert career counselor. Analyze the resume and return ONLY valid JSON.

User:
  Resume Text:
  {resume_text}

  Return exactly this JSON structure, no other text:
  {
    "candidate_summary": "2-3 sentence professional summary",
    "strengths": ["skill1", "skill2", "skill3"],
    "missing_skills": ["gap1", "gap2"],
    "recommendations": ["advice1", "advice2"],
    "match_score": 70
  }
```

**Job-match analysis:**
```
System:
  You are an expert ATS and technical recruiter.
  Compare the resume to the job and return ONLY valid JSON.

User:
  Job Title: {title}
  Job Description: {description}
  Required Skills: {skills_required}

  Resume:
  {resume_text}

  Return exactly this JSON structure, no other text:
  {
    "match_score": 78,
    "candidate_summary": "Why this candidate fits or doesn't fit this role",
    "strengths": ["matching points"],
    "missing_skills": ["gaps vs job requirements"],
    "recommendations": ["specific improvements"]
  }
```

### 11.3 PDF Text Extraction

```python
import pypdf
from io import BytesIO

def extract_pdf_text(pdf_bytes: bytes) -> str:
    reader = pypdf.PdfReader(BytesIO(pdf_bytes))
    text = " ".join(page.extract_text() or "" for page in reader.pages)
    text = " ".join(text.split())           # normalize whitespace
    return text[:6000]                       # fit in context window
```

### 11.4 Response Parsing

```python
import json, re

def parse_ai_response(raw: str) -> dict:
    # Strip markdown fences if present
    clean = re.sub(r"```json|```", "", raw).strip()
    result = json.loads(clean)
    result["match_score"] = max(0, min(100, int(result.get("match_score", 0))))
    return result
```

### 11.5 Error Handling

- JSON parse failure → raise HTTPException(502, "AI_PARSE_ERROR")
- Groq API timeout (15s) → raise HTTPException(502, "AI_TIMEOUT")
- Missing required keys → fill defaults, log warning, return partial result

---

## 12. Email Service — Resend

### Setup

```python
import resend
resend.api_key = settings.RESEND_API_KEY
```

### Template Pattern

All templates are inline HTML strings. Keep simple: white card on light background, logo text, content, one CTA button.

```python
def _base_template(content_html: str) -> str:
    return f"""
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#F1F3F9;padding:40px 32px;border-radius:12px;">
      <div style="color:#4F7EFF;font-size:24px;font-weight:700;margin-bottom:24px;">Career Planet</div>
      {content_html}
      <div style="margin-top:40px;color:#555C75;font-size:12px;">Career Planet · AI-Powered Placement Platform</div>
    </div>
    """
```

### Email Triggers

| Function | Trigger | Recipient |
|---|---|---|
| send_welcome | POST /auth/register | New user |
| send_application_confirmation | POST /applications | Student |
| send_new_application_alert | POST /applications | Recruiter |
| send_status_update | PATCH /applications/:id/status | Student |

---

## 13. Storage — Supabase

### Bucket Config

| Bucket | Access | Max Size | Types |
|---|---|---|---|
| resumes | Private (signed URLs) | 5 MB | PDF |
| company-logos | Public | 2 MB | PNG/JPG/SVG/WebP |

### Client Setup (in `services/resume.py`)

```python
from supabase import create_client
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
```

### Operations

```python
# Upload
supabase.storage.from_(bucket).upload(path, file_bytes, {"content-type": "application/pdf"})

# Signed URL (private resumes)
response = supabase.storage.from_(bucket).create_signed_url(path, 3600)
url = response["signedURL"]

# Public URL (logos)
url = supabase.storage.from_(bucket).get_public_url(path)

# Delete
supabase.storage.from_(bucket).remove([path])
```

---

## 14. Error Handling & Logging

### Global Exception Handler (in `main.py`)

```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail.get("error", "ERROR"),
                 "message": exc.detail.get("message", str(exc.detail))}
    )

@app.exception_handler(Exception)
async def generic_handler(request, exc):
    logger.error(f"Unhandled: {exc}", exc_info=True)
    return JSONResponse(status_code=500,
        content={"success": False, "error": "INTERNAL_ERROR", "message": "Something went wrong"})
```

### Logging

```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}'
)
logger = logging.getLogger("Career Planet")
```

Log in every API handler: `logger.info(f"POST /jobs — user {user.id}")`.
Log all email failures at WARNING level.
Log all AI service errors at ERROR level.

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)

# Applied on auth routes only:
@router.post("/login")
@limiter.limit("10/minute")
async def login(...): ...
```

---

## 15. Deployment — Render

### `Procfile`

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### `requirements.txt` (key packages)

```
fastapi
uvicorn[standard]
sqlalchemy
alembic
psycopg2-binary
pydantic[email]
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
python-multipart
supabase
groq
pypdf
httpx
resend
slowapi
```

### Render Checklist

1. New Web Service → connect GitHub repo → `backend/` as root dir
2. Build command: `pip install -r requirements.txt`
3. Start command: from Procfile
4. Set all env vars from `.env.example`
5. After first deploy: open Render shell → `alembic upgrade head`
6. Set `APP_ENV=production` in env vars

---

## 16. Development Priorities & Hours

### P0 — Core (Day 1)

| Task | Hours |
|---|---|
| Folder setup + config + database + Alembic | 1.5h |
| All 5 models + migration | 2h |
| core/security.py + core/dependencies.py | 1h |
| services/auth.py + api/auth.py (register, login, me) | 2h |
| schemas/auth.py + schemas/company.py | 1h |
| services/jobs.py (create, get, list) + api/jobs.py | 2h |
| **Day 1 Total** | **9.5h** |

### P1 — Features (Day 2)

| Task | Hours |
|---|---|
| Job search + filters + pagination | 2h |
| services/resume.py + api/resume.py + Supabase setup | 2h |
| schemas/application.py + services/applications.py + api/applications.py | 2h |
| services/email.py (Resend setup + all templates) | 1.5h |
| services/ai.py + api/ai.py (Groq + pypdf) | 3h |
| services/admin.py + api/admin.py (stats) | 1.5h |
| **Day 2 Total** | **12h** |

### P2 — Polish (Day 3)

| Task | Hours |
|---|---|
| Resume signed URL + delete | 0.5h |
| Admin user toggle + jobs | 0.5h |
| Company logo upload | 1h |
| Rate limiting | 0.5h |
| Error handler polish | 0.5h |
| Render deployment + env | 1.5h |
| Integration testing with frontend | 2h |
| **Day 3 Total** | **6.5h** |

**Total Backend: ~28h across 3 days**
