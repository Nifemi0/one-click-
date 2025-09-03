'use client';

import React from 'react';
import { Shield, Users, DollarSign, TrendingUp, CheckCircle, Zap, Lock, Globe } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Shield,
      value: '10,000+',
      label: 'Security Traps Deployed',
      description: 'Active protection across multiple networks',
      gradient: 'from-primary to-orange-600'
    },
    {
      icon: Users,
      value: '5,000+',
      label: 'Active Users',
      description: 'Trusted by leading DeFi protocols',
      gradient: 'from-success to-green-600'
    },
    {
      icon: DollarSign,
      value: '$2.5B+',
      label: 'Assets Protected',
      description: 'Total value secured by our platform',
      gradient: 'from-warning to-yellow-600'
    },
    {
      icon: TrendingUp,
      value: '99.9%',
      label: 'Success Rate',
      description: 'Reliable threat detection and prevention',
      gradient: 'from-purple-500 to-purple-700'
    }
  ];

  const reasons = [
    {
      icon: Zap,
      title: 'Lightning Fast Deployment',
      description: 'Deploy security traps in under 5 minutes with our streamlined process.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade security measures with continuous monitoring and threat detection.'
    },
    {
      icon: Globe,
      title: 'Multi-Chain Support',
      description: 'Protect assets across Ethereum, Polygon, Arbitrum, Base, and more.'
    }
  ];

  return (
    <section className="section">
      <div className="container-custom">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center">
              <div className="card-body">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-charcoal mb-2">{stat.value}</div>
                <div className="font-medium text-charcoal mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Protocols Choose One Click */}
        <div className="text-center mb-12">
          <h2 className="h2 text-charcoal mb-4">
            Why Protocols Choose <span className="text-gradient-primary">One Click</span>
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Our platform has become the go-to solution for DeFi security, trusted by 
            leading protocols worldwide for its reliability, speed, and effectiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <div key={index} className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="h3 text-charcoal mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="h2 text-charcoal mb-4">
            Trusted by Industry Leaders
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of DeFi protocols that have already secured their assets with One Click. 
            Our platform has been battle-tested in production environments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/deploy" className="btn btn-primary btn-lg">
              🚀 Start Protecting
            </a>
            <a href="/marketplace" className="btn btn-secondary btn-lg">
              🏪 View Templates
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
