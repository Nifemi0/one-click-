import React from 'react';
import { Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-charcoal mb-6">
            Secure DeFi with{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">One Click</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto mb-8">
            Deploy enterprise-grade security traps in minutes. Our AI-powered platform 
            generates and deploys smart contracts that protect your protocols from 
            common attack vectors.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="/deploy" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-all duration-200 rounded-md bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105">
              <Zap className="w-5 h-5 mr-2" />
              Deploy Security Trap
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="/marketplace" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-all duration-200 rounded-md bg-gray-100 text-charcoal hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300">
              Browse Templates
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-charcoal mb-2">Enterprise Security</h3>
            <p className="text-gray-600">
              Bank-grade security measures with continuous threat monitoring
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-charcoal mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Deploy in under 5 minutes with our streamlined process
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-warning" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-charcoal mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Intelligent contract generation with best practice security patterns
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-charcoal mb-2">Trusted by Leading Protocols</h2>
            <p className="text-gray-600">
              Join thousands of users protecting billions in DeFi assets
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Security Traps Deployed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">$2.5B+</div>
              <div className="text-sm text-gray-600">Assets Protected</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
