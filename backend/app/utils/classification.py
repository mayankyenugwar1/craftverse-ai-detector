def classify_result(ai_probability: int, manipulation_probability: int) -> tuple[str, str]:
    """Returns (verdict, confidence)"""
    if manipulation_probability >= 70:
        verdict = "MANIPULATED"
        confidence = "high" if manipulation_probability >= 85 else "medium"
    elif ai_probability >= 90:
        verdict = "AI_GENERATED"
        confidence = "high"
    elif ai_probability >= 70:
        verdict = "AI_GENERATED"
        confidence = "medium" if ai_probability >= 80 else "low"
    elif ai_probability <= 30:
        verdict = "LIKELY_AUTHENTIC"
        confidence = "high" if ai_probability <= 15 else "medium"
    else:
        verdict = "UNCERTAIN"
        confidence = "low"
    return verdict, confidence
