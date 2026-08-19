from enum import Enum
from pydantic import BaseModel
from typing import Optional

class Verdict(str, Enum):
    AI_GENERATED = "AI_GENERATED"
    LIKELY_AUTHENTIC = "LIKELY_AUTHENTIC"
    MANIPULATED = "MANIPULATED"
    UNCERTAIN = "UNCERTAIN"

class Confidence(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class DetectionIndicator(BaseModel):
    name: str
    score: int  # 0-100
    description: Optional[str] = None

class SuspiciousFrame(BaseModel):
    timestamp: float  # seconds
    score: int
    thumbnail: Optional[str] = None

class AIExplanation(BaseModel):
    summary: str
    keyFindings: list[str]
    riskLevel: str  # HIGH, MEDIUM, LOW
    recommendation: str
    explanation: str

class MediaMetadata(BaseModel):
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None
    format: Optional[str] = None
    frameCount: Optional[int] = None

class AnalysisResult(BaseModel):
    id: str
    filename: str
    originalFilename: str
    mediaType: str  # "image" or "video"
    mimeType: str
    fileSize: int
    status: str  # "queued", "analyzing", "completed", "failed"
    aiProbability: int  # 0-100
    realProbability: int
    manipulationProbability: int
    uncertainProbability: int
    verdict: str
    confidence: str
    generator: Optional[str] = None
    indicators: list[DetectionIndicator] = []
    suspiciousFrames: list[SuspiciousFrame] = []
    explanation: Optional[AIExplanation] = None
    analysisMode: str = "demo"  # "demo" or "live"
    model: Optional[dict] = None
    createdAt: str
    thumbnailUrl: Optional[str] = None

class AnalysisResponse(BaseModel):
    success: bool
    data: AnalysisResult

class HistoryResponse(BaseModel):
    success: bool
    data: list[AnalysisResult]

class ModelHealthInfo(BaseModel):
    loaded: bool
    engine: str
    fallbackUsed: bool

class HealthResponse(BaseModel):
    status: str
    version: str
    demoMode: bool
    provider: str
    providerConfigured: bool = False
    claudeConfigured: bool = False
    modelVersion: Optional[str] = "craftverse-detector-v1"
    detectorStatus: Optional[str] = "ready"
    model: Optional[ModelHealthInfo] = None

class ApiErrorResponse(BaseModel):
    error: bool = True
    code: str
    message: str
