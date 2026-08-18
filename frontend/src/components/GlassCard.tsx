import React from 'react';
import { clsx } from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  className?: string;
  children?: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  children,
  hover = false,
  glow = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <motion.div
      className={clsx(
        'glass rounded-2xl border border-[#E8D3A8]/15',
        padding,
        hover && 'glass-hover transition-all duration-300',
        glow && 'glow-beige',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
