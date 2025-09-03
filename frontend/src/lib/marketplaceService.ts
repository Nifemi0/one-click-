import { MarketplaceItem, MarketplaceFilters } from '../types/marketplace';

// Sample marketplace data
export const sampleMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'basic-honeypot',
    name: 'BasicHoneypot',
    description: 'Simple honeypot contract for basic attack detection',
    category: 'Honeypot',
    difficulty: 'Basic',
    securityLevel: 'Medium',
    price: '0.02',
    priceInEth: 0.02,
    rating: 4.5,
    reviewCount: 23,
    downloads: 156,
    tags: ['Honeypot', 'Beginner', 'Basic', 'Detection'],
    lastUpdated: '1 week ago',
    author: 'OneClick Security',
    features: ['Basic Attack Detection', 'Fund Capture', 'Simple Monitoring'],
    deploymentTime: '2-3 minutes',
    preview: 'Basic honeypot for simple attack detection',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract BasicHoneypot is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'advanced-honeypot',
    name: 'AdvancedHoneypot',
    description: 'Advanced honeypot with intelligent attack pattern recognition',
    category: 'Honeypot',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.05',
    priceInEth: 0.05,
    rating: 4.8,
    reviewCount: 45,
    downloads: 289,
    tags: ['Honeypot', 'Advanced', 'Attack Analysis', 'Pattern Detection'],
    lastUpdated: '2 days ago',
    author: 'OneClick Security',
    features: ['Fund Capture', 'Attack Pattern Analysis', 'Advanced Monitoring', 'Automated Response'],
    deploymentTime: '3-4 minutes',
    preview: 'Advanced honeypot with intelligent attack pattern recognition',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract AdvancedHoneypot is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'oneclick-registry',
    name: 'OneClickRegistry',
    description: 'Central registry for managing and tracking all deployed security traps',
    category: 'Registry',
    difficulty: 'Intermediate',
    securityLevel: 'High',
    price: '0.06',
    priceInEth: 0.06,
    rating: 4.8,
    downloads: 2341,
    lastUpdated: '2024-01-15',
    tags: ['registry', 'monitoring', 'management', 'enterprise'],
    author: 'OneClick Security',
    features: ['Centralized tracking', 'Performance analytics', 'Security monitoring', 'Multi-chain support'],
    deploymentTime: '2-3 minutes',
    preview: 'Central registry for managing deployed security traps',
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OneClickRegistry is Ownable {
  // Real compiled contract code
}`
  },
  {
    id: 'flash-loan-protection',
    name: 'FlashLoanProtection',
    description: 'Real-time protection against flash loan attacks with instant blocking',
    category: 'Protection',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.10',
    priceInEth: 0.10,
    rating: 4.9,
    reviewCount: 56,
    downloads: 312,
    tags: ['Flash Loan', 'Advanced', 'Protection', 'Real-time'],
    lastUpdated: '1 week ago',
    author: 'OneClick Security',
    features: ['Flash Loan Detection', 'Instant Blocking', 'Real-time Monitoring', 'Attack Prevention'],
    deploymentTime: '3-4 minutes',
    preview: 'Real-time flash loan attack protection',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract FlashLoanProtection is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'mev-protection',
    name: 'MEVProtection',
    description: 'Comprehensive MEV protection with transaction ordering and sandwich attack prevention',
    category: 'MEV Protection',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.15',
    priceInEth: 0.15,
    rating: 4.8,
    reviewCount: 42,
    downloads: 267,
    tags: ['MEV', 'Advanced', 'Protection', 'Sandwich Prevention'],
    lastUpdated: '4 days ago',
    author: 'OneClick Security',
    features: ['MEV Detection', 'Sandwich Prevention', 'Transaction Ordering', 'Advanced Monitoring'],
    deploymentTime: '4-5 minutes',
    preview: 'Advanced MEV and sandwich attack protection',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract MEVProtection is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  }
];

// Filter marketplace items based on criteria
export const filterMarketplaceItems = (
  items: MarketplaceItem[],
  filters: MarketplaceFilters
): MarketplaceItem[] => {
  let filteredItems = [...items];

  if (filters.category && filters.category !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === filters.category);
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    filteredItems = filteredItems.filter(item => item.difficulty === filters.difficulty);
  }

  if (filters.securityLevel && filters.securityLevel !== 'all') {
    filteredItems = filteredItems.filter(item => item.securityLevel === filters.securityLevel);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.priceRange) {
    filteredItems = filteredItems.filter(item => 
      item.priceInEth >= filters.priceRange!.min && 
      item.priceInEth <= filters.priceRange!.max
    );
  }

  return filteredItems;
};

// Sort marketplace items
export const sortMarketplaceItems = (
  items: MarketplaceItem[],
  sortBy: string
): MarketplaceItem[] => {
  const sortedItems = [...items];

  switch (sortBy) {
    case 'name-asc':
      return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sortedItems.sort((a, b) => a.priceInEth - b.priceInEth);
    case 'price-desc':
      return sortedItems.sort((a, b) => b.priceInEth - a.priceInEth);
    case 'rating-desc':
      return sortedItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'downloads-desc':
      return sortedItems.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    case 'newest':
      return sortedItems.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    case 'oldest':
      return sortedItems.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
    default:
      return sortedItems;
  }
};

// Get marketplace item by ID
export const getMarketplaceItemById = (id: string): MarketplaceItem | undefined => {
  return sampleMarketplaceItems.find(item => item.id === id);
};

// Get marketplace categories
export const getMarketplaceCategories = (): string[] => {
  const categories = sampleMarketplaceItems.map(item => item.category);
  return Array.from(new Set(categories));
};

// Get marketplace difficulties
export const getMarketplaceDifficulties = (): string[] => {
  const difficulties = sampleMarketplaceItems.map(item => item.difficulty);
  return Array.from(new Set(difficulties));
};

// Get marketplace security levels
export const getMarketplaceSecurityLevels = (): string[] => {
  const securityLevels = sampleMarketplaceItems.map(item => item.securityLevel);
  return Array.from(new Set(securityLevels));
};

// Get price range for filters
export const getMarketplacePriceRange = (): { min: number; max: number } => {
  const prices = sampleMarketplaceItems.map(item => item.priceInEth);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Search marketplace items
export const searchMarketplaceItems = (query: string): MarketplaceItem[] => {
  if (!query.trim()) return sampleMarketplaceItems;
  
  const searchLower = query.toLowerCase();
  return sampleMarketplaceItems.filter(item => 
    item.name.toLowerCase().includes(searchLower) ||
    item.description.toLowerCase().includes(searchLower) ||
    item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
    item.features.some((feature: string) => feature.toLowerCase().includes(searchLower))
  );
};

// Get featured marketplace items
export const getFeaturedMarketplaceItems = (): MarketplaceItem[] => {
  return sampleMarketplaceItems
    .filter(item => item.rating && item.rating >= 4.5)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);
};

// Get trending marketplace items
export const getTrendingMarketplaceItems = (): MarketplaceItem[] => {
  return sampleMarketplaceItems
    .filter(item => item.downloads && item.downloads > 100)
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 5);
};

// Get marketplace stats
export const getMarketplaceStats = () => {
  const totalItems = sampleMarketplaceItems.length;
  const totalDownloads = sampleMarketplaceItems.reduce((sum, item) => sum + (item.downloads || 0), 0);
  const averageRating = sampleMarketplaceItems.reduce((sum, item) => sum + (item.rating || 0), 0) / totalItems;
  const totalValue = sampleMarketplaceItems.reduce((sum, item) => sum + item.priceInEth, 0);

  return {
    totalItems,
    totalDownloads,
    averageRating: Math.round(averageRating * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100
  };
};