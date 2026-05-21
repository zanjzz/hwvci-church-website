import type { Metadata } from 'next';
import { Geist, Geist_Mono, Permanent_Marker } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

// Add your chosen Google Font (Permanent Marker as example)
const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-permanent-marker',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'House of Worship with Vision Church International',
  description: 'Join us for worship, prayer, and biblical teaching. Discover your spiritual home with our welcoming community.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/hwvci-logo-light-mode.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/hwvci-logo-dark-mode.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}