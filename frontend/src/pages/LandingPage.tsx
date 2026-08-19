import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileImage,
  Video,
  Activity,
  FileText,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { UploadDropzone } from '../components/UploadDropzone';
import { FilePreview } from '../components/FilePreview';
import { AnalysisScanner } from '../components/AnalysisScanner';
import { ResultScreen } from '../components/ResultScreen';
import { ErrorState } from '../components/ErrorState';
import { AnalysisResult } from '../types';
import { ROUTES } from '../lib/constants';
import { pageTransition } from '../lib/animations';

type InPageWorkflowState = 'upload' | 'preview' | 'scanning' | 'result';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [workflowState, setWorkflowState] = useState<InPageWorkflowState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setWorkflowState('preview');
    setError(null);
  };

  const handleStartAnalysis = () => {
    if (selectedFile) {
      setWorkflowState('scanning');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setWorkflowState('upload');
    setError(null);
  };

  const handleScanComplete = (analysisResult: AnalysisResult) => {
    setResult(analysisResult);
    setWorkflowState('result');
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
    setWorkflowState('upload');
  };

  const resetProcess = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setWorkflowState('upload');
  };

  const handleDemo = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#141414');
        gradient.addColorStop(0.5, '#0D0D0D');
        gradient.addColorStop(1, '#080808');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = '#FAF6EE';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('AI Forensic Demo Target', 400, 280);
        ctx.font = '18px Inter, sans-serif';
        ctx.fillStyle = '#E8D3A8';
        ctx.fillText('CraftVerse Digital Forensics', 400, 330);
      }
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
      });
      const file = new File([blob], 'ai-synthetic-demo.png', { type: 'image/png' });
      setSelectedFile(file);
      setWorkflowState('scanning');
      document.getElementById('verify-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      navigate(`${ROUTES.DETECT}?demo=true`);
    }
  };

  const scrollToVerify = () => {
    const el = document.getElementById('verify-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3-step simple product explanation
  const howItWorksSteps = [
    {
      step: '01',
      icon: UploadCloud,
      title: '01 — Upload',
      desc: 'Add an image or video.',
    },
    {
      step: '02',
      icon: Scan,
      title: '02 — Analyze',
      desc: 'We inspect authenticity signals.',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: '03 — Verify',
      desc: 'Get a clear result and explanation.',
    },
  ];

  // Subtle capability strip
  const capabilities = [
    { icon: FileImage, label: 'Image Detection' },
    { icon: Video, label: 'Video Detection' },
    { icon: Activity, label: 'Forensic Signals' },
    { icon: FileText, label: 'AI Explanation' },
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full relative"
    >
      {/* Hero Section */}
      <HeroSection onUploadClick={scrollToVerify} onDemoClick={handleDemo} />

      {/* Primary In-Page Verification / Upload Section */}
      <section className="py-12 md:py-18 relative z-10 border-t border-[#E8D3A8]/10" id="verify-section">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 text-beige-300 text-xs font-mono mb-3 bg-dark-900/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF6EE] tracking-tight mb-3">
              Verify Your Content
            </h2>
            <p className="text-beige-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
              Upload an image or video to analyze its authenticity.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Upload State */}
            {workflowState === 'upload' && (
              <motion.div
                key="upload-box"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                {error && (
                  <div className="mb-6">
                    <ErrorState message={error} onRetry={() => setError(null)} onDemo={handleDemo} />
                  </div>
                )}

                <UploadDropzone onFileSelect={handleFileSelect} />

                <div className="mt-6 flex items-center justify-center gap-3">
                  <span className="text-xs text-beige-500">Need sample media to evaluate?</span>
                  <button
                    onClick={handleDemo}
                    className="text-xs text-beige-200 hover:text-white font-semibold underline underline-offset-4 transition-colors font-mono"
                  >
                    Run instant demo scan →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Preview State */}
            {workflowState === 'preview' && selectedFile && (
              <motion.div
                key="preview-box"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <FilePreview
                  file={selectedFile}
                  onRemove={handleRemoveFile}
                  onAnalyze={handleStartAnalysis}
                />
              </motion.div>
            )}

            {/* Scanning State */}
            {workflowState === 'scanning' && selectedFile && (
              <motion.div
                key="scanner-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Analyzing your content...</h3>
                  <p className="text-beige-400 text-sm font-mono">Evaluating synthetic signatures across neural models</p>
                </div>
                <AnalysisScanner
                  file={selectedFile}
                  onComplete={handleScanComplete}
                  onError={handleScanError}
                />
              </motion.div>
            )}

            {/* Result State */}
            {workflowState === 'result' && result && (
              <motion.div
                key="result-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResultScreen
                  result={result}
                  file={selectedFile || undefined}
                  onAnalyzeAnother={resetProcess}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simple 3-Step Explanation Below Upload Area */}
          <div className="mt-16 pt-12 border-t border-[#E8D3A8]/10">
            <div className="text-center mb-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-beige-400 font-bold mb-1">
                How It Works
              </h3>
              <p className="text-lg font-bold text-white">Three steps to verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {howItWorksSteps.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <GlassCard key={idx} className="p-5 text-center flex flex-col items-center border-[#E8D3A8]/15 bg-dark-900/80">
                    <div className="w-10 h-10 rounded-xl bg-dark-800 border border-[#E8D3A8]/20 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-beige-200" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-mono">{item.title}</h4>
                    <p className="text-beige-400 text-xs">{item.desc}</p>
                  </GlassCard>
                );
              })}
            </div>

            {/* Capability Strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-beige-300">
              {capabilities.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/15 bg-dark-950/70">
                    <Icon className="w-3.5 h-3.5 text-beige-200" />
                    <span>{cap.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-28 relative z-10 border-t border-[#E8D3A8]/10">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-14 rounded-3xl glass border border-[#E8D3A8]/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-dark-900/85"
          >
            <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-[#E8D3A8]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-beige-200" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF6EE] tracking-tight mb-4">
              Ready to verify digital authenticity?
            </h2>
            <p className="text-beige-400 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed font-normal">
              Scan images and videos with forensic confidence. Powered by probabilistic multi-signal intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton onClick={scrollToVerify} size="lg" className="w-full sm:w-auto shadow-[0_0_30px_rgba(232,211,168,0.25)]">
                <span>Start Detection</span>
                <ArrowRight className="w-4 h-4 ml-2 text-dark-950" />
              </GlowButton>
              <GlowButton href={ROUTES.HOW_IT_WORKS} variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Architecture
              </GlowButton>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};
