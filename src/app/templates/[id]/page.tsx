'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { 
  CubeIcon, 
  StarIcon,
  EyeIcon,
  BoltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  CodeBracketIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { TrapTemplate } from '@/types';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/components/ui/NotificationToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { showSuccess, showError } = useNotification();
  
  const [template, setTemplate] = useState<TrapTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadTemplate(params.id as string);
    }
  }, [params.id]);

  const loadTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      // This would normally fetch from your API
      const mockTemplate: TrapTemplate = {
        id: templateId,
        name: 'Advanced Rugpull Protection',
        description: 'Sophisticated protection against rugpull attacks with multi-layered security mechanisms.',
        category: 'rugpull',
        complexity: 'advanced',
        rating: 4.8,
        deployments: 127,
        price: 0.05,
        creator: '0x1234...5678',
        audited: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        code: '// Smart contract code would go here',
        abi: [],
        gasEstimate: 250000,
        securityFeatures: [
          'Multi-signature requirements',
          'Time-locked withdrawals',
          'Emergency pause functionality',
          'Automated threat detection'
        ]
      };
      setTemplate(mockTemplate);
    } catch (error) {
      console.error('Failed to load template:', error);
      showError('Failed to load template details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }

    try {
      setIsDeploying(true);
      // Navigate to deploy page with this template pre-selected
      router.push(`/deploy?template=${template?.id}`);
      showSuccess('Redirecting to deployment...');
    } catch (error) {
      console.error('Deployment failed:', error);
      showError('Failed to start deployment');
    } finally {
      setIsDeploying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Template Not Found</h1>
          <button 
            onClick={() => router.push('/marketplace')}
            className="btn-primary"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/marketplace')}
            className="inline-flex items-center text-gray-400 hover:text-white mb-4"
          >
            <BoltIcon className="h-4 w-4 mr-2" />
            Back to Marketplace
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{template.name}</h1>
              <p className="text-xl text-gray-300 mb-6">{template.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-medium">{template.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CubeIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">{template.deployments} deployments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">{template.price} ETH</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              {template.audited && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Audited</span>
                </div>
              )}
              
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="btn-primary text-lg px-8 py-4 disabled:opacity-50"
              >
                {isDeploying ? 'Preparing...' : '🚀 Deploy Template'}
              </button>
            </div>
          </div>
        </div>

        {/* Template Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Security Features */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-purple-400 mr-2" />
                Security Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {template.securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CodeBracketIcon className="h-5 w-5 text-blue-400 mr-2" />
                Code Preview
              </h3>
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
                <code>{template.code}</code>
              </pre>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Template Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white capitalize">{template.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Complexity:</span>
                  <span className="text-white capitalize">{template.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gas Estimate:</span>
                  <span className="text-white">{template.gasEstimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserIcon className="h-5 w-5 text-purple-400 mr-2" />
                Creator
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Address:</span>
                <span className="text-purple-400 font-mono">{template.creator}</span>
              </div>
            </div>

            {/* Deployment Stats */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CubeIcon className="h-5 w-5 text-blue-400 mr-2" />
                Deployment Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Deployments:</span>
                  <span className="text-white font-medium">{template.deployments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-white font-medium">{template.rating.toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-medium">{template.price} ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}