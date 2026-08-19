from fastapi import APIRouter
from app.config import settings
from app.models.schemas import HealthResponse, ModelHealthInfo
from app.ml.detector import DeepLearningDetector, MODEL_VERSION

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health():
    provider_name = settings.DETECTION_PROVIDER.lower()
    provider_configured = False
    
    if provider_name == "sightengine" and bool(settings.SIGHTENGINE_API_USER and settings.SIGHTENGINE_API_SECRET):
        provider_configured = True
    elif provider_name == "hive" and bool(settings.HIVE_API_KEY):
        provider_configured = True
        
    claude_configured = bool(settings.CLAUDE_API_KEY)
    detector = DeepLearningDetector.get_instance()
    detector_status = "ready" if detector.is_ready else "degraded"
    
    model_status = detector.get_model_status()
    model_info = ModelHealthInfo(
        loaded=model_status["model_loaded"],
        engine=model_status["engine"],
        fallbackUsed=model_status["fallback_used"]
    )
    
    return HealthResponse(
        status="ok" if detector.is_ready else "degraded",
        version="1.0.0",
        demoMode=settings.DEMO_MODE,
        provider=settings.DETECTION_PROVIDER,
        providerConfigured=provider_configured,
        claudeConfigured=claude_configured,
        modelVersion=MODEL_VERSION,
        detectorStatus=detector_status,
        model=model_info
    )
