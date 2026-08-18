import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, FileImage, FileVideo, Sparkles } from 'lucide-react';
import { SUPPORTED_EXTENSIONS, SUPPORTED_FORMATS, MAX_FILE_SIZE } from '../lib/constants';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setError(null);
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Unsupported file type. Please upload JPG, PNG, WEBP, MP4, MOV, or WEBM.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is larger than 200MB limit.');
      return;
    }
    onFileSelect(file);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, [disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  return (
    <GlassCard className="min-h-[420px] flex items-center justify-center relative overflow-hidden transition-all duration-300 p-0 border border-[#E8D3A8]/15 shadow-[0_20px_60px_rgba(0,0,0,0.7)] bg-dark-900/80">
      {/* Dynamic Animated Border & Glow Background */}
      <motion.div
        className={`absolute inset-0 border-2 border-dashed rounded-2xl transition-all duration-300 pointer-events-none ${
          error
            ? 'border-red-500/80 bg-red-500/5 shadow-[inset_0_0_30px_rgba(239,68,68,0.1)]'
            : isDragOver
            ? 'border-beige-200 bg-[#E8D3A8]/[0.08] shadow-[0_0_40px_rgba(232,211,168,0.2),inset_0_0_40px_rgba(232,211,168,0.1)]'
            : 'border-[#E8D3A8]/15 hover:border-[#E8D3A8]/35 bg-transparent'
        }`}
      />

      {/* Floating Particle Indicators on Drag */}
      {isDragOver && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-beige-200 blur-[1px]"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-beige-400 blur-[1px]"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      )}

      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload Icon with Spring Hover & Ambient Warm Glow */}
        <motion.div
          animate={{
            scale: isDragOver ? 1.15 : 1,
            y: isDragOver ? -4 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className={`relative p-6 rounded-3xl mb-6 border transition-all duration-300 ${
            isDragOver
              ? 'bg-[#E8D3A8]/20 border-[#E8D3A8]/50 shadow-[0_0_30px_rgba(232,211,168,0.3)]'
              : 'bg-dark-800/80 border-[#E8D3A8]/15 shadow-[0_10px_25px_rgba(0,0,0,0.5)]'
          }`}
        >
          <Upload
            className={`w-10 h-10 transition-colors duration-300 ${
              isDragOver ? 'text-beige-100' : 'text-beige-300'
            }`}
            strokeWidth={1.5}
          />
          {isDragOver && (
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-beige-200 animate-spin-slow" />
          )}
        </motion.div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] mb-2 tracking-tight">
          Drop an image or video here
        </h3>
        <p className="text-beige-400 text-sm sm:text-base mb-8 max-w-sm font-normal">
          or browse from your device
        </p>

        <GlowButton
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          size="md"
        >
          Browse Files
        </GlowButton>

        {/* Supported Formats Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-beige-400">
          <span className="px-2.5 py-1 rounded-lg bg-dark-800 border border-[#E8D3A8]/10 flex items-center gap-1 text-beige-300">
            <FileImage className="w-3 h-3 text-beige-300" />
            JPG • PNG • WEBP
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-dark-800 border border-[#E8D3A8]/10 flex items-center gap-1 text-beige-300">
            <FileVideo className="w-3 h-3 text-beige-400" />
            MP4 • MOV • WEBM
          </span>
          <span className="text-beige-600 px-1 font-semibold">Max 200MB</span>
        </div>

        {/* Inline Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex items-center gap-2 bg-red-500/10 text-red-300 px-4 py-2.5 rounded-xl border border-red-500/25 backdrop-blur-md text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={SUPPORTED_EXTENSIONS}
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </GlassCard>
  );
};
