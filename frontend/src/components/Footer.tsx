import React from 'react';
import { Shield, Mail, Phone, MapPin, Twitter, Github, Linkedin, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">One Click</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              The leading platform for DeFi security. Deploy enterprise-grade security 
              traps in minutes with AI-powered contract generation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <ul className="space-y-2">
              <li>
                <a href="/docs" className="text-gray-300 hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/security" className="text-gray-300 hover:text-primary transition-colors">
                  Security Features
                </a>
              </li>
              <li>
                <a href="/audits" className="text-gray-300 hover:text-primary transition-colors">
                  Security Audits
                </a>
              </li>
              <li>
                <a href="/compliance" className="text-gray-300 hover:text-primary transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="/support" className="text-gray-300 hover:text-primary transition-colors">
                  Support Center
                </a>
              </li>
              <li>
                <a href="/discord" className="text-gray-300 hover:text-primary transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="/telegram" className="text-gray-300 hover:text-primary transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Updates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Get the latest security insights and platform updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 One Click. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
