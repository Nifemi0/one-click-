"use client";

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Search, 
  BookOpen, 
  Video,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Zap,
  Shield,
  Settings
} from 'lucide-react';

interface SupportCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  articles: SupportArticle[];
}

interface SupportArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  tags: string[];
}

const Support: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const supportCategories: SupportCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      description: 'Essential guides for new users',
      articles: [
        {
          id: 'first-deployment',
          title: 'How to Deploy Your First Security Trap',
          description: 'Step-by-step guide to deploying your first security trap using One Click',
          readTime: '5 min read',
          category: 'getting-started',
          tags: ['deployment', 'beginner', 'tutorial']
        },
        {
          id: 'account-setup',
          title: 'Setting Up Your Account',
          description: 'Complete account setup guide including wallet connection and preferences',
          readTime: '3 min read',
          category: 'getting-started',
          tags: ['account', 'setup', 'wallet']
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: Shield,
      description: 'Deployment guides and troubleshooting',
      articles: [
        {
          id: 'network-configuration',
          title: 'Configuring Network Settings',
          description: 'Learn how to configure different networks and optimize gas settings',
          readTime: '7 min read',
          category: 'deployment',
          tags: ['networks', 'gas', 'configuration']
        },
        {
          id: 'deployment-errors',
          title: 'Common Deployment Errors',
          description: 'Troubleshoot common deployment issues and their solutions',
          readTime: '10 min read',
          category: 'deployment',
          tags: ['errors', 'troubleshooting', 'deployment']
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Security best practices and features',
      articles: [
        {
          id: 'security-audits',
          title: 'Understanding Security Audits',
          description: 'Learn about our security audit process and how to interpret results',
          readTime: '8 min read',
          category: 'security',
          tags: ['audits', 'security', 'best-practices']
        },
        {
          id: 'threat-detection',
          title: 'Threat Detection & Response',
          description: 'How our platform detects and responds to security threats',
          readTime: '6 min read',
          category: 'security',
          tags: ['threats', 'detection', 'response']
        }
      ]
    },
    {
      id: 'api-integration',
      title: 'API & Integration',
      icon: Settings,
      description: 'API documentation and integration guides',
      articles: [
        {
          id: 'api-authentication',
          title: 'API Authentication Guide',
          description: 'Set up API keys and authentication for programmatic access',
          readTime: '4 min read',
          category: 'api-integration',
          tags: ['api', 'authentication', 'keys']
        },
        {
          id: 'webhook-setup',
          title: 'Setting Up Webhooks',
          description: 'Configure webhooks to receive real-time notifications',
          readTime: '6 min read',
          category: 'api-integration',
          tags: ['webhooks', 'notifications', 'integration']
        }
      ]
    }
  ];

  const allArticles = supportCategories.flatMap(category => category.articles);

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = [
    'first-deployment',
    'deployment-errors',
    'security-audits',
    'api-authentication'
  ];

  return (
    <section className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LifeBuoy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="h1 text-charcoal mb-4">
            Support <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Find answers to your questions, troubleshoot issues, and get the help you need 
            to make the most of One Click's security platform.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, guides, and solutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="h3 text-charcoal mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <button className="btn btn-primary w-full">Start Chat</button>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h3 className="h3 text-charcoal mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us a detailed message
              </p>
              <a href="/contact" className="btn btn-secondary w-full">Send Email</a>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-warning" />
              </div>
              <h3 className="h3 text-charcoal mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Call us for urgent issues
              </p>
              <button className="btn btn-utility w-full">Call Now</button>
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="h2 text-charcoal mb-6">Popular Help Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((articleId) => {
              const article = allArticles.find(a => a.id === articleId);
              if (!article) return null;
              
              return (
                <div key={article.id} className="card hover:shadow-lg transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="h3 text-charcoal">{article.title}</h3>
                      <ChevronRight className="w-5 h-5 text-primary mt-1" />
                    </div>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                      <div className="flex gap-2">
                        {article.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="h2 text-charcoal">Help Categories</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {supportCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category) => (
              <div key={category.id} className="card">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <category.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="h3 text-charcoal mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    {category.articles.length} articles
                  </div>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className="btn btn-utility w-full"
                  >
                    Browse Articles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className="h2 text-charcoal mb-6">
              Search Results for "{searchQuery}"
            </h2>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="h3 text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or browse our categories
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-primary"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="card hover:shadow-lg transition-shadow">
                    <div className="card-body">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="h3 text-charcoal mb-2">{article.title}</h3>
                          <p className="text-gray-600 mb-3">{article.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{article.readTime}</span>
                            <span>•</span>
                            <span className="capitalize">{article.category.replace('-', ' ')}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-primary mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support Hours & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-body">
              <h3 className="h3 text-charcoal mb-4">Support Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-charcoal">Monday - Friday</div>
                    <div className="text-sm text-gray-600">9:00 AM - 6:00 PM EST</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-charcoal">Saturday</div>
                    <div className="text-sm text-gray-600">10:00 AM - 4:00 PM EST</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-charcoal">Sunday</div>
                    <div className="text-sm text-gray-600">Emergency Support Only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="h3 text-charcoal mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Email</h4>
                    <div className="text-sm text-gray-600">support@oneclick.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-charcoal">Phone</div>
                    <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-charcoal">Live Chat</div>
                    <div className="text-sm text-gray-600">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="h2 text-charcoal mb-4">Still Need Help?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you succeed with One Click. 
              Don't hesitate to reach out for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="btn btn-primary btn-lg">
                Contact Support
              </a>
              <a href="/docs" className="btn btn-secondary btn-lg">
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
