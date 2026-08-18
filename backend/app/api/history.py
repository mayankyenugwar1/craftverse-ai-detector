from fastapi import APIRouter, HTTPException
from app.models.schemas import HistoryResponse, AnalysisResponse
from app.services.history_service import get_all, get_by_id, delete_by_id

router = APIRouter()

@router.get("/history", response_model=HistoryResponse)
async def get_history():
    results = await get_all()
    return HistoryResponse(success=True, data=results)

@router.get("/history/{id}", response_model=AnalysisResponse)
async def get_history_item(id: str):
    result = await get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return AnalysisResponse(success=True, data=result)

@router.delete("/history/{id}")
async def delete_history_item(id: str):
    success = await delete_by_id(id)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"success": True, "message": "Analysis deleted"}
