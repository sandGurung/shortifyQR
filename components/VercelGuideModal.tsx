'use client';

import React, { useState } from 'react';
import { Rocket, Check, Copy, ExternalLink, Terminal, Shield, Sparkles } from 'lucide-react';

interface VercelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelGuideModal: React.FC<VercelGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cliCommand = 'npx vercel';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 transition"
        >
          ✕
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5" /> Hosting Blueprint
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Deploy to Vercel for <span className="text-cyan-400">100% FREE</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            This app is pre-configured with zero-config serverless adapters. You can host it on Vercel's Hobby Plan without paying anything or configuring paid databases!
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-4 text-sm text-slate-300">
          {/* Method 1: Git Push */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono">1</span>
              Method 1: Connect via GitHub (Recommended)
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 pl-2">
              <li>Push this project code to your GitHub repository.</li>
              <li>Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 underline">vercel.com/new</a>.</li>
              <li>Select your repository and click <strong>Deploy</strong>. Vercel automatically detects Next.js!</li>
            </ol>
          </div>

          {/* Method 2: Vercel CLI */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-mono">2</span>
              Method 2: One-Command CLI Deploy
            </div>
            <p className="text-xs text-slate-400">Run this command in the project terminal:</p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <code>{cliCommand}</code>
              </div>
              <button
                onClick={handleCopyCmd}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Zero Config Note */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-4 h-4" /> Zero Database Setup Needed
            </div>
            <p className="text-slate-300">
              Out of the box, short links are remembered locally in memory and browser storage. If you want permanent global SQLite persistence, you can link a free Turso or Neon Postgres DB by adding <code className="text-emerald-300 font-mono">DATABASE_URL</code> in Vercel environment settings later.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
