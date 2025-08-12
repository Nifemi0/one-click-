// Web3 configuration with Wagmi v2 and ConnectKit

import { createConfig, configureChains } from 'wagmi';
import { mainnet, polygon, arbitrum, base, sepolia, mumbai, arbitrumGoerli, baseGoerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultConfig } from 'connectkit';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    arbitrum,
    base,
    sepolia,
    mumbai,
    arbitrumGoerli,
    baseGoerli,
  ],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
    }),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',
    }),
    publicProvider(),
  ]
);

// Create wagmi config
export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    
    // Required App Info
    appName: 'Drosera Security Traps',
    appDescription: 'One-click deployment of security traps for DeFi protocols',
    appUrl: 'https://drosera.xyz',
    appIcon: 'https://drosera.xyz/logo.png',
    
    // Optional chains
    chains,
    
    // Optional wallet connectors
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    
    // Optional metadata
    metadata: {
      name: 'Drosera Security Traps',
      description: 'Protect your DeFi investments with intelligent security traps',
      url: 'https://drosera.xyz',
      icons: ['https://drosera.xyz/logo.png'],
    },
  })
);

// Export chains for use in components
export { chains };

// Network configuration mapping
export const NETWORK_CONFIG = {
  [mainnet.id]: {
    name: 'Ethereum',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/',
  },
  [polygon.id]: {
    name: 'Polygon',
    symbol: 'MATIC',
    blockExplorer: 'https://polygonscan.com',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
  },
  [arbitrum.id]: {
    name: 'Arbitrum One',
    symbol: 'ETH',
    blockExplorer: 'https://arbiscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  },
  [base.id]: {
    name: 'Base',
    symbol: 'ETH',
    blockExplorer: 'https://basescan.org',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  },
  [sepolia.id]: {
    name: 'Sepolia',
    symbol: 'ETH',
    blockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/',
  },
  [mumbai.id]: {
    name: 'Mumbai',
    symbol: 'MATIC',
    blockExplorer: 'https://mumbai.polygonscan.com',
    rpcUrl: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
  },
  [arbitrumGoerli.id]: {
    name: 'Arbitrum Goerli',
    symbol: 'ETH',
    blockExplorer: 'https://goerli.arbiscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL || 'https://goerli-rollup.arbitrum.io/rpc',
  },
  [baseGoerli.id]: {
    name: 'Base Goerli',
    symbol: 'ETH',
    blockExplorer: 'https://goerli.basescan.org',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_GOERLI_RPC_URL || 'https://goerli.base.org',
  },
} as const;

// Get network info by chain ID
export function getNetworkInfo(chainId: number) {
  return NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG] || {
    name: `Chain ${chainId}`,
    symbol: 'ETH',
    blockExplorer: '#',
    rpcUrl: '',
  };
}

// Check if chain is supported
export function isSupportedChain(chainId: number): boolean {
  return chainId in NETWORK_CONFIG;
}

// Get supported chain IDs
export function getSupportedChainIds(): number[] {
  return Object.keys(NETWORK_CONFIG).map(Number);
}

// Get mainnet chains only
export function getMainnetChains() {
  return [mainnet, polygon, arbitrum, base];
}

// Get testnet chains only
export function getTestnetChains() {
  return [sepolia, mumbai, arbitrumGoerli, baseGoerli];
}

// Get chain by ID
export function getChainById(chainId: number) {
  return chains.find(chain => chain.id === chainId);
}

// Format chain display name
export function formatChainName(chainId: number): string {
  const network = getNetworkInfo(chainId);
  return network.name;
}

// Get native currency symbol for chain
export function getNativeCurrencySymbol(chainId: number): string {
  const network = getNetworkInfo(chainId);
  return network.symbol;
}

// Get block explorer URL for address
export function getBlockExplorerUrl(address: string, chainId: number): string {
  const network = getNetworkInfo(chainId);
  return `${network.blockExplorer}/address/${address}`;
}

// Get transaction explorer URL
export function getTransactionUrl(txHash: string, chainId: number): string {
  const network = getNetworkInfo(chainId);
  return `${network.blockExplorer}/tx/${txHash}`;
}

// Check if address is valid for the given chain
export function isValidAddressForChain(address: string, chainId: number): boolean {
  // Basic Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false;
  }
  
  // Chain-specific validation can be added here
  // For now, all supported chains use the same address format
  
  return true;
}

// Get recommended gas settings for chain
export function getRecommendedGasSettings(chainId: number) {
  const baseSettings = {
    gasLimit: 500000,
    maxFeePerGas: '20000000000', // 20 gwei
    maxPriorityFeePerGas: '2000000000', // 2 gwei
  };

  // Chain-specific adjustments
  switch (chainId) {
    case polygon.id:
      return {
        ...baseSettings,
        maxFeePerGas: '30000000000', // 30 gwei
        maxPriorityFeePerGas: '3000000000', // 3 gwei
      };
    case arbitrum.id:
      return {
        ...baseSettings,
        gasLimit: 1000000, // Arbitrum typically needs higher gas limit
        maxFeePerGas: '100000000', // 0.1 gwei
        maxPriorityFeePerGas: '10000000', // 0.01 gwei
      };
    case base.id:
      return {
        ...baseSettings,
        maxFeePerGas: '1000000000', // 1 gwei
        maxPriorityFeePerGas: '100000000', // 0.1 gwei
      };
    default:
      return baseSettings;
  }
}

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
export const FEATURES = {
  MULTI_CHAIN: true,
  GAS_OPTIMIZATION: true,
  REAL_TIME_MONITORING: true,
  AI_ANALYSIS: true,
  COMMUNITY_TEMPLATES: true,
} as const;