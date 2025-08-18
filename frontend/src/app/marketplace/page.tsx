"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Star, Users, Eye, ShoppingCart, Filter, Search, TrendingUp, CreditCard, Wallet, CheckCircle } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceInEth: number;
  category: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  securityLevel: 'Low' | 'Medium' | 'High';
  tags: string[];
  author: string;
  lastUpdated: string;
  preview: string;
  contractCode: string;
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Advanced Honeypot Suite',
    description: 'Professional-grade honeypot system with advanced monitoring and analytics',
    price: '0.1 ETH',
    priceInEth: 0.1,
    category: 'Honeypots',
    difficulty: 'Advanced',
    securityLevel: 'High',
    tags: ['Honeypot', 'Analytics', 'Monitoring', 'Professional'],
    author: 'SecurityMaster',
    lastUpdated: '2 days ago',
    preview: 'Advanced honeypot with real-time threat detection',
    contractCode: '// Advanced Honeypot Contract Code'
  },
  {
    id: '2',
    name: 'Flash Loan Defender Pro',
    description: 'Comprehensive protection against flash loan attacks with real-time blocking',
    price: '0.08 ETH',
    priceInEth: 0.08,
    category: 'Flash Loan Protection',
    difficulty: 'Intermediate',
    securityLevel: 'High',
    tags: ['Flash Loan', 'Real-time', 'Blocking', 'Protection'],
    author: 'DeFiGuard',
    lastUpdated: '1 week ago',
    preview: 'Real-time flash loan attack prevention',
    contractCode: '// Flash Loan Defender Contract Code'
  },
  {
    id: '3',
    name: 'Multi-Sig Vault System',
    description: 'Enterprise-grade multi-signature vault with role-based access control',
    price: '0.15 ETH',
    priceInEth: 0.15,
    category: 'Access Control',
    difficulty: 'Advanced',
    securityLevel: 'High',
    tags: ['Multi-sig', 'Vault', 'Enterprise', 'Access Control'],
    author: 'VaultMaster',
    lastUpdated: '3 days ago',
    preview: 'Enterprise multi-signature vault system',
    contractCode: '// Multi-Sig Vault Contract Code'
  },
  {
    id: '4',
    name: 'Reentrancy Shield',
    description: 'Lightweight but powerful protection against reentrancy attacks',
    price: '0.05 ETH',
    priceInEth: 0.05,
    category: 'Reentrancy Protection',
    difficulty: 'Intermediate',
    securityLevel: 'High',
    tags: ['Reentrancy', 'Lightweight', 'Protection', 'Gas Efficient'],
    author: 'ShieldPro',
    lastUpdated: '5 days ago',
    preview: 'Gas-efficient reentrancy protection',
    contractCode: '// Reentrancy Shield Contract Code'
  },
  {
    id: '5',
    name: 'Oracle Manipulation Detector',
    description: 'Detect and prevent oracle manipulation attacks in real-time',
    price: '0.12 ETH',
    priceInEth: 0.12,
    category: 'Oracle Security',
    difficulty: 'Advanced',
    securityLevel: 'High',
    tags: ['Oracle', 'Manipulation', 'Detection', 'Real-time'],
    author: 'OracleGuard',
    lastUpdated: '1 week ago',
    preview: 'Oracle manipulation attack prevention',
    contractCode: '// Oracle Detector Contract Code'
  },
  {
    id: '6',
    name: 'Basic Honeypot',
    description: 'Simple but effective honeypot for beginners',
    price: '0.02 ETH',
    priceInEth: 0.02,
    category: 'Honeypots',
    difficulty: 'Basic',
    securityLevel: 'Medium',
    tags: ['Honeypot', 'Basic', 'Beginner', 'Simple'],
    author: 'SecurityNewbie',
    lastUpdated: '2 weeks ago',
    preview: 'Simple honeypot for beginners',
    contractCode: '// Basic Honeypot Contract Code'
  }
];

const categories = ['All', 'Honeypots', 'Flash Loan Protection', 'Access Control', 'Reentrancy Protection', 'Oracle Security'];
const difficulties = ['All', 'Basic', 'Intermediate', 'Advanced'];
const securityLevels = ['All', 'Low', 'Medium', 'High'];

export default function MarketplacePage() {
  const { isConnected, address } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'price' | 'newest'>('price');
  const [cart, setCart] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchesSecurityLevel = selectedSecurityLevel === 'All' || item.securityLevel === selectedSecurityLevel;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesSecurityLevel;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return 0; // No fake stats
      case 'price':
        return a.priceInEth - b.priceInEth;
      case 'newest':
        return 0; // No fake dates
      default:
        return 0;
    }
  });

  const addToCart = (itemId: string) => {
    if (!cart.includes(itemId)) {
      setCart([...cart, itemId]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(id => id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, itemId) => {
      const item = marketplaceItems.find(i => i.id === itemId);
      return total + (item?.priceInEth || 0);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to make a purchase!');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessingPayment(true);

    try {
      if (paymentMethod === 'wallet') {
        await handleWalletPayment();
      } else {
        await handleCardPayment();
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!window.ethereum) return;

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Get current gas price
      const gasPrice = await window.ethereum.request({ method: 'eth_gasPrice' });

      // Calculate total cost in wei
      const totalCostInWei = (getCartTotal() * 1e18).toString(16);
      
      // Create transaction
      const transactionParameters = {
        to: '0x0000000000000000000000000000000000000000', // This would be your payment contract
        from: account,
        value: totalCostInWei,
        gas: '0x5208', // 21000 gas
        gasPrice: gasPrice,
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Payment transaction hash:', txHash);
      
      // Process purchases
      await processPurchases();
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleCardPayment = async () => {
    // This would integrate with a payment processor like Stripe
    alert('Card payment integration coming soon. Please use wallet payment for now.');
  };

  const processPurchases = async () => {
    try {
      // Process each item in cart
      for (const itemId of cart) {
        const item = marketplaceItems.find(i => i.id === itemId);
        if (!item) continue;

        // Call backend API to record purchase
        await recordPurchase(item);
      }

      // Clear cart and show success
      setCart([]);
      setShowCheckout(false);
      alert('Purchase successful! Your templates are now available for deployment.');
      
    } catch (error) {
      console.error('Failed to process purchases:', error);
      alert('Payment successful but failed to process purchases. Please contact support.');
    }
  };

  const recordPurchase = async (item: MarketplaceItem) => {
    try {
      const response = await fetch('https://one-click-c308.onrender.com/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: item.id,
          templateName: item.name,
          price: item.priceInEth,
          userAddress: address,
          purchaseDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record purchase');
      }

      console.log('Purchase recorded successfully');
    } catch (error) {
      console.error('Failed to record purchase:', error);
      // Don't fail the purchase for this
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">Connect your wallet to access the marketplace</p>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/'}
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Security Trap Marketplace
          </h1>
          <p className="text-gray-400 text-lg">
            Browse and purchase professional security trap templates from top developers
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-orange-400 border-orange-500">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Security Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Security:</span>
              <select
                value={selectedSecurityLevel}
                onChange={(e) => setSelectedSecurityLevel(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {securityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="price">Price (Low to High)</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {sortedItems.length} of {marketplaceItems.length} templates
          </p>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                </div>
                <CardDescription className="text-gray-300">{item.description}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={`${
                      item.difficulty === 'Basic' ? 'text-green-400 border-green-500' :
                      item.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-500' :
                      'text-red-400 border-red-500'
                    }`}
                  >
                    {item.difficulty}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${
                      item.securityLevel === 'Low' ? 'text-red-400 border-red-500' :
                      item.securityLevel === 'Medium' ? 'text-yellow-400 border-yellow-500' :
                      'text-green-400 border-green-500'
                    }`}
                  >
                    {item.securityLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author and Update */}
                  <div className="text-xs text-gray-500">
                    <p>By {item.author}</p>
                    <p>Updated {item.lastUpdated}</p>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <div className="text-2xl font-bold text-orange-400">{item.price}</div>
                    <div className="flex gap-2">
                      {cart.includes(item.id) ? (
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={() => addToCart(item.id)}
                          variant="outline"
                          size="sm"
                          className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Card className="bg-gray-900/90 border-orange-500/50 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-sm font-medium">{cart.length} items in cart</p>
                    <p className="text-xs text-gray-400">Total: {getCartTotal().toFixed(3)} ETH</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowCheckout(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Checkout</h2>
              
              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {cart.map(itemId => {
                    const item = marketplaceItems.find(i => i.id === itemId);
                    return item ? (
                      <div key={itemId} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-orange-400">{item.price}</span>
                      </div>
                    ) : null;
                  })}
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-orange-400">{getCartTotal().toFixed(3)} ETH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="wallet-checkout"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                      className="text-orange-500"
                    />
                    <label htmlFor="wallet-checkout" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card-checkout"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                      className="text-orange-500"
                    />
                    <label htmlFor="card-checkout" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Card (Coming Soon)
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCheckout(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {isProcessingPayment ? 'Processing...' : `Pay ${getCartTotal().toFixed(3)} ETH`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
