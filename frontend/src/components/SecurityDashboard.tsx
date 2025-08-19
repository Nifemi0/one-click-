'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  Fingerprint, 
  Smartphone, 
  Key,
  TrendingUp,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { aiSecurityService, SecurityThreat, SecurityScore, ContractAudit } from '../lib/aiSecurity';
import { mfaService, MFAMethod } from '../lib/mfaService';
import { useWallet } from '../providers/WalletProvider';
import { advancedFeaturesTestSuite } from '../lib/advancedFeaturesTest';

interface SecurityDashboardProps {
  className?: string;
}

export function SecurityDashboard({ className }: SecurityDashboardProps) {
  const { address, isConnected } = useWallet();
  const [securityScore, setSecurityScore] = useState<SecurityScore | null>(null);
  const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([]);
  const [recentThreats, setRecentThreats] = useState<SecurityThreat[]>([]);
  const [contractAudits, setContractAudits] = useState<ContractAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'mfa' | 'audits'>('overview');

  useEffect(() => {
    if (isConnected && address) {
      loadSecurityData();
    }
  }, [isConnected, address]);

  const loadSecurityData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      // Load security score
      const score = await aiSecurityService.calculateSecurityScore(address);
      setSecurityScore(score);

      // Load MFA methods
      const methods = await mfaService.getMFAMethods();
      setMfaMethods(methods);

      // Load recent threats (simulated for now)
      const threats = await loadRecentThreats();
      setRecentThreats(threats);

      // Load contract audits
      const audits = await loadContractAudits();
      setContractAudits(audits);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentThreats = async (): Promise<SecurityThreat[]> => {
    // Simulate recent threats - in real implementation, this would come from the AI service
    return [
      {
        id: '1',
        type: 'transaction',
        severity: 'low',
        description: 'High gas usage detected in recent transaction',
        timestamp: Date.now() - 3600000,
        confidence: 0.7,
        recommendations: ['Review transaction complexity', 'Verify gas estimation']
      },
      {
        id: '2',
        type: 'wallet',
        severity: 'medium',
        description: 'Suspicious address pattern detected',
        timestamp: Date.now() - 7200000,
        confidence: 0.6,
        recommendations: ['Verify address legitimacy', 'Double-check before interaction']
      }
    ];
  };

  const loadContractAudits = async (): Promise<ContractAudit[]> => {
    if (!address) return [];
    
    try {
      // Audit the user's deployed contract if available
      const userContract = localStorage.getItem('userContractAddress');
      if (userContract) {
        const audit = await aiSecurityService.auditSmartContract(userContract);
        return [audit];
      }
    } catch (error) {
      console.error('Failed to audit contract:', error);
    }
    
    return [];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (score >= 60) return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    if (score >= 40) return <AlertTriangle className="w-6 h-6 text-orange-400" />;
    return <AlertTriangle className="w-6 h-6 text-red-400" />;
  };

  if (!isConnected) {
    return (
      <Card className={`bg-gray-900/50 border-gray-800 ${className}`}>
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Connect your wallet to view security dashboard</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={`bg-gray-900/50 border-gray-800 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading security data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="section-header">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Security Dashboard</h2>
          <div className="stack-sm">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              onClick={async () => {
                try {
                  const report = await advancedFeaturesTestSuite.generateTestReport();
                  console.log('Test Report:', report);
                  alert('Test suite completed! Check console for detailed report.');
                } catch (error) {
                  console.error('Test suite failed:', error);
                  alert('Test suite failed. Check console for details.');
                }
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Run Tests
            </Button>
            <Badge variant="outline" className="text-green-400 border-green-500 bg-green-500/10">
              <Shield className="w-4 h-4 mr-2" />
              Active Protection
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-container">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'threats', label: 'Threats', icon: AlertTriangle },
          { id: 'mfa', label: 'MFA', icon: Lock },
          { id: 'audits', label: 'Audits', icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="auto-grid">
          {/* Overall Security Score */}
          <div className="card-item">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(securityScore?.overall || 0)}`}>
                    {securityScore?.overall || 0}/100
                  </p>
                </div>
                {getScoreIcon(securityScore?.overall || 0)}
              </div>
            </div>
          </div>

          {/* Wallet Security */}
          <div className="card-item">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Security</p>
                  <p className={`text-2xl font-bold ${getScoreColor(securityScore?.wallet || 0)}`}>
                    {securityScore?.wallet || 0}/100
                  </p>
                </div>
                <Key className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Contract Security */}
          <div className="card-item">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contract Security</p>
                  <p className={`text-2xl font-bold ${getScoreColor(securityScore?.contracts || 0)}`}>
                    {securityScore?.contracts || 0}/100
                  </p>
                </div>
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* MFA Status */}
          <div className="card-item">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MFA Status</p>
                  <p className="text-2xl font-bold text-green-400">
                    {mfaMethods.filter(m => m.isEnabled).length} Active
                  </p>
                </div>
                <Lock className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threats Tab */}
      {activeTab === 'threats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Security Threats</h3>
            <Badge variant="outline" className="text-orange-400 border-orange-500">
              {recentThreats.length} Detected
            </Badge>
          </div>
          
          {recentThreats.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400">No security threats detected</p>
              </CardContent>
            </Card>
          ) : (
            recentThreats.map((threat) => (
              <Card key={threat.id} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                          {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {new Date(threat.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-2">{threat.description}</p>
                      <div className="space-y-1">
                        {threat.recommendations.map((rec, index) => (
                          <p key={index} className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Confidence</p>
                      <p className="text-lg font-semibold text-orange-400">
                        {Math.round(threat.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* MFA Tab */}
      {activeTab === 'mfa' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Multi-Factor Authentication</h3>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Lock className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mfaMethods.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800 col-span-2">
                <CardContent className="p-6 text-center">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No MFA methods configured</p>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Setup MFA
                  </Button>
                </CardContent>
              </Card>
            ) : (
              mfaMethods.map((method) => (
                <Card key={method.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {method.type === 'biometric' && <Fingerprint className="w-5 h-5 text-blue-400" />}
                        {method.type === 'totp' && <Smartphone className="w-5 h-5 text-green-400" />}
                        {method.type === 'hardware' && <Key className="w-5 h-5 text-purple-400" />}
                        <span className="text-white font-medium">{method.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={method.isEnabled ? 'text-green-400 border-green-500' : 'text-gray-400 border-gray-500'}
                      >
                        {method.isEnabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        Created: {new Date(method.createdAt).toLocaleDateString()}
                      </p>
                      {method.lastUsed && (
                        <p className="text-sm text-gray-400">
                          Last used: {new Date(method.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => method.isEnabled ? mfaService.disableMFAMethod(method.id) : mfaService.enableMFAMethod(method.id)}
                      >
                        {method.isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400 border-red-500">
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Smart Contract Audits</h3>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Target className="w-4 h-4 mr-2" />
              New Audit
            </Button>
          </div>

          {contractAudits.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No contract audits available</p>
                <p className="text-sm text-gray-500">Deploy a contract first to run security audits</p>
              </CardContent>
            </Card>
          ) : (
            contractAudits.map((audit) => (
              <Card key={audit.contractAddress} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Contract Audit</p>
                      <p className="text-sm text-gray-400 font-mono">
                        {audit.contractAddress.slice(0, 6)}...{audit.contractAddress.slice(-4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getSeverityColor(audit.securityScore >= 80 ? 'low' : audit.securityScore >= 60 ? 'medium' : 'high')}>
                        Score: {audit.securityScore}/100
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Vulnerabilities Found:</p>
                      {audit.vulnerabilities.length === 0 ? (
                        <p className="text-green-400 text-sm">No vulnerabilities detected</p>
                      ) : (
                        <ul className="space-y-1">
                          {audit.vulnerabilities.map((vuln, index) => (
                            <li key={index} className="text-sm text-red-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {vuln}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Recommendations:</p>
                      {audit.recommendations.length === 0 ? (
                        <p className="text-green-400 text-sm">No recommendations needed</p>
                      ) : (
                        <ul className="space-y-1">
                          {audit.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-blue-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="text-sm text-gray-400">
                      Last audit: {new Date(audit.lastAudit).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
