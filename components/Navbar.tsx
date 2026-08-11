'use client';

import React from 'react';
import { Link2, QrCode, BarChart3, Rocket, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'shortener' | 'qrstudio' | 'dashboard';
  setActiveTab: (tab: 'shortener' | 'qrstudio' | 'dashboard') => void;
  onOpenVercelGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenVercelGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('shortener')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0d1322] rounded-[11px] flex items-center justify-center text-cyan-400">
              <Link2 className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">Shortify</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-medium">
                QR Studio
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('shortener')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'shortener'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Link Shortener
          </button>

          <button
            onClick={() => setActiveTab('qrstudio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'qrstudio'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Studio
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics & Links
          </button>
        </nav>

        {/* Deploy to Vercel Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVercelGuide}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-white border border-slate-700 transition shadow-sm"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vercel Free Deploy</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/80 p-2">
        <button
          onClick={() => setActiveTab('shortener')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'shortener' ? 'text-cyan-400 bg-slate-800' : 'text-slate-400'
          }`}
        >
          <Link2 className="w-4 h-4" />
          Shortener
        </button>
        <button
          onClick={() => setActiveTab('qrstudio')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'qrstudio' ? 'text-purple-400 bg-slate-800' : 'text-slate-400'
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR Studio
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium ${
            activeTab === 'dashboard' ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Links & Stats
        </button>
      </div>
    </header>
  );
};
