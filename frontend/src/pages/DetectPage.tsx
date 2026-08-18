import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Shield } from 'lucide-react';
import { UploadDropzone } from '../components/UploadDropzone';
import { FilePreview } from '../components/FilePreview';
import { AnalysisScanner } from '../components/AnalysisScanner';
import { ResultScreen } from '../components/ResultScreen';
import { ErrorState } from '../components/ErrorState';
import { GlowButton } from '../components/GlowButton';
import { AnalysisResult } from '../types';
import { pageTransition } from '../lib/animations';

type ProcessState = 'upload' | 'preview' | 'scanning' | 'result';

export const DetectPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentState, setCurrentState] = useState<ProcessState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCurrentState('preview');
    setError(null);
  };

  const handleStartAnalysis = () => {
    if (selectedFile) {
      setCurrentState('scanning');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCurrentState('upload');
    setError(null);
  };

  const handleScanComplete = (analysisResult: AnalysisResult) => {
    setResult(analysisResult);
    setCurrentState('result');
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentState('upload');
  };

  const resetProcess = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setCurrentState('upload');
    if (searchParams.get('demo')) {
      setSearchParams({});
    }
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
      setCurrentState('scanning');
    } catch {
      const blob = new Blob(
        [
          new Uint8Array([
            137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0,
            0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12,
            73, 68, 65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 0, 3, 0, 1, 54,
            174, 206, 90, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
          ]),
        ],
        { type: 'image/png' }
      );
      const file = new File([blob], 'ai-synthetic-demo.png', { type: 'image/png' });
      setSelectedFile(file);
      setCurrentState('scanning');
    }
  };

  useEffect(() => {
    if (searchParams.get('demo') === 'true' && currentState === 'upload') {
      handleDemo();
    }
  }, [searchParams]);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 md:px-6 py-12 min-h-[calc(100vh-80px)] relative z-10"
    >
      <AnimatePresence mode="wait">
        {/* Upload State */}
        {currentState === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 text-beige-300 text-xs font-mono mb-3 bg-dark-900/80">
                <Shield className="w-3.5 h-3.5" />
                <span>Forensic Neural Inspection</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#FAF6EE] mb-4 tracking-tight">
                Upload your content
              </h1>
              <p className="text-lg text-beige-400 max-w-2xl mx-auto leading-relaxed">
                Drop an image or video here to analyze for AI-generated and manipulated content.
              </p>
            </div>

            {error && (
              <div className="mb-6">
                <ErrorState message={error} onRetry={() => setError(null)} />
              </div>
            )}

            <UploadDropzone onFileSelect={handleFileSelect} />

            <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-sm text-beige-500">Need sample media to evaluate?</span>
              <GlowButton variant="secondary" size="sm" onClick={handleDemo}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-beige-300" />
                Run Instant Demo Scan
              </GlowButton>
            </div>
          </motion.div>
        )}

        {/* File Preview State */}
        {currentState === 'preview' && selectedFile && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                File Ready For Analysis
              </h2>
              <p className="text-beige-400 text-sm">
                Confirm your selected media payload before initiating forensic inspection.
              </p>
            </div>

            <FilePreview
              file={selectedFile}
              onRemove={handleRemoveFile}
              onAnalyze={handleStartAnalysis}
            />
          </motion.div>
        )}

        {/* Scanning State */}
        {currentState === 'scanning' && selectedFile && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                Forensic Inspection Active
              </h2>
              <p className="text-beige-400 text-sm font-mono">
                Extracting diffusion signatures and temporal consistency vectors...
              </p>
            </div>
            <AnalysisScanner
              file={selectedFile}
              onComplete={handleScanComplete}
              onError={handleScanError}
            />
          </motion.div>
        )}

        {/* Result State */}
        {currentState === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <ResultScreen
              result={result}
              file={selectedFile || undefined}
              onAnalyzeAnother={resetProcess}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
