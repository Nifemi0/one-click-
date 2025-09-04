"use client";

import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-charcoal">One Click</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-primary-500 transition-colors">
              Home
            </a>
            <a href="/marketplace" className="text-gray-600 hover:text-primary-500 transition-colors">
              Marketplace
            </a>
            <a href="/features" className="text-gray-600 hover:text-primary-500 transition-colors">
              Features
            </a>
            <a href="/status" className="text-gray-600 hover:text-primary-500 transition-colors">
              Status
            </a>
            <a href="/docs" className="text-gray-600 hover:text-primary-500 transition-colors">
              Docs
            </a>
            <a href="/support" className="text-gray-600 hover:text-primary-500 transition-colors">
              Support
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="/deploy" className="inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-200 rounded-md bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105">
              Deploy Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-gray-600 hover:text-primary-500 transition-colors">
                Home
              </a>
              <a href="/marketplace" className="text-gray-600 hover:text-primary-500 transition-colors">
                Marketplace
              </a>
              <a href="/features" className="text-gray-600 hover:text-primary-500 transition-colors">
                Features
              </a>
              <a href="/status" className="text-gray-600 hover:text-primary-500 transition-colors">
                Status
              </a>
              <a href="/docs" className="text-gray-600 hover:text-primary-500 transition-colors">
                Docs
              </a>
              <a href="/support" className="text-gray-600 hover:text-primary-500 transition-colors">
                Support
              </a>
              <div className="pt-4">
                <a href="/deploy" className="inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-200 rounded-md bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 w-full">
                  Deploy Now
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
