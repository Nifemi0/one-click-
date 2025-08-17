import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <a href="#features" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Features
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a href="#security" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Security
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a href="#marketplace" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              Marketplace
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 relative group">
              About
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-300 transition-all duration-200 backdrop-blur-sm"
            >
              Connect Wallet
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:scale-105">
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
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Features
              </a>
              <a href="#security" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Security
              </a>
              <a href="#marketplace" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                Marketplace
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200">
                About
              </a>
              <div className="pt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-300"
                >
                  Connect Wallet
                </Button>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
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