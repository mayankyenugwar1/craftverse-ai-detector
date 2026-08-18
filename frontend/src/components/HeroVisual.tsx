import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Scan, CheckCircle2, Activity, ShieldCheck } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const signalBadges = [
    {
      icon: Scan,
      label: 'Scanning Patterns',
      color: 'text-beige-200',
      border: 'border-[#E8D3A8]/25',
      glow: 'shadow-[0_0_15px_rgba(232,211,168,0.1)]',
      position: 'top-2 -left-4 md:-top-4 md:-left-8',
      delay: 0,
      duration: 6,
    },
    {
      icon: Sparkles,
      label: 'Synthetic Artifacts',
      color: 'text-beige-300',
      border: 'border-[#C8A96B]/25',
      glow: 'shadow-[0_0_15px_rgba(200,169,107,0.1)]',
      position: 'top-10 -right-4 md:top-6 md:-right-10',
      delay: 1.4,
      duration: 6.5,
    },
    {
      icon: ShieldCheck,
      label: 'Authenticity Check',
      color: 'text-beige-100',
      border: 'border-[#F3E7CE]/25',
      glow: 'shadow-[0_0_15px_rgba(243,231,206,0.1)]',
      position: 'bottom-8 -left-2 md:bottom-6 md:-left-10',
      delay: 2.6,
      duration: 5.8,
    },
    {
      icon: CheckCircle2,
      label: 'Verified Signal 98%',
      color: 'text-beige-200',
      border: 'border-[#E8D3A8]/25',
      glow: 'shadow-[0_0_15px_rgba(232,211,168,0.1)]',
      position: 'bottom-2 -right-4 md:-bottom-4 md:-right-8',
      delay: 2.0,
      duration: 7,
    },
  ];

  return (
    <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] flex items-center justify-center select-none">
      {/* Ambient Warm Backlight Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E8D3A8]/[0.08] via-[#C8A96B]/[0.06] to-transparent blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" />

      {/* SVG Neural/Connecting Network & Orbit Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 440 440">
        <defs>
          <linearGradient id="beigeOrbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D3A8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#C8A96B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="beigeOrbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C8A96B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E8D3A8" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="beigePathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D3A8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C8A96B" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Ring */}
        <motion.circle
          cx="220"
          cy="220"
          r="195"
          fill="none"
          stroke="url(#beigeOrbitGrad1)"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Middle Orbit Ring */}
        <motion.circle
          cx="220"
          cy="220"
          r="150"
          fill="none"
          stroke="url(#beigeOrbitGrad2)"
          strokeWidth="1"
          strokeDasharray="6 12"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Inner Solid Tech Ring */}
        <circle
          cx="220"
          cy="220"
          r="105"
          fill="none"
          stroke="rgba(232, 211, 168, 0.08)"
          strokeWidth="1"
        />

        {/* Connecting Geometric Lines from Center to Perimeter */}
        <line x1="220" y1="115" x2="220" y2="25" stroke="url(#beigePathGrad)" strokeWidth="1" strokeDasharray="2 4" opacity="0.45" />
        <line x1="220" y1="325" x2="220" y2="415" stroke="url(#beigePathGrad)" strokeWidth="1" strokeDasharray="2 4" opacity="0.45" />
        <line x1="115" y1="220" x2="25" y2="220" stroke="url(#beigePathGrad)" strokeWidth="1" strokeDasharray="2 4" opacity="0.45" />
        <line x1="325" y1="220" x2="415" y2="220" stroke="url(#beigePathGrad)" strokeWidth="1" strokeDasharray="2 4" opacity="0.45" />

        {/* Traveling Energy Pulse Particles on Paths */}
        <motion.circle
          cx="220"
          cy="115"
          r="2"
          fill="#F3E7CE"
          animate={{ cy: [115, 25, 115], opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="325"
          cy="220"
          r="2"
          fill="#E8D3A8"
          animate={{ cx: [325, 415, 325], opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>

      {/* Orbiting Tech Nodes */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-[25px] w-2.5 h-2.5 rounded-full bg-beige-200 shadow-[0_0_10px_#E8D3A8]" />
        <div className="absolute bottom-[25px] w-2 h-2 rounded-full bg-beige-400 shadow-[0_0_10px_#C8A96B]" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute right-[70px] top-[120px] w-2 h-2 rounded-full bg-beige-100 shadow-[0_0_8px_#F3E7CE]" />
        <div className="absolute left-[70px] bottom-[120px] w-2 h-2 rounded-full bg-beige-300 shadow-[0_0_8px_#D4BE8D]" />
      </motion.div>

      {/* Central Floating AI Forensic Verification Core */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Dark Glass Core Chamber */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-3xl glass flex items-center justify-center border border-[#E8D3A8]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-dark-900/90">
          {/* Subtle Warm Inner Ambient Radial Core */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8D3A8]/[0.08] via-[#C8A96B]/[0.04] to-transparent" />

          {/* Central Shield Graphic with Warm Ivory/Beige Outline */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative">
              <Shield
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-beige-100 drop-shadow-[0_0_20px_rgba(232,211,168,0.35)]"
                strokeWidth={1.25}
              />
              {/* Internal Forensic Check */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2
                  className="w-8 h-8 sm:w-10 sm:h-10 text-beige-300 drop-shadow-[0_0_10px_rgba(212,190,141,0.5)]"
                  strokeWidth={1.75}
                />
              </div>
            </div>
            <span className="mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-beige-400 font-semibold">
              Forensic Core
            </span>
          </div>

          {/* Ultra-Thin Champagne Laser Scanline */}
          <motion.div
            className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F3E7CE] to-transparent shadow-[0_0_14px_2px_#E8D3A8]"
            animate={{
              top: ['-10%', '110%'],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Technical Corner Brackets in Warm Beige */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-[#E8D3A8]/40" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-[#E8D3A8]/40" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-[#E8D3A8]/40" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-[#E8D3A8]/40" />
        </div>
      </motion.div>

      {/* Floating Product Signal Badges */}
      {signalBadges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={idx}
            className={`absolute ${badge.position} z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-badge ${badge.border} ${badge.glow} bg-dark-900/85`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -5, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: idx * 0.2 },
              scale: { duration: 0.8, delay: idx * 0.2 },
              y: {
                duration: badge.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: badge.delay,
              },
            }}
          >
            <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
            <span className="text-xs font-semibold text-beige-100 tracking-tight whitespace-nowrap">
              {badge.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
