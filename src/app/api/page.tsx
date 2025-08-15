'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  PlayIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const apiEndpoints = [
  {
    category: 'Marketplace',
    endpoints: [
      { path: '/api/marketplace/categories', method: 'GET', description: 'Get all marketplace categories' },
      { path: '/api/marketplace/complexities', method: 'GET', description: 'Get all complexity levels' },
      { path: '/api/marketplace/stats', method: 'GET', description: 'Get marketplace statistics' },
      { path: '/api/marketplace/featured', method: 'GET', description: 'Get featured templates' },
      { path: '/api/marketplace/search', method: 'GET', description: 'Search templates' }
    ]
  },
  {
    category: 'Templates',
    endpoints: [
      { path: '/api/basic-traps/templates', method: 'GET', description: 'Get basic trap templates' },
      { path: '/api/basic-traps/deploy', method: 'POST', description: 'Deploy a basic trap' },
      { path: '/api/basic-traps/health', method: 'GET', description: 'Check basic traps service health' }
    ]
  },
  {
    category: 'Enhanced AI',
    endpoints: [
      { path: '/api/enhanced-ai-trap/deploy', method: 'POST', description: 'Deploy enhanced AI trap' },
      { path: '/api/enhanced-ai-trap/status', method: 'GET', description: 'Get deployment status' },
      { path: '/api/enhanced-ai-trap/cancel', method: 'POST', description: 'Cancel deployment' }
    ]
  },
  {
    category: 'Analysis',
    endpoints: [
      { path: '/api/analyze/contract', method: 'POST', description: 'Analyze smart contract' },
      { path: '/api/analyze/history', method: 'GET', description: 'Get analysis history' },
      { path: '/api/analyze/compare', method: 'POST', description: 'Compare contracts' }
    ]
  },
  {
    category: 'Alerts',
    endpoints: [
      { path: '/api/alerts/user', method: 'GET', description: 'Get user alerts' },
      { path: '/api/alerts/create', method: 'POST', description: 'Create custom alert' },
      { path: '/api/alerts/update', method: 'PUT', description: 'Update alert' },
      { path: '/api/alerts/delete', method: 'DELETE', description: 'Delete alert' }
    ]
  },
  {
    category: 'Health & Status',
    endpoints: [
      { path: '/health', method: 'GET', description: 'Service health check' },
      { path: '/api/rpc-test/status', method: 'GET', description: 'RPC connection status' }
    ]
  }
];

export default function APIPage() {
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500';
      case 'POST': return 'bg-blue-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
            <CodeBracketIcon className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            API Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Integrate One Click security traps into your applications with our comprehensive REST API. 
            All endpoints support JSON responses and include proper error handling.
          </p>
        </div>

        {/* API Base URL */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Base URL</h2>
          <div className="flex items-center space-x-4">
            <code className="bg-gray-900 px-4 py-3 rounded-lg text-lg text-blue-400 font-mono flex-1">
              https://api.oneclick.network
            </code>
            <button
              onClick={() => copyToClipboard('https://api.oneclick.network')}
              className="btn-outline"
            >
              <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
              Copy
            </button>
          </div>
          <p className="text-gray-400 mt-4">
            For development, you can also use: <code className="bg-gray-800 px-2 py-1 rounded text-orange-400">http://localhost:3001</code>
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>
          <p className="text-gray-300 mb-4">
            Most endpoints require authentication. Include your API key in the request headers:
          </p>
          <div className="bg-gray-900 rounded-lg p-4">
            <code className="text-green-400">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <p className="text-gray-400 mt-4">
            Get your API key from your dashboard settings page.
          </p>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Available Endpoints</h2>
          <div className="space-y-8">
            {apiEndpoints.map((category) => (
              <div key={category.category} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-purple-400 mr-2" />
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.endpoints.map((endpoint) => (
                    <div key={endpoint.path} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-blue-400 font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-gray-300 text-sm">{endpoint.description}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.path)}
                        className="btn-outline text-sm px-3 py-2"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Requests */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Example Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Get Marketplace Categories</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">Request:</div>
                <code className="text-green-400 text-sm">
                  GET /api/marketplace/categories
                </code>
                <div className="text-gray-400 text-sm mt-2 mb-2">Response:</div>
                <pre className="text-xs text-gray-300 overflow-x-auto">
{`{
  "success": true,
  "data": [
    "rugpull",
    "governance",
    "minting",
    "oracle"
  ]
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Deploy Basic Trap</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">Request:</div>
                <code className="text-blue-400 text-sm">
                  POST /api/basic-traps/deploy
                </code>
                <div className="text-gray-400 text-sm mt-2 mb-2">Body:</div>
                <pre className="text-xs text-gray-300 overflow-x-auto">
{`{
  "templateId": "rugpull-basic",
  "configuration": {
    "threshold": 1000,
    "cooldown": 3600
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Rate Limiting</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">100</div>
              <div className="text-gray-400">Requests per 15 minutes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">1000</div>
              <div className="text-gray-400">Requests per hour</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">10,000</div>
              <div className="text-gray-400">Requests per day</div>
            </div>
          </div>
          <p className="text-gray-400 text-center mt-4">
            Rate limits are applied per API key. Contact us for higher limits.
          </p>
        </div>

        {/* SDKs & Libraries */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">SDKs & Libraries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="text-lg font-semibold text-white mb-2">JavaScript/TypeScript</h3>
              <p className="text-gray-400 text-sm mb-4">Official SDK for Node.js and browser</p>
              <button className="btn-outline text-sm">Coming Soon</button>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">🐍</div>
              <h3 className="text-lg font-semibold text-white mb-2">Python</h3>
              <p className="text-gray-400 text-sm mb-4">Python client library</p>
              <button className="btn-outline text-sm">Coming Soon</button>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">REST Client</h3>
              <p className="text-gray-400 text-sm mb-4">Use any HTTP client</p>
              <button className="btn-outline text-sm">Available Now</button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Integrate?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start building with our API and create powerful DeFi security applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary text-lg px-8 py-4"
            >
              🚀 Get API Key
            </button>
            <button
              onClick={() => router.push('/documentation')}
              className="btn-outline text-lg px-8 py-4"
            >
              📖 View Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}