"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Search, ShoppingCart, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { MarketplaceService } from '@/lib/marketplaceService';
import { PaymentService } from '@/lib/payment';
import { SmartContractDeploymentService } from '@/lib/smartContractDeployment';
import { MarketplaceItem } from '@/types/marketplace';

// Initialize services
const paymentService = new PaymentService();
const deploymentService = new SmartContractDeploymentService();

// Disable SSR for this page since it uses wallet hooks
export const dynamic = 'force-dynamic';

// Types are now imported from types/marketplace.ts

// Data will be fetched from the backend API
const defaultMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'security-trap',
    name: 'SecurityTrap',
    description: 'Advanced security trap with comprehensive attack detection and response mechanisms',
    category: 'Security',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.08',
    priceInEth: 0.08,
    rating: 4.9,
    reviewCount: 67,
    downloads: 342,
    tags: ['Security', 'Advanced', 'Attack Detection', 'Response'],
    lastUpdated: '1 day ago',
    author: 'OneClick Security',
    features: ['Attack Detection', 'Automated Response', 'Event Logging', 'Emergency Shutdown'],
    deploymentTime: '2-3 minutes',
    preview: 'Advanced security trap with real-time threat detection',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract SecurityTrap is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'advanced-honeypot',
    name: 'AdvancedHoneypot',
    description: 'Sophisticated honeypot that captures malicious actors while protecting legitimate users',
    category: 'Honeypot',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.12',
    priceInEth: 0.12,
    rating: 4.8,
    reviewCount: 89,
    downloads: 567,
    tags: ['Honeypot', 'Advanced', 'Malware Capture', 'User Protection'],
    lastUpdated: '2 days ago',
    author: 'OneClick Security',
    features: ['Malware Detection', 'User Protection', 'Fund Capture', 'Analytics'],
    deploymentTime: '3-4 minutes',
    preview: 'Advanced honeypot with intelligent threat detection',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/security/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract AdvancedHoneypot is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'drosera-registry',
    name: 'DroseraRegistry',
    description: 'Centralized registry for managing and monitoring all deployed security traps',
    category: 'Monitoring',
    difficulty: 'Intermediate',
    securityLevel: 'Medium',
    price: '0.06',
    priceInEth: 0.06,
    rating: 4.7,
    reviewCount: 45,
    downloads: 234,
    tags: ['Registry', 'Monitoring', 'Management', 'Centralized'],
    lastUpdated: '3 days ago',
    author: 'OneClick Security',
    features: ['Trap Registry', 'Monitoring Dashboard', 'Event Logging', 'Admin Controls'],
    deploymentTime: '2-3 minutes',
    preview: 'Centralized registry for security trap management',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/access/Ownable.sol";\nimport "@openzeppelin/contracts/utils/Counters.sol";\n\ncontract DroseraRegistry is Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'flash-loan-protection',
    name: 'FlashLoanProtection',
    description: 'Protection mechanism against flash loan attacks and price manipulation',
    category: 'Security',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.15',
    priceInEth: 0.15,
    rating: 4.9,
    reviewCount: 123,
    downloads: 789,
    tags: ['Flash Loan', 'Attack Prevention', 'Price Protection', 'Advanced'],
    lastUpdated: '1 day ago',
    author: 'OneClick Security',
    features: ['Flash Loan Detection', 'Price Manipulation Prevention', 'Emergency Shutdown', 'Real-time Monitoring'],
    deploymentTime: '4-5 minutes',
    preview: 'Advanced flash loan attack protection system',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/security/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract FlashLoanProtection is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  },
  {
    id: 'mev-protection',
    name: 'MEVProtection',
    description: 'Maximum Extractable Value protection against sandwich attacks and front-running',
    category: 'Monitoring',
    difficulty: 'Advanced',
    securityLevel: 'High',
    price: '0.18',
    priceInEth: 0.18,
    rating: 4.9,
    reviewCount: 156,
    downloads: 892,
    tags: ['MEV', 'Sandwich Attack', 'Front-running', 'Advanced'],
    lastUpdated: '2 days ago',
    author: 'OneClick Security',
    features: ['MEV Detection', 'Sandwich Prevention', 'Transaction Ordering', 'Gas Optimization'],
    deploymentTime: '3-4 minutes',
    preview: 'Comprehensive MEV attack protection system',
    contractCode: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/security/ReentrancyGuard.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract MEVProtection is ReentrancyGuard, Ownable {\n  // Real compiled contract code\n}'
  }
];

export default function MarketplacePage() {
  // Wallet connection
  const { address, isConnected } = useWallet();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'date' | 'popularity'>('price');

  // Categories and filters
  const categories = ['all', 'Security', 'Honeypot', 'Monitoring', 'Basic'];
  const difficulties = ['all', 'Basic', 'Intermediate', 'Advanced'];
  const securityLevels = ['all', 'Low', 'Medium', 'High'];

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<MarketplaceItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<{
    isDeploying: boolean;
    currentContract: string;
    progress: number;
    deployedContracts: Array<{ name: string; address: string; txHash: string }>;
    errors: Array<{ name: string; error: string }>;
  }>({
    isDeploying: false,
    currentContract: '',
    progress: 0,
    deployedContracts: [],
    errors: []
  });

  const addToCart = (item: MarketplaceItem) => {
    console.log('addToCart called with:', item);
    if (!cart.find(cartItem => cartItem.id === item.id)) {
      const newCart = [...cart, item];
      console.log('Adding to cart, new cart:', newCart);
      setCart(newCart);
      // Show a visual feedback
      alert(`Added ${item.name} to cart!`);
    } else {
      console.log('Item already in cart');
      alert('Item already in cart!');
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.priceInEth, 0);
  };

  // Filter and sort items
  useEffect(() => {
    const filtered = marketplaceItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
      const matchesSecurityLevel = selectedSecurityLevel === 'all' || item.securityLevel === selectedSecurityLevel;
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesDifficulty && matchesSecurityLevel && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.priceInEth - b.priceInEth;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'popularity':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
        }
    });

    setFilteredItems(sorted);
  }, [marketplaceItems, selectedCategory, selectedDifficulty, selectedSecurityLevel, searchQuery, sortBy]);

  // Fetch marketplace data on component mount
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching marketplace data...');
        const items = await MarketplaceService.getMarketplaceItems();
        console.log('Marketplace items received:', items);
        setMarketplaceItems(items);
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
        console.log('Using fallback data...');
        // Fallback to default items if API fails
        setMarketplaceItems(defaultMarketplaceItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplaceData();
  }, []);

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessingPayment(true);
    setDeploymentStatus({
      isDeploying: true,
      currentContract: '',
      progress: 0,
      deployedContracts: [],
      errors: []
    });

    try {
      // Calculate total cost
      const totalCost = cart.reduce((sum, item) => sum + item.priceInEth, 0);
      
      // Check user balance
      const userBalance = await paymentService.getBalance();
      if (parseFloat(userBalance) < totalCost) {
        throw new Error(`Insufficient balance. You have ${userBalance} ETH but need ${totalCost} ETH`);
      }

      // Initialize deployment service
      const isInitialized = await deploymentService.initialize();
      if (!isInitialized) {
        throw new Error('Failed to initialize deployment service. Please check your wallet connection.');
      }

      // Deploy each contract in the cart
      const totalContracts = cart.length;
      let deployedCount = 0;

      for (const item of cart) {
        try {
          setDeploymentStatus(prev => ({
            ...prev,
            currentContract: item.name,
            progress: (deployedCount / totalContracts) * 100
          }));

          console.log(`🚀 Deploying ${item.name}...`);

          // Deploy the contract
          const deploymentResult = await deploymentService.deployContract({
            template: {
              id: item.id,
              name: item.name,
              type: item.name.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
              description: item.description,
              price: item.priceInEth,
              difficulty: item.difficulty,
              securityLevel: item.securityLevel,
              features: item.features,
              tags: item.tags,
              deploymentTime: item.deploymentTime,
              gasEstimate: 150000, // Default gas estimate
              contractCode: item.contractCode,
              preview: item.preview,
              author: item.author,
              lastUpdated: item.lastUpdated
            },
            customizations: {
              name: item.name,
              description: item.description,
              securityLevel: item.securityLevel as 'Low' | 'Medium' | 'High'
            }
          });

          if (deploymentResult.success && deploymentResult.contractAddress) {
            deployedCount++;
            setDeploymentStatus(prev => ({
              ...prev,
              deployedContracts: [...prev.deployedContracts, {
                name: item.name,
                address: deploymentResult.contractAddress!,
                txHash: deploymentResult.transactionHash!
              }],
              progress: (deployedCount / totalContracts) * 100
            }));

            console.log(`✅ ${item.name} deployed successfully at ${deploymentResult.contractAddress}`);
          } else {
            throw new Error(deploymentResult.error || 'Deployment failed');
          }

        } catch (error: any) {
          console.error(`❌ Failed to deploy ${item.name}:`, error);
          setDeploymentStatus(prev => ({
            ...prev,
            errors: [...prev.errors, {
              name: item.name,
              error: error.message || 'Deployment failed'
            }]
          }));
        }
      }

      // Show deployment results
      if (deployedCount > 0) {
        const successMessage = `✅ Successfully deployed ${deployedCount} out of ${totalContracts} contracts!\n\nDeployed contracts:\n${deploymentStatus.deployedContracts.map(c => `• ${c.name}: ${c.address}`).join('\n')}`;
        alert(successMessage);
        
        // Clear cart after successful deployment
        clearCart();
        setShowCart(false);
      }

      if (deploymentStatus.errors.length > 0) {
        const errorMessage = `⚠️ ${deploymentStatus.errors.length} contracts failed to deploy:\n\n${deploymentStatus.errors.map(e => `• ${e.name}: ${e.error}`).join('\n')}`;
        alert(errorMessage);
      }

    } catch (error: any) {
      console.error('Payment/Deployment failed:', error);
      alert(`❌ Payment/Deployment failed: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
      setDeploymentStatus(prev => ({
        ...prev,
        isDeploying: false
      }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Security Trap Marketplace
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse and purchase professional-grade security traps. Each template is carefully crafted 
              and tested to provide maximum protection for your DeFi protocols.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-gray-800 text-white">
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Security Level</label>
              <select
                value={selectedSecurityLevel}
                onChange={(e) => setSelectedSecurityLevel(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {securityLevels.map(level => (
                  <option key={level} value={level} className="bg-gray-800 text-white">
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="price" className="bg-gray-800 text-white">Price</option>
                <option value="name" className="bg-gray-800 text-white">Name</option>
                <option value="date" className="bg-gray-800 text-white">Date</option>
                <option value="popularity" className="bg-gray-800 text-white">Popularity</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search security traps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Shopping Cart</h3>
                <p className="text-orange-100">{cart.length} item(s) - Total: {getTotalPrice().toFixed(3)} ETH</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="bg-white text-orange-600 hover:bg-gray-100"
                >
                  {isProcessingPayment ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-300">
            Showing {filteredItems.length} of {marketplaceItems.length} security traps
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const fetchMarketplaceData = async () => {
                  setIsLoading(true);
                  try {
                    const items = await MarketplaceService.getMarketplaceItems();
                    setMarketplaceItems(items);
                  } catch (error) {
                    console.error('Failed to refresh marketplace data:', error);
                  } finally {
                    setIsLoading(false);
                  }
                };
                fetchMarketplaceData();
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Shield className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCart(!showCart)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
            </Button>
          </div>
        </div>

        {/* Marketplace Grid */}
        {isLoading ? (
          <div className="col-span-full text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading marketplace items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 rounded-lg p-3 min-h-[180px] flex flex-col">
                {/* Shield Icon at Top Center */}
                <div className="text-center mb-2">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                {/* Template Name */}
                <h3 className="text-xs font-semibold text-white mb-1 text-center line-clamp-2">
                  {item.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 text-xs leading-relaxed text-center mb-2 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Difficulty Badge */}
                <div className="flex justify-center mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.difficulty === 'Basic' ? 'bg-green-500/20 text-green-400' :
                    item.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>
                
                {/* Template Details */}
                <div className="text-center space-y-1 mb-2 text-xs text-gray-400">
                  <div>{item.category}</div>
                  <div>By {item.author}</div>
                </div>
                
                {/* Price and Action */}
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-xs font-bold text-orange-400">
                    {item.price} ETH
                  </div>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs h-6"
                    onClick={() => {
                      console.log('Adding to cart:', item);
                      addToCart(item);
                    }}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
                        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No security traps found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedSecurityLevel('all');
                setSearchQuery('');
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
