import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const LoadingSpinner: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return (
    <div className={clsx("flex justify-center items-center", className)}>
      <Loader2 size={size} className="animate-spin text-beige-200" />
    </div>
  );
};
