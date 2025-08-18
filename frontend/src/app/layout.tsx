import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "One Click - DeFi Security Made Simple",
  description: "Deploy sophisticated security traps on Hoodi testnet with AI-powered analysis. Protect your assets with enterprise-grade security made simple.",
  keywords: ["DeFi", "security", "blockchain", "smart contracts", "cryptocurrency", "Hoodi", "testnet", "one click"],
  authors: [{ name: "One Click Network" }],
  creator: "One Click Network",
  publisher: "One Click Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://oneclick.network'),
  openGraph: {
    title: "One Click - DeFi Security Made Simple",
    description: "Deploy sophisticated security traps on Hoodi testnet with AI-powered analysis.",
    url: 'https://oneclick.network',
    siteName: 'One Click Network',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'One Click Network - DeFi Security Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "One Click - DeFi Security Made Simple",
    description: "Deploy sophisticated security traps on Hoodi testnet with AI-powered analysis.",
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
        {/* Standalone CSS for Netlify compatibility - moved to globals.css */}
        {/* <link rel="stylesheet" href="/standalone.css" /> */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
