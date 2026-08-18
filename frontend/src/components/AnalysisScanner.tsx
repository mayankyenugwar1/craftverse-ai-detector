import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Circle, Radio, Film, Sparkles } from 'lucide-react';
import { analyzeFile } from '../services/api';
import { AnalysisResult } from '../types';
import { GlassCard } from './GlassCard';

interface AnalysisScannerProps {
  file: File;
  onComplete: (result: AnalysisResult) => void;
  onError: (error: string) => void;
}

const SCANNER_STAGES = [
  'Reading media',
  'Scanning patterns',
  'Checking artifacts',
  'Evaluating authenticity',
  'Generating report',
];

export const AnalysisScanner: React.FC<AnalysisScannerProps> = ({ file, onComplete, onError }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  const isVideo = file.type.startsWith('video/');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Video frame active timeline simulator
  useEffect(() => {
    if (!isVideo) return;
    const frameInterval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % 6);
    }, 450);
    return () => clearInterval(frameInterval);
  }, [isVideo]);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev < SCANNER_STAGES.length - 1 ? prev + 1 : prev));
    }, 1100);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) return prev + 6;
        if (prev < 70) return prev + 4;
        if (prev < 92) return prev + 2;
        return prev;
      });
    }, 350);

    let isMounted = true;
    const executeAnalysis = async () => {
      try {
        const result = await analyzeFile(file);
        if (!isMounted) return;

        clearInterval(stageInterval);
        clearInterval(progressInterval);
        setProgress(100);
        setStageIndex(SCANNER_STAGES.length - 1);
        setIsCompleted(true);

        // Smooth transition period (550ms)
        setTimeout(() => {
          if (isMounted) onComplete(result);
        }, 550);
      } catch (err: any) {
        if (!isMounted) return;
        clearInterval(stageInterval);
        clearInterval(progressInterval);
        onError(err.response?.data?.detail || err.message || 'Analysis could not be completed.');
      }
    };

    executeAnalysis();

    return () => {
      isMounted = false;
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [file, onComplete, onError]);

  return (
    <GlassCard className="max-w-4xl mx-auto overflow-hidden relative p-0 border border-[#E8D3A8]/20 shadow-[0_0_60px_rgba(0,0,0,0.8)] bg-dark-900/90">
      {/* Top HUD Banner */}
      <div className="px-6 py-3 bg-dark-950/90 border-b border-[#E8D3A8]/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-beige-300">
          <Activity className="w-4 h-4 text-beige-200 animate-pulse" />
          <span className="font-bold tracking-wider">Analyzing your content...</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-beige-400">
          <span className="truncate max-w-[180px]">{file.name}</span>
          <span className="text-beige-200 font-bold">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        {isVideo ? (
          <video
            src={previewUrl}
            className="w-full h-full object-contain opacity-80"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={previewUrl}
            className="w-full h-full object-contain opacity-80"
            alt="Scanning target"
          />
        )}

        {/* Laser Scanline Beam in Champagne */}
        <motion.div
          className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F3E7CE] to-transparent shadow-[0_0_20px_3px_rgba(232,211,168,0.7)]"
          animate={{ y: ['-10%', '110%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: 0 }}
        />

        {/* Forensic Micro Grid */}
        <div className="absolute inset-0 bg-forensic-grid opacity-30 pointer-events-none" />

        {/* Technical Corner Brackets in Warm Beige */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#E8D3A8]/60 shadow-[0_0_10px_rgba(232,211,168,0.3)]" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#E8D3A8]/60 shadow-[0_0_10px_rgba(232,211,168,0.3)]" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#E8D3A8]/60 shadow-[0_0_10px_rgba(232,211,168,0.3)]" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#E8D3A8]/60 shadow-[0_0_10px_rgba(232,211,168,0.3)]" />

        {/* Live Audio/Signal Waveform Visualizer in Beige */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1.5 rounded-full glass-badge border-[#E8D3A8]/20 bg-dark-950/80">
          {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 bg-[#E8D3A8] rounded-full"
              animate={{ height: [`${h * 0.25}px`, `${h * 0.45}px`, `${h * 0.25}px`] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>

      {/* Video Frame Strip (if video) */}
      {isVideo && (
        <div className="px-6 py-3 bg-dark-950 border-t border-[#E8D3A8]/10 flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-beige-400 flex-shrink-0">
            <Film className="w-3.5 h-3.5 text-beige-300" />
            <span>Frames:</span>
          </div>
          <div className="flex items-center gap-2 flex-grow">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`flex-1 h-10 rounded-lg border transition-all flex items-center justify-center text-[10px] font-mono ${
                  activeFrameIndex === idx
                    ? 'border-beige-200 bg-[#E8D3A8]/15 text-beige-100 shadow-[0_0_10px_rgba(232,211,168,0.25)] scale-105'
                    : 'border-white/5 bg-white/[0.02] text-beige-600'
                }`}
              >
                F0{idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sequential Stages Workflow HUD & Progress */}
      <div className="p-6 bg-dark-900/95 border-t border-[#E8D3A8]/10 backdrop-blur-2xl">
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-beige-400">Current Phase:</span>
            <span className="text-beige-200 font-bold">{SCANNER_STAGES[stageIndex]}</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden p-0.5 border border-[#E8D3A8]/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#F3E7CE] via-[#E8D3A8] to-[#C8A96B] shadow-[0_0_15px_rgba(232,211,168,0.4)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stages List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#E8D3A8]/10">
          {SCANNER_STAGES.map((stage, idx) => {
            const isDone = stageIndex > idx || isCompleted;
            const isCurrent = stageIndex === idx && !isCompleted;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 transition-colors ${
                  isDone
                    ? 'text-beige-100'
                    : isCurrent
                    ? 'text-beige-200 font-bold'
                    : 'text-beige-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-beige-100" />
                ) : isCurrent ? (
                  <Radio className="w-3.5 h-3.5 flex-shrink-0 text-beige-300 animate-pulse" />
                ) : (
                  <Circle className="w-3.5 h-3.5 flex-shrink-0 text-dark-600" />
                )}
                <span className="truncate">{stage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};
