import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free URL Shortener with Custom QR Code & Frame Generator | Shortify',
  description:
    'Free URL shortener with custom QR code generator & click analytics. Create stylized QR codes with custom frame badges, color gradients, brand logos, and custom link aliases with no sign up required.',
  keywords: [
    'Free URL shortener with custom QR code',
    'Custom frame QR code generator',
    'Free QR code maker no sign up',
    'URL Shortener',
    'QR Code Generator',
    'Stylized QR Code',
    'Custom Link Alias',
    'Link Click Analytics',
    'WiFi QR Code Generator',
    'VCard QR Code Generator',
  ],
  authors: [{ name: 'Shortify & QR Studio' }],
  creator: 'Shortify & QR Studio',
  publisher: 'Shortify & QR Studio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Free URL Shortener with Custom QR Code & Frame Generator',
    description:
      'Shorten links with click analytics, custom link aliases, and generate stylized QR codes with frames, logos, and color gradients. Free QR code maker no sign up required.',
    url: 'https://shortify-qr.vercel.app',
    siteName: 'Shortify & QR Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free URL Shortener with Custom QR Code Generator',
    description:
      'Create free shortened links with custom aliases & stylized QR codes featuring frames, logos, and gradients. No sign up required.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Shortify & QR Studio',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Free URL shortener with custom QR code generator, frame badges, logo embedding, and real-time link click analytics with no sign up required.',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#090d16] text-slate-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
