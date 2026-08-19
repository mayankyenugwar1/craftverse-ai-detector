import math
from typing import Tuple, Dict, Any

class ProbabilityCalibrator:
    """
    Temperature Scaling & Platt Scaling Calibrator.
    Maps raw model logits or uncalibrated softmax scores to mathematically sound,
    calibrated probabilities. Prevents overconfident 99% / 100% outputs.
    """
    def __init__(self, temperature: float = 1.45, platt_a: float = 1.0, platt_b: float = 0.0):
        self.temperature = max(0.1, temperature)
        self.platt_a = platt_a
        self.platt_b = platt_b

    def calibrate_logit(self, raw_logit: float) -> float:
        """
        Applies temperature scaling: z_calibrated = z / T
        Followed by Platt logistic sigmoid.
        """
        scaled_logit = raw_logit / self.temperature
        platt_logit = self.platt_a * scaled_logit + self.platt_b
        # Sigmoid bounded between 0.02 and 0.98 to avoid deceptive 0% / 100% claims
        prob = 1.0 / (1.0 + math.exp(-platt_logit))
        return max(0.02, min(0.98, prob))

    def calibrate_probability(self, raw_prob_ai: float) -> float:
        """
        Calibrates raw probability (0.0 to 1.0) into calibrated probability.
        Converts probability to log-odds (logit), scales via temperature, and converts back.
        """
        eps = 1e-6
        bounded_prob = max(eps, min(1.0 - eps, raw_prob_ai))
        # Log-odds
        logit = math.log(bounded_prob / (1.0 - bounded_prob))
        return self.calibrate_logit(logit)

def evaluate_verdict(
    calibrated_ai_prob: float,
    crop_std_dev: float = 0.0,
    forensic_disagreement: bool = False,
    ai_threshold: float = 0.65,
    real_threshold: float = 0.35
) -> Tuple[str, str, int, int, int, int]:
    """
    Evaluates final verdict, confidence level, and probability breakdown:
    - verdict: LIKELY_AI_GENERATED | LIKELY_AUTHENTIC | UNCERTAIN
    - confidence: high | medium | low
    - returns (verdict, confidence, ai_percentage, real_percentage, manipulation_percentage, uncertain_percentage)
    """
    ai_percentage = int(round(calibrated_ai_prob * 100))
    ai_percentage = max(2, min(98, ai_percentage))
    real_percentage = 100 - ai_percentage
    manipulation_percentage = int(round((1.0 - abs(calibrated_ai_prob - 0.5) * 2) * 30))
    uncertain_percentage = max(0, 100 - (abs(ai_percentage - 50) * 2))

    # High crop disagreement or forensic disagreement forces UNCERTAIN verdict
    if crop_std_dev > 0.22 or forensic_disagreement:
        verdict = "UNCERTAIN"
        confidence = "low"
    elif calibrated_ai_prob >= ai_threshold:
        verdict = "AI_GENERATED"
        if calibrated_ai_prob >= 0.85 and crop_std_dev < 0.10:
            confidence = "high"
        elif calibrated_ai_prob >= 0.75:
            confidence = "medium"
        else:
            confidence = "low"
    elif calibrated_ai_prob <= real_threshold:
        verdict = "LIKELY_AUTHENTIC"
        if calibrated_ai_prob <= 0.15 and crop_std_dev < 0.10:
            confidence = "high"
        elif calibrated_ai_prob <= 0.25:
            confidence = "medium"
        else:
            confidence = "low"
    else:
        verdict = "UNCERTAIN"
        confidence = "low"

    return verdict, confidence, ai_percentage, real_percentage, manipulation_percentage, uncertain_percentage
