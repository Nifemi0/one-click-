"use client";

import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Shield, Zap, Users, Eye } from 'lucide-react';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  securityLevel: 'basic' | 'premium' | 'enterprise';
  rating: number;
  downloads: number;
  price: string;
  tags: string[];
  image: string;
}

const Marketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('popular');

  const categories = ['all', 'honeypots', 'monitoring', 'access-control', 'reentrancy', 'flash-loans'];
  const complexities = ['all', 'simple', 'medium', 'complex'];
  const securityLevels = ['all', 'basic', 'premium', 'enterprise'];

  const marketplaceItems: MarketplaceItem[] = [
    {
      id: '1',
      name: 'Advanced Honeypot Trap',
      description: 'Sophisticated honeypot with fund capture and attack detection mechanisms',
      category: 'honeypots',
      complexity: 'complex',
      securityLevel: 'enterprise',
      rating: 4.9,
      downloads: 1250,
      price: 'Free',
      tags: ['honeypot', 'fund-capture', 'attack-detection'],
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'DEX Monitoring System',
      description: 'Real-time DEX monitoring with price manipulation detection',
      category: 'monitoring',
      complexity: 'medium',
      securityLevel: 'premium',
      rating: 4.7,
      downloads: 890,
      price: 'Free',
      tags: ['dex', 'monitoring', 'price-detection'],
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      name: 'Access Control Manager',
      description: 'Multi-level access control with role-based permissions',
      category: 'access-control',
      complexity: 'medium',
      securityLevel: 'premium',
      rating: 4.8,
      downloads: 650,
      price: 'Free',
      tags: ['access-control', 'roles', 'permissions'],
      image: '/api/placeholder/300/200'
    },
    {
      id: '4',
      name: 'Reentrancy Guard',
      description: 'Lightweight reentrancy protection for smart contracts',
      category: 'reentrancy',
      complexity: 'simple',
      securityLevel: 'basic',
      rating: 4.6,
      downloads: 2100,
      price: 'Free',
      tags: ['reentrancy', 'protection', 'security'],
      image: '/api/placeholder/300/200'
    },
    {
      id: '5',
      name: 'Flash Loan Attack Detector',
      description: 'Detect and prevent flash loan attacks in DeFi protocols',
      category: 'flash-loans',
      complexity: 'complex',
      securityLevel: 'enterprise',
      rating: 4.9,
      downloads: 450,
      price: 'Free',
      tags: ['flash-loans', 'attack-detection', 'defi'],
      image: '/api/placeholder/300/200'
    },
    {
      id: '6',
      name: 'Basic Security Trap',
      description: 'Simple security trap for basic protection needs',
      category: 'honeypots',
      complexity: 'simple',
      securityLevel: 'basic',
      rating: 4.4,
      downloads: 3200,
      price: 'Free',
      tags: ['basic', 'security', 'trap'],
      image: '/api/placeholder/300/200'
    }
  ];

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || item.complexity === selectedComplexity;
    const matchesSecurityLevel = selectedSecurityLevel === 'all' || item.securityLevel === selectedSecurityLevel;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesComplexity && matchesSecurityLevel && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedComplexity('all');
    setSelectedSecurityLevel('all');
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedComplexity !== 'all') count++;
    if (selectedSecurityLevel !== 'all') count++;
    if (searchQuery) count++;
    return count;
  };

  return (
    <section className="section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="h2 text-charcoal">
            Security <span className="text-gradient-primary">Marketplace</span>
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Browse and deploy pre-built security templates. All templates are community-verified 
            and battle-tested for maximum protection.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="marketplace-filters mb-12">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search security templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Complexity Filter */}
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="form-select"
            >
              {complexities.map(complexity => (
                <option key={complexity} value={complexity}>
                  {complexity === 'all' ? 'All Complexities' : complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                </option>
              ))}
            </select>

            {/* Security Level Filter */}
            <select
              value={selectedSecurityLevel}
              onChange={(e) => setSelectedSecurityLevel(e.target.value)}
              className="form-select"
            >
              {securityLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="downloads">Most Downloaded</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="filter-chip">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="filter-chip-remove"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedComplexity !== 'all' && (
                  <span className="filter-chip">
                    Complexity: {selectedComplexity}
                    <button
                      onClick={() => setSelectedComplexity('all')}
                      className="filter-chip-remove"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedSecurityLevel !== 'all' && (
                  <span className="filter-chip">
                    Security: {selectedSecurityLevel}
                    <button
                      onClick={() => setSelectedSecurityLevel('all')}
                      className="filter-chip-remove"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-chip">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="filter-chip-remove"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="btn btn-utility btn-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {marketplaceItems.length} templates
          </p>
        </div>

        {/* Marketplace Items */}
        {filteredItems.length > 0 ? (
          <div className={viewMode === 'grid' ? 'marketplace-grid' : 'space-y-6'}>
            {filteredItems.map((item) => (
              <div key={item.id} className="marketplace-item">
                <div className="card-body">
                  <div className={viewMode === 'grid' ? 'text-center' : 'flex gap-6'}>
                    {/* Image */}
                    <div className={`${viewMode === 'grid' ? 'mb-4' : 'flex-shrink-0'}`}>
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Shield className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="h4 text-charcoal">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{item.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {item.securityLevel}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {item.complexity}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button className="btn btn-primary">
                          🚀 Deploy Now
                        </button>
                        <button className="btn btn-secondary">
                          📖 View Details
                        </button>
                        <button className="btn btn-utility">
                          ⭐ Rate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="h3 text-gray-600 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || getActiveFiltersCount() > 0 
                ? 'Try adjusting your search or filters'
                : 'We\'re working on adding more security templates to One Click'
              }
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Browse All Templates
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn btn-secondary">
              Load More Templates
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;
