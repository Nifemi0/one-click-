import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Drosera - One-Click DeFi Security Traps',
  description: 'Democratizing access to DeFi security through intelligent, one-click deployment of security traps. Protect your assets across multiple chains with AI-powered analysis.',
  keywords: ['DeFi', 'security', 'blockchain', 'cryptocurrency', 'smart contracts', 'vulnerability', 'protection'],
  authors: [{ name: 'Drosera Network' }],
  creator: 'Drosera Network',
  publisher: 'Drosera Network',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://drosera.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Drosera - One-Click DeFi Security Traps',
    description: 'Democratizing access to DeFi security through intelligent, one-click deployment of security traps.',
    url: 'https://drosera.xyz',
    siteName: 'Drosera',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Drosera Security Traps',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drosera - One-Click DeFi Security Traps',
    description: 'Democratizing access to DeFi security through intelligent, one-click deployment of security traps.',
    images: ['/og-image.png'],
    creator: '@drosera',
    site: '@drosera',
  },
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}