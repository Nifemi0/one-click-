import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';

interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  type: 'honeypot' | 'sandbox' | 'monitoring' | 'basic';
  complexity: 'simple' | 'medium';
  estimatedCost: string;
  estimatedGas: number;
  features: string[];
}

interface BasicTrap {
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
  createdAt: string;
  deployedAt?: string;
  metadata: any;
}

const BasicTrapDeployment: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  
  const [templates, setTemplates] = useState<TrapTemplate[]>([]);
  const [userTraps, setUserTraps] = useState<BasicTrap[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TrapTemplate | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [showDeploymentForm, setShowDeploymentForm] = useState(false);

  useEffect(() => {
    loadTemplates();
    if (isConnected) {
      loadUserTraps();
    }
  }, [isConnected]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/basic-traps/templates');
      const result = await response.json();
      if (result.success) {
        setTemplates(result.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadUserTraps = async () => {
    try {
      const response = await fetch('/api/basic-traps', {
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
      const response = await fetch('/api/basic-traps/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          trapType: selectedTemplate.type,
          network: chain?.id || 560048, // Default to Hoodi testnet
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">
            🎯 One-Click Trap Deployment
          </h1>
          <p className="text-xl text-gray-300">
            Deploy security traps instantly with pre-built templates
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Trap Templates */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                Available Trap Templates
              </h2>
              
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-600 hover:border-orange-500/50'
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowDeploymentForm(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {template.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.complexity === 'simple' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {template.complexity}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>💰 {template.estimatedCost}</span>
                      <span>⛽ {template.estimatedGas.toLocaleString()}</span>
                      <span>🛡️ {template.features.length} features</span>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Deployment Form & User Traps */}
          <div className="space-y-6">
            {/* Deployment Form */}
            {showDeploymentForm && selectedTemplate && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-orange-500 mb-4">
                  Deploy {selectedTemplate.name}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Trap Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder={selectedTemplate.name}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder={selectedTemplate.description}
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Deployment Summary:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Template:</span>
                        <span className="text-white">{selectedTemplate.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{selectedTemplate.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Complexity:</span>
                        <span className="text-white capitalize">{selectedTemplate.complexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Cost:</span>
                        <span className="text-orange-400 font-medium">{selectedTemplate.estimatedCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Gas:</span>
                        <span className="text-white">{selectedTemplate.estimatedGas.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setShowDeploymentForm(false);
                        setSelectedTemplate(null);
                        setCustomName('');
                        setCustomDescription('');
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeployTrap}
                      disabled={isDeploying}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      {isDeploying ? '🚀 Deploying...' : '🚀 Deploy Trap'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User Traps */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                Your Deployed Traps
              </h2>
              
              {userTraps.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg">No traps deployed yet</p>
                  <p className="text-sm">Select a template above to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTraps.map((trap) => (
                    <div
                      key={trap.id}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {trap.trapName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trap.status)}`}>
                          {getStatusIcon(trap.status)} {trap.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">
                        {trap.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 text-white capitalize">{trap.trapType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Network:</span>
                          <span className="ml-2 text-white">{trap.network}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <span className="ml-2 text-orange-400">{trap.actualCost || trap.estimatedCost}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-2 text-white">{new Date(trap.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {trap.status === 'deployed' && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <div className="text-sm text-green-400">
                            <div><strong>Contract Address:</strong> {trap.contractAddress}</div>
                            <div><strong>Transaction Hash:</strong> {trap.deploymentTxHash}</div>
                            {trap.deployedAt && (
                              <div><strong>Deployed:</strong> {new Date(trap.deployedAt).toLocaleString()}</div>
                            )}
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
      </div>
    </div>
  );
};

export default BasicTrapDeployment;