import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 180,
  strokeWidth = 8,
  color = '#E8D3A8',
  className = '',
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(232, 211, 168, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc in warm beige/gold */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 10px ${color}35)` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter target={progress} suffix="%" className="text-4xl font-extrabold text-[#FAF6EE] font-mono tracking-tight" />
        </div>
      )}
    </div>
  );
};
