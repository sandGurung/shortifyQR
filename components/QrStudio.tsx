'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  QrCode,
  Download,
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Type,
  Wifi,
  Mail,
  Phone,
  Globe,
  Share2,
} from 'lucide-react';
import { QrCodeConfig, QrContentType } from '@/lib/types';
import { QR_PRESETS, PRESET_LOGOS } from '@/lib/qr-presets';

interface QrStudioProps {
  initialUrl?: string;
}

export const QrStudio: React.FC<QrStudioProps> = ({ initialUrl }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeStylingInstance = useRef<any>(null);

  // Active configuration state
  const [contentType, setContentType] = useState<QrContentType>('url');
  const [contentValues, setContentValues] = useState({
    url: initialUrl || 'https://shortify-qr.vercel.app',
    text: 'Hello from Shortify QR Studio!',
    wifi: { ssid: 'Home_WiFi', password: 'SecretPassword123', encryption: 'WPA/WPA2' },
    vcard: { firstName: 'Alex', lastName: 'Morgan', phone: '+1 234 567 8900', email: 'alex@example.com', organization: 'Tech Studio', title: 'Product Creator', website: 'https://alex.design' },
    email: { email: 'contact@example.com', subject: 'Inquiry from QR Code', body: 'Hi, I scanned your QR code!' },
    whatsapp: { phone: '1234567890', message: 'Hello! I scanned your QR code.' },
  });

  // Style attributes
  const [dotStyle, setDotStyle] = useState<'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'>('rounded');
  const [colorType, setColorType] = useState<'single' | 'gradient'>('gradient');
  const [singleColor, setSingleColor] = useState('#06b6d4');
  const [gradientColor1, setGradientColor1] = useState('#06b6d4');
  const [gradientColor2, setGradientColor2] = useState('#8b5cf6');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [bgTransparent, setBgTransparent] = useState(false);

  // Eyes
  const [cornerSquareStyle, setCornerSquareStyle] = useState<'square' | 'dot' | 'extra-rounded'>('extra-rounded');
  const [cornerSquareColor, setCornerSquareColor] = useState('#06b6d4');
  const [cornerDotStyle, setCornerDotStyle] = useState<'square' | 'dot'>('dot');
  const [cornerDotColor, setCornerDotColor] = useState('#8b5cf6');

  // Logo
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [logoSize, setLogoSize] = useState<number>(0.25);
  const [logoMargin, setLogoMargin] = useState<number>(5);

  // Frame Call To Action
  const [frameStyle, setFrameStyle] = useState<'none' | 'badge' | 'top-bottom' | 'card'>('badge');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameColor, setFrameColor] = useState('#06b6d4');
  const [frameTextColor, setFrameTextColor] = useState('#0f172a');

  // UI Active Control Tab
  const [activeTab, setActiveTab] = useState<'content' | 'pattern' | 'colors' | 'logo' | 'frame' | 'presets'>('content');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute final QR data payload based on content type
  const getQrData = () => {
    switch (contentType) {
      case 'url':
        return contentValues.url || 'https://shortify-qr.vercel.app';
      case 'text':
        return contentValues.text;
      case 'wifi':
        return `WIFI:S:${contentValues.wifi.ssid};T:${contentValues.wifi.encryption};P:${contentValues.wifi.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${contentValues.vcard.lastName};${contentValues.vcard.firstName}\nFN:${contentValues.vcard.firstName} ${contentValues.vcard.lastName}\nORG:${contentValues.vcard.organization}\nTITLE:${contentValues.vcard.title}\nTEL:${contentValues.vcard.phone}\nEMAIL:${contentValues.vcard.email}\nURL:${contentValues.vcard.website}\nEND:VCARD`;
      case 'email':
        return `mailto:${contentValues.email.email}?subject=${encodeURIComponent(contentValues.email.subject)}&body=${encodeURIComponent(contentValues.email.body)}`;
      case 'whatsapp':
        return `https://wa.me/${contentValues.whatsapp.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contentValues.whatsapp.message)}`;
      default:
        return 'https://shortify-qr.vercel.app';
    }
  };

  // Initialize and update QRCodeStyling instance dynamically
  useEffect(() => {
    let isSubscribed = true;

    async function initQr() {
      if (typeof window === 'undefined') return;

      try {
        const QRCodeStyling = (await import('qr-code-styling')).default;

        const options: any = {
          width: 300,
          height: 300,
          type: 'svg',
          data: getQrData(),
          image: logoSrc || undefined,
          dotsOptions: {
            type: dotStyle,
            color: colorType === 'single' ? singleColor : undefined,
            gradient:
              colorType === 'gradient'
                ? {
                    type: gradientType,
                    rotation: 45,
                    colorStops: [
                      { offset: 0, color: gradientColor1 },
                      { offset: 1, color: gradientColor2 },
                    ],
                  }
                : undefined,
          },
          backgroundOptions: {
            color: bgTransparent ? 'transparent' : bgColor,
          },
          cornersSquareOptions: {
            type: cornerSquareStyle,
            color: cornerSquareColor,
          },
          cornersDotOptions: {
            type: cornerDotStyle,
            color: cornerDotColor,
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: logoMargin,
            imageSize: logoSize,
            hideBackgroundDots: true,
          },
        };

        if (!qrCodeStylingInstance.current) {
          qrCodeStylingInstance.current = new QRCodeStyling(options);
          if (qrRef.current && isSubscribed) {
            qrRef.current.innerHTML = '';
            qrCodeStylingInstance.current.append(qrRef.current);
          }
        } else {
          qrCodeStylingInstance.current.update(options);
        }
      } catch (err) {
        console.error('Failed to initialize QRCodeStyling:', err);
      }
    }

    initQr();

    return () => {
      isSubscribed = false;
    };
  }, [
    contentType,
    contentValues,
    dotStyle,
    colorType,
    singleColor,
    gradientColor1,
    gradientColor2,
    gradientType,
    bgColor,
    bgTransparent,
    cornerSquareStyle,
    cornerSquareColor,
    cornerDotStyle,
    cornerDotColor,
    logoSrc,
    logoSize,
    logoMargin,
  ]);

  // Apply Preset Theme
  const applyPreset = (preset: typeof QR_PRESETS[0]) => {
    const cfg = preset.config;
    if (cfg.dots) {
      if (cfg.dots.style) setDotStyle(cfg.dots.style as any);
      if (cfg.dots.colorType) setColorType(cfg.dots.colorType as any);
      if (cfg.dots.color) setSingleColor(cfg.dots.color);
      if (cfg.dots.gradient) {
        setGradientType(cfg.dots.gradient.type as any);
        setGradientColor1(cfg.dots.gradient.color1);
        setGradientColor2(cfg.dots.gradient.color2);
      }
    }
    if (cfg.cornersSquare) {
      if (cfg.cornersSquare.style) setCornerSquareStyle(cfg.cornersSquare.style as any);
      if (cfg.cornersSquare.color) setCornerSquareColor(cfg.cornersSquare.color);
    }
    if (cfg.cornersDot) {
      if (cfg.cornersDot.style) setCornerDotStyle(cfg.cornersDot.style as any);
      if (cfg.cornersDot.color) setCornerDotColor(cfg.cornersDot.color);
    }
    if (cfg.background) {
      if (cfg.background.color) setBgColor(cfg.background.color);
      if (cfg.background.transparent !== undefined) setBgTransparent(cfg.background.transparent);
    }
    if (cfg.frame) {
      if (cfg.frame.style) setFrameStyle(cfg.frame.style as any);
      if (cfg.frame.text) setFrameText(cfg.frame.text);
      if (cfg.frame.color) setFrameColor(cfg.frame.color);
      if (cfg.frame.textColor) setFrameTextColor(cfg.frame.textColor);
    }
  };

  // Export functions
  const handleDownload = async (extension: 'png' | 'svg' | 'webp') => {
    if (!qrCodeStylingInstance.current) return;
    setDownloading(true);
    try {
      await qrCodeStylingInstance.current.download({
        name: `shortify-qr-${Date.now()}`,
        extension,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  // Image upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> High-Fidelity Customization Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Stylized <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">QR Code Studio</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Craft gorgeous, custom-styled QR codes with dot patterns, gradients, embedded logos, and decorative call-to-action frames.
        </p>
      </div>

      {/* Main Studio Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Control Panel (Tabs & Inputs) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Controls Tab Header */}
          <div className="glass-panel p-2 rounded-2xl flex items-center justify-between overflow-x-auto gap-1 border border-slate-800">
            {[
              { id: 'pattern', label: 'Shapes', icon: LayoutGrid },
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'content', label: 'Content', icon: Type },
              { id: 'logo', label: 'Logo', icon: ImageIcon },
              { id: 'frame', label: 'Badge', icon: Sliders },
              { id: 'presets', label: 'Presets', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Control Panel Tab Content */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 border border-slate-800 shadow-xl min-h-[420px]">
            {/* TAB: CONTENT */}
            {activeTab === 'content' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Select QR Content Type</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { id: 'url', label: 'Website', icon: Globe },
                      { id: 'text', label: 'Text', icon: Type },
                      { id: 'wifi', label: 'WiFi', icon: Wifi },
                      { id: 'vcard', label: 'VCard', icon: Phone },
                      { id: 'email', label: 'Email', icon: Mail },
                      { id: 'whatsapp', label: 'WhatsApp', icon: Share2 },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setContentType(type.id as any)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition ${
                            contentType === type.id
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Inputs based on Type */}
                {contentType === 'url' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Website Target Link</label>
                    <input
                      type="url"
                      value={contentValues.url}
                      onChange={(e) => setContentValues({ ...contentValues, url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 text-sm font-mono"
                    />
                  </div>
                )}

                {contentType === 'text' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Plain Text Message</label>
                    <textarea
                      value={contentValues.text}
                      onChange={(e) => setContentValues({ ...contentValues, text: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                )}

                {contentType === 'wifi' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={contentValues.wifi.ssid}
                        onChange={(e) => setContentValues({ ...contentValues, wifi: { ...contentValues.wifi, ssid: e.target.value } })}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Password</label>
                        <input
                          type="password"
                          value={contentValues.wifi.password}
                          onChange={(e) => setContentValues({ ...contentValues, wifi: { ...contentValues.wifi, password: e.target.value } })}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Encryption</label>
                        <select
                          value={contentValues.wifi.encryption}
                          onChange={(e) => setContentValues({ ...contentValues, wifi: { ...contentValues.wifi, encryption: e.target.value as any } })}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm"
                        >
                          <option value="WPA/WPA2">WPA / WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None (Open)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {contentType === 'vcard' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">First Name</label>
                      <input
                        type="text"
                        value={contentValues.vcard.firstName}
                        onChange={(e) => setContentValues({ ...contentValues, vcard: { ...contentValues.vcard, firstName: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Last Name</label>
                      <input
                        type="text"
                        value={contentValues.vcard.lastName}
                        onChange={(e) => setContentValues({ ...contentValues, vcard: { ...contentValues.vcard, lastName: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Phone</label>
                      <input
                        type="text"
                        value={contentValues.vcard.phone}
                        onChange={(e) => setContentValues({ ...contentValues, vcard: { ...contentValues.vcard, phone: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Email</label>
                      <input
                        type="email"
                        value={contentValues.vcard.email}
                        onChange={(e) => setContentValues({ ...contentValues, vcard: { ...contentValues.vcard, email: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PATTERN & SHAPES */}
            {activeTab === 'pattern' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Dot Style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Module Dot Pattern</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'extra-rounded', label: 'Extra Soft' },
                      { id: 'dots', label: 'Circular Dots' },
                      { id: 'classy', label: 'Classy Sharp' },
                      { id: 'classy-rounded', label: 'Classy Smooth' },
                      { id: 'square', label: 'Classic Square' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setDotStyle(style.id as any)}
                        className={`p-3 rounded-xl border text-xs font-medium transition text-center ${
                          dotStyle === style.id
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Frame Style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Corner Eye Frame Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'extra-rounded', label: 'Extra Rounded' },
                      { id: 'square', label: 'Square' },
                      { id: 'dot', label: 'Circle Eye' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCornerSquareStyle(style.id as any)}
                        className={`p-3 rounded-xl border text-xs font-medium transition text-center ${
                          cornerSquareStyle === style.id
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Dot Style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Corner Center Dot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dot', label: 'Round Center' },
                      { id: 'square', label: 'Square Center' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCornerDotStyle(style.id as any)}
                        className={`p-3 rounded-xl border text-xs font-medium transition text-center ${
                          cornerDotStyle === style.id
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COLORS */}
            {activeTab === 'colors' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Color Mode Switch */}
                <div className="flex items-center justify-between p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setColorType('gradient')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                      colorType === 'gradient' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Vibrant Gradient
                  </button>
                  <button
                    onClick={() => setColorType('single')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                      colorType === 'single' ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Solid Color
                  </button>
                </div>

                {colorType === 'gradient' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Gradient Start</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Gradient End</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Gradient Type</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setGradientType('linear')}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border ${
                            gradientType === 'linear' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          Linear Direction
                        </button>
                        <button
                          onClick={() => setGradientType('radial')}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border ${
                            gradientType === 'radial' ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          Radial Burst
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Foreground Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={singleColor}
                        onChange={(e) => setSingleColor(e.target.value)}
                        className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={singleColor}
                        onChange={(e) => setSingleColor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Background Customization */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Background Fill</label>
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bgTransparent}
                        onChange={(e) => setBgTransparent(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      Transparent BG
                    </label>
                  </div>

                  {!bgTransparent && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: LOGO */}
            {activeTab === 'logo' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Upload Custom Brand Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Or Select Preset Icon</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_LOGOS.map((logo) => (
                      <button
                        key={logo.id}
                        onClick={() => {
                          const svgBlob = new Blob([logo.svg], { type: 'image/svg+xml' });
                          setLogoSrc(URL.createObjectURL(svgBlob));
                        }}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 flex flex-col items-center gap-1.5 text-xs text-slate-300 transition"
                      >
                        <div dangerouslySetInnerHTML={{ __html: logo.svg }} className="w-5 h-5 text-cyan-400" />
                        {logo.name}
                      </button>
                    ))}
                  </div>
                </div>

                {logoSrc && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-400 font-semibold">✓ Logo Applied</span>
                      <button
                        onClick={() => setLogoSrc('')}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove Logo
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Logo Size</span>
                        <span>{Math.round(logoSize * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.35"
                        step="0.02"
                        value={logoSize}
                        onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FRAME BADGE */}
            {activeTab === 'frame' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Badge Frame Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'badge', label: 'Bottom Badge' },
                      { id: 'top-bottom', label: 'Top & Bottom' },
                      { id: 'none', label: 'No Frame' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFrameStyle(f.id as any)}
                        className={`p-3 rounded-xl border text-xs font-medium transition text-center ${
                          frameStyle === f.id
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {frameStyle !== 'none' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Call To Action Text</label>
                      <input
                        type="text"
                        value={frameText}
                        onChange={(e) => setFrameText(e.target.value)}
                        placeholder="SCAN ME"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-bold text-sm uppercase tracking-wider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Frame Badge Color</label>
                        <input
                          type="color"
                          value={frameColor}
                          onChange={(e) => setFrameColor(e.target.value)}
                          className="w-full h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Text Color</label>
                        <input
                          type="color"
                          value={frameTextColor}
                          onChange={(e) => setFrameTextColor(e.target.value)}
                          className="w-full h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Design Preset Templates</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-left transition space-y-1 group"
                    >
                      <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition">
                        {preset.name}
                      </div>
                      <div className="text-xs text-slate-400">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live QR Preview Canvas & Export Bar - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Ambient canvas glow */}
            <div className="absolute inset-0 bg-hero-glow opacity-60 pointer-events-none"></div>

            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Live High-Res Preview
            </span>

            {/* Frame Badge Outer Container */}
            <div
              className="p-6 rounded-3xl border border-slate-700/60 shadow-2xl space-y-4 transition-all duration-300 max-w-[340px] w-full"
              style={{
                backgroundColor: bgTransparent ? '#0f172a' : bgColor,
              }}
            >
              {frameStyle === 'top-bottom' && (
                <div
                  className="py-1.5 px-4 rounded-lg font-extrabold text-xs tracking-widest uppercase shadow-md"
                  style={{ backgroundColor: frameColor, color: frameTextColor }}
                >
                  {frameText}
                </div>
              )}

              {/* DOM Target where QRCodeStyling attaches SVG canvas */}
              <div ref={qrRef} className="flex justify-center items-center overflow-hidden rounded-xl py-2" />

              {(frameStyle === 'badge' || frameStyle === 'top-bottom') && (
                <div
                  className="py-2 px-6 rounded-xl font-extrabold text-sm tracking-widest uppercase shadow-lg inline-block"
                  style={{ backgroundColor: frameColor, color: frameTextColor }}
                >
                  {frameText}
                </div>
              )}
            </div>

            {/* Export Buttons */}
            <div className="w-full space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Download Output</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDownload('png')}
                  disabled={downloading}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
                >
                  <Download className="w-3.5 h-3.5" /> PNG
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  disabled={downloading}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 transition"
                >
                  <Download className="w-3.5 h-3.5" /> SVG Vector
                </button>
                <button
                  onClick={() => handleDownload('webp')}
                  disabled={downloading}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" /> WEBP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
