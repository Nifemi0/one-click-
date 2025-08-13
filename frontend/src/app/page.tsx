'use client';

export default function Home() {
  const copyAddress = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/30 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
                One Click
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-12">
              <a className="text-gray-300 hover:text-white transition-all duration-300 font-medium" href="#features">Features</a>
              <a className="text-gray-300 hover:text-white transition-all duration-300 font-medium" href="#security">Security</a>
              <a className="text-gray-300 hover:text-white transition-all duration-300 font-medium" href="#marketplace">Marketplace</a>
              <a className="text-gray-300 hover:text-white transition-all duration-300 font-medium" href="#about">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium">
                Connect Wallet
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5">
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-8">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm text-gray-300">Currently on Hoodi Testnet</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-white">Secure Your DeFi</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                With One Click
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Deploy sophisticated security traps on Hoodi testnet with AI-powered analysis. 
              Protect your assets with enterprise-grade security made simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-3xl hover:shadow-orange-500/30 transform hover:-translate-y-1">
                <span className="flex items-center">
                  🚀 Deploy Security Trap
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="px-10 py-5 border-2 border-gray-700 text-gray-300 hover:text-white hover:border-orange-500 transition-all duration-300 font-semibold text-lg rounded-2xl hover:bg-gray-900/50">
                📚 View Templates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">Hoodi Testnet Security</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Secure your testnet assets while we prepare for mainnet deployment
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                <span className="text-4xl font-bold text-orange-500">1</span>
              </div>
              <div className="text-gray-300 font-medium">Testnet</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                <span className="text-4xl font-bold text-green-500">99.9%</span>
              </div>
              <div className="text-gray-300 font-medium">Success Rate</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                <span className="text-4xl font-bold text-blue-500">24/7</span>
              </div>
              <div className="text-gray-300 font-medium">Monitoring</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                <span className="text-4xl font-bold text-purple-500">Test</span>
              </div>
              <div className="text-gray-300 font-medium">Environment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white">Why Choose One Click?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced security technology wrapped in a simple, intuitive interface
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="group">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">One-Click Deployment</h3>
                <p className="text-gray-400 leading-relaxed">
                  Deploy sophisticated security traps with a single click. No coding required.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Intelligent contract analysis that identifies vulnerabilities before they become threats.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                  <span className="text-3xl">🧪</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Testnet Ready</h3>
                <p className="text-gray-400 leading-relaxed">
                  Perfect for testing security strategies on Hoodi testnet before mainnet deployment.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Real-Time Monitoring</h3>
                <p className="text-gray-400 leading-relaxed">
                  24/7 monitoring with instant alerts when threats are detected.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-pink-500/30 group-hover:to-pink-600/30 transition-all duration-300">
                  <span className="text-3xl">🏪</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Template Marketplace</h3>
                <p className="text-gray-400 leading-relaxed">
                  Browse and deploy from curated, audited security trap templates.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-indigo-500/30 group-hover:to-indigo-600/30 transition-all duration-300">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Community Driven</h3>
                <p className="text-gray-400 leading-relaxed">
                  Contribute templates, share strategies, and earn rewards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white">Support Development</h2>
          <p className="text-xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed">
            Help us continue building One Click on Hoodi testnet. Your donations support development, 
            testing, and future mainnet features.
          </p>
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/50 rounded-3xl p-12 mb-12 backdrop-blur-xl">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Donate
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Send any amount to support One Click development
            </p>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-400 mb-3 font-medium">Wallet Address:</p>
              <p className="text-base font-mono text-orange-400 break-all leading-relaxed">
                0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7
              </p>
            </div>
            <button 
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
              onClick={copyAddress}
            >
              <span className="flex items-center justify-center">
                📋 Copy Address
                <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-3xl hover:shadow-orange-500/30 transform hover:-translate-y-1">
              <span className="flex items-center">
                🚀 Get Started Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="px-10 py-5 border-2 border-gray-700 text-gray-300 hover:text-white hover:border-orange-500 transition-all duration-300 font-semibold text-lg rounded-2xl hover:bg-gray-900/50">
              📖 Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/30 bg-gray-900/50 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
                  One Click
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Democratizing access to advanced DeFi security tools.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xl mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Features</a></li>
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Pricing</a></li>
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xl mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Documentation</a></li>
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Tutorials</a></li>
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xl mb-6">Community</h4>
              <ul className="space-y-4">
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Discord</a></li>
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">Twitter</a></li>
                <li><a className="text-gray-400 hover:text-white transition-all duration-300 font-medium" href="#">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800/30 pt-12 text-center">
            <p className="text-gray-400 text-lg">© 2024 One Click Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
