'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Shield, Search, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';

interface TrapInfo {
  trapId: number;
  contractAddress: string;
  deployer: string;
  trapType: string;
  trapName: string;
  description: string;
  deploymentTimestamp: number;
  status: string;
  isActive: boolean;
  lastActivity: number;
  metadata: string;
}

interface RegistryStats {
  totalTraps: number;
  activeTraps: number;
  totalDeployers: number;
}

export default function DroseraRegistry() {
  const [stats, setStats] = useState<RegistryStats | null>(null);
  const [traps, setTraps] = useState<TrapInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchRegistryData();
  }, []);

  const fetchRegistryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch registry stats
      const statsResponse = await fetch(`${API_BASE}/api/drosera-registry/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Fetch recent traps (first page)
      const trapsResponse = await fetch(`${API_BASE}/api/drosera-registry/traps?page=0&pageSize=20`);
      if (trapsResponse.ok) {
        const trapsData = await trapsResponse.json();
        setTraps(trapsData.data || []);
      }

    } catch (err: any) {
      console.error('Failed to fetch registry data:', err);
      setError('Failed to load registry data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return 'text-red-500';
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-yellow-500';
      case 'disabled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    if (!isActive) return <AlertCircle className="w-4 h-4" />;
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      case 'disabled': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredTraps = traps.filter(trap => {
    const matchesSearch = trap.trapName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trap.contractAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || trap.trapType.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Registry Error</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchRegistryData}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-orange-500 mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Drosera Registry
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Central registry for all deployed security traps on Hoodi testnet. 
            Track, monitor, and manage your security infrastructure.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">{stats.totalTraps}</div>
              <div className="text-gray-400">Total Traps</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">{stats.activeTraps}</div>
              <div className="text-gray-400">Active Traps</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">{stats.totalDeployers}</div>
              <div className="text-gray-400">Total Deployers</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search traps by name, description, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Types</option>
                <option value="Honeypot">Honeypot</option>
                <option value="ReentrancyGuard">Reentrancy Guard</option>
                <option value="FlashLoanProtection">Flash Loan Protection</option>
                <option value="MEVProtection">MEV Protection</option>
                <option value="AccessControl">Access Control</option>
              </select>
            </div>
          </div>
        </div>

        {/* Traps List */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Registered Traps</h2>
            <p className="text-gray-400 text-sm mt-1">
              Showing {filteredTraps.length} of {traps.length} traps
            </p>
          </div>
          
          {filteredTraps.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Traps Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No traps have been registered yet'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredTraps.map((trap) => (
                <div key={trap.trapId} className="p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Trap Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex items-center gap-2 ${getStatusColor(trap.status, trap.isActive)}`}>
                          {getStatusIcon(trap.status, trap.isActive)}
                          <span className="text-sm font-medium">{trap.status}</span>
                        </div>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {trap.trapType}
                        </span>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                          #{trap.trapId}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{trap.trapName}</h3>
                      <p className="text-gray-400 mb-3">{trap.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Deployed: {formatTimestamp(trap.deploymentTimestamp)}</span>
                        <span>Last Activity: {formatTimestamp(trap.lastActivity)}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-fit">
                      {/* Contract Address */}
                      <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-400">Contract:</span>
                        <span className="font-mono text-sm">{formatAddress(trap.contractAddress)}</span>
                        <button
                          onClick={() => copyToClipboard(trap.contractAddress, `contract-${trap.trapId}`)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedAddress === `contract-${trap.trapId}` ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Deployer Address */}
                      <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-400">Deployer:</span>
                        <span className="font-mono text-sm">{formatAddress(trap.deployer)}</span>
                        <button
                          onClick={() => copyToClipboard(trap.deployer, `deployer-${trap.trapId}`)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedAddress === `deployer-${trap.trapId}` ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* View on Explorer */}
                      <a
                        href={`https://hoodi.etherscan.io/address/${trap.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            All traps are automatically registered upon deployment. 
            Users can then register their own operators to monitor these traps.
          </p>
        </div>
      </div>
    </div>
  );
}
