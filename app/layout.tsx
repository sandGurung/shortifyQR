import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shortify & QR Studio | URL Shortener & Stylized QR Code Generator',
  description: 'Shorten links with click analytics and generate beautiful, stylized QR codes with gradients, logos, custom shapes, and decorative frames. Ready for free Vercel hosting.',
  keywords: ['URL Shortener', 'QR Code Generator', 'Stylized QR Code', 'Link Analytics', 'Next.js', 'Vercel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#090d16] text-slate-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
