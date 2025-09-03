import React from 'react';
import { Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container-custom">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="h1 text-charcoal mb-6">
            Secure DeFi with{' '}
            <span className="text-gradient-primary">One Click</span>
          </h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto mb-8">
            Deploy enterprise-grade security traps in minutes. Our AI-powered platform 
            generates and deploys smart contracts that protect your protocols from 
            common attack vectors.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="/deploy" className="btn btn-primary btn-lg">
              <Zap className="w-5 h-5 mr-2" />
              Deploy Security Trap
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="/marketplace" className="btn btn-secondary btn-lg">
              Browse Templates
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="h3 text-charcoal mb-2">Enterprise Security</h3>
            <p className="text-gray-600">
              Bank-grade security measures with continuous threat monitoring
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-success" />
            </div>
            <h3 className="h3 text-charcoal mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Deploy in under 5 minutes with our streamlined process
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-warning" />
            </div>
            <h3 className="h3 text-charcoal mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Intelligent contract generation with best practice security patterns
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="h2 text-charcoal mb-2">Trusted by Leading Protocols</h2>
            <p className="text-gray-600">
              Join thousands of users protecting billions in DeFi assets
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Security Traps Deployed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$2.5B+</div>
              <div className="text-sm text-gray-600">Assets Protected</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
