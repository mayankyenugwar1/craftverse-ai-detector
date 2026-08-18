from abc import ABC, abstractmethod

class DetectionProvider(ABC):
    @abstractmethod
    async def analyze_image(self, file_path: str, filename: str) -> dict:
        pass
    
    @abstractmethod
    async def analyze_video(self, file_path: str, filename: str) -> dict:
        pass
