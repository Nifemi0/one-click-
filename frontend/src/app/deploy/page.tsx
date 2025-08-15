'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CubeIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const deploymentSteps = [
  {
    id: 1,
    title: 'Select Template',
    description: 'Choose from our curated security trap templates',
    icon: CubeIcon,
  },
  {
    id: 2,
    title: 'Configure Parameters',
    description: 'Set security thresholds and monitoring rules',
    icon: Cog6ToothIcon,
  },
  {
    id: 3,
    title: 'Deploy & Monitor',
    description: 'Deploy your trap and start monitoring threats',
    icon: ShieldCheckIcon,
  },
];

const securityTemplates = [
  {
    id: 'rugpull-basic',
    name: 'Rugpull Protection',
    description: 'Detect and prevent rugpull attacks on DeFi protocols',
    complexity: 'Basic',
    deploymentFee: '0.001',
    monthlyFee: '0.0005',
    features: ['Transaction monitoring', 'Liquidity tracking', 'Owner change detection'],
    icon: '🛡️',
  },
  {
    id: 'governance-shield',
    name: 'Governance Attack Shield',
    description: 'Protect against governance attacks and voting manipulation',
    complexity: 'Intermediate',
    deploymentFee: '0.002',
    monthlyFee: '0.001',
    features: ['Voting pattern analysis', 'Proposal monitoring', 'Multi-sig protection'],
    icon: '🏛️',
  },
  {
    id: 'oracle-guard',
    name: 'Oracle Manipulation Guard',
    description: 'Detect oracle price manipulation and flash loan attacks',
    complexity: 'Advanced',
    deploymentFee: '0.003',
    monthlyFee: '0.0015',
    features: ['Price deviation detection', 'Flash loan monitoring', 'MEV protection'],
    icon: '🔮',
  },
];

export default function DeployPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [deploymentConfig, setDeploymentConfig] = useState({
    targetContract: '',
    threshold: '1000',
    cooldown: '3600',
    monitoringLevel: 'standard',
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep(2);
  };

  const handleDeploy = () => {
    // Simulate deployment
    setCurrentStep(3);
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Choose Your Security Template</h2>
              <p className="text-gray-300">Select from our pre-audited security trap templates</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {securityTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{template.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{template.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Complexity:</span>
                      <span className="text-white">{template.complexity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deployment:</span>
                      <span className="text-orange-400">{template.deploymentFee} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly:</span>
                      <span className="text-orange-400">{template.monthlyFee} ETH</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <CheckIcon className="h-4 w-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Select Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Configure Your Security Trap</h2>
              <p className="text-gray-300">Set the parameters for your security trap deployment</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Target Contract Address
                  </label>
                  <input
                    type="text"
                    value={deploymentConfig.targetContract}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, targetContract: e.target.value }))}
                    placeholder="0x..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Security Threshold (ETH)
                  </label>
                  <input
                    type="number"
                    value={deploymentConfig.threshold}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, threshold: e.target.value }))}
                    placeholder="1000"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Cooldown Period (seconds)
                  </label>
                  <input
                    type="number"
                    value={deploymentConfig.cooldown}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, cooldown: e.target.value }))}
                    placeholder="3600"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Monitoring Level
                  </label>
                  <select
                    value={deploymentConfig.monitoringLevel}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, monitoringLevel: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDeploy}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  Deploy Security Trap
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-12 border border-white/10">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">Deploying Your Security Trap</h2>
              <p className="text-gray-300 mb-8">Please wait while we deploy your security trap to the blockchain...</p>
              
              <div className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deploying...
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                This may take a few minutes. You&apos;ll be redirected to your dashboard once complete.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Deploy Security Trap</h1>
          <p className="text-xl text-gray-300">
            Protect your DeFi investments with intelligent security traps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {deploymentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                
                {index < deploymentSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            {deploymentSteps.map((step, index) => (
              <div key={step.id} className={`text-center ${index === 0 ? 'ml-0' : 'ml-16'}`}>
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}
      </div>
    </div>
  );
}