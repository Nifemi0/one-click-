'use client';

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
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Secure Your DeFi with</span>
              <br />
              <span className="gradient-text">One Click</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Deploy sophisticated security traps on Hoodi testnet with AI-powered analysis. Protect your assets with enterprise-grade security made simple.
            </p>
            <p className="text-lg text-orange-400 font-medium">Currently supporting Hoodi testnet for testing and development</p>
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
            <h2 className="text-3xl font-bold mb-4 text-white">Hoodi Testnet Security</h2>
            <p className="text-lg text-orange-400 font-medium mb-8">Secure your testnet assets while we prepare for mainnet</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">1</div>
              <div className="text-gray-300">Testnet</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">99.9%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-300">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">Test</div>
              <div className="text-gray-300">Environment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose One Click?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Advanced security technology wrapped in a simple, intuitive interface</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">One-Click Deployment</h3>
              <p className="text-gray-400">Deploy sophisticated security traps with a single click. No coding required.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-400">Intelligent contract analysis that identifies vulnerabilities before they become threats.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Testnet Ready</h3>
              <p className="text-gray-400">Perfect for testing security strategies on Hoodi testnet before mainnet deployment.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Monitoring</h3>
              <p className="text-gray-400">24/7 monitoring with instant alerts when threats are detected.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Template Marketplace</h3>
              <p className="text-gray-400">Browse and deploy from curated, audited security trap templates.</p>
            </div>
            <div className="card group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-400">Contribute templates, share strategies, and earn rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Support Development</h2>
          <p className="text-xl text-gray-300 mb-8">
            Help us continue building One Click on Hoodi testnet. Your donations support development, testing, and future mainnet features.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-orange-400">Donate</h3>
            <p className="text-gray-400 mb-4 text-sm">Send any amount to support One Click development</p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-400 mb-2">Wallet Address:</p>
              <p className="text-sm font-mono text-orange-400 break-all">0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7</p>
            </div>
            <button 
              className="btn-primary text-sm px-6 py-3"
              onClick={copyAddress}
            >
              📋 Copy Address
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4 glow-orange">🚀 Get Started Now</button>
            <button className="btn-outline text-lg px-8 py-4">📖 Read Documentation</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <span className="text-xl font-bold gradient-text">One Click</span>
              </div>
              <p className="text-gray-400">Democratizing access to advanced DeFi security tools.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a className="hover:text-white transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-white transition-colors" href="#">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a className="hover:text-white transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Tutorials</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a className="hover:text-white transition-colors" href="#">Discord</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Twitter</a></li>
                <li><a className="hover:text-white transition-colors" href="#">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 One Click Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
