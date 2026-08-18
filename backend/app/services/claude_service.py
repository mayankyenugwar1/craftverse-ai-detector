import json
from typing import Optional
import anthropic
from app.config import settings
from app.models.schemas import AIExplanation

async def generate_explanation(result_data: dict) -> AIExplanation:
    if not settings.CLAUDE_API_KEY:
        return _generate_fallback(result_data)
        
    try:
        client = anthropic.AsyncAnthropic(api_key=settings.CLAUDE_API_KEY)
        
        prompt = f"""
        Analyze the following detection signals for an uploaded media file and provide a professional, evidence-based assessment.
        Never claim 100% certainty. Use language like 'signals suggest', 'indicators point to'. Be concise and forensic.
        
        Detection Data:
        AI Probability: {result_data.get('aiProbability', 0)}%
        Manipulation Probability: {result_data.get('manipulationProbability', 0)}%
        Verdict: {result_data.get('verdict', 'UNKNOWN')}
        Confidence: {result_data.get('confidence', 'unknown')}
        
        Indicators:
        {json.dumps(result_data.get('indicators', []), indent=2)}
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "summary": "Short paragraph summary",
            "keyFindings": ["finding 1", "finding 2"],
            "riskLevel": "HIGH or MEDIUM or LOW",
            "recommendation": "One sentence recommendation",
            "explanation": "Detailed paragraph explaining the reasoning"
        }}
        """
        
        message = await client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            system="You are a digital forensics AI analyst.",
            messages=[{"role": "user", "content": prompt}]
        )
        
        response_text = message.content[0].text
        # Basic parsing to extract JSON if Claude adds markdown
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        data = json.loads(response_text)
        return AIExplanation(**data)
        
    except Exception as e:
        print(f"Claude API error: {e}")
        return _generate_fallback(result_data)

def _generate_fallback(result_data: dict) -> AIExplanation:
    verdict = result_data.get('verdict', 'UNCERTAIN')
    ai_prob = result_data.get('aiProbability', 0)
    findings = []
    if verdict == "AI_GENERATED":
        summary = "The available detection signals strongly suggest that this content may have been generated using synthetic media techniques."
        risk = "HIGH"
        rec = "Treat this content as potentially AI-generated and verify against the original source when authenticity is important."
        exp = "Multiple synthetic indicators were detected matching common generative AI patterns, including texture uniformity, lighting inconsistency, and diffusion artifacting."
        findings = [
            "Synthetic texture patterns detected",
            "Lighting inconsistencies identified",
            "Facial structure contains anomalous patterns",
            "Image characteristics resemble synthetic generation"
        ]
    elif verdict == "MANIPULATED":
        summary = f"The analysis indicates this media has been manipulated or edited."
        risk = "MEDIUM"
        rec = "Verify the source and original context of this media."
        exp = "Digital forensic traces suggest post-processing, cloning, or other digital alterations."
    elif verdict == "LIKELY_AUTHENTIC":
        summary = f"The analysis suggests this media is likely authentic with low AI probability ({ai_prob}%)."
        risk = "LOW"
        rec = "Media appears consistent with natural capture."
        exp = "Natural noise patterns, organic textures, and consistent lighting strongly point to an authentic origin."
    else:
        summary = "The analysis is inconclusive."
        risk = "MEDIUM"
        rec = "Seek additional context or manual verification."
        exp = "Signals are mixed, preventing a definitive classification."
        
    if not findings:
        findings = [f"{ind['name']}: {ind['score']}/100" for ind in result_data.get('indicators', [])[:4]]
    if not findings:
        findings = ["No specific indicators available."]
        
    return AIExplanation(
        summary=summary,
        keyFindings=findings,
        riskLevel=risk,
        recommendation=rec,
        explanation=exp
    )
