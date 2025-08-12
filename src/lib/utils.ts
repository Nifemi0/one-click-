// Utility functions for the Drosera application

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format Ethereum address for display (0x1234...5678)
 */
export function formatAddress(address: string, start = 6, end = 4): string {
  if (!isValidAddress(address)) return 'Invalid Address';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format balance with appropriate decimals
 */
export function formatBalance(balance: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const whole = balance / divisor;
  const fraction = balance % divisor;
  
  if (fraction === 0n) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const trimmedFraction = fractionStr.replace(/0+$/, '');
  
  return `${whole}.${trimmedFraction}`;
}

/**
 * Format gas price from wei to gwei
 */
export function formatGasPrice(gasPrice: bigint): string {
  const gwei = Number(gasPrice) / 1e9;
  return `${gwei.toFixed(2)} gwei`;
}

/**
 * Format gas limit with appropriate units
 */
export function formatGasLimit(gasLimit: number): string {
  if (gasLimit >= 1000000) {
    return `${(gasLimit / 1000000).toFixed(2)}M`;
  } else if (gasLimit >= 1000) {
    return `${(gasLimit / 1000).toFixed(2)}K`;
  }
  return gasLimit.toString();
}

/**
 * Calculate estimated gas cost in ETH
 */
export function calculateGasCost(gasLimit: number, gasPrice: bigint): bigint {
  return BigInt(gasLimit) * gasPrice;
}

/**
 * Format gas cost for display
 */
export function formatGasCost(gasLimit: number, gasPrice: bigint, ethPrice?: number): string {
  const cost = calculateGasCost(gasLimit, gasPrice);
  const ethCost = Number(cost) / 1e18;
  
  if (ethPrice) {
    const usdCost = ethCost * ethPrice;
    return `$${usdCost.toFixed(4)} (${ethCost.toFixed(6)} ETH)`;
  }
  
  return `${ethCost.toFixed(6)} ETH`;
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum One',
    8453: 'Base',
    11155111: 'Sepolia',
    80001: 'Mumbai',
    421613: 'Arbitrum Goerli',
    84531: 'Base Goerli',
  };
  
  return networks[chainId] || `Chain ${chainId}`;
}

/**
 * Get block explorer URL for a given address and chain
 */
export function getBlockExplorerUrl(address: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    8453: 'https://basescan.org',
    11155111: 'https://sepolia.etherscan.io',
    80001: 'https://mumbai.polygonscan.com',
    421613: 'https://goerli.arbiscan.io',
    84531: 'https://goerli.basescan.org',
  };
  
  const baseUrl = explorers[chainId];
  if (!baseUrl) return '#';
  
  return `${baseUrl}/address/${address}`;
}

/**
 * Get transaction explorer URL
 */
export function getTransactionUrl(txHash: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    8453: 'https://basescan.org',
    11155111: 'https://sepolia.etherscan.io',
    80001: 'https://mumbai.polygonscan.com',
    421613: 'https://goerli.arbiscan.io',
    84531: 'https://goerli.basescan.org',
  };
  
  const baseUrl = explorers[chainId];
  if (!baseUrl) return '#';
  
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Check if two addresses are equal (case-insensitive)
 */
export function addressesEqual(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase();
}

/**
 * Parse error message from various error types
 */
export function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if the current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if the current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Safely access nested object properties
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

/**
 * Set nested object property value
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
}