import asyncio
from app.providers.base import DetectionProvider

class MockProvider(DetectionProvider):
    """
    Isolated deterministic Demo Provider.
    Used strictly for the explicit 'Try Demo' flow.
    """
    async def analyze_image(self, file_path: str, filename: str) -> dict:
        await asyncio.sleep(2.0)
        return {
            "aiProbability": 92,
            "realProbability": 8,
            "manipulationProbability": 14,
            "uncertainProbability": 8,
            "analysisMode": "demo",
            "generator": "Diffusion Transformer Model",
            "indicators": [
                {"name": "Synthetic Texture", "score": 96, "description": "High likelihood of generated textures"},
                {"name": "Lighting Consistency", "score": 88, "description": "Lighting anomalies found"},
                {"name": "Facial Anomalies", "score": 91, "description": "Facial structure contains anomalous patterns"},
                {"name": "Pattern Uniformity", "score": 85, "description": "Unnatural uniform patterns detected"},
                {"name": "Color Irregularities", "score": 89, "description": "Color distribution matches synthetic models"}
            ],
            "suspiciousFrames": []
        }

    async def analyze_video(self, file_path: str, filename: str) -> dict:
        await asyncio.sleep(2.2)
        return {
            "aiProbability": 92,
            "realProbability": 8,
            "manipulationProbability": 14,
            "uncertainProbability": 8,
            "analysisMode": "demo",
            "generator": "Diffusion Temporal Model",
            "indicators": [
                {"name": "Synthetic Texture", "score": 96, "description": "High likelihood of generated textures"},
                {"name": "Lighting Consistency", "score": 88, "description": "Lighting anomalies found"},
                {"name": "Facial Anomalies", "score": 91, "description": "Facial structure contains anomalous patterns"},
                {"name": "Pattern Uniformity", "score": 85, "description": "Unnatural uniform patterns detected"},
                {"name": "Color Irregularities", "score": 89, "description": "Color distribution matches synthetic models"}
            ],
            "suspiciousFrames": [
                {"timestamp": 0.8, "score": 94, "thumbnail": None},
                {"timestamp": 1.6, "score": 91, "thumbnail": None},
                {"timestamp": 2.4, "score": 89, "thumbnail": None},
                {"timestamp": 3.2, "score": 96, "thumbnail": None},
            ]
        }
