"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useWallet } from "../providers/WalletProvider";
import Link from "next/link";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected, address, connect, disconnect } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLaunchApp = () => {
    // Navigate to the main app functionality
    window.location.href = '/app';
  };

  const handleWalletAction = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-black/95 backdrop-blur-md border-b border-gray-800/50 shadow-2xl" 
        : "bg-black/80 backdrop-blur-sm border-b border-gray-800"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <span className="text-xl font-semibold text-white">One Click</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Home
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link href="/deploy" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Deploy
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Marketplace
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link href="/app" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Dashboard
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={handleWalletAction}
              variant="outline" 
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-300 transition-all duration-200 backdrop-blur-sm"
            >
              {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </Button>
            <Button 
              onClick={handleLaunchApp}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:scale-105"
            >
              Launch App
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Home
              </Link>
              <Link href="/deploy" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Deploy
              </Link>
              <Link href="/marketplace" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Marketplace
              </Link>
              <Link href="/app" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Dashboard
              </Link>
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={handleWalletAction}
                  variant="outline" 
                  className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-300"
                >
                  {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
                </Button>
                <Button 
                  onClick={handleLaunchApp}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  Launch App
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
