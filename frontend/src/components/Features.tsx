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
    <section className="section bg-gray-light">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="h2 text-charcoal mb-4">
            Why Choose <span className="text-gradient-primary">One Click</span>
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with enterprise-grade security 
            to provide the most comprehensive DeFi protection solution available.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-xl transition-all duration-300 group">
              <div className="card-body text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="h3 text-charcoal mb-4">{feature.title}</h3>
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
            <h3 className="h2 text-charcoal mb-4">
              Ready to Secure Your Protocol?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of DeFi protocols that trust One Click to protect their assets. 
              Start deploying security traps today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/deploy" className="btn btn-primary btn-lg">
                🚀 Start Deploying
              </a>
              <a href="/marketplace" className="btn btn-secondary btn-lg">
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
