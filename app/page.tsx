'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { UrlShortener } from '@/components/UrlShortener';
import { QrStudio } from '@/components/QrStudio';
import { LinkDashboard } from '@/components/LinkDashboard';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'qrstudio' | 'dashboard'>('shortener');
  const [qrInitialUrl, setQrInitialUrl] = useState<string>('');
  const [visitorCount, setVisitorCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Record visit and fetch total visitor count on page load
    async function trackVisit() {
      try {
        const res = await fetch('/api/visitors', { method: 'POST' });
        const data = await res.json();
        if (data.count) {
          setVisitorCount(data.count);
        }
      } catch (e) {
        console.error(e);
      }
    }
    trackVisit();
  }, []);

  const handleOpenQrStudioForUrl = (url: string) => {
    setQrInitialUrl(url);
    setActiveTab('qrstudio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-hero-glow pointer-events-none -z-10 opacity-70"></div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitorCount={visitorCount}
      />

      {/* Main Feature Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'shortener' && (
          <UrlShortener
            onOpenQrStudioForUrl={handleOpenQrStudioForUrl}
          />
        )}

        {activeTab === 'qrstudio' && (
          <QrStudio initialUrl={qrInitialUrl} />
        )}

        {activeTab === 'dashboard' && (
          <LinkDashboard
            onOpenQrStudioForUrl={handleOpenQrStudioForUrl}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        visitorCount={visitorCount}
      />
    </div>
  );
}
