// Header component with navigation and wallet connection

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectKitButton } from 'connectkit';
import { useUser, useIsConnected, useChainId } from '@/lib/store';
import { getNetworkInfo, formatAddress } from '@/lib/utils';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  CubeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Marketplace', href: '/marketplace', icon: CubeIcon },
  { name: 'Deploy', href: '/deploy', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useUser();
  const isConnected = useIsConnected();
  const chainId = useChainId();

  const networkInfo = chainId ? getNetworkInfo(chainId) : null;

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">Drosera</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-semibold leading-6 rounded-md transition-colors ${
                  isActive
                    ? 'text-purple-400 bg-purple-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Wallet connection and user info */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isConnected && user && (
            <div className="flex items-center space-x-3">
              {/* Network indicator */}
              {networkInfo && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-md">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">{networkInfo.name}</span>
                </div>
              )}
              
              {/* User address */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-md">
                <span className="text-sm text-gray-300">
                  {formatAddress(user.walletAddress)}
                </span>
              </div>
            </div>
          )}
          
          <ConnectKitButton />
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <ShieldCheckIcon className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold text-white">Drosera</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-700">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 text-base font-semibold leading-7 rounded-md transition-colors ${
                          isActive
                            ? 'text-purple-400 bg-purple-400/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="py-6">
                  {isConnected && user && (
                    <div className="space-y-3">
                      {/* Network indicator */}
                      {networkInfo && (
                        <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-md">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">{networkInfo.name}</span>
                        </div>
                      )}
                      
                      {/* User address */}
                      <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-md">
                        <span className="text-sm text-gray-300">
                          {formatAddress(user.walletAddress)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <ConnectKitButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}