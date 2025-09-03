"use client";

import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Shield, 
  Zap, 
  Settings, 
  Network, 
  AlertTriangle, 
  CheckCircle,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Download,
  Search,
  FileText,
  Play,
  Terminal
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  subsections: DocSubsection[];
}

interface DocSubsection {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  tips?: string[];
}

const Documentation: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const documentation: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      description: 'Quick start guide and basic concepts',
      subsections: [
        {
          id: 'introduction',
          title: 'Introduction to One Click',
          content: 'One Click is a comprehensive DeFi security platform that helps protect your protocols from common attack vectors. Our AI-powered system generates and deploys smart contracts with built-in security measures.',
          tips: [
            'Start with basic templates if you\'re new to DeFi security',
            'Always test on testnets before mainnet deployment',
            'Keep your private keys secure and never share them'
          ]
        },
        {
          id: 'first-deployment',
          title: 'Your First Deployment',
          content: 'Deploying your first security trap is simple. Choose a template, configure your settings, and let our AI generate the optimized smart contract.',
          codeExample: `# Example deployment command
oneclick deploy --template reentrancy-guard \\
  --network ethereum \\
  --security-level advanced \\
  --gas-optimization true`
        }
      ]
    },
    {
      id: 'security-templates',
      title: 'Security Templates',
      icon: Shield,
      description: 'Available security patterns and templates',
      subsections: [
        {
          id: 'reentrancy-guard',
          title: 'Reentrancy Guard',
          content: 'Protects against reentrancy attacks by preventing recursive calls to functions that modify state. Essential for any contract that handles external calls.',
          codeExample: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureContract is ReentrancyGuard {
    function secureFunction() external nonReentrant {
        // Your secure logic here
    }
}`,
          tips: [
            'Always use nonReentrant modifier on functions that make external calls',
            'Consider using checks-effects-interactions pattern',
            'Test thoroughly with reentrancy attack scenarios'
          ]
        },
        {
          id: 'access-control',
          title: 'Access Control',
          content: 'Role-based access control system that restricts function access based on user roles. Perfect for multi-signature wallets and DAOs.',
          tips: [
            'Use least privilege principle when assigning roles',
            'Implement role hierarchy for complex permission systems',
            'Always verify caller permissions before execution'
          ]
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment Guide',
      icon: Zap,
      description: 'Step-by-step deployment instructions',
      subsections: [
        {
          id: 'network-setup',
          title: 'Network Configuration',
          content: 'Configure your target network settings, including RPC endpoints, gas settings, and network-specific parameters.',
          tips: [
            'Use reliable RPC providers for mainnet deployments',
            'Set appropriate gas limits based on contract complexity',
            'Verify contract addresses after deployment'
          ]
        },
        {
          id: 'gas-optimization',
          title: 'Gas Optimization',
          content: 'Optimize your smart contracts for minimal gas consumption while maintaining security. Our AI automatically suggests optimizations.',
          tips: [
            'Use packed structs for storage optimization',
            'Avoid unnecessary storage operations',
            'Batch operations when possible'
          ]
        }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      description: 'Complete API documentation and examples',
      subsections: [
        {
          id: 'rest-api',
          title: 'REST API Endpoints',
          content: 'Complete REST API reference for integrating One Click into your applications. All endpoints support JSON responses and proper error handling.',
          codeExample: `# Generate security contract
POST /api/ai-contracts/generate
{
  "securityLevel": "advanced",
  "complexity": "moderate",
  "targetNetwork": "ethereum",
  "customRequirements": "Flash loan protection"
}`,
          tips: [
            'Always include proper authentication headers',
            'Handle rate limiting gracefully',
            'Implement proper error handling for all responses'
          ]
        },
        {
          id: 'webhooks',
          title: 'Webhooks',
          content: 'Configure webhooks to receive real-time notifications about deployment status, security alerts, and system updates.',
          tips: [
            'Use HTTPS endpoints for webhook delivery',
            'Implement idempotency to handle duplicate deliveries',
            'Verify webhook signatures for security'
          ]
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: CheckCircle,
      description: 'Security best practices and recommendations',
      subsections: [
        {
          id: 'security-audits',
          title: 'Security Audits',
          content: 'Regular security audits are essential for maintaining the integrity of your DeFi protocols. Our platform provides automated security scanning and manual audit recommendations.',
          tips: [
            'Schedule regular security audits (quarterly recommended)',
            'Use multiple audit firms for comprehensive coverage',
            'Implement all critical and high-severity findings'
          ]
        },
        {
          id: 'monitoring',
          title: 'Continuous Monitoring',
          content: 'Implement continuous monitoring systems to detect and respond to security threats in real-time. Our dashboard provides comprehensive monitoring tools.',
          tips: [
            'Set up alerts for unusual transaction patterns',
            'Monitor gas usage for potential attacks',
            'Track failed transactions and analyze patterns'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertTriangle,
      description: 'Common issues and solutions',
      subsections: [
        {
          id: 'deployment-errors',
          title: 'Common Deployment Errors',
          content: 'Troubleshoot common deployment issues including gas estimation failures, network connectivity problems, and contract compilation errors.',
          tips: [
            'Check network connectivity and RPC endpoint status',
            'Verify sufficient balance for deployment costs',
            'Review contract code for syntax errors'
          ]
        },
        {
          id: 'performance-issues',
          title: 'Performance Optimization',
          content: 'Identify and resolve performance bottlenecks in your smart contracts. Our analysis tools help optimize gas usage and execution efficiency.',
          tips: [
            'Profile gas usage for expensive operations',
            'Optimize storage patterns and data structures',
            'Consider using libraries for common operations'
          ]
        }
      ]
    }
  ];

  const filteredDocs = documentation.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.subsections.some(sub => 
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  return (
    <section className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="h1 text-charcoal mb-4">
            Documentation & <span className="text-gradient-primary">Guides</span>
          </h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides, API references, and best practices to help you 
            build and deploy secure DeFi protocols with confidence.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card">
                <div className="card-body">
                  <h3 className="h3 text-charcoal mb-4">Quick Navigation</h3>
                  <nav className="space-y-2">
                    {filteredDocs.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                          expandedSection === section.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-gray-50 text-gray-600 hover:text-charcoal'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <section.icon className="w-4 h-4" />
                          <span className="font-medium">{section.title}</span>
                        </div>
                        {expandedSection === section.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {filteredDocs.map((section) => (
              <div key={section.id} className="card">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="h2 text-charcoal">{section.title}</h2>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.id} className="border-l-4 border-primary/20 pl-6">
                        <h3 className="h3 text-charcoal mb-4">{subsection.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {subsection.content}
                        </p>

                        {subsection.codeExample && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Code Example</span>
                              <button className="text-primary hover:text-primary-hover text-sm">
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </button>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{subsection.codeExample}</code>
                            </pre>
                          </div>
                        )}

                        {subsection.tips && (
                          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                            <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-warning" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-2">
                              {subsection.tips.map((tip, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="h2 text-charcoal mb-4">Additional Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore more resources to enhance your DeFi security knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <h3 className="h3 text-charcoal mb-2">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">
                  Step-by-step video guides for common tasks and advanced features
                </p>
                <a href="#" className="btn btn-primary w-full">
                  Watch Videos
                </a>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Terminal className="w-8 h-8 text-success" />
                </div>
                <h3 className="h3 text-charcoal mb-2">CLI Tools</h3>
                <p className="text-gray-600 mb-4">
                  Command-line interface for advanced users and automation
                </p>
                <a href="#" className="btn btn-secondary w-full">
                  Download CLI
                </a>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-warning" />
                </div>
                <h3 className="h3 text-charcoal mb-2">PDF Guides</h3>
                <p className="text-gray-600 mb-4">
                  Downloadable PDF guides for offline reference and sharing
                </p>
                <a href="#" className="btn btn-utility w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDFs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="h2 text-charcoal mb-4">Need More Help?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you 
              get the most out of One Click.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="btn btn-primary btn-lg">
                Contact Support
              </a>
              <a href="/status" className="btn btn-secondary btn-lg">
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Copy icon component for the code examples
const Copy: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default Documentation;
