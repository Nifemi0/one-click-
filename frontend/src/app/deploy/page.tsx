"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Zap, Target, AlertTriangle, CheckCircle, Clock, DollarSign, CreditCard, Wallet } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";

interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  cost: string;
  costInEth: number;
  deploymentTime: string;
  securityLevel: 'Low' | 'Medium' | 'High';
  features: string[];
  contractCode: string;
}

const trapTemplates: TrapTemplate[] = [
  {
    id: '1',
    name: 'Basic Honeypot Trap',
    description: 'A simple honeypot that lures attackers into a fake vulnerable contract',
    difficulty: 'Basic',
    cost: '0.01 ETH',
    costInEth: 0.01,
    deploymentTime: '2-3 minutes',
    securityLevel: 'Medium',
    features: ['Attack detection', 'Fund protection', 'Basic monitoring'],
    contractCode: '// Basic Honeypot Contract Code'
  },
  {
    id: '2',
    name: 'Reentrancy Guard',
    description: 'Protection against reentrancy attacks',
    difficulty: 'Intermediate',
    cost: '0.03 ETH',
    costInEth: 0.03,
    deploymentTime: '3-4 minutes',
    securityLevel: 'High',
    features: ['Reentrancy protection', 'Gas optimization', 'Advanced monitoring'],
    contractCode: '// Reentrancy Guard Contract Code'
  },
  {
    id: '3',
    name: 'Flash Loan Detector',
    description: 'Detects and blocks flash loan attacks',
    difficulty: 'Intermediate',
    cost: '0.02 ETH',
    costInEth: 0.02,
    deploymentTime: '2-3 minutes',
    securityLevel: 'High',
    features: ['Flash loan detection', 'Real-time blocking', 'Transaction analysis'],
    contractCode: '// Flash Loan Detector Contract Code'
  }
];

export default function DeployPage() {
  const { isConnected, address } = useWallet();
  const [selectedTemplate, setSelectedTemplate] = useState<TrapTemplate | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<'select' | 'configure' | 'payment' | 'deploying' | 'success'>('select');
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [customConfig, setCustomConfig] = useState({
    trapName: '',
    description: '',
    rewardPercentage: 10,
    maxAttackers: 5
  });
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [deploymentHash, setDeploymentHash] = useState<string>('');

  const handleTemplateSelect = (template: TrapTemplate) => {
    setSelectedTemplate(template);
    setDeploymentStep('configure');
  };

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!selectedTemplate) return;

    setIsProcessingPayment(true);

    try {
      if (paymentMethod === 'wallet') {
        // Handle wallet payment
        await handleWalletPayment();
      } else {
        // Handle card payment
        await handleCardPayment();
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!selectedTemplate || !window.ethereum) return;

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Get current gas price
      const gasPrice = await window.ethereum.request({ method: 'eth_gasPrice' });

      // Calculate deployment cost in wei
      const costInWei = (selectedTemplate.costInEth * 1e18).toString(16);
      
      // Create transaction
      const transactionParameters = {
        to: '0x0000000000000000000000000000000000000000', // This would be your payment contract
        from: account,
        value: costInWei,
        gas: '0x5208', // 21000 gas
        gasPrice: gasPrice,
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Payment transaction hash:', txHash);
      
      // Proceed to deployment
      setDeploymentStep('deploying');
      await handleDeployment();
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleCardPayment = async () => {
    // This would integrate with a payment processor like Stripe
    alert('Card payment integration coming soon. Please use wallet payment for now.');
  };

  const handleDeployment = async () => {
    if (!selectedTemplate) return;

    setDeploymentProgress(0);

    try {
      // Step 1: Validate configuration
      setDeploymentProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Compile contract
      setDeploymentProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Deploy to blockchain
      setDeploymentProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Verify deployment
      setDeploymentProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Complete
      setDeploymentProgress(100);
      
      // Generate mock deployment hash
      const mockHash = '0x' + Math.random().toString(16).substr(2, 64);
      setDeploymentHash(mockHash);

      // Call backend API to record deployment
      await recordDeployment(mockHash);

      setDeploymentStep('success');
      
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Deployment failed. Please try again.');
      setDeploymentStep('configure');
    }
  };

  const recordDeployment = async (hash: string) => {
    try {
      const response = await fetch('https://one-click-c308.onrender.com/api/basic-traps/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate?.id,
          trapName: customConfig.trapName,
          description: customConfig.description,
          rewardPercentage: customConfig.rewardPercentage,
          maxAttackers: customConfig.maxAttackers,
          deploymentHash: hash,
          userAddress: address,
          cost: selectedTemplate?.costInEth
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record deployment');
      }

      console.log('Deployment recorded successfully');
    } catch (error) {
      console.error('Failed to record deployment:', error);
      // Don't fail the deployment for this
    }
  };

  const handleBackToSelect = () => {
    setSelectedTemplate(null);
    setDeploymentStep('select');
    setCustomConfig({
      trapName: '',
      description: '',
      rewardPercentage: 10,
      maxAttackers: 5
    });
    setDeploymentHash('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">Connect your wallet to deploy security traps</p>
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

  if (deploymentStep === 'select') {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Deploy Security Traps
            </h1>
            <p className="text-gray-400 text-lg">
              Choose a security trap template and deploy it to protect your assets
            </p>
            <div className="mt-4">
              <Badge variant="outline" className="text-orange-400 border-orange-500">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trapTemplates.map((template) => (
              <Card 
                key={template.id}
                className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`${
                        template.difficulty === 'Basic' ? 'text-green-400 border-green-500' :
                        template.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-500' :
                        'text-red-400 border-red-500'
                      }`}
                    >
                      {template.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-orange-400 font-semibold">{template.cost}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Deployment:</span>
                      <span className="text-blue-400">{template.deploymentTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Security:</span>
                      <span className="text-green-400">{template.securityLevel}</span>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm text-gray-400 mb-2">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (deploymentStep === 'configure') {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Configure Your Trap</h1>
            <p className="text-gray-400">Customize your {selectedTemplate?.name} before deployment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up your trap parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trap Name</label>
                  <input
                    type="text"
                    value={customConfig.trapName}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, trapName: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter trap name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={customConfig.description}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Describe your trap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reward Percentage: {customConfig.rewardPercentage}%</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={customConfig.rewardPercentage}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, rewardPercentage: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Attackers: {customConfig.maxAttackers}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={customConfig.maxAttackers}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, maxAttackers: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Template Summary */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Template Summary</CardTitle>
                <CardDescription>Review your selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Template:</span>
                    <span className="font-semibold">{selectedTemplate?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <Badge variant="outline" className="text-orange-400 border-orange-500">
                      {selectedTemplate?.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-orange-400 font-semibold">{selectedTemplate?.cost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Deployment Time:</span>
                    <span className="text-blue-400">{selectedTemplate?.deploymentTime}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <Button 
                      onClick={() => setDeploymentStep('payment')}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={handleBackToSelect}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              ← Back to Templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (deploymentStep === 'payment') {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Payment & Deployment</h1>
            <p className="text-gray-400">Complete payment to deploy your security trap</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Template:</span>
                  <span className="font-semibold">{selectedTemplate?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Trap Name:</span>
                  <span className="font-semibold">{customConfig.trapName || 'Unnamed Trap'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Deployment Cost:</span>
                  <span className="text-orange-400 font-semibold text-xl">{selectedTemplate?.cost}</span>
                </div>
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-orange-400 font-bold text-2xl">{selectedTemplate?.cost}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="wallet"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="wallet" className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <Wallet className="w-5 h-5" />
                    Pay with Wallet (Recommended)
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="card" className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <CreditCard className="w-5 h-5" />
                    Pay with Card (Coming Soon)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => setDeploymentStep('configure')}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              ← Back to Configuration
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              {isProcessingPayment ? 'Processing...' : `Pay ${selectedTemplate?.cost} & Deploy`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (deploymentStep === 'deploying') {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Zap className="w-12 h-12 text-white animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Deploying Your Trap</h1>
          <p className="text-gray-400 mb-8">Please wait while we deploy your security trap to the blockchain</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${deploymentProgress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-400 mb-8">
            {deploymentProgress < 20 && "Validating configuration..."}
            {deploymentProgress >= 20 && deploymentProgress < 40 && "Compiling smart contract..."}
            {deploymentProgress >= 40 && deploymentProgress < 60 && "Deploying to blockchain..."}
            {deploymentProgress >= 60 && deploymentProgress < 80 && "Verifying deployment..."}
            {deploymentProgress >= 80 && deploymentProgress < 100 && "Finalizing deployment..."}
            {deploymentProgress === 100 && "Deployment complete!"}
          </div>
          
          <div className="text-2xl font-bold text-orange-400">{deploymentProgress}%</div>
        </div>
      </div>
    );
  }

  if (deploymentStep === 'success') {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-green-400">Deployment Successful!</h1>
          <p className="text-gray-400 mb-8">Your security trap has been deployed to the blockchain</p>
          
          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardContent className="p-6">
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Trap Name:</span>
                  <span className="font-semibold">{customConfig.trapName || selectedTemplate?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Contract Address:</span>
                  <span className="font-mono text-sm text-green-400">{deploymentHash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-blue-400">Hoodi Testnet</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Deployment Cost:</span>
                  <span className="text-orange-400">{selectedTemplate?.cost}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/app'}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3"
            >
              Go to Dashboard
            </Button>
            <div>
              <Button 
                onClick={handleBackToSelect}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                Deploy Another Trap
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
