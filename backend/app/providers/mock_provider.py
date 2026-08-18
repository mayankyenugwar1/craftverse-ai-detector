import asyncio
import random
from app.providers.base import DetectionProvider

class MockProvider(DetectionProvider):
    async def _analyze(self, filename: str, is_video: bool = False) -> dict:
        await asyncio.sleep(2.2)
        
        name_lower = filename.lower()
        
        if any(word in name_lower for word in ['real', 'photo', 'authentic', 'street', 'mountain', 'landscape', 'nature']):
            ai_prob = 8
            real_prob = 92
            manip_prob = 4
            indicators = [
                {"name": "Organic Texture", "score": 94, "description": "Natural grain and texture present"},
                {"name": "Natural Lighting", "score": 91, "description": "Consistent physical lighting"},
                {"name": "Authentic Noise", "score": 88, "description": "Sensor noise matches camera characteristics"},
                {"name": "Natural Color", "score": 89, "description": "Organic color variation"},
                {"name": "Edge Consistency", "score": 92, "description": "Natural edge transitions"}
            ]
        elif any(word in name_lower for word in ['manipulated', 'edited', 'modified']):
            ai_prob = 32
            real_prob = 28
            manip_prob = 84
            indicators = [
                {"name": "Clone Stamp Anomalies", "score": 91, "description": "Repeated pixel blocks detected"},
                {"name": "Metadata Inconsistency", "score": 86, "description": "Edited software traces found"},
                {"name": "Compression Artifacts", "score": 79, "description": "Mismatched JPEG compression levels"}
            ]
        else:
            # Default / AI-generated media (92% AI, 8% Real, high confidence)
            ai_prob = 92
            real_prob = 8
            manip_prob = 14
            indicators = [
                {"name": "Synthetic Texture", "score": 96, "description": "High likelihood of generated textures"},
                {"name": "Lighting Consistency", "score": 88, "description": "Lighting anomalies found"},
                {"name": "Facial Anomalies", "score": 91, "description": "Facial structure contains anomalous patterns"},
                {"name": "Pattern Uniformity", "score": 85, "description": "Unnatural uniform patterns detected"},
                {"name": "Color Irregularities", "score": 89, "description": "Color distribution matches synthetic models"}
            ]
            
        uncertain_prob = max(0, 100 - (abs(ai_prob - 50) * 2))
        
        result = {
            "aiProbability": ai_prob,
            "realProbability": real_prob,
            "manipulationProbability": manip_prob,
            "uncertainProbability": uncertain_prob,
            "indicators": indicators,
            "generator": "Diffusion Transformer Model" if ai_prob > 70 else None
        }
        
        if is_video:
            result["suspiciousFrames"] = [
                {"timestamp": 0.8, "score": 94, "thumbnail": None},
                {"timestamp": 1.6, "score": 91, "thumbnail": None},
                {"timestamp": 2.4, "score": 89, "thumbnail": None},
                {"timestamp": 3.2, "score": 96, "thumbnail": None},
                {"timestamp": 4.0, "score": 88, "thumbnail": None},
                {"timestamp": 4.8, "score": 93, "thumbnail": None},
            ]
            
        return result

    async def analyze_image(self, file_path: str, filename: str) -> dict:
        return await self._analyze(filename, is_video=False)

    async def analyze_video(self, file_path: str, filename: str) -> dict:
        return await self._analyze(filename, is_video=True)
