"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Star, Users, Eye, ShoppingCart, Filter, Search, TrendingUp, CreditCard, Wallet, CheckCircle, X, Zap, Target, Lock, AlertTriangle, RefreshCw } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";
import { MarketplaceService } from "../../lib/marketplaceService";
import { MarketplaceItem, MarketplaceFilters } from "../../types/marketplace";

// Disable SSR for this page since it uses wallet hooks
export const dynamic = 'force-dynamic';

// Types are now imported from types/marketplace.ts

// Data will be fetched from the backend API
const defaultMarketplaceItems: MarketplaceItem[] = [];

export default function MarketplacePage() {
  const { isConnected, address } = useWallet();
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<MarketplaceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'date' | 'popularity'>('price');
  const [showCart, setShowCart] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const categories = ['all', 'Honeypots', 'Flash Loan Protection', 'Reentrancy Protection', 'MEV Protection', 'Access Control'];
  const difficulties = ['all', 'Basic', 'Intermediate', 'Advanced'];
  const securityLevels = ['all', 'Low', 'Medium', 'High'];

  const addToCart = (item: MarketplaceItem) => {
    if (!cart.find(cartItem => cartItem.id === item.id)) {
      setCart([...cart, item]);
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
        const items = await MarketplaceService.getMarketplaceItems();
        setMarketplaceItems(items);
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
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

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful payment
      clearCart();
      setShowCart(false);
      alert('Payment successful! Your security traps are being deployed.');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
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
              <RefreshCw className="h-4 w-4 mr-2" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
            <Card key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white mb-2">{item.name}</CardTitle>
                    <CardDescription className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-orange-400 mb-1">{item.price}</div>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Difficulty and Security Level */}
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(item.difficulty)}>
                    {item.difficulty}
                  </Badge>
                  <Badge className={getSecurityLevelColor(item.securityLevel)}>
                    {item.securityLevel} Security
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-gray-300 text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-white/10 text-gray-300 text-xs">
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-xs text-gray-400 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Author and Update Info */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>By {item.author}</span>
                  <span>{item.lastUpdated}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
