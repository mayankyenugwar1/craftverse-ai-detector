import httpx
from app.providers.base import DetectionProvider
from app.config import settings
from app.providers.mock_provider import MockProvider

class HiveProvider(DetectionProvider):
    def __init__(self):
        self.api_key = settings.HIVE_API_KEY
        self.mock_fallback = MockProvider()

    async def _call_api(self, file_path: str, filename: str, is_video: bool) -> dict:
        if not self.api_key:
            return await (self.mock_fallback.analyze_video(file_path, filename) if is_video else self.mock_fallback.analyze_image(file_path, filename))

        url = "https://api.thehive.ai/api/v2/task/sync"
        headers = {
            "Authorization": f"token {self.api_key}"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                with open(file_path, 'rb') as f:
                    files = {'media': (filename, f)}
                    response = await client.post(url, headers=headers, files=files)
                    
                if response.status_code == 200:
                    result = response.json()
                    # A simplified handling of Hive response, normally you'd parse classes
                    ai_prob = 0
                    if result.get("status") == 0 and result.get("status_code") == 200:
                        outputs = result.get("status_data", [])
                        if outputs and outputs[0].get("classes"):
                            for cls in outputs[0].get("classes", []):
                                if cls.get("class") == "ai_generated":
                                    ai_prob = int(cls.get("score", 0) * 100)
                                    
                        return {
                            "aiProbability": ai_prob,
                            "realProbability": 100 - ai_prob,
                            "manipulationProbability": 0,
                            "uncertainProbability": max(0, 100 - (abs(ai_prob - 50) * 2)),
                            "indicators": [
                                {"name": "Hive AI Detection", "score": ai_prob, "description": "Score from Hive Moderation"}
                            ],
                            "generator": None
                        }
                        
        except Exception as e:
            print(f"Hive API error: {e}")
            
        # Fallback to mock on error
        return await (self.mock_fallback.analyze_video(file_path, filename) if is_video else self.mock_fallback.analyze_image(file_path, filename))

    async def analyze_image(self, file_path: str, filename: str) -> dict:
        return await self._call_api(file_path, filename, False)

    async def analyze_video(self, file_path: str, filename: str) -> dict:
        return await self._call_api(file_path, filename, True)
