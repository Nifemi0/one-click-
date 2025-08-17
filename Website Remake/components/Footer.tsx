export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <span className="text-xl font-semibold text-white">One Click Network</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Democratizing access to advanced DeFi security tools.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#api" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#documentation" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#tutorials" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#support" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="#discord" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Discord
                </a>
              </li>
              <li>
                <a href="#github" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 One Click Network. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-gray-500 hover:text-orange-400 transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-500 hover:text-orange-400 transition-colors duration-200 text-sm">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-500 hover:text-orange-400 transition-colors duration-200 text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}