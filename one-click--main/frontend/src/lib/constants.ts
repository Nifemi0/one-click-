// Application constants and configuration

export const SUPPORTED_CHAINS = {
  HOODI_TESTNET: {
    chainId: 560048,
    name: 'Hoodi Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_HOODI_RPC_URL || 'https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ',
    blockExplorer: process.env.NEXT_PUBLIC_HOODI_BLOCK_EXPLORER || 'https://hoodi.etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      droseraFactory: process.env.NEXT_PUBLIC_HOODI_DROSERA_FACTORY || '',
      droseraRegistry: process.env.NEXT_PUBLIC_HOODI_DROSERA_REGISTRY || '',
    },
  },
} as const;

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.HOODI_TESTNET;

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
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://one-click-c308.onrender.com',
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
    HEALTH: '/api/auth/health',
  },
  TRAPS: {
    TEMPLATES: '/api/traps/templates',
    DEPLOY: '/api/traps/deploy',
    USER: '/api/traps/user',
    CONFIGURE: '/api/traps/configure',
    UPDATE: '/api/traps/update',
    DELETE: '/api/traps/delete',
    RATE: '/api/traps/rate',
    RATINGS: '/api/traps/ratings',
  },
  BASIC_TRAPS: {
    TEMPLATES: '/api/basic-traps/templates',
    DEPLOY: '/api/basic-traps/deploy',
    HEALTH: '/api/basic-traps/health',
  },
  ENHANCED_AI: {
    DEPLOY: '/api/enhanced-ai-trap/deploy',
    STATUS: '/api/enhanced-ai-trap/status',
    CANCEL: '/api/enhanced-ai-trap/cancel',
  },
  MARKETPLACE: {
    CATEGORIES: '/api/marketplace/categories',
    COMPLEXITIES: '/api/marketplace/complexities',
    STATS: '/api/marketplace/stats',
    FEATURED: '/api/marketplace/featured',
    TRENDING: '/api/marketplace/trending',
    SEARCH: '/api/marketplace/search',
  },
  ANALYSIS: {
    CONTRACT: '/api/analyze/contract',
    HISTORY: '/api/analyze/history',
    COMPARE: '/api/analyze/compare',
    STATS: '/api/analyze/stats',
    NETWORKS: '/api/analyze/networks',
    FEATURES: '/api/analyze/features',
    HEALTH: '/api/analyze/health',
  },
  ALERTS: {
    USER: '/api/alerts/user',
    CREATE: '/api/alerts/create',
    UPDATE: '/api/alerts/update',
    DELETE: '/api/alerts/delete',
    MARK_READ: '/api/alerts/mark-read',
    MARK_ALL_READ: '/api/alerts/mark-all-read',
    CUSTOM: '/api/alerts/custom',
    TEST: '/api/alerts/test-notification',
  },
  RPC: {
    TEST: '/api/rpc-test/test',
    STATUS: '/api/rpc-test/status',
    FALLBACK: '/api/rpc-test/test-fallback',
  },
  HEALTH: '/health',
} as const;

export const APP_CONFIG = {
  NAME: 'One Click Security Traps',
  VERSION: '1.0.0',
  DESCRIPTION: 'One-click deployment of security traps on Hoodi testnet',
  SUPPORT_EMAIL: 'support@oneclick.com',
  DOCS_URL: 'https://docs.oneclick.com',
} as const;

export const FEATURE_FLAGS = {
  BASIC_TRAPS: process.env.NEXT_PUBLIC_ENABLE_BASIC_TRAPS === 'true',
  ENHANCED_AI: process.env.NEXT_PUBLIC_ENABLE_ENHANCED_AI === 'true',
  MARKETPLACE: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE === 'true',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
} as const;