import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 py-12 border-t border-[#E8D3A8]/10 glass z-10 relative bg-dark-950/80">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl glass-badge border-[#E8D3A8]/20 bg-dark-900">
            <Shield className="w-4 h-4 text-beige-200" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">
              CRAFT<span className="gradient-text font-extrabold">VERSE</span> AI DETECTOR
            </h3>
            <p className="text-beige-500 text-xs mt-0.5 font-mono">Detect AI. Trust Real.</p>
          </div>
        </div>

        <p className="text-xs text-beige-500 max-w-md text-center md:text-left font-mono">
          Detection results are probabilistic assessments and should be verified when absolute authenticity is critical.
        </p>

        <div className="flex gap-5 text-xs font-mono text-beige-400">
          <Link to={ROUTES.HOME} className="hover:text-beige-100 transition-colors">Home</Link>
          <Link to={ROUTES.DETECT} className="hover:text-beige-100 transition-colors">Detect</Link>
          <Link to={ROUTES.HOW_IT_WORKS} className="hover:text-beige-100 transition-colors">Architecture</Link>
          <Link to={ROUTES.HISTORY} className="hover:text-beige-100 transition-colors">History</Link>
        </div>
      </div>
    </footer>
  );
};
