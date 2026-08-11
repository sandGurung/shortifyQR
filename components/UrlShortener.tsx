'use client';

import React, { useState } from 'react';
import { Link2, Copy, Check, Sparkles, Clock, QrCode, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { ShortLink } from '@/lib/types';

interface UrlShortenerProps {
  onLinkCreated?: (link: ShortLink) => void;
  onOpenQrStudioForUrl?: (url: string) => void;
}

export const UrlShortener: React.FC<UrlShortenerProps> = ({
  onLinkCreated,
  onOpenQrStudioForUrl,
}) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiration, setExpiration] = useState<string>('never');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ shortUrl: string; shortCode: string; originalUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    let expiresInHours: number | null = null;
    if (expiration === '24h') expiresInHours = 24;
    else if (expiration === '7d') expiresInHours = 168;
    else if (expiration === '30d') expiresInHours = 720;

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: url.trim(),
          customAlias: customAlias.trim() || undefined,
          expiresInHours,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten URL.');
      }

      setResult({
        shortUrl: data.link.shortUrl,
        shortCode: data.link.shortCode,
        originalUrl: data.link.originalUrl,
      });

      if (onLinkCreated) {
        onLinkCreated(data.link);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Fast, Secure & Free Link Shortener
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Shorten Links. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Track Clicks.</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
          Transform long, messy URLs into clean, memorable links with custom aliases, auto-generated QR codes, and instant analytics.
        </p>
      </div>

      {/* Main Shortener Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop behind card */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleShorten} className="space-y-5">
          {/* Main URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" /> Destination URL
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-very-long-website-link.com/with-parameters"
                className="w-full px-5 py-4 bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-base transition shadow-inner"
                required
              />
            </div>
          </div>

          {/* Options Grid: Custom Alias & Expiration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Custom Alias Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Custom Alias (Optional)</span>
                <span className="text-[10px] text-slate-500">e.g. launch-2026</span>
              </label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl overflow-hidden focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/30">
                <span className="px-3 text-slate-500 text-xs font-mono select-none border-r border-slate-800">
                  /
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-custom-code"
                  className="w-full px-3 py-2.5 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none text-sm font-mono"
                />
              </div>
            </div>

            {/* Link Expiration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Link Expiration
              </label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              >
                <option value="never">Never Expire (Permanent)</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Shorten Link Now <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Shortened Result Banner */}
        {result && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Link Shortened Successfully!
              </span>
              <span className="text-xs text-slate-500">Ready to share</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left w-full overflow-hidden">
                <div className="text-lg font-bold text-cyan-300 font-mono tracking-wide truncate">
                  {result.shortUrl}
                </div>
                <div className="text-xs text-slate-400 truncate max-w-md">
                  Target: {result.originalUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <button
                  onClick={() => onOpenQrStudioForUrl?.(result.shortUrl)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-medium text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center justify-center gap-2 transition"
                >
                  <QrCode className="w-4 h-4" />
                  Customize QR
                </button>

                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Test Link Redirect"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <h3 className="font-bold text-white text-sm">Instant Redirects</h3>
          <p className="text-xs text-slate-400">High-speed serverless routing with instant click resolution.</p>
        </div>
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
            🎨
          </div>
          <h3 className="font-bold text-white text-sm">Stylized QR Studio</h3>
          <p className="text-xs text-slate-400">Transform any short URL into a custom branded QR artwork.</p>
        </div>
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
            📊
          </div>
          <h3 className="font-bold text-white text-sm">Real-time Analytics</h3>
          <p className="text-xs text-slate-400">Track total clicks, devices, referrers, and daily visitor trends.</p>
        </div>
      </div>
    </div>
  );
};
