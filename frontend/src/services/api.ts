import axios from 'axios';
import type { AnalysisResult } from '../types';

const rawBase = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBase ? rawBase.replace(/\/+$/, '') : (import.meta.env.DEV ? 'http://localhost:8000' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
});

// Development logger for transparent debugging
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`);
    return config;
  });
  api.interceptors.response.use(
    (response) => {
      console.debug(`[API Response] ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.warn(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${
          error.response?.status || 'Network Error'
        } | ${error.message}`
      );
      return Promise.reject(error);
    }
  );
}

// Error Code to User-Friendly Message Mapper
const formatErrorMessage = (error: any): string => {
  const data = error.response?.data;
  const detail = data?.detail;

  if (typeof detail === 'object' && detail !== null) {
    if (detail.message) return detail.message;
    if (detail.code === 'DETECTION_PROVIDER_NOT_CONFIGURED') return 'Live detection is not configured.';
    if (detail.code === 'DETECTION_PROVIDER_TIMEOUT') return 'The detection service took too long to respond.';
    if (detail.code === 'DETECTION_PROVIDER_AUTH_FAILED') return 'Detection provider authentication failed.';
    if (detail.code === 'DETECTION_RESPONSE_INVALID') return 'The detection service returned an invalid response.';
    if (detail.code === 'UNSUPPORTED_FILE') return 'This file format is not supported.';
    if (detail.code === 'FILE_TOO_LARGE') return 'This file exceeds the 200MB limit.';
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (error.message === 'Network Error' || !error.response) {
    return 'Live analysis service is temporarily unavailable.';
  }

  return error.message || 'Live detection is currently unavailable.';
};

// Deterministic client-side mock for offline resilience & demo flow
export const generateClientDemoResult = (filename: string = 'ai-synthetic-demo.png'): AnalysisResult => {
  const isVideo = filename.endsWith('.mp4') || filename.endsWith('.mov') || filename.endsWith('.webm');
  return {
    id: 'demo-' + Date.now().toString(36),
    filename,
    originalFilename: filename,
    mediaType: isVideo ? 'video' : 'image',
    mimeType: isVideo ? 'video/mp4' : 'image/png',
    fileSize: 1024 * 512,
    status: 'completed',
    analysisMode: 'demo',
    model: {
      engine: 'craftverse-onnx-vit-v1',
      model_loaded: true,
      fallback_used: false,
    },
    aiProbability: 92,
    realProbability: 8,
    manipulationProbability: 14,
    uncertainProbability: 8,
    verdict: 'AI_GENERATED',
    confidence: 'high',
    generator: 'Diffusion Transformer Model',
    createdAt: new Date().toISOString(),
    indicators: [
      { name: 'Synthetic Texture', score: 96, description: 'High likelihood of generated textures' },
      { name: 'Lighting Consistency', score: 88, description: 'Lighting anomalies found' },
      { name: 'Facial Anomalies', score: 91, description: 'Facial structure contains anomalous patterns' },
      { name: 'Pattern Uniformity', score: 85, description: 'Unnatural uniform patterns detected' },
      { name: 'Color Irregularities', score: 89, description: 'Color distribution matches synthetic models' },
    ],
    suspiciousFrames: isVideo
      ? [
          { timestamp: 0.8, score: 94 },
          { timestamp: 1.6, score: 91 },
          { timestamp: 2.4, score: 89 },
          { timestamp: 3.2, score: 96 },
        ]
      : [],
    explanation: {
      summary: 'The available detection signals strongly suggest that this content may have been generated using synthetic media techniques.',
      riskLevel: 'HIGH',
      recommendation: 'Verify through alternative sources before utilizing this asset in sensitive contexts.',
      explanation: 'Analysis detected significant synthetic artifacts across textures and structural patterns characteristic of neural generation pipelines.',
      keyFindings: [
        'High degree of unnatural texture smoothness and synthetic frequency artifacts.',
        'Lighting distribution contains inconsistencies across object boundaries.',
        'Color histograms exhibit quantization signatures typical of generative diffusion algorithms.',
        'Pattern uniformity suggests algorithmic synthesis rather than physical sensor capture.',
      ],
    },
  };
};

export const analyzeFile = async (file: File, isDemo: boolean = false): Promise<AnalysisResult> => {
  const isDemoRun = isDemo || file.name.includes('demo') || file.name.includes('synthetic');
  
  if (isDemoRun) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/analyze?is_demo=true', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data || response.data;
    } catch {
      console.info('[Demo Mode] Backend unreachable, using deterministic demo fixture.');
      return generateClientDemoResult(file.name);
    }
  }

  // Live user upload: Attempt execution with automatic retry on transient network errors
  let lastError: any = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      lastError = error;
      // Do not retry on client/validation errors (4xx or 503 unconfigured)
      if (error.response && (error.response.status >= 400 && error.response.status <= 503)) {
        break;
      }
      if (attempt < 2) {
        await new Promise((res) => setTimeout(res, 1200));
      }
    }
  }

  throw new Error(formatErrorMessage(lastError));
};

export const getAnalysis = async (id: string): Promise<AnalysisResult> => {
  try {
    const response = await api.get(`/api/analyze/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    if (id.startsWith('demo-')) {
      return generateClientDemoResult('ai-synthetic-demo.png');
    }
    throw error;
  }
};

export const getHistory = async (): Promise<AnalysisResult[]> => {
  try {
    const response = await api.get('/api/history');
    return response.data.data || response.data;
  } catch {
    return [];
  }
};

export const getHistoryItem = async (id: string): Promise<AnalysisResult> => {
  const response = await api.get(`/api/history/${id}`);
  return response.data.data || response.data;
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  await api.delete(`/api/history/${id}`);
};

export const generateReport = async (id: string): Promise<{ url: string }> => {
  const response = await api.post(`/api/reports/${id}`);
  return response.data;
};

export const downloadReport = (id: string): string => {
  const base = API_BASE_URL;
  return `${base}/api/reports/${id}/download`;
};

export const getHealthStatus = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch {
    return { status: 'offline', demoMode: true, provider: 'mock', providerConfigured: false, claudeConfigured: false };
  }
};
