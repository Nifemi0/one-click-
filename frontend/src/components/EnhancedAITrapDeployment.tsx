import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ethers } from 'ethers';

interface EnhancedAITrapDeploymentProps {
  isVisible?: boolean; // Control visibility for hidden feature
}

interface DeploymentRequest {
  userPrompt: string;
  complexity: 'simple' | 'medium' | 'advanced' | 'enterprise';
  targetNetwork: number;
  securityLevel: 'basic' | 'premium' | 'enterprise';
  customRequirements: string[];
  budget: number;
  timeline: 'immediate' | '24h' | '48h' | '1week';
  trapType: 'honeypot' | 'sandbox' | 'monitoring' | 'custom';
  monitoringLevel: 'basic' | 'advanced' | 'enterprise';
  alertPreferences: string[];
  customParameters?: Record<string, any>;
}

interface Deployment {
  id: string;
  trapName: string;
  description: string;
  deploymentStatus: string;
  estimatedCost: string;
  aiConfidence: number;
  createdAt: string;
  deployedAt?: string;
  securityFeatures: string[];
  riskAssessment: any;
}

const EnhancedAITrapDeployment: React.FC<EnhancedAITrapDeploymentProps> = ({ 
  isVisible = false 
}) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [showDeploymentForm, setShowDeploymentForm] = useState(false);
  const [deploymentRequest, setDeploymentRequest] = useState<DeploymentRequest>({
    userPrompt: '',
    complexity: 'medium',
    targetNetwork: 560048, // Hoodi testnet
    securityLevel: 'premium',
    customRequirements: [],
    budget: 0.02,
    timeline: '24h',
    trapType: 'honeypot',
    monitoringLevel: 'advanced',
    alertPreferences: ['email']
  });

  // Hide component if not visible (for hidden feature)
  if (!isVisible) {
    return null;
  }

  const handleDeploymentRequest = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!deploymentRequest.userPrompt.trim()) {
      alert('Please enter a description of your trap');
      return;
    }

    setIsDeploying(true);
    try {
      const response = await fetch('/api/enhanced-ai-trap/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(deploymentRequest)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Enhanced AI Trap Deployment started successfully!');
        setShowDeploymentForm(false);
        loadDeployments();
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

  const loadDeployments = async () => {
    try {
      const response = await fetch('/api/enhanced-ai-trap/deployments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setDeployments(result.data);
      }
    } catch (error) {
      console.error('Failed to load deployments:', error);
    }
  };

  const downloadFile = async (deploymentId: string, fileType: string) => {
    try {
      const response = await fetch(`/api/enhanced-ai-trap/deployments/${deploymentId}/files?fileType=${fileType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `${fileType}.${fileType === 'itrap' ? 'json' : fileType}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file');
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadDeployments();
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">
            🚀 Enhanced AI Trap Deployment
          </h1>
          <p className="text-xl text-gray-300">
            Enterprise-grade security traps with AI-powered generation, TOML configuration, and iTrap files
          </p>
          <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-orange-400 font-semibold">
              🎭 Premium Feature - Create sophisticated traps with natural language prompts
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Deployment Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                Create New Trap
              </h2>
              
              {!showDeploymentForm ? (
                <button
                  onClick={() => setShowDeploymentForm(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🎯 Start AI Trap Creation
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Describe Your Trap
                    </label>
                    <textarea
                      value={deploymentRequest.userPrompt}
                      onChange={(e) => setDeploymentRequest({
                        ...deploymentRequest,
                        userPrompt: e.target.value
                      })}
                      placeholder="e.g., Create a sophisticated honeypot that mimics a DeFi yield farming protocol with realistic APY calculations"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Complexity
                      </label>
                      <select
                        value={deploymentRequest.complexity}
                        onChange={(e) => setDeploymentRequest({
                          ...deploymentRequest,
                          complexity: e.target.value as any
                        })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="simple">Simple</option>
                        <option value="medium">Medium</option>
                        <option value="advanced">Advanced</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Security Level
                      </label>
                      <select
                        value={deploymentRequest.securityLevel}
                        onChange={(e) => setDeploymentRequest({
                          ...deploymentRequest,
                          securityLevel: e.target.value as any
                        })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Trap Type
                    </label>
                    <select
                      value={deploymentRequest.trapType}
                      onChange={(e) => setDeploymentRequest({
                        ...deploymentRequest,
                        trapType: e.target.value as any
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="honeypot">Honeypot</option>
                      <option value="sandbox">Sandbox</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget (ETH)
                    </label>
                    <input
                      type="number"
                      value={deploymentRequest.budget}
                      onChange={(e) => setDeploymentRequest({
                        ...deploymentRequest,
                        budget: parseFloat(e.target.value)
                      })}
                      step="0.001"
                      min="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeploymentForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeploymentRequest}
                      disabled={isDeploying}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      {isDeploying ? '🚀 Deploying...' : '🚀 Deploy Trap'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Deployments List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                Your Deployments
              </h2>
              
              {deployments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg">No deployments yet</p>
                  <p className="text-sm">Create your first AI-powered trap above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deployments.map((deployment) => (
                    <div
                      key={deployment.id}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-orange-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDeployment(deployment)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {deployment.trapName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deployment.deploymentStatus === 'deployed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : deployment.deploymentStatus === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {deployment.deploymentStatus}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">
                        {deployment.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>💰 {deployment.estimatedCost}</span>
                          <span>🤖 {deployment.aiConfidence}%</span>
                          <span>🛡️ {deployment.securityFeatures.length} features</span>
                        </div>
                        <span>{new Date(deployment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deployment Details Modal */}
        {selectedDeployment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-orange-500">
                  {selectedDeployment.trapName}
                </h2>
                <button
                  onClick={() => setSelectedDeployment(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Status:</span> {selectedDeployment.deploymentStatus}</p>
                    <p><span className="text-gray-400">Cost:</span> {selectedDeployment.estimatedCost}</p>
                    <p><span className="text-gray-400">AI Confidence:</span> {selectedDeployment.aiConfidence}%</p>
                    <p><span className="text-gray-400">Created:</span> {new Date(selectedDeployment.createdAt).toLocaleString()}</p>
                    {selectedDeployment.deployedAt && (
                      <p><span className="text-gray-400">Deployed:</span> {new Date(selectedDeployment.deployedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Security Features</h3>
                  <div className="space-y-1">
                    {selectedDeployment.securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Download Files</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadFile(selectedDeployment.id, 'toml')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    📄 TOML Config
                  </button>
                  <button
                    onClick={() => downloadFile(selectedDeployment.id, 'itrap')}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🎯 iTrap File
                  </button>
                  <button
                    onClick={() => downloadFile(selectedDeployment.id, 'contract')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🔨 Contract
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Overall Risk:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDeployment.riskAssessment.overallRisk === 'low' 
                        ? 'bg-green-500/20 text-green-400'
                        : selectedDeployment.riskAssessment.overallRisk === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedDeployment.riskAssessment.overallRisk.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Risk Score: {selectedDeployment.riskAssessment.riskScore}/100
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAITrapDeployment;