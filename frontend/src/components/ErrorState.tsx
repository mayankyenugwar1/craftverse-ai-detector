import React from 'react';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../lib/constants';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onDemo?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to complete the requested analysis.',
  onRetry,
  onDemo,
}) => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    if (onDemo) {
      onDemo();
    } else {
      navigate(`${ROUTES.DETECT}?demo=true`);
    }
  };

  return (
    <GlassCard className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-xl mx-auto border border-red-500/20 bg-dark-900/90 shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Inspection Notice</h3>
      <p className="text-beige-400 text-sm mb-6 leading-relaxed max-w-md">{message}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <GlowButton onClick={onRetry} variant="secondary" size="sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-beige-300" />
            Retry
          </GlowButton>
        )}
        <GlowButton onClick={handleDemoClick} size="sm">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-dark-950" />
          Try Demo Scan
        </GlowButton>
      </div>
    </GlassCard>
  );
};
