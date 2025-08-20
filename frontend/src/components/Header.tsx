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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-hover rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-accent-foreground">1</span>
            </div>
            <span className="text-xl font-semibold gradient-text">One Click DeFi</span>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-foreground hover:text-accent transition-colors">
              Home
            </a>
            <a href="#features" className="text-foreground hover:text-accent transition-colors">
              Features
            </a>
            <a href="#security" className="text-foreground hover:text-accent transition-colors">
              Security
            </a>
            <a href="/marketplace" className="text-foreground hover:text-accent transition-colors">
              Marketplace
            </a>
            <a href="#contact" className="text-foreground hover:text-accent transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button
                  onClick={handleLaunchApp}
                  className="btn btn-primary btn-md"
                >
                  Launch App
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="btn btn-secondary btn-md"
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
