// Hoodi Testnet Configuration
// This is the only blockchain network currently supported

export const HOODI_CONFIG = {
  // Network Configuration
  CHAIN_ID: 560048,
  NAME: 'Hoodi Testnet',
  RPC_URL: process.env.HOODI_RPC_URL || 'https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ',
  BLOCK_EXPLORER: 'https://hoodi.etherscan.io',
  NATIVE_CURRENCY: 'ETH',
  
  // Gas Configuration
  DEFAULT_GAS_LIMIT: 3000000, // 3M gas
  MAX_GAS_LIMIT: 5000000,     // 5M gas
  GAS_PRICE_MULTIPLIER: 1.1,  // 10% buffer
  
  // Contract Configuration
  CONTRACT_VERIFICATION: true,
  OPTIMIZER_ENABLED: true,
  OPTIMIZER_RUNS: 200,
  
  // Deployment Configuration
  CONFIRMATION_BLOCKS: 1,     // Hoodi testnet is fast
  TIMEOUT_SECONDS: 300,       // 5 minutes
  
  // Security Configuration
  MAX_CONTRACT_SIZE: 24576,   // 24KB limit
  MAX_CONSTRUCTOR_ARGS: 10,   // Reasonable limit
  
  // Monitoring Configuration
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const HOODI_ERRORS = {
  UNSUPPORTED_NETWORK: 'Only Hoodi testnet (560048) is supported',
  INVALID_RPC_URL: 'Invalid Hoodi RPC URL',
  CONNECTION_FAILED: 'Failed to connect to Hoodi testnet',
  DEPLOYMENT_FAILED: 'Contract deployment to Hoodi testnet failed',
  INSUFFICIENT_GAS: 'Insufficient gas for deployment on Hoodi testnet',
  INVALID_CONTRACT: 'Invalid contract for Hoodi testnet deployment',
} as const;

export const HOODI_MESSAGES = {
  INITIALIZING: 'Initializing Hoodi testnet connection...',
  CONNECTED: 'Connected to Hoodi testnet successfully',
  DEPLOYING: 'Deploying contract to Hoodi testnet...',
  DEPLOYED: 'Contract deployed to Hoodi testnet successfully',
  ANALYZING: 'Analyzing contract on Hoodi testnet...',
  ANALYSIS_COMPLETE: 'Contract analysis on Hoodi testnet completed',
} as const;

// Validate Hoodi configuration
export function validateHoodiConfig(): boolean {
  if (!HOODI_CONFIG.RPC_URL || HOODI_CONFIG.RPC_URL === '') {
    throw new Error('HOODI_RPC_URL is required');
  }
  
  if (HOODI_CONFIG.CHAIN_ID !== 560048) {
    throw new Error('HOODI_CHAIN_ID must be 560048');
  }
  
  if (!HOODI_CONFIG.RPC_URL.includes('alchemy.com')) {
    console.warn('⚠️ Warning: Using non-Alchemy RPC URL for Hoodi testnet');
  }
  
  return true;
}

// Get Hoodi network info for display
export function getHoodiNetworkInfo() {
  return {
    chainId: HOODI_CONFIG.CHAIN_ID,
    name: HOODI_CONFIG.NAME,
    rpcUrl: HOODI_CONFIG.RPC_URL,
    blockExplorer: HOODI_CONFIG.BLOCK_EXPLORER,
    nativeCurrency: HOODI_CONFIG.NATIVE_CURRENCY,
    isTestnet: true,
    isSupported: true,
  };
}