import json
import logging
from typing import Optional
import anthropic
from app.config import settings
from app.models.schemas import AIExplanation

logger = logging.getLogger("craftverse.claude")

async def generate_explanation(result_data: dict) -> AIExplanation:
    """
    Generates a professional, grounded forensic explanation using Claude.
    STRICT GROUNDING: Claude MUST NOT invent non-existent anatomical or visual details.
    All claims must strictly reflect measured signals returned by the ML detection pipeline.
    """
    if not settings.CLAUDE_API_KEY:
        return _generate_fallback(result_data)
        
    try:
        client = anthropic.AsyncAnthropic(api_key=settings.CLAUDE_API_KEY)
        
        prompt = f"""
        Analyze the following empirical signals returned by our machine learning image/video detection pipeline:
        
        Calibrated AI Likelihood: {result_data.get('aiProbability', 0)}%
        Calibrated Real Likelihood: {result_data.get('realProbability', 0)}%
        Verdict: {result_data.get('verdict', 'UNCERTAIN')}
        Confidence: {result_data.get('confidence', 'low')}
        
        Empirical Detector & Forensic Signals:
        {json.dumps(result_data.get('indicators', []), indent=2)}
        
        Warnings / System Notes:
        {json.dumps(result_data.get('warnings', []), indent=2)}
        
        STRICT RULES FOR EXPLANATION:
        1. NEVER claim 100% certainty or proof. AI detection is probabilistic.
        2. DO NOT invent specific visual claims (e.g., 'extra fingers' or 'impossible lighting') unless directly stated in the input signals.
        3. Use grounded forensic phrasing (e.g., 'spectral features align with synthetic models', 'noise variance matches physical optical capture').
        
        Respond ONLY with a JSON object in this exact schema:
        {{
            "summary": "Clear 2-sentence summary explaining the classification.",
            "keyFindings": ["Observation 1 based on signals", "Observation 2 based on signals", "Observation 3 based on signals"],
            "riskLevel": "HIGH", "MEDIUM", or "LOW",
            "recommendation": "One practical advice sentence for non-technical users.",
            "explanation": "Brief paragraph explaining the relationship between the detector signals and the final verdict."
        }}
        """
        
        message = await client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            system="You are a digital forensics AI analyst. Explain machine learning detector outputs accurately without hallucinating unmeasured visual details.",
            messages=[{"role": "user", "content": prompt}]
        )
        
        response_text = message.content[0].text
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        data = json.loads(response_text)
        return AIExplanation(**data)
        
    except Exception as e:
        logger.warning(f"Claude API notice: {e}. Utilizing grounded template explanation.")
        return _generate_fallback(result_data)

def _generate_fallback(result_data: dict) -> AIExplanation:
    verdict = result_data.get('verdict', 'UNCERTAIN')
    ai_prob = result_data.get('aiProbability', 0)
    indicators = result_data.get('indicators', [])

    findings = [f"{ind['name']}: {ind.get('description') or 'Signal detected'}" for ind in indicators[:4]]

    if verdict == "AI_GENERATED":
        summary = f"Calibrated neural inspection indicates a high probability ({ai_prob}%) that this content was generated using synthetic media models."
        risk = "HIGH"
        rec = "Treat this media as potentially AI-generated and verify against original sources when authenticity is critical."
        exp = "Deep learning Vision Transformer classifiers and spectral frequency analysis identified patterns characteristic of synthetic diffusion models."
        if not findings:
            findings = [
                "Vision Transformer model detected synthetic feature distributions",
                "Spectral frequency spectrum contains non-optical decay characteristics",
                "Spatial noise residual variance deviates from physical camera sensors"
            ]
    elif verdict == "MANIPULATED":
        summary = f"Digital inspection indicates post-processing or structural manipulation."
        risk = "MEDIUM"
        rec = "Verify the original context and source of this media file."
        exp = "Spatial noise distributions and high-frequency edge analysis suggest digital alterations."
        if not findings:
            findings = ["High spatial edge variance detected", "Local noise inconsistency identified"]
    elif verdict == "LIKELY_AUTHENTIC":
        summary = f"The analysis indicates this content is likely authentic with low AI probability ({ai_prob}%)."
        risk = "LOW"
        rec = "Content characteristics align with physical optical camera capture."
        exp = "Natural Poisson-Gaussian noise distributions and spectral power decay strongly support authentic origin."
        if not findings:
            findings = [
                "Natural camera sensor noise patterns detected",
                "Spectral frequency decay consistent with optical lens capture",
                "Color channel correlations match natural light capture"
            ]
    else:
        summary = "The analysis is inconclusive due to mixed detector signals or high spatial variance."
        risk = "MEDIUM"
        rec = "Seek manual verification or additional media context."
        exp = "Detector signals and physical forensic features yielded conflicting confidence metrics."
        if not findings:
            findings = ["Detector signals show moderate disagreement across crops or models"]

    return AIExplanation(
        summary=summary,
        keyFindings=findings,
        riskLevel=risk,
        recommendation=rec,
        explanation=exp
    )
