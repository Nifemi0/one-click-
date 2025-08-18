'use client';

import BackendConnectionTest from '@/components/BackendConnectionTest';

export default function Home() {
  const copyAddress = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <span className="text-xl font-bold gradient-text">One Click</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a className="text-gray-300 hover:text-white transition-colors" href="#features">Features</a>
              <a className="text-gray-300 hover:text-white transition-colors" href="#security">Security</a>
              <a className="text-gray-300 hover:text-white transition-colors" href="#marketplace">Marketplace</a>
              <a className="text-gray-300 hover:text-white transition-colors" href="#about">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-outline">Connect Wallet</button>
              <button className="btn-primary">Launch App</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">Secure Your DeFi with</span><br/>
              <span className="gradient-text">One Click</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Deploy sophisticated security traps on Hoodi testnet with AI-powered analysis. 
              Protect your assets with enterprise-grade security made simple.
            </p>
            <p className="text-lg text-orange-400 font-medium mb-8">Currently supporting Hoodi testnet for testing and development</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="btn-primary text-lg px-8 py-4 glow-orange">🚀 Deploy Security Trap</button>
            <button className="btn-secondary text-lg px-8 py-4">📚 View Templates</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Hoodi Testnet Security</h2>
            <p className="text-lg text-orange-400 font-medium mb-8 leading-relaxed">Secure your testnet assets while we prepare for mainnet</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-3">1</div>
              <div className="text-gray-300 font-medium">Testnet</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-3">99.9%</div>
              <div className="text-gray-300 font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-3">24/7</div>
              <div className="text-gray-300 font-medium">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-3">Test</div>
              <div className="text-gray-300 font-medium">Environment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Why Choose One Click?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">Advanced security technology wrapped in a simple, intuitive interface</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">One-Click Deployment</h3>
              <p className="text-gray-400 leading-relaxed">Deploy sophisticated security traps with a single click. No coding required.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Analysis</h3>
              <p className="text-gray-400 leading-relaxed">Intelligent contract analysis that identifies vulnerabilities before they become threats.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Testnet Ready</h3>
              <p className="text-gray-400 leading-relaxed">Perfect for testing security strategies on Hoodi testnet before mainnet deployment.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Real-Time Monitoring</h3>
              <p className="text-gray-400 leading-relaxed">24/7 monitoring with instant alerts when threats are detected.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Template Marketplace</h3>
              <p className="text-gray-400 leading-relaxed">Browse and deploy from curated, audited security trap templates.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Community Driven</h3>
              <p className="text-gray-400 leading-relaxed">Contribute templates, share strategies, and earn rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Connection Test Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Backend Connection Status</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Test the connection between your frontend and backend to ensure everything is working properly.
          </p>
          <BackendConnectionTest />
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Support Development</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Help us continue building One Click on Hoodi testnet. Your donations support development, 
            testing, and future mainnet features.
          </p>
          
          {/* Donation and Social Media Row */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Donation Box */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-orange-400">Donate</h3>
              <p className="text-gray-400 mb-6 text-base leading-relaxed">Send any amount to support One Click development</p>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
                <p className="text-sm text-gray-400 mb-3 font-medium">Wallet Address:</p>
                <p className="text-sm font-mono text-orange-400 break-all leading-relaxed">0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7</p>
              </div>
              <button 
                className="btn-primary text-sm px-6 py-3"
                onClick={copyAddress}
              >
                📋 Copy Address
              </button>
            </div>

            {/* Social Media Box */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-orange-400">Connect With Us</h3>
              <p className="text-gray-400 mb-6 text-base leading-relaxed">Follow us for updates, news, and community updates</p>
              <div className="space-y-4">
                <a 
                  href="https://x.com/Love_Light_11" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <span className="mr-2">🐦</span>
                  Follow on X (Twitter)
                </a>
                <div className="text-center">
                  <p className="text-sm text-gray-400">More social platforms coming soon!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4 glow-orange">🚀 Get Started Now</button>
            <button className="btn-secondary text-lg px-8 py-4">📖 Read Documentation</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <span className="text-xl font-bold gradient-text">One Click</span>
              </div>
              <p className="text-gray-400 leading-relaxed">Democratizing access to advanced DeFi security tools.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a className="hover:text-white transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-white transition-colors" href="#">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a className="hover:text-white transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Tutorials</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Community</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a className="hover:text-white transition-colors" href="#">Discord</a></li>
                <li><a className="hover:text-white transition-colors" href="#">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400">
            <p>© 2024 One Click Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
