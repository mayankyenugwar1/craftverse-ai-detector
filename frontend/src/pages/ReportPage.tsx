import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, CheckCircle2, Shield, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getHistoryItem, downloadReport } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { ReportSection } from '../components/ReportSection';
import { VerdictBadge } from '../components/VerdictBadge';
import { ProgressRing } from '../components/ProgressRing';
import { DetectionIndicator } from '../components/DetectionIndicator';
import { GlowButton } from '../components/GlowButton';
import { pageTransition, staggerContainer, fadeUp } from '../lib/animations';
import { VERDICT_CONFIG, ROUTES } from '../lib/constants';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getHistoryItem(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-beige-400">
        <LoadingSpinner />
        <p className="mt-4 font-mono text-xs animate-pulse tracking-wide">Synthesizing forensic documentation...</p>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorState message="Forensic report not found or failed to load." onRetry={() => refetch()} />
      </div>
    );
  }

  const handleDownload = () => {
    const url = downloadReport(result.id);
    window.open(url, '_blank');
  };

  const config = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG['UNCERTAIN'];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 md:px-6 py-12 max-w-4xl relative z-10"
    >
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#E8D3A8]/10">
        <button
          onClick={() => navigate(ROUTES.HISTORY)}
          className="flex items-center text-xs font-mono font-bold text-beige-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to History
        </button>
        <GlowButton onClick={handleDownload} variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-1.5 text-beige-200" />
          Download PDF Report
        </GlowButton>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 text-beige-300 text-xs font-mono mb-3 bg-dark-900/80">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Verifiable Record</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAF6EE] tracking-tight mb-2">
            Forensic Analysis Report
          </h1>
          <p className="text-beige-400 font-mono text-xs">
            Report ID: <span className="text-beige-200">{result.id}</span>
          </p>
        </div>

        {/* Section 1: Overview */}
        <motion.div variants={fadeUp}>
          <ReportSection title="Metadata Overview" icon={Info}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <p className="text-beige-500 mb-1">Target Filename</p>
                <p className="text-white font-bold truncate">{result.originalFilename}</p>
              </div>
              <div>
                <p className="text-beige-500 mb-1">Media Class</p>
                <p className="text-white font-bold capitalize">{result.mediaType}</p>
              </div>
              <div>
                <p className="text-beige-500 mb-1">Timestamp</p>
                <p className="text-white font-bold">{new Date(result.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-beige-500 mb-1">Status</p>
                <p className="text-beige-200 font-bold capitalize">{result.status}</p>
              </div>
            </div>
          </ReportSection>
        </motion.div>

        {/* Section 2: Authenticity Assessment */}
        <motion.div variants={fadeUp}>
          <ReportSection title="Authenticity Assessment" icon={CheckCircle2}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <ProgressRing progress={result.aiProbability} size={150} color={config.color} showLabel />
              </div>
              <div className="flex-grow space-y-4 w-full">
                <div className="flex items-center gap-4">
                  <VerdictBadge verdict={result.verdict} size="lg" />
                  <span className="text-xs font-mono text-beige-400">
                    Confidence: <strong className="text-white uppercase font-bold">{result.confidence}</strong>
                  </span>
                </div>
                <div className="h-px bg-dark-800 w-full" />
                <div className="grid grid-cols-3 gap-4 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-dark-950/80 border border-[#E8D3A8]/10">
                    <p className="text-beige-500 mb-1">AI Generated</p>
                    <p className="text-beige-200 font-bold text-sm">{result.aiProbability}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-950/80 border border-[#E8D3A8]/10">
                    <p className="text-beige-500 mb-1">Authentic</p>
                    <p className="text-beige-100 font-bold text-sm">{result.realProbability}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-950/80 border border-[#E8D3A8]/10">
                    <p className="text-beige-500 mb-1">Manipulated</p>
                    <p className="text-beige-300 font-bold text-sm">{result.manipulationProbability}%</p>
                  </div>
                </div>
              </div>
            </div>
          </ReportSection>
        </motion.div>

        {/* Section 3: AI Explanation */}
        {result.explanation && (
          <motion.div variants={fadeUp}>
            <ReportSection title="AI Forensic Explanation" icon={FileText}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold text-beige-400 uppercase tracking-widest mb-2">
                    Executive Summary
                  </h4>
                  <p className="text-beige-200 leading-relaxed text-sm">{result.explanation.summary}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-beige-400 uppercase tracking-widest mb-3">
                    Observed Indicators
                  </h4>
                  <ul className="space-y-2 text-sm text-beige-100">
                    {result.explanation.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-beige-200 mt-0.5 shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-dark-950 p-4 rounded-xl border border-[#E8D3A8]/15 text-xs sm:text-sm">
                  <h4 className="text-xs font-mono font-bold text-beige-200 uppercase tracking-wider mb-1">
                    Recommendation
                  </h4>
                  <p className="text-beige-300 leading-relaxed">{result.explanation.recommendation}</p>
                </div>
              </div>
            </ReportSection>
          </motion.div>
        )}

        {/* Section 4: Technical Indicators */}
        <motion.div variants={fadeUp}>
          <ReportSection title="Technical Signal Breakdown" icon={Shield}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.indicators.map((ind, idx) => (
                <DetectionIndicator key={idx} name={ind.name} score={ind.score} />
              ))}
            </div>
          </ReportSection>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
