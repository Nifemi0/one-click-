'use client';

import { useState } from 'react';
import { useWallet } from '../../providers/WalletProvider';
import { Shield, Zap, Eye, Target, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';

// Disable SSR for this page since it uses wallet hooks
export const dynamic = 'force-dynamic';

interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  trapType: string;
  defaultThreshold: number;
  defaultDelay: number;
  price: string;
  features: string[];
  category: string;
}

export default function DroseraTrapsPage() {
  const { isConnected, address, connect } = useWallet();
  const [selectedTemplate, setSelectedTemplate] = useState<TrapTemplate | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<'select' | 'configure' | 'deploying' | 'success'>('select');
  const [deploymentConfig, setDeploymentConfig] = useState({
    activationThreshold: 1,
    responseDelay: 0,
    maxGasLimit: 500000,
    enableMonitoring: true
  });

  const trapTemplates: TrapTemplate[] = [
    {
      id: 'security-trap',
      name: 'SecurityTrap',
      description: 'Advanced security trap with comprehensive attack detection and response mechanisms',
      trapType: 'Security',
      defaultThreshold: 1,
      defaultDelay: 0,
      price: '0.08 ETH',
      features: ['Attack Detection', 'Automated Response', 'Event Logging', 'Emergency Shutdown'],
      category: 'Security'
    },
    {
      id: 'advanced-honeypot',
      name: 'AdvancedHoneypot',
      description: 'Sophisticated honeypot that captures and analyzes attack patterns',
      trapType: 'Honeypot',
      defaultThreshold: 2,
      defaultDelay: 30,
      price: '0.12 ETH',
      features: ['Fund Capture', 'Attack Pattern Analysis', 'Advanced Monitoring', 'Automated Response'],
      category: 'Honeypot'
    },
    {
      id: 'drosera-registry',
      name: 'DroseraRegistry',
      description: 'Central registry for managing and tracking all deployed security traps',
      trapType: 'Registry',
      defaultThreshold: 1,
      defaultDelay: 0,
      price: '0.06 ETH',
      features: ['Trap Registration', 'Status Tracking', 'Performance Metrics', 'Centralized Management'],
      category: 'Registry'
    },
    {
      id: 'flash-loan-protection',
      name: 'FlashLoanProtection',
      description: 'Real-time protection against flash loan attacks with instant blocking',
      trapType: 'Protection',
      defaultThreshold: 3,
      defaultDelay: 60,
      price: '0.10 ETH',
      features: ['Flash Loan Detection', 'Instant Blocking', 'Real-time Monitoring', 'Attack Prevention'],
      category: 'Flash Loan Protection'
    },
    {
      id: 'mev-protection',
      name: 'MEVProtection',
      description: 'Comprehensive MEV protection with transaction ordering and sandwich attack prevention',
      trapType: 'MEVProtection',
      defaultThreshold: 5,
      defaultDelay: 120,
      price: '0.15 ETH',
      features: ['MEV Detection', 'Sandwich Prevention', 'Transaction Ordering', 'Advanced Monitoring'],
      category: 'MEV Protection'
    }
  ];

  const handleTemplateSelect = (template: TrapTemplate) => {
    setSelectedTemplate(template);
    setDeploymentConfig({
      activationThreshold: template.defaultThreshold,
      responseDelay: template.defaultDelay,
      maxGasLimit: 500000,
      enableMonitoring: true
    });
    setDeploymentStep('configure');
  };

  const handleDeployment = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    setDeploymentStep('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStep('success');
    }, 3000);
  };

  const handleBackToSelection = () => {
    setSelectedTemplate(null);
    setDeploymentStep('select');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-8">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Drosera
              </span>
              <span className="text-gray-900 dark:text-white"> Traps</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Deploy intelligent security traps with one-click automation. Protect your DeFi protocols 
              with enterprise-grade security infrastructure.
            </p>
            <button
              onClick={connect}
              className="rounded-md bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 hover:scale-105"
            >
              Connect Wallet to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Drosera
            </span>
            <span className="text-gray-900 dark:text-white"> Traps</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Deploy intelligent security traps with one-click automation. Protect your DeFi protocols 
            with enterprise-grade security infrastructure built on the Drosera framework.
          </p>
        </div>

        {/* Deployment Flow */}
        {deploymentStep === 'select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Trap Template
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Select from our curated collection of security trap templates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trapTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {template.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {template.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {template.price}
                    </span>
                    <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm">
                      Select Template →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {deploymentStep === 'configure' && selectedTemplate && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Configure Your Trap
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Customize the settings for your {selectedTemplate.name}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activation Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={deploymentConfig.activationThreshold}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      activationThreshold: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Number of suspicious activities before trap activates
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Response Delay (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={deploymentConfig.responseDelay}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      responseDelay: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Delay before executing trap response (0 = immediate)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Gas Limit
                  </label>
                  <input
                    type="number"
                    min="100000"
                    max="5000000"
                    step="100000"
                    value={deploymentConfig.maxGasLimit}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      maxGasLimit: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Maximum gas allowed for trap execution
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableMonitoring"
                    checked={deploymentConfig.enableMonitoring}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      enableMonitoring: e.target.checked
                    }))}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableMonitoring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable 24/7 monitoring and alerts
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleBackToSelection}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                >
                  ← Back to Templates
                </button>
                <button
                  onClick={handleDeployment}
                  className="rounded-md bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 hover:scale-105"
                >
                  Deploy Trap
                </button>
              </div>
            </div>
          </div>
        )}

        {deploymentStep === 'deploying' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Deploying Your Trap
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we deploy your security trap to the blockchain...
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {deploymentStep === 'success' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="mx-auto h-24 w-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Trap Deployed Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your security trap is now active and monitoring for threats.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-left">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Deployment Details:</h3>
              <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <p>Template: {selectedTemplate?.name}</p>
                <p>Contract: 0x1234...5678</p>
                <p>Network: Hoodi Testnet</p>
                <p>Status: Active</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeploymentStep('select')}
                className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Deploy Another Trap
              </button>
              <button
                onClick={() => window.location.href = '/app'}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 transition-all duration-200"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
