// Frontend configuration
export const config = {
  // Backend API base URL
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://one-click-backend.onrender.com',
  
  // Frontend URL
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://oneclick1.netlify.app',
  
  // Network configuration
  defaultNetwork: 'hoodi', // BSC testnet
  
  // Gas estimation fallback values
  fallbackGasEstimates: {
    'Honeypot': 270000,
    'Monitoring': 360000,
    'Basic': 208000
  }
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

// API endpoints
export const apiEndpoints = {
  gasEstimate: '/api/gas/estimate',
  contractTypes: '/api/gas/contract-types',
  complexityLevels: '/api/gas/complexity-levels',
  contractTemplates: '/api/contracts/templates',
  basicTraps: '/api/basic-traps',
  enhancedAITrap: '/api/enhanced-ai-trap',
  marketplace: '/api/marketplace',
  droseraTraps: '/api/drosera-traps',
  droseraRegistry: '/api/drosera-registry',
  realContracts: '/api/real-contracts',
  dashboard: '/api/dashboard',
  auth: '/api/auth',
  analyze: '/api/analyze',
  alerts: '/api/alerts',
  traps: '/api/traps',
  rpcTest: '/api/rpc-test',
  oneclickTraps: '/api/oneclick-traps',
  oneclickRegistry: '/api/oneclick-registry'
};
