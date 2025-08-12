// Dashboard page showing user's deployed traps and platform overview

'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useUser, useDeployedTraps, useActiveAlerts, useStoreActions } from '@/lib/store';
import { useNotification } from '@/components/ui/NotificationToast';
import { apiClient } from '@/lib/api';
import { formatAddress, getBlockExplorerUrl } from '@/lib/utils';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  ChartBarIcon,
  CubeIcon,
  EyeIcon,
  Cog6ToothIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const user = useUser();
  const deployedTraps = useDeployedTraps();
  const activeAlerts = useActiveAlerts();
  const { setUser, setTraps, setAlerts, setLoading } = useStoreActions();
  const { showSuccess, showError } = useNotification();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTraps: 0,
    activeTraps: 0,
    totalAlerts: 0,
    unacknowledgedAlerts: 0,
  });

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user traps
      const traps = await apiClient.getUserTraps(address!);
      setTraps(traps);
      
      // Load user alerts
      const alerts = await apiClient.getUserAlerts(address!);
      setAlerts(alerts);
      
      // Update stats
      const activeTraps = traps.filter(trap => trap.isActive).length;
      const unacknowledgedAlerts = alerts.filter(alert => !alert.isAcknowledged).length;
      
      setStats({
        totalTraps: traps.length,
        activeTraps,
        totalAlerts: alerts.length,
        unacknowledgedAlerts,
      });
      
      showSuccess('Dashboard loaded successfully');
    } catch (error) {
      console.error('Failed to load user data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await apiClient.acknowledgeAlert(alertId);
      // Update local state
      const updatedAlerts = activeAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
      );
      setAlerts(updatedAlerts);
      showSuccess('Alert acknowledged');
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      showError('Failed to acknowledge alert');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Connect Wallet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please connect your wallet to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Loading dashboard..." />;
  }

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
                  <dd className="text-2xl font-semibold text-white">{stats.totalTraps}</dd>
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
                  <dd className="text-2xl font-semibold text-white">{stats.activeTraps}</dd>
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
                  <dd className="text-2xl font-semibold text-white">{stats.totalAlerts}</dd>
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
                  <dd className="text-2xl font-semibold text-white">{stats.unacknowledgedAlerts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/deploy"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Deploy New Trap
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20"
            >
              <CubeIcon className="h-4 w-4 mr-2" />
              Browse Templates
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </div>
        </div>

        {/* Deployed Traps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Deployed Traps</h2>
            <Link
              href="/deploy"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Deploy New →
            </Link>
          </div>
          
          {deployedTraps.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 text-center border border-white/10">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-300">No traps deployed</h3>
              <p className="mt-1 text-sm text-gray-400">
                Get started by deploying your first security trap.
              </p>
              <div className="mt-6">
                <Link
                  href="/deploy"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Deploy First Trap
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deployedTraps.map((trap) => (
                <div key={trap.id} className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-sm font-medium text-white">
                        {trap.template?.name || 'Custom Trap'}
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
                      href={getBlockExplorerUrl(trap.contractAddress, trap.chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded hover:bg-white/20 transition-colors"
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      View
                    </a>
                    <Link
                      href={`/traps/${trap.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                    >
                      <Cog6ToothIcon className="h-3 w-3 mr-1" />
                      Configure
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
          
          {activeAlerts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 text-center border border-white/10">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-300">No active alerts</h3>
              <p className="mt-1 text-sm text-gray-400">
                All clear! Your traps are working perfectly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
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
          )}
        </div>
      </div>
    </div>
  );
}