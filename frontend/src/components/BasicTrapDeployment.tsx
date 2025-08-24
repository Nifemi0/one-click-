import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';

interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  type: 'honeypot' | 'sandbox' | 'monitoring' | 'basic';
  complexity: 'basic' | 'medium' | 'advanced';
  estimatedCost: number;
  estimatedGas: number;
  features: string[];
  abi: any[];
  bytecode: string;
  sourceCode: string;
  optimizerRuns: number;
}

interface UserTrap {
  id: string;
  trapType: string;
  trapName: string;
  description: string;
  contractAddress: string;
  deploymentTxHash: string;
  network: number;
  status: 'deploying' | 'deployed' | 'failed';
  estimatedCost: string;
  actualCost?: string;
  createdAt: Date;
  deployedAt?: Date;
  metadata: any;
}

const BasicTrapDeployment: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() || 560048; // Default to Hoodi testnet
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [templates, setTemplates] = useState<TrapTemplate[]>([]);
  const [userTraps, setUserTraps] = useState<UserTrap[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TrapTemplate | null>(null);
  const [showDeploymentForm, setShowDeploymentForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      loadTemplates();
      loadUserTraps();
    }
  }, [isConnected]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://one-click-c308.onrender.com/api/basic-traps/templates');
      const result = await response.json();
      
      if (result.success) {
        setTemplates(result.data);
        console.log('✅ Loaded real contract templates:', result.data);
      } else {
        console.error('Failed to load templates:', result.message);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserTraps = async () => {
    try {
      const response = await fetch('https://one-click-c308.onrender.com/api/basic-traps', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setUserTraps(result.data);
      }
    } catch (error) {
      console.error('Failed to load user traps:', error);
    }
  };

  const handleDeployTrap = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedTemplate) {
      alert('Please select a trap template');
      return;
    }

    setIsDeploying(true);
    try {
      const response = await fetch('https://one-click-c308.onrender.com/api/basic-traps/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          trapType: selectedTemplate.type,
          network: chainId,
          customName: customName || selectedTemplate.name,
          customDescription: customDescription || selectedTemplate.description
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Trap deployment started successfully!');
        setShowDeploymentForm(false);
        setSelectedTemplate(null);
        setCustomName('');
        setCustomDescription('');
        loadUserTraps(); // Refresh user traps
      } else {
        alert(`Deployment failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-orange-500/20 text-orange-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '🔄';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'advanced':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'advanced':
        return '🔥';
      case 'medium':
        return '⚡';
      default:
        return '🟢';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">🔒 Basic Trap Deployment</h1>
            <p className="text-xl text-gray-400 mb-8">
              Deploy security traps with one click using real compiled smart contracts
            </p>
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-300 mb-4">Please connect your wallet to continue</p>
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🔒 Basic Trap Deployment</h1>
          <p className="text-xl text-gray-400">
            Deploy security traps with one click using real compiled smart contracts
          </p>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              🚀 <strong>New:</strong> Now using real compiled Solidity contracts instead of fallback templates!
            </p>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Trap Templates</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all hover:bg-gray-700 border-2 ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <span className={`text-sm ${getComplexityColor(template.complexity)}`}>
                      {getComplexityIcon(template.complexity)} {template.complexity}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-green-400">{template.estimatedCost} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Gas:</span>
                      <span className="text-yellow-400">{template.estimatedGas.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {template.abi && template.abi.length > 0 && (
                    <div className="mt-3 p-2 bg-green-900/20 border border-green-500/30 rounded text-center">
                      <span className="text-green-400 text-xs">✅ Real Compiled Contract</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deployment Form */}
        {selectedTemplate && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Deploy {selectedTemplate.name}</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Name (Optional)</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={selectedTemplate.name}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Description (Optional)</label>
                  <input
                    type="text"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder={selectedTemplate.description}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Deployment Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Template:</span>
                    <span className="ml-2 text-white">{selectedTemplate.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2 text-white capitalize">{selectedTemplate.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Complexity:</span>
                    <span className="ml-2 text-white capitalize">{selectedTemplate.complexity}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Network:</span>
                    <span className="ml-2 text-white">Hoodi Testnet</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Estimated Cost:</span>
                    <span className="ml-2 text-green-400">{selectedTemplate.estimatedCost} ETH</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Estimated Gas:</span>
                    <span className="ml-2 text-yellow-400">{selectedTemplate.estimatedGas.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDeployTrap}
                disabled={isDeploying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isDeploying ? '🚀 Deploying...' : '🚀 Deploy Trap'}
              </button>
            </div>
          </div>
        )}

        {/* User's Traps */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Deployed Traps</h2>
          {userTraps.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No traps deployed yet. Deploy your first trap above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTraps.map((trap) => (
                <div key={trap.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{trap.trapName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(trap.status)}`}>
                      {getStatusIcon(trap.status)} {trap.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{trap.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white capitalize">{trap.trapType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">Hoodi Testnet</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-green-400">{trap.actualCost || trap.estimatedCost} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deployed:</span>
                      <span className="text-white">
                        {trap.deployedAt ? new Date(trap.deployedAt).toLocaleDateString() : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  {trap.contractAddress && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1 text-gray-400">Contract Address</label>
                      <div className="bg-gray-700 rounded px-3 py-2 text-xs font-mono break-all">
                        {trap.contractAddress}
                      </div>
                    </div>
                  )}
                  
                  {trap.deploymentTxHash && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-400">Transaction Hash</label>
                      <div className="bg-gray-700 rounded px-3 py-2 text-xs font-mono break-all">
                        {trap.deploymentTxHash}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicTrapDeployment;