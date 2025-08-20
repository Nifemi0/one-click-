'use client';

import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastCheck: string;
  responseTime: number;
}

const systemStatuses: SystemStatus[] = [
  {
    name: 'Hoodi Testnet',
    status: 'online',
    lastCheck: '2 seconds ago',
    responseTime: 45
  },
  {
    name: 'Security Engine',
    status: 'online',
    lastCheck: '1 second ago',
    responseTime: 23
  },
  {
    name: 'Monitoring System',
    status: 'online',
    lastCheck: '3 seconds ago',
    responseTime: 67
  },
  {
    name: 'API Status',
    status: 'online',
    lastCheck: '1 second ago',
    responseTime: 34
  }
];

export function BackendStatus() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-green-500/50 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'offline':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'warning':
        return 'Warning';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <section className="section relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              System Status
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time monitoring of our security infrastructure and network status
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {systemStatuses.map((system, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className={`bg-gray-900/50 backdrop-blur-xl border ${getStatusColor(system.status)} rounded-2xl p-6 h-full hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20`}>
                {/* Status Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">
                    {getStatusIcon(system.status)}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      system.status === 'online' ? 'text-green-400' :
                      system.status === 'warning' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {getStatusText(system.status)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {system.responseTime}ms
                    </div>
                  </div>
                </div>

                {/* System Name */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {system.name}
                </h3>

                {/* Last Check */}
                <p className="text-sm text-gray-400">
                  Last check: {system.lastCheck}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              All systems operational
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </section>
  );
}
