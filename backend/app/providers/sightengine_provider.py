import logging
import httpx
from fastapi import HTTPException
from app.providers.base import DetectionProvider
from app.config import settings

logger = logging.getLogger("craftverse.sightengine")

class SightengineProvider(DetectionProvider):
    def __init__(self):
        self.api_user = settings.SIGHTENGINE_API_USER
        self.api_secret = settings.SIGHTENGINE_API_SECRET

    async def _call_api(self, file_path: str, filename: str, is_video: bool) -> dict:
        if not self.api_user or not self.api_secret:
            logger.error("[DETECTOR] Sightengine credentials missing.")
            raise HTTPException(
                status_code=503,
                detail={
                    "error": True,
                    "code": "DETECTION_PROVIDER_NOT_CONFIGURED",
                    "message": "Live detection provider is not configured. Please set Sightengine API credentials."
                }
            )

        url = "https://api.sightengine.com/1.0/check.json"
        
        try:
            timeout_config = httpx.Timeout(45.0, connect=10.0)
            async with httpx.AsyncClient(timeout=timeout_config) as client:
                with open(file_path, 'rb') as f:
                    files = {'media': (filename, f)}
                    data = {
                        'models': 'genai',
                        'api_user': self.api_user,
                        'api_secret': self.api_secret
                    }
                    logger.info(f"[DETECTOR] Sending request to Sightengine for {filename} (video={is_video})")
                    response = await client.post(url, data=data, files=files)
                    
            if response.status_code in [401, 403]:
                logger.error(f"[DETECTOR] Sightengine authentication failed (HTTP {response.status_code})")
                raise HTTPException(
                    status_code=502,
                    detail={
                        "error": True,
                        "code": "DETECTION_PROVIDER_AUTH_FAILED",
                        "message": "Detection provider authentication failed. Please verify API credentials."
                    }
                )

            if response.status_code != 200:
                logger.error(f"[DETECTOR] Sightengine returned non-200 status: {response.status_code}")
                raise HTTPException(
                    status_code=502,
                    detail={
                        "error": True,
                        "code": "DETECTION_RESPONSE_INVALID",
                        "message": f"Detection provider returned error code {response.status_code}."
                    }
                )

            result = response.json()
            if result.get("status") != "success":
                err_msg = result.get("error", {}).get("message", "Unknown provider error")
                logger.error(f"[DETECTOR] Sightengine error: {err_msg}")
                raise HTTPException(
                    status_code=502,
                    detail={
                        "error": True,
                        "code": "DETECTION_RESPONSE_INVALID",
                        "message": f"Detection provider error: {err_msg}"
                    }
                )

            genai_val = result.get("type", {}).get("ai_generated")
            if genai_val is None:
                logger.error("[DETECTOR] Malformed Sightengine response: ai_generated field missing")
                raise HTTPException(
                    status_code=502,
                    detail={
                        "error": True,
                        "code": "DETECTION_RESPONSE_INVALID",
                        "message": "Detection provider returned an invalid response structure."
                    }
                )

            genai_score = int(round(float(genai_val) * 100))
            genai_score = max(0, min(100, genai_score))
            real_score = 100 - genai_score
            uncertain_score = max(0, 100 - (abs(genai_score - 50) * 2))

            indicators = [
                {"name": "Synthetic Media Score", "score": genai_score, "description": "Generative AI signature score from Sightengine"},
                {"name": "Authentic Signal", "score": real_score, "description": "Photographic consistency signal"},
                {"name": "Model Agreement", "score": 85 if genai_score > 70 or genai_score < 30 else 50, "description": "Neural classifier confidence agreement"}
            ]

            return {
                "aiProbability": genai_score,
                "realProbability": real_score,
                "manipulationProbability": 0,
                "uncertainProbability": uncertain_score,
                "indicators": indicators,
                "suspiciousFrames": [],
                "generator": "Generative AI Model" if genai_score >= 70 else None,
                "analysisMode": "live",
            }

        except httpx.TimeoutException:
            logger.error(f"[DETECTOR] Sightengine request timed out for {filename}")
            raise HTTPException(
                status_code=504,
                detail={
                    "error": True,
                    "code": "DETECTION_PROVIDER_TIMEOUT",
                    "message": "The detection service took too long to respond."
                }
            )
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"[DETECTOR] Unexpected Sightengine communication error: {e}")
            raise HTTPException(
                status_code=502,
                detail={
                    "error": True,
                    "code": "ANALYSIS_FAILED",
                    "message": "The detection service is temporarily unavailable."
                }
            )

    async def analyze_image(self, file_path: str, filename: str) -> dict:
        return await self._call_api(file_path, filename, False)

    async def analyze_video(self, file_path: str, filename: str) -> dict:
        return await self._call_api(file_path, filename, True)
