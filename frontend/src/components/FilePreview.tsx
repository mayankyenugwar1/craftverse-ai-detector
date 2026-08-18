import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon, Video, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowButton } from './GlowButton';
import { GlassCard } from './GlassCard';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  onAnalyze: () => void;
  disabled?: boolean;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  onAnalyze,
  disabled = false,
  className = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage || isVideo) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <GlassCard className={`p-6 sm:p-8 border border-[#E8D3A8]/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-dark-900/85 ${className}`}>
      {/* Top Bar: Media Info & Remove */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8D3A8]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#E8D3A8]/10 border border-[#E8D3A8]/20 text-beige-200">
            {isImage ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
              {file.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-beige-400 font-mono">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span className="capitalize">{isImage ? 'Image File' : isVideo ? 'Video Stream' : 'Media'}</span>
              <span>•</span>
              <span className="text-beige-200 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Ready for scan
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onRemove}
          disabled={disabled}
          className="p-2 rounded-xl glass text-beige-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
          title="Remove file"
          aria-label="Remove selected file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Media Preview Viewport */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-6 relative border border-[#E8D3A8]/15 group">
        {previewUrl ? (
          isImage ? (
            <img src={previewUrl} alt={file.name} className="w-full h-full object-contain" />
          ) : isVideo ? (
            <video src={previewUrl} className="w-full h-full object-contain" controls />
          ) : null
        ) : (
          <div className="text-beige-600 text-sm font-mono">Media Preview</div>
        )}

        <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 text-xs font-mono text-beige-200 bg-dark-900/90">
          {file.type || 'Unknown MIME'}
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onRemove}
          disabled={disabled}
          className="text-xs font-semibold text-beige-400 hover:text-beige-100 transition-colors"
        >
          Choose a different file
        </button>

        <GlowButton onClick={onAnalyze} disabled={disabled} size="lg" className="w-full sm:w-auto shadow-[0_0_30px_rgba(232,211,168,0.25)]">
          <span>Analyze Content</span>
          <ArrowRight className="w-4 h-4 ml-2 text-dark-950" />
        </GlowButton>
      </div>
    </GlassCard>
  );
};
