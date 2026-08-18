import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Clock } from 'lucide-react';
import { AnalysisResult } from '../types';
import { VerdictBadge } from './VerdictBadge';

interface HistoryCardProps {
  result: AnalysisResult;
  onClick: () => void;
  className?: string;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ result, onClick, className = '' }) => {
  const isImage = result.mediaType === 'image';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)' }}
      onClick={onClick}
      className={`flex items-center p-4 rounded-2xl glass border border-[#E8D3A8]/15 hover:border-[#E8D3A8]/35 transition-all cursor-pointer group bg-dark-900/85 ${className}`}
    >
      <div className="w-16 h-16 rounded-xl bg-black border border-[#E8D3A8]/10 overflow-hidden flex items-center justify-center shrink-0 mr-4 relative">
        {result.thumbnailUrl ? (
          <img
            src={result.thumbnailUrl}
            alt={result.originalFilename}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          isImage ? <ImageIcon className="w-6 h-6 text-beige-500" /> : <Video className="w-6 h-6 text-beige-500" />
        )}
      </div>

      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-sm font-bold text-white truncate mb-1" title={result.originalFilename}>
          {result.originalFilename}
        </h4>
        <div className="flex items-center text-xs text-beige-400 gap-3 font-mono">
          <span className="flex items-center gap-1 bg-dark-800 border border-[#E8D3A8]/10 px-2 py-0.5 rounded text-[11px] text-beige-300">
            {isImage ? <ImageIcon className="w-3 h-3 text-beige-300" /> : <Video className="w-3 h-3 text-beige-400" />}
            {result.mediaType.toUpperCase()}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-beige-500">
            <Clock className="w-3 h-3" />
            {formatDate(result.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <VerdictBadge verdict={result.verdict} size="sm" />
        <span className="text-xs font-mono font-bold text-beige-200">
          {result.aiProbability}% AI
        </span>
      </div>
    </motion.div>
  );
};
