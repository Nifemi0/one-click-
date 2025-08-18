"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Zap, Target, TrendingUp, Users, Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";

interface Deployment {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'deploying' | 'failed';
  contractAddress: string;
  deployedAt: string;
  cost: string;
  template: string;
}

interface UserStats {
  totalDeployments: number;
  activeTraps: number;
  totalSpent: number;
  lastDeployment: string | null;
}

export default function AppPage() {
  const { isConnected, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalDeployments: 0,
    activeTraps: 0,
    totalSpent: 0,
    lastDeployment: null
  });
  const [recentDeployments, setRecentDeployments] = useState<Deployment[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
    }
  }, [isConnected, address]);

  const loadUserData = async () => {
    if (!address) return;
    
    setIsLoadingStats(true);
    try {
      // Load user deployments from backend
      const response = await fetch(`https://one-click-c308.onrender.com/api/basic-traps/user-deployments?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRecentDeployments(data.deployments || []);
          
          // Calculate stats from deployments
          const stats: UserStats = {
            totalDeployments: data.deployments?.length || 0,
            activeTraps: data.deployments?.filter((d: Deployment) => d.status === 'active').length || 0,
            totalSpent: data.deployments?.reduce((sum: number, d: Deployment) => sum + parseFloat(d.cost), 0) || 0,
            lastDeployment: data.deployments?.[0]?.deployedAt || null
          };
          setUserStats(stats);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Set default stats for demo
      setUserStats({
        totalDeployments: 0,
        activeTraps: 0,
        totalSpent: 0,
        lastDeployment: null
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleDeployTrap = () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    // Navigate to deploy page
    window.location.href = '/deploy';
  };

  const handleMarketplace = () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    // Navigate to marketplace
    window.location.href = '/marketplace';
  };

  const handleViewAnalytics = () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    // Navigate to analytics (you can create this page later)
    alert("Analytics page coming soon!");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">Connect your wallet to access One Click Security features</p>
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
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            One Click Security Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Welcome back! Ready to deploy some security traps?
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-orange-400 border-orange-500">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Quick Deploy
              </CardTitle>
              <CardDescription>Deploy a security trap in one click</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDeployTrap}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {isLoading ? "Deploying..." : "Deploy Trap"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Marketplace
              </CardTitle>
              <CardDescription>Browse and deploy from templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleMarketplace}
                variant="outline"
                className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                Browse Templates
              </Button>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Analytics
              </CardTitle>
              <CardDescription>View your security metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleViewAnalytics}
                variant="outline"
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : userStats.totalDeployments}
              </div>
              <div className="text-sm text-orange-400">Total Deployments</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : userStats.activeTraps}
              </div>
              <div className="text-sm text-blue-400">Active Traps</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : `${userStats.totalSpent.toFixed(3)} ETH`}
              </div>
              <div className="text-sm text-green-400">Total Spent</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : userStats.lastDeployment ? 'Recent' : 'None'}
              </div>
              <div className="text-sm text-purple-400">Last Deployment</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deployments */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
            <CardDescription>Your latest security trap deployments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading deployments...</p>
              </div>
            ) : recentDeployments.length > 0 ? (
              <div className="space-y-4">
                {recentDeployments.slice(0, 5).map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        deployment.status === 'active' ? 'bg-green-500' :
                        deployment.status === 'deploying' ? 'bg-yellow-500' :
                        deployment.status === 'failed' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <span className="font-medium">{deployment.name}</span>
                        <div className="text-sm text-gray-400">
                          {deployment.template} • {deployment.contractAddress.slice(0, 8)}...{deployment.contractAddress.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{deployment.cost}</div>
                      <div className="text-xs text-gray-500">{deployment.deployedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No deployments yet</p>
                <p className="text-gray-500 text-sm">Deploy your first security trap to get started</p>
                <Button 
                  onClick={handleDeployTrap}
                  className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  Deploy Your First Trap
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Quick Navigation</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => window.location.href = '/deploy'}
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            >
              Deploy Traps
            </Button>
            <Button 
              onClick={() => window.location.href = '/marketplace'}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              Browse Marketplace
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
