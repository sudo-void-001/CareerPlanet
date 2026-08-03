> **CRITICAL NOTE:** This blueprint has been overridden by the [SCOPE_OPTIMIZATION_GUIDE.md](./SCOPE_OPTIMIZATION_GUIDE.md). Please ignore any features, files, or complexities (like Redis, WebSockets, advanced charts, about/contact pages, etc.) that are listed under the REMOVE sections of the optimization guide. The focus is strictly on a 3-day MVP development.

# PROJECT_STRUCTURE.md
## Career Planet — AI-Powered Job & College Placement Portal
### Version 2.0 | Final Architecture Reference

---

```
Career Planet/
│
├── README.md
│
├── docs/
│   ├── BACKEND_BLUEPRINT.md
│   ├── FRONTEND_BLUEPRINT.md
│   └── INTEGRATION_BLUEPRINT.md
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── og-image.png
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── auth.js
│   │   │   ├── jobs.js
│   │   │   ├── applications.js
│   │   │   ├── resume.js
│   │   │   ├── ai.js
│   │   │   └── admin.js
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   └── ConfirmDialog.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── ApplicationsChart.jsx
│   │   │   │   ├── JobTypeChart.jsx
│   │   │   │   └── SignupChart.jsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── JobCard.jsx
│   │   │   │   ├── JobForm.jsx
│   │   │   │   └── ApplyModal.jsx
│   │   │   │
│   │   │   └── resume/
│   │   │       ├── ResumeUpload.jsx
│   │   │       ├── ResumeCard.jsx
│   │   │       ├── ResumePreview.jsx
│   │   │       └── AIAnalysisPanel.jsx
│   │   │
│   │   ├── pages/
│   │   │   │
│   │   │   ├── public/
│   │   │   │   └── Landing.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Jobs.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   ├── Resume.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   ├── recruiter/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Jobs.jsx
│   │   │   │   ├── Applicants.jsx
│   │   │   │   ├── Company.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Jobs.jsx
│   │   │       └── Analytics.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── StudentLayout.jsx
│   │   │   ├── RecruiterLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── index.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useJobs.js
│   │   │   ├── useApplications.js
│   │   │   ├── useResume.js
│   │   │   ├── useAI.js
│   │   │   ├── useAdmin.js
│   │   │   └── useToast.js
│   │   │
│   │   ├── utils/
│   │   │   ├── format.js
│   │   │   ├── constants.js
│   │   │   └── cn.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env
│   └── .env.example
│
└── backend/
    │
    ├── app/
    │   ├── __init__.py
    │   ├── main.py
    │   │
    │   ├── api/
    │   │   ├── __init__.py
    │   │   ├── auth.py
    │   │   ├── jobs.py
    │   │   ├── applications.py
    │   │   ├── resume.py
    │   │   ├── ai.py
    │   │   └── admin.py
    │   │
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── user.py
    │   │   ├── company.py
    │   │   ├── job.py
    │   │   ├── application.py
    │   │   └── resume.py
    │   │
    │   ├── schemas/
    │   │   ├── __init__.py
    │   │   ├── auth.py
    │   │   ├── job.py
    │   │   ├── application.py
    │   │   ├── resume.py
    │   │   └── company.py
    │   │
    │   ├── services/
    │   │   ├── __init__.py
    │   │   ├── auth.py
    │   │   ├── jobs.py
    │   │   ├── applications.py
    │   │   ├── resume.py
    │   │   ├── ai.py
    │   │   ├── email.py
    │   │   └── admin.py
    │   │
    │   ├── core/
    │   │   ├── __init__.py
    │   │   ├── config.py
    │   │   ├── database.py
    │   │   ├── security.py
    │   │   └── dependencies.py
    │   │
    │   └── utils/
    │       ├── __init__.py
    │       ├── helpers.py
    │       └── constants.py
    │
    ├── uploads/
    │   └── .gitkeep
    │
    ├── migrations/
    │   ├── env.py
    │   ├── script.py.mako
    │   └── versions/
    │
    ├── requirements.txt
    ├── alembic.ini
    ├── Procfile
    ├── .env
    └── .env.example
```

---

## File Count Summary

| Layer | Files |
|---|---|
| Frontend src/ | 57 files |
| Backend app/ | 28 files |
| Docs | 3 files |
| Config files | 8 files |
| **Total** | **96 files** |

---

## Folder Purpose Reference

### Frontend

| Folder | Purpose |
|---|---|
| api/ | Axios instance + one file per backend domain |
| components/ui/ | Primitive reusable components |
| components/common/ | Layout + navigation + shared UI |
| components/auth/ | Route protection |
| components/dashboard/ | Stat cards + chart components |
| components/jobs/ | Job card, form, apply modal |
| components/resume/ | Upload, preview, AI panel |
| pages/public/ | Landing |
| pages/auth/ | Login, Register |
| pages/student/ | All 5 student pages |
| pages/recruiter/ | All 5 recruiter pages |
| pages/admin/ | All 4 admin pages |
| layouts/ | Page wrappers (sidebar + topbar) |
| routes/ | Single route definition file |
| hooks/ | Data fetching + state per domain |
| utils/ | Formatters, constants, classnames |

### Backend

| Folder | Purpose |
|---|---|
| app/api/ | Routes + request handlers (6 modules) |
| app/models/ | SQLAlchemy ORM models (5 files) |
| app/schemas/ | Pydantic request/response shapes (5 files) |
| app/services/ | Business logic (7 files) |
| app/core/ | Config, DB, security, dependencies |
| app/utils/ | Helpers + constants |
| migrations/ | Alembic version files |
| uploads/ | Local temp only (Supabase used in prod) |
