import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ title, icon: Icon, children, className = '' }) => {
  return (
    <section className={`rounded-2xl glass border border-[#E8D3A8]/15 overflow-hidden bg-dark-900/85 ${className}`}>
      <div className="px-6 py-4 border-b border-[#E8D3A8]/10 flex items-center gap-3 bg-dark-950/60">
        <div className="p-2 rounded-xl bg-[#E8D3A8]/10 border border-[#E8D3A8]/20 text-beige-200">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">{title}</h2>
      </div>
      <div className="p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
};
