import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, Sparkles, Video, FileCheck2, ArrowRight } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { ROUTES } from '../lib/constants';
import { HeroVisual } from './HeroVisual';
import { staggerContainer, fadeUp } from '../lib/animations';

export const HeroSection: React.FC = () => {
  const [isTouch, setIsTouch] = useState(false);

  // Subtle Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 90 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const heroVisualX = useTransform(smoothX, [-300, 300], [-8, 8]);
  const heroVisualY = useTransform(smoothY, [-300, 300], [-8, 8]);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const trustSignals = [
    { icon: Shield, label: 'Multi-Model Detection' },
    { icon: Video, label: 'Images & High-Res Video' },
    { icon: FileCheck2, label: 'Forensic Evidence Reports' },
  ];

  return (
    <section
      onMouseMove={handleMouseMove}
      className="container mx-auto px-4 md:px-6 pt-12 pb-20 md:pt-20 md:pb-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-10 relative z-10"
    >
      {/* Left Column: Headline, Value Prop, CTAs, Trust Signals */}
      <motion.div
        className="flex-1 text-center lg:text-left z-10 max-w-2xl"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Editorial Announcement Pill */}
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge border-[#E8D3A8]/20 bg-dark-900/80 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-beige-300 animate-pulse" />
          <span className="text-xs font-semibold text-beige-200 tracking-wide">
            Digital Forensics Intelligence
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 leading-[1.08]"
        >
          <span className="block text-[#FAF6EE]">Detect AI.</span>
          <span className="block gradient-text">Trust Real.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-beige-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal"
        >
          Analyze images and videos for AI-generated and manipulated content.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
        >
          <GlowButton href={ROUTES.DETECT} size="lg" className="w-full sm:w-auto shadow-[0_0_30px_rgba(232,211,168,0.25)]">
            <span>Upload & Analyze</span>
            <ArrowRight className="w-4 h-4 ml-2 text-dark-950" />
          </GlowButton>
          <GlowButton href={`${ROUTES.DETECT}?demo=true`} variant="secondary" size="lg" className="w-full sm:w-auto">
            Try Demo
          </GlowButton>
        </motion.div>

        {/* Trust Signals Row */}
        <motion.div
          variants={fadeUp}
          className="pt-6 border-t border-[#E8D3A8]/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-beige-400 text-xs sm:text-sm font-medium"
        >
          {trustSignals.map((signal, idx) => {
            const Icon = signal.icon;
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-beige-300" />
                <span className="text-beige-300">{signal.label}</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Right Column: Forensic Verification Core */}
      <motion.div
        className="flex-1 w-full flex justify-center lg:justify-end z-10"
        style={!isTouch ? { x: heroVisualX, y: heroVisualY } : undefined}
      >
        <HeroVisual />
      </motion.div>
    </section>
  );
};
