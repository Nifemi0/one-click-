"use client";

import { createContext, useContext, useState, useEffect } from 'react';

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
  const [isConnected, setIsConnected] = useState(() => {
    // Check if wallet was previously connected
    if (typeof window !== 'undefined') {
      return localStorage.getItem('walletConnected') === 'true';
    }
    return false;
  });
  
  const [address, setAddress] = useState<string | null>(() => {
    // Check if address was previously stored
    if (typeof window !== 'undefined') {
      return localStorage.getItem('walletAddress');
    }
    return null;
  });
  
  const [chainId, setChainId] = useState<number | null>(() => {
    // Check if chainId was previously stored
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('walletChainId');
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  // Check wallet connection status on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined' && isConnected && address) {
        try {
          // Verify the account is still accessible
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length === 0 || accounts[0] !== address) {
            // Account no longer accessible, disconnect
            disconnect();
          } else {
            // Get current chain ID
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            const currentChainIdNumber = parseInt(currentChainId, 16);
            setChainId(currentChainIdNumber);
            localStorage.setItem('walletChainId', currentChainIdNumber.toString());
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          disconnect();
        }
      }
    };

    checkWalletConnection();
  }, [isConnected, address]);

  const connect = async () => {
    try {
      // Check if MetaMask is available
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const accountAddress = accounts[0];
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const chainIdNumber = parseInt(chainId, 16);
          
          setAddress(accountAddress);
          setIsConnected(true);
          setChainId(chainIdNumber);
          
          // Save to localStorage
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', accountAddress);
          localStorage.setItem('walletChainId', chainIdNumber.toString());
          
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
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletChainId');
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
