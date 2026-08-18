import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, Edit3 } from 'lucide-react';
import { VERDICT_CONFIG } from '../lib/constants';
import type { Verdict } from '../types';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ICONS: Record<string, React.ElementType> = {
  AI_GENERATED: AlertTriangle,
  LIKELY_AUTHENTIC: CheckCircle,
  MANIPULATED: Edit3,
  UNCERTAIN: HelpCircle,
};

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md', className = '' }) => {
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.UNCERTAIN;
  const Icon = ICONS[verdict] || HelpCircle;
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 gap-1.5',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2',
  };
  const iconSize = { sm: 12, md: 14, lg: 16 };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border font-mono uppercase tracking-wider ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} ${className}`}
      style={{ boxShadow: `0 0 16px ${config.color}18` }}
    >
      <Icon style={{ width: iconSize[size], height: iconSize[size] }} strokeWidth={2} />
      {config.label}
    </span>
  );
};
