import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drosera - DeFi Security Made Simple",
  description: "Deploy sophisticated security traps across multiple blockchains with AI-powered analysis. Protect your assets with enterprise-grade security made simple.",
  keywords: ["DeFi", "security", "blockchain", "smart contracts", "cryptocurrency", "Ethereum", "Polygon", "Arbitrum", "Base"],
  authors: [{ name: "Drosera Network" }],
  creator: "Drosera Network",
  publisher: "Drosera Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://drosera.network'),
  openGraph: {
    title: "Drosera - DeFi Security Made Simple",
    description: "Deploy sophisticated security traps across multiple blockchains with AI-powered analysis.",
    url: 'https://drosera.network',
    siteName: 'Drosera Network',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Drosera Network - DeFi Security Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Drosera - DeFi Security Made Simple",
    description: "Deploy sophisticated security traps across multiple blockchains with AI-powered analysis.",
    images: ['/og-image.png'],
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Fallback CSS link for Netlify compatibility */}
        <link rel="stylesheet" href="/fallback.css" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
