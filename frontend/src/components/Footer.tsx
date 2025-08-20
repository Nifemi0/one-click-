import { Rocket, Book } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Get Started Now
            </button>
            <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <Book className="w-5 h-5" />
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">1</span>
                </div>
                <span className="text-white font-semibold">One Click Network</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Democratizing access to advanced DeFi security tools.
              </p>
              <p className="text-gray-500 text-sm">
                © 2024 One Click Network. All rights reserved.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#discord" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://github.com/Nifemi0/one-click-" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Links */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                One Click Network - Advanced DeFi Security
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                <a href="#cookies" className="text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
