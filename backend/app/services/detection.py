import os
from fastapi import HTTPException
from app.config import settings
from app.providers.base import DetectionProvider
from app.providers.mock_provider import MockProvider
from app.providers.sightengine_provider import SightengineProvider
from app.providers.hive_provider import HiveProvider
from app.ml.ensemble import ensemble_service

def _is_live_provider_configured() -> bool:
    """Check if an external detection provider SaaS is explicitly configured with credentials."""
    provider_name = settings.DETECTION_PROVIDER.lower()
    if provider_name == "sightengine" and settings.SIGHTENGINE_API_USER and settings.SIGHTENGINE_API_SECRET:
        return True
    if provider_name == "hive" and settings.HIVE_API_KEY:
        return True
    return False

async def analyze(file_path: str, filename: str, media_type: str, is_demo: bool = False) -> dict:
    """
    Executes CraftVerse Media Inspection:
      1. If explicit demo request (is_demo=True or filename in demo samples) → returns MockProvider fixture (labeled Demo Analysis).
      2. If settings.DEMO_MODE=True → returns MockProvider fixture (labeled Demo Analysis).
      3. If DEMO_MODE=False:
         - If external provider is configured (Sightengine / Hive) → queries external SaaS detector.
         - Otherwise → executes in-house ViT Deep Learning & Spectral Forensics Detection Ensemble (labeled Live Analysis).
    """
    is_explicit_demo_sample = filename in ["ai-synthetic-demo.png", "demo-sample.png", "demo-video.mp4"]
    effective_demo = is_demo or (settings.DEMO_MODE and is_explicit_demo_sample)

    if effective_demo:
        provider = MockProvider()
        if media_type == "video":
            result = await provider.analyze_video(file_path, filename)
        else:
            result = await provider.analyze_image(file_path, filename)
        result["analysisMode"] = "demo"
        return result

    # Check external SaaS providers if requested
    provider_name = settings.DETECTION_PROVIDER.lower()
    if provider_name == "sightengine" and settings.SIGHTENGINE_API_USER and settings.SIGHTENGINE_API_SECRET:
        provider = SightengineProvider()
        result = await provider.analyze_video(file_path, filename) if media_type == "video" else await provider.analyze_image(file_path, filename)
        result["analysisMode"] = "live"
        return result
    elif provider_name == "hive" and settings.HIVE_API_KEY:
        provider = HiveProvider()
        result = await provider.analyze_video(file_path, filename) if media_type == "video" else await provider.analyze_image(file_path, filename)
        result["analysisMode"] = "live"
        return result

    # Default to in-house Deep Learning ViT + Spectral Forensics Detection Ensemble
    if media_type == "video":
        result = await ensemble_service.analyze_video(file_path, filename)
    else:
        result = await ensemble_service.analyze_image(file_path, filename)

    result["analysisMode"] = "live"
    return result
