https://shortifyqr.vercel.app/

# Shortify & QR Studio 🚀

A modern Next.js application for **URL Shortening with Click Analytics** and an **Advanced Stylized QR Code Studio**, designed for 100% free hosting on Vercel.

![Shortify & QR Studio](https://vercel.com/button)

---

## ✨ Key Features

1. **🔗 Link Shortener Studio**
   - Auto-generated 6-character short code or custom alias (slug).
   - Optional link expiration dates (24 hours, 7 days, 30 days, Never).
   - Instant copy link & test redirect button.
   - Built-in dynamic redirect engine with click tracking.

2. **🎨 Stylized QR Code Studio**
   - Multi-content formats: URL, Text, WiFi credentials, VCard contact info, Email, WhatsApp.
   - Module Patterns: Square, Dots, Rounded, Extra-Rounded, Classy, Diamond.
   - Eye Frame & Corner Dot shape selectors.
   - Colors: Solid color, Linear Gradient, Radial Gradient with dual color pickers.
   - Logo Upload: Custom image upload or select preset brand icons (GitHub, X, Website, Instagram, LinkedIn, WiFi, Email).
   - Decorative Call-to-Action Frames (e.g. "SCAN ME", "VISIT WEBSITE").
   - 6+ Preset design templates ("Cyber Neon", "Minimal Dark", "Sunset Glow", "Emerald Luxury", "Vibrant Indigo").
   - Export options: PNG, SVG (vector), WEBP, PDF layout.

3. **📊 Analytics & Managed Links Dashboard**
   - Table view of all shortened links with search filtering.
   - Total clicks, referrer sources, and device breakdown (Mobile vs Desktop).
   - One-click deletion and export to QR Studio.

4. **⚡ Free Vercel Hosting Ready**
   - Zero-config serverless storage layer out of the box (uses client-side localStorage + in-memory cache).
   - Supports Turso, SQLite, or Neon Postgres when `DATABASE_URL` is configured.

---

## 🛠️ Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🚀 Deploying to Vercel for Free

### Option 1: GitHub Integration (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository and click **Deploy**. Vercel will automatically detect Next.js and build it!

### Option 2: Vercel CLI
```bash
npx vercel
```

---

## 📄 License
MIT License. Built with Next.js 14, React 18, Tailwind CSS, Lucide Icons, and Framer Motion.
