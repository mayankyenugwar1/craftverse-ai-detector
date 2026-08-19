# CraftVerse AI Detector

**Detect AI. Trust Real.**

Advanced AI content detection platform for images and videos. Analyze media to detect AI-generated content, manipulation, and authenticity with forensic-grade confidence scoring and evidence-based explanations.

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-19-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)

---

## Production Deployment Architecture

CraftVerse AI Detector runs **100% cloud-hosted** with zero dependency on local laptops or development servers.

```
                    ┌────────────────────────┐
                    │    End Users (Web)     │
                    └───────────┬────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │          Production Netlify Edge             │
         │  https://amazing-sawine-a87e09.netlify.app   │
         │  (React 19 + Vite 6 Production Build)        │
         └──────────────────────┬───────────────────────┘
                                │ HTTPS / API
                                ▼
         ┌──────────────────────────────────────────────┐
         │         Public Cloud FastAPI Backend         │
         │ (Render / Railway / Fly.io / Docker / AWS)   │
         │ uvicorn app.main:app --host 0.0.0.0 --port $PORT│
         └──────────────┬───────────────────────────────┘
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
┌───────────────┐               ┌────────────────┐
│  Detection    │               │  Claude        │
│  Providers    │               │  Reasoning     │
│ (Sightengine /│               │  Layer         │
│  Hive / Mock) │               │ (Anthropic API)│
└───────────────┘               └────────────────┘
```

---

## Live Production Demo

- **Frontend**: [https://amazing-sawine-a87e09.netlify.app](https://amazing-sawine-a87e09.netlify.app)
- **Health Endpoint**: `/api/health`

---

## Features

- **AI Detection** — Analyze images and videos for AI-generated content with probability scoring
- **Multi-Provider Architecture** — Pluggable detection providers (Sightengine, Hive, Mock/Demo)
- **Forensic Explanation** — Claude-powered AI reasoning layer providing evidence-based assessments
- **Video Analysis** — Frame-by-frame analysis with suspicious timeline visualization
- **Report Generation** — Downloadable forensic reports with detailed findings
- **Demo Mode** — Fully functional without external API keys for demonstrations
- **Premium UI** — Black & Beige Digital Forensics visual theme with fluid animations

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3
- Framer Motion 11
- Lucide React (icons)
- TanStack Query (data fetching)
- React Router 7

### Backend
- Python 3.11 / 3.12
- FastAPI + Uvicorn
- Pydantic + Pydantic Settings
- Anthropic SDK (Claude)
- HTTPX (async HTTP)
- Pillow (image processing)

---

## Environment Variables

### Backend Configuration (`backend/.env` or Cloud Host Env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEMO_MODE` | Enable demo mode with deterministic results | `true` | No |
| `DETECTION_PROVIDER` | Detection backend: `mock`, `sightengine`, `hive` | `mock` | No |
| `FRONTEND_ORIGIN` | Allowed production CORS origin | `https://amazing-sawine-a87e09.netlify.app` | No |
| `CLAUDE_API_KEY` | Anthropic API key for AI explanations | _(empty — uses template fallback)_ | No |
| `SIGHTENGINE_API_USER` | Sightengine API user | _(empty)_ | If using sightengine |
| `SIGHTENGINE_API_SECRET` | Sightengine API secret | _(empty)_ | If using sightengine |
| `HIVE_API_KEY` | Hive Moderation API key | _(empty)_ | If using hive |
| `MAX_FILE_SIZE` | Max upload size in bytes | `209715200` (200MB) | No |

### Frontend Configuration (`frontend/.env` or Netlify Env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Public Backend API URL | `https://your-public-backend.onrender.com` |

> **Security Note:** All secret API keys are server-side only. Never expose secrets in frontend `VITE_*` variables.

---

## Public Cloud Backend Deployment Guide

### Option 1: Deploying to Render (Recommended - 1-Click via `render.yaml`)

1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml` and set up the web service.
4. Set your environment variables (`DEMO_MODE=true`, `FRONTEND_ORIGIN=https://amazing-sawine-a87e09.netlify.app`).
5. Click **Apply**. Render will deploy your FastAPI service automatically.

### Option 2: Deploying via Docker (Railway / Fly.io / AWS App Runner)

A production `Dockerfile` is included in `backend/`:

```bash
docker build -t craftverse-backend ./backend
docker run -p 8000:8000 -e DEMO_MODE=true -e FRONTEND_ORIGIN=https://amazing-sawine-a87e09.netlify.app craftverse-backend
```

### Option 3: Manual Cloud Deployment (Linux VPS / Railway / Heroku)

Start command:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Netlify Frontend Deployment Guide

1. Log into [Netlify](https://app.netlify.app/).
2. Select your site (`amazing-sawine-a87e09`).
3. Build Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
4. Environment Variables:
   - `VITE_API_URL`: Set to your deployed public backend URL (e.g. `https://craftverse-ai-backend.onrender.com`).
5. Trigger a deploy.

---

## Local Development Instructions

### 1. Prerequisites
- Node.js 18+
- Python 3.11+

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend health check: `http://localhost:8000/api/health`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend URL: `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (returns `{"status":"ok", ...}`) |
| `POST` | `/api/analyze` | Upload and analyze media file (image/video) |
| `GET` | `/api/analyze/{id}` | Get analysis by ID |
| `GET` | `/api/history` | List all historical analyses |
| `GET` | `/api/history/{id}` | Get single analysis item |
| `DELETE` | `/api/history/{id}` | Delete analysis item |
| `POST` | `/api/reports/{id}` | Generate downloadable HTML report |
| `GET` | `/api/reports/{id}/download` | Download HTML report file |

---

## License

MIT © CraftVerse Security Systems
