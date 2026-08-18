from app.config import settings
from app.providers.base import DetectionProvider
from app.providers.mock_provider import MockProvider
from app.providers.sightengine_provider import SightengineProvider
from app.providers.hive_provider import HiveProvider
from app.utils.classification import classify_result

def get_provider() -> DetectionProvider:
    provider_name = settings.DETECTION_PROVIDER.lower()
    if provider_name == "sightengine":
        return SightengineProvider()
    elif provider_name == "hive":
        return HiveProvider()
    else:
        return MockProvider()

async def analyze(file_path: str, filename: str, media_type: str) -> dict:
    provider = get_provider()
    
    if media_type == "video":
        result = await provider.analyze_video(file_path, filename)
    else:
        result = await provider.analyze_image(file_path, filename)
        
    verdict, confidence = classify_result(
        result.get("aiProbability", 0), 
        result.get("manipulationProbability", 0)
    )
    
    result["verdict"] = verdict
    result["confidence"] = confidence
    
    return result
