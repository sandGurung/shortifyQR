'use client';

import React from 'react';
import { Link2, QrCode, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'shortener' | 'qrstudio' | 'dashboard') => void;
  onOpenVercelGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenVercelGuide }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070b13] mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Link2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200">Shortify & QR Studio</span>
          <span>— Free Open Source URL Shortener & Stylized QR Studio</span>
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
          <button onClick={onOpenVercelGuide} className="hover:text-cyan-400 transition">
            Vercel Deploy Guide
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          Crafted with Next.js & Tailwind
        </div>
      </div>
    </footer>
  );
};
