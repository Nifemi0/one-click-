import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - One Click</title>
        <meta name="description" content="Manage your security traps" />
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
              <Link href="/marketplace">
                <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
                  Marketplace
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

        {/* Dashboard Content */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">Welcome back! Here&apos;s an overview of your security traps.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
                <div className="text-3xl font-bold text-white mb-2">12</div>
                <div className="text-gray-300">Active Traps</div>
              </div>
              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
                <div className="text-3xl font-bold text-white mb-2">3</div>
                <div className="text-gray-300">Networks</div>
              </div>
              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
                <div className="text-3xl font-bold text-white mb-2">$45.67</div>
                <div className="text-gray-300">Total Spent</div>
              </div>
              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
                <div className="text-3xl font-bold text-white mb-2">24</div>
                <div className="text-gray-300">Alerts</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Deployments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <div className="text-white font-medium">Reentrancy Guard</div>
                      <div className="text-sm text-gray-400">Ethereum Mainnet</div>
                    </div>
                    <div className="text-sm text-green-400">✓ Active</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <div className="text-white font-medium">Access Control</div>
                      <div className="text-sm text-gray-400">Polygon</div>
                    </div>
                    <div className="text-sm text-green-400">✓ Active</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/deploy">
                    <button className="w-full p-3 text-left rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                      Deploy New Trap
                    </button>
                  </Link>
                  <Link href="/marketplace">
                    <button className="w-full p-3 text-left rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all duration-200">
                      Browse Templates
                    </button>
                  </Link>
                  <Link href="/pricing">
                    <button className="w-full p-3 text-left rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all duration-200">
                      View Pricing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}