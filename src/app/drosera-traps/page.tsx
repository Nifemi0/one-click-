'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Zap, Eye, Settings } from 'lucide-react';

interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  trapType: string;
  defaultThreshold: number;
  defaultDelay: number;
  price: string;
  features: string[];
  category: string;
}

const trapTemplates: TrapTemplate[] = [
  {
    id: 'honeypot-basic',
    name: 'Basic Honeypot',
    description: 'Simple honeypot trap to catch malicious actors',
    trapType: 'Honeypot',
    defaultThreshold: 1,
    defaultDelay: 0,
    price: '0.001 ETH',
    features: ['Automatic attack detection', 'Fund protection', 'Blacklist management'],
    category: 'Honeypot'
  },
  {
    id: 'flashloan-protection',
    name: 'Flash Loan Protection',
    description: 'Protect against flash loan attacks',
    trapType: 'FlashLoanProtection',
    defaultThreshold: 3,
    defaultDelay: 60,
    price: '0.001 ETH',
    features: ['Transaction frequency monitoring', 'Gas price analysis', 'Pattern detection'],
    category: 'Flash Loan Protection'
  },
  {
    id: 'reentrancy-shield',
    name: 'Reentrancy Shield',
    description: 'Guard against reentrancy attacks',
    trapType: 'ReentrancyGuard',
    defaultThreshold: 2,
    defaultDelay: 30,
    price: '0.005 ETH',
    features: ['Call depth monitoring', 'Time-based protection', 'Attack pattern recognition'],
    category: 'Reentrancy Protection'
  },
  {
    id: 'mev-protection',
    name: 'MEV Protection Suite',
    description: 'Comprehensive MEV attack protection',
    trapType: 'MEVProtection',
    defaultThreshold: 5,
    defaultDelay: 120,
    price: '0.015 ETH',
    features: ['Gas price manipulation detection', 'Slippage protection', 'Sandwich attack prevention'],
    category: 'MEV Protection'
  },
  {
    id: 'access-control',
    name: 'Access Control System',
    description: 'Multi-signature and role-based access control',
    trapType: 'AccessControl',
    defaultThreshold: 1,
    defaultDelay: 0,
    price: '0.01 ETH',
    features: ['Multi-signature support', 'Role management', 'Permission control'],
    category: 'Access Control'
  }
];

export default function DroseraTrapsPage() {
  const { address, isConnected } = useAccount();
  const [selectedTemplate, setSelectedTemplate] = useState<TrapTemplate | null>(null);
  const [activationThreshold, setActivationThreshold] = useState<number>(1);
  const [responseDelay, setResponseDelay] = useState<number>(0);
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    message: string;
    trapId?: number;
    transactionHash?: string;
  } | null>(null);

  useEffect(() => {
    if (selectedTemplate) {
      setActivationThreshold(selectedTemplate.defaultThreshold);
      setResponseDelay(selectedTemplate.defaultDelay);
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (templateId: string) => {
    const template = trapTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  const handleDeployTrap = async () => {
    if (!selectedTemplate || !isConnected) return;

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      // Simulate deployment (replace with actual Drosera trap deployment)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTrapId = Math.floor(Math.random() * 1000) + 1;
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      setDeploymentResult({
        success: true,
        message: `Successfully deployed ${selectedTemplate.name} trap!`,
        trapId: mockTrapId,
        transactionHash: mockTxHash
      });
    } catch (error) {
      setDeploymentResult({
        success: false,
        message: `Failed to deploy trap: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Honeypot': 'bg-red-100 text-red-800',
      'Flash Loan Protection': 'bg-blue-100 text-blue-800',
      'Reentrancy Protection': 'bg-green-100 text-green-800',
      'MEV Protection': 'bg-purple-100 text-purple-800',
      'Access Control': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (!isConnected) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="section-header">
            <h1 className="section-title">Drosera Security Traps</h1>
            <p className="section-subtitle">
              Deploy professional-grade security traps to protect your protocols
            </p>
          </div>
          
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Connect Wallet Required
              </CardTitle>
              <CardDescription>
                Please connect your wallet to deploy Drosera security traps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Drosera traps provide automated security responses to protect your smart contracts
                from various attack vectors including honeypots, flash loans, reentrancy, and MEV attacks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="section-header">
          <h1 className="section-title">Drosera Security Traps</h1>
          <p className="section-subtitle">
            Deploy professional-grade security traps to protect your protocols
          </p>
        </div>

        <div className="auto-grid gap-6">
          {/* Trap Templates */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Available Trap Templates
              </CardTitle>
              <CardDescription>
                Choose from our pre-configured security trap templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trap template" />
                </SelectTrigger>
                <SelectContent>
                  {trapTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{template.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {template.price}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTemplate && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTemplate.description}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Features</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTemplate.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Badge className={`mt-1 ${getCategoryColor(selectedTemplate.category)}`}>
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trap Configuration */}
          {selectedTemplate && (
            <Card className="card-item">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trap Configuration
                </CardTitle>
                <CardDescription>
                  Configure your trap parameters and target
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold">Activation Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      value={activationThreshold}
                      onChange={(e) => setActivationThreshold(Number(e.target.value))}
                      placeholder="Number of triggers before activation"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Default: {selectedTemplate.defaultThreshold}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="delay">Response Delay (seconds)</Label>
                    <Input
                      id="delay"
                      type="number"
                      min="0"
                      max="3600"
                      value={responseDelay}
                      onChange={(e) => setResponseDelay(Number(e.target.value))}
                      placeholder="Delay before executing response"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Default: {selectedTemplate.defaultDelay}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="target">Target Address (Optional)</Label>
                  <Input
                    id="target"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    placeholder="0x... (leave empty for general protection)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Specific address to monitor, or leave empty for general protection
                  </p>
                </div>
                
                <Button
                  onClick={handleDeployTrap}
                  disabled={isDeploying}
                  className="w-full"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying Trap...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Deploy {selectedTemplate.name} Trap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Deployment Result */}
          {deploymentResult && (
            <Card className="card-item">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Deployment Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className={deploymentResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <AlertDescription className={deploymentResult.success ? 'text-green-800' : 'text-red-800'}>
                    {deploymentResult.message}
                  </AlertDescription>
                </Alert>
                
                {deploymentResult.success && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Trap ID:</span>
                      <Badge variant="outline">{deploymentResult.trapId}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Transaction:</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {deploymentResult.transactionHash?.slice(0, 10)}...
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Section */}
        <Card className="card-item mt-8">
          <CardHeader>
            <CardTitle>About Drosera Traps</CardTitle>
            <CardDescription>
              Professional security infrastructure for DeFi protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">What are Drosera Traps?</h4>
                <p className="text-sm text-muted-foreground">
                  Drosera traps are automated security systems that monitor blockchain transactions
                  and execute defensive actions when threats are detected. They provide real-time
                  protection against various attack vectors.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How do they work?</h4>
                <p className="text-sm text-muted-foreground">
                  Each trap implements a detect() function that monitors transactions and a respond()
                  function that executes defensive actions. Traps can blacklist addresses, pause
                  operations, redirect funds, or activate honeypot modes.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Supported Networks</h4>
                <p className="text-sm text-muted-foreground">
                  Currently deployed on Hoodi testnet with plans to expand to mainnet.
                  All traps are compatible with the Drosera network infrastructure.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Security Features</h4>
                <p className="text-sm text-muted-foreground">
                  • Real-time threat detection<br/>
                  • Automated response execution<br/>
                  • Configurable thresholds and delays<br/>
                  • Whitelist/blacklist management<br/>
                  • Multi-signature support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
