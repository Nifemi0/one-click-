'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const supportCategories = [
  {
    title: 'Technical Issues',
    icon: ExclamationTriangleIcon,
    description: 'Problems with deployment, wallet connection, or platform functionality',
    articles: [
      'Wallet connection not working',
      'Deployment failed',
      'Template not loading',
      'Gas estimation errors'
    ]
  },
  {
    title: 'Account & Billing',
    icon: UserGroupIcon,
    description: 'Questions about your account, billing, or subscription',
    articles: [
      'How to upgrade plan',
      'Billing questions',
      'Account settings',
      'Password reset'
    ]
  },
  {
    title: 'Security & Templates',
    icon: CheckCircleIcon,
    description: 'Help with security features, templates, and best practices',
    articles: [
      'Template selection guide',
      'Security configuration',
      'Threat monitoring',
      'Emergency procedures'
    ]
  },
  {
    title: 'General Questions',
    icon: QuestionMarkCircleIcon,
    description: 'General information about One Click and DeFi security',
    articles: [
      'What are security traps?',
      'How to get started',
      'Supported networks',
      'Community resources'
    ]
  }
];

const contactMethods = [
  {
    title: 'Live Chat',
    icon: ChatBubbleLeftRightIcon,
    description: 'Get instant help from our support team',
    availability: '24/7',
    responseTime: 'Immediate',
    color: 'bg-green-500'
  },
  {
    title: 'Email Support',
    icon: EnvelopeIcon,
    description: 'Send us a detailed message',
    availability: '24/7',
    responseTime: 'Within 4 hours',
    color: 'bg-blue-500'
  },
  {
    title: 'Community Forum',
    icon: UserGroupIcon,
    description: 'Get help from the community',
    availability: '24/7',
    responseTime: 'Varies',
    color: 'bg-purple-500'
  },
  {
    title: 'Documentation',
    icon: DocumentTextIcon,
    description: 'Browse our comprehensive guides',
    availability: '24/7',
    responseTime: 'Immediate',
    color: 'bg-orange-500'
  }
];

export default function SupportPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally send to your support system
    alert('Thank you for your message! We\'ll get back to you within 4 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6">
            <QuestionMarkCircleIcon className="h-8 w-8 text-orange-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Need Help? We're Here!
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our support team is ready to help you with any questions about One Click security traps. 
            Find answers quickly or get in touch with our experts.
          </p>
        </div>

        {/* Quick Help */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${method.color} rounded-lg mb-4`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{method.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="text-gray-400">Available: {method.availability}</div>
                  <div className="text-gray-400">Response: {method.responseTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Help Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
                    <category.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                    <p className="text-gray-400">{category.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {category.articles.map((article) => (
                    <button
                      key={article}
                      onClick={() => router.push('/documentation')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                    >
                      {article}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            📧 Contact Our Support Team
          </h2>
          <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Please describe your issue in detail..."
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-8 py-4"
              >
                📤 Send Message
              </button>
            </div>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            ❓ Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">How do I connect my wallet?</h4>
                <p className="text-gray-400">
                  Click the "Connect Wallet" button in the top navigation. We support MetaMask, 
                  WalletConnect, and other popular Web3 wallets.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">What networks are supported?</h4>
                <p className="text-gray-400">
                  Currently, we support Hoodi testnet for testing. Mainnet support for Ethereum, 
                  Polygon, and other networks is coming soon.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">How much does it cost?</h4>
                <p className="text-gray-400">
                  We offer a free tier with 3 deployments, Pro plan at 0.05 ETH per deployment, 
                  and Enterprise with unlimited deployments.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Are templates audited?</h4>
                <p className="text-gray-400">
                  Yes! All our templates undergo thorough security audits before being made available 
                  in the marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community & Resources */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect with other users, share strategies, and stay updated on the latest features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/oneclick"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-4"
            >
              🎮 Join Discord
            </a>
            <a
              href="https://github.com/oneclick"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-lg px-8 py-4"
            >
              📚 GitHub
            </a>
            <button
              onClick={() => router.push('/documentation')}
              className="btn-outline text-lg px-8 py-4"
            >
              📖 Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}