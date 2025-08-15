'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { 
  CubeIcon, 
  ShieldCheckIcon,
  BoltIcon,
  EyeIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { TrapDeployment } from '@/types';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/components/ui/NotificationToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TrapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { showSuccess, showError } = useNotification();
  
  const [trap, setTrap] = useState<TrapDeployment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadTrap(params.id as string);
    }
  }, [params.id]);

  const loadTrap = async (trapId: string) => {
    try {
      setIsLoading(true);
      // This would normally fetch from your API
      const mockTrap: TrapDeployment = {
        id: trapId,
        name: 'My Rugpull Protection Trap',
        description: 'Advanced protection against rugpull attacks',
        templateId: 'template-123',
        templateName: 'Advanced Rugpull Protection',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        chainId: 560048, // Hoodi testnet
        status: 'active',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        gasUsed: 180000,
        deploymentCost: 0.02,
        alerts: 3,
        threats: 0,
        configuration: {
          threshold: 1000,
          cooldown: 3600,
          maxWithdrawal: 500
        }
      };
      setTrap(mockTrap);
    } catch (error) {
      console.error('Failed to load trap:', error);
      showError('Failed to load trap details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTrap = async () => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }

    try {
      setIsUpdating(true);
      // Navigate to update page
      router.push(`/traps/${trap?.id}/edit`);
      showSuccess('Redirecting to update page...');
    } catch (error) {
      console.error('Update failed:', error);
      showError('Failed to start update');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTrap = async () => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }

    if (!confirm('Are you sure you want to delete this trap? This action cannot be undone.')) {
      return;
    }

    try {
      setIsUpdating(true);
      // This would normally call your API to delete the trap
      showSuccess('Trap deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Deletion failed:', error);
      showError('Failed to delete trap');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!trap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trap Not Found</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'inactive': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      default: return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <BoltIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl font-bold text-white">{trap.name}</h1>
                {getStatusIcon(trap.status)}
              </div>
              <p className="text-xl text-gray-300 mb-6">{trap.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <CubeIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">{trap.templateName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">{trap.alerts} alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <span className="text-white font-medium">{trap.threats} threats</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className={`text-lg font-medium ${getStatusColor(trap.status)}`}>
                Status: {trap.status}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleUpdateTrap}
                  disabled={isUpdating}
                  className="btn-secondary disabled:opacity-50"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
                
                <button
                  onClick={handleDeleteTrap}
                  disabled={isUpdating}
                  className="btn-outline text-red-400 border-red-400 hover:bg-red-400 hover:text-white disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trap Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contract Information */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CubeIcon className="h-5 w-5 text-blue-400 mr-2" />
                Contract Information
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Contract Address:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="bg-gray-900 px-3 py-2 rounded text-sm text-purple-400 font-mono">
                      {trap.contractAddress}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(trap.contractAddress)}
                      className="text-gray-400 hover:text-white"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Chain ID:</span>
                    <div className="text-white font-medium">{trap.chainId}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Gas Used:</span>
                    <div className="text-white font-medium">{trap.gasUsed.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Cog6ToothIcon className="h-5 w-5 text-purple-400 mr-2" />
                Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-400">Threshold:</span>
                  <div className="text-white font-medium">{trap.configuration.threshold}</div>
                </div>
                <div>
                  <span className="text-gray-400">Cooldown:</span>
                  <div className="text-white font-medium">{trap.configuration.cooldown}s</div>
                </div>
                <div>
                  <span className="text-gray-400">Max Withdrawal:</span>
                  <div className="text-white font-medium">{trap.configuration.maxWithdrawal}</div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 text-green-400 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Trap deployed</span>
                  <span className="text-gray-400 text-sm">{new Date(trap.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Last activity</span>
                  <span className="text-gray-400 text-sm">{new Date(trap.lastActivity).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Configuration updated</span>
                  <span className="text-gray-400 text-sm">{new Date(trap.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trap Stats */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Trap Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Deployment Cost:</span>
                  <span className="text-white font-medium">{trap.deploymentCost} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alerts:</span>
                  <span className="text-white font-medium">{trap.alerts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Threats:</span>
                  <span className="text-white font-medium">{trap.threats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white font-medium">{new Date(trap.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push(`/deploy?template=${trap.templateId}`)}
                  className="w-full btn-primary text-sm"
                >
                  Deploy Another
                </button>
                <button 
                  onClick={() => router.push('/marketplace')}
                  className="w-full btn-outline text-sm"
                >
                  Browse Templates
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full btn-outline text-sm"
                >
                  View All Traps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}