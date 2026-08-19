from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.ml.feedback import record_user_feedback

router = APIRouter()

class FeedbackRequest(BaseModel):
    analysisId: str
    wasHelpful: bool
    userSuggestedLabel: Optional[str] = None  # "real", "ai", "unsure"
    comments: Optional[str] = None

@router.post("/feedback")
async def submit_feedback(request_data: FeedbackRequest, req: Request):
    if not request_data.analysisId:
        raise HTTPException(status_code=400, detail="analysisId is required")

    client_ip = req.client.host if req.client else None
    result = await record_user_feedback(
        analysis_id=request_data.analysisId,
        was_helpful=request_data.wasHelpful,
        user_suggested_label=request_data.userSuggestedLabel,
        comments=request_data.comments,
        client_ip=client_ip
    )
    return result
