import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Deploy() {
  return (
    <>
      <Head>
        <title>Deploy - One Click</title>
        <meta name="description" content="Deploy security traps" />
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
              <Link href="/marketplace">
                <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
                  Marketplace
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

        {/* Deploy Content */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Deploy Security Trap</h1>
              <p className="text-gray-300">Choose a template and deploy with one click</p>
            </div>

            {/* Template Selection */}
            <div className="p-8 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
              <h2 className="text-2xl font-semibold text-white mb-6">Select Template</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 cursor-pointer">
                  <input type="radio" name="template" id="reentrancy" className="mr-4" defaultChecked />
                  <label htmlFor="reentrancy" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Reentrancy Guard</div>
                        <div className="text-sm text-gray-400">Protect against reentrancy attacks</div>
                      </div>
                      <span className="text-purple-400 font-medium">$0.05</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 cursor-pointer">
                  <input type="radio" name="template" id="access" className="mr-4" />
                  <label htmlFor="access" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Access Control</div>
                        <div className="text-sm text-gray-400">Role-based access control</div>
                      </div>
                      <span className="text-purple-400 font-medium">$0.08</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 cursor-pointer">
                  <input type="radio" name="template" id="flash" className="mr-4" />
                  <label htmlFor="flash" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Flash Loan Protection</div>
                        <div className="text-sm text-gray-400">Advanced attack protection</div>
                      </div>
                      <span className="text-purple-400 font-medium">$0.12</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Network Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Select Network</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 rounded-lg border border-purple-500/30 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200">
                    Ethereum
                  </button>
                  <button className="p-4 rounded-lg border border-purple-500/30 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200">
                    Polygon
                  </button>
                  <button className="p-4 rounded-lg border border-purple-500/30 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200">
                    BSC
                  </button>
                </div>
              </div>

              {/* Deploy Button */}
              <div className="text-center">
                <button className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg">
                  Deploy Now
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  Estimated gas cost: $15-25
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}