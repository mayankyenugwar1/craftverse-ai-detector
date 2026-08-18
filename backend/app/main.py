import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api import health, analyze, history, reports

app = FastAPI(title="CraftVerse AI Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(settings.DATA_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(history.router, prefix="/api", tags=["history"])
app.include_router(reports.router, prefix="/api", tags=["reports"])

@app.get("/")
async def root():
    return {"message": "CraftVerse AI Detector API is running. Check /api/health for status."}
