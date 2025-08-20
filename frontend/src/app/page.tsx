'use client';

import { useWallet } from '../providers/WalletProvider';
import { useTheme } from '../providers/ThemeProvider';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Donation } from '../components/Donation';
import { Footer } from '../components/Footer';
import BackendConnectionTest from '@/components/BackendConnectionTest';

export default function Home() {
  const { isConnected, address, connect } = useWallet();
  const { resolvedTheme } = useTheme();

  const handleConnectWallet = () => {
    if (!isConnected) {
      connect();
    }
  };

  const handleLaunchApp = () => {
    if (isConnected) {
      window.location.href = '/app';
    } else {
      connect();
    }
  };

  const handleDeployTrap = () => {
    if (isConnected) {
      window.location.href = '/deploy';
    } else {
      connect();
    }
  };

  const handleViewTemplates = () => {
    if (isConnected) {
      window.location.href = '/marketplace';
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <Donation />
      </main>

      <Footer />
      
      {/* Backend Connection Test */}
      <BackendConnectionTest />
    </div>
  );
}

