import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Scan, Brain, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { pageTransition, staggerContainer, fadeUp } from '../lib/animations';
import { ROUTES } from '../lib/constants';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: UploadCloud,
      title: 'Payload Ingestion & Preprocessing',
      desc: 'Media is securely ingested and parsed into normalized spatial and temporal channels. We extract sensor noise fingerprints, compression anomalies, and metadata signatures without quality degradation.',
    },
    {
      step: '02',
      icon: Scan,
      title: 'Neural Architecture Inspection',
      desc: 'Our engine evaluates multi-frequency spatial domain vectors against generative AI models. We inspect synthetic pixel uniformities, lighting inconsistencies, and microscopic GAN/diffusion anomalies.',
    },
    {
      step: '03',
      icon: Brain,
      title: 'Forensic Synthesis & Explanation',
      desc: 'Raw multi-signal scores are passed to our digital forensics reasoning layer powered by Claude AI to synthesize human-readable findings, explain why signals were flagged, and calculate confidence.',
    },
    {
      step: '04',
      icon: BarChart3,
      title: 'Verifiable Audit Reporting',
      desc: 'Receive a full probabilistic assessment with detection indicator breakdowns, suspicious video timeline regions, and downloadable cryptographic verification records.',
    },
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 md:px-6 py-16 max-w-4xl relative z-10"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/20 text-beige-300 text-xs font-mono mb-3 bg-dark-900/80">
          <Shield className="w-3.5 h-3.5" />
          <span>Forensic Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#FAF6EE] tracking-tight mb-4">
          How CraftVerse Verifies Media
        </h1>
        <p className="text-base sm:text-lg text-beige-400 max-w-xl mx-auto">
          A multi-stage pipeline designed for probabilistic certainty and transparent evidence reporting.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative"
      >
        {/* Subtle Central Connecting Line in Beige */}
        <div className="absolute left-8 md:left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-[#E8D3A8]/40 via-[#C8A96B]/20 to-[#E8D3A8]/40 -translate-x-1/2 hidden md:block" />

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className={`w-full md:w-1/2 flex ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <GlassCard className="p-8 max-w-md w-full relative group border-[#E8D3A8]/15 bg-dark-900/85">
                  <div className="relative z-10">
                    <span className="text-xs font-mono text-beige-400 font-bold uppercase tracking-wider block mb-2">
                      Phase {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-beige-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </GlassCard>
              </div>

              <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shrink-0">
                <div className="absolute inset-0 bg-dark-950 rounded-2xl border border-[#E8D3A8]/30 shadow-[0_0_20px_rgba(232,211,168,0.15)] z-10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 md:w-9 md:h-9 text-beige-200" strokeWidth={1.5} />
                </div>
              </div>

              <div className="w-full md:w-1/2 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mt-24 text-center">
        <div className="p-10 rounded-3xl glass border border-[#E8D3A8]/15 max-w-2xl mx-auto bg-dark-900/80">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to analyze media?</h2>
          <p className="text-sm text-beige-400 mb-6">Scan images and videos through our neural detection pipeline.</p>
          <Link to={ROUTES.DETECT}>
            <GlowButton size="lg">
              <span>Start Verification</span>
              <ArrowRight className="w-4 h-4 ml-2 text-dark-950" />
            </GlowButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
