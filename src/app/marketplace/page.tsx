// Marketplace page for browsing and deploying security trap templates

'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useTrapTemplates, useStoreActions } from '@/lib/store';
import { useNotification } from '@/components/ui/NotificationToast';
import { apiClient } from '@/lib/api';
import { TrapTemplate, TrapCategory, TrapComplexity } from '@/types';
import { 
  CubeIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EyeIcon,
  BoltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

const categories: { value: TrapCategory; label: string; description: string }[] = [
  { value: 'rugpull', label: 'Rugpull Protection', description: 'Prevent token rugpulls and exit scams' },
  { value: 'governance', label: 'Governance Attacks', description: 'Protect against governance manipulation' },
  { value: 'minting', label: 'Minting Exploits', description: 'Prevent unauthorized token minting' },
  { value: 'oracle', label: 'Oracle Manipulation', description: 'Protect against price oracle attacks' },
  { value: 'flashloan', label: 'Flash Loan Attacks', description: 'Prevent flash loan-based exploits' },
  { value: 'reentrancy', label: 'Reentrancy', description: 'Protect against reentrancy attacks' },
  { value: 'access-control', label: 'Access Control', description: 'Secure privileged functions' },
];

const complexities: { value: TrapComplexity; label: string; description: string }[] = [
  { value: 'basic', label: 'Basic', description: 'Simple protection mechanisms' },
  { value: 'intermediate', label: 'Intermediate', description: 'Advanced security features' },
  { value: 'advanced', label: 'Advanced', description: 'Complex multi-layered protection' },
];

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const templates = useTrapTemplates();
  const { setTemplates, setLoading } = useStoreActions();
  const { showSuccess, showError } = useNotification();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrapCategory | 'all'>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<TrapComplexity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'deployments' | 'newest'>('rating');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const marketplaceTemplates = await apiClient.getMarketplaceTemplates();
      setTemplates(marketplaceTemplates);
      showSuccess('Marketplace loaded successfully');
    } catch (error) {
      console.error('Failed to load templates:', error);
      showError('Failed to load marketplace');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || template.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deployments':
        return b.deployments - a.deployments;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getCategoryIcon = (category: TrapCategory) => {
    const icons = {
      rugpull: ShieldCheckIcon,
      governance: CubeIcon,
      minting: BoltIcon,
      oracle: EyeIcon,
      flashloan: BoltIcon,
      reentrancy: ShieldCheckIcon,
      'access-control': LockClosedIcon,
    };
    return icons[category] || CubeIcon;
  };

  const getComplexityColor = (complexity: TrapComplexity) => {
    const colors = {
      basic: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    };
    return colors[complexity] || colors.basic;
  };

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Loading marketplace..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Template Marketplace</h1>
          <p className="mt-2 text-gray-300">
            Browse and deploy from our curated collection of audited security trap templates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as TrapCategory | 'all')}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-300 mb-2">Complexity</label>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value as TrapComplexity | 'all')}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Complexities</option>
                {complexities.map((complexity) => (
                  <option key={complexity.value} value={complexity.value}>
                    {complexity.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'deployments' | 'newest')}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="deployments">Most Deployed</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {sortedTemplates.length} of {templates.length} templates
          </p>
        </div>

        {/* Templates Grid */}
        {sortedTemplates.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 text-center border border-white/10">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-300">No templates found</h3>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your search criteria or browse all templates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTemplates.map((template) => {
              const CategoryIcon = getCategoryIcon(template.category);
              const categoryInfo = categories.find(c => c.value === template.category);
              
              return (
                <div key={template.id} className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="h-6 w-6 text-purple-400" />
                      <span className="text-lg font-semibold text-white">{template.name}</span>
                    </div>
                    {template.audited && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                        <ShieldCheckIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Audited</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 line-clamp-3">{template.description}</p>

                  {/* Category and Complexity */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                      {categoryInfo?.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getComplexityColor(template.complexity)}`}>
                      {template.complexity}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{template.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CubeIcon className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">{template.deployments}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{template.price} ETH</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/templates/${template.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <BoltIcon className="h-4 w-4 mr-2" />
                      Deploy
                    </Link>
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Creator */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Created by</span>
                      <span className="text-xs text-purple-400 font-mono">
                        {template.creator.slice(0, 6)}...{template.creator.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {sortedTemplates.length > 0 && (
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 bg-white/10 text-white text-sm font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20">
              Load More Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}