import React from 'react';
import { Shield, Zap, Eye, Lock, Network, Brain } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Security',
      description: 'Our advanced AI generates smart contracts with built-in security patterns, protecting against common DeFi attack vectors.',
      gradient: 'from-primary to-orange-600'
    },
    {
      icon: Zap,
      title: 'One-Click Deployment',
      description: 'Deploy sophisticated security traps in minutes with our streamlined deployment process. No coding required.',
      gradient: 'from-success to-green-600'
    },
    {
      icon: Eye,
      title: 'Real-Time Monitoring',
      description: 'Monitor your deployed traps with real-time alerts, threat detection, and comprehensive analytics dashboard.',
      gradient: 'from-warning to-yellow-600'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade security measures with multi-signature support, access controls, and audit trails.',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      icon: Network,
      title: 'Multi-Chain Support',
      description: 'Deploy on Ethereum, Polygon, Arbitrum, Base, and other EVM-compatible networks.',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      icon: Brain,
      title: 'Smart Optimization',
      description: 'Automatically optimize gas usage, storage patterns, and security configurations for maximum efficiency.',
      gradient: 'from-pink-500 to-pink-700'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-charcoal mb-4">
            Why Choose <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">One Click</span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with enterprise-grade security 
            to provide the most comprehensive DeFi protection solution available.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105 group">
              <div className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-charcoal mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-3xl md:text-4xl font-bold leading-tight text-charcoal mb-4">
              Ready to Secure Your Protocol?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of DeFi protocols that trust One Click to protect their assets. 
              Start deploying security traps today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/deploy" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-all duration-200 rounded-md bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105">
                🚀 Start Deploying
              </a>
              <a href="/marketplace" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-all duration-200 rounded-md bg-gray-100 text-charcoal hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300">
                🏪 Browse Templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
