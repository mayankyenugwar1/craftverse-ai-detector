import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../hooks/useAnalysis';
import { HistoryCard } from '../components/HistoryCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { ROUTES } from '../lib/constants';
import { pageTransition, staggerContainer, fadeUp } from '../lib/animations';

export const HistoryPage: React.FC = () => {
  const { data: history, isLoading, isError, refetch } = useHistory();
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 md:px-6 py-12 min-h-[calc(100vh-80px)] relative z-10"
    >
      <div className="mb-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 bg-dark-900/80 mb-3 text-beige-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Log Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAF6EE] tracking-tight">
          Analysis History
        </h1>
        <p className="text-beige-400 text-sm sm:text-base mt-1">
          Review past forensic inspections, verification logs, and authenticity reports.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} className="h-28 animate-pulse bg-dark-900/60 border border-[#E8D3A8]/10" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            message="Failed to load analysis history. Please try again."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && history?.length === 0 && (
          <GlassCard className="text-center py-20 border border-[#E8D3A8]/15 bg-dark-900/85">
            <Shield className="w-16 h-16 text-beige-600 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-white mb-2">No analyses recorded yet</h3>
            <p className="text-beige-400 mb-8 text-sm">Upload media to begin generating verifiable audit records.</p>
            <GlowButton onClick={() => navigate(ROUTES.DETECT)}>
              Analyze Your First File
            </GlowButton>
          </GlassCard>
        )}

        {!isLoading && !isError && history && history.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {history.map((result) => (
              <motion.div key={result.id} variants={fadeUp}>
                <HistoryCard
                  result={result}
                  onClick={() => navigate(`/history/${result.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
