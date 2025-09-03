"use client";

import React, { useState } from 'react';
import { Shield, Zap, Settings, Code, Network, Target, FileText, Play, CheckCircle, AlertCircle } from 'lucide-react';

interface DeployFormData {
  templateName: string;
  securityLevel: 'basic' | 'advanced' | 'enterprise';
  complexity: 'simple' | 'moderate' | 'complex';
  targetNetwork: string;
  customRequirements: string;
  gasOptimization: boolean;
  auditTrail: boolean;
  emergencyStop: boolean;
}

const DeployForm: React.FC = () => {
  const [formData, setFormData] = useState<DeployFormData>({
    templateName: '',
    securityLevel: 'basic',
    complexity: 'simple',
    targetNetwork: 'ethereum',
    customRequirements: '',
    gasOptimization: true,
    auditTrail: true,
    emergencyStop: true,
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '🔵' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
    { id: 'base', name: 'Base', icon: '🔵' },
    { id: 'optimism', name: 'Optimism', icon: '🔴' },
    { id: 'bsc', name: 'BSC', icon: '🟡' },
  ];

  const securityFeatures = [
    { id: 'gasOptimization', label: 'Gas Optimization', description: 'Reduce deployment and transaction costs' },
    { id: 'auditTrail', label: 'Audit Trail', description: 'Track all security events and actions' },
    { id: 'emergencyStop', label: 'Emergency Stop', description: 'Ability to pause operations if needed' },
  ];

  const handleInputChange = (field: keyof DeployFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    
    // Simulate deployment steps
    for (let i = 0; i <= 4; i++) {
      setDeploymentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsDeploying(false);
    setDeploymentStep(0);
  };

  const deploymentSteps = [
    { title: 'Validating Configuration', icon: CheckCircle, status: 'completed' },
    { title: 'Generating Smart Contract', icon: Code, status: 'completed' },
    { title: 'Compiling Contract', icon: Settings, status: 'completed' },
    { title: 'Deploying to Network', icon: Network, status: 'completed' },
    { title: 'Verifying Deployment', icon: CheckCircle, status: 'completed' },
  ];

  return (
    <section className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="h1 text-charcoal mb-4">
            Deploy Your <span className="text-gradient-primary">Security Trap</span>
          </h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Configure and deploy a custom security trap in minutes. Our AI-powered system 
            generates optimized smart contracts tailored to your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-body">
                <h2 className="h2 text-charcoal mb-6">Configuration</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Template Selection */}
                  <div>
                    <label htmlFor="templateName" className="form-label">
                      <Code className="w-4 h-4 mr-2" />
                      Template Name
                    </label>
                    <input
                      type="text"
                      id="templateName"
                      value={formData.templateName}
                      onChange={(e) => handleInputChange('templateName', e.target.value)}
                      className="form-input"
                      placeholder="e.g., ReentrancyGuard, AccessControl, FlashLoanProtection"
                      required
                    />
                  </div>

                  {/* Security Level & Complexity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="securityLevel" className="form-label">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Level
                      </label>
                      <select
                        id="securityLevel"
                        value={formData.securityLevel}
                        onChange={(e) => handleInputChange('securityLevel', e.target.value)}
                        className="form-select"
                      >
                        <option value="basic">Basic Protection</option>
                        <option value="advanced">Advanced Security</option>
                        <option value="enterprise">Enterprise Grade</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="complexity" className="form-label">
                        <Settings className="w-4 h-4 mr-2" />
                        Complexity
                      </label>
                      <select
                        id="complexity"
                        value={formData.complexity}
                        onChange={(e) => handleInputChange('complexity', e.target.value)}
                        className="form-select"
                      >
                        <option value="simple">Simple</option>
                        <option value="moderate">Moderate</option>
                        <option value="complex">Complex</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Network */}
                  <div>
                    <label className="form-label">
                      <Network className="w-4 h-4 mr-2" />
                      Target Network
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {networks.map((network) => (
                        <label
                          key={network.id}
                          className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:border-primary/30 ${
                            formData.targetNetwork === network.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetNetwork"
                            value={network.id}
                            checked={formData.targetNetwork === network.id}
                            onChange={(e) => handleInputChange('targetNetwork', e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-2xl mb-2">{network.icon}</div>
                          <div className="font-medium text-charcoal">{network.name}</div>
                          {formData.targetNetwork === network.id && (
                            <CheckCircle className="w-5 h-5 text-primary absolute top-2 right-2" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Custom Requirements */}
                  <div>
                    <label htmlFor="customRequirements" className="form-label">
                      <FileText className="w-4 h-4 mr-2" />
                      Custom Requirements
                    </label>
                    <textarea
                      id="customRequirements"
                      value={formData.customRequirements}
                      onChange={(e) => handleInputChange('customRequirements', e.target.value)}
                      rows={4}
                      className="form-input"
                      placeholder="Describe any specific security requirements, integration needs, or custom logic..."
                    />
                  </div>

                  {/* Security Features */}
                  <div>
                    <label className="form-label">
                      <Target className="w-4 h-4 mr-2" />
                      Security Features
                    </label>
                    <div className="space-y-3">
                      {securityFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[feature.id as keyof DeployFormData] as boolean}
                            onChange={(e) => handleInputChange(feature.id as keyof DeployFormData, e.target.checked)}
                            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <div>
                            <div className="font-medium text-charcoal">{feature.label}</div>
                            <div className="text-sm text-gray-600">{feature.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isDeploying}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {isDeploying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Deploy Security Trap
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Deployment Status & Preview */}
          <div className="space-y-6">
            {/* Deployment Status */}
            {isDeploying && (
              <div className="card">
                <div className="card-body">
                  <h3 className="h3 text-charcoal mb-4">Deployment Progress</h3>
                  <div className="space-y-3">
                    {deploymentSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          index <= deploymentStep
                            ? 'bg-success/10 border border-success/20'
                            : 'bg-gray-100'
                        }`}
                      >
                        <step.icon
                          className={`w-5 h-5 ${
                            index <= deploymentStep ? 'text-success' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            index <= deploymentStep ? 'text-success' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Configuration Summary */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 text-charcoal mb-4">Configuration Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-medium text-charcoal">
                      {formData.templateName || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Level:</span>
                    <span className="font-medium text-charcoal capitalize">
                      {formData.securityLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complexity:</span>
                    <span className="font-medium text-charcoal capitalize">
                      {formData.complexity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="font-medium text-charcoal capitalize">
                      {networks.find(n => n.id === formData.targetNetwork)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features:</span>
                    <span className="font-medium text-charcoal">
                      {Object.values(formData).filter(Boolean).length - 4} enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 text-charcoal mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/marketplace" className="btn btn-utility w-full justify-center">
                    🏪 Browse Templates
                  </a>
                  <a href="/docs" className="btn btn-utility w-full justify-center">
                    📚 Documentation
                  </a>
                  <a href="/status" className="btn btn-utility w-full justify-center">
                    📊 System Status
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {!isDeploying && deploymentStep === 4 && (
          <div className="mt-8 text-center">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-8">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="h2 text-charcoal mb-2">Deployment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your security trap has been deployed successfully. You can now monitor and manage it from your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/dashboard" className="btn btn-primary">
                  View Dashboard
                </a>
                <a href="/marketplace" className="btn btn-secondary">
                  Deploy Another
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DeployForm;
