import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WalletProvider } from '@/providers/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'One Click - DeFi Security Platform',
  description: 'Deploy enterprise-grade security traps in minutes with AI-powered contract generation. Protect your DeFi protocols from common attack vectors.',
  keywords: 'DeFi, security, smart contracts, blockchain, Ethereum, Polygon, Arbitrum, Base, security traps, honeypots, AI, artificial intelligence',
  authors: [{ name: 'One Click Team' }],
  openGraph: {
    title: 'One Click - DeFi Security Platform',
    description: 'Deploy enterprise-grade security traps in minutes with AI-powered contract generation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Click - DeFi Security Platform',
    description: 'Deploy enterprise-grade security traps in minutes with AI-powered contract generation.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
