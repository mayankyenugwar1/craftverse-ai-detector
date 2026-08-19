import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyzeFile, getHistory, getHistoryItem, deleteAnalysis, generateReport } from '../services/api';

export const useAnalyze = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => analyzeFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

export const useAnalysisResult = (id: string) => {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => getHistoryItem(id),
    enabled: !!id,
  });
};

export const useHistory = () => {
  return useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });
};

export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: generateReport,
  });
};
