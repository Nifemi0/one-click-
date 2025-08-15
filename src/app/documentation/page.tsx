'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpenIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  BoltIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const documentationSections = [
  {
    title: 'Getting Started',
    icon: BoltIcon,
    description: 'Learn the basics of One Click security traps',
    articles: [
      { title: 'What are Security Traps?', path: '/docs/getting-started/security-traps' },
      { title: 'Quick Start Guide', path: '/docs/getting-started/quick-start' },
      { title: 'Wallet Connection', path: '/docs/getting-started/wallet-setup' },
      { title: 'First Deployment', path: '/docs/getting-started/first-deployment' }
    ]
  },
  {
    title: 'Templates & Deployment',
    icon: CodeBracketIcon,
    description: 'Master template deployment and customization',
    articles: [
      { title: 'Template Overview', path: '/docs/templates/overview' },
      { title: 'Deployment Process', path: '/docs/templates/deployment' },
      { title: 'Custom Configuration', path: '/docs/templates/configuration' },
      { title: 'Gas Optimization', path: '/docs/templates/gas-optimization' }
    ]
  },
  {
    title: 'Security Features',
    icon: ShieldCheckIcon,
    description: 'Understand advanced security mechanisms',
    articles: [
      { title: 'Threat Detection', path: '/docs/security/threat-detection' },
      { title: 'Alert System', path: '/docs/security/alerts' },
      { title: 'Emergency Pause', path: '/docs/security/emergency-pause' },
      { title: 'Multi-Signature', path: '/docs/security/multisig' }
    ]
  },
  {
    title: 'Advanced Topics',
    icon: LightBulbIcon,
    description: 'Deep dive into advanced features and concepts',
    articles: [
      { title: 'AI-Powered Analysis', path: '/docs/advanced/ai-analysis' },
      { title: 'Custom Templates', path: '/docs/advanced/custom-templates' },
      { title: 'Integration APIs', path: '/docs/advanced/api-integration' },
      { title: 'Performance Optimization', path: '/docs/advanced/optimization' }
    ]
  }
];

const quickLinks = [
  { title: 'Deploy Your First Trap', path: '/deploy', icon: BoltIcon, color: 'bg-blue-500' },
  { title: 'Browse Templates', path: '/marketplace', icon: CodeBracketIcon, color: 'bg-purple-500' },
  { title: 'View Dashboard', path: '/dashboard', icon: ShieldCheckIcon, color: 'bg-green-500' },
  { title: 'Get Support', path: '/support', icon: QuestionMarkCircleIcon, color: 'bg-orange-500' }
];

export default function DocumentationPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleQuickLink = (path: string) => {
    router.push(path);
  };

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-6">
            <BookOpenIcon className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            One Click Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about deploying and managing security traps. 
            From basic concepts to advanced features, find answers to all your questions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <BookOpenIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <button
                key={link.title}
                onClick={() => handleQuickLink(link.path)}
                className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-200 text-left"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${link.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <link.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {link.title}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Documentation Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSections.map((section) => (
              <div key={section.title} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
                    <section.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
                    <p className="text-gray-400">{section.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {section.articles.map((article) => (
                    <button
                      key={article.title}
                      onClick={() => router.push(article.path)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            🚀 Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-400">Connect your Web3 wallet to get started with One Click</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Template</h3>
              <p className="text-gray-400">Browse our marketplace and select a security template</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Deploy & Monitor</h3>
              <p className="text-gray-400">Deploy your trap and monitor for threats in real-time</p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            💡 Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Start with Basic Templates</h4>
                  <p className="text-gray-400">Begin with simple templates to understand the system before moving to advanced features</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Test on Testnet First</h4>
                  <p className="text-gray-400">Always test your deployments on Hoodi testnet before mainnet</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Monitor Regularly</h4>
                  <p className="text-gray-400">Set up alerts and check your dashboard regularly for any threats</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Keep Templates Updated</h4>
                  <p className="text-gray-400">Use the latest versions of templates for the best security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need More Help?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/support')}
              className="btn-primary text-lg px-8 py-4"
            >
              📞 Get Support
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="btn-outline text-lg px-8 py-4"
            >
              🚀 Start Building
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}