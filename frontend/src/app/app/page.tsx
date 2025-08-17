"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Zap, Target, TrendingUp, Users, Activity } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";

export default function AppPage() {
  const { isConnected, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

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
            </CardContent>
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
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-orange-400">Active Traps</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-white">$2.4K</div>
              <div className="text-sm text-blue-400">Protected Value</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-sm text-green-400">Attacks Blocked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-white">99.8%</div>
              <div className="text-sm text-purple-400">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest security deployments and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Trap deployed successfully</span>
                </div>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Attack blocked on Trap #7</span>
                </div>
                <span className="text-sm text-gray-400">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>New template added to marketplace</span>
                </div>
                <span className="text-sm text-gray-400">1 day ago</span>
              </div>
            </div>
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
