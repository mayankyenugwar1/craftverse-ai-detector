# CraftVerse AI Detector

**Detect AI. Trust Real.**

Advanced AI content detection platform for images and videos. Analyze media to detect AI-generated content, manipulation, and authenticity with forensic-grade confidence scoring and evidence-based explanations.

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-19-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)

## Features

- **AI Detection** — Analyze images and videos for AI-generated content with probability scoring
- **Multi-Provider Architecture** — Pluggable detection providers (Sightengine, Hive, Mock/Demo)
- **Forensic Explanation** — Claude-powered AI reasoning layer providing evidence-based assessments
- **Video Analysis** — Frame-by-frame analysis with suspicious timeline visualization
- **Report Generation** — Downloadable forensic reports with detailed findings
- **Demo Mode** — Fully functional without external API keys for demonstrations
- **Premium UI** — Glassmorphic design with fluid animations and responsive layout

## Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│    Frontend          │         │     Backend           │
│    React + Vite      │  HTTP   │     FastAPI           │
│    TypeScript        │────────▶│     Python            │
│    Tailwind CSS      │         │                       │
│    Framer Motion     │         │  ┌─────────────────┐  │
└─────────────────────┘         │  │ Detection       │  │
                                │  │ Providers       │  │
                                │  │ ┌─────────────┐ │  │
                                │  │ │ Mock        │ │  │
                                │  │ │ Sightengine │ │  │
                                │  │ │ Hive        │ │  │
                                │  │ └─────────────┘ │  │
                                │  └─────────────────┘  │
                                │  ┌─────────────────┐  │
                                │  │ Claude Service  │  │
                                │  │ (Explanation)   │  │
                                │  └─────────────────┘  │
                                └──────────────────────┘
```

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
- Python 3.12+
- FastAPI
- Pydantic + Pydantic Settings
- Uvicorn
- Anthropic SDK (Claude)
- HTTPX (async HTTP)
- Pillow (image processing)

## Installation

### Prerequisites
- Node.js 18+
- Python 3.12+
- npm or yarn

### 1. Clone the repository

```bash
git clone <repo-url>
cd "AI detector"
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Environment configuration

Copy the example environment file:

```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your configuration (see Environment Variables section).

## Environment Variables

Create a `.env` file in the `backend/` directory:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEMO_MODE` | Enable demo mode with deterministic results | `true` | No |
| `DETECTION_PROVIDER` | Detection backend: `mock`, `sightengine`, `hive` | `mock` | No |
| `CLAUDE_API_KEY` | Anthropic API key for AI explanations | _(empty)_ | No |
| `SIGHTENGINE_API_USER` | Sightengine API user | _(empty)_ | If using sightengine |
| `SIGHTENGINE_API_SECRET` | Sightengine API secret | _(empty)_ | If using sightengine |
| `HIVE_API_KEY` | Hive Moderation API key | _(empty)_ | If using hive |
| `MAX_FILE_SIZE` | Max upload size in bytes | `209715200` (200MB) | No |

Frontend environment (in `frontend/.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | _(empty — uses Vite proxy in dev)_ |

> **Note:** All secret API keys are server-side only. The frontend only uses `VITE_API_URL`.

## Running the Application

### Development

Start the backend:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Start the frontend (in a new terminal):

```bash
cd frontend
npm run dev
```

The app opens at **http://localhost:5173** with API proxy to port 8000.

### Production Build

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`. Deploy to Netlify or any static host.

## Demo Mode

When `DEMO_MODE=true` (default), the application works without any external API keys:

- The **mock provider** returns realistic, deterministic detection results
- Detection scores vary based on filename patterns (e.g., files with "ai" in the name get high AI scores)
- Claude explanation falls back to template-based forensic analysis
- The full visual flow (upload → scan → result → report) works identically

**Try it:** Click "Try Demo" on the landing page for an instant demo.

## Detection Provider Configuration

### Mock Provider (Default)
```env
DETECTION_PROVIDER=mock
```
Returns deterministic results. Ideal for demos and development.

### Sightengine
```env
DETECTION_PROVIDER=sightengine
SIGHTENGINE_API_USER=your_user
SIGHTENGINE_API_SECRET=your_secret
```

### Hive Moderation
```env
DETECTION_PROVIDER=hive
HIVE_API_KEY=your_key
```

The system gracefully falls back to mock if external providers are unavailable.

## Claude Integration

Claude serves as the **forensic reasoning layer**, not the raw detector:

- Receives detection scores, indicators, and signals
- Generates professional, evidence-based explanations
- Never claims 100% certainty
- Falls back to template-based explanation if API key is not configured

```env
CLAUDE_API_KEY=sk-ant-...
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check with config info |
| `POST` | `/api/analyze` | Upload and analyze media file |
| `GET` | `/api/analyze/{id}` | Get analysis by ID |
| `GET` | `/api/history` | List all analyses |
| `GET` | `/api/history/{id}` | Get single analysis |
| `DELETE` | `/api/history/{id}` | Delete analysis |
| `POST` | `/api/reports/{id}` | Generate report |
| `GET` | `/api/reports/{id}/download` | Download report |

## Project Structure

```
AI detector/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # React Query hooks
│   │   ├── services/       # API client
│   │   ├── lib/            # Utils, constants, animations
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Router & layout
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── netlify.toml        # Netlify config (root level)
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── providers/      # Detection providers
│   │   ├── models/         # Pydantic schemas
│   │   ├── utils/          # Classification logic
│   │   ├── config.py       # Settings
│   │   └── main.py         # FastAPI app
│   └── requirements.txt
│
├── uploads/                # Uploaded files
├── reports/                # Generated reports
├── data/                   # Analysis history (JSON)
├── netlify.toml            # Netlify deployment config
├── .env.example            # Environment template
└── README.md
```

## Deployment

### Frontend → Netlify

1. Connect your repository to Netlify
2. Set **Base directory** to `frontend`
3. Set **Build command** to `npm install && npm run build`
4. Set **Publish directory** to `frontend/dist`
5. Add environment variable `VITE_API_URL` pointing to your backend URL
6. Deploy

SPA routing is pre-configured via `netlify.toml` and `_redirects`.

### Backend → Any Server

Deploy the FastAPI backend to any Python hosting (Railway, Render, DigitalOcean, AWS, etc.):

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Set environment variables on your hosting platform.

## Limitations

- Analysis history uses JSON file storage (not a production database)
- Video analysis uses frame sampling, not full frame-by-frame analysis
- Mock provider results are deterministic, not from real AI detection models
- Report generation produces HTML (not PDF)
- No user authentication

## Future Improvements

- PostgreSQL/SQLite database integration
- User authentication and multi-tenancy
- Real-time WebSocket progress updates
- Batch file analysis
- PDF report generation
- Additional detection providers
- Deepfake-specific video detection models
- Browser extension for inline verification

## License

MIT
