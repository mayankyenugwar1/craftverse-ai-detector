import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface DetectionIndicatorProps {
  name: string;
  score: number; // 0-100
  index?: number;
}

export const DetectionIndicator: React.FC<DetectionIndicatorProps> = ({ name, score, index = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-beige-300 font-medium">{name}</span>
        <span className="font-bold text-[#FAF6EE]">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-dark-800 border border-[#E8D3A8]/10 overflow-hidden p-0.5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#F3E7CE] via-[#E8D3A8] to-[#C8A96B] shadow-[0_0_12px_rgba(232,211,168,0.3)]"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${score}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};
