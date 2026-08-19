import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from app.config import settings

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/webm"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".webm"}

def get_media_type(mime: str, filename: str = "") -> str:
    if mime in ALLOWED_IMAGE_TYPES:
        return "image"
    if mime in ALLOWED_VIDEO_TYPES:
        return "video"
    # Fallback: infer from file extension when MIME is generic
    if filename:
        ext = os.path.splitext(filename)[1].lower()
        if ext in {".jpg", ".jpeg", ".png", ".webp"}:
            return "image"
        if ext in {".mp4", ".mov", ".webm"}:
            return "video"
    return "unknown"

async def validate_file(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail={
                "error": True,
                "code": "UNSUPPORTED_FILE",
                "message": f"File extension '{ext}' is not supported. Please upload JPG, PNG, WEBP, MP4, MOV, or WEBM."
            }
        )
        
    # Smart MIME inference if client sends generic octet-stream
    content_type = file.content_type or ""
    if content_type == "application/octet-stream" or not content_type:
        if ext in {".mp4", ".mov", ".webm"}:
            content_type = "video/mp4" if ext == ".mp4" else ("video/quicktime" if ext == ".mov" else "video/webm")
        elif ext in {".jpg", ".jpeg"}:
            content_type = "image/jpeg"
        elif ext == ".png":
            content_type = "image/png"
        elif ext == ".webp":
            content_type = "image/webp"
        file.headers.__dict__.setdefault('_list', [])
        
    if content_type not in ALLOWED_IMAGE_TYPES and content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail=f"Content type {content_type} not allowed")
        
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large (max {settings.MAX_FILE_SIZE} bytes)")
        
    return size

async def save_upload(file: UploadFile) -> tuple[str, str, str]:
    ext = os.path.splitext(file.filename)[1].lower()
    safe_filename = f"{uuid.uuid4().hex}{ext}"
    
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    
    async with aiofiles.open(saved_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    return saved_path, safe_filename, file.filename

def cleanup_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"Error cleaning up file {path}: {e}")
