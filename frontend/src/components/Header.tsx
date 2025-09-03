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
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-charcoal">One Click</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </a>
            <a href="/marketplace" className="text-gray-600 hover:text-primary transition-colors">
              Marketplace
            </a>
            <a href="/features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="/status" className="text-gray-600 hover:text-primary transition-colors">
              Status
            </a>
            <a href="/docs" className="text-gray-600 hover:text-primary transition-colors">
              Docs
            </a>
            <a href="/support" className="text-gray-600 hover:text-primary transition-colors">
              Support
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="/deploy" className="btn btn-primary">
              Deploy Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </a>
              <a href="/marketplace" className="text-gray-600 hover:text-primary transition-colors">
                Marketplace
              </a>
              <a href="/features" className="text-gray-600 hover:text-primary transition-colors">
                Features
              </a>
              <a href="/status" className="text-gray-600 hover:text-primary transition-colors">
                Status
              </a>
              <a href="/docs" className="text-gray-600 hover:text-primary transition-colors">
                Docs
              </a>
              <a href="/support" className="text-gray-600 hover:text-primary transition-colors">
                Support
              </a>
              <div className="pt-4">
                <a href="/deploy" className="btn btn-primary w-full">
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
