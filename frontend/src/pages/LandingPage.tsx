import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Video, FileText, Layers, UploadCloud, Scan, BarChart3, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
import { pageTransition, staggerContainer, fadeUp } from '../lib/animations';

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
    } catch {
      navigate(`${ROUTES.DETECT}?demo=true`);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Neural Texture Analysis',
      desc: 'Detects microscopic diffusion anomalies, unnatural pixel uniformities, and high-frequency GAN/Transformer artifacts.',
      badge: 'Multi-Model',
    },
    {
      icon: Video,
      title: 'Temporal Video Forensics',
      desc: 'Performs frame-by-frame temporal consistency checks to expose deepfakes and manipulated segments across video timelines.',
      badge: '4K Ready',
    },
    {
      icon: FileText,
      title: 'Evidence-Based Explanations',
      desc: 'Generates detailed forensic reasoning powered by Claude AI to explain why content was flagged with key indicators.',
      badge: 'Reasoning Engine',
    },
    {
      icon: Layers,
      title: 'Provider-Agnostic Core',
      desc: 'Modular backend architecture supporting Sightengine, Hive Moderation, and deterministic offline mock detection.',
      badge: 'Enterprise Standard',
    },
  ];

  const steps = [
    {
      step: '01',
      icon: UploadCloud,
      title: 'Upload Media',
      desc: 'Drag & drop any image or video (up to 200MB) in JPG, PNG, WEBP, MP4, MOV, or WEBM format.',
    },
    {
      step: '02',
      icon: Scan,
      title: 'Forensic Scan',
      desc: 'Our engine extracts structural features, analyzes noise distributions, and checks for synthetic signatures.',
    },
    {
      step: '03',
      icon: BarChart3,
      title: 'Evidence & Report',
      desc: 'Review probabilistic confidence scores, suspicious indicators, and download a verifiable forensic report.',
    },
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
      <HeroSection />

      {/* Primary In-Page Verification / Upload Section */}
      <section className="py-16 md:py-24 relative z-10" id="verify-section">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 text-beige-300 text-xs font-mono mb-3 bg-dark-900/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF6EE] tracking-tight mb-4">
              Upload your content
            </h2>
            <p className="text-beige-400 text-base sm:text-lg max-w-2xl mx-auto">
              Drop an image or video here to analyze for AI-generated and manipulated content.
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
                    <ErrorState message={error} onRetry={() => setError(null)} />
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
                  <h3 className="text-2xl font-bold text-white mb-1">Scanning In Progress</h3>
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
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 relative z-10 border-t border-[#E8D3A8]/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-beige-400 font-bold mb-3">
              Forensic Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#FAF6EE] tracking-tight">
              Enterprise-Grade AI Detection Engine
            </h3>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={fadeUp}>
                  <GlassCard hover className="h-full flex flex-col p-7 relative group border-[#E8D3A8]/15 bg-dark-900/80">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-[#E8D3A8]/20 flex items-center justify-center group-hover:border-[#E8D3A8]/45 transition-colors">
                        <Icon className="w-6 h-6 text-beige-200 group-hover:text-white transition-colors" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md glass-badge text-beige-400 border-[#E8D3A8]/15">
                        {feature.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="text-beige-400 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-dark-900/50 border-y border-[#E8D3A8]/10 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-beige-400 font-bold mb-3">
              Detection Pipeline
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#FAF6EE] tracking-tight">
              How CraftVerse Verifies Media
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center border border-[#E8D3A8]/25 shadow-[0_0_25px_rgba(232,211,168,0.1)] bg-dark-900">
                      <Icon className="w-9 h-9 text-beige-200" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-dark-950 text-beige-200 font-mono text-xs font-bold flex items-center justify-center border border-[#E8D3A8]/40 shadow-lg">
                      {step.step}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-beige-400 text-sm max-w-xs leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 md:py-32 relative z-10">
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
              <GlowButton href={ROUTES.DETECT} size="lg" className="w-full sm:w-auto shadow-[0_0_30px_rgba(232,211,168,0.25)]">
                <span>Start Detection</span>
                <ArrowRight className="w-4 h-4 ml-2 text-dark-950" />
              </GlowButton>
              <GlowButton href={ROUTES.HOW_IT_WORKS} variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Pipeline
              </GlowButton>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};
