import React from 'react';
import { motion } from 'framer-motion';
import { SuspiciousFrame } from '../types';
import { Clock, Film } from 'lucide-react';

interface VideoTimelineProps {
  suspiciousFrames?: SuspiciousFrame[];
  duration?: number;
  className?: string;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  suspiciousFrames,
  duration = 100,
  className = '',
}) => {
  if (!suspiciousFrames || suspiciousFrames.length === 0) {
    return (
      <div className={`p-6 rounded-2xl bg-dark-900/80 border border-[#E8D3A8]/10 flex flex-col items-center justify-center text-beige-500 gap-2 font-mono text-xs ${className}`}>
        <div className="p-3 rounded-full bg-dark-800 border border-[#E8D3A8]/10 mb-2">
          <Clock className="w-5 h-5 text-beige-400 opacity-60" />
        </div>
        <p>No suspicious temporal frames detected</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 rounded-2xl glass border border-[#E8D3A8]/15 bg-dark-900/85 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-beige-200" />
          <span>Timeline Distribution</span>
        </h3>
        <span className="text-xs text-beige-400 bg-dark-800 border border-[#E8D3A8]/10 px-2.5 py-1 rounded-md font-mono">
          Duration: {formatTime(duration)}
        </span>
      </div>

      <div className="relative pt-6 pb-10">
        {/* Main Track */}
        <div className="absolute top-8 left-0 right-0 h-1.5 bg-dark-800 border border-[#E8D3A8]/10 rounded-full overflow-hidden" />

        {/* Frame Markers */}
        <div className="relative h-6 w-full">
          {suspiciousFrames.map((frame, idx) => {
            const position = Math.min((frame.timestamp / duration) * 100, 100);
            return (
              <motion.div
                key={idx}
                className="absolute top-[-10px] flex flex-col items-center group z-10"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 border border-[#E8D3A8]/20 rounded-xl p-2.5 text-xs w-36 shadow-2xl pointer-events-none flex flex-col gap-1 z-20 font-mono">
                  {frame.thumbnail && (
                    <img
                      src={frame.thumbnail}
                      alt={`Frame at ${formatTime(frame.timestamp)}`}
                      className="w-full h-16 object-cover rounded-lg bg-dark-800 mb-1"
                    />
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-beige-400">{formatTime(frame.timestamp)}</span>
                    <span className="font-bold text-beige-200">{frame.score}% AI</span>
                  </div>
                </div>

                {/* Marker Pin */}
                <div
                  className="w-1 h-6 rounded-full bg-gradient-to-b from-[#FAF6EE] to-[#E8D3A8] mb-1"
                  style={{ boxShadow: '0 0 8px rgba(232, 211, 168, 0.4)' }}
                />

                {/* Timestamp Label */}
                <div className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#E8D3A8]/20 bg-dark-950/90 text-beige-200 whitespace-nowrap">
                  {formatTime(frame.timestamp)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
