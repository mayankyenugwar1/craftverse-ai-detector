import { Verdict } from '../types';

export const classifyResult = (aiProb: number, manipProb: number): Verdict => {
  if (aiProb > 70) return 'AI_GENERATED';
  if (manipProb > 60) return 'MANIPULATED';
  if (aiProb < 30 && manipProb < 30) return 'LIKELY_AUTHENTIC';
  return 'UNCERTAIN';
};

export const getVerdictColor = (verdict: Verdict) => {
  switch (verdict) {
    case 'AI_GENERATED':
      return 'bg-beige-200/10 text-beige-200 border-beige-200/30';
    case 'LIKELY_AUTHENTIC':
      return 'bg-beige-100/10 text-beige-100 border-beige-100/25';
    case 'MANIPULATED':
      return 'bg-beige-400/10 text-beige-300 border-beige-400/30';
    case 'UNCERTAIN':
      return 'bg-beige-500/10 text-beige-500 border-beige-500/25';
    default:
      return 'bg-dark-800 text-beige-400 border-beige-500/20';
  }
};

export const getVerdictLabel = (verdict: Verdict) => {
  switch (verdict) {
    case 'AI_GENERATED':
      return 'AI Generated';
    case 'LIKELY_AUTHENTIC':
      return 'Likely Authentic';
    case 'MANIPULATED':
      return 'Manipulated';
    case 'UNCERTAIN':
      return 'Uncertain';
    default:
      return 'Unknown';
  }
};

export const getConfidenceLabel = (confidence: string) => {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
};
