'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  ChartBarIcon,
  CubeIcon,
  EyeIcon,
  Cog6ToothIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const mockStats = {
  totalTraps: 3,
  activeTraps: 2,
  totalAlerts: 5,
  unacknowledgedAlerts: 1,
};

const mockTraps = [
  {
    id: '1',
    name: 'Rugpull Protection',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    chainId: 1,
    isActive: true,
    deployedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Governance Attack Shield',
    contractAddress: '0x8ba1f109551bD432803012645Hac136c772c37c0',
    chainId: 1,
    isActive: true,
    deployedAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Oracle Manipulation Guard',
    contractAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    isActive: false,
    deployedAt: '2024-01-05',
  },
];

const mockAlerts = [
  {
    id: '1',
    alertType: 'SUSPICIOUS_ACTIVITY',
    severity: 'high',
    message: 'Unusual transaction pattern detected in target contract',
    createdAt: '2024-01-20T10:30:00Z',
    isAcknowledged: false,
  },
  {
    id: '2',
    alertType: 'THRESHOLD_BREACH',
    severity: 'medium',
    message: 'Transaction volume exceeded configured threshold',
    createdAt: '2024-01-19T15:45:00Z',
    isAcknowledged: true,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(mockAlerts);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
    ));
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getBlockExplorerUrl = (address: string) => {
    return `https://etherscan.io/address/${address}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-gray-300">
            Monitor your deployed security traps and stay updated on threats
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Total Traps</dt>
                  <dd className="text-2xl font-semibold text-white">{mockStats.totalTraps}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Active Traps</dt>
                  <dd className="text-2xl font-semibold text-white">{mockStats.activeTraps}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Total Alerts</dt>
                  <dd className="text-2xl font-semibold text-white">{mockStats.totalAlerts}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">Unread Alerts</dt>
                  <dd className="text-2xl font-semibold text-white">{mockStats.unacknowledgedAlerts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/deploy')}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Deploy New Trap
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20"
            >
              <CubeIcon className="h-4 w-4 mr-2" />
              Browse Templates
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Pricing
            </button>
          </div>
        </div>

        {/* Deployed Traps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Deployed Traps</h2>
            <button
              onClick={() => router.push('/deploy')}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Deploy New →
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockTraps.map((trap) => (
              <div key={trap.id} className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-white">
                      {trap.name}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trap.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                  }`}>
                    {trap.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">Target:</span> {formatAddress(trap.contractAddress)}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">Network:</span> {trap.chainId}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">Deployed:</span> {new Date(trap.deployedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={getBlockExplorerUrl(trap.contractAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded hover:bg-white/20 transition-colors"
                  >
                    <EyeIcon className="h-3 w-3 mr-1" />
                    View
                  </a>
                  <button
                    onClick={() => router.push(`/deploy`)}
                    className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                  >
                    <Cog6ToothIcon className="h-3 w-3 mr-1" />
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{alert.alertType.replace('_', ' ').toUpperCase()}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                    <div className="text-xs text-gray-400">
                      {new Date(alert.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  {!alert.isAcknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="ml-4 inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}