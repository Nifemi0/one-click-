"use client";

import { useWallet } from '../providers/WalletProvider';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { isConnected, address, connect } = useWallet();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-black">1</span>
            </div>
            <span className="text-xl font-semibold text-white">One Click</span>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-orange-400 transition-colors">
              Features
            </a>
            <a href="#security" className="text-white hover:text-orange-400 transition-colors">
              Security
            </a>
            <a href="/marketplace" className="text-white hover:text-orange-400 transition-colors">
              Marketplace
            </a>
            <a href="#about" className="text-white hover:text-orange-400 transition-colors">
              About
            </a>
          </nav>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button
                  onClick={handleLaunchApp}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Launch App
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="bg-orange-100 text-orange-600 border border-orange-500 font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-orange-200"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
