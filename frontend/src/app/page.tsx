'use client';

import { useWallet } from '../providers/WalletProvider';
import { useTheme } from '../providers/ThemeProvider';
import { ThemeToggle } from '../components/ThemeToggle';
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
      {/* Header with Theme Toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-black">1</span>
              </div>
              <span className="text-xl font-semibold text-white">One Click</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  <button
                    onClick={handleLaunchApp}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Launch App
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

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

