import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Marketplace() {
  return (
    <>
      <Head>
        <title>Marketplace - One Click</title>
        <meta name="description" content="Browse security trap templates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">1</span>
              <span className="text-xl font-semibold text-white">One Click</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
                  Dashboard
                </button>
              </Link>
              <Link href="/deploy">
                <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
                  Deploy
                </button>
              </Link>
              <Link href="/pricing">
                <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
                  Pricing
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Marketplace Content */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
              <p className="text-gray-300">Browse and deploy security trap templates</p>
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5 hover:border-purple-500/40 transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Reentrancy Guard</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Protect against reentrancy attacks with this battle-tested guard.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 font-medium">$0.05</span>
                    <span className="text-sm text-gray-400">Beginner</span>
                  </div>
                </div>
                <Link href="/deploy">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    Deploy Now
                  </button>
                </Link>
              </div>

              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5 hover:border-purple-500/40 transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Access Control</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Role-based access control for secure contract management.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 font-medium">$0.08</span>
                    <span className="text-sm text-gray-400">Intermediate</span>
                  </div>
                </div>
                <Link href="/deploy">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    Deploy Now
                  </button>
                </Link>
              </div>

              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5 hover:border-purple-500/40 transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Flash Loan Protection</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Advanced protection against flash loan attacks and exploits.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 font-medium">$0.12</span>
                    <span className="text-sm text-gray-400">Advanced</span>
                  </div>
                </div>
                <Link href="/deploy">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    Deploy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}