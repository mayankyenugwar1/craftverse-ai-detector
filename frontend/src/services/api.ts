import axios from 'axios';
import type { AnalysisResult } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return response.data.data || response.data;
};

export const getAnalysis = async (id: string): Promise<AnalysisResult> => {
  const response = await api.get(`/api/analyze/${id}`);
  return response.data.data || response.data;
};

export const getHistory = async (): Promise<AnalysisResult[]> => {
  const response = await api.get('/api/history');
  return response.data.data || response.data;
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
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/api/reports/${id}/download`;
};

export const getHealthStatus = async () => {
  const response = await api.get('/api/health');
  return response.data;
};
