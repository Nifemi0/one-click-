'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const pricingTiers = [
  {
    name: 'Free',
    description: 'Perfect for getting started with basic security',
    price: '0',
    period: 'forever',
    features: [
      '1 Basic Security Trap',
      'Standard Monitoring',
      'Community Support',
      'Basic Templates',
      'Email Alerts'
    ],
    color: 'border-gray-600',
    buttonText: 'Get Started Free',
    buttonAction: 'deploy',
    popular: false
  },
  {
    name: 'Pro',
    description: 'Advanced security for serious DeFi users',
    price: '0.001',
    period: 'per month',
    features: [
      'Up to 5 Security Traps',
      'Advanced Monitoring',
      'Priority Support',
      'Premium Templates',
      'Real-time Alerts',
      'Custom Thresholds',
      'Analytics Dashboard'
    ],
    color: 'border-purple-500',
    buttonText: 'Start Pro Trial',
    buttonAction: 'deploy',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Unlimited Security Traps',
      'Custom Templates',
      'Dedicated Support',
      'API Access',
      'White-label Solutions',
      'Custom Integrations',
      'SLA Guarantees'
    ],
    color: 'border-orange-500',
    buttonText: 'Contact Sales',
    buttonAction: 'contact',
    popular: false
  }
];

const faqs = [
  {
    question: 'What is a security trap?',
    answer: 'A security trap is a smart contract that monitors DeFi protocols for suspicious activity and can automatically trigger protective measures when threats are detected.'
  },
  {
    question: 'Do I need technical knowledge to use this?',
    answer: 'No! Our platform is designed to be user-friendly. You can deploy security traps with just a few clicks using our pre-audited templates.'
  },
  {
    question: 'Which blockchains are supported?',
    answer: 'Currently, we support Ethereum mainnet and testnets. We\'re expanding to other chains like Polygon, Arbitrum, and Base soon.'
  },
  {
    question: 'Are the templates audited?',
    answer: 'Yes, all our security trap templates undergo thorough security audits before being made available in the marketplace.'
  },
  {
    question: 'Can I customize the security parameters?',
    answer: 'Absolutely! Pro and Enterprise users can customize monitoring thresholds, alert conditions, and other security parameters.'
  },
  {
    question: 'What happens if a threat is detected?',
    answer: 'When a threat is detected, you\'ll receive immediate alerts and can choose from automated responses like blocking transactions or triggering emergency protocols.'
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleButtonClick = (action: string) => {
    if (action === 'deploy') {
      router.push('/deploy');
    } else if (action === 'contact') {
      router.push('/support');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your security needs. All plans include our core security features 
            with no hidden fees or complicated pricing structures.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border-2 ${tier.color} ${
                tier.popular ? 'ring-2 ring-purple-500/20' : ''
              } ${selectedTier === tier.name ? 'ring-2 ring-purple-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {tier.price === 'Custom' ? 'Custom' : `$${tier.price}`}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-gray-400 ml-2">{tier.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleButtonClick(tier.buttonAction)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  tier.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose One Click Security?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <ShieldCheckIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Battle-Tested Security</h3>
              <p className="text-gray-300">
                Our templates are based on real-world attack patterns and have been tested against actual threats.
              </p>
            </div>
            <div className="text-center">
              <RocketLaunchIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">One-Click Deployment</h3>
              <p className="text-gray-300">
                Deploy sophisticated security measures in minutes, not days. No coding required.
              </p>
            </div>
            <div className="text-center">
              <BuildingOfficeIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise Ready</h3>
              <p className="text-gray-300">
                Built for both individual users and large organizations with enterprise-grade reliability.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Secure Your DeFi Investments?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with our free tier and upgrade as your security needs grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/deploy')}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              🚀 Start Free Trial
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-white/10 text-white px-8 py-4 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-colors"
            >
              📚 Browse Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}