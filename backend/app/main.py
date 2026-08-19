import os
import sys
import logging

# Ensure backend directory is in sys.path for top-level app imports
backend_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.api import health, analyze, history, reports, feedback

logger = logging.getLogger("craftverse.main")

app = FastAPI(title="CraftVerse AI Detector API")

# Centralized Production Exception Handlers (Zero Raw Traceback Leaks)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    detail = exc.detail
    if isinstance(detail, dict):
        code = detail.get("code", f"HTTP_{exc.status_code}")
        message = detail.get("message", "An HTTP error occurred.")
    else:
        code = f"HTTP_{exc.status_code}"
        message = str(detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid upload request parameters or missing file payload."
            }
        }
    )

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"[UNHANDLED EXCEPTION] {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "ANALYSIS_SERVICE_ERROR",
                "message": "The analysis service encountered an unexpected error. Please try again."
            }
        }
    )

# Configure CORS for local development and Netlify production
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
]

# Add explicit production FRONTEND_ORIGIN if set
frontend_origin = os.environ.get("FRONTEND_ORIGIN") or settings.FRONTEND_ORIGIN
if frontend_origin:
    allowed_origins.append(frontend_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create runtime directories (safe for cloud — uses cwd or tempdir)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(settings.DATA_DIR, exist_ok=True)

# Mount uploads as static files (for serving thumbnails)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API routers (dual-mounted under /api and root for universal client compatibility)
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(history.router, prefix="/api", tags=["history"])
app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])

app.include_router(health.router, tags=["health-root"])
app.include_router(analyze.router, tags=["analyze-root"])
app.include_router(history.router, tags=["history-root"])
app.include_router(reports.router, tags=["reports-root"])
app.include_router(feedback.router, tags=["feedback-root"])


@app.on_event("startup")
async def startup_logging():
    """Log safe configuration state at startup for debugging."""
    provider_name = settings.DETECTION_PROVIDER.lower()
    provider_configured = False
    if provider_name == "sightengine" and settings.SIGHTENGINE_API_USER and settings.SIGHTENGINE_API_SECRET:
        provider_configured = True
    elif provider_name == "hive" and settings.HIVE_API_KEY:
        provider_configured = True
    claude_configured = bool(settings.CLAUDE_API_KEY)

    print("=" * 60)
    print("CraftVerse AI Detector API - Startup")
    print("=" * 60)
    print(f"  DEMO_MODE           = {settings.DEMO_MODE}")
    print(f"  DETECTION_PROVIDER  = {settings.DETECTION_PROVIDER}")
    print(f"  provider_configured = {provider_configured}")
    print(f"  claude_configured   = {claude_configured}")
    print(f"  FRONTEND_ORIGIN     = {frontend_origin or '(not set)'}")
    print(f"  UPLOAD_DIR          = {os.path.abspath(settings.UPLOAD_DIR)}")
    print("=" * 60)
    if settings.DEMO_MODE:
        print("  [OK] Demo mode active - all uploads will use the demo provider.")
    elif provider_configured:
        print(f"  [OK] Live mode active - using {settings.DETECTION_PROVIDER} provider.")
    else:
        print("  [WARN] Live mode active but NO provider configured - uploads will return 503.")
    print("=" * 60)
    sys.stdout.flush()


@app.get("/")
async def root():
    return {"message": "CraftVerse AI Detector API is running. Check /health or /api/health for status."}

@app.get("/health")
async def root_health():
    from app.ml.detector import DeepLearningDetector
    detector = DeepLearningDetector.get_instance()
    model_status = detector.get_model_status()
    return {
        "status": "ok",
        "service": "craftverse-ai-detector-backend",
        "environment": "production",
        "version": "1.0.0",
        "model": {
            "loaded": model_status["model_loaded"],
            "engine": model_status["engine"],
            "fallbackUsed": model_status["fallback_used"]
        }
    }
