import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, ShieldAlert, Sparkles, ShieldCheck } from 'lucide-react';
import { AIExplanation } from '../types';

interface ExplanationCardProps {
  explanation?: AIExplanation;
  className?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation, className = '' }) => {
  if (!explanation) {
    return (
      <div className={`p-6 rounded-2xl bg-dark-900/80 border border-[#E8D3A8]/10 flex items-center justify-center text-beige-400 font-mono text-xs ${className}`}>
        AI explanation is temporarily unavailable.
      </div>
    );
  }

  const getRiskBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case 'HIGH':
        return 'text-beige-200 border-[#E8D3A8]/30 bg-[#E8D3A8]/10';
      case 'MEDIUM':
        return 'text-beige-300 border-[#C8A96B]/30 bg-[#C8A96B]/10';
      case 'LOW':
        return 'text-beige-100 border-[#F3E7CE]/30 bg-[#F3E7CE]/10';
      default:
        return 'text-beige-400 border-[#BBAF98]/30 bg-[#BBAF98]/10';
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className={`p-6 sm:p-7 rounded-2xl glass border border-[#E8D3A8]/15 backdrop-blur-md overflow-hidden bg-dark-900/85 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[#E8D3A8]/10 text-beige-200 border border-[#E8D3A8]/20">
          <Brain className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">AI Forensic Explanation</h3>
          <p className="text-xs font-mono text-beige-400">Neural Evidence Synthesis</p>
        </div>
        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${getRiskBadge(explanation.riskLevel)}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-beige-300" />
          <span>{explanation.riskLevel.toUpperCase()} RISK</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <p className="text-beige-200 text-sm sm:text-base leading-relaxed font-normal">
          {explanation.summary}
        </p>

        {/* Key Findings List with Beige Checkmarks */}
        <div>
          <h4 className="text-xs font-mono font-bold text-beige-400 uppercase tracking-widest mb-3">
            Key Findings
          </h4>
          <motion.ul
            className="space-y-2.5"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {explanation.keyFindings.map((finding, idx) => (
              <motion.li
                key={idx}
                variants={fadeUp}
                className="flex items-start gap-2.5 text-sm text-beige-100 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-beige-200 mt-0.5 shrink-0" />
                <span className="leading-snug">{finding}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Recommendation Panel */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-[#E8D3A8]/15 text-xs sm:text-sm">
          <span className="font-bold text-beige-200 block mb-1 uppercase tracking-wider font-mono text-xs">
            Recommendation
          </span>
          <span className="text-beige-300 leading-relaxed">{explanation.recommendation}</span>
        </div>

        {/* Technical Detail */}
        {explanation.explanation && (
          <div className="text-xs text-beige-500 pt-3 border-t border-[#E8D3A8]/10 font-mono leading-relaxed">
            <span className="font-semibold text-beige-400 mr-2">Methodology:</span>
            {explanation.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
