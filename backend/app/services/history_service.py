import os
import json
import asyncio
from typing import Optional, List
from app.config import settings
from app.models.schemas import AnalysisResult

HISTORY_FILE = os.path.join(settings.DATA_DIR, "history.json")
_lock = asyncio.Lock()

async def _read_history() -> List[dict]:
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

async def _write_history(data: List[dict]):
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

async def save_analysis(result: AnalysisResult):
    async with _lock:
        history = await _read_history()
        # Update if exists, else append
        idx = next((i for i, item in enumerate(history) if item['id'] == result.id), None)
        if idx is not None:
            history[idx] = result.model_dump()
        else:
            history.append(result.model_dump())
        await _write_history(history)

async def get_all() -> List[AnalysisResult]:
    async with _lock:
        history = await _read_history()
        
    results = [AnalysisResult(**item) for item in history]
    # Sort by createdAt desc
    results.sort(key=lambda x: x.createdAt, reverse=True)
    return results

async def get_by_id(id: str) -> Optional[AnalysisResult]:
    async with _lock:
        history = await _read_history()
        
    for item in history:
        if item['id'] == id:
            return AnalysisResult(**item)
    return None

async def delete_by_id(id: str) -> bool:
    async with _lock:
        history = await _read_history()
        new_history = [item for item in history if item['id'] != id]
        if len(history) != len(new_history):
            await _write_history(new_history)
            return True
        return False
