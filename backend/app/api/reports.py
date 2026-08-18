import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.history_service import get_by_id
from app.services.report_service import generate_report

router = APIRouter()

@router.post("/reports/{id}")
async def create_report(id: str):
    analysis = await get_by_id(id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    report_path = await generate_report(analysis)
    return {"success": True, "reportUrl": f"/api/reports/{id}/download"}

@router.get("/reports/{id}/download")
async def download_report(id: str):
    analysis = await get_by_id(id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    report_path = await generate_report(analysis)
    if not os.path.exists(report_path):
        raise HTTPException(status_code=404, detail="Report not found")
        
    return FileResponse(
        path=report_path, 
        filename=f"Report_{analysis.originalFilename}.html",
        media_type="text/html"
    )
