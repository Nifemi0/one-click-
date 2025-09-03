import React from 'react';
import { Heart, Shield, Zap, Star, Users, Globe, Coffee, Gift } from 'lucide-react';

const Donation: React.FC = () => {
  const donationTiers = [
    {
      icon: Coffee,
      title: 'Coffee Supporter',
      amount: '$5',
      description: 'Buy us a coffee and help keep the servers running',
      benefits: ['Name in contributors list', 'Early access to beta features']
    },
    {
      icon: Shield,
      title: 'Security Advocate',
      amount: '$25',
      description: 'Support our security research and development',
      benefits: ['Priority support', 'Exclusive security insights', 'Beta testing access']
    },
    {
      icon: Star,
      title: 'Premium Supporter',
      amount: '$100',
      description: 'Help us build the future of DeFi security',
      benefits: ['All previous benefits', 'Custom security templates', '1-on-1 consultation']
    }
  ];

  const supportOptions = [
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join our Discord and Telegram communities to help other users and contribute to discussions.'
    },
    {
      icon: Globe,
      title: 'Open Source',
      description: 'Contribute to our open-source projects on GitHub. Every pull request helps!'
    },
    {
      icon: Gift,
      title: 'Spread the Word',
      description: 'Share One Click with your network and help us grow the community.'
    }
  ];

  return (
    <section className="section bg-gray-light">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="h2 text-charcoal mb-4">
            Support <span className="text-gradient-primary">One Click</span>
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Help us continue building the most advanced DeFi security platform. 
            Your support enables us to innovate, improve, and protect more protocols.
          </p>
        </div>

        {/* Donation Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {donationTiers.map((tier, index) => (
            <div key={index} className="card hover:shadow-xl transition-all duration-300 group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tier.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="h3 text-charcoal mb-2">{tier.title}</h3>
                <div className="text-3xl font-bold text-primary mb-2">{tier.amount}</div>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary w-full">
                  Support This Tier
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Your Support Matters */}
        <div className="card mb-16">
          <div className="card-body">
            <div className="text-center mb-8">
              <h3 className="h2 text-charcoal mb-4">Why Your Support Matters</h3>
              <p className="text-large text-gray-600 max-w-3xl mx-auto">
                Every contribution helps us push the boundaries of DeFi security and 
                protect more assets from malicious actors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h4 className="h4 text-charcoal mb-2">Enhanced Security</h4>
                <p className="text-gray-600 text-sm">
                  Develop new security patterns and threat detection systems
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-success" />
                </div>
                <h4 className="h4 text-charcoal mb-2">Faster Deployment</h4>
                <p className="text-gray-600 text-sm">
                  Optimize deployment processes and reduce gas costs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-warning" />
                </div>
                <h4 className="h4 text-charcoal mb-2">More Networks</h4>
                <p className="text-gray-600 text-sm">
                  Add support for additional blockchain networks
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="h4 text-charcoal mb-2">Community Growth</h4>
                <p className="text-gray-600 text-sm">
                  Expand our community and support resources
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Support Options */}
        <div className="text-center mb-12">
          <h3 className="h2 text-charcoal mb-4">Other Ways to Support</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Not ready to donate? Here are other ways you can help us grow and improve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportOptions.map((option, index) => (
            <div key={index} className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="h4 text-charcoal mb-3">{option.title}</h4>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <button className="btn btn-utility w-full">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="h2 text-charcoal mb-4">
              Together, We're Building the Future of DeFi Security
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Your support enables us to continue innovating and protecting the DeFi ecosystem. 
              Every contribution, no matter the size, makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn btn-primary btn-lg">
                💝 Make a Donation
              </button>
              <a href="/contact" className="btn btn-secondary btn-lg">
                📧 Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CheckCircle component for the benefits list
const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default Donation;
