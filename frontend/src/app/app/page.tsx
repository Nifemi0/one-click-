"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useWallet } from "../../providers/WalletProvider";
import { Shield, Zap, Target, AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp, Activity, Users, Eye, Settings, Plus, RefreshCw } from "lucide-react";
import { DashboardService } from "../../lib/dashboardService";
import { TrapDeployment, SecurityAlert, TrapStats, DashboardActivity } from "../../types/dashboard";

// Disable SSR for this page since it uses wallet hooks
export const dynamic = 'force-dynamic';

// Types are now imported from types/dashboard.ts

export default function DashboardPage() {
  const { isConnected, address } = useWallet();
  const [trapDeployments, setTrapDeployments] = useState<TrapDeployment[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [trapStats, setTrapStats] = useState<TrapStats>({
    totalDeployments: 0,
    activeTraps: 0,
    totalRevenue: 0,
    successRate: 0,
    totalGasUsed: 0,
    lastDeployment: null,
    monthlyDeployments: 0,
    securityScore: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected, selectedTimeframe]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!address) {
        setIsLoading(false);
        return;
      }

      // Fetch real data from backend API
      const dashboardData = await DashboardService.refreshDashboard(address);
      
      setTrapDeployments(dashboardData.deployments);
      setSecurityAlerts(dashboardData.alerts);
      setTrapStats(dashboardData.stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'triggered': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Eye className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">Connect your wallet to view your dashboard</p>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/'}
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Security Dashboard</h1>
              <p className="text-xl text-gray-300">
                Monitor and manage your deployed security traps
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
                             <Button 
                 onClick={loadDashboardData}
                 variant="outline"
                 className="border-white/20 text-white hover:bg-white/10 mr-2"
               >
                 <RefreshCw className="h-4 w-4 mr-2" />
                 Refresh
               </Button>
               <Button 
                 onClick={() => window.location.href = '/deploy'}
                 className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Deploy New Trap
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Traps</p>
                  <p className="text-3xl font-bold text-white">{trapStats.totalDeployments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Traps</p>
                  <p className="text-3xl font-bold text-white">{trapStats.activeTraps}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Triggers</p>
                  <p className="text-3xl font-bold text-white">{trapStats.totalGasUsed}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Value Protected</p>
                  <p className="text-3xl font-bold text-white">{trapStats.totalRevenue} ETH</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Security Overview</h2>
          <div className="flex gap-2">
            {(['24h', '7d', '30d', 'all'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={selectedTimeframe === timeframe 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trap Deployments */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Deployed Traps
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor your active security traps and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading traps...</p>
                  </div>
                ) : trapDeployments.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No traps deployed yet</p>
                    <Button 
                      onClick={() => window.location.href = '/deploy'}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      Deploy Your First Trap
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trapDeployments.map((trap) => (
                      <div key={trap.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                              <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{trap.name}</h4>
                              <p className="text-sm text-gray-400">{trap.type}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(trap.status)}>
                            {trap.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Deployed</p>
                            <p className="text-white">{new Date(trap.deployedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Contract</p>
                            <p className="text-white font-mono text-xs">{trap.contractAddress.slice(0, 6)}...{trap.contractAddress.slice(-4)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Triggers</p>
                            <p className="text-white">{trap.triggers}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Revenue</p>
                            <p className="text-orange-400 font-semibold">{trap.revenueGenerated} ETH</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-gray-400 font-mono">{trap.contractAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          <div>
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Alerts
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Recent security events and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">Loading alerts...</p>
                  </div>
                ) : securityAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No security alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {securityAlerts.map((alert) => (
                      <div key={alert.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-500/20' : 
                            alert.severity === 'medium' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                          }`}>
                            {getAlertTypeIcon(alert.severity)}
                          </div>
                          <div className="flex-1">
                                                         <div className="flex items-center gap-2 mb-1">
                               <Badge className={getAlertTypeColor(alert.severity)}>
                                 {alert.severity}
                               </Badge>
                              <span className="text-xs text-gray-400">{alert.timestamp}</span>
                            </div>
                            <p className="text-sm text-white">{alert.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                  onClick={() => window.location.href = '/deploy'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy New Trap
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                  onClick={() => window.location.href = '/marketplace'}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-12">
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
              <CardDescription className="text-gray-300">
                Monthly deployment statistics and success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{trapStats.monthlyDeployments}</h3>
                  <p className="text-gray-400">Monthly Deployments</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{trapStats.successRate}%</h3>
                  <p className="text-gray-400">Success Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                                     <h3 className="text-2xl font-bold text-white mb-2">{trapStats.totalGasUsed}</h3>
                   <p className="text-gray-400">Total Gas Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
