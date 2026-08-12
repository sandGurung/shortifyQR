import { ShortLink, ClickAnalytics, LinkStats } from './types';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Use OS temp dir for writable serverless storage (e.g. Vercel Lambda /tmp)
const TMP_DATA_DIR = path.join(os.tmpdir(), 'shortify-data');
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');

// Primary writable file paths in /tmp
const LINKS_FILE = path.join(TMP_DATA_DIR, 'links.json');
const CLICKS_FILE = path.join(TMP_DATA_DIR, 'clicks.json');
const VISITORS_FILE = path.join(TMP_DATA_DIR, 'visitors.json');

// Global state persistence across warm Lambdas
const globalForShortify = globalThis as unknown as {
  shortifyLinks?: Map<string, ShortLink>;
  shortifyClicks?: ClickAnalytics[];
  shortifyVisitorCount?: number;
  shortifyInitialized?: boolean;
};

if (!globalForShortify.shortifyLinks) {
  globalForShortify.shortifyLinks = new Map();
}
if (!globalForShortify.shortifyClicks) {
  globalForShortify.shortifyClicks = [];
}
if (globalForShortify.shortifyVisitorCount === undefined) {
  globalForShortify.shortifyVisitorCount = 1252;
}

const inMemoryLinks = globalForShortify.shortifyLinks;
let inMemoryClicks = globalForShortify.shortifyClicks;

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
  if (globalForShortify.shortifyInitialized) return;

  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }

    let sourceLinksFile = fs.existsSync(LINKS_FILE) ? LINKS_FILE : path.join(LOCAL_DATA_DIR, 'links.json');
    if (fs.existsSync(sourceLinksFile)) {
      const content = fs.readFileSync(sourceLinksFile, 'utf-8');
      const parsed: ShortLink[] = JSON.parse(content || '[]');
      parsed.forEach((item) => inMemoryLinks.set(item.shortCode.toLowerCase(), item));
    } else {
      initializeDefaults();
      saveLinksToFile();
    }

    let sourceClicksFile = fs.existsSync(CLICKS_FILE) ? CLICKS_FILE : path.join(LOCAL_DATA_DIR, 'clicks.json');
    if (fs.existsSync(sourceClicksFile)) {
      const content = fs.readFileSync(sourceClicksFile, 'utf-8');
      globalForShortify.shortifyClicks = JSON.parse(content || '[]');
    }

    let sourceVisitorsFile = fs.existsSync(VISITORS_FILE) ? VISITORS_FILE : path.join(LOCAL_DATA_DIR, 'visitors.json');
    if (fs.existsSync(sourceVisitorsFile)) {
      const content = fs.readFileSync(sourceVisitorsFile, 'utf-8');
      const parsed = JSON.parse(content || '{}');
      if (typeof parsed.count === 'number') {
        globalForShortify.shortifyVisitorCount = parsed.count;
      }
    }
  } catch (e) {
    initializeDefaults();
  } finally {
    globalForShortify.shortifyInitialized = true;
  }
}

function saveLinksToFile() {
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
    const array = Array.from(inMemoryLinks.values());
    fs.writeFileSync(LINKS_FILE, JSON.stringify(array, null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

function saveClicksToFile() {
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CLICKS_FILE, JSON.stringify(globalForShortify.shortifyClicks || [], null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

function saveVisitorCountToFile() {
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(VISITORS_FILE, JSON.stringify({ count: globalForShortify.shortifyVisitorCount }, null, 2), 'utf-8');
  } catch (e) {
    // Ignore
  }
}

// Global Free Lifetime Counter API Integration (Zero credit card, zero subscription)
const GLOBAL_COUNTER_URL = 'https://api.counterapi.dev/v1/shortifyqr_app_visitors/visits';

export async function recordWebsiteVisit(): Promise<number> {
  ensureDataFiles();
  try {
    // Fetch incremented count from free global counter API
    const res = await fetch(`${GLOBAL_COUNTER_URL}/up`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        // Offset base by +1240 for aesthetic consistency
        const total = data.count + 1240;
        globalForShortify.shortifyVisitorCount = total;
        saveVisitorCountToFile();
        return total;
      }
    }
  } catch (e) {
    // Offline fallback
  }

  globalForShortify.shortifyVisitorCount = (globalForShortify.shortifyVisitorCount || 1252) + 1;
  saveVisitorCountToFile();
  return globalForShortify.shortifyVisitorCount;
}

export async function getWebsiteVisitorCount(): Promise<number> {
  ensureDataFiles();
  try {
    const res = await fetch(GLOBAL_COUNTER_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        const total = data.count + 1240;
        globalForShortify.shortifyVisitorCount = total;
        return total;
      }
    }
  } catch (e) {
    // Fallback
  }

  return globalForShortify.shortifyVisitorCount || 1252;
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
  if (!code) return null;
  const lookupKey = code.trim().toLowerCase();
  const link = inMemoryLinks.get(lookupKey);
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

  let rawAlias = params.customAlias?.trim();
  let code = '';

  if (rawAlias) {
    // Sanitize alias
    code = rawAlias.replace(/[^a-zA-Z0-9-_]/g, '');
    if (code.length < 2) {
      return { error: 'Custom alias must be at least 2 characters long.' };
    }
    const key = code.toLowerCase();
    if (inMemoryLinks.has(key)) {
      return { error: `Alias "${code}" is already in use. Please pick another one.` };
    }
  } else {
    code = generateShortCode(6);
    while (inMemoryLinks.has(code.toLowerCase())) {
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

  inMemoryLinks.set(code.toLowerCase(), newLink);
  saveLinksToFile();

  return { link: newLink };
}

export function recordClick(
  code: string,
  userAgent: string = '',
  referrer: string = ''
): void {
  ensureDataFiles();
  const key = code.toLowerCase();
  const link = inMemoryLinks.get(key);
  if (!link) return;

  link.clicks += 1;
  inMemoryLinks.set(key, link);
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
    shortCode: link.shortCode,
    timestamp: new Date().toISOString(),
    userAgent: userAgent.substring(0, 200),
    referrer: referrer || 'Direct',
    deviceType,
  };

  const clicks = globalForShortify.shortifyClicks || [];
  clicks.push(clickEntry);
  globalForShortify.shortifyClicks = clicks;
  saveClicksToFile();
}

export function getLinkStats(code: string): LinkStats | null {
  ensureDataFiles();
  const key = code.toLowerCase();
  const link = inMemoryLinks.get(key);
  if (!link) return null;

  const logs = (globalForShortify.shortifyClicks || []).filter(
    (c) => c.shortCode.toLowerCase() === key
  );

  const deviceCounts: Record<string, number> = {};
  logs.forEach((log) => {
    deviceCounts[log.deviceType] = (deviceCounts[log.deviceType] || 0) + 1;
  });
  const deviceBreakdown = Object.entries(deviceCounts).map(([name, count]) => ({
    name,
    count,
  }));

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
    clickLogs: logs.slice(-50).reverse(),
    deviceBreakdown,
    dailyClicks,
  };
}

export function deleteShortLink(code: string): boolean {
  ensureDataFiles();
  const key = code.toLowerCase();
  if (inMemoryLinks.has(key)) {
    inMemoryLinks.delete(key);
    saveLinksToFile();
    if (globalForShortify.shortifyClicks) {
      globalForShortify.shortifyClicks = globalForShortify.shortifyClicks.filter(
        (c) => c.shortCode.toLowerCase() !== key
      );
    }
    saveClicksToFile();
    return true;
  }
  return false;
}
