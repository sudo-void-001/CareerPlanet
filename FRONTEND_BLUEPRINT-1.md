> **CRITICAL NOTE:** This blueprint has been overridden by the [SCOPE_OPTIMIZATION_GUIDE.md](./SCOPE_OPTIMIZATION_GUIDE.md). Please ignore any features, files, or complexities (like Redis, WebSockets, advanced charts, about/contact pages, etc.) that are listed under the REMOVE sections of the optimization guide. The focus is strictly on a 3-day MVP development.

# FRONTEND_BLUEPRINT.md
## Career Planet — AI-Powered Job & College Placement Portal
### Version 2.0 | Strictly follows PROJECT_STRUCTURE.txt

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Environment Files](#2-environment-files)
3. [Design System](#3-design-system)
4. [Routing](#4-routing)
5. [Layouts](#5-layouts)
6. [API Layer](#6-api-layer)
7. [Hooks](#7-hooks)
8. [Components — ui/](#8-components--ui)
9. [Components — common/](#9-components--common)
10. [Components — auth/](#10-components--auth)
11. [Components — dashboard/](#11-components--dashboard)
12. [Components — jobs/](#12-components--jobs)
13. [Components — resume/](#13-components--resume)
14. [Pages — public/](#14-pages--public)
15. [Pages — auth/](#15-pages--auth)
16. [Pages — student/](#16-pages--student)
17. [Pages — recruiter/](#17-pages--recruiter)
18. [Pages — admin/](#18-pages--admin)
19. [Utils](#19-utils)
20. [Development Priorities & Hours](#20-development-priorities--hours)

---

## 1. Folder Structure

This is the **exact and final** frontend structure per PROJECT_STRUCTURE.txt.

```
frontend/
│
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.js              # Base instance, interceptors
│   │   ├── auth.js               # auth API calls
│   │   ├── jobs.js               # jobs API calls
│   │   ├── applications.js       # applications API calls
│   │   ├── resume.js             # resume API calls
│   │   ├── ai.js                 # AI API calls
│   │   └── admin.js              # admin API calls
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Drawer.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Navbar.jsx        # Public navbar
│   │   │   ├── Sidebar.jsx       # Dashboard sidebar
│   │   │   ├── Topbar.jsx        # Dashboard topbar
│   │   │   ├── Toast.jsx         # Toast + container
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── ApplicationsChart.jsx
│   │   │   ├── JobTypeChart.jsx
│   │   │   └── SignupChart.jsx
│   │   │
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobForm.jsx        # Shared create/edit form
│   │   │   └── ApplyModal.jsx
│   │   │
│   │   └── resume/
│   │       ├── ResumeUpload.jsx
│   │       ├── ResumeCard.jsx
│   │       ├── ResumePreview.jsx
│   │       └── AIAnalysisPanel.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Landing.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── Resume.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── recruiter/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Applicants.jsx
│   │   │   ├── Company.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── Jobs.jsx
│   │       └── Analytics.jsx
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   ├── StudentLayout.jsx
│   │   ├── RecruiterLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── routes/
│   │   └── index.jsx             # All route definitions + ProtectedRoute usage
│   │
│   ├── hooks/
│   │   ├── useAuth.js            # auth state, login, logout
│   │   ├── useJobs.js            # job fetch, filter, paginate
│   │   ├── useApplications.js    # application fetch, submit, status
│   │   ├── useResume.js          # upload, list, delete, signed URL
│   │   ├── useAI.js              # analyze, get analysis
│   │   ├── useAdmin.js           # stats, users, toggle
│   │   └── useToast.js           # add/remove toasts
│   │
│   ├── utils/
│   │   ├── format.js             # date, salary, filesize formatters
│   │   ├── constants.js          # JOB_TYPES, STATUS_COLORS, COMPANY_SIZES
│   │   └── cn.js                 # classnames helper (clsx + tailwind-merge)
│   │
│   ├── App.jsx                   # Imports routes/index.jsx
│   └── main.jsx                  # ReactDOM.createRoot, import App
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

### Structural Notes

- **`components/` has 6 groups.** Each group contains only components directly related to its domain. No catch-all folders.
- **`pages/` has 5 groups** exactly matching the PROJECT_STRUCTURE.txt spec: public, auth, student, recruiter, admin.
- **`routes/index.jsx` is one file.** All route definitions, ProtectedRoute wrappers, and redirects live here. No per-role route files.
- **`hooks/` has 7 files.** Each hook handles a single domain. No god-hook.
- **`api/` has 7 files** (axios.js + one per domain). Each exports named async functions only.

---

## 2. Environment Files

### `.env` (actual, gitignored)

```env
VITE_API_URL=http://localhost:8000/api
```

### `.env.example` (committed)

```env
# Backend API base URL
VITE_API_URL=http://localhost:8000/api
# Production: https://Career Planet-api.onrender.com/api
```

### `.gitignore` (frontend root)

```gitignore
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment secrets
.env
.env.local
.env.*.local

# Vite
*.local

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
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/

# Misc
.eslintcache
```

---

## 3. Design System

### 3.1 Color Tokens

Extended in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      bg: {
        base:     '#0F1117',   // main background
        surface:  '#1A1D27',   // cards, panels
        elevated: '#22263A',   // modals, dropdowns
        muted:    '#2A2F45',   // hover states, subtle dividers
      },
      accent: {
        DEFAULT: '#4F7EFF',    // primary CTA, links
        hover:   '#3D6AEE',
        subtle:  '#1E2D5A',    // tinted backgrounds
      },
      success:  '#22C55E',
      warning:  '#F59E0B',
      error:    '#EF4444',
      info:     '#06B6D4',
      text: {
        primary:   '#F1F3F9',
        secondary: '#8B92A9',
        muted:     '#555C75',
      },
      border: {
        DEFAULT: '#2E3347',
        focus:   '#4F7EFF',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    borderRadius: {
      card: '12px',
      btn:  '8px',
    },
    boxShadow: {
      glow: '0 0 20px rgba(79,126,255,0.2)',
    }
  }
}
```

### 3.2 Typography

```
Headings:  Inter 600/700, -0.02em tracking
Body:      Inter 400/500, 1.5 line-height
Code/IDs:  JetBrains Mono (AI scores, UUIDs)

Scale: xs=12px, sm=14px, base=16px, lg=18px, xl=20px, 2xl=24px, 3xl=30px, 4xl=36px
```

### 3.3 Component Tokens

```
Input height:    44px
Button height:   40px (default), 36px (sm), 48px (lg)
Table row:       52px
Card padding:    24px
Sidebar width:   240px
Avatar:          32px (sm), 40px (md), 56px (lg)
Border radius:   12px cards, 8px buttons/inputs, 999px badges
```

### 3.4 Status Badge Color Mapping

```
applied      → info (cyan)
reviewing    → warning (amber), animated pulse
shortlisted  → accent (blue)
rejected     → error (red)
hired        → success (green)
active job   → success
closed job   → error
draft job    → text-secondary
```

---

## 4. Routing

### `routes/index.jsx` — Complete Route Map

```jsx
// All routes defined here. App.jsx imports and renders this.

Public routes (PublicLayout):
  /                     → pages/public/Landing.jsx
  /about                → pages/public/About.jsx
  /contact              → pages/public/Contact.jsx
  /jobs                 → pages/public/Landing.jsx section or separate browse
  /jobs/:jobId          → job detail (inline in Landing or separate page)

Auth routes (no layout, centered):
  /login                → pages/auth/Login.jsx
  /register             → pages/auth/Register.jsx
  Both: redirect to role dashboard if already authenticated

Student routes (StudentLayout, role="student"):
  /student/dashboard    → pages/student/Dashboard.jsx
  /student/jobs         → pages/student/Jobs.jsx
  /student/applications → pages/student/Applications.jsx
  /student/resume       → pages/student/Resume.jsx
  /student/profile      → pages/student/Profile.jsx

Recruiter routes (RecruiterLayout, role="recruiter"):
  /recruiter/dashboard  → pages/recruiter/Dashboard.jsx
  /recruiter/jobs       → pages/recruiter/Jobs.jsx        (list + create/edit)
  /recruiter/applicants → pages/recruiter/Applicants.jsx  (with ?jobId= query param)
  /recruiter/company    → pages/recruiter/Company.jsx
  /recruiter/profile    → pages/recruiter/Profile.jsx

Admin routes (AdminLayout, role="admin"):
  /admin/dashboard      → pages/admin/Dashboard.jsx
  /admin/users          → pages/admin/Users.jsx
  /admin/jobs           → pages/admin/Jobs.jsx
  /admin/analytics      → pages/admin/Analytics.jsx

Catch-all:
  *                     → Redirect to / or 404 inline
```

### ProtectedRoute Logic (`components/auth/ProtectedRoute.jsx`)

```
Props: allowedRoles: string[]

1. Read user from useAuth()
2. If no user → <Navigate to="/login" state={{ from: location }} replace />
3. If user.role not in allowedRoles → <Navigate to={roleDashboard(user.role)} replace />
4. Else → <Outlet />

roleDashboard(role):
  student   → /student/dashboard
  recruiter → /recruiter/dashboard
  admin     → /admin/dashboard
```

### Post-Login Redirect

```
In Login.jsx, after successful auth:
1. Check location.state?.from (saved by ProtectedRoute)
2. If exists → navigate there
3. Else → navigate to roleDashboard(user.role)
```

---

## 5. Layouts

### `layouts/PublicLayout.jsx`

```
Structure:
  <Navbar />           (fixed top, 64px)
  <main>{children}</main>
  <footer>            (simple: logo + links + tagline)

Navbar items (logged out): Logo | Browse Jobs | Login | Get Started
Navbar items (logged in):  Logo | Browse Jobs | Go to Dashboard (button)
```

### `layouts/StudentLayout.jsx` / `RecruiterLayout.jsx` / `AdminLayout.jsx`

```
Desktop:
  <Sidebar role={role} />       (fixed left, 240px)
  <div>
    <Topbar />                   (fixed top, 64px, left offset 240px)
    <main>{children}</main>      (scrollable content area)
  </div>

Mobile (< 768px):
  <Topbar with hamburger />
  <Drawer><Sidebar /></Drawer>   (slides in from left)
  <main>{children}</main>        (full width)
```

### Sidebar Nav Items

**Student:**
```
Dashboard        /student/dashboard      (LayoutDashboard icon)
Browse Jobs      /student/jobs           (Briefcase icon)
Applications     /student/applications   (FileText icon)
Resume & AI      /student/resume         (Brain icon)
Profile          /student/profile        (User icon)
```

**Recruiter:**
```
Dashboard        /recruiter/dashboard    (LayoutDashboard)
My Jobs          /recruiter/jobs         (Briefcase)
Applicants       /recruiter/applicants   (Users)
Company          /recruiter/company      (Building2)
Profile          /recruiter/profile      (User)
```

**Admin:**
```
Dashboard        /admin/dashboard        (LayoutDashboard)
Users            /admin/users            (Users)
Jobs             /admin/jobs             (Briefcase)
Analytics        /admin/analytics        (BarChart2)
```

**Topbar:**
- Left: Hamburger (mobile) + current page name
- Right: Notification bell (visual only) + Avatar with dropdown (Profile link + Sign Out)

---

## 6. API Layer

### `api/axios.js`

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('cv_auth') || '{}')
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

// Response interceptor — unwrap envelope, handle 401
api.interceptors.response.use(
  (res) => res.data,   // returns { success, data, message, pagination }
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cv_auth')
      window.location.href = '/login'
    }
    return Promise.reject(err.response?.data || { message: 'Network error' })
  }
)

export default api
```

**Storage key:** `cv_auth` → `{ token: string, user: UserObject }`

---

### `api/auth.js`

```js
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)
export const getMe    = ()     => api.get('/auth/me')
export const updateProfile = (data) => api.put('/auth/profile', data)
export const setActiveResume = (resume_id) => api.patch('/auth/active-resume', { resume_id })
export const setCompany = (company_id)     => api.patch('/auth/company', { company_id })
```

### `api/jobs.js`

```js
export const getJobs       = (params)      => api.get('/jobs', { params })
export const getMyJobs     = (params)      => api.get('/jobs/mine', { params })
export const getJob        = (id)          => api.get(`/jobs/${id}`)
export const createJob     = (data)        => api.post('/jobs', data)
export const updateJob     = (id, data)    => api.put(`/jobs/${id}`, data)
export const deleteJob     = (id)          => api.delete(`/jobs/${id}`)
export const updateJobStatus = (id, status) => api.patch(`/jobs/${id}/status`, { status })
```

### `api/applications.js`

```js
export const apply           = (data)         => api.post('/applications', data)
export const getMyApps       = (params)        => api.get('/applications/mine', { params })
export const getJobApps      = (jobId, params) => api.get(`/applications/job/${jobId}`, { params })
export const updateAppStatus = (id, data)      => api.patch(`/applications/${id}/status`, data)
export const getApplication  = (id)            => api.get(`/applications/${id}`)
```

### `api/resume.js`

```js
export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getResumes   = ()         => api.get('/resume')
export const getResumeUrl = (id)       => api.get(`/resume/${id}/url`)
export const deleteResume = (id)       => api.delete(`/resume/${id}`)
```

### `api/ai.js`

```js
export const analyzeResume = (data) => api.post('/ai/analyze', data)
export const getAnalysis   = (resumeId) => api.get(`/ai/analysis/${resumeId}`)
```

### `api/admin.js`

```js
export const getStats      = ()             => api.get('/admin/stats')
export const getUsers      = (params)       => api.get('/admin/users', { params })
export const toggleUser    = (userId)       => api.patch(`/admin/users/${userId}/toggle`)
export const getAdminJobs  = (params)       => api.get('/admin/jobs', { params })
export const deleteAdminJob = (id)          => api.delete(`/admin/jobs/${id}`)
```

---

## 7. Hooks

Each hook manages loading state, error state, and calls to the corresponding api/ module.

### `hooks/useAuth.js`

```js
State (localStorage + in-memory):
  user: UserObject | null
  token: string | null
  isAuthenticated: bool
  loading: bool

Functions:
  login(credentials)    → calls api/auth.login → stores cv_auth → returns user
  register(data)        → calls api/auth.register → stores cv_auth → returns user
  logout()              → clears cv_auth → redirects /
  updateProfile(data)   → calls api/auth.updateProfile → updates stored user
  refreshUser()         → calls api/auth.getMe → syncs stored user
```

### `hooks/useJobs.js`

```js
State: jobs[], loading, error, pagination, filters

Functions:
  fetchJobs(params)     → getJobs(params) → set jobs + pagination
  fetchMyJobs(params)   → getMyJobs(params)
  createJob(data)       → createJob(data) → success callback
  updateJob(id, data)   → updateJob(id, data)
  deleteJob(id)         → deleteJob(id) → remove from list
  changeStatus(id, s)   → updateJobStatus(id, s) → update in list
  setFilters(f)         → update filters → re-fetch
```

### `hooks/useApplications.js`

```js
Functions:
  apply(data)                → apply(data) → toast + callback
  fetchMyApps(params)        → getMyApps → apps + pagination
  fetchJobApps(jobId, params) → getJobApps → apps + pagination
  changeStatus(id, data)     → updateAppStatus → update in list + toast
```

### `hooks/useResume.js`

```js
Functions:
  upload(file)           → uploadResume(FormData) → add to list
  fetchAll()             → getResumes → list
  getSignedUrl(id)       → getResumeUrl → URL string
  remove(id)             → deleteResume → remove from list
  setActive(id)          → setActiveResume
```

### `hooks/useAI.js`

```js
State: analysis, loading, error

Functions:
  analyze(resumeId, jobId?)   → analyzeResume → set analysis
  loadAnalysis(resumeId)      → getAnalysis → set analysis (cached)
```

### `hooks/useAdmin.js`

```js
Functions:
  fetchStats()           → getStats → stats object
  fetchUsers(params)     → getUsers → users + pagination
  toggle(userId)         → toggleUser → update in list
  fetchJobs(params)      → getAdminJobs → jobs + pagination
  removeJob(id)          → deleteAdminJob → remove from list
```

### `hooks/useToast.js`

```js
// Simple module-level queue, not Zustand (keeps deps minimal)
State: toasts[]

Functions:
  success(message, duration=4000)
  error(message, duration=4000)
  warning(message, duration=4000)
  info(message, duration=4000)
  remove(id)
```

---

## 8. Components — ui/

### `Button.jsx`

**Props:** `variant`, `size`, `loading`, `disabled`, `onClick`, `children`, `icon`, `className`

| Variant | Style |
|---|---|
| primary | `bg-accent hover:bg-accent-hover text-white` |
| outline | `border border-accent text-accent hover:bg-accent-subtle` |
| ghost | `text-accent hover:bg-bg-muted` |
| danger | `bg-error/10 text-error border border-error hover:bg-error/20` |

| Size | Height |
|---|---|
| sm | 36px, text-sm |
| md (default) | 40px, text-sm |
| lg | 48px, text-base |

Loading: replace children with `<Spinner size="sm" /> Loading...`, disable pointer events.

---

### `Input.jsx`

**Props:** `label`, `error`, `placeholder`, `type`, `icon`, `disabled`, `register` (RHF ref)

States:
- Default: `border-border bg-bg-surface`
- Focus: `border-border-focus ring-1 ring-border-focus`
- Error: `border-error ring-1 ring-error`
- Disabled: `opacity-50 cursor-not-allowed`

Always renders: label above (if provided), input, error message below in `text-error text-xs`.

---

### `Textarea.jsx`

Same as Input but `<textarea>`. Default `rows={4}`, resize-y.

---

### `Select.jsx`

**Props:** `label`, `error`, `options: [{value, label}]`, `placeholder`, `register`

Styled to match Input. Options from props array. Empty option for placeholder.

---

### `Badge.jsx`

**Props:** `variant`, `children`, `pulse`

Variants: `default | success | warning | error | info | accent`

All badges: pill shape, 4px 10px padding, 12px font, bg at 15% opacity + matching text.

`pulse` prop: adds CSS `animate-pulse` — used for "reviewing" status.

---

### `Card.jsx`

**Props:** `children`, `className`, `hover`, `glow`

Base: `bg-bg-surface rounded-card border border-border p-6`

`hover`: `hover:border-border-focus transition-colors cursor-pointer`
`glow`: `shadow-glow`

---

### `Modal.jsx`

**Props:** `isOpen`, `onClose`, `title`, `children`, `size`

Sizes: `sm (400px) | md (560px) | lg (720px) | full`

- Renders via React Portal into `document.body`
- Backdrop: `bg-black/60 backdrop-blur-sm`, click closes
- Animation: `motion.div` scale 0.95→1 + opacity 0→1 (Framer Motion)
- ESC key listener closes modal
- Focus trap inside modal

---

### `Drawer.jsx`

**Props:** `isOpen`, `onClose`, `title`, `children`, `side` (left|right, default right), `width`

- Renders via React Portal
- Backdrop: same as Modal
- Animation: `translateX(100%)` → `translateX(0)` (right), opposite for left
- Used for: mobile sidebar, applicant detail panel

---

### `Spinner.jsx`

**Props:** `size` (sm|md|lg), `className`

SVG circle with `animate-spin`. Sizes: sm=16px, md=24px, lg=32px. Color: `text-accent`.

---

### `Skeleton.jsx`

**Props:** `width`, `height`, `className`, `rounded`

Animated shimmer: `bg-bg-muted relative overflow-hidden` with a pseudo-element gradient sweep animation.

Preset exports:
- `Skeleton.Text` — full width, 16px height
- `Skeleton.Card` — card-shaped block
- `Skeleton.Avatar` — circle
- `Skeleton.Button` — button-shaped

---

### `EmptyState.jsx`

**Props:** `icon`, `title`, `description`, `actionLabel`, `onAction`

Centered layout: large Lucide icon (48px, `text-text-muted`), title (`text-text-primary text-lg font-semibold`), description (`text-text-secondary text-sm`), optional `Button` variant="outline".

---

## 9. Components — common/

### `Navbar.jsx`

Used by `PublicLayout`. Fixed top, 64px, `bg-bg-surface/80 backdrop-blur border-b border-border`.

**Logged out:**
- Left: "Career Planet" logo (accent text, links to /)
- Right: Browse Jobs (ghost) | Login (outline) | Get Started (primary)

**Logged in:**
- Right: Browse Jobs | Go to Dashboard (primary)

**Mobile (< 768px):** Hamburger opens full-screen menu.

---

### `Sidebar.jsx`

**Props:** `role`, `isOpen` (mobile), `onClose`

Desktop: fixed left, 240px, `bg-bg-surface border-r border-border`.

Each nav item: `flex items-center gap-3 px-4 py-2.5 rounded-btn text-sm`
- Active: `bg-accent-subtle text-text-primary border-l-4 border-accent`
- Hover: `hover:bg-bg-muted text-text-secondary`
- Framer Motion `whileHover={{ x: 2 }}`

Bottom section: User avatar + name + role badge + Sign Out button.

Mobile: renders inside `<Drawer side="left">` controlled by Topbar hamburger.

---

### `Topbar.jsx`

Fixed top, 64px, `bg-bg-surface/80 backdrop-blur border-b border-border`.

Left: Hamburger button (mobile) + page title (current route name).
Right: Bell icon (decorative) + Avatar (40px, initials fallback) + dropdown.

Avatar Dropdown:
- "View Profile" → navigate to role profile route
- `---`
- "Sign Out" → `useAuth().logout()`

---

### `Toast.jsx`

Module exports two things: `Toast` component + `ToastContainer`.

`ToastContainer`: fixed `top-4 right-4 z-50 flex flex-col gap-2`.

Each `Toast`:
- `bg-bg-elevated border border-border rounded-btn p-4 flex items-start gap-3 shadow-lg min-w-[300px]`
- Left: colored icon (CheckCircle/XCircle/AlertTriangle/Info)
- Center: message text
- Right: × close button
- Animation: `motion` slide from right, auto-dismiss after `duration` ms

---

### `Pagination.jsx`

**Props:** `page`, `totalPages`, `onPageChange`

Shows: `← Prev | 1 2 3 ... N | Next →`

Up to 5 page numbers with `...` ellipsis for large sets. Current page in accent. Disabled states at boundaries.

---

### `SearchBar.jsx`

**Props:** `value`, `onChange`, `placeholder`, `onClear`

Full-width input with Search icon (left) and clear × (right, only when value exists).

Debounce is handled in the parent page via `useEffect` + `setTimeout`.

---

### `FilterPanel.jsx`

**Props:** `filters`, `onFilterChange`, `onClear`

Used on jobs pages. Renders a set of filter controls:

| Filter | Control |
|---|---|
| Job Type | Checkbox group |
| Location | Text input |
| Remote Only | Toggle switch |
| Min Salary | Number input |
| Skills | Tag-style input |

Desktop: left sidebar panel. Mobile: renders inside a bottom Drawer triggered by "Filters" button.

Active filter count badge shown on "Filters" button when any filter is active.

---

### `ConfirmDialog.jsx`

**Props:** `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel`, `variant`

Built on `Modal.jsx`. Two buttons: `Cancel (ghost)` + `Confirm (danger or primary)`.

Used for: delete job, delete resume, close job, disable user.

---

## 10. Components — auth/

### `ProtectedRoute.jsx`

Documented in Section 4. Wraps protected route groups in `routes/index.jsx`.

---

## 11. Components — dashboard/

### `StatCard.jsx`

**Props:** `title`, `value`, `icon`, `trend`, `color`

Card showing a single metric. Icon in colored circle (accent-subtle bg). Value in large bold mono font. Optional trend (+12% ↑ in success color).

Animation: `motion.div` fade+slide up on mount with stagger via `variants`.

---

### `ApplicationsChart.jsx`

**Props:** `data: { name: string, value: number }[]`

Recharts `PieChart` + `Pie` (donut: `innerRadius=60 outerRadius=90`).

Colors mapped from STATUS_COLORS in `utils/constants.js`.

Center label: total count.

`ResponsiveContainer width="100%" height={240}`.

---

### `JobTypeChart.jsx`

**Props:** `data: { name: string, value: number }[]`

Recharts `BarChart`. X-axis: job type labels. Y-axis: count. Bar fill: `#4F7EFF`. Rounded bar tops.

`ResponsiveContainer width="100%" height={200}`.

---

### `SignupChart.jsx`

**Props:** `data: { date: string, count: number }[]`

Recharts `LineChart`. X-axis: dates (formatted as "Jan 1"). Y-axis: signups. Smooth `monotone` curve. Gradient fill under line.

`ResponsiveContainer width="100%" height={200}`.

---

## 12. Components — jobs/

### `JobCard.jsx`

**Props:** `job`, `onApply`, `showApplyButton`, `compact`

**Full variant:**
```
Card (hover enabled)
├── Top row: Company logo (Avatar, 40px) + Company name + JobType Badge
├── Job title (text-lg font-semibold, clickable if onTitleClick)
├── Location chip + Remote badge (if is_remote)
├── Skills row: max 4 chips, "+N more" overflow
├── Salary: "₹{min}–{max}/mo" or "Not disclosed"
├── Posted: relative time (e.g. "2 days ago")
└── Bottom: "View Details" (ghost) + "Apply Now" (primary, if showApplyButton)
```

**Compact variant** (`compact` prop): title + company + type badge + Apply button only.

---

### `JobForm.jsx`

**Shared create/edit form component.** Used inside both recruiter/Jobs.jsx (create mode) and edit mode.

**Props:** `initialData`, `onSubmit`, `loading`

**All fields:**

| Field | Type | Placeholder | Validation | Required |
|---|---|---|---|---|
| Job Title | Input | e.g. Frontend Developer | min 3, max 200 | Yes |
| Job Type | Select | Select type | must select | Yes |
| Description | Textarea | Detailed job description | min 50 | Yes |
| Requirements | Textarea | What candidates need | — | No |
| Responsibilities | Textarea | Day-to-day tasks | — | No |
| Skills Required | Tag input (custom) | Type skill + Enter | max 20 | No |
| Location | Input | e.g. Bangalore | — | No |
| Remote | Toggle | — | — | No |
| Min Salary (₹/mo) | Input[number] | 30000 | positive | No |
| Max Salary (₹/mo) | Input[number] | 60000 | ≥ min salary | No |
| Min Experience (yrs) | Input[number] | 0 | 0–20 | No |
| Max Experience (yrs) | Input[number] | — | ≥ min | No |
| Openings | Input[number] | 1 | min 1 | No |
| Deadline | Input[date] | Pick date | future | No |
| Status | Radio group | Active / Save as Draft | — | Yes |

**Tag Input for skills:**
- Text input → Enter adds chip
- Each chip has × remove
- Chips array stored in RHF `Controller`

**Bottom buttons:**
- "Publish Job" (primary) → status=active → submit
- "Save as Draft" (outline) → status=draft → submit
- "Cancel" (ghost) → onCancel callback

**Form Library:** React Hook Form + Zod validation.

---

### `ApplyModal.jsx`

**Props:** `isOpen`, `onClose`, `job`, `onSuccess`

Built on `Modal.jsx` (size="md").

**Form:**

| Field | Type | Validation |
|---|---|---|
| Resume | Select (from uploaded resumes) | required |
| Cover Letter | Textarea | optional, max 2000 |

If no resumes uploaded:
- Show amber warning: "No resume uploaded. Upload one first."
- Link navigates to `/student/resume`

**Buttons:**
- "Submit Application" (primary, loading state)
- "Cancel" (ghost)

**API:** `POST /api/applications`
**Success:** close modal → `onSuccess()` → toast "Application submitted!"
**Failure:** toast error message inline

---

## 13. Components — resume/

### `ResumeUpload.jsx`

**Props:** `onUpload`

Drag-and-drop zone:
- Dashed border `border-2 border-dashed border-border hover:border-border-focus`
- Inner: Upload icon + "Drag your resume here or click to browse"
- Accepted: PDF only
- Shows filename + size preview after file selected (before upload)
- Upload progress bar (0→100%, uses axios `onUploadProgress`)
- "Upload" button appears after file selection

Client-side validation before upload:
- `file.type !== 'application/pdf'` → toast "Only PDF files accepted"
- `file.size > 5242880` → toast "File must be under 5MB"

**API:** `POST /api/resume/upload`
**Success:** `onUpload(resumeData)` callback + toast "Uploaded!"

---

### `ResumeCard.jsx`

**Props:** `resume`, `isActive`, `onSetActive`, `onPreview`, `onDelete`, `onAnalyze`

```
Card (border: active → accent, default → border)
├── Left: PDF icon + file name + file size (formatted)
├── "Primary" badge if isActive
├── Uploaded: relative date
└── Actions row:
    ├── Preview button (outline sm)
    ├── Analyze button (accent sm)
    ├── Set Primary (ghost sm, hidden if already primary)
    └── Delete (ghost sm, text-error)
```

---

### `ResumePreview.jsx`

**Props:** `isOpen`, `onClose`, `resumeUrl`, `fileName`

Built on `Modal.jsx` (size="lg" or "full" on mobile).

Content:
- `<iframe src={resumeUrl} width="100%" height="600px" />`
- Fallback if iframe blocked: "Preview unavailable" + Download button
- "Download" button: `window.open(resumeUrl, '_blank')`
- Close button top-right

---

### `AIAnalysisPanel.jsx`

**Props:** `analysis`, `loading`, `onAnalyze`, `resumes`, `jobs`

**States:**

**Empty (no analysis):**
```
EmptyState:
  icon: Brain
  title: "No Analysis Yet"
  description: "Select a resume and click Analyze to get AI insights"
  actionLabel: "Analyze Now" → calls onAnalyze with selected resume
```

**Loading:**
```
Centered spinner + "Analyzing your resume..." text (animated dots)
Framer Motion pulse on the Brain icon
```

**Populated:**
```
Match Score Ring (SVG, animated)
  ├── 0–40: error color
  ├── 41–70: warning color
  └── 71–100: success color
  Center: score in font-mono text-4xl

Candidate Summary: text block, text-text-secondary

Strengths section:
  "✓ Detected Skills" heading
  Green pill chips for each strength

Missing Skills section:
  "⚠ Skill Gaps" heading
  Red/error pill chips for each gap

Recommendations section:
  Numbered list of actionable items
  Each: text-sm text-text-secondary with accent bullet
```

**Job Match Toggle:**
```
Toggle: "Analyze against a specific job"
When on: Select dropdown populated with recruiter's jobs (fetched via GET /jobs?limit=20)
Selecting a job includes job_id in next analyze call
```

**Match Score Ring** (inline SVG):
```
Circle: cx=60 cy=60 r=50
Circumference: 2π×50 = 314.16
strokeDasharray: 314.16
strokeDashoffset: 314.16 × (1 - score/100)
  → Animated via Framer Motion on mount: offset starts at 314.16, animates to calculated value
  → duration: 0.8s, ease: "easeOut"
```

---

## 14. Pages — public/

### `Landing.jsx`

**Purpose:** Convert visitors. Demonstrate platform value. Drive registrations.

**Layout sections (vertical):**

#### Hero Section

```
Background: dark gradient + subtle animated CSS grid pattern
Content (centered):
  Eyebrow: "AI-Powered · Campus Placement · Career Launch"  (Badge, accent)
  Headline: "Your Career Starts Here."  (text-4xl font-bold)
  Subline: "AI-powered matching. Real opportunities. One platform."  (text-text-secondary)
  CTA row: [Get Started — Free] (primary lg) + [Browse Jobs →] (outline lg)
  Social proof: "Trusted by 10,000+ students across 500+ campuses"  (muted text)

Animations:
  - Headline: staggered word fade-up (Framer Motion)
  - CTA buttons: fade-in delay 400ms
  - Background: CSS keyframe gradient shift
```

**Buttons:**

| Button | Action | API |
|---|---|---|
| Get Started — Free | navigate('/register') | — |
| Browse Jobs → | navigate('/student/jobs') or scroll to jobs section | — |

#### Stats Bar

```
4 animated counters (useInView trigger on scroll):
  10,000+ Students  |  500+ Companies  |  1,200+ Placements  |  AI-Powered Matching

Animation: count from 0 to value over 1.5s when section enters viewport
```

#### How It Works (3 steps)

```
Horizontal cards (desktop), vertical (mobile):
  1. Create Profile  → icon: UserPlus  → "Set up your student or recruiter profile in minutes"
  2. Browse & Apply  → icon: Search   → "Search AI-matched jobs, upload your resume, apply instantly"
  3. Get Hired       → icon: Trophy   → "Track applications, get status updates, land your role"

Animation: cards slide in from bottom staggered
```

#### Role Cards

```
Two cards side by side:
  For Students:                    For Recruiters:
  ─────────────────────           ─────────────────────
  AI Resume Analysis               Smart Candidate Search
  Job Match Score                  Application Pipeline
  Application Tracking             Email Notifications
  [Join as Student →]              [Join as Recruiter →]
```

**Buttons:**

| Button | Action |
|---|---|
| Join as Student → | navigate('/register') with state { role: 'student' } |
| Join as Recruiter → | navigate('/register') with state { role: 'recruiter' } |

#### Featured Jobs (3 latest)

```
API call: GET /api/jobs?limit=3&status=active (on mount)
Renders: 3 JobCard (compact) in a grid
"View All Jobs →" link below
Loading: 3 Skeleton.Card
```

#### Footer

```
Logo + tagline: "Connecting students, recruiters, and colleges with AI."
Links: Browse Jobs | Login | Register
Copyright line
```

---

### `About.jsx`

Simple static page. Mission statement, team section (placeholder avatars + names), tech stack used. No API calls.

---

### `Contact.jsx`

Simple static page. Contact form (name, email, message) — on submit, shows success message inline. No real API integration needed for demo.

---

## 15. Pages — auth/

### `Login.jsx`

**Purpose:** Authenticate users and redirect to role dashboard.

**Layout:** Centered card on `bg-bg-base`. Split on lg screens: left decorative panel + right form.

**Left Panel (lg+):**
- "Career Planet" logo large
- "Connect. Apply. Get Hired."
- 3 stats chips (static for demo)

**Right Panel — Form:**

| Field | Type | Placeholder | Validation | Required |
|---|---|---|---|---|
| Email | email | you@example.com | valid email | Yes |
| Password | password | Enter your password | min 1 char | Yes |

**Buttons:**

| Button | Location | Action | API | Success | Failure |
|---|---|---|---|---|---|
| Sign In | Below form | Submit | POST /api/auth/login | Store token → role redirect | Toast "Invalid email or password" |
| Forgot password | Below password field | toast "Coming soon" | — | — | — |

**Below form:** "Don't have an account? Register here" → /register

**Success flow:** `useAuth().login(creds)` → store `cv_auth` → navigate to role dashboard.

**Animation:** Card `motion.div` fade + translateY on mount.

---

### `Register.jsx`

**Purpose:** Create student or recruiter account.

**Layout:** Same split-panel.

**Form:**

| Field | Type | Placeholder | Validation | Required |
|---|---|---|---|---|
| Full Name | text | Your full name | min 2, max 100 | Yes |
| Email | email | you@example.com | valid email | Yes |
| Password | password | Create a password | min 8, 1 uppercase, 1 number | Yes |
| Confirm Password | password | Repeat password | must match | Yes |

**Role Toggle:** Two large selectable cards:
- "Student" + graduation icon + "Find jobs and internships"
- "Recruiter" + briefcase icon + "Post jobs and hire talent"
- Selected: `border-accent bg-accent-subtle`

**Pre-fill role from navigation state** (`location.state?.role`) if coming from Landing role cards.

**Buttons:**

| Button | Action | API | Success | Failure |
|---|---|---|---|---|
| Create Account | Submit | POST /api/auth/register | Store token → role redirect | Toast specific error |

---

## 16. Pages — student/

### `student/Dashboard.jsx`

**Purpose:** Activity overview, application stats, job recommendations.

**API calls on mount:**
1. `GET /api/applications/mine?limit=5` — recent apps + derive stats
2. `GET /api/jobs?limit=3&status=active` — recommended jobs
3. Stats derived client-side from applications response (count by status)

**Layout:**
```
Welcome banner: "Welcome back, {name} 👋"
Profile completion nudge (conditional — if skills/college/resume missing)

Row 1: 4 StatCards
  Total Applications | Shortlisted | Hired | Active Jobs (from jobs pagination.total)

Row 2: ApplicationsChart (donut) + Recent Applications table (5 rows)

Row 3: Recommended Jobs (3 JobCard compact)
```

**Profile Completion Nudge:**
- Shown if: `!user.skills.length || !user.college || !user.active_resume_id`
- Yellow/warning card: "Complete your profile to get better job matches"
- Button: "Complete Profile" → navigate('/student/profile')

**Recent Applications table columns:** Job Title | Company | Applied | Status Badge

**Buttons:**

| Button | Location | Action |
|---|---|---|
| Complete Profile | Nudge banner | navigate('/student/profile') |
| View All Applications | Below table | navigate('/student/applications') |
| Apply Now | Recommended job cards | Opens ApplyModal |
| Browse All Jobs | Below job cards | navigate('/student/jobs') |

**Loading:** 4 StatCard skeletons + 5 table row skeletons + 3 JobCard skeletons.

**Empty state (no apps):** EmptyState "You haven't applied anywhere yet" + "Browse Jobs" button.

**Estimated Hours:** 4h

---

### `student/Jobs.jsx`

**Purpose:** Browse, search, filter, and apply to all active jobs.

**Layout:**
```
Desktop:
  SearchBar (full width, top)
  Active filter chips row
  [FilterPanel 280px fixed left] | [Results: sort header + JobCards grid + Pagination]

Mobile:
  SearchBar
  [Filters button (shows count badge)] → opens FilterPanel in bottom Drawer
  Full-width JobCards
  Pagination
```

**Search:** `onChange` → debounced 400ms → re-fetch.

**Sort dropdown:** "Newest First" | "Salary: High to Low"

**API call:** `GET /api/jobs?{all params}` on mount and every filter/page change.

**On "Apply Now":** Opens `ApplyModal`. On success: button changes to "Applied" (disabled, success variant).

**Applied state tracking:** local set of applied job IDs, updated on successful application.

**Buttons:**

| Button | Location | Action | API |
|---|---|---|---|
| Apply Now | Each JobCard | Open ApplyModal | POST /api/applications |
| View Details | Each JobCard | navigate to job detail (inline route or /jobs/:id) | GET /api/jobs/:id |
| Clear Filters | Filter panel | Reset all filters + re-fetch | — |
| Filters (mobile) | Top bar mobile | Open FilterPanel Drawer | — |

**Loading:** 6 `Skeleton.Card` in grid.
**Empty:** EmptyState "No jobs match your filters" + "Clear Filters" button.

**Estimated Hours:** 5h

---

### `student/Applications.jsx`

**Purpose:** Track all application history with status.

**Layout:** Status filter tabs at top + ApplicationCard list + Pagination.

**Status filter tabs:** All | Applied | Reviewing | Shortlisted | Rejected | Hired
(Tab-style, not dropdown — better visual clarity)

**API call:** `GET /api/applications/mine?status=X&page=Y`

**ApplicationCard (inline component, not shared):**
```
Card:
  Left: Company logo + name + job title (link)
  Right: Status Badge + Applied date
  Below: Cover letter preview (truncated, expandable)
  Action: "View Job" ghost button
```

**Status tabs badge counts:** Derive from first full fetch (no filter).

**Loading:** 5 ApplicationCard skeletons.
**Empty (all):** EmptyState "No applications yet" + "Browse Jobs" button.
**Empty (filter):** EmptyState "No {status} applications."

**Estimated Hours:** 2.5h

---

### `student/Resume.jsx`

**Purpose:** Upload resumes, view them, set primary, and get AI analysis.

**Layout:**
```
Desktop: two columns (50/50)
  Left:  Resume Management
  Right: AI Analysis Panel

Mobile: two tabs (Resumes | AI Analysis)
```

**Left Column:**
```
ResumeUpload component (top)
ResumeCard list (below, sorted by uploaded_at desc)
Max 3 resumes shown; 4th triggers warning "Delete one to upload more" (soft limit for demo)
```

**ResumeCard actions wired:**
- Preview → `getSignedUrl(id)` → opens `ResumePreview`
- Analyze → triggers AI analysis, switches to right panel
- Set Primary → `setActive(id)` → `badge updates`
- Delete → `ConfirmDialog` → `remove(id)`

**Right Column:**
```
AIAnalysisPanel:
  - Default: EmptyState "Select a resume and click Analyze"
  - After clicking Analyze on a card: loading → results
  - Job match toggle + job selector dropdown
```

**API calls on mount:**
1. `GET /api/resume` — load all resumes
2. For each resume: `GET /api/ai/analysis/:id` — load cached analysis (if exists)

**Estimated Hours:** 5h

---

### `student/Profile.jsx`

**Purpose:** View and edit profile — personal, academic, social links.

**Layout:**
```
Profile card (full width):
  [Avatar circle — initials fallback] | Name | Role Badge | College
  [Edit Profile button — top right]

Below in 2 columns:
  Left: Personal (name, phone, bio) + Academic (college, degree, year, CGPA)
  Right: Skills chips + Social links (LinkedIn, GitHub, Portfolio)
```

**Edit mode:** Toggle on "Edit Profile" button. All fields become inputs. Save/Cancel buttons appear.

**Edit form — all from `UserUpdate` schema:**

| Field | Type | Placeholder | Validation |
|---|---|---|---|
| Full Name | Input | Your name | min 2 |
| Phone | Input | +91 99999 99999 | optional |
| Bio | Textarea | Brief intro | max 300 |
| College | Input | Your institution | — |
| Degree | Input | B.E. Computer Science | — |
| Graduation Year | Input[number] | 2025 | 2015–2035 |
| CGPA | Input[number] | 8.5 | 0–10 |
| LinkedIn | Input | https://linkedin.com/in/... | valid URL |
| GitHub | Input | https://github.com/... | valid URL |
| Portfolio | Input | https://yoursite.com | valid URL |

**Skills section:**
- View mode: colored pill chips
- Edit mode: chips + inline input (type + Enter to add, × to remove)
- Max 20 skills

**Buttons:**

| Button | Action | API | Success |
|---|---|---|---|
| Edit Profile | Enter edit mode | — | — |
| Save Changes | Submit | PUT /api/auth/profile | Toast "Profile updated" + exit edit |
| Cancel | Discard + exit edit | — | — |

**Estimated Hours:** 3h

---

## 17. Pages — recruiter/

### `recruiter/Dashboard.jsx`

**Purpose:** Overview of job pipeline, application activity, quick actions.

**API calls:**
1. `GET /api/jobs/mine?limit=3` — recent jobs
2. `GET /api/auth/me` — check company linkage

**Stats derived from my-jobs response:** total jobs, total applications (sum), shortlisted count, hired count.

**Layout:**
```
Welcome + company name + [Post a Job] button (top right)
No-company banner (if company_id is null)

Row 1: 4 StatCards (My Jobs | Total Applications | Shortlisted | Hired)

Row 2: ApplicationsChart (by status across all my jobs) | My Recent Jobs table

Recent Jobs table: Title | Type | Applications | Status | Actions (View Applicants link)
```

**No Company Banner:**
- Amber warning: "Set up your company profile before posting jobs"
- Button: "Set Up Company" → navigate('/recruiter/company')

**Buttons:**

| Button | Location | Action |
|---|---|---|
| Post a Job | Top right | navigate('/recruiter/jobs') and open create mode |
| Set Up Company | Banner | navigate('/recruiter/company') |
| View Applicants | Jobs table | navigate('/recruiter/applicants?jobId={id}') |

**Estimated Hours:** 3h

---

### `recruiter/Jobs.jsx`

**Purpose:** Manage all posted jobs + create/edit inline.

**Two modes controlled by local state `mode: 'list' | 'create' | 'edit'`:**

**List mode (default):**
```
Header: "My Job Postings" + [+ Post New Job] button
Search + Status filter (All | Active | Closed | Draft)

Table columns:
  Title | Type Badge | Applications | Deadline | Status Badge | Actions

Row actions:
  Edit icon → switch to 'edit' mode
  View Applicants → navigate('/recruiter/applicants?jobId={id}')
  Close/Activate toggle → PATCH /api/jobs/:id/status
  Delete → ConfirmDialog → DELETE /api/jobs/:id
```

**Create mode:**
```
Header: "← Back to Jobs" + "Post New Job"
JobForm component (empty)
On submit success → back to list mode + toast "Job published!"
```

**Edit mode:**
```
Header: "← Back to Jobs" + "Edit Job"
JobForm component (prefilled with job data)
On submit success → back to list mode + toast "Job updated!"
```

**Buttons:**

| Button | Action | API |
|---|---|---|
| + Post New Job | Switch to create mode | — |
| Edit (row) | Switch to edit mode with job data | GET /api/jobs/:id (prefill) |
| View Applicants | navigate with jobId | — |
| Close Job | ConfirmDialog → status=closed | PATCH /api/jobs/:id/status |
| Delete | ConfirmDialog | DELETE /api/jobs/:id |
| Save as Draft | Submit form status=draft | POST/PUT /api/jobs |
| Publish Job | Submit form status=active | POST/PUT /api/jobs |

**Estimated Hours:** 4h

---

### `recruiter/Applicants.jsx`

**Purpose:** Review all candidates for a job, update statuses. Core hiring tool.

**URL:** `/recruiter/applicants?jobId={id}` — job selected via query param or dropdown.

**Layout:**
```
Header: Job selector dropdown (lists recruiter's jobs) + "{N} Applications"
Status filter tabs: All | Applied | Reviewing | Shortlisted | Rejected | Hired

Candidates table:
  Candidate (avatar + name + college) | Applied | Status (inline dropdown) | Actions

Row actions:
  "View Details" → opens ApplicantDrawer (right side)
```

**Inline Status Dropdown:**
- Each row has a `<Select>` showing current status
- `onChange` → immediately calls `PATCH /api/applications/:id/status`
- Row highlight color updates to match new status

**ApplicantDrawer (right side, 480px):**
```
Student name + avatar + Role badge
College | Degree | CGPA
Skills chips
LinkedIn + GitHub links (if provided)
Cover letter text (if provided)
"View Resume" button → opens ResumePreview with signed URL
"─────────────────"
AI Analysis section:
  If analyzed: MatchScoreRing + strengths + missing skills
  If not: "Resume not yet analyzed" (informational)
Status update buttons: [Reviewing] [Shortlisted] [Rejected] [Hired]
  → Clicking updates status inline
```

**API calls:**
- Mount: `GET /api/jobs/mine` (populate job selector) + `GET /api/applications/job/{jobId}`
- Status change: `PATCH /api/applications/:id/status`
- View Resume: `GET /api/resume/:id/url`
- AI check: `GET /api/ai/analysis/:resumeId` (per applicant drawer open)

**Estimated Hours:** 5h

---

### `recruiter/Company.jsx`

**Purpose:** Create or edit company profile.

**On mount:** Check `user.company_id`. If set → fetch company + show view/edit mode. If not → show create form.

**View mode:**
```
Card:
  [Logo 80px] | Company name (text-2xl) | Industry | Size badge
  Location + Website link
  Description paragraph

[Edit Company] button top-right
```

**Create / Edit form (same `CompanyForm` inline component):**

| Field | Type | Placeholder | Validation | Required |
|---|---|---|---|---|
| Company Name | Input | e.g. Acme Corp | min 2, max 200 | Yes |
| Industry | Input | e.g. Technology | — | No |
| Website | Input | https://acme.com | valid URL | No |
| Location | Input | e.g. Bangalore, India | — | No |
| Size | Select | Select company size | — | No |
| Description | Textarea | About your company | max 500 | No |

**Logo Upload (only in edit mode):**
- Image input area: click to browse (PNG/JPG/SVG, max 2MB)
- Preview current logo above upload area
- On select: immediately POST `/api/companies/:id/logo` (multipart)
- Logo preview updates on success

**Buttons:**

| Button | Action | API | Success |
|---|---|---|---|
| Create Company | Submit create form | POST /api/companies + PATCH /api/auth/company | Toast + view mode |
| Save Changes | Submit edit | PUT /api/companies/:id | Toast "Updated" |
| Edit Company | Enter edit mode | — | — |
| Cancel | Exit edit mode | — | — |

**Note:** Company creation flow:
1. POST `/api/companies` → get company.id
2. PATCH `/api/auth/company` with company.id → links recruiter

**Estimated Hours:** 3h

---

### `recruiter/Profile.jsx`

Same layout as student/Profile.jsx.

**Editable fields (recruiter-specific):**
- Full Name, Phone, Bio, Designation, LinkedIn, GitHub

**Company card** (read-only in profile, links to /recruiter/company):
- Shows company name + industry if linked
- "Manage Company →" link

**API:** `PUT /api/auth/profile` (same endpoint, different fields filled).

**Estimated Hours:** 2h

---

## 18. Pages — admin/

### `admin/Dashboard.jsx`

**Purpose:** Platform-wide health metrics overview.

**API:** `GET /api/admin/stats` on mount.

**Layout:**
```
Row 1: 7 StatCards
  Total Users | Students | Recruiters | Companies | Jobs | Applications | Hired

Row 2: SignupChart (7-day line) + ApplicationsChart (donut by status)

Row 3: JobTypeChart (bar) + Top stats table (most-applied jobs — derived from stats)
```

**Loading:** All cards and charts show Skeleton variants.

**Estimated Hours:** 3h

---

### `admin/Users.jsx`

**Purpose:** View and manage all registered users.

**Layout:**
```
Header: "All Users"
Search bar + Role filter (All | Student | Recruiter | Admin) + Status filter (All | Active | Disabled)

Table:
  Name (avatar + full_name + email) | Role Badge | Joined Date | Status Badge | Action

Actions:
  Active user: "Disable" button (outline danger sm) → ConfirmDialog → PATCH /toggle
  Disabled user: "Enable" button (outline success sm) → PATCH /toggle
```

**API calls:**
- Mount + filter: `GET /api/admin/users?role=X&is_active=Y&search=Z&page=N`
- Toggle: `PATCH /api/admin/users/:id/toggle`

**Estimated Hours:** 2.5h

---

### `admin/Jobs.jsx`

**Purpose:** Oversight of all job postings.

**Layout:** Same table pattern as Users.

**Table:** Title | Company | Type Badge | Status Badge | Posted By | Applications | Actions

**Actions:** Delete job → ConfirmDialog → `DELETE /api/admin/jobs/:id`

**API calls:**
- `GET /api/admin/jobs?status=X&page=N`
- `DELETE /api/admin/jobs/:id`

**Estimated Hours:** 2h

---

### `admin/Analytics.jsx`

**Purpose:** Deeper platform metrics (reuses charts from Dashboard with more data).

**Layout:**
```
Row 1: SignupChart (30 days, wider)
Row 2: ApplicationsChart + JobTypeChart side by side
Row 3: Stats summary table (all key counts in tabular form)
```

**API:** `GET /api/admin/stats` (same endpoint, renders more charts).

**Note:** Reuses all `dashboard/` chart components. No new components needed.

**Estimated Hours:** 1.5h

---

## 19. Utils

### `utils/format.js`

```js
export const formatDate = (iso) => /* "Jan 15, 2024" */
export const formatRelativeDate = (iso) => /* "2 days ago" */
export const formatSalary = (min, max) => {
  if (!min && !max) return "Not disclosed"
  if (min && max) return `₹${(min/1000).toFixed(0)}k–₹${(max/1000).toFixed(0)}k/mo`
  if (min) return `₹${(min/1000).toFixed(0)}k+/mo`
}
export const formatFileSize = (bytes) => /* "2.4 MB" */
export const getInitials = (name) => /* "RK" from "Rajesh Kumar" */
```

### `utils/constants.js`

```js
export const JOB_TYPES = [
  { value: 'full_time',  label: 'Full Time' },
  { value: 'part_time',  label: 'Part Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract',   label: 'Contract' },
]

export const APP_STATUSES = [
  { value: 'applied',     label: 'Applied',     color: 'info' },
  { value: 'reviewing',   label: 'Reviewing',   color: 'warning', pulse: true },
  { value: 'shortlisted', label: 'Shortlisted', color: 'accent' },
  { value: 'rejected',    label: 'Rejected',    color: 'error' },
  { value: 'hired',       label: 'Hired',       color: 'success' },
]

export const COMPANY_SIZES = [
  { value: 'startup',    label: 'Startup (1–10)' },
  { value: 'small',      label: 'Small (11–50)' },
  { value: 'medium',     label: 'Medium (51–200)' },
  { value: 'large',      label: 'Large (201–1000)' },
  { value: 'enterprise', label: 'Enterprise (1000+)' },
]

export const JOB_STATUSES = [
  { value: 'active', label: 'Active',     color: 'success' },
  { value: 'closed', label: 'Closed',     color: 'error' },
  { value: 'draft',  label: 'Draft',      color: 'default' },
]

export const ROLE_DASHBOARDS = {
  student:   '/student/dashboard',
  recruiter: '/recruiter/dashboard',
  admin:     '/admin/dashboard',
}
```

### `utils/cn.js`

```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...inputs) => twMerge(clsx(inputs))
```

---

## 20. Development Priorities & Hours

### P0 — Day 1 (Foundation)

| Task | Hours |
|---|---|
| Vite setup, Tailwind config, design tokens | 1h |
| api/axios.js + all api/*.js stubs | 1h |
| utils/ files (format, constants, cn) | 0.5h |
| routes/index.jsx skeleton | 0.5h |
| ui/ components: Button, Input, Textarea, Select, Badge, Card | 2h |
| ui/ components: Modal, Drawer, Spinner, Skeleton, EmptyState | 1.5h |
| common/: Navbar, Sidebar, Topbar | 2h |
| common/Toast.jsx + useToast.js | 0.5h |
| layouts/ (all 4) | 1h |
| auth/ProtectedRoute + hooks/useAuth.js | 1h |
| pages/auth/Login.jsx + Register.jsx | 2.5h |
| **Day 1 Total** | **13.5h** |

### P1 — Day 2 (Core Features)

| Task | Hours |
|---|---|
| pages/public/Landing.jsx (all sections + animations) | 3h |
| components/jobs/JobCard.jsx | 0.5h |
| hooks/useJobs.js + api/jobs.js | 0.5h |
| pages/student/Jobs.jsx (full search/filter/apply) | 3h |
| components/jobs/ApplyModal.jsx | 1h |
| common/FilterPanel.jsx + SearchBar.jsx + Pagination.jsx | 1.5h |
| components/dashboard/ (all 4 chart components) | 1.5h |
| pages/student/Dashboard.jsx | 2h |
| pages/student/Applications.jsx | 1.5h |
| pages/student/Profile.jsx | 2h |
| pages/recruiter/Dashboard.jsx | 2h |
| **Day 2 Total** | **19h** |

### P2 — Day 3 (Polish + Remaining)

| Task | Hours |
|---|---|
| components/resume/ (all 4 components incl. AI panel) | 4h |
| pages/student/Resume.jsx | 2h |
| components/jobs/JobForm.jsx | 2h |
| pages/recruiter/Jobs.jsx (list + create + edit) | 2h |
| pages/recruiter/Applicants.jsx + Drawer | 3h |
| pages/recruiter/Company.jsx + Profile.jsx | 2h |
| pages/admin/ (all 4) | 3h |
| pages/public/About.jsx + Contact.jsx | 0.5h |
| Mobile responsive fixes sweep | 1.5h |
| Framer Motion animation sweep | 1h |
| Vercel deploy + env var | 0.5h |
| **Day 3 Total** | **21.5h** |

**Total Frontend: ~54h across 3 days**
