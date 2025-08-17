"use client";

import { createContext, useContext, useState } from 'react';

// Wallet context
interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const connect = async () => {
    try {
      // Check if MetaMask is available
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          
          // Get chain ID
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainId, 16));
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnect();
            } else {
              setAddress(accounts[0]);
            }
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId: string) => {
            setChainId(parseInt(chainId, 16));
          });
        }
      } else {
        alert('Please install MetaMask to use this app!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
  };

  const value: WalletContextType = {
    isConnected,
    address,
    chainId,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Add ethereum to window type
declare global {
  interface Window {
    ethereum?: any;
  }
}
