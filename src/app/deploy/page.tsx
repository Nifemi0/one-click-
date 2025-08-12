// Deployment page with multi-step wizard for deploying security traps

'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import { useTrapTemplates, useStoreActions } from '@/lib/store';
import { useNotification } from '@/components/ui/NotificationToast';
import { apiClient } from '@/lib/api';
import { TrapTemplate, TrapDeploymentParams, DeploymentResult } from '@/types';
import { DEPLOYMENT_STEPS, SUPPORTED_CHAINS, GAS_LIMITS } from '@/lib/constants';
import { isValidAddress, formatAddress, getNetworkInfo } from '@/lib/utils';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BoltIcon,
  EyeIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface DeploymentState {
  currentStep: number;
  contractAddress: string;
  selectedChain: number;
  selectedTemplate: TrapTemplate | null;
  gasLimit: number;
  gasPrice: string;
  isAnalyzing: boolean;
  isDeploying: boolean;
  analysisResult: any;
  deploymentResult: DeploymentResult | null;
}

export default function DeployPage() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({ address });
  const templates = useTrapTemplates();
  const { setTemplates, setLoading } = useStoreActions();
  const { showSuccess, showError, showWarning } = useNotification();
  
  const [deploymentState, setDeploymentState] = useState<DeploymentState>({
    currentStep: 0,
    contractAddress: '',
    selectedChain: chain?.id || 1,
    selectedTemplate: null,
    gasLimit: GAS_LIMITS.MEDIUM,
    gasPrice: '20000000000', // 20 gwei
    isAnalyzing: false,
    isDeploying: false,
    analysisResult: null,
    deploymentResult: null,
  });

  useEffect(() => {
    if (templates.length === 0) {
      loadTemplates();
    }
  }, []);

  useEffect(() => {
    if (chain) {
      setDeploymentState(prev => ({ ...prev, selectedChain: chain.id }));
    }
  }, [chain]);

  const loadTemplates = async () => {
    try {
      const marketplaceTemplates = await apiClient.getMarketplaceTemplates();
      setTemplates(marketplaceTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      showError('Failed to load templates');
    }
  };

  const nextStep = () => {
    if (deploymentState.currentStep < DEPLOYMENT_STEPS.length - 1) {
      setDeploymentState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (deploymentState.currentStep > 0) {
      setDeploymentState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const analyzeContract = async () => {
    if (!deploymentState.contractAddress || !isValidAddress(deploymentState.contractAddress)) {
      showError('Please enter a valid contract address');
      return;
    }

    try {
      setDeploymentState(prev => ({ ...prev, isAnalyzing: true }));
      setLoading(true);

      const analysis = await apiClient.analyzeContract(
        deploymentState.contractAddress,
        deploymentState.selectedChain
      );

      setDeploymentState(prev => ({ 
        ...prev, 
        analysisResult: analysis,
        isAnalyzing: false 
      }));

      showSuccess('Contract analysis completed');
      nextStep();
    } catch (error) {
      console.error('Contract analysis failed:', error);
      showError('Failed to analyze contract');
      setDeploymentState(prev => ({ ...prev, isAnalyzing: false }));
    } finally {
      setLoading(false);
    }
  };

  const deployTrap = async () => {
    if (!deploymentState.selectedTemplate) {
      showError('Please select a template');
      return;
    }

    try {
      setDeploymentState(prev => ({ ...prev, isDeploying: true }));
      setLoading(true);

      const deploymentParams: TrapDeploymentParams = {
        templateId: deploymentState.selectedTemplate.id,
        targetContract: deploymentState.contractAddress,
        chainId: deploymentState.selectedChain,
        configuration: {
          targetContract: deploymentState.contractAddress,
          vulnerabilityType: deploymentState.selectedTemplate.category,
          gasLimit: deploymentState.gasLimit,
        },
        gasLimit: deploymentState.gasLimit,
        gasPrice: deploymentState.gasPrice,
      };

      const result = await apiClient.deployTrap(deploymentParams);

      setDeploymentState(prev => ({ 
        ...prev, 
        deploymentResult: result,
        isDeploying: false 
      }));

      if (result.success) {
        showSuccess('Trap deployed successfully!');
        nextStep();
      } else {
        showError(result.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Trap deployment failed:', error);
      showError('Failed to deploy trap');
      setDeploymentState(prev => ({ ...prev, isDeploying: false }));
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (deploymentState.currentStep) {
      case 0: // Contract Analysis
        return deploymentState.contractAddress && isValidAddress(deploymentState.contractAddress);
      case 1: // Vulnerability Assessment
        return deploymentState.analysisResult;
      case 2: // Trap Selection
        return deploymentState.selectedTemplate;
      case 3: // Configuration
        return true;
      case 4: // Gas Estimation
        return deploymentState.gasLimit > 0;
      case 5: // Deployment
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const { currentStep } = deploymentState;

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Target Contract Address</h3>
              <p className="text-gray-300 mb-4">
                Enter the address of the contract you want to protect. We'll analyze it for vulnerabilities.
              </p>
              <input
                type="text"
                placeholder="0x..."
                value={deploymentState.contractAddress}
                onChange={(e) => setDeploymentState(prev => ({ ...prev, contractAddress: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Network</h3>
              <select
                value={deploymentState.selectedChain}
                onChange={(e) => setDeploymentState(prev => ({ ...prev, selectedChain: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.values(SUPPORTED_CHAINS).map((network) => (
                  <option key={network.chainId} value={network.chainId}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Vulnerability Assessment</h3>
              <p className="text-gray-300 mb-4">
                Based on our analysis, here are the security risks we found:
              </p>
            </div>

            {deploymentState.analysisResult && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-white">Risk Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    deploymentState.analysisResult.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                    deploymentState.analysisResult.riskScore >= 60 ? 'bg-orange-100 text-orange-800' :
                    deploymentState.analysisResult.riskScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {deploymentState.analysisResult.riskScore}/100
                  </span>
                </div>

                <div className="space-y-3">
                  {deploymentState.analysisResult.vulnerabilities?.map((vuln: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">{vuln.type}</p>
                        <p className="text-gray-300 text-sm">{vuln.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Select Security Trap</h3>
              <p className="text-gray-300 mb-4">
                Choose the appropriate security trap based on the vulnerabilities found:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {templates
                .filter(template => 
                  deploymentState.analysisResult?.recommendations?.some((rec: any) => 
                    rec.type === template.category
                  )
                )
                .map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      deploymentState.selectedTemplate?.id === template.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    onClick={() => setDeploymentState(prev => ({ ...prev, selectedTemplate: template }))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <span className="text-sm text-gray-400">{template.complexity}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{template.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-purple-400">{template.price} ETH</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Trap Configuration</h3>
              <p className="text-gray-300 mb-4">
                Customize your security trap settings:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gas Limit</label>
                <select
                  value={deploymentState.gasLimit}
                  onChange={(e) => setDeploymentState(prev => ({ ...prev, gasLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={GAS_LIMITS.LOW}>Low ({GAS_LIMITS.LOW.toLocaleString()})</option>
                  <option value={GAS_LIMITS.MEDIUM}>Medium ({GAS_LIMITS.MEDIUM.toLocaleString()})</option>
                  <option value={GAS_LIMITS.HIGH}>High ({GAS_LIMITS.HIGH.toLocaleString()})</option>
                  <option value={GAS_LIMITS.CUSTOM}>Custom</option>
                </select>
              </div>

              {deploymentState.gasLimit === GAS_LIMITS.CUSTOM && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Custom Gas Limit</label>
                  <input
                    type="number"
                    placeholder="Enter custom gas limit"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gas Price (Gwei)</label>
                <input
                  type="text"
                  value={Number(deploymentState.gasPrice) / 1e9}
                  onChange={(e) => setDeploymentState(prev => ({ 
                    ...prev, 
                    gasPrice: (Number(e.target.value) * 1e9).toString() 
                  }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Gas Estimation</h3>
              <p className="text-gray-300 mb-4">
                Estimated deployment costs:
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Gas Limit:</span>
                  <span className="text-white">{deploymentState.gasLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gas Price:</span>
                  <span className="text-white">{(Number(deploymentState.gasPrice) / 1e9).toFixed(2)} Gwei</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated Cost:</span>
                  <span className="text-white">
                    {((deploymentState.gasLimit * Number(deploymentState.gasPrice)) / 1e18).toFixed(6)} ETH
                  </span>
                </div>
                {balance && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Your Balance:</span>
                    <span className="text-white">{Number(balance.formatted).toFixed(4)} {balance.symbol}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Deploy Security Trap</h3>
              <p className="text-gray-300 mb-4">
                Review your configuration and deploy:
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Target Contract:</span>
                  <span className="text-white font-mono">{formatAddress(deploymentState.contractAddress)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Network:</span>
                  <span className="text-white">{getNetworkInfo(deploymentState.selectedChain).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Template:</span>
                  <span className="text-white">{deploymentState.selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gas Limit:</span>
                  <span className="text-white">{deploymentState.gasLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated Cost:</span>
                  <span className="text-white">
                    {((deploymentState.gasLimit * Number(deploymentState.gasPrice)) / 1e18).toFixed(6)} ETH
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-400" />
            <h3 className="text-2xl font-bold text-white">Deployment Complete!</h3>
            <p className="text-gray-300">
              Your security trap has been deployed successfully.
            </p>

            {deploymentState.deploymentResult && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Transaction Hash:</span>
                    <span className="text-white font-mono text-sm">
                      {formatAddress(deploymentState.deploymentResult.transactionHash || '')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Trap Address:</span>
                    <span className="text-white font-mono text-sm">
                      {formatAddress(deploymentState.deploymentResult.trapAddress || '')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Gas Used:</span>
                    <span className="text-white">{deploymentState.deploymentResult.gasUsed?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
              >
                View Dashboard
              </Link>
              <Link
                href="/deploy"
                className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-colors border border-white/20"
              >
                Deploy Another
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Connect Wallet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please connect your wallet to deploy security traps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Deploy Security Trap</h1>
          <p className="mt-2 text-gray-300">
            Follow the steps below to deploy your security trap
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {DEPLOYMENT_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index < deploymentState.currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === deploymentState.currentStep
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-400'
                }`}>
                  {index < deploymentState.currentStep ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < DEPLOYMENT_STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    index < deploymentState.currentStep ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-white">
              {DEPLOYMENT_STEPS[deploymentState.currentStep].title}
            </h3>
            <p className="text-gray-300">
              {DEPLOYMENT_STEPS[deploymentState.currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {deploymentState.currentStep < DEPLOYMENT_STEPS.length - 1 && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={deploymentState.currentStep === 0}
              className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-medium rounded-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/20"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>

            <button
              onClick={() => {
                if (deploymentState.currentStep === 0) {
                  analyzeContract();
                } else if (deploymentState.currentStep === 5) {
                  deployTrap();
                } else {
                  nextStep();
                }
              }}
              disabled={!canProceed() || deploymentState.isAnalyzing || deploymentState.isDeploying}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deploymentState.isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Analyzing...
                </>
              ) : deploymentState.isDeploying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Deploying...
                </>
              ) : deploymentState.currentStep === 5 ? (
                <>
                  <BoltIcon className="h-4 w-4 mr-2" />
                  Deploy Trap
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}