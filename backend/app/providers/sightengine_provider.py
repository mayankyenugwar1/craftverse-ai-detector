import httpx
from app.providers.base import DetectionProvider
from app.config import settings
from app.providers.mock_provider import MockProvider

class SightengineProvider(DetectionProvider):
    def __init__(self):
        self.api_user = settings.SIGHTENGINE_API_USER
        self.api_secret = settings.SIGHTENGINE_API_SECRET
        self.mock_fallback = MockProvider()

    async def _call_api(self, file_path: str, filename: str, is_video: bool) -> dict:
        if not self.api_user or not self.api_secret:
            return await (self.mock_fallback.analyze_video(file_path, filename) if is_video else self.mock_fallback.analyze_image(file_path, filename))

        url = "https://api.sightengine.com/1.0/check.json"
        
        try:
            async with httpx.AsyncClient() as client:
                with open(file_path, 'rb') as f:
                    files = {'media': (filename, f)}
                    data = {
                        'models': 'genai',
                        'api_user': self.api_user,
                        'api_secret': self.api_secret
                    }
                    response = await client.post(url, data=data, files=files)
                    
                if response.status_code == 200:
                    result = response.json()
                    
                    if result.get("status") == "success":
                        genai_score = result.get("type", {}).get("ai_generated", 0) * 100
                        real_score = 100 - genai_score
                        
                        return {
                            "aiProbability": int(genai_score),
                            "realProbability": int(real_score),
                            "manipulationProbability": 0,
                            "uncertainProbability": max(0, 100 - (abs(int(genai_score) - 50) * 2)),
                            "indicators": [
                                {"name": "Sightengine GenAI", "score": int(genai_score), "description": "AI generation score from Sightengine"}
                            ],
                            "generator": None
                        }
                        
        except Exception as e:
            print(f"Sightengine API error: {e}")
            
        # Fallback to mock on error
        return await (self.mock_fallback.analyze_video(file_path, filename) if is_video else self.mock_fallback.analyze_image(file_path, filename))

    async def analyze_image(self, file_path: str, filename: str) -> dict:
        return await self._call_api(file_path, filename, False)

    async def analyze_video(self, file_path: str, filename: str) -> dict:
        return await self._call_api(file_path, filename, True)
