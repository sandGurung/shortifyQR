export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt: string | null; // ISO string or null for never
  clicks: number;
  qrConfig?: QrCodeConfig;
}

export interface ClickAnalytics {
  id: string;
  shortCode: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown';
}

export interface LinkStats {
  shortLink: ShortLink;
  clickLogs: ClickAnalytics[];
  deviceBreakdown: { name: string; count: number }[];
  dailyClicks: { date: string; clicks: number }[];
}

export type QrContentType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'whatsapp';

export interface QrCodeConfig {
  contentType: QrContentType;
  content: {
    url?: string;
    text?: string;
    wifi?: { ssid: string; password: string; encryption: 'WPA/WPA2' | 'WEP' | 'nopass' };
    vcard?: { firstName: string; lastName: string; phone: string; email: string; organization: string; title: string; website: string };
    email?: { email: string; subject: string; body: string };
    whatsapp?: { phone: string; message: string };
  };
  dots: {
    style: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    colorType: 'single' | 'gradient';
    color: string;
    gradient?: {
      type: 'linear' | 'radial';
      color1: string;
      color2: string;
      rotation: number;
    };
  };
  background: {
    color: string;
    transparent: boolean;
  };
  cornersSquare: {
    style: 'square' | 'dot' | 'extra-rounded';
    color: string;
  };
  cornersDot: {
    style: 'square' | 'dot';
    color: string;
  };
  logo?: {
    src: string; // Data URL or URL
    size: number; // 0.1 to 0.4
    margin: number;
    hideBackgroundDots: boolean;
  };
  frame?: {
    style: 'none' | 'top-bottom' | 'badge' | 'card' | 'rounded-box';
    text: string;
    color: string;
    textColor: string;
  };
}
