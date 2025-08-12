// Application constants and configuration

export const SUPPORTED_CHAINS = {
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      droseraFactory: process.env.NEXT_PUBLIC_ETHEREUM_DROSERA_FACTORY || '',
      droseraRegistry: process.env.NEXT_PUBLIC_ETHEREUM_DROSERA_REGISTRY || '',
    },
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    contracts: {
      droseraFactory: process.env.NEXT_PUBLIC_POLYGON_DROSERA_FACTORY || '',
      droseraRegistry: process.env.NEXT_PUBLIC_POLYGON_DROSERA_REGISTRY || '',
    },
  },
  ARBITRUM: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      droseraFactory: process.env.NEXT_PUBLIC_ARBITRUM_DROSERA_FACTORY || '',
      droseraRegistry: process.env.NEXT_PUBLIC_ARBITRUM_DROSERA_REGISTRY || '',
    },
  },
  BASE: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      droseraFactory: process.env.NEXT_PUBLIC_BASE_DROSERA_FACTORY || '',
      droseraRegistry: process.env.NEXT_PUBLIC_BASE_DROSERA_REGISTRY || '',
    },
  },
} as const;

export const TRAP_CATEGORIES = {
  RUGPULL: 'rugpull',
  GOVERNANCE: 'governance',
  MINTING: 'minting',
  ORACLE: 'oracle',
  FLASHLOAN: 'flashloan',
  REENTRANCY: 'reentrancy',
  ACCESS_CONTROL: 'access-control',
} as const;

export const TRAP_COMPLEXITIES = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  AUTH: {
    CONNECT: '/api/auth/connect',
    PROFILE: '/api/user/profile',
    SETTINGS: '/api/user/settings',
  },
  TRAPS: {
    TEMPLATES: '/api/traps/templates',
    DEPLOY: '/api/traps/deploy',
    USER: '/api/traps/user',
    CONFIGURE: '/api/traps/configure',
    DELETE: '/api/traps/delete',
  },
  ANALYSIS: {
    CONTRACT: '/api/analyze/contract',
    RECOMMENDATIONS: '/api/analyze/recommendations',
  },
  ALERTS: {
    USER: '/api/alerts/user',
    WEBHOOK: '/api/alerts/webhook',
    ACKNOWLEDGE: '/api/alerts/acknowledge',
  },
  MARKETPLACE: {
    TEMPLATES: '/api/marketplace/templates',
    STATS: '/api/marketplace/stats',
  },
} as const;

export const DEPLOYMENT_STEPS = [
  {
    id: 'contract-analysis',
    title: 'Contract Analysis',
    description: 'Analyzing target contract for vulnerabilities',
  },
  {
    id: 'vulnerability-assessment',
    title: 'Vulnerability Assessment',
    description: 'Identifying security risks and threats',
  },
  {
    id: 'trap-selection',
    title: 'Trap Selection',
    description: 'Choosing appropriate security traps',
  },
  {
    id: 'configuration',
    title: 'Configuration',
    description: 'Customizing trap parameters',
  },
  {
    id: 'gas-estimation',
    title: 'Gas Estimation',
    description: 'Calculating deployment costs',
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description: 'Deploying security traps to blockchain',
  },
  {
    id: 'monitoring-setup',
    title: 'Monitoring Setup',
    description: 'Configuring real-time monitoring',
  },
] as const;

export const GAS_LIMITS = {
  LOW: 200000,
  MEDIUM: 500000,
  HIGH: 1000000,
  CUSTOM: 0,
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'drosera_user_preferences',
  WALLET_CONNECTION: 'drosera_wallet_connection',
  DEPLOYMENT_HISTORY: 'drosera_deployment_history',
  ALERT_SETTINGS: 'drosera_alert_settings',
} as const;

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for deployment',
  CONTRACT_NOT_FOUND: 'Contract not found on the specified network',
  DEPLOYMENT_FAILED: 'Trap deployment failed. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  INVALID_ADDRESS: 'Invalid contract address format',
  GAS_ESTIMATION_FAILED: 'Failed to estimate gas. Please try again',
} as const;

export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  TRAP_DEPLOYED: 'Security trap deployed successfully',
  CONFIGURATION_UPDATED: 'Trap configuration updated',
  ALERT_ACKNOWLEDGED: 'Alert acknowledged',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

export const DEFAULT_GAS_PRICE = '20000000000'; // 20 gwei
export const DEFAULT_GAS_LIMIT = 500000;
export const MAX_GAS_LIMIT = 5000000;
export const MIN_GAS_LIMIT = 100000;

export const REFRESH_INTERVALS = {
  BALANCE: 30000, // 30 seconds
  ALERTS: 10000, // 10 seconds
  TRAP_STATUS: 60000, // 1 minute
  MARKETPLACE: 300000, // 5 minutes
} as const;