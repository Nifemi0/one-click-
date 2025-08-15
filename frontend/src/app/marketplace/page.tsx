'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  StarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const securityTemplates = [
  {
    id: '1',
    name: 'Rugpull Protection Basic',
    description: 'Essential protection against rugpull attacks with basic monitoring',
    category: 'rugpull',
    complexity: 'Basic',
    rating: 4.8,
    deployments: 1247,
    price: '0.001',
    monthlyFee: '0.0005',
    features: ['Transaction monitoring', 'Liquidity tracking', 'Basic alerts'],
    icon: '🛡️',
    tags: ['Popular', 'Beginner Friendly'],
  },
  {
    id: '2',
    name: 'Governance Attack Shield',
    description: 'Advanced protection against governance attacks and voting manipulation',
    category: 'governance',
    complexity: 'Intermediate',
    rating: 4.9,
    deployments: 892,
    price: '0.002',
    monthlyFee: '0.001',
    features: ['Voting pattern analysis', 'Proposal monitoring', 'Multi-sig protection'],
    icon: '🏛️',
    tags: ['Advanced', 'High Security'],
  },
  {
    id: '3',
    name: 'Oracle Manipulation Guard',
    description: 'Detect oracle price manipulation and flash loan attacks',
    category: 'oracle',
    complexity: 'Advanced',
    rating: 4.7,
    deployments: 567,
    price: '0.003',
    monthlyFee: '0.0015',
    features: ['Price deviation detection', 'Flash loan monitoring', 'MEV protection'],
    icon: '🔮',
    tags: ['Expert', 'MEV Protection'],
  },
  {
    id: '4',
    name: 'Minting Attack Prevention',
    description: 'Prevent unauthorized minting and token inflation attacks',
    category: 'minting',
    complexity: 'Intermediate',
    rating: 4.6,
    deployments: 734,
    price: '0.002',
    monthlyFee: '0.001',
    features: ['Supply monitoring', 'Mint rate limiting', 'Access control'],
    icon: '🪙',
    tags: ['Supply Control', 'Access Management'],
  },
  {
    id: '5',
    name: 'Flash Loan Attack Shield',
    description: 'Comprehensive protection against flash loan attacks',
    category: 'flashloan',
    complexity: 'Advanced',
    rating: 4.8,
    deployments: 445,
    price: '0.003',
    monthlyFee: '0.0015',
    features: ['Flash loan detection', 'Transaction sequencing', 'Gas optimization'],
    icon: '⚡',
    tags: ['Flash Loan', 'Gas Efficient'],
  },
  {
    id: '6',
    name: 'Reentrancy Guard Plus',
    description: 'Advanced reentrancy protection with multiple attack vector coverage',
    category: 'reentrancy',
    complexity: 'Intermediate',
    rating: 4.5,
    deployments: 678,
    price: '0.002',
    monthlyFee: '0.001',
    features: ['Reentrancy detection', 'State validation', 'Call depth monitoring'],
    icon: '🔄',
    tags: ['Reentrancy', 'State Safety'],
  },
];

const categories = ['All', 'rugpull', 'governance', 'oracle', 'minting', 'flashloan', 'reentrancy'];
const complexities = ['All', 'Basic', 'Intermediate', 'Advanced'];

export default function MarketplacePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const filteredTemplates = securityTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || template.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deployments':
        return b.deployments - a.deployments;
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleTemplateClick = (templateId: string) => {
    router.push(`/templates/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Security Template Marketplace</h1>
          <p className="text-xl text-gray-300">
            Browse and deploy from our curated collection of security trap templates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <div>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {complexities.map(complexity => (
                  <option key={complexity} value={complexity}>
                    {complexity === 'All' ? 'All Complexities' : complexity}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="deployments">Sort by Deployments</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {sortedTemplates.length} of {securityTemplates.length} templates
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
              onClick={() => handleTemplateClick(template.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white">{template.rating}</span>
                </div>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{template.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-center">
                      <CubeIcon className="h-3 w-3 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                  {template.features.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{template.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Stats and Pricing */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">
                  {template.deployments.toLocaleString()} deployments
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-400">{template.price} ETH</div>
                  <div className="text-xs text-gray-400">{template.monthlyFee} ETH/month</div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <EyeIcon className="h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No templates found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}