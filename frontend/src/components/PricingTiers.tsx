'use client';

import { useState } from 'react';

interface PricingTier {
  name: string;
  deploymentFee: number;
  monthlyFee: number;
  features: string[];
  gasMultiplier: number;
  supportLevel: 'basic' | 'premium' | 'enterprise' | '24_7';
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    deploymentFee: 0.005,
    monthlyFee: 0.015,
    features: [
      'Basic monitoring',
      'Standard reports', 
      'Email support',
      'Basic analytics'
    ],
    gasMultiplier: 1.0,
    supportLevel: 'basic'
  },
  {
    name: 'Premium',
    deploymentFee: 0.01,
    monthlyFee: 0.03,
    features: [
      'Advanced monitoring',
      'AI-powered analysis',
      'Priority support',
      'Testnet analytics',
      'Custom alerts'
    ],
    gasMultiplier: 1.5,
    supportLevel: 'premium',
    popular: true
  },
  {
    name: 'Custom',
    deploymentFee: 0.015,
    monthlyFee: 0.045,
    features: [
      'Custom configuration',
      'Advanced AI analysis',
      'Custom reports',
      'Sandbox environment',
      'API access'
    ],
    gasMultiplier: 1.8,
    supportLevel: 'premium'
  },
  {
    name: 'Enterprise',
    deploymentFee: 0.025,
    monthlyFee: 0.05,
    features: [
      'Enterprise monitoring',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
      'SLA guarantees'
    ],
    gasMultiplier: 2.0,
    supportLevel: 'enterprise'
  },
  {
    name: '24/7 Support',
    deploymentFee: 0.03,
    monthlyFee: 0.075,
    features: [
      '24/7 monitoring',
      'Instant alerts',
      'Phone support',
      'Emergency response',
      'Custom integrations'
    ],
    gasMultiplier: 2.5,
    supportLevel: '24_7'
  }
];

const additionalFeatures = [
  { name: 'AI Analysis', price: 0.005, description: 'Per analysis' },
  { name: 'Advanced Reports', price: 0.003, description: 'Per report' },
  { name: 'Priority Support', price: 0.015, description: 'Per month' },
  { name: 'Testnet Analytics', price: 0.008, description: 'Per month' },
  { name: 'Sandbox Environment', price: 0.02, description: 'Per month' },
  { name: 'Fast Track Deployment', price: 0.01, description: 'Per deployment' },
  { name: 'Custom Integration', price: 0.025, description: 'One-time' }
 ];

export default function PricingTiers() {
  const [selectedTier, setSelectedTier] = useState<string>('premium');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const selectedTierData = pricingTiers.find(tier => tier.name.toLowerCase() === selectedTier);
  
  const totalDeploymentCost = selectedTierData ? 
    selectedTierData.deploymentFee + 
    selectedFeatures.reduce((total, feature) => {
      const featureData = additionalFeatures.find(f => f.name === feature);
      return total + (featureData?.price || 0);
    }, 0) : 0;

  const totalMonthlyCost = selectedTierData ? 
    selectedTierData.monthlyFee + 
    selectedFeatures.filter(feature => 
      ['Priority Support', 'Testnet Analytics', 'Sandbox Environment'].includes(feature)
    ).reduce((total, feature) => {
      const featureData = additionalFeatures.find(f => f.name === feature);
      return total + (featureData?.price || 0);
    }, 0) : 0;

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName) 
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    );
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Premium Testnet Pricing</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced security features for serious developers and enterprises. 
            Testnet deployments include premium monitoring and AI analysis.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`card relative ${
                tier.popular 
                  ? 'border-orange-500 ring-2 ring-orange-500/20 glow-orange' 
                  : 'border-gray-800'
              } ${selectedTier === tier.name.toLowerCase() ? 'ring-2 ring-orange-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-orange-500">
                    {tier.deploymentFee}
                  </span>
                  <span className="text-gray-400"> ETH</span>
                  <div className="text-sm text-gray-500">deployment</div>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-white">
                    {tier.monthlyFee}
                  </span>
                  <span className="text-gray-400"> ETH</span>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Gas multiplier: {tier.gasMultiplier}x
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-300">
                    <span className="text-orange-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedTier(tier.name.toLowerCase())}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  selectedTier === tier.name.toLowerCase()
                    ? 'bg-orange-500 text-white'
                    : 'btn-outline'
                }`}
              >
                {selectedTier === tier.name.toLowerCase() ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Additional Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.name}
                className={`card cursor-pointer transition-all duration-200 ${
                  selectedFeatures.includes(feature.name)
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'hover:border-gray-700'
                }`}
                onClick={() => toggleFeature(feature.name)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{feature.name}</h4>
                  <span className="text-orange-500 font-bold">
                    {feature.price} ETH
                  </span>
                </div>
                <p className="text-sm text-gray-400">{feature.description}</p>
                <div className="mt-3">
                  <span className={`inline-block w-4 h-4 rounded border-2 ${
                    selectedFeatures.includes(feature.name)
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-gray-600'
                  }`}>
                    {selectedFeatures.includes(feature.name) && (
                      <span className="text-white text-xs flex items-center justify-center">✓</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Cost Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Selected Plan:</span>
              <span className="font-semibold">{selectedTierData?.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Deployment Fee:</span>
                                <span className="font-semibold text-orange-500">
                    {selectedTierData?.deploymentFee} ETH
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Fee:</span>
                  <span className="font-semibold text-orange-500">
                    {selectedTierData?.monthlyFee} ETH
                  </span>
                </div>
            
            {selectedFeatures.length > 0 && (
              <>
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-gray-300 mb-2">Additional Features:</div>
                  {selectedFeatures.map((feature) => {
                    const featureData = additionalFeatures.find(f => f.name === feature);
                    return (
                      <div key={feature} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{feature}</span>
                        <span className="text-orange-500">
                          {featureData?.price} ETH
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Deployment Cost:</span>
                    <span className="text-orange-500">{totalDeploymentCost.toFixed(3)} ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Monthly Cost:</span>
                    <span className="text-orange-500">{totalMonthlyCost.toFixed(3)} ETH</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center">
            <button className="btn-primary text-lg px-8 py-4 glow-orange">
              🚀 Deploy with Selected Plan
            </button>
          </div>
        </div>

        {/* Testnet Benefits */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Why Premium Testnet Pricing?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧪</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Advanced Testing</h4>
              <p className="text-gray-400">
                Premium features for thorough testing and validation before mainnet deployment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Security First</h4>
              <p className="text-gray-400">
                AI-powered analysis and monitoring to catch vulnerabilities early
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Professional Tools</h4>
              <p className="text-gray-400">
                Enterprise-grade tools and analytics for professional development teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}