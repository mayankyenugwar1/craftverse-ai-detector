import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getHistoryItem } from '../services/api';
import { ResultScreen } from '../components/ResultScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { pageTransition } from '../lib/animations';
import { ROUTES } from '../lib/constants';

export const HistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading, isError, refetch } = useQuery({
    queryKey: ['history', id],
    queryFn: () => getHistoryItem(id!),
    enabled: !!id,
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 md:px-6 py-10 min-h-[calc(100vh-80px)] relative z-10"
    >
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(ROUTES.HISTORY)}
          className="flex items-center text-xs font-mono font-bold text-beige-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to History
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64 text-beige-400">
          <LoadingSpinner size={32} />
          <span className="mt-4 font-mono text-xs animate-pulse">Loading inspection record...</span>
        </div>
      )}

      {isError && (
        <ErrorState
          message="Failed to load analysis details. The item may have been deleted."
          onRetry={() => refetch()}
        />
      )}

      {result && (
        <ResultScreen
          result={result}
          onAnalyzeAnother={() => navigate(ROUTES.DETECT)}
        />
      )}
    </motion.div>
  );
};
