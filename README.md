# HireFlow - Smart Recruitment Platform
> **MERN Stack Edition (MongoDB, Express.js, React, Node.js)**  
> Intelligent recruitment management platform with AI-assisted qualification analysis, independent CV preservation, and human-in-the-loop workflows.

---

## 🌟 Overview & Highlights

**HireFlow** is a full-stack recruitment platform designed to simplify hiring workflows, bridge candidates and employers, and assist recruiters in reviewing candidate qualifications through explainable AI.

### 🔑 Core Principles & Key Features

1. **Strict MERN Stack Architecture**:
   - **Database**: MongoDB (Mongoose ODM) with collections for Users, Jobs, Applications, and Notifications.
   - **Backend**: Node.js & Express.js REST API with JWT authentication, Multer document handling, and an embedded AI service layer.
   - **Frontend**: React.js (Vite + Tailwind CSS + Lucide Icons) with functional components, custom hooks, and React Router DOM.
   - **AI Module**: Seamless dual-engine design supporting Google Gemini API (`gemini-1.5-flash`) or an intelligent local NLP & rule matching engine fallback.

2. **Role-Based Access Control**:
   - **Recruiter**: Manage company profiles, publish/draft/close job openings, review candidate pipelines across 6 recruitment stages (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Hired`, `Rejected`), write private interview notes, and review AI match assessments.
   - **Candidate**: Manage profiles, maintain a default CV, search and filter job openings, apply using their profile CV or upload tailored documents, track application statuses, and receive AI CV improvement feedback.

3. **Independent Document & CV Preservation**:
   - Each submitted job application freezes and stores an immutable snapshot of the submitted CV.
   - Updating or replacing the candidate's default profile CV later **never** modifies or overwrites previously submitted applications.

4. **Transparent, Explainable AI Matcher (0 - 100 Score)**:
   - Evaluates CV text against job requirements (skills, education, and experience).
   - Generates a concise summary, verified matching skills, unverified requirements needing interview clarification, and an evidence-based explanation.
   - **Human-in-the-Loop Guarantee**: AI acts strictly as an informational assistant. It **never** autonomously rejects, ranks, or hires candidates.

5. **Confidential Recruiter Notes**:
   - Private interview observations and notes per application, strictly confidential to the hiring team and inaccessible to candidates.

6. **In-App Notification Center**:
   - Candidates receive automated notifications when recruiters update application stages.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+)
- [MongoDB](https://www.mongodb.com/) running locally (default: `mongodb://127.0.0.1:27017/hireflow`) or MongoDB Atlas URI

### 1. Clone & Setup Repository
```bash
git clone <your-repo-url>
cd hireflow2
```

### 2. Backend Setup
```bash
cd backend
npm install
```



> *Note:* If `GEMINI_API_KEY` is not provided, the embedded intelligent NLP & rule engine operates automatically with zero configuration required.

### 3. Seed Database with Benchmark Scenario
Populate the database with the Atlas Digital recruiter, Sara's candidate profile, sample jobs, tailored CV documents, and realistic applications:
```bash
npm run seed
```

### 4. Start the Backend Server
```bash
npm start
# Server listens on http://localhost:5001
```

### 5. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000 (proxies /api requests to :5001)
```

Open your browser at **`http://localhost:3000`**.

---

## 👥 Demo Accounts & Evaluator Scenario (PDF Pages 11-12)

The application includes pre-configured demo credentials and **1-Click Quick Demo Login** buttons located in the navigation bar and login page:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@atlasdigital.com` | `password123` | **Atlas Digital Recruiter**: Publishes Junior Full Stack Developer opening, reviews Sara's application, adds interview notes, advances candidate stage. |
| **Candidate** | `sara@example.com` | `password123` | **Sara (Junior Developer)**: Holds a default frontend CV, applied to Atlas Digital with a tailored full-stack CV emphasizing Next.js and Express.js. |
| **Candidate 2** | `alex@example.com` | `password123` | Applied to Frontend React Developer (92% Match). |
| **Candidate 3** | `michael@example.com` | `password123` | Applied to Senior Backend Engineer (88% Match). |

---

## 🎬 End-to-End Walkthrough of the Evaluation Scenario

1. **Initial Setup & Job Publication**:
   - Log in as **Atlas Digital Recruiter**.
   - Navigate to **Manage Openings** or **Dashboard**.
   - Inspect the **"Junior Full Stack Developer"** opening requiring:
     - Skills: `Next.js`, `TypeScript`, `Express.js`, `PostgreSQL`.
2. **Job Discovery & Tailored Application**:
   - Log in as candidate **Sara**.
   - Notice that Sara's default profile CV highlights frontend experience.
   - For the Junior Full Stack position, Sara submitted a **tailored CV** showcasing her full-stack projects using `Next.js`, `TypeScript`, and `Express.js` (omitting `PostgreSQL`).
3. **Document Preservation**:
   - Sara updates her default profile CV.
   - The application submitted to Atlas Digital retains her original tailored CV completely intact.
4. **AI Qualification Matching & Gap Analysis**:
   - Log in as **Atlas Digital Recruiter** and open **Recruitment Pipeline**.
   - Click **"AI Review & Score"** on Sara's card.
   - The system displays:
     - **Match Score: 78%**
     - **Demonstrated Qualifications**: `Next.js`, `TypeScript`, `Express.js`.
     - **Unverified Requirements**: `PostgreSQL` (flagged with note: *requires clarification in interview; omission in CV is not proof of lack of skill*).
     - **Evidence-Based Explanation**: Grounded in the submitted document.
5. **Recruiter Review & Stage Advancement**:
   - Recruiter clicks **"Notes"** and records confidential interview observations.
   - Recruiter advances Sara's stage from `Applied` → `Under Review` → `Shortlisted` → `Interview`.
6. **Candidate Status Tracking & Alerts**:
   - Log back into Sara's account.
   - The application badge dynamically reflects `Interview` stage, accompanied by in-app notifications.

---

## 🛠️ API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create recruiter or candidate account
- `POST /api/auth/login` - Authenticate user & issue JWT
- `GET /api/auth/me` - Get authenticated profile
- `PUT /api/auth/profile` - Update candidate or recruiter company details
- `POST /api/auth/default-cv` - Upload/replace candidate default CV

### Jobs (`/api/jobs`)
- `GET /api/jobs` - Browse & filter published jobs (keyword, location, employment type)
- `GET /api/jobs/:id` - View single job details
- `GET /api/jobs/recruiter/my-jobs` - Recruiter view of their jobs with applicant counts
- `POST /api/jobs` - Create new job (Draft or Published)
- `PUT /api/jobs/:id` - Update job details or change lifecycle status
- `DELETE /api/jobs/:id` - Delete job posting

### Applications & AI Workflow (`/api/applications`)
- `POST /api/applications/:jobId` - Submit application (with tailored CV upload or default CV snapshot)
- `GET /api/applications/recruiter` - Recruiter pipeline view with AI scores & filters
- `GET /api/applications/candidate` - Candidate history (confidential notes stripped)
- `GET /api/applications/:id` - View single application details
- `PATCH /api/applications/:id/status` - Update recruitment stage & notify candidate
- `POST /api/applications/:id/notes` - Add confidential recruiter observation note
- `POST /api/applications/:id/ai-analyze` - Manually trigger or re-run AI evaluation

### Statistics & AI Advice
- `GET /api/stats/recruiter` - Recruiter dashboard metrics and stage distributions
- `POST /api/ai/cv-advice` - Candidate AI CV improvement feedback

---

## ☁️ Deployment Guide

### Deploy Backend (e.g. Render / Railway)
1. Push your repository to GitHub.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service** connected to your repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random secret key
   - `PORT`: `5000` or `5001`
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: (Optional)

### Deploy Frontend (e.g. Vercel / Netlify)
1. In [Vercel](https://vercel.com) or [Netlify](https://netlify.com), import your repository.
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://hireflow-api.onrender.com/api`)

---

## 📋 Evaluation Criteria Compliance Matrix

| Criterion | Implementation in HireFlow |
| :--- | :--- |
| **Functional Completeness** | Full recruitment lifecycle: Job management (draft/publish/close), candidate discovery & search, tailored CV uploads, pipeline stages, status notifications, recruiter private notes. |
| **Frontend & User Experience** | Polished React 19 UI with Tailwind CSS v4, Lucide icons, responsive layout, real-time stage badges, intuitive modals, and 1-click demo logins. |
| **Backend & Database** | Node.js/Express REST API with Mongoose schemas, relational references, strict input validation, Multer document uploads, and duplicate application prevention. |
| **AI Integration** | Document text extraction (`pdf-parse`), qualification matching against job specifications, 0-100 match score, missing requirement explanations, and human-in-the-loop guarantee. |
| **Document Preservation** | Applications independently snapshot and preserve the exact submitted CV, ensuring candidate profile edits never tamper with submitted records. |
