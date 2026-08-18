import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  FileText,
  RefreshCw,
  Download,
  Share2,
  Sparkles,
  Shield,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Film,
  X,
  Maximize2,
} from 'lucide-react';
import { AnalysisResult, SuspiciousFrame } from '../types';
import { VERDICT_CONFIG } from '../lib/constants';
import { staggerContainer, fadeUp } from '../lib/animations';
import { VerdictBadge } from './VerdictBadge';
import { ProgressRing } from './ProgressRing';
import { DetectionIndicator } from './DetectionIndicator';
import { ExplanationCard } from './ExplanationCard';
import { VideoTimeline } from './VideoTimeline';
import { GlowButton } from './GlowButton';
import { GlassCard } from './GlassCard';
import { Link } from 'react-router-dom';
import { downloadReport } from '../services/api';

interface ResultScreenProps {
  result: AnalysisResult;
  file?: File;
  onAnalyzeAnother: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, file, onAnalyzeAnother }) => {
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(result.thumbnailUrl);
  const [showMetadata, setShowMetadata] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedModalFrame, setSelectedModalFrame] = useState<SuspiciousFrame | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const config = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG['UNCERTAIN'];

  const handleDownloadReport = () => {
    const url = downloadReport(result.id);
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CraftVerse AI Forensic Report',
        text: `Analysis for ${result.originalFilename}: ${result.verdict} (${result.aiProbability}% AI Likelihood)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-5xl mx-auto w-full space-y-8"
    >
      {/* Top Header Bar: Analysis Complete + Action Buttons */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D3A8]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-beige-200" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] tracking-tight">
              Analysis Complete
            </h2>
          </div>
          <p className="text-beige-400 text-xs sm:text-sm font-mono">
            ID: <span className="text-beige-300">{result.id.slice(0, 18)}...</span> • {new Date(result.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <GlowButton onClick={handleDownloadReport} variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-1.5 text-beige-200" />
            Download Report
          </GlowButton>
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl glass text-xs font-semibold text-beige-200 hover:text-white border border-[#E8D3A8]/15 hover:border-[#E8D3A8]/35 transition-all flex items-center gap-1.5"
            title="Share report"
          >
            <Share2 className="w-3.5 h-3.5 text-beige-300" />
            <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
          </button>
          <GlowButton onClick={onAnalyzeAnother} size="sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-dark-950" />
            New Analysis
          </GlowButton>
        </div>
      </motion.div>

      {/* Main Core Findings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media Preview & Primary Verdict HUD */}
        <motion.div variants={fadeUp} className="lg:col-span-1 space-y-6">
          {/* Media Card */}
          <GlassCard className="p-3 border border-[#E8D3A8]/15 overflow-hidden bg-dark-900/85">
            <div className="bg-black rounded-xl overflow-hidden aspect-square flex items-center justify-center relative border border-white/5">
              {mediaUrl ? (
                result.mediaType === 'video' ? (
                  <video src={mediaUrl} className="w-full h-full object-contain" controls />
                ) : (
                  <img src={mediaUrl} className="w-full h-full object-contain" alt="Analyzed media" />
                )
              ) : (
                <div className="text-beige-600 text-sm flex flex-col items-center gap-2 font-mono">
                  <Shield className="w-8 h-8 text-beige-700" />
                  <span>Media Uploaded</span>
                </div>
              )}
            </div>

            <div className="mt-3 px-2 flex items-center justify-between text-xs text-beige-400 font-mono">
              <span className="truncate max-w-[150px]" title={result.originalFilename}>
                {result.originalFilename}
              </span>
              <span className="capitalize px-2 py-0.5 rounded bg-dark-800 text-beige-300 border border-[#E8D3A8]/10">
                {result.mediaType} • {formatBytes(result.fileSize)}
              </span>
            </div>
          </GlassCard>

          {/* Primary Score Ring Card */}
          <GlassCard className="flex flex-col items-center text-center p-6 border border-[#E8D3A8]/15 relative overflow-hidden bg-dark-900/85">
            <span className="text-xs font-mono uppercase tracking-widest text-beige-400 mb-4 font-bold">
              AI Likelihood Score
            </span>

            <ProgressRing
              progress={result.aiProbability}
              size={170}
              strokeWidth={8}
              color={config.color}
              showLabel
            />

            <div className="mt-6 flex flex-col items-center gap-2.5 w-full">
              <VerdictBadge verdict={result.verdict} size="lg" />
              <div className="flex items-center gap-2 text-xs font-mono text-beige-400 mt-1">
                <span>Confidence:</span>
                <span className="font-bold text-beige-100 uppercase tracking-wider px-2 py-0.5 rounded glass-badge border-[#E8D3A8]/20 bg-dark-950">
                  {result.confidence}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column: Timeline, Detection Indicators, AI Explanation */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
          {/* Video Suspicious Timeline (if video) */}
          {result.mediaType === 'video' && result.suspiciousFrames && result.suspiciousFrames.length > 0 && (
            <GlassCard className="p-6 border border-[#E8D3A8]/15 bg-dark-900/85">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-beige-200" />
                  <span>Suspicious Video Timeline</span>
                </h3>
                <span className="text-xs font-mono text-beige-400">
                  {result.suspiciousFrames.length} Suspicious Regions
                </span>
              </div>

              <VideoTimeline suspiciousFrames={result.suspiciousFrames} duration={100} />

              {/* Suspicious Frames Grid */}
              <div className="mt-6 pt-4 border-t border-[#E8D3A8]/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-beige-400 mb-3">
                  Flagged Frame Samples (Click to enlarge)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {result.suspiciousFrames.map((frame, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedModalFrame(frame)}
                      className="p-2.5 rounded-xl glass-badge border-[#E8D3A8]/15 hover:border-[#E8D3A8]/40 hover:bg-[#E8D3A8]/[0.05] transition-all text-left group bg-dark-950"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-beige-400 mb-1">
                        <span>@{frame.timestamp.toFixed(1)}s</span>
                        <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-beige-200" />
                      </div>
                      <div className="text-sm font-bold text-beige-200 font-mono">
                        {frame.score}% AI
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Detection Indicators */}
          <GlassCard className="p-6 border border-[#E8D3A8]/15 bg-dark-900/85">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-beige-200" />
              <span>Detection Indicators</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.indicators?.map((indicator, index) => (
                <DetectionIndicator
                  key={index}
                  name={indicator.name}
                  score={indicator.score}
                  index={index}
                />
              ))}
            </div>
          </GlassCard>

          {/* AI Forensic Reasoning & Explanation Card */}
          {result.explanation ? (
            <ExplanationCard explanation={result.explanation} />
          ) : (
            <div className="p-5 rounded-2xl glass border border-[#E8D3A8]/10 text-xs text-beige-500 font-mono bg-dark-900">
              AI explanation layer unavailable for this run.
            </div>
          )}
        </motion.div>
      </div>

      {/* Expandable Technical Information / Metadata Drawer */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6 border border-[#E8D3A8]/15 bg-dark-900/85">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-beige-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-beige-200" />
              <span>Technical Information & Forensic Metadata</span>
            </span>
            {showMetadata ? <ChevronUp className="w-4 h-4 text-beige-400" /> : <ChevronDown className="w-4 h-4 text-beige-400" />}
          </button>

          <AnimatePresence>
            {showMetadata && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-[#E8D3A8]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono"
              >
                <div>
                  <span className="text-beige-500 block">Analysis UUID</span>
                  <span className="text-beige-200 truncate block">{result.id}</span>
                </div>
                <div>
                  <span className="text-beige-500 block">File MIME</span>
                  <span className="text-beige-200 block">{result.mimeType}</span>
                </div>
                <div>
                  <span className="text-beige-500 block">Generator Signal</span>
                  <span className="text-beige-200 block">{result.generator || 'Standard Pattern'}</span>
                </div>
                <div>
                  <span className="text-beige-500 block">Timestamp</span>
                  <span className="text-beige-200 block">{new Date(result.createdAt).toISOString()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Bottom Footer Actions */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to={`/reports/${result.id}`}>
          <GlowButton variant="secondary" size="md">
            <FileText className="w-4 h-4 mr-2 text-beige-200" />
            View Full Report
          </GlowButton>
        </Link>
        <GlowButton onClick={handleDownloadReport} variant="secondary" size="md">
          <Download className="w-4 h-4 mr-2 text-beige-300" />
          Download PDF Report
        </GlowButton>
        <GlowButton onClick={onAnalyzeAnother} size="md">
          <RefreshCw className="w-4 h-4 mr-2 text-dark-950" />
          Analyze Another File
        </GlowButton>
      </motion.div>

      {/* Frame Preview Modal */}
      <AnimatePresence>
        {selectedModalFrame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedModalFrame(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-6 rounded-3xl border border-[#E8D3A8]/20 max-w-md w-full bg-dark-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-bold text-white">
                  Suspicious Frame @ {selectedModalFrame.timestamp.toFixed(2)}s
                </h4>
                <button
                  onClick={() => setSelectedModalFrame(null)}
                  className="p-1.5 rounded-lg glass text-beige-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-[#E8D3A8]/10">
                {mediaUrl ? (
                  <video src={mediaUrl} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-beige-600 text-sm font-mono">Frame View</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-beige-400">AI Probability:</span>
                <span className="text-beige-100 font-bold text-sm">{selectedModalFrame.score}%</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
