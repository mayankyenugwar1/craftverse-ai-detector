import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { GlassCard } from './GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary Caught]', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <GlassCard className="max-w-md w-full p-8 text-center border border-red-500/20 bg-dark-900/90 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-[#FAF6EE] mb-2">Something went wrong</h2>
            <p className="text-sm text-beige-400 mb-6 font-mono">
              An unexpected application state occurred. You can reload or return home.
            </p>

            <div className="flex items-center justify-center gap-3">
              <GlowButton
                onClick={() => window.location.reload()}
                variant="secondary"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload
              </GlowButton>
              <GlowButton
                onClick={() => {
                  window.location.href = '/';
                }}
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
