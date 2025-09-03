import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Activity, Server, Shield, Zap, Globe } from 'lucide-react';

interface StatusItem {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  description: string;
  lastUpdated: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SystemStatus: React.FC = () => {
  const statusItems: StatusItem[] = [
    {
      id: 'api',
      name: 'API Services',
      status: 'online',
      description: 'All API endpoints are responding normally',
      lastUpdated: '2 minutes ago',
      icon: Server
    },
    {
      id: 'ai-generation',
      name: 'AI Contract Generation',
      status: 'online',
      description: 'OpenAI, Gemini, and Anthropic services operational',
      lastUpdated: '1 minute ago',
      icon: Zap
    },
    {
      id: 'blockchain',
      name: 'Blockchain Networks',
      status: 'online',
      description: 'Ethereum, Polygon, Arbitrum, and Base are accessible',
      lastUpdated: '5 minutes ago',
      icon: Globe
    },
    {
      id: 'security',
      name: 'Security Monitoring',
      status: 'online',
      description: 'Threat detection and monitoring systems active',
      lastUpdated: '30 seconds ago',
      icon: Shield
    },
    {
      id: 'deployment',
      name: 'Contract Deployment',
      status: 'warning',
      description: 'High network congestion may affect deployment times',
      lastUpdated: '10 minutes ago',
      icon: Activity
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <CheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-l-success bg-green-50';
      case 'offline':
        return 'border-l-error bg-red-50';
      case 'warning':
        return 'border-l-warning bg-yellow-50';
      default:
        return 'border-l-success bg-green-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-success';
      case 'offline':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-success';
    }
  };

  const overallStatus = statusItems.every(item => item.status === 'online') ? 'online' : 'warning';

  return (
    <section className="section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="h2 text-charcoal mb-4">
            System <span className="text-gradient-primary">Status</span>
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Real-time status of all One Click services and infrastructure.
          </p>
        </div>

        {/* Overall Status */}
        <div className="mb-12">
          <div className={`max-w-2xl mx-auto p-6 rounded-2xl border-l-4 ${getStatusColor(overallStatus)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(overallStatus)}
                <div>
                  <h3 className="text-xl font-semibold text-charcoal">
                    Overall System Status
                  </h3>
                  <p className="text-gray-600">
                    {overallStatus === 'online' 
                      ? 'All systems operational' 
                      : overallStatus === 'warning'
                      ? 'Some systems experiencing issues'
                      : 'Multiple systems offline'
                    }
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${getStatusText(overallStatus)}`}>
                {overallStatus === 'online' ? '100%' : overallStatus === 'warning' ? '95%' : '75%'}
              </div>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statusItems.map((item) => (
            <div key={item.id} className={`card border-l-4 ${getStatusColor(item.status)}`}>
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`text-sm font-medium ${getStatusText(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {item.description}
                </p>
                
                <div className="text-xs text-gray-500">
                  Last updated: {item.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status History */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="h3 text-charcoal mb-6 text-center">
            Recent Status Updates
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>API Services</strong> - All endpoints responding normally
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>Contract Deployment</strong> - High network congestion detected
                </p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>AI Generation</strong> - All AI providers operational
                </p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <a href="/status" className="btn btn-utility">
              View Full Status History
            </a>
          </div>
        </div>

        {/* Incident Response */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="h3 text-charcoal mb-4">
              Incident Response
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We maintain a 24/7 incident response team to ensure minimal downtime. 
              For urgent issues, contact our support team immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/support" className="btn btn-primary">
                🚨 Report an Issue
              </a>
              <a href="/status" className="btn btn-secondary">
                📊 Status Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStatus;
