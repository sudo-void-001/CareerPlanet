> **CRITICAL NOTE:** This blueprint has been overridden by the [SCOPE_OPTIMIZATION_GUIDE.md](./SCOPE_OPTIMIZATION_GUIDE.md). Please ignore any features, files, or complexities (like Redis, WebSockets, advanced charts, about/contact pages, etc.) that are listed under the REMOVE sections of the optimization guide. The focus is strictly on a 3-day MVP development.

# INTEGRATION_BLUEPRINT.md
## Career Planet — AI-Powered Job & College Placement Portal
### Version 2.0 | Strictly follows PROJECT_STRUCTURE.txt

---

## Table of Contents

1. [Complete Feature Mapping](#1-complete-feature-mapping)
2. [User Journeys](#2-user-journeys)
3. [Sequence Diagrams](#3-sequence-diagrams)
4. [Flowcharts](#4-flowcharts)
5. [Module Interaction Diagram](#5-module-interaction-diagram)
6. [API Dependency Table](#6-api-dependency-table)
7. [Frontend Dependency Table](#7-frontend-dependency-table)
8. [Backend Dependency Table](#8-backend-dependency-table)
9. [Implementation Order](#9-implementation-order)
10. [3-Day Development Roadmap](#10-3-day-development-roadmap)
11. [Critical Path](#11-critical-path)
12. [Blockers & Risks](#12-blockers--risks)
13. [Parallel Development Guide](#13-parallel-development-guide)

---

## 1. Complete Feature Mapping

Every feature traced end-to-end: Page → Component → Action → API → Service → DB → Side Effect → Response → UI Update.

---

### 1.1 Authentication

| # | Feature | Page | Component | Action | API Endpoint | Service | DB Table | Side Effect | UI Update |
|---|---|---|---|---|---|---|---|---|---|
| A1 | Register Student | pages/auth/Register | Register form | Submit | POST /api/auth/register | services/auth.py: register() | users | send_welcome email | Store cv_auth → /student/dashboard |
| A2 | Register Recruiter | pages/auth/Register | Register form (recruiter role) | Submit | POST /api/auth/register | services/auth.py: register() | users | send_welcome email | Store cv_auth → /recruiter/dashboard |
| A3 | Login | pages/auth/Login | Login form | Submit | POST /api/auth/login | services/auth.py: login() | users | — | Store cv_auth → role dashboard |
| A4 | Logout | Any layout | Topbar avatar dropdown | Click Sign Out | — (client only) | — | — | — | Clear cv_auth → navigate / |
| A5 | Validate session | ProtectedRoute | ProtectedRoute component | Route change | GET /api/auth/me | auth dependency | users | — | Allow or redirect /login |
| A6 | Token expired | Any page | api/axios.js interceptor | Any API call returns 401 | — | — | — | — | Clear cv_auth → /login + toast |
| A7 | Update profile | pages/*/Profile | Profile edit form | Save | PUT /api/auth/profile | services/auth.py: update_profile() | users | — | Update stored user, toast |
| A8 | Set active resume | pages/student/Resume | ResumeCard | Click Set Primary | PATCH /api/auth/active-resume | services/auth.py: set_active_resume() | users | — | Primary badge moves |
| A9 | Link company | pages/recruiter/Company | Company create flow | After POST /companies | PATCH /api/auth/company | services/auth.py: update_profile() | users | — | user.company_id set |

---

### 1.2 Jobs

| # | Feature | Page | Component | Action | API Endpoint | Service | DB Table | Side Effect | UI Update |
|---|---|---|---|---|---|---|---|---|---|
| J1 | Browse jobs (public) | pages/public/Landing | JobCard list | Page load | GET /api/jobs?limit=3 | services/jobs.py: search_jobs() | jobs, companies | — | Cards populate |
| J2 | Full job search | pages/student/Jobs | SearchBar + FilterPanel | Type / filter change | GET /api/jobs?{params} | services/jobs.py: search_jobs() | jobs, companies | — | Cards re-render |
| J3 | Job detail | pages/public/Landing (modal) or separate route | JobCard → detail view | Click title | GET /api/jobs/:id | services/jobs.py: get_job() | jobs, companies | — | Detail shows |
| J4 | Post job | pages/recruiter/Jobs (create mode) | JobForm | Submit | POST /api/jobs | services/jobs.py: create_job() | jobs | — | Toast → back to list |
| J5 | Edit job | pages/recruiter/Jobs (edit mode) | JobForm prefilled | Submit | PUT /api/jobs/:id | services/jobs.py: update_job() | jobs | — | Toast → back to list |
| J6 | Close job | pages/recruiter/Jobs | Row action | Click Close | PATCH /api/jobs/:id/status | services/jobs.py: update_job_status() | jobs | — | Status badge → Closed |
| J7 | Delete job | pages/recruiter/Jobs | ConfirmDialog | Confirm | DELETE /api/jobs/:id | services/jobs.py: delete_job() | jobs, applications | — | Row removed |
| J8 | My jobs list | pages/recruiter/Jobs (list mode) | Jobs table | Page load | GET /api/jobs/mine | services/jobs.py: get_recruiter_jobs() | jobs | — | Table renders |
| J9 | Admin view all jobs | pages/admin/Jobs | Admin jobs table | Page load | GET /api/admin/jobs | services/admin.py | jobs, companies | — | Table renders |
| J10 | Admin delete job | pages/admin/Jobs | ConfirmDialog | Confirm | DELETE /api/admin/jobs/:id | services/jobs.py: delete_job() | jobs | — | Row removed |

---

### 1.3 Applications

| # | Feature | Page | Component | Action | API Endpoint | Service | DB Table | Emails | UI Update |
|---|---|---|---|---|---|---|---|---|---|
| AP1 | Apply to job | pages/student/Jobs | ApplyModal | Submit | POST /api/applications | services/applications.py: apply() | applications | student confirm + recruiter alert | Modal close, toast, button → "Applied" |
| AP2 | My applications | pages/student/Applications | ApplicationCard list | Page load / filter tab | GET /api/applications/mine | services/applications.py: get_student_applications() | applications, jobs | — | Cards render |
| AP3 | View applicants | pages/recruiter/Applicants | Applicants table | Page load / job select | GET /api/applications/job/:id | services/applications.py: get_job_applications() | applications, users | — | Table renders |
| AP4 | Update status | pages/recruiter/Applicants | Inline status dropdown | Change value | PATCH /api/applications/:id/status | services/applications.py: update_status() | applications | student status update | Row badge updates, toast |
| AP5 | Applicant drawer | pages/recruiter/Applicants | ApplicantDrawer | Click row | GET /api/applications/:id | services/applications.py | applications, users | — | Drawer opens with full detail |

---

### 1.4 Resume

| # | Feature | Page | Component | Action | API Endpoint | Service | DB + Storage | UI Update |
|---|---|---|---|---|---|---|---|---|
| R1 | Upload resume | pages/student/Resume | ResumeUpload | Drop/select + upload | POST /api/resume/upload | services/resume.py: upload_resume() | resumes table + Supabase Storage | Progress bar → ResumeCard added |
| R2 | List resumes | pages/student/Resume | ResumeCard list | Page load | GET /api/resume | services/resume.py: get_user_resumes() | resumes table | Cards render |
| R3 | Preview resume | pages/student/Resume or recruiter/Applicants | ResumePreview modal | Click Preview | GET /api/resume/:id/url | services/resume.py: get_resume_signed_url() | Supabase Storage (signed URL) | PDF loads in iframe |
| R4 | Delete resume | pages/student/Resume | ConfirmDialog | Confirm | DELETE /api/resume/:id | services/resume.py: delete_resume() | resumes table + Supabase Storage | Card removed, active reset if needed |
| R5 | Set primary | pages/student/Resume | ResumeCard | Click Set Primary | PATCH /api/auth/active-resume | services/auth.py | users table | Primary badge moves |

---

### 1.5 AI Analysis

| # | Feature | Page | Component | Action | API Endpoint | Service | DB | External | UI Update |
|---|---|---|---|---|---|---|---|---|---|
| AI1 | Analyze resume | pages/student/Resume | AIAnalysisPanel | Click Analyze on ResumeCard | POST /api/ai/analyze | services/ai.py: analyze_resume() | ai_analyses | Supabase (PDF download) + Groq API | Score ring animates, panel populates |
| AI2 | Analyze vs job | pages/student/Resume | AIAnalysisPanel (job toggle) | Enable toggle + select job + Analyze | POST /api/ai/analyze {resume_id, job_id} | services/ai.py: analyze_resume() | ai_analyses | Groq API | Same as AI1 with job-match score |
| AI3 | Load cached analysis | pages/student/Resume | AIAnalysisPanel | Page load (if analyzed before) | GET /api/ai/analysis/:resumeId | services/ai.py: get_analysis() | ai_analyses | — | Panel pre-filled |
| AI4 | Recruiter sees analysis | pages/recruiter/Applicants | ApplicantDrawer | Open drawer | GET /api/ai/analysis/:resumeId | services/ai.py: get_analysis() | ai_analyses | — | Score ring + summary in drawer |

---

### 1.6 Company

| # | Feature | Page | Component | Action | API Endpoint | Service | DB + Storage | UI Update |
|---|---|---|---|---|---|---|---|---|
| C1 | Create company | pages/recruiter/Company | Company form | Submit | POST /api/companies + PATCH /api/auth/company | services (no separate company service — handled in api/admin.py or inline) | companies table | Form → view mode, user.company_id set |
| C2 | Edit company | pages/recruiter/Company | Company form | Submit edit | PUT /api/companies/:id | — | companies table | Toast success, view mode |
| C3 | Upload logo | pages/recruiter/Company | Logo upload area | Select image | POST /api/companies/:id/logo | — | companies + Supabase Storage | Logo preview updates |

> **Note on Company API:** The PROJECT_STRUCTURE.txt lists 6 API modules: auth, jobs, applications, resume, ai, admin. Company management routes are minimal and co-located in `api/auth.py` (for recruiter's own company via profile) and `api/admin.py` (for admin oversight). No separate `companies.py` needed — keep within structure.

---

### 1.7 Admin

| # | Feature | Page | Component | Action | API Endpoint | Service | DB | UI Update |
|---|---|---|---|---|---|---|---|---|
| ADM1 | Platform stats | pages/admin/Dashboard | StatCards + charts | Page load | GET /api/admin/stats | services/admin.py: get_stats() | All tables | Cards + charts populate |
| ADM2 | User list | pages/admin/Users | Users table | Page load / filter | GET /api/admin/users | services/admin.py: list_users() | users | Table renders |
| ADM3 | Toggle user | pages/admin/Users | Toggle button | Click | PATCH /api/admin/users/:id/toggle | services/admin.py: toggle_user_active() | users | Status badge flips |
| ADM4 | All jobs | pages/admin/Jobs | Jobs table | Page load | GET /api/admin/jobs | services/admin.py | jobs, companies | Table renders |
| ADM5 | Delete job | pages/admin/Jobs | ConfirmDialog | Confirm | DELETE /api/admin/jobs/:id | services/jobs.py: delete_job() | jobs | Row removed |
| ADM6 | Analytics | pages/admin/Analytics | Chart components | Page load | GET /api/admin/stats | services/admin.py | All tables | Extended charts render |

---

## 2. User Journeys

### 2.1 Guest Journey

```
/ (Landing page)
    │
    ├── See hero, stats, how-it-works
    ├── See 3 featured jobs (GET /api/jobs?limit=3)
    │
    ├── [Browse Jobs →] ──────────────────────────────────────────────────────┐
    │                                                                          │
    │                                                            pages/student/Jobs (if authed)
    │                                                            or scrolls to jobs section
    │
    ├── [Get Started — Free] → /register
    │       Select role → fill form → POST /auth/register
    │       → cv_auth stored → role dashboard
    │
    ├── [Join as Student →] → /register (role pre-selected: student)
    │
    ├── [Join as Recruiter →] → /register (role pre-selected: recruiter)
    │
    └── [Sign In] → /login → credentials → role dashboard
```

---

### 2.2 Student Journey (First Time)

```
REGISTER → /student/dashboard
    │
    ├── Profile completion nudge visible (no skills/college/resume yet)
    │       └── [Complete Profile] → /student/profile
    │               ├── Fill: name, phone, college, degree, year, CGPA
    │               ├── Add skills (chip input)
    │               └── [Save Changes] → PUT /api/auth/profile → toast
    │
    ├── Upload Resume → /student/resume
    │       ├── Drag PDF → client validates → POST /api/resume/upload
    │       ├── ResumeCard appears, "Primary" badge
    │       ├── [Analyze] → POST /api/ai/analyze → Groq processes
    │       │       └── Score ring animates + summary + skills + gaps show
    │       ├── [Enable job match toggle] → select a job → [Analyze]
    │       │       └── Job-specific score + missing skills
    │       └── [Preview] → GET /api/resume/:id/url → PDF iframe
    │
    ├── Browse Jobs → /student/jobs
    │       ├── Search keyword → debounced → GET /api/jobs?keyword=X
    │       ├── Filter: type, location, remote, salary → re-fetch
    │       ├── [Apply Now] on any card → ApplyModal
    │       │       ├── Select resume (from uploaded list)
    │       │       ├── Write cover letter (optional)
    │       │       └── [Submit Application] → POST /api/applications
    │       │               └── Emails sent → modal closes → button → "Applied"
    │       └── [View Details] → job detail inline
    │
    └── Track Applications → /student/applications
            ├── See all applications with status badges
            ├── Filter by status tab
            └── Receive email when recruiter updates status
```

---

### 2.3 Returning Student Journey

```
/login → credentials → /student/dashboard
    │
    ├── Stats updated: applications count, shortlisted, hired
    ├── Recent applications table shows latest 5
    ├── Recommended jobs: 3 latest active
    │
    ├── /student/jobs → apply to more jobs
    │
    ├── /student/resume → analyze resume against new job postings
    │
    └── /student/applications → check status updates
```

---

### 2.4 Recruiter Journey (First Time)

```
REGISTER → /recruiter/dashboard
    │
    ├── No-company banner: "Set up your company first"
    │       └── [Set Up Company] → /recruiter/company
    │               ├── Fill: name, industry, location, size, description
    │               ├── [Create Company] → POST /api/companies
    │               ├── Auto-link: PATCH /api/auth/company
    │               └── Upload logo: POST /api/companies/:id/logo
    │
    ├── Post Job → /recruiter/jobs → [+ Post New Job]
    │       ├── Fill: title, description, requirements, skills, salary, type
    │       ├── Set deadline and openings
    │       └── [Publish Job] → POST /api/jobs → toast → back to list
    │
    ├── View Applicants → /recruiter/applicants?jobId={id}
    │       ├── See all candidates in table
    │       ├── Click row → ApplicantDrawer opens
    │       │       ├── View profile: name, college, skills, CGPA
    │       │       ├── [View Resume] → GET signed URL → PDF opens
    │       │       └── See AI match score (if student analyzed resume)
    │       └── Change status inline → PATCH → student email sent
    │
    └── /recruiter/profile → edit designation, phone, bio
```

---

### 2.5 Admin Journey

```
/login (admin credentials) → /admin/dashboard
    │
    ├── Platform stats:
    │       GET /api/admin/stats
    │       → 7 stat cards, 3 charts render
    │
    ├── /admin/analytics
    │       Extended charts (30-day signup, deeper breakdowns)
    │
    ├── /admin/users
    │       ├── Search by name/email
    │       ├── Filter by role / status
    │       └── Disable user → ConfirmDialog → PATCH /toggle
    │
    └── /admin/jobs
            ├── See all jobs across all recruiters
            └── Delete inappropriate job → ConfirmDialog → DELETE
```

---

### 2.6 Resume Upload Flow

```
Student on /student/resume
    │
    ├── 1. File Selection
    │       ├── Drag onto ResumeUpload zone OR click to open file picker
    │       ├── Client: file.type === 'application/pdf' → else toast error
    │       ├── Client: file.size <= 5242880 → else toast error
    │       └── Show: filename + size preview below drop zone
    │
    ├── 2. Upload Trigger
    │       └── Click Upload button OR auto-upload on valid drop
    │               → FormData with file → POST /api/resume/upload
    │               → Progress bar fills via axios onUploadProgress
    │
    ├── 3. Backend Processing
    │       ├── api/resume.py receives UploadFile
    │       ├── helpers.validate_file() → MIME + size check
    │       ├── services/resume.py: generate path (resumes/{user_id}/{uuid}.pdf)
    │       ├── supabase.storage.from_("resumes").upload(path, bytes)
    │       ├── Create Resume record in DB
    │       └── If user.active_resume_id is null → set it
    │
    ├── 4. Success Response (201)
    │       ├── ResumeOut: id, file_name, file_size, is_primary, uploaded_at
    │       ├── useResume adds to resumes list
    │       └── Toast "Resume uploaded!"
    │
    └── 5. Failure Cases
            ├── 400 INVALID_FILE_TYPE → toast "Only PDF files accepted"
            ├── 400 FILE_TOO_LARGE    → toast "File must be under 5MB"
            └── 500 UPLOAD_FAILED    → toast "Upload failed. Try again."
```

---

### 2.7 Application Submission Flow

```
Student clicks "Apply Now"
    │
    ├── 1. Guard check (client)
    │       ├── useAuth().isAuthenticated → No → navigate /login
    │       └── user.role === 'student' → No → button not rendered
    │
    ├── 2. ApplyModal opens
    │       ├── GET /api/resume (fetch student's resumes for dropdown)
    │       └── If empty → show warning with link to /student/resume
    │
    ├── 3. Fill form
    │       ├── Select resume (required)
    │       └── Cover letter (optional, max 2000 chars)
    │
    ├── 4. Submit → POST /api/applications { job_id, resume_id, cover_letter }
    │
    ├── 5. Backend
    │       ├── Fetch job → 404 if not found
    │       ├── job.status === 'active' → 400 JOB_CLOSED if not
    │       ├── Check duplicate (job_id + student_id) → 409 ALREADY_APPLIED
    │       ├── Verify resume.user_id === student.id → 403
    │       ├── Insert Application record
    │       ├── email.send_application_confirmation(student) [non-blocking]
    │       └── email.send_new_application_alert(recruiter) [non-blocking]
    │
    ├── 6. Success (201)
    │       ├── ApplyModal closes
    │       ├── Toast "Application submitted! 🎉"
    │       └── "Apply Now" button → "Applied" (disabled, success variant)
    │
    └── 7. Failure cases
            ├── 409 ALREADY_APPLIED → toast "You've already applied to this job"
            ├── 400 JOB_CLOSED      → toast "This job is no longer accepting applications"
            └── Network error       → toast "Failed. Please try again."
```

---

### 2.8 AI Analysis Flow

```
Student clicks "Analyze" on a ResumeCard
    │
    ├── 1. Optional: enable job match toggle + select job from dropdown
    │
    ├── 2. POST /api/ai/analyze { resume_id, job_id? }
    │       → AIAnalysisPanel shows loading state
    │
    ├── 3. Backend: services/ai.py
    │       ├── Fetch Resume → verify ownership
    │       ├── GET signed URL from Supabase (60s)
    │       ├── httpx.get(url) → PDF bytes
    │       ├── pypdf.PdfReader(BytesIO(bytes)) → extract text
    │       ├── Truncate to 6000 chars
    │       ├── If job_id: fetch job title + description + skills
    │       ├── Build prompt (general or job-match variant)
    │       ├── groq.chat.completions.create(model, messages)
    │       ├── Strip markdown fences → json.loads()
    │       ├── Clamp match_score 0–100
    │       └── UPSERT ai_analyses (update if exists for this resume)
    │
    ├── 4. Success (200) → AIAnalysisOut
    │       ├── match_score, candidate_summary
    │       ├── strengths[], missing_skills[], recommendations[]
    │
    └── 5. Frontend update
            ├── Match score ring: strokeDashoffset animates from max → calculated value
            ├── Candidate summary fades in
            ├── Strengths chips: staggered slide-up
            ├── Missing skills chips: staggered slide-up (red)
            └── Recommendations list: fade-in
```

---

### 2.9 Email Notification Flow

```
Trigger: POST /api/applications (student applies)
    ├── services/email.py: send_application_confirmation()
    │       → Resend API → to: student@email
    │       → Subject: "Application Received — {job_title} at {company}"
    └── services/email.py: send_new_application_alert()
            → Resend API → to: recruiter@email
            → Subject: "New Application — {job_title}"

Trigger: POST /api/auth/register
    └── services/email.py: send_welcome()
            → Resend API → to: newuser@email
            → Subject: "Welcome to Career Planet 🚀"

Trigger: PATCH /api/applications/:id/status
    └── services/email.py: send_status_update()
            → Resend API → to: student@email
            → Subject: "Application Update — {company}"
            → Body varies by status:
                shortlisted → positive, encouraging
                hired       → celebratory
                rejected    → empathetic, encouraging

All email calls:
    ├── Wrapped in try/except
    ├── Failures logged at WARNING level
    └── Never raise HTTP error to caller
```

---

## 3. Sequence Diagrams

### 3.1 Registration Sequence

```
Browser        pages/auth/Register    api/auth.js     backend/app/api/auth.py    services/auth.py    DB         email.py    Resend
   │                   │                   │                    │                      │               │             │           │
   │─ fill form ──────▶│                   │                    │                      │               │             │           │
   │                   │─ register(data) ──▶│                    │                      │               │             │           │
   │                   │                   │─ POST /auth/register▶                      │               │             │           │
   │                   │                   │                    │─ schemas validate      │               │             │           │
   │                   │                   │                    │─ call register() ────▶│               │             │           │
   │                   │                   │                    │                       │─ check email─▶│             │           │
   │                   │                   │                    │                       │◀─ unique ─────│             │           │
   │                   │                   │                    │                       │─ hash pw       │             │           │
   │                   │                   │                    │                       │─ INSERT user ─▶│             │           │
   │                   │                   │                    │                       │◀─ 201 user ────│             │           │
   │                   │                   │                    │                       │─ create JWT    │             │           │
   │                   │                   │                    │                       │──────────────────────── send_welcome() ─▶│
   │                   │                   │                    │◀─ AuthResponse ───────│               │             │           │
   │                   │◀─ {token, user} ──│                    │                       │               │             │           │
   │                   │─ store cv_auth    │                    │                       │               │             │           │
   │◀─ redirect ───────│                   │                    │                       │               │             │           │
```

---

### 3.2 Job Application Sequence

```
Browser     pages/student/Jobs    api/applications.js    api/auth.py(backend)    services/applications.py    DB        email.py
   │                │                      │                     │                         │                   │            │
   │─ Apply Now ───▶│                      │                     │                         │                   │            │
   │                │─ GET /resume ─────────────────────────────▶│                         │                   │            │
   │                │◀─ resumes list ───────────────────────────│                         │                   │            │
   │◀─ modal ───────│                      │                     │                         │                   │            │
   │─ select + submit▶                     │                     │                         │                   │            │
   │                │─ apply(data) ─────────▶                    │                         │                   │            │
   │                │                      │─ POST /applications▶│                         │                   │            │
   │                │                      │                     │─ apply() ───────────────▶                   │            │
   │                │                      │                     │                         │─ check job ───────▶│            │
   │                │                      │                     │                         │─ check dup ───────▶│            │
   │                │                      │                     │                         │─ verify resume ───▶│            │
   │                │                      │                     │                         │─ INSERT app ──────▶│            │
   │                │                      │                     │                         │◀─ 201 ─────────────│            │
   │                │                      │                     │                         │────────────── send_confirmation ─▶
   │                │                      │                     │                         │────────────── send_alert ────────▶
   │                │                      │◀─ 201 ApplicationOut│                         │                   │            │
   │                │◀─ success ────────────│                    │                         │                   │            │
   │◀─ modal close + toast                 │                     │                         │                   │            │
```

---

### 3.3 AI Analysis Sequence

```
Browser    pages/student/Resume    api/ai.js    api/ai.py(backend)    services/ai.py    Supabase    Groq API    DB
   │                │                  │               │                    │               │            │          │
   │─ click Analyze▶│                  │               │                    │               │            │          │
   │                │─ analyzeResume() ─▶               │                    │               │            │          │
   │                │                  │─ POST /ai/analyze                   │               │            │          │
   │◀─ loading ─────│                  │               │─ analyze_resume()──▶│               │            │          │
   │                │                  │               │                    │─ fetch resume  │            │          │
   │                │                  │               │                    │─ create URL ──▶│            │          │
   │                │                  │               │                    │◀─ signed URL ──│            │          │
   │                │                  │               │                    │─ GET pdf bytes▶│            │          │
   │                │                  │               │                    │◀─ bytes ───────│            │          │
   │                │                  │               │                    │─ extract text  │            │          │
   │                │                  │               │                    │─ build prompt  │            │          │
   │                │                  │               │                    │─ POST prompt ──────────────▶│          │
   │                │                  │               │                    │◀─ JSON response────────────│          │
   │                │                  │               │                    │─ parse + clamp │            │          │
   │                │                  │               │                    │─ UPSERT ───────────────────────────────▶
   │                │                  │               │◀─ AIAnalysisOut ───│               │            │          │
   │                │◀─ analysis data──│               │                    │               │            │          │
   │◀─ ring animates│                  │               │                    │               │            │          │
```

---

### 3.4 Status Update Sequence

```
Browser(Recruiter)   pages/recruiter/Applicants   api/applications.js   api/applications.py   services/applications.py   DB    email.py   Resend
       │                       │                         │                      │                        │                 │        │          │
       │─ change status ──────▶│                         │                      │                        │                 │        │          │
       │                       │─ changeStatus(id, data)──▶                     │                        │                 │        │          │
       │                       │                         │─ PATCH /apps/:id/status                       │                 │        │          │
       │                       │                         │                      │─ update_status() ──────▶                 │        │          │
       │                       │                         │                      │                        │─ verify job owner▶       │          │
       │                       │                         │                      │                        │─ UPDATE status ─▶        │          │
       │                       │                         │                      │                        │◀─ 200 ──────────│         │          │
       │                       │                         │                      │                        │──────────── send_status_update() ───▶│
       │                       │                         │◀─ 200 ApplicationOut │                        │                 │        │          │
       │                       │◀─ updated app ───────────│                     │                        │                 │        │          │
       │◀─ badge updates + toast│                         │                      │                        │                 │        │          │
```

---

## 4. Flowcharts

### 4.1 Auth Guard Flowchart

```
User navigates to URL
         │
         ▼
    Is route protected?
    ┌────┴────┐
   NO        YES
    │         │
    ▼         ▼
  Render   Is user in localStorage (cv_auth)?
  page     ┌────┴────┐
          NO         YES
           │          │
           ▼          ▼
     Save attempted  Decode user.role
     URL in state    Does role match allowedRoles[]?
     Navigate /login ┌────┴────┐
                     NO        YES
                      │         │
                      ▼         ▼
               Navigate to    Render
               role dashboard  page
```

---

### 4.2 Job Post → Apply → Hire Flowchart

```
Recruiter posts job
        │
        ▼
POST /api/jobs → Job created (status: active)
        │
        ▼
Job appears in GET /api/jobs (public)
        │
        ▼
Student searches/browses → Finds job
        │
        ▼
Click Apply Now → ApplyModal opens
        │
        ▼
    Has resume uploaded?
    ┌────┴────┐
   NO         YES
    │          │
    ▼          ▼
  Warning    Select resume + cover letter
  link to    Submit → POST /api/applications
  /student/resume
                │
                ▼
        Job still active? ─── NO ──▶ Toast "Job closed"
                │
               YES
                │
                ▼
        Already applied? ─── YES ──▶ Toast "Already applied"
                │
               NO
                │
                ▼
        Insert application (status: applied)
                │
                ▼
        Emails sent → student + recruiter
                │
                ▼
        Recruiter reviews → /recruiter/applicants
                │
                ▼
        Update status: Reviewing → Shortlisted → Hired
                │          (each triggers student email)
                ▼
        Student sees status update in /student/applications
```

---

### 4.3 Resume Upload + AI Analysis Flowchart

```
/student/resume page loads
        │
        ├── GET /api/resume → load existing resumes
        └── For each resume: GET /api/ai/analysis/:id → load cached analysis

        │
User drops/selects file
        │
        ▼
Client validation:
  type === 'application/pdf'? ── NO ──▶ toast error, stop
  size <= 5MB?               ── NO ──▶ toast error, stop
        │
       YES
        │
        ▼
POST /api/resume/upload (multipart)
  → progress bar updates
        │
        ▼
Backend: validate → Supabase upload → create DB record
        │
        ▼
201 → ResumeCard added to list (Primary badge if first)
        │
        ▼
User clicks "Analyze" on ResumeCard
        │
        ▼
(Optional) Enable job match toggle → select job
        │
        ▼
POST /api/ai/analyze { resume_id, job_id? }
        │
        ▼
Backend: download PDF → extract text → build prompt → Groq → parse → upsert
        │
        ▼
200 → AIAnalysisPanel populates
  → Score ring animates
  → Skills chips stagger in
  → Recommendations list fades
```

---

### 4.4 Recruiter Setup Flowchart

```
Recruiter registers → /recruiter/dashboard
        │
        ▼
user.company_id === null?
        │
       YES → No-company banner shown
        │
        ▼
Click "Set Up Company" → /recruiter/company
        │
        ▼
Fill company form → POST /api/companies
        │
        ▼
PATCH /api/auth/company { company_id }
        │
        ▼
user.company_id set → banner disappears
        │
        ▼
Navigate /recruiter/jobs → click "+ Post New Job"
        │
        ▼
Fill JobForm → POST /api/jobs
        │
        ▼
Job live → students can see it in GET /api/jobs
```

---

## 5. Module Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React / Vercel)                            │
│                                                                             │
│  pages/public/   pages/auth/   pages/student/   pages/recruiter/  pages/admin/
│       │               │              │                │                │    │
│       └───────────────┴──────────────┴────────────────┴────────────────┘    │
│                                      │                                      │
│                              routes/index.jsx                               │
│                              (ProtectedRoute)                               │
│                                      │                                      │
│                              layouts/ (4 layouts)                           │
│                                      │                                      │
│                    ┌─────────────────┼──────────────────┐                  │
│                    │                 │                  │                  │
│               hooks/            components/          utils/                │
│    (useAuth, useJobs,      (ui/, common/, auth/,   (format, constants,     │
│     useApplications,        dashboard/, jobs/,      cn)                    │
│     useResume, useAI,        resume/)                                       │
│     useAdmin, useToast)           │                                         │
│                    │              │                                         │
│                    └──────────────┘                                         │
│                              │                                              │
│                         api/ (7 files)                                      │
│                    axios.js (interceptors)                                  │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │ HTTP/HTTPS
                               │ Authorization: Bearer {JWT}
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI / Render)                             │
│                                                                             │
│  app/main.py (CORS, middleware, router registration)                        │
│                                                                             │
│  ┌──────┬──────┬──────────────┬─────────┬───────┬────────┐                 │
│  │auth  │jobs  │applications  │resume   │ ai    │ admin  │  api/ (6 files) │
│  └──┬───┴──┬───┴──────┬───────┴────┬────┴──┬────┴───┬────┘                 │
│     │      │          │            │       │        │                       │
│  ┌──▼──────▼──────────▼────────────▼───────▼────────▼────────────────────┐ │
│  │                     services/ (7 files)                                │ │
│  │  auth    jobs    applications    resume    ai    email    admin         │ │
│  └──┬────────┬───────────┬──────────┬─────────┬────────────────────────── ┘ │
│     │        │           │          │         │                             │
│  ┌──▼────────▼───────────▼──────────▼─────────▼──────────────────────────┐ │
│  │                core/ + models/ + schemas/ + utils/                     │ │
│  └──────────────────────────────┬──────────────────────────────────────── ┘ │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
              ┌───────────────────┼────────────────────┐
              ▼                   ▼                    ▼
   ┌──────────────────┐  ┌───────────────┐  ┌──────────────────┐
   │  Supabase        │  │  Groq Cloud   │  │  Resend          │
   │  PostgreSQL      │  │  LLM API      │  │  Email API       │
   │  + Storage       │  │  (Llama3-70b) │  │                  │
   └──────────────────┘  └───────────────┘  └──────────────────┘
```

---

## 6. API Dependency Table

Every endpoint: what it needs before it can work.

| Endpoint | Needs (DB Tables) | Needs (Services) | Needs (External) | Can Be Called By |
|---|---|---|---|---|
| POST /auth/register | users | services/auth.py | Resend (non-fatal) | Public |
| POST /auth/login | users | services/auth.py | — | Public |
| GET /auth/me | users | core/dependencies.py | — | Authenticated |
| PUT /auth/profile | users | services/auth.py | — | Authenticated |
| PATCH /auth/active-resume | users, resumes | services/auth.py | — | Student |
| PATCH /auth/company | users, companies | services/auth.py | — | Recruiter |
| POST /jobs | jobs, companies, users | services/jobs.py | — | Recruiter |
| GET /jobs | jobs, companies | services/jobs.py | — | Public |
| GET /jobs/mine | jobs | services/jobs.py | — | Recruiter |
| GET /jobs/:id | jobs, companies | services/jobs.py | — | Public |
| PUT /jobs/:id | jobs | services/jobs.py | — | Recruiter/Admin |
| DELETE /jobs/:id | jobs, applications | services/jobs.py | — | Recruiter/Admin |
| PATCH /jobs/:id/status | jobs | services/jobs.py | — | Recruiter/Admin |
| POST /applications | applications, jobs, resumes, users | services/applications.py | Resend (non-fatal) | Student |
| GET /applications/mine | applications, jobs, companies | services/applications.py | — | Student |
| GET /applications/job/:id | applications, users | services/applications.py | — | Recruiter/Admin |
| PATCH /applications/:id/status | applications, jobs, users | services/applications.py | Resend (non-fatal) | Recruiter/Admin |
| GET /applications/:id | applications | services/applications.py | — | Student/Recruiter/Admin |
| POST /resume/upload | resumes, users | services/resume.py | Supabase Storage | Student |
| GET /resume | resumes | services/resume.py | — | Student |
| GET /resume/:id/url | resumes | services/resume.py | Supabase Storage | Student/Recruiter/Admin |
| DELETE /resume/:id | resumes, users | services/resume.py | Supabase Storage | Student |
| POST /ai/analyze | resumes, jobs (opt), ai_analyses | services/ai.py | Supabase + Groq | Student |
| GET /ai/analysis/:id | ai_analyses | services/ai.py | — | Student/Recruiter/Admin |
| GET /admin/stats | All tables | services/admin.py | — | Admin |
| GET /admin/users | users | services/admin.py | — | Admin |
| PATCH /admin/users/:id/toggle | users | services/admin.py | — | Admin |
| GET /admin/jobs | jobs, companies | services/admin.py | — | Admin |
| DELETE /admin/jobs/:id | jobs, applications | services/jobs.py | — | Admin |

---

### Endpoint Availability Phases

```
Phase 1 — Auth foundation (nothing works without these):
  POST /auth/register
  POST /auth/login
  GET  /auth/me

Phase 2 — Profile + Company (depends on Phase 1):
  PUT  /auth/profile
  POST /companies (add to auth.py or admin.py)
  PATCH /auth/company

Phase 3 — Jobs (depends on Phase 2):
  POST /jobs
  GET  /jobs
  GET  /jobs/mine
  GET  /jobs/:id

Phase 4 — Resume + Applications (depends on Phase 3):
  POST /resume/upload
  GET  /resume
  POST /applications
  GET  /applications/mine
  GET  /applications/job/:id
  PATCH /applications/:id/status

Phase 5 — AI + Admin (depends on Phase 4):
  POST /ai/analyze
  GET  /ai/analysis/:id
  GET  /admin/stats
  GET  /admin/users
  PATCH /admin/users/:id/toggle

Phase 6 — Cleanup (depends on Phase 4):
  DELETE /resume/:id
  GET    /resume/:id/url
  PATCH  /auth/active-resume
  DELETE /jobs/:id
  GET    /applications/:id
  GET    /admin/jobs
  DELETE /admin/jobs/:id
```

---

## 7. Frontend Dependency Table

| Page | Needs (Components) | Needs (Hooks) | Needs (API endpoints live) |
|---|---|---|---|
| pages/auth/Login | ui/Button, ui/Input, common/Toast | useAuth | POST /auth/login |
| pages/auth/Register | ui/Button, ui/Input, common/Toast | useAuth | POST /auth/register |
| pages/public/Landing | common/Navbar, jobs/JobCard, ui/Button | useJobs (3 jobs) | GET /jobs |
| pages/student/Dashboard | dashboard/StatCard, dashboard/ApplicationsChart, jobs/JobCard, ui/Skeleton | useAuth, useApplications, useJobs | GET /applications/mine, GET /jobs |
| pages/student/Jobs | jobs/JobCard, jobs/ApplyModal, common/FilterPanel, common/SearchBar, common/Pagination | useJobs, useApplications, useResume | GET /jobs, POST /applications, GET /resume |
| pages/student/Applications | ui/Badge, ui/Card, ui/EmptyState, common/Pagination | useApplications | GET /applications/mine |
| pages/student/Resume | resume/ResumeUpload, resume/ResumeCard, resume/ResumePreview, resume/AIAnalysisPanel | useResume, useAI | GET /resume, POST /resume/upload, POST /ai/analyze, GET /ai/analysis/:id |
| pages/student/Profile | ui/Input, ui/Button, ui/Badge | useAuth | GET /auth/me, PUT /auth/profile |
| pages/recruiter/Dashboard | dashboard/StatCard, dashboard/ApplicationsChart, ui/Skeleton | useAuth, useJobs | GET /jobs/mine, GET /auth/me |
| pages/recruiter/Jobs | jobs/JobCard, jobs/JobForm, ui/Modal, common/ConfirmDialog, common/Pagination | useJobs | GET /jobs/mine, POST /jobs, PUT /jobs/:id, DELETE /jobs/:id |
| pages/recruiter/Applicants | resume/ResumePreview, resume/AIAnalysisPanel, ui/Drawer, ui/Badge, common/Pagination | useApplications, useResume, useAI | GET /applications/job/:id, PATCH /applications/:id/status, GET /resume/:id/url, GET /ai/analysis/:id |
| pages/recruiter/Company | ui/Input, ui/Button, ui/Card | useAuth | POST /companies, PUT /companies/:id, PATCH /auth/company |
| pages/recruiter/Profile | ui/Input, ui/Button | useAuth | PUT /auth/profile |
| pages/admin/Dashboard | dashboard/StatCard, dashboard/SignupChart, dashboard/ApplicationsChart, dashboard/JobTypeChart | useAdmin | GET /admin/stats |
| pages/admin/Users | ui/Badge, ui/Button, common/ConfirmDialog, common/Pagination | useAdmin | GET /admin/users, PATCH /admin/users/:id/toggle |
| pages/admin/Jobs | ui/Badge, common/ConfirmDialog, common/Pagination | useAdmin | GET /admin/jobs, DELETE /admin/jobs/:id |
| pages/admin/Analytics | dashboard/SignupChart, dashboard/ApplicationsChart, dashboard/JobTypeChart | useAdmin | GET /admin/stats |

---

### Component Build Order

```
Tier 1 (no dependencies — build first):
  utils/cn.js, utils/format.js, utils/constants.js
  ui/Button, ui/Input, ui/Textarea, ui/Select
  ui/Badge, ui/Card, ui/Spinner

Tier 2 (depends on Tier 1):
  ui/Skeleton, ui/EmptyState, ui/Modal, ui/Drawer
  common/Toast + hooks/useToast

Tier 3 (depends on Tier 1+2):
  common/Navbar, common/Sidebar, common/Topbar
  common/Pagination, common/SearchBar, common/FilterPanel
  common/ConfirmDialog
  auth/ProtectedRoute

Tier 4 (depends on Tier 1+2+3):
  layouts/ (all 4)
  dashboard/StatCard, dashboard/*Chart (all 3)
  jobs/JobCard
  resume/ResumeCard, resume/ResumeUpload

Tier 5 (depends on Tier 4):
  jobs/JobForm, jobs/ApplyModal
  resume/ResumePreview, resume/AIAnalysisPanel

Tier 6 (assemble all tiers):
  All page components
```

---

## 8. Backend Dependency Table

| Service File | Depends On (Services) | Depends On (Models) | Depends On (Core) | Depends On (External) |
|---|---|---|---|---|
| services/auth.py | services/email.py | models/user.py | core/security.py, core/database.py | Resend (via email.py) |
| services/jobs.py | — | models/job.py, models/company.py | core/database.py | — |
| services/applications.py | services/email.py | models/application.py, models/job.py, models/user.py, models/resume.py | core/database.py | Resend (via email.py) |
| services/resume.py | — | models/resume.py, models/user.py | core/config.py | Supabase Storage |
| services/ai.py | services/resume.py | models/resume.py, models/job.py, models/ai_analyses (in resume.py) | core/config.py | Supabase Storage + Groq API |
| services/email.py | — | — | core/config.py | Resend API |
| services/admin.py | — | All models | core/database.py | — |

### Model Dependency Order

```
1. models/user.py       (no FK dependents initially)
2. models/company.py    (FK: users.id for created_by)
3. models/job.py        (FK: companies.id, users.id)
4. models/resume.py     (FK: users.id for Resume; FK: resumes.id + jobs.id for AIAnalysis)
5. models/application.py (FK: jobs.id, users.id, resumes.id)

Circular FK resolution:
  users.company_id → companies.id   (add via separate Alembic migration after companies table exists)
  users.active_resume_id → resumes.id (add via separate migration after resumes table exists)
```

---

## 9. Implementation Order

### Backend — Block by Block

```
Block 1: Foundation (Day 1 Morning, 2h)
  1. Create folder structure per PROJECT_STRUCTURE.txt
  2. requirements.txt with all packages
  3. .env + .env.example
  4. core/config.py (Settings)
  5. core/database.py (engine + session + Base)
  6. app/main.py (bare FastAPI, CORS, health check route GET /health → 200 OK)
  7. alembic init + env.py configuration

Block 2: Models + Migration (Day 1, 2h)
  8. models/user.py
  9. models/company.py
  10. models/job.py
  11. models/resume.py (Resume + AIAnalysis)
  12. models/application.py
  13. models/__init__.py importing all models
  14. alembic revision --autogenerate → apply
  15. Verify all 6 tables in Supabase dashboard

Block 3: Auth (Day 1, 2h)
  16. core/security.py (hash_password, verify_password, create_access_token, decode_token)
  17. core/dependencies.py (get_db, get_current_user, role guards)
  18. schemas/auth.py
  19. services/auth.py (register, login, update_profile, set_active_resume)
  20. api/auth.py (register, login, me, profile, active-resume, company routes)
  21. Register router in main.py
  22. Test: POST /register + POST /login return token

Block 4: Jobs (Day 1 Evening, 2h)
  23. schemas/job.py
  24. services/jobs.py (create_job, search_jobs, get_job, get_recruiter_jobs, update_job, delete_job, update_job_status)
  25. api/jobs.py (all job routes)
  26. Test: POST /jobs (with recruiter token) → GET /jobs returns it

Block 5: Resume + Storage (Day 2 Morning, 2h)
  27. utils/helpers.py (validate_file, paginated_response, build_pagination)
  28. utils/constants.py (all enum classes)
  29. schemas/resume.py
  30. services/resume.py (Supabase client + upload_resume, get_user_resumes, get_resume_signed_url, delete_resume)
  31. api/resume.py (upload, list, url, delete routes)
  32. Test: upload PDF → appears in Supabase dashboard → signed URL returns

Block 6: Applications (Day 2, 1.5h)
  33. schemas/application.py
  34. services/applications.py (apply, get_student_applications, get_job_applications, update_status)
  35. api/applications.py (all routes)
  36. Test: apply to job → 201 → get /mine shows it

Block 7: Email (Day 2, 1.5h)
  37. services/email.py (Resend setup + all 4 templates)
  38. Wire into services/auth.py (welcome) + services/applications.py (apply + status)
  39. Test: register new user → check Resend dashboard for email

Block 8: AI (Day 2 Evening, 3h)
  40. Install: groq, pypdf, httpx
  41. services/ai.py (analyze_resume, get_analysis, extract_pdf_text, parse_ai_response)
  42. api/ai.py (analyze + get_analysis routes)
  43. Test end-to-end: upload PDF → POST /ai/analyze → response has score + summary

Block 9: Admin (Day 3 Morning, 1.5h)
  44. services/admin.py (get_stats, list_users, toggle_user_active)
  45. api/admin.py (stats, users, toggle, jobs, delete job routes)
  46. Test: GET /admin/stats returns all counts

Block 10: Polish + Deploy (Day 3, 3h)
  47. Rate limiting on auth routes (slowapi)
  48. Security headers in main.py
  49. Global exception handler cleanup
  50. Company logo upload (add to auth or admin routes)
  51. Procfile: web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  52. Push to GitHub → Render web service → set env vars
  53. alembic upgrade head on production DB
  54. Test all P0 flows on production URL
```

---

### Frontend — Block by Block

```
Block 1: Setup (Day 1 Morning, 1.5h)
  1. npm create vite@latest frontend -- --template react
  2. Install all packages: tailwindcss, framer-motion, react-router-dom, axios,
     zustand, react-hook-form, zod, recharts, lucide-react
  3. tailwind.config.js with design tokens
  4. src/utils/cn.js, format.js, constants.js
  5. src/api/axios.js (instance + interceptors)
  6. All api/*.js files (stubs only — fill as features build)

Block 2: Core Infrastructure (Day 1, 2h)
  7. hooks/useAuth.js (localStorage read/write, login, logout, updateProfile)
  8. hooks/useToast.js + components/common/Toast.jsx
  9. routes/index.jsx skeleton (all routes defined, pages = placeholder divs)
  10. components/auth/ProtectedRoute.jsx
  11. layouts/ (all 4 layouts — Sidebar + Topbar stubs first)

Block 3: UI Primitives (Day 1 Afternoon, 2.5h)
  12. ui/Button.jsx (all variants + sizes + loading)
  13. ui/Input.jsx + ui/Textarea.jsx + ui/Select.jsx
  14. ui/Badge.jsx (all variants + pulse)
  15. ui/Card.jsx + ui/Spinner.jsx + ui/Skeleton.jsx + ui/EmptyState.jsx
  16. ui/Modal.jsx + ui/Drawer.jsx

Block 4: Layout Components (Day 1 Evening, 1.5h)
  17. common/Navbar.jsx (public, logged-in variants)
  18. common/Sidebar.jsx (all 3 role nav sets + mobile drawer)
  19. common/Topbar.jsx (avatar dropdown)
  20. common/Pagination.jsx + common/SearchBar.jsx

Block 5: Auth Pages (Day 1 Evening, 2.5h)
  21. pages/auth/Login.jsx (full form + API wired)
  22. pages/auth/Register.jsx (full form + role toggle + API wired)
  23. Test: register → store token → redirect to dashboard

Block 6: Landing + Job Browse (Day 2 Morning, 4h)
  24. components/jobs/JobCard.jsx (full + compact variants)
  25. pages/public/Landing.jsx (all sections + Framer Motion animations)
  26. common/FilterPanel.jsx + hooks/useJobs.js
  27. pages/student/Jobs.jsx (full search/filter/paginate)
  28. components/jobs/ApplyModal.jsx + hooks/useApplications.js

Block 7: Student Pages (Day 2 Afternoon, 5h)
  29. components/dashboard/ (StatCard + all 3 chart components)
  30. pages/student/Dashboard.jsx
  31. pages/student/Applications.jsx + hooks/useApplications.js
  32. pages/student/Profile.jsx
  33. Fill api/auth.js + api/applications.js

Block 8: Resume + AI (Day 3 Morning, 4h)
  34. components/resume/ResumeUpload.jsx (drag-drop + progress)
  35. components/resume/ResumeCard.jsx
  36. components/resume/ResumePreview.jsx (PDF iframe modal)
  37. components/resume/AIAnalysisPanel.jsx (score ring + chips + recommendations)
  38. hooks/useResume.js + hooks/useAI.js
  39. pages/student/Resume.jsx (full two-panel layout)
  40. Fill api/resume.js + api/ai.js

Block 9: Recruiter Pages (Day 3, 5h)
  41. components/jobs/JobForm.jsx (full form + tag input)
  42. pages/recruiter/Dashboard.jsx
  43. pages/recruiter/Jobs.jsx (list + create + edit mode)
  44. pages/recruiter/Applicants.jsx + ApplicantDrawer
  45. pages/recruiter/Company.jsx
  46. pages/recruiter/Profile.jsx

Block 10: Admin + Public (Day 3 Evening, 3.5h)
  47. pages/admin/Dashboard.jsx
  48. pages/admin/Users.jsx
  49. pages/admin/Jobs.jsx
  50. pages/admin/Analytics.jsx
  51. pages/public/About.jsx + Contact.jsx (static)
  52. hooks/useAdmin.js + api/admin.js

Block 11: Deploy + Polish (Day 3 Evening, 2h)
  53. Mobile responsive sweep (sidebar drawer, filter drawer, tables → cards)
  54. Framer Motion animation sweep (page transitions, stat cards, toast, score ring)
  55. Loading skeleton sweep across all pages
  56. Empty states sweep
  57. Vercel deploy: connect repo, set VITE_API_URL
  58. Full E2E smoke test on production
```

---

## 10. 3-Day Development Roadmap

### DAY 1 — Foundation

**Goal by EOD:** Auth works end-to-end. Landing page renders. Logins redirect to dashboards correctly. Backend health check deployed.

---

#### Developer 1 (Backend) — Day 1 Schedule

| Time | Task | Output |
|---|---|---|
| 09:00–11:00 | Folder structure + config + database + Alembic init | Runnable FastAPI app, /health endpoint |
| 11:00–13:00 | All 5 model files + migration | 6 tables in Supabase |
| 13:00–14:00 | Lunch | — |
| 14:00–16:00 | core/security + core/dependencies + schemas/auth | JWT working |
| 16:00–18:00 | services/auth + api/auth (register, login, me, profile) | POST /auth/register + login return token |
| 18:00–20:00 | schemas/job + services/jobs (CRUD) + api/jobs | POST /jobs + GET /jobs working |
| **Total** | | **10h** |

#### Developer 2 (Frontend) — Day 1 Schedule

| Time | Task | Output |
|---|---|---|
| 09:00–10:00 | Vite + Tailwind + design tokens + api/axios.js + utils/ | Dev server runs, tokens applied |
| 10:00–11:30 | ui/ primitives: Button, Input, Select, Badge, Card | Component library ready |
| 11:30–13:00 | ui/ Modal, Drawer, Spinner, Skeleton, EmptyState | All primitives done |
| 13:00–14:00 | Lunch | — |
| 14:00–15:00 | hooks/useToast + common/Toast + common/ConfirmDialog | Toast system working |
| 15:00–16:30 | common/Navbar + common/Sidebar + common/Topbar | Layouts look correct |
| 16:30–17:00 | layouts/ (all 4) + routes/index.jsx skeleton + ProtectedRoute | Routing structure in place |
| 17:00–20:00 | pages/auth/Login + Register (full, API wired) | Login/Register functional against backend |
| **Total** | | **10h** |

**Day 1 EOD Sync (20:00):**
- Test: register new student → /student/dashboard ✓
- Test: register new recruiter → /recruiter/dashboard ✓
- Test: wrong password → 401 error toast ✓
- Agree: any schema tweaks needed for frontend

---

### DAY 2 — Core Features

**Goal by EOD:** Students can browse jobs and apply. Recruiters can post jobs and see applications. AI analysis working.

---

#### Developer 1 (Backend) — Day 2 Schedule

| Time | Task | Output |
|---|---|---|
| 09:00–11:00 | Job search + filters + pagination (full query builder) | GET /jobs?keyword=X&job_type=Y working |
| 11:00–13:00 | services/resume + api/resume + Supabase Storage setup | POST /resume/upload → file in Supabase |
| 13:00–14:00 | Lunch | — |
| 14:00–15:30 | schemas/application + services/applications + api/applications | POST /applications + status update |
| 15:30–17:00 | services/email (Resend setup + 4 templates) wired into auth + applications | Welcome + apply emails sent |
| 17:00–20:00 | services/ai (Groq + pypdf + prompt + parser) + api/ai | POST /ai/analyze returns structured JSON |
| **Total** | | **10h** |

#### Developer 2 (Frontend) — Day 2 Schedule

| Time | Task | Output |
|---|---|---|
| 09:00–10:00 | components/jobs/JobCard (full + compact) | Card looks good |
| 10:00–12:00 | pages/public/Landing (all sections + animations) | Landing page complete |
| 12:00–13:00 | common/FilterPanel + common/SearchBar + common/Pagination | Filter UI working |
| 13:00–14:00 | Lunch | — |
| 14:00–16:00 | pages/student/Jobs (full search/filter/apply) + hooks/useJobs | Student can browse jobs |
| 16:00–17:00 | components/jobs/ApplyModal + hooks/useApplications | Apply flow working |
| 17:00–18:30 | dashboard/ chart components (all 4) | Charts render with test data |
| 18:30–20:00 | pages/student/Dashboard + pages/student/Applications | Dashboards working |
| **Total** | | **10h** |

**Day 2 EOD Sync (20:00):**
- Test: student applies to job → both emails arrive ✓
- Test: AI analyze → score + summary returned ✓
- Test: recruiter sees application in /applications/job/:id ✓
- Fix any broken API contracts

---

### DAY 3 — Completion + Deploy

**Goal by EOD:** All pages done. Admin working. Deployed on Vercel + Render. E2E smoke test green.

---

#### Developer 1 (Backend) — Day 3 Schedule

| Time | Task | Output |
|---|---|---|
| 09:00–10:30 | services/admin + api/admin (stats, users, toggle, jobs, delete) | GET /admin/stats returns real data |
| 10:30–11:30 | Resume signed URL + delete + company logo upload | GET /resume/:id/url works |
| 11:30–12:30 | Rate limiting (slowapi on auth) + security headers | Auth routes rate limited |
| 12:30–13:30 | Lunch | — |
| 13:30–15:00 | Error handling sweep + response envelope consistency across all routes | All errors return consistent JSON |
| 15:00–17:00 | Render deployment: Procfile, push, env vars, alembic upgrade head | Backend live on Render |
| 17:00–20:00 | Integration testing with frontend — fix CORS or schema issues | All flows work on production |
| **Total** | | **10h** |

#### Developer 2 (Frontend) — Day 3 Schedule

| Time | Task | Output |
|---|---|---|
| 09:00–11:00 | components/resume/ (all 4 components) | ResumeUpload, Card, Preview, AI panel ready |
| 11:00–13:00 | pages/student/Resume (full two-panel + AI integration) | Student can upload + analyze |
| 13:00–14:00 | Lunch | — |
| 14:00–15:30 | components/jobs/JobForm + pages/recruiter/Jobs (list + create + edit) | Recruiter posts jobs |
| 15:30–17:00 | pages/recruiter/Applicants (table + drawer + inline status) | Recruiter can hire |
| 17:00–18:00 | pages/recruiter/Company + Profile | Recruiter profile complete |
| 18:00–18:30 | pages/admin/ (all 4) + hooks/useAdmin | Admin dashboard live |
| 18:30–19:00 | pages/public/About + Contact | Static pages done |
| 19:00–19:30 | Mobile responsive fixes sweep | Works on phone |
| 19:30–20:00 | Vercel deploy + VITE_API_URL → smoke test | Frontend live |
| **Total** | | **10h** |

---

### DAY 4 — Demo Preparation

| Time | Both Developers | Hours |
|---|---|---|
| 09:00–10:00 | Full E2E smoke test on production (all 3 roles, all flows) | 1h |
| 10:00–11:00 | Bug fixes from smoke test | 1h |
| 11:00–12:00 | Seed demo data (see below) | 1h |
| 12:00–13:00 | Lunch | — |
| 13:00–14:00 | Demo video recording + screenshots | 1h |
| 14:00–15:00 | Presentation slides | 1h |

**Demo Seed Data:**
```
Users (pre-created):
  admin@Career Planet.app     / admin (admin role)
  student@demo.com          / demo1234 (student, complete profile, resume uploaded + analyzed)
  recruiter@demo.com        / demo1234 (recruiter, linked to TechCorp)

Companies:
  TechCorp     (logo, full details, 3 active jobs)
  BuildWithUs  (logo, full details, 2 active jobs)

Jobs (5 total):
  Frontend Developer     @ TechCorp      (full_time, ₹40k–₹60k)
  Backend Intern         @ TechCorp      (internship, ₹15k)
  Full Stack Engineer    @ TechCorp      (full_time, ₹50k–₹80k)
  Product Designer       @ BuildWithUs   (full_time, ₹35k–₹55k)
  DevOps Engineer        @ BuildWithUs   (contract, ₹60k)

Applications:
  student applied to Frontend Developer  (status: shortlisted)
  student applied to Backend Intern      (status: reviewing)
  student applied to Product Designer    (status: applied)

AI Analysis:
  student's resume analyzed (general: score 72)
  student's resume analyzed vs Frontend Developer (match score: 68)
```

**5-minute demo script:**
1. Landing page — visual impact, animations (30s)
2. Register live as student → complete profile → upload resume (60s)
3. AI analysis — score ring animates + insights (45s)
4. Browse jobs → apply with cover letter → email demo (45s)
5. Switch to recruiter → see applicant → change status → student email (60s)
6. Admin dashboard — platform stats + charts (30s)
7. Wrap: "One platform. Students. Recruiters. AI-powered." (10s)

---

## 11. Critical Path

The sequence where any delay directly delays final delivery:

```
[Alembic migrations — all 6 tables]
              │
              ▼
[POST /auth/register + /auth/login working]
              │
              ├─────────────────────────────────────────────┐
              ▼                                             ▼
[POST /jobs working]                          [POST /resume/upload working]
(Recruiter can post)                          (Student can upload)
              │                                             │
              ▼                                             ▼
[GET /jobs — search + filter]                [POST /ai/analyze working]
(Students browse)                            (AI panel functional)
              │                                             │
              └──────────────────┬──────────────────────────┘
                                 ▼
                    [POST /applications working]
                    (Core value — student applies)
                                 │
                                 ▼
                    [PATCH /applications/:id/status]
                    (Recruiter hires)
                                 │
                                 ▼
                    [Frontend: full E2E flow tested]
                                 │
                                 ▼
                    [Render + Vercel deploy]
                                 │
                                 ▼
                    [Seed data + demo preparation]
```

**Critical path duration:** ~22h sequential. All other features (admin, analytics, About page, rate limiting) are off the critical path.

---

## 12. Blockers & Risks

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Supabase Storage CORS blocks frontend | HIGH | Medium | Set bucket policies + test file upload on Day 1 before depending on it |
| Groq API quota exhausted during demo | HIGH | Low | Use a dedicated API key. Test on Day 2. Prepare fallback mock response in ai.py for demo if needed |
| Render free tier 30–60s cold start | MEDIUM | High | Warn judges OR upgrade to Starter ($7/mo). Consider UptimeRobot ping to keep warm |
| pypdf can't extract text (image-based PDF) | MEDIUM | Medium | Test with 3 different PDFs on Day 2. Show "Text PDF required" error clearly in UI |
| Resend domain not verified | MEDIUM | Medium | Set up on Day 1 morning. If domain fails, use Resend sandbox mode — emails visible in dashboard, not delivered |
| Alembic circular FK migration fails | MEDIUM | Low | Handle FK additions as separate migration steps (see migration order in Section 8) |
| frontend/backend contract mismatch | MEDIUM | Medium | Agree on response envelope shape Day 1. Use this doc as contract. Communicate any changes immediately |
| JWT algorithm mismatch | LOW | Low | Both .env files use HS256. Cross-check on Day 1 after first login test |
| Vercel VITE_API_URL not set | LOW | Low | Double-check env vars before presenting. Test production URL explicitly |

---

### Scope Cut List (in priority order — drop these first if behind)

| Feature | What to Cut | Impact |
|---|---|---|
| Company logo upload | Skip multipart route; use placeholder avatar | Low — logos are decorative |
| Email notifications | Show "Email sent" toast without actually wiring Resend | Medium — lose a demo wow moment |
| Rate limiting | Remove slowapi | Low — not judged |
| Admin analytics page | Redirect to dashboard with same charts | Low |
| About + Contact pages | Simple static divs with placeholder text | None |
| Resume delete | Keep upload, skip delete | Low |
| Recruiter profile edit | Read-only for demo | Low |

---

## 13. Parallel Development Guide

### 13.1 What Frontend Can Build Without Backend Running

Mock data pattern — add to any api/*.js file temporarily:

```js
// Temporary mock in api/jobs.js — remove when backend is ready
export const getJobs = async (params) => {
  // return await api.get('/jobs', { params })  ← uncomment when backend ready
  return {
    success: true,
    data: MOCK_JOBS,
    pagination: { page: 1, limit: 10, total: 6, pages: 1 }
  }
}
```

| Frontend Task | Can Mock Without Backend? | Switch to Real API When |
|---|---|---|
| All ui/ components | Yes — static only | Always |
| layouts/ | Yes | Always |
| pages/public/Landing | Partially (mock 3 jobs) | Day 2 (GET /jobs ready) |
| pages/auth/Login | NO | Day 1 Block 3 |
| pages/auth/Register | NO | Day 1 Block 3 |
| Student Dashboard | Yes (mock stats + jobs) | Day 2 |
| Student Jobs search UI | Yes (mock job list) | Day 2 |
| ApplyModal UI | Yes (mock resumes dropdown) | Day 2 |
| AI Analysis panel UI | Yes (mock analysis object score=78) | Day 2 Block 8 |
| RecruiterDashboard | Yes (mock numbers) | Day 2 |
| JobForm UI | Yes (no submit) | Day 2 |
| Admin charts | Yes (mock stats object) | Day 3 |

---

### 13.2 Shared Contract — MUST Agree Day 1 and Not Change

**1. Storage key:** `cv_auth` in localStorage
**2. Header format:** `Authorization: Bearer {token}`
**3. Base URL env:** Backend exposes `/api` prefix; frontend uses `VITE_API_URL`

**4. Unified response envelope:**
```json
{ "success": true, "data": {}, "message": "OK" }
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 } }
{ "success": false, "error": "ERROR_CODE", "message": "Human readable message" }
```

**5. Date format:** ISO 8601 (`2024-01-15T10:30:00Z`) — never epoch timestamps.

**6. All enum values (must match exactly on both sides):**
```
role:          student | recruiter | admin
job_type:      full_time | part_time | internship | contract
job_status:    active | closed | draft
app_status:    applied | reviewing | shortlisted | rejected | hired
company_size:  startup | small | medium | large | enterprise
```

**7. Multipart upload field name:** `file` (lowercase)
**8. Pagination query params:** `page` (1-indexed), `limit` (default 10, max 50)

---

### 13.3 Daily Sync Protocol

**Morning standup (15 min at 09:00):**
- What did you ship yesterday?
- What are you building today?
- Any API shape changes the other needs to know?

**Evening check-in (20:00, 15 min):**
- Test the primary flow of the day together on localhost
- Note any contract violations → fix before sleeping
- Update this doc if anything changed

**Golden rule:** Never silently change an API response shape, an enum value, or the auth token format. Always tell the other developer first.
