import os
import json
import time
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("craftverse.ml.feedback")

FEEDBACK_BASE_DIR = "feedback"
PENDING_DIR = os.path.join(FEEDBACK_BASE_DIR, "pending")
VERIFIED_REAL_DIR = os.path.join(FEEDBACK_BASE_DIR, "verified_real")
VERIFIED_AI_DIR = os.path.join(FEEDBACK_BASE_DIR, "verified_ai")

def init_feedback_directories():
    os.makedirs(PENDING_DIR, exist_ok=True)
    os.makedirs(VERIFIED_REAL_DIR, exist_ok=True)
    os.makedirs(VERIFIED_AI_DIR, exist_ok=True)

async def record_user_feedback(
    analysis_id: str,
    was_helpful: bool,
    user_suggested_label: Optional[str] = None,
    comments: Optional[str] = None,
    client_ip: Optional[str] = None
) -> Dict[str, Any]:
    """
    Records user feedback into feedback/pending/ for human review.
    Does NOT automatically retrain production models to prevent data poisoning.
    """
    init_feedback_directories()

    feedback_entry = {
        "analysisId": analysis_id,
        "wasHelpful": was_helpful,
        "userSuggestedLabel": user_suggested_label, # "real", "ai", "unsure"
        "comments": comments[:500] if comments else None,
        "timestamp": time.time(),
        "clientIp": client_ip,
        "status": "pending_review"
    }

    filename = f"feedback_{analysis_id[:16]}_{int(time.time())}.json"
    save_path = os.path.join(PENDING_DIR, filename)

    with open(save_path, "w", encoding="utf-8") as f:
        json.dump(feedback_entry, f, indent=2)

    logger.info(f"[FEEDBACK] Recorded user feedback for analysis {analysis_id} at {save_path}")
    return {"success": True, "message": "Feedback recorded for review. Thank you for improving CraftVerse!"}
