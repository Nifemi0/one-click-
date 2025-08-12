// Main layout component for the Drosera application

'use client';

import React from 'react';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/web3';
import { useStore } from '@/lib/store';
import Header from './Header';
import Footer from './Footer';
import NotificationToast from '../ui/NotificationToast';
import LoadingSpinner from '../ui/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isLoading = useStore((state) => state.ui.isLoading);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />
            
            <main className="flex-1">
              {isLoading && <LoadingSpinner />}
              {children}
            </main>
            
            <Footer />
            <NotificationToast />
          </div>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}