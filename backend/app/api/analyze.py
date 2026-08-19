import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import AnalysisResponse, AnalysisResult, DetectionIndicator, SuspiciousFrame
from app.services.file_service import validate_file, save_upload, get_media_type
from app.services.detection import analyze as run_analysis
from app.services.claude_service import generate_explanation
from app.services.history_service import save_analysis, get_by_id

logger = logging.getLogger("craftverse.api.analyze")
router = APIRouter()

def sanitize_number(val: any, default: int = 0) -> int:
    """Ensures numeric values are non-NaN, non-Infinity integers bounded between 0 and 100."""
    try:
        if val is None:
            return default
        num = float(val)
        import math
        if math.isnan(num) or math.isinf(num):
            return default
        return max(0, min(100, int(round(num))))
    except Exception:
        return default

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...), is_demo: bool = False):
    saved_path = None
    try:
        # 1. Strict Payload & File Validation
        if not file or not file.filename:
            raise HTTPException(
                status_code=400,
                detail={"error": True, "code": "MISSING_FILE", "message": "No file payload was uploaded."}
            )

        size = await validate_file(file)
        saved_path, safe_filename, original_filename = await save_upload(file)
        
        media_type = get_media_type(file.content_type, original_filename)
        analysis_id = str(uuid.uuid4())
        
        # 2. Initialize tracking AnalysisResult
        result = AnalysisResult(
            id=analysis_id,
            filename=safe_filename,
            originalFilename=original_filename,
            mediaType=media_type if media_type != "unknown" else "image",
            mimeType=file.content_type or "application/octet-stream",
            fileSize=size,
            status="analyzing",
            aiProbability=0,
            realProbability=0,
            manipulationProbability=0,
            uncertainProbability=0,
            verdict="UNCERTAIN",
            confidence="low",
            analysisMode="demo" if is_demo else "live",
            createdAt=datetime.now(timezone.utc).isoformat()
        )
        await save_analysis(result)
        
        # 3. Execute Detection Pipeline with controlled exception wrapping
        try:
            detection_data = await run_analysis(saved_path, original_filename, media_type, is_demo=is_demo)
        except HTTPException as he:
            raise he
        except ValueError as ve:
            logger.warning(f"[CORRUPTED MEDIA] {original_filename}: {ve}")
            raise HTTPException(
                status_code=400,
                detail={"error": True, "code": "CORRUPTED_FILE", "message": "The uploaded media file is corrupted or unreadable."}
            )
        except Exception as de:
            logger.error(f"[DETECTION FAILED] {original_filename}: {de}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail={"error": True, "code": "ANALYSIS_FAILED", "message": "The analysis service encountered an issue processing this file."}
            )
        
        # 4. Safely Extract & Validate Numerical Signals (Zero NaN/Infinity Leakage)
        result.aiProbability = sanitize_number(detection_data.get("aiProbability"), 50)
        result.realProbability = sanitize_number(detection_data.get("realProbability"), 50)
        result.manipulationProbability = sanitize_number(detection_data.get("manipulationProbability"), 0)
        result.uncertainProbability = sanitize_number(detection_data.get("uncertainProbability"), 0)
        
        raw_verdict = str(detection_data.get("verdict", "UNCERTAIN")).upper()
        result.verdict = raw_verdict if raw_verdict in ["AI_GENERATED", "LIKELY_AUTHENTIC", "MANIPULATED", "UNCERTAIN"] else "UNCERTAIN"
        
        raw_conf = str(detection_data.get("confidence", "low")).lower()
        result.confidence = raw_conf if raw_conf in ["high", "medium", "low"] else "low"
        
        result.generator = detection_data.get("generator")
        result.analysisMode = detection_data.get("analysisMode", "demo" if is_demo else "live")
        result.model = detection_data.get("model")
        result.thumbnailUrl = f"/uploads/{safe_filename}"
        
        raw_indicators = detection_data.get("indicators", [])
        validated_indicators = []
        for ind in raw_indicators:
            if isinstance(ind, dict):
                score = sanitize_number(ind.get("score"), 50)
                name = str(ind.get("name", "Analysis Signal"))
                desc = str(ind.get("description", "")) if ind.get("description") else None
                validated_indicators.append(DetectionIndicator(name=name, score=score, description=desc))
        result.indicators = validated_indicators
        
        raw_frames = detection_data.get("suspiciousFrames", [])
        if raw_frames:
            validated_frames = []
            for sf in raw_frames:
                if isinstance(sf, dict):
                    ts = float(sf.get("timestamp", 0.0))
                    score = sanitize_number(sf.get("score"), 50)
                    validated_frames.append(SuspiciousFrame(timestamp=ts, score=score))
            result.suspiciousFrames = validated_frames
            
        # 5. Non-Blocking Grounded Explanation Layer
        try:
            explanation = await generate_explanation(detection_data)
            result.explanation = explanation
        except Exception as ce:
            logger.warning(f"[EXPLANATION WARNING] {ce}")
            result.explanation = None
        
        result.status = "completed"
        await save_analysis(result)
        
        return AnalysisResponse(success=True, data=result)
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"[ANALYZE ENDPOINT EXCEPTION] {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": True, "code": "ANALYSIS_FAILED", "message": "The analysis service encountered an unexpected error."}
        )

@router.get("/analyze/{id}", response_model=AnalysisResponse)
async def get_analysis(id: str):
    try:
        result = await get_by_id(id)
        if not result:
            raise HTTPException(
                status_code=404,
                detail={"error": True, "code": "ANALYSIS_NOT_FOUND", "message": f"Analysis with ID '{id}' was not found."}
            )
        return AnalysisResponse(success=True, data=result)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"[GET ANALYSIS EXCEPTION] {id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": True, "code": "RETRIEVAL_FAILED", "message": "Could not retrieve analysis record."}
        )
