'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { 
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  BoltIcon,
  CubeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '@/components/ui/NotificationToast';

const pricingTiers = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started with basic security',
    features: [
      '3 basic trap deployments',
      'Community templates',
      'Basic monitoring',
      'Email alerts',
      'Community support'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    color: 'border-gray-600'
  },
  {
    name: 'Pro',
    price: 0.05,
    description: 'For serious DeFi users and small protocols',
    features: [
      '25 trap deployments',
      'Premium templates',
      'Advanced monitoring',
      'Real-time alerts',
      'Priority support',
      'Custom configurations',
      'Analytics dashboard'
    ],
    buttonText: 'Start Pro Plan',
    popular: true,
    color: 'border-purple-500'
  },
  {
    name: 'Enterprise',
    price: 0.2,
    description: 'For large protocols and institutions',
    features: [
      'Unlimited deployments',
      'Custom templates',
      '24/7 monitoring',
      'Instant threat response',
      'Dedicated support',
      'Custom integrations',
      'Advanced analytics',
      'White-label options',
      'SLA guarantees'
    ],
    buttonText: 'Contact Sales',
    popular: false,
    color: 'border-orange-500'
  }
];

export default function PricingPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { showSuccess, showError } = useNotification();

  const handleGetStarted = (tier: string) => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }

    if (tier === 'Free' || tier === 'Pro') {
      router.push('/deploy');
      showSuccess(`Starting ${tier} plan...`);
    } else {
      // Enterprise - could open contact form or redirect
      showSuccess('Enterprise plan selected. Our team will contact you.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your security needs. All plans include our core protection features 
            with different deployment limits and support levels.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border-2 ${tier.color} ${
                tier.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <StarIcon className="h-4 w-4 mr-2" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  {tier.price === 0 ? (
                    <span className="text-4xl font-bold text-white">Free</span>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="text-xl text-gray-400"> ETH</span>
                      <span className="text-gray-400 text-sm">/deployment</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleGetStarted(tier.name)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    tier.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-4">What's included:</h4>
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            All Plans Include Core Security Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <ShieldCheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Protection</h3>
              <p className="text-gray-400">Multi-layered security mechanisms to protect your assets</p>
            </div>
            <div className="text-center">
              <BoltIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">One-Click Deployment</h3>
              <p className="text-gray-400">Deploy sophisticated security traps in seconds</p>
            </div>
            <div className="text-center">
              <CubeIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Audited Templates</h3>
              <p className="text-gray-400">All templates are thoroughly audited and tested</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">How does the pricing work?</h3>
              <p className="text-gray-400">
                You pay per deployment. Free tier includes 3 deployments, Pro includes 25, 
                and Enterprise has unlimited deployments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Can I upgrade my plan?</h3>
              <p className="text-gray-400">
                Yes! You can upgrade at any time. Your existing deployments remain active 
                and you get access to higher limits immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">What happens if I exceed my limit?</h3>
              <p className="text-gray-400">
                You'll be notified when you're close to your limit. You can either upgrade 
                your plan or wait until the next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Is there a free trial?</h3>
              <p className="text-gray-400">
                The Free tier is always available for testing. Try it out with 3 deployments 
                before deciding on a paid plan.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Secure Your DeFi Assets?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with our free tier and experience the power of One Click security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/deploy')}
              className="btn-primary text-lg px-8 py-4"
            >
              🚀 Start Deploying
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="btn-outline text-lg px-8 py-4"
            >
              📚 Browse Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}