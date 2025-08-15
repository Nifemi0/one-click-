import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing - One Click</title>
        <meta name="description" content="Security trap pricing plans" />
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
              <Link href="/deploy">
                <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
                  Deploy
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Pricing Content */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
              <p className="text-xl text-gray-300">Choose the plan that fits your security needs</p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="p-8 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5 hover:border-purple-500/40 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">Basic</h3>
                  <div className="text-4xl font-bold text-white mb-2">$0.05</div>
                  <div className="text-gray-400">per template</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Up to 5 deployments/month
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Basic templates
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Email support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Community forum access
                  </li>
                </ul>

                <Link href="/deploy">
                  <button className="w-full p-3 border border-purple-500/30 text-purple-300 font-medium rounded-lg hover:bg-purple-500/10 transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-8 rounded-xl border-2 border-purple-500 backdrop-blur-sm bg-white/10 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white mb-2">$0.08</div>
                  <div className="text-gray-400">per template</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Up to 25 deployments/month
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Advanced templates
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom configurations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Analytics dashboard
                  </li>
                </ul>

                <Link href="/deploy">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="p-8 rounded-xl border border-purple-500/20 backdrop-blur-sm bg-white/5 hover:border-purple-500/40 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-white mb-2">$0.12</div>
                  <div className="text-gray-400">per template</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Unlimited deployments
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Premium templates
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    24/7 dedicated support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom development
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    SLA guarantees
                  </li>
                </ul>

                <Link href="/deploy">
                  <button className="w-full p-3 border border-purple-500/30 text-purple-300 font-medium rounded-lg hover:bg-purple-500/10 transition-all duration-200">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Need a Custom Solution?</h2>
              <p className="text-gray-300 mb-6">
                We offer custom security trap development for enterprise clients
              </p>
              <button className="px-8 py-3 border border-purple-500/30 text-purple-300 font-medium rounded-lg hover:bg-purple-500/10 transition-all duration-200">
                Get in Touch
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}