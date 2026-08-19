import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Sparkles } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { clsx } from 'clsx';
import { ROUTES } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { getHealthStatus } from '../services/api';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getHealthStatus()
      .then((health) => {
        if (health && typeof health.demoMode === 'boolean') {
          setIsDemoMode(health.demoMode);
        }
      })
      .catch(() => {
        setIsDemoMode(true);
      });
  }, []);

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Detect', path: ROUTES.DETECT },
    { name: 'How It Works', path: ROUTES.HOW_IT_WORKS },
    { name: 'History', path: ROUTES.HISTORY },
  ];

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-[#E8D3A8]/15 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Brand Logo with Warm Beige Security Shield */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#E8D3A8] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-xl" />
              <div className="relative p-1.5 rounded-xl glass-badge border-[#E8D3A8]/20 bg-dark-900/90">
                <Shield className="w-5 h-5 text-beige-200 group-hover:text-beige-100 transition-colors duration-300" strokeWidth={1.75} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                CRAFT<span className="gradient-text font-extrabold">VERSE</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-beige-400 uppercase -mt-1 font-semibold">
                AI Detector
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Warm Beige Active Tab */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-badge border-[#E8D3A8]/15 bg-dark-900/70">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 tracking-wide',
                    isActive
                      ? 'text-white'
                      : 'text-beige-500 hover:text-beige-200'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-[#E8D3A8]/10 border border-[#E8D3A8]/25 rounded-full shadow-[0_0_15px_rgba(232,211,168,0.12)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Engine Status */}
          <div className="hidden md:flex items-center gap-4">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full glass-badge border-[#E8D3A8]/15 text-beige-300 text-[11px] font-mono"
              title={isDemoMode ? 'Running in deterministic demo mode' : 'Connected to live detection provider'}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-beige-300 animate-pulse" />
              <span>{isDemoMode ? 'Demo Engine Active' : 'Detection Engine Active'}</span>
            </div>
            <GlowButton href={ROUTES.DETECT} size="sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-dark-950" />
              Analyze
            </GlowButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-beige-300 hover:text-white p-2 rounded-xl glass border border-[#E8D3A8]/15"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 glass pt-24 px-6 md:hidden flex flex-col gap-6 bg-dark-950/95"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'text-lg font-semibold py-3 px-4 rounded-xl transition-colors border',
                      isActive
                        ? 'text-white bg-[#E8D3A8]/10 border-[#E8D3A8]/25'
                        : 'text-beige-400 hover:text-white bg-white/[0.02] border-transparent'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <GlowButton
              href={ROUTES.DETECT}
              className="w-full mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Analysis
            </GlowButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
