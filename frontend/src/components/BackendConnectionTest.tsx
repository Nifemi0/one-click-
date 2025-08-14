'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';

interface ConnectionStatus {
  endpoint: string;
  status: 'loading' | 'success' | 'error';
  response?: any;
  error?: string;
}

export default function BackendConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoints = [
    { name: 'Server Health', endpoint: API_ENDPOINTS.HEALTH },
    { name: 'Auth Health', endpoint: API_ENDPOINTS.AUTH.HEALTH },
    { name: 'Marketplace Categories', endpoint: API_ENDPOINTS.MARKETPLACE.CATEGORIES },
    { name: 'Marketplace Complexities', endpoint: API_ENDPOINTS.MARKETPLACE.COMPLEXITIES },
    { name: 'Marketplace Stats', endpoint: API_ENDPOINTS.MARKETPLACE.STATS },
    { name: 'Basic Traps Templates', endpoint: API_ENDPOINTS.BASIC_TRAPS.TEMPLATES },
    { name: 'RPC Status', endpoint: API_ENDPOINTS.RPC.STATUS },
  ];

  const testConnection = async (endpoint: string, name: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${endpoint}`);
      const data = await response.json();
      
      return {
        endpoint: name,
        status: 'success' as const,
        response: data,
      };
    } catch (error) {
      return {
        endpoint: name,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setConnectionStatus(testEndpoints.map(e => ({ endpoint: e.name, status: 'loading' })));

    const results = await Promise.all(
      testEndpoints.map(({ endpoint, name }) => testConnection(endpoint, name))
    );

    setConnectionStatus(results);
    setIsTesting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'loading': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'loading': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Backend Connection Test</h2>
        <p className="text-gray-300 mb-6">
          Testing connection to backend at: <code className="bg-gray-800 px-2 py-1 rounded text-orange-400">{API_ENDPOINTS.BASE_URL}</code>
        </p>
        <button
          onClick={runAllTests}
          disabled={isTesting}
          className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? 'Testing...' : '🚀 Test All Endpoints'}
        </button>
      </div>

      <div className="space-y-4">
        {connectionStatus.map((status, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">{status.endpoint}</h3>
              <span className={`text-lg ${getStatusColor(status.status)}`}>
                {getStatusIcon(status.status)}
              </span>
            </div>
            
            {status.status === 'loading' && (
              <div className="text-gray-400">Testing connection...</div>
            )}
            
            {status.status === 'success' && (
              <div className="space-y-2">
                <div className="text-green-400 text-sm">✅ Connection successful</div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-300 hover:text-white">
                    View Response
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(status.response, null, 2)}
                  </pre>
                </details>
              </div>
            )}
            
            {status.status === 'error' && (
              <div className="text-red-400 text-sm">
                ❌ Connection failed: {status.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {connectionStatus.length > 0 && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Test Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {connectionStatus.filter(s => s.status === 'success').length}
              </div>
              <div className="text-gray-400">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {connectionStatus.filter(s => s.status === 'error').length}
              </div>
              <div className="text-gray-400">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {connectionStatus.filter(s => s.status === 'loading').length}
              </div>
              <div className="text-gray-400">Loading</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}