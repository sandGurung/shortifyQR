import { ShortLink, ClickAnalytics, LinkStats } from './types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const CLICKS_FILE = path.join(DATA_DIR, 'clicks.json');

// In-memory cache for serverless environments (e.g. Vercel)
let inMemoryLinks: Map<string, ShortLink> = new Map();
let inMemoryClicks: ClickAnalytics[] = [];

// Seed demo data if empty
function initializeDefaults() {
  if (inMemoryLinks.size === 0) {
    const demoLink: ShortLink = {
      id: 'demo-1',
      originalUrl: 'https://vercel.com/docs',
      shortCode: 'vercel-docs',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      expiresAt: null,
      clicks: 42,
    };
    inMemoryLinks.set('vercel-docs', demoLink);

    // Add demo clicks
    const now = Date.now();
    for (let i = 0; i < 42; i++) {
      const timeOffset = Math.floor(Math.random() * 86400000 * 3);
      inMemoryClicks.push({
        id: `click-${i}`,
        shortCode: 'vercel-docs',
        timestamp: new Date(now - timeOffset).toISOString(),
        userAgent: i % 2 === 0 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        referrer: i % 3 === 0 ? 'https://google.com' : i % 3 === 1 ? 'https://twitter.com' : 'Direct',
        deviceType: i % 2 === 0 ? 'Mobile' : 'Desktop',
      });
    }
  }
}

function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LINKS_FILE)) {
      initializeDefaults();
      saveLinksToFile();
    } else {
      const content = fs.readFileSync(LINKS_FILE, 'utf-8');
      const parsed: ShortLink[] = JSON.parse(content || '[]');
      inMemoryLinks.clear();
      parsed.forEach((item) => inMemoryLinks.set(item.shortCode, item));
    }

    if (!fs.existsSync(CLICKS_FILE)) {
      saveClicksToFile();
    } else {
      const content = fs.readFileSync(CLICKS_FILE, 'utf-8');
      inMemoryClicks = JSON.parse(content || '[]');
    }
  } catch (e) {
    // In serverless / read-only environment like Vercel Lambda without persistent disk write
    initializeDefaults();
  }
}

function saveLinksToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const array = Array.from(inMemoryLinks.values());
    fs.writeFileSync(LINKS_FILE, JSON.stringify(array, null, 2), 'utf-8');
  } catch (e) {
    // Ignore file write errors on read-only lambda storage
  }
}

function saveClicksToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CLICKS_FILE, JSON.stringify(inMemoryClicks, null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

// Generate random short code
export function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getAllShortLinks(): ShortLink[] {
  ensureDataFiles();
  return Array.from(inMemoryLinks.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getShortLink(code: string): ShortLink | null {
  ensureDataFiles();
  const link = inMemoryLinks.get(code);
  if (!link) return null;

  // Check expiration
  if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) {
    return null; // Expired
  }

  return link;
}

export function createShortLink(params: {
  originalUrl: string;
  customAlias?: string;
  expiresInHours?: number | null;
}): { link?: ShortLink; error?: string } {
  ensureDataFiles();

  let code = params.customAlias?.trim();
  if (code) {
    // Sanitize alias
    code = code.replace(/[^a-zA-Z0-9-_]/g, '');
    if (code.length < 3) {
      return { error: 'Custom alias must be at least 3 characters long.' };
    }
    if (inMemoryLinks.has(code)) {
      return { error: `Alias "${code}" is already in use. Please pick another one.` };
    }
  } else {
    code = generateShortCode(6);
    while (inMemoryLinks.has(code)) {
      code = generateShortCode(6);
    }
  }

  let expiresAt: string | null = null;
  if (params.expiresInHours && params.expiresInHours > 0) {
    expiresAt = new Date(Date.now() + params.expiresInHours * 3600 * 1000).toISOString();
  }

  const newLink: ShortLink = {
    id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    originalUrl: params.originalUrl,
    shortCode: code,
    createdAt: new Date().toISOString(),
    expiresAt,
    clicks: 0,
  };

  inMemoryLinks.set(code, newLink);
  saveLinksToFile();

  return { link: newLink };
}

export function recordClick(
  code: string,
  userAgent: string = '',
  referrer: string = ''
): void {
  ensureDataFiles();
  const link = inMemoryLinks.get(code);
  if (!link) return;

  link.clicks += 1;
  inMemoryLinks.set(code, link);
  saveLinksToFile();

  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown' = 'Desktop';
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|android/i.test(ua)) {
    deviceType = 'Mobile';
  }

  const clickEntry: ClickAnalytics = {
    id: `click_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    shortCode: code,
    timestamp: new Date().toISOString(),
    userAgent: userAgent.substring(0, 200),
    referrer: referrer || 'Direct',
    deviceType,
  };

  inMemoryClicks.push(clickEntry);
  saveClicksToFile();
}

export function getLinkStats(code: string): LinkStats | null {
  ensureDataFiles();
  const link = inMemoryLinks.get(code);
  if (!link) return null;

  const logs = inMemoryClicks.filter((c) => c.shortCode === code);

  // Device Breakdown
  const deviceCounts: Record<string, number> = {};
  logs.forEach((log) => {
    deviceCounts[log.deviceType] = (deviceCounts[log.deviceType] || 0) + 1;
  });
  const deviceBreakdown = Object.entries(deviceCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Daily Clicks breakdown for past 7 days
  const dailyMap: Record<string, number> = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dailyMap[dateStr] = 0;
  }

  logs.forEach((log) => {
    const dateStr = log.timestamp.split('T')[0];
    if (dailyMap[dateStr] !== undefined) {
      dailyMap[dateStr] += 1;
    }
  });

  const dailyClicks = Object.entries(dailyMap).map(([date, clicks]) => ({
    date,
    clicks,
  }));

  return {
    shortLink: link,
    clickLogs: logs.slice(-50).reverse(), // Last 50 clicks
    deviceBreakdown,
    dailyClicks,
  };
}

export function deleteShortLink(code: string): boolean {
  ensureDataFiles();
  if (inMemoryLinks.has(code)) {
    inMemoryLinks.delete(code);
    saveLinksToFile();
    inMemoryClicks = inMemoryClicks.filter((c) => c.shortCode !== code);
    saveClicksToFile();
    return true;
  }
  return false;
}
