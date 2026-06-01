# ApplyTrack

A full-stack job application tracker that lets you manage and monitor your job search in one place. Add applications, filter by status, sort by date, and track your progress through a clean dashboard.

🔗 **Live Demo:** [internship-tracker-react.vercel.app](https://internship-tracker-react.vercel.app)

---

## Screenshots
### Light Mode
<img width="1014" height="729" alt="Screenshot 2026-06-01 at 18 47 22" src="https://github.com/user-attachments/assets/f7608516-3ad9-4a97-87e6-c7a4a2c6570e" />

### Dark Mode
<img width="1013" height="754" alt="Screenshot 2026-06-01 at 18 47 46" src="https://github.com/user-attachments/assets/80c13e1d-b1ca-432a-ae0c-0474da6c5888" />


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Vite |
| Backend | Python, Flask, Flask-Login, Flask-CORS |
| Database | PostgreSQL, SQLAlchemy |
| Auth | Session-based auth with bcrypt password hashing |
| Deployment | Vercel (frontend), Render (backend + database) |

---

## Architecture Overview

```
┌─────────────────────────────┐         ┌──────────────────────────────────┐
│        Frontend             │         │            Backend               │
│     React + Vite            │         │          Flask REST API          │
│     (Vercel)                │◄───────►│           (Render)               │
│                             │  HTTPS  │                                  │
│  /login      → Auth.jsx     │         │  POST /login                     │
│  /signup     → Auth.jsx     │         │  POST /register                  │
│  /dashboard  → Dashboard    │         │  GET  /applications              │
│                             │         │  POST /applications              │
└─────────────────────────────┘         │  PUT  /applications/:id          │
                                        │  DELETE /applications/:id        │
                                        │  GET  /check-auth                │
                                        │  GET  /logout                    │
                                        └──────────────┬───────────────────┘
                                                       │
                                                       ▼
                                        ┌──────────────────────────────────┐
                                        │         PostgreSQL               │
                                        │                                  │
                                        │  users         applications      │
                                        │  ─────         ────────────      │
                                        │  id (uuid)     id (uuid)         │
                                        │  username      company           │
                                        │  password_hash role              │
                                        │                status            │
                                        │                created_at        │
                                        │                user_id (FK)      │
                                        └──────────────────────────────────┘
```

Sessions are stored server-side via Flask-Login with secure, HTTP-only cookies. Cross-origin requests between Vercel and Render are handled with Flask-CORS, with `SameSite=None; Secure` cookies in production.

---

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL running locally

### 1. Clone the repo

```bash
git clone https://github.com/AyayronSu/internship-tracker-react.git
cd internship-tracker-react
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://localhost/applytrack
```

Create the local database and start the server:

```bash
createdb applytrack
python app.py
```

The backend will run at `http://localhost:5000`.

### 3. Frontend

In a new terminal from the project root:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## Deployment

The app is deployed across two platforms:

- **Frontend** → [Vercel](https://vercel.com). Set the `VITE_API_BASE_URL` environment variable to your Render backend URL and redeploy after any env var changes (Vite bakes them in at build time).
- **Backend** → [Render](https://render.com). Set `SECRET_KEY`, `DATABASE_URL`, and `FRONTEND_URL` environment variables. The `FRONTEND_URL` must match your Vercel deployment URL exactly for CORS to work.
