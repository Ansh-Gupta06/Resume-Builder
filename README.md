# ResumeCraft

> A production-grade, full-featured resume builder built with React, TypeScript, and Firebase — featuring 50+ professional templates, real-time editing, PDF export, and complete user account management.

![Version](https://img.shields.io/badge/version-2.0.0-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Overview

**ResumeCraft** is a modern, cloud-synced resume builder that lets users create, manage, and export professional resumes in minutes. It eliminates the friction of word processors and generic templates by offering a structured, real-time editing experience with instant live preview.

### Problem It Solves

Most resume tools are either too rigid (Google Docs/Word) or too expensive (premium SaaS tools). ResumeCraft bridges this gap by providing:

- **Structured data entry** — no blank-page anxiety; every section is guided.
- **Professional templates** — 50+ industry-specific designs out of the box.
- **Cloud sync** — resumes are always accessible, never lost.
- **One-click PDF export** — pixel-perfect A4 output from any template.

### Target Users

- Students and fresh graduates building their first resume.
- Professionals switching industries who need multiple resume variants.
- Developers and designers who want templates that reflect their field.

---

## Features

### Authentication
- Email/Password registration and login
- Google OAuth sign-in (one-click)
- Forgot password / email reset flow
- Session persistence via Firebase `onAuthStateChanged`
- Protected routes — unauthenticated users are redirected to login
- Public routes — authenticated users are redirected away from auth pages

### Resume Management
- Create multiple resumes per account
- Duplicate any resume with a single click
- Delete resumes with confirmation
- Resumes sorted by last-updated timestamp
- Real-time Firestore sync — changes persist immediately

### Resume Sections

Each resume supports the following structured sections:

| Section | Fields |
|---|---|
| Personal Info | Name, title, email, phone, location, website, LinkedIn, GitHub, summary, and more |
| Experience | Company, position, location, dates, current-role toggle, description, highlights |
| Education | Institution, degree, field, GPA, dates, highlights |
| Skills | Grouped by category with individual skill items |
| Projects | Name, description, technologies, URLs, dates |
| Certifications | Name, issuer, date, credential ID, URL |
| Languages | Language name + proficiency level |
| Awards | Title, issuer, date, description |

### Templates
- **50+ professional templates** covering a wide range of industries and styles
- Industry-specific designs: `academic`, `coder`, `developer`, `engineer`, `medical`, `legal`, `finance`, `consultant`, `designer`, `scientist`, `teacher`, and many more
- Style-driven designs: `minimal`, `modern`, `creative`, `elegant`, `executive`, `gradient`, `neon`, `retro`, `watercolor`, `infographic`, `timeline`, `two-column`, and others
- International styles: `berlin`, `euro`, `japanese`, `nordic`, `swiss`
- ATS-optimized template for applicant tracking system compatibility
- Avatar image support embedded directly into template renders

### Export
- One-click **PDF export** via `html2pdf.js` (CDN, lazy-loaded)
- A4 page dimensions (794px at 96 dpi) with clean margins
- Smart page-break logic to prevent sections from splitting across pages
- Date-stamped filename: `Resume_Title_YYYY-MM-DD.pdf`
- Off-screen DOM clone technique for accurate CSS capture
- 60-second timeout guard with descriptive error messages

### User Profile & Account Settings
- Update display name
- Upload and manage profile avatar (Firebase Storage)
- Change password with re-authentication security check
- Google OAuth users see password section hidden automatically (reactive via `onAuthStateChanged`)
- Drag-and-drop avatar upload with optimistic preview
- File validation: JPEG, PNG, WebP, GIF — max 5 MB

### Dashboard
- Overview of all user resumes
- Create new resume button
- Quick-action cards (edit, duplicate, delete)
- Empty state with call-to-action

### User Experience
- Global toast notification system (success, error, info)
- Global loading overlay for async operations
- Error boundaries to prevent full-page crashes
- `NotFoundPage` (404) for unknown routes
- Responsive sidebar + navbar layout

### Security
- Firebase Authentication for all auth flows
- Re-authentication required before sensitive operations (password change)
- Firebase Storage rules enforce `auth.uid == userId` for avatar uploads
- Firestore rules scope all resume access to the owning user's UID
- Environment variables for all configuration — no hardcoded credentials

### Performance
- Vite build with tree-shaking and code splitting
- `html2pdf.js` loaded lazily from CDN only when export is triggered
- Zustand stores with `immer` for efficient immutable state updates
- `useMemo` and `useCallback` used throughout for stable references
- Object URL revocation to prevent blob memory leaks
- Request `AbortController` with configurable timeout in the API client

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | React | 18.3.x |
| **Language** | TypeScript | 5.8.x |
| **Build Tool** | Vite | 6.x |
| **Routing** | React Router DOM | 6.30.x |
| **State Management** | Zustand | 5.x |
| **Immutable Updates** | Immer | 11.x |
| **Authentication** | Firebase Auth | 12.x |
| **Database** | Firebase Firestore | 12.x |
| **File Storage** | Firebase Storage | 12.x |
| **Styling** | Tailwind CSS | 3.4.x |
| **CSS Processing** | PostCSS + Autoprefixer | 8.x |
| **PDF Export** | html2pdf.js (CDN) | 0.10.1 |
| **Linting** | ESLint + typescript-eslint | 9.x |
| **Formatting** | Prettier | 3.x |
| **Deployment** | _TODO: add deployment platform_ | — |

---

## Architecture

ResumeCraft is a **client-side single-page application (SPA)** with Firebase as its backend-as-a-service (BaaS). There is no custom server or backend API for core functionality.

### Frontend Flow

```
User opens app
    ↓
main.tsx → App.tsx
    ↓
React Router matches route
    ↓
ProtectedRoute / PublicRoute checks authStore
    ↓
authStore.initialize() subscribes to onAuthStateChanged (once on mount)
    ↓
Page component renders
    ↓
Page dispatches action → Zustand store → Firebase service → Firestore/Auth/Storage
    ↓
Store updates → React re-renders reactively
```

### State Management

Five Zustand stores handle all application state:

| Store | Responsibility |
|---|---|
| `authStore` | Current user session, loading state, auth initialization |
| `resumeStore` | All resume data, CRUD operations, active resume selection |
| `exportStore` | PDF export status and error state |
| `toastStore` | Global notification queue |
| `uiStore` | UI flags (sidebar open/close, etc.) |

### Service Layer

All Firebase interactions are abstracted into service modules:

| Service | Responsibility |
|---|---|
| `authService.ts` | Registration, login, Google OAuth, password management, profile updates |
| `resumeService.ts` | Firestore CRUD for resumes (scoped to `users/{uid}/resumes`) |
| `storageService.ts` | Firebase Storage avatar upload with file validation |
| `exportService.ts` | PDF generation via html2pdf.js |
| `api.ts` | Generic HTTP client with Bearer token auth and timeout support (scaffolded for future REST APIs) |

### Database Interactions

Firestore data is organized as:

```
users/
  {uid}/
    resumes/
      {resumeId}/   ← Resume document (all sections stored as a single document)
```

Auth user data (display name, avatar URL) is stored directly on the **Firebase Auth user record** — not duplicated in Firestore.

---

## Folder Structure

```
Resume-Builder/
├── public/                    # Static assets served at root
├── src/
│   ├── components/            # Shared UI components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── preview/           # Resume live-preview components
│   │   ├── profile/           # Avatar, profile form, password form
│   │   ├── resume/            # Resume section editor components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── constants/             # App-wide constants (API URL, timeouts, etc.)
│   ├── hooks/                 # Custom React hooks
│   │   └── useProfile.ts      # Unified profile state management hook
│   ├── layouts/               # Page layout wrappers (AppLayout, AuthLayout)
│   ├── lib/
│   │   └── firebase.ts        # Firebase app initialization (auth, db, storage)
│   ├── pages/                 # Top-level page components
│   │   ├── DashboardPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ResumeBuilderPage.tsx
│   │   └── SignupPage.tsx
│   ├── routes/                # Route guards and router configuration
│   │   ├── ProtectedRoute.tsx # Redirects unauthenticated users to /login
│   │   ├── PublicRoute.tsx    # Redirects authenticated users to /dashboard
│   │   └── index.tsx          # Root router definition
│   ├── services/              # Firebase and external service adapters
│   │   ├── api.ts             # Generic HTTP client
│   │   ├── authService.ts     # Firebase Auth operations
│   │   ├── exportService.ts   # PDF export logic
│   │   ├── pdfConfig.ts       # html2pdf.js configuration options
│   │   ├── resumeService.ts   # Firestore resume CRUD
│   │   └── storageService.ts  # Firebase Storage avatar upload
│   ├── store/                 # Zustand global state stores
│   │   ├── authStore.ts
│   │   ├── exportStore.ts
│   │   ├── resumeStore.ts
│   │   ├── toastStore.ts
│   │   └── uiStore.ts
│   ├── styles/                # Global CSS and Tailwind config
│   ├── templates/             # 50+ resume template components
│   │   ├── registry.tsx       # Template registry (ID → component mapping)
│   │   ├── normalize.ts       # Data normalization for template rendering
│   │   ├── types.ts           # Template prop types
│   │   └── *.tsx              # Individual template files
│   ├── types/                 # TypeScript type definitions
│   │   ├── resume.ts          # Resume, Experience, Education, Skill, etc.
│   │   └── export.ts          # ExportError type
│   ├── utils/                 # Pure utility functions
│   ├── validation/            # Form validation schemas
│   ├── App.tsx                # Root component
│   └── main.tsx               # Entry point
├── .env                       # Environment variables (not committed)
├── .env.example               # Environment variable template
├── index.html                 # HTML entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Screenshots

### Home Page
> _TODO: Add screenshot_

### Dashboard
> _TODO: Add screenshot_

### Resume Builder / Editor
> _TODO: Add screenshot_

### Template Selection
> _TODO: Add screenshot_

### PDF Export Preview
> _TODO: Add screenshot_

### Profile & Account Settings
> _TODO: Add screenshot_

---

## Installation

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A **Firebase project** (free Spark plan is sufficient for Auth + Firestore; Blaze plan required for Storage)

---

### 1. Clone the Repository

```bash
git clone https://github.com/krishsaini777/Resume-Builder.git
cd Resume-Builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

Then open `.env` and replace the placeholder values with your actual Firebase config (see [Environment Variables](#environment-variables) below).

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** → Sign-in methods → **Email/Password** and **Google**.
3. Enable **Firestore Database** → Start in **Production mode**.
4. _(Optional)_ Enable **Storage** → requires Blaze (pay-as-you-go) plan.
5. Add the following **Firestore Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. _(Optional)_ Add the following **Storage Security Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run Locally

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`**.

---

## Environment Variables

Create a `.env` file in the project root. All variables must be prefixed with `VITE_` to be accessible in the Vite client bundle.

| Variable | Description | Required |
|---|---|---|
| `VITE_APP_NAME` | Application display name | ✅ Yes |
| `VITE_APP_VERSION` | Application version string | ✅ Yes |
| `VITE_API_BASE_URL` | Base URL for external REST API (future use) | ✅ Yes |
| `VITE_FIREBASE_API_KEY` | Firebase project API key | ✅ Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | ✅ Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket URL | ✅ Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID | ✅ Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ Yes |

> **⚠️ Caution:** Never commit your `.env` file to version control. The `.gitignore` should already exclude it.

### Example `.env`

```env
VITE_APP_NAME=ResumeCraft
VITE_APP_VERSION=2.0.0
VITE_API_BASE_URL=https://api.example.com

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## API Documentation

ResumeCraft uses Firebase SDKs directly for all data operations. The `api.ts` HTTP client is scaffolded for future external REST API integration.

### Firestore Operations (via `resumeService`)

| Operation | Firestore Path | Description |
|---|---|---|
| Fetch resumes | `users/{uid}/resumes` | Get all resumes, ordered by `updatedAt` desc |
| Create resume | `users/{uid}/resumes/{resumeId}` | Create new resume document |
| Update resume | `users/{uid}/resumes/{resumeId}` | Partial update with `serverTimestamp()` |
| Delete resume | `users/{uid}/resumes/{resumeId}` | Hard delete a resume document |
| Duplicate resume | `users/{uid}/resumes/{newId}` | Deep-copy a resume with a new ID |

### Auth Operations (via `authService`)

| Operation | Firebase Method | Description |
|---|---|---|
| Register | `createUserWithEmailAndPassword` | Email/password registration + display name |
| Login | `signInWithEmailAndPassword` | Email/password login |
| Google Login | `signInWithPopup` | Google OAuth popup flow |
| Logout | `signOut` | Clear Firebase session |
| Password Reset | `sendPasswordResetEmail` | Send reset link to email |
| Update Profile | `updateProfile` | Update display name and/or avatar URL |
| Change Password | `reauthenticateWithCredential` + `updatePassword` | Secure password change with re-auth |

### Storage Operations (via `storageService`)

| Operation | Path | Description |
|---|---|---|
| Upload Avatar | `avatars/{uid}/avatar.{ext}` | Upload and replace profile photo |
| Get Download URL | — | Returned after upload via `getDownloadURL` |

---

## Database Schema

ResumeCraft uses **Firebase Firestore** as its database. All data is stored as JSON documents.

### `users/{uid}/resumes/{resumeId}`

```typescript
Resume {
  id: string                   // Unique resume ID (generated client-side)
  title: string                // Resume name shown on the dashboard
  templateId: string           // Selected template identifier (e.g. "modern", "ats")
  sections: string[]           // Ordered list of active section keys
  personalInfo: PersonalInfo   // Header info: name, email, phone, summary, etc.
  experience: Experience[]     // Work history entries
  education: Education[]       // Academic history entries
  skills: Skill[]              // Skill groups with category and items
  projects: Project[]          // Portfolio project entries
  certifications: Certification[]
  languages: Language[]        // Language + proficiency level
  awards: Award[]
  createdAt: string            // ISO timestamp (set by serverTimestamp on creation)
  updatedAt: string            // ISO timestamp (updated on every save)
}
```

### Auth User Record (Firebase Authentication)

Stored natively on the Firebase Auth user — not duplicated in Firestore:

| Field | Source |
|---|---|
| `uid` | Firebase Auth |
| `email` | Firebase Auth |
| `displayName` | Firebase Auth (set via `updateProfile`) |
| `photoURL` | Firebase Auth (set via `updateProfile` after Storage upload) |
| `providerData` | Firebase Auth (email/password, Google, etc.) |

---

## Project Workflow

Here is the full data flow from first visit to resume download:

```
1. USER VISITS APP
   └── App.tsx mounts → authStore.initialize() subscribes to onAuthStateChanged

2. AUTHENTICATION
   ├── New user → SignupPage → authService.register() → Firebase Auth
   ├── Existing user → LoginPage → authService.login() / loginWithGoogle()
   └── Auth state fires → authStore sets user → ProtectedRoute allows access

3. DASHBOARD
   └── DashboardPage mounts → resumeStore.loadResumes(uid) → Firestore fetch
       └── Resumes displayed as cards

4. RESUME EDITING
   ├── User selects or creates resume → resumeStore.setActiveResume()
   ├── ResumeBuilderPage renders: editor panel + live preview
   ├── User edits a field → resumeStore action (Immer patch)
   ├── Store change → React re-renders live preview instantly
   └── Auto/manual save → resumeService.updateResume() → Firestore

5. TEMPLATE SELECTION
   └── User picks template → templateId saved to resume → preview re-renders

6. PDF EXPORT
   ├── User clicks Export → exportStore sets isExporting = true
   ├── exportService.exportToPdf() → lazy-loads html2pdf.js from CDN
   ├── Clones preview DOM element off-screen (fixed, -99999px)
   ├── Double rAF to ensure paint completion
   ├── html2pdf renders to A4 PDF → browser download triggered
   └── Clone removed from DOM → exportStore.isExporting = false

7. PROFILE MANAGEMENT
   ├── User edits display name → authService.updateUserProfile() → Firebase Auth
   ├── User uploads avatar → storageService.uploadAvatar() → Firebase Storage
   │   └── Download URL → authService.updateUserProfile(photoURL) → Firebase Auth
   └── User changes password → authService.reauthenticate() → authService.changePassword()
```

---

## AI Integration

> **Note:** This version of ResumeCraft does not include AI-powered features. The `VITE_API_BASE_URL` environment variable and the `api.ts` HTTP client are scaffolded to support a future AI integration (e.g., AI-generated resume bullet points, content suggestions, or job-description matching).
>
> **TODO:** Document AI features here once implemented.

---

## Security

The following security practices are implemented in this project:

| Practice | Implementation |
|---|---|
| **Authentication** | Firebase Auth with session persistence; all routes require a valid Firebase token |
| **Authorization** | Firestore security rules enforce `auth.uid == userId` — users can only read/write their own data |
| **Storage Authorization** | Firebase Storage rules enforce `auth.uid == userId` for avatar uploads |
| **Re-authentication** | Password changes require `reauthenticateWithCredential` before `updatePassword` |
| **Provider-aware UI** | Password section is hidden for Google OAuth users (no password provider on their account) |
| **Input Validation** | File type and size validation before upload (`validateAvatarFile`) |
| **Environment Variables** | All Firebase config values stored in `.env` — excluded from version control via `.gitignore` |
| **Request Timeouts** | All API calls have an `AbortController`-based timeout (configurable via `API_TIMEOUT_MS`) |
| **Error Boundaries** | `ErrorBoundary` component prevents cascading UI failures from crashing the app |

---

## Performance Optimizations

| Optimization | Details |
|---|---|
| **Lazy PDF Library Loading** | `html2pdf.js` is loaded from CDN only when the user triggers an export — a singleton `Promise` guard prevents duplicate script injection |
| **Immutable State with Immer** | Zustand + Immer enables surgical state updates without re-creating entire objects |
| **`useCallback` / `useMemo`** | Used throughout to maintain stable function and value references and prevent unnecessary re-renders |
| **Object URL Cleanup** | `URL.revokeObjectURL` is called via `useEffect` cleanup to prevent blob memory accumulation |
| **Vite Code Splitting** | Vite automatically splits the bundle at async boundaries; templates are isolated modules |
| **Request AbortController** | Fetch requests are aborted on timeout to free network and memory resources |
| **Double rAF for PDF** | Double `requestAnimationFrame` before PDF capture ensures the browser has fully painted — preventing blank or incomplete PDF output |

---

## Future Improvements

- [ ] **AI Content Suggestions** — AI-powered bullet point generation, summary writing, and skill recommendations based on job descriptions
- [ ] **Resume Score / ATS Checker** — Analyze resume against a job posting and suggest improvements
- [ ] **Custom Sections** — Allow users to add, remove, and reorder sections freely
- [ ] **Resume Sharing** — Generate a public read-only link for a resume
- [ ] **Version History** — Track and restore previous versions of a resume
- [ ] **Multi-language Support** — i18n for the UI and international resume formats
- [ ] **Mobile App** — React Native or PWA with offline editing support
- [ ] **Team/Organization Accounts** — Shared resume templates for companies or universities
- [ ] **More Export Formats** — DOCX, plain text, JSON export
- [ ] **Analytics Dashboard** — Track resume views and downloads

---

## Deployment

This is a static SPA — it can be deployed to any static hosting platform.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Add all `VITE_*` environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: dist
# Configure as single-page app: Yes
firebase deploy
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

> **Important:** For all platforms, configure your hosting to redirect all routes to `index.html` to support client-side routing (React Router).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository on GitHub.
2. **Create a feature branch**: `git checkout -b feat/your-feature-name`
3. **Follow the code standards**:
   - No comments or docstrings in source code
   - No unused imports or variables
   - No hardcoded values — use constants
   - All code must pass `npm run lint` with zero warnings
4. **Format your code**: `npm run format`
5. **Lint your code**: `npm run lint`
6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for refactoring
   - `chore:` for tooling/config changes
7. **Open a Pull Request** with a clear title and description.

---

## License

```
MIT License

Copyright (c) 2024 Krish Saini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Author

**Krish Saini**

- GitHub: [@krishsaini777](https://github.com/krishsaini777)
- Email: _TODO: add contact email_

---

## Acknowledgements

| Tool / Service | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [React Router DOM](https://reactrouter.com/) | Client-side routing |
| [Zustand](https://github.com/pmndrs/zustand) | Lightweight global state management |
| [Immer](https://immerjs.github.io/immer/) | Immutable state updates |
| [Firebase](https://firebase.google.com/) | Auth, Firestore database, and Storage |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) | Client-side PDF generation |
| [ESLint](https://eslint.org/) | Code linting |
| [Prettier](https://prettier.io/) | Code formatting |

---

## FAQ

<details>
<summary><strong>Is this app completely free to use?</strong></summary>

Yes. Firebase's free Spark plan covers Authentication and Firestore for hobby and small production projects. Firebase Storage (for avatar uploads) requires the Blaze (pay-as-you-go) plan, but includes a generous free tier (5 GB storage, 1 GB/day download).

</details>

<details>
<summary><strong>Can I add my own resume template?</strong></summary>

Yes. Create a new `.tsx` file in `src/templates/`, implement the `TemplateProps` interface, and register it in `src/templates/registry.tsx`. Follow the structure of any existing template as a reference.

</details>

<details>
<summary><strong>How is the PDF generated?</strong></summary>

The PDF is generated entirely in the browser using `html2pdf.js`. The live preview element is cloned, positioned off-screen, and rendered to an A4 PDF. No server is involved — the PDF is created and downloaded locally.

</details>

<details>
<summary><strong>Are my resumes private?</strong></summary>

Yes. Firestore security rules ensure each user can only read and write their own resume documents. No other user can access your data.

</details>

<details>
<summary><strong>Can I use this project for my portfolio?</strong></summary>

Yes, this project is MIT licensed. You are free to use, modify, and distribute it.

</details>

---

## Troubleshooting

<details>
<summary><strong>npm run dev fails with "Cannot find module" errors</strong></summary>

Run `npm install` first. If the issue persists, delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

</details>

<details>
<summary><strong>Firebase error: "permission-denied" when saving a resume</strong></summary>

Your Firestore Security Rules are likely in locked-down mode. Go to Firebase Console → Firestore → Rules and apply the rules provided in the [Installation](#4-set-up-firebase) section.

</details>

<details>
<summary><strong>Avatar upload is stuck on "Uploading..."</strong></summary>

Firebase Storage must be enabled in your Firebase project. This requires upgrading to the Blaze (pay-as-you-go) plan. If you skip Storage, avatar uploads will not work, but all other features remain fully functional.

</details>

<details>
<summary><strong>PDF export produces a blank or incomplete file</strong></summary>

Usually caused by an ad-blocker or browser extension blocking the CDN request for `html2pdf.js`. Disable extensions and try again. Ensure the resume preview is visible in the DOM before clicking export.

</details>

<details>
<summary><strong>Google sign-in popup is blocked</strong></summary>

Allow popups for `localhost` (or your production domain) in your browser settings and try again.

</details>

<details>
<summary><strong>LF/CRLF warnings when running git add on Windows</strong></summary>

This is a harmless Windows/Unix line-ending normalization warning from Git. Your code is unaffected. To suppress the warnings globally:

```bash
git config --global core.autocrlf true
```

</details>
