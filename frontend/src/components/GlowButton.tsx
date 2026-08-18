import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlowButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className,
  type = 'button',
  href,
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed select-none group tracking-tight';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#F3E7CE] via-[#E8D3A8] to-[#D4BE8D] text-[#0D0D0D] font-bold shadow-[0_0_20px_rgba(232,211,168,0.25)] hover:shadow-[0_0_35px_rgba(232,211,168,0.45)] border border-[#FAF6EE] hover:brightness-105',
    secondary:
      'glass text-beige-100 hover:text-white border-[#E8D3A8]/20 hover:border-[#E8D3A8]/45 hover:bg-[#E8D3A8]/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(232,211,168,0.15)]',
    ghost:
      'bg-transparent text-beige-400 hover:text-beige-100 hover:bg-white/[0.03] border border-transparent hover:border-[#E8D3A8]/15',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs font-semibold tracking-wide',
    md: 'px-5 py-2.5 text-sm font-semibold tracking-wide',
    lg: 'px-7 py-3.5 text-base font-bold tracking-wide',
  };

  const content = (
    <>
      {/* Specular Sheen for Primary Button */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      )}
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-dark-950" />}
      <span className="relative z-10 flex items-center">{children}</span>
    </>
  );

  const classes = clsx(baseClasses, variants[variant], sizes[size], className);

  if (href) {
    return (
      <motion.div
        whileTap={disabled ? undefined : { scale: 0.97 }}
        whileHover={disabled ? undefined : { y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="inline-block"
      >
        <Link to={href} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {content}
    </motion.button>
  );
};
