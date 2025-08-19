'use client';

import { useWallet } from '../providers/WalletProvider';
import { useTheme } from '../providers/ThemeProvider';
import { ThemeToggle } from '../components/ThemeToggle';
import BackendConnectionTest from '@/components/BackendConnectionTest';

export default function Home() {
  const { isConnected, address, connect, walletError } = useWallet();
  const { resolvedTheme } = useTheme();

  const copyAddress = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7');
    }
  };

  const handleConnectWallet = () => {
    if (!isConnected) {
      connect();
    }
  };

  const handleLaunchApp = () => {
    if (isConnected) {
      window.location.href = '/app';
    } else {
      connect();
    }
  };

  const handleDeployTrap = () => {
    if (isConnected) {
      window.location.href = '/deploy';
    } else {
      connect();
    }
  };

  const handleViewTemplates = () => {
    if (isConnected) {
      window.location.href = '/marketplace';
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Drosera
              </span>
              <br />
              <span className="text-white">Security Traps</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Professional-grade DeFi security infrastructure. Deploy intelligent security traps 
              with one-click automation to protect your protocols from attacks.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button 
                onClick={handleLaunchApp}
                className="rounded-md bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 hover:scale-105"
              >
                {isConnected ? 'Launch App' : 'Get Started'}
              </button>
              <button 
                onClick={handleViewTemplates}
                className="text-lg font-semibold leading-6 text-white border-2 border-white/20 px-6 py-3 rounded-md hover:bg-white/10 transition-all duration-200"
              >
                View Templates
              </button>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200/20 [mask-image:radial-gradient(64rem_64rem_at_center,white,transparent)]">
            <defs>
              <pattern id="hero-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-800/20">
              <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" strokeWidth="0" />
            </svg>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-pattern)" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-orange-600 dark:text-orange-400">
              Advanced Security
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to protect your DeFi protocols
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              From honeypot traps to MEV protection, our comprehensive security suite 
              provides automated threat detection and response.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  One-Click Deployment
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Deploy professional security traps in minutes with our intuitive interface. 
                    No coding required - just select, configure, and deploy.
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  AI-Powered Detection
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Advanced threat detection using machine learning algorithms. 
                    Real-time monitoring and automated response to security threats.
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Multi-Chain Support
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Protect your assets across multiple blockchains. 
                    Currently supporting Hoodi testnet with plans for mainnet expansion.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to secure your DeFi protocols?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-orange-100">
              Join the future of DeFi security with Drosera. Deploy your first trap today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button 
                onClick={handleDeployTrap}
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-orange-600 shadow-lg hover:bg-gray-100 transition-all duration-200"
              >
                Deploy Security Trap
              </button>
              <button 
                onClick={handleViewTemplates}
                className="text-lg font-semibold leading-6 text-white border-2 border-white/30 px-6 py-3 rounded-md hover:bg-white/10 transition-all duration-200"
              >
                Browse Templates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Connection Test (Hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="py-8">
          <BackendConnectionTest />
        </div>
      )}
    </div>
  );
}
