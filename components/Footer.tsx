'use client';

import React from 'react';
import { Link2, Eye } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'shortener' | 'qrstudio' | 'dashboard') => void;
  visitorCount?: number;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, visitorCount }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070b13] mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Link2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200">Shortify & QR Studio</span>
          <span>— Free URL Shortener & Stylized QR Studio</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab('shortener')} className="hover:text-cyan-400 transition">
            Link Shortener
          </button>
          <button onClick={() => setActiveTab('qrstudio')} className="hover:text-purple-400 transition">
            QR Studio
          </button>
          <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition">
            Analytics
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Total Site Visits:</span>
          <span className="font-mono text-cyan-300 font-bold">
            {visitorCount !== undefined ? visitorCount.toLocaleString() : '...'}
          </span>
        </div>
      </div>
    </footer>
  );
};
