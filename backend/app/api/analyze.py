import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import AnalysisResponse, AnalysisResult, DetectionIndicator, SuspiciousFrame
from app.services.file_service import validate_file, save_upload, get_media_type, cleanup_file
from app.services.detection import analyze as run_analysis
from app.services.claude_service import generate_explanation
from app.services.history_service import save_analysis, get_by_id

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    saved_path = None
    try:
        size = await validate_file(file)
        saved_path, safe_filename, original_filename = await save_upload(file)
        
        media_type = get_media_type(file.content_type)
        analysis_id = str(uuid.uuid4())
        
        # Initialize result with analyzing status
        result = AnalysisResult(
            id=analysis_id,
            filename=safe_filename,
            originalFilename=original_filename,
            mediaType=media_type,
            mimeType=file.content_type,
            fileSize=size,
            status="analyzing",
            aiProbability=0,
            realProbability=0,
            manipulationProbability=0,
            uncertainProbability=0,
            verdict="UNCERTAIN",
            confidence="low",
            createdAt=datetime.now(timezone.utc).isoformat()
        )
        await save_analysis(result)
        
        # Run detection (pass original filename for mock provider pattern matching)
        detection_data = await run_analysis(saved_path, original_filename, media_type)
        
        # Update result with detection data
        result.aiProbability = detection_data.get("aiProbability", 0)
        result.realProbability = detection_data.get("realProbability", 0)
        result.manipulationProbability = detection_data.get("manipulationProbability", 0)
        result.uncertainProbability = detection_data.get("uncertainProbability", 0)
        result.verdict = detection_data.get("verdict", "UNCERTAIN")
        result.confidence = detection_data.get("confidence", "low")
        result.generator = detection_data.get("generator")
        result.thumbnailUrl = f"/uploads/{safe_filename}"
        
        raw_indicators = detection_data.get("indicators", [])
        result.indicators = [
            DetectionIndicator(**ind) if isinstance(ind, dict) else ind 
            for ind in raw_indicators
        ]
        
        raw_frames = detection_data.get("suspiciousFrames", [])
        if raw_frames:
            result.suspiciousFrames = [
                SuspiciousFrame(**sf) if isinstance(sf, dict) else sf
                for sf in raw_frames
            ]
            
        # Get AI explanation (non-blocking fallback)
        try:
            explanation = await generate_explanation(detection_data)
            result.explanation = explanation
        except Exception as ce:
            print(f"Explanation generation warning: {ce}")
            result.explanation = None
        
        # Mark as completed
        result.status = "completed"
        await save_analysis(result)
        
        return AnalysisResponse(success=True, data=result)
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        pass # In a real app we might clean up the file here, but we are serving it statically from uploads/

@router.get("/analyze/{id}", response_model=AnalysisResponse)
async def get_analysis(id: str):
    result = await get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return AnalysisResponse(success=True, data=result)
