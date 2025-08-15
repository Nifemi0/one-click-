import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>One Click - Security Trap Platform</title>
        <meta name="description" content="Deploy and manage security traps with one click" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">1</span>
              <span className="text-xl font-semibold text-white">One Click</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Deploy Security Traps
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                With One Click
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Protect your smart contracts with battle-tested security traps. 
              Deploy, monitor, and manage with unprecedented ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Launch App
                </button>
              </Link>
              <button className="px-8 py-4 border border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:bg-purple-500/10 transition-all duration-200 backdrop-blur-sm">
                Connect Wallet
              </button>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">
              Why Choose One Click?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                <p className="text-gray-300">
                  Deploy security traps in seconds, not hours. Our optimized templates get you protected immediately.
                </p>
              </div>
              
              <div className="group p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Battle Tested</h3>
                <p className="text-gray-300">
                  Every trap template has been audited and tested against real-world attack vectors.
                </p>
              </div>
              
              <div className="group p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real-time Monitoring</h3>
                <p className="text-gray-300">
                  Track deployment status, gas costs, and security events in real-time across all networks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Secure Your Contracts?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who trust One Click for their security needs.
            </p>
            <Link href="/dashboard">
              <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg">
                Get Started Now
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}