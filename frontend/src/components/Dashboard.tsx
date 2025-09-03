"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  Settings,
  Download,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

interface SecurityTrap {
  id: string;
  name: string;
  network: string;
  status: 'active' | 'paused' | 'alert' | 'maintenance';
  securityLevel: 'basic' | 'advanced' | 'enterprise';
  lastActivity: string;
  threatsBlocked: number;
  gasUsed: string;
  balance: string;
  deployedAt: string;
}

const Dashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const securityTraps: SecurityTrap[] = [
    {
      id: '1',
      name: 'ReentrancyGuard',
      network: 'Ethereum',
      status: 'active',
      securityLevel: 'enterprise',
      lastActivity: '2 minutes ago',
      threatsBlocked: 47,
      gasUsed: '0.023 ETH',
      balance: '2.5 ETH',
      deployedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'AccessControl',
      network: 'Polygon',
      status: 'active',
      securityLevel: 'advanced',
      lastActivity: '5 minutes ago',
      threatsBlocked: 23,
      gasUsed: '0.015 MATIC',
      balance: '1500 MATIC',
      deployedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'FlashLoanProtection',
      network: 'Arbitrum',
      status: 'alert',
      securityLevel: 'enterprise',
      lastActivity: '1 minute ago',
      threatsBlocked: 89,
      gasUsed: '0.008 ETH',
      balance: '0.8 ETH',
      deployedAt: '2024-01-10'
    },
    {
      id: '4',
      name: 'RateLimiter',
      network: 'Base',
      status: 'paused',
      securityLevel: 'basic',
      lastActivity: '1 hour ago',
      threatsBlocked: 12,
      gasUsed: '0.005 ETH',
      balance: '0.3 ETH',
      deployedAt: '2024-01-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'alert': return 'text-error';
      case 'maintenance': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Clock className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 border-success/20';
      case 'paused': return 'bg-warning/10 border-warning/20';
      case 'alert': return 'bg-error/10 border-error/20';
      case 'maintenance': return 'bg-gray-100 border-gray-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const filteredTraps = securityTraps.filter(trap => {
    const matchesFilter = selectedFilter === 'all' || trap.status === selectedFilter;
    const matchesSearch = trap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trap.network.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalThreatsBlocked = securityTraps.reduce((sum, trap) => sum + trap.threatsBlocked, 0);
  const totalBalance = securityTraps.reduce((sum, trap) => {
    const balance = parseFloat(trap.balance.split(' ')[0]);
    return sum + balance;
  }, 0);

  return (
    <section className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="h1 text-charcoal mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your deployed security traps</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Traps</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {securityTraps.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Threats Blocked</p>
                  <p className="text-2xl font-bold text-charcoal">{totalThreatsBlocked}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-charcoal">{totalBalance.toFixed(2)} ETH</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Networks</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {new Set(securityTraps.map(t => t.network)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search traps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="alert">Alert</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <a href="/deploy" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Deploy New Trap
              </a>
            </div>
          </div>
        </div>

        {/* Security Traps Table */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="h2 text-charcoal">Security Traps</h2>
              <div className="flex items-center gap-2">
                <button className="btn btn-utility">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
                <button className="btn btn-utility">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {filteredTraps.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="h3 text-gray-600 mb-2">No security traps found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Deploy your first security trap to get started'
                  }
                </p>
                {!searchQuery && selectedFilter === 'all' && (
                  <a href="/deploy" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Deploy First Trap
                  </a>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Network</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Security Level</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Threats Blocked</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Balance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Last Activity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTraps.map((trap) => (
                      <tr key={trap.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-charcoal">{trap.name}</div>
                            <div className="text-sm text-gray-500">ID: {trap.id}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {trap.network}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBg(trap.status)} ${getStatusColor(trap.status)}`}>
                            {getStatusIcon(trap.status)}
                            {trap.status.charAt(0).toUpperCase() + trap.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trap.securityLevel === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                            trap.securityLevel === 'advanced' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {trap.securityLevel.charAt(0).toUpperCase() + trap.securityLevel.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-charcoal">{trap.threatsBlocked}</span>
                            <TrendingUp className="w-4 h-4 text-success" />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-charcoal">{trap.balance}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-500">{trap.lastActivity}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="btn btn-utility btn-sm">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="btn btn-utility btn-sm">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="btn btn-utility btn-sm text-error hover:bg-error/10">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="h3 text-charcoal mb-2">Security Audit</h3>
              <p className="text-gray-600 mb-4">
                Run comprehensive security audits on your deployed traps
              </p>
              <button className="btn btn-primary w-full">Run Audit</button>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-success" />
              </div>
              <h3 className="h3 text-charcoal mb-2">Performance Report</h3>
              <p className="text-gray-600 mb-4">
                Get detailed performance analytics and insights
              </p>
              <button className="btn btn-secondary w-full">Generate Report</button>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-warning" />
              </div>
              <h3 className="h3 text-charcoal mb-2">Bulk Operations</h3>
              <p className="text-gray-600 mb-4">
                Manage multiple traps simultaneously
              </p>
              <button className="btn btn-utility w-full">Manage All</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
