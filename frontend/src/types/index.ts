export type Verdict = 'AI_GENERATED' | 'LIKELY_AUTHENTIC' | 'MANIPULATED' | 'UNCERTAIN';
export type Confidence = 'low' | 'medium' | 'high';
export type MediaType = 'image' | 'video';
export type AnalysisStatus = 'queued' | 'analyzing' | 'completed' | 'failed';

export interface DetectionIndicator {
  name: string;
  score: number;
  description?: string;
}

export interface SuspiciousFrame {
  timestamp: number;
  score: number;
  thumbnail?: string;
}

export interface AIExplanation {
  summary: string;
  keyFindings: string[];
  riskLevel: string;
  recommendation: string;
  explanation: string;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  frameCount?: number;
}

export interface AnalysisResult {
  id: string;
  filename: string;
  originalFilename: string;
  mediaType: MediaType;
  mimeType: string;
  fileSize: number;
  status: AnalysisStatus;
  aiProbability: number;
  realProbability: number;
  manipulationProbability: number;
  uncertainProbability: number;
  verdict: Verdict;
  confidence: Confidence;
  generator?: string;
  indicators: DetectionIndicator[];
  suspiciousFrames?: SuspiciousFrame[];
  explanation?: AIExplanation;
  metadata?: MediaMetadata;
  analysisMode?: 'demo' | 'live';
  model?: {
    name?: string;
    engine?: string;
    model_loaded?: boolean;
    fallback_used?: boolean;
    version?: string;
  };
  createdAt: string;
  thumbnailUrl?: string;
}
