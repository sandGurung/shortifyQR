'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Link2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  Eye,
  RefreshCw,
  Search,
} from 'lucide-react';
import { ShortLink, LinkStats } from '@/lib/types';

interface LinkDashboardProps {
  onOpenQrStudioForUrl: (url: string) => void;
}

export const LinkDashboard: React.FC<LinkDashboardProps> = ({ onOpenQrStudioForUrl }) => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedStats, setSelectedStats] = useState<LinkStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shorten');
      const data = await res.json();
      if (data.links) {
        setLinks(data.links);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to delete short link /${code}?`)) return;
    try {
      const res = await fetch(`/api/stats/${code}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(links.filter((l) => l.shortCode !== code));
        if (selectedStats?.shortLink.shortCode === code) {
          setSelectedStats(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewStats = async (code: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/stats/${code}`);
      const data = await res.json();
      if (data.stats) {
        setSelectedStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const filteredLinks = links.filter(
    (l) =>
      l.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      l.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-400" /> Managed Short Links & Analytics
          </h1>
          <p className="text-slate-400 text-sm">
            Monitor real-time click volume, device breakdown, and manage your active short codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter links..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={fetchLinks}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh Links"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Column - 7 or 12 cols */}
        <div className={selectedStats ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm">Fetching short link statistics...</p>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Link2 className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-medium">No short links found.</p>
                <p className="text-xs text-slate-500">Shorten your first website URL using the Shortener tab.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Short Code</th>
                      <th className="py-4 px-6">Destination</th>
                      <th className="py-4 px-6 text-center">Clicks</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-slate-800/40 transition group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-cyan-400">/{link.shortCode}</span>
                            <button
                              onClick={() => handleCopy(link.shortCode)}
                              className="text-slate-500 hover:text-cyan-300 transition"
                              title="Copy Short Link"
                            >
                              {copiedCode === link.shortCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-6 max-w-xs truncate">
                          <div className="text-slate-200 truncate">{link.originalUrl}</div>
                          <div className="text-[11px] text-slate-500">
                            Created {new Date(link.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center font-bold text-white font-mono">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                            {link.clicks}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewStats(link.shortCode)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                              title="View Click Analytics"
                            >
                              <Eye className="w-4 h-4 text-cyan-400" />
                            </button>
                            <button
                              onClick={() =>
                                onOpenQrStudioForUrl(
                                  `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.shortCode}`
                                )
                              }
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                              title="Open in QR Studio"
                            >
                              <QrCode className="w-4 h-4 text-purple-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(link.shortCode)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                              title="Delete Link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analytics Side Drawer / Card - 5 cols */}
        {selectedStats && (
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-6 border border-slate-800 shadow-2xl animate-fadeIn sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-lg font-mono text-cyan-300">
                  /{selectedStats.shortLink.shortCode}
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">
                  {selectedStats.shortLink.originalUrl}
                </p>
              </div>
              <button
                onClick={() => setSelectedStats(null)}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Close Drawer ✕
              </button>
            </div>

            {/* Total Metric Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-medium">Total Visitors</div>
                <div className="text-2xl font-extrabold text-white font-mono">{selectedStats.shortLink.clicks}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-medium">Status</div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 pt-1">
                  ● Active
                </div>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Device Breakdown</div>
              <div className="space-y-2">
                {selectedStats.deviceBreakdown.map((dev) => (
                  <div key={dev.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      {dev.name === 'Mobile' ? <Smartphone className="w-4 h-4 text-purple-400" /> : <Monitor className="w-4 h-4 text-cyan-400" />}
                      {dev.name}
                    </div>
                    <span className="font-mono font-bold text-white">{dev.count} clicks</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Click Logs */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recent Activity Logs</div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {selectedStats.clickLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className="text-cyan-400">{log.referrer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
