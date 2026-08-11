import { QrCodeConfig } from './types';

export interface QrPreset {
  id: string;
  name: string;
  description: string;
  config: Partial<QrCodeConfig>;
}

export const QR_PRESETS: QrPreset[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Electric cyan and violet gradient with rounded eyes',
    config: {
      dots: {
        style: 'rounded',
        colorType: 'gradient',
        color: '#06b6d4',
        gradient: {
          type: 'linear',
          color1: '#06b6d4',
          color2: '#8b5cf6',
          rotation: 45,
        },
      },
      cornersSquare: {
        style: 'extra-rounded',
        color: '#06b6d4',
      },
      cornersDot: {
        style: 'dot',
        color: '#a855f7',
      },
      background: {
        color: '#0f172a',
        transparent: false,
      },
      frame: {
        style: 'badge',
        text: 'SCAN ME',
        color: '#06b6d4',
        textColor: '#0f172a',
      },
    },
  },
  {
    id: 'minimal-slate',
    name: 'Minimal Dark',
    description: 'Monochrome dark design with extra rounded modules',
    config: {
      dots: {
        style: 'extra-rounded',
        colorType: 'single',
        color: '#f8fafc',
      },
      cornersSquare: {
        style: 'extra-rounded',
        color: '#38bdf8',
      },
      cornersDot: {
        style: 'dot',
        color: '#38bdf8',
      },
      background: {
        color: '#1e293b',
        transparent: false,
      },
      frame: {
        style: 'none',
        text: '',
        color: '#38bdf8',
        textColor: '#ffffff',
      },
    },
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Vibrant orange and pink radial gradient',
    config: {
      dots: {
        style: 'classy',
        colorType: 'gradient',
        color: '#f97316',
        gradient: {
          type: 'radial',
          color1: '#fb923c',
          color2: '#ec4899',
          rotation: 0,
        },
      },
      cornersSquare: {
        style: 'extra-rounded',
        color: '#f43f5e',
      },
      cornersDot: {
        style: 'dot',
        color: '#f43f5e',
      },
      background: {
        color: '#090d16',
        transparent: false,
      },
      frame: {
        style: 'top-bottom',
        text: 'VISIT WEBSITE',
        color: '#ec4899',
        textColor: '#ffffff',
      },
    },
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Gold',
    description: 'Premium emerald green with gold accents',
    config: {
      dots: {
        style: 'dots',
        colorType: 'gradient',
        color: '#10b981',
        gradient: {
          type: 'linear',
          color1: '#10b981',
          color2: '#eab308',
          rotation: 135,
        },
      },
      cornersSquare: {
        style: 'square',
        color: '#eab308',
      },
      cornersDot: {
        style: 'dot',
        color: '#10b981',
      },
      background: {
        color: '#064e3b',
        transparent: false,
      },
      frame: {
        style: 'card',
        text: 'SCAN TO OPEN',
        color: '#eab308',
        textColor: '#064e3b',
      },
    },
  },
  {
    id: 'brand-indigo',
    name: 'Vibrant Indigo',
    description: 'Clean modern indigo gradient on transparent or white',
    config: {
      dots: {
        style: 'classy-rounded',
        colorType: 'gradient',
        color: '#6366f1',
        gradient: {
          type: 'linear',
          color1: '#6366f1',
          color2: '#3b82f6',
          rotation: 90,
        },
      },
      cornersSquare: {
        style: 'extra-rounded',
        color: '#4f46e5',
      },
      cornersDot: {
        style: 'dot',
        color: '#6366f1',
      },
      background: {
        color: '#ffffff',
        transparent: false,
      },
      frame: {
        style: 'badge',
        text: 'CONNECT NOW',
        color: '#4f46e5',
        textColor: '#ffffff',
      },
    },
  },
];

export const PRESET_LOGOS = [
  { id: 'website', name: 'Website', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' },
  { id: 'wifi', name: 'WiFi', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.42a5 5 0 0 1 7 0"/></svg>' },
  { id: 'github', name: 'GitHub', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>' },
  { id: 'twitter', name: 'X / Twitter', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>' },
  { id: 'instagram', name: 'Instagram', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>' },
  { id: 'mail', name: 'Email', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' },
];
