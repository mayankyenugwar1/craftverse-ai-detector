import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#080808]">
      {/* Forensic Grid Pattern with Warm Beige Accent */}
      <div className="absolute inset-0 bg-forensic-grid opacity-75" />

      {/* Atmospheric Warm Ambient Radial Glow Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-[#E8D3A8]/[0.035] blur-[160px]"
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-[30%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#C8A96B]/[0.025] blur-[180px]"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.96, 1.06, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      <motion.div
        className="absolute bottom-[-10%] left-[25%] w-[65vw] h-[45vw] rounded-full bg-[#FAF6EE]/[0.02] blur-[190px]"
        animate={{
          x: [0, 20, -25, 0],
          y: [0, -15, 20, 0],
          scale: [1, 1.04, 0.96, 1],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />

      {/* Faint Horizontal Forensic Scan Streak */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8D3A8]/10 to-transparent"
        animate={{
          top: ['-5%', '105%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Cinematic Vignette for Depth */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
    </div>
  );
};
