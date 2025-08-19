"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Zap, Target, AlertTriangle, CheckCircle, Clock, DollarSign, CreditCard, Wallet } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";
import { deploySecurityTrapContract } from "../../lib/contractDeployer";

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
  const { isConnected, address, token } = useWallet();
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
  const [userContractAddress, setUserContractAddress] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userContractAddress');
      if (stored) setUserContractAddress(stored);
    } catch {}
  }, []);

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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Proceed to deployment
      setDeploymentStep('deploying');
      await handleDeployment();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDeployment = async () => {
    if (!selectedTemplate) return;

    try {
      // Simulate deployment progress
      for (let i = 0; i <= 100; i += 10) {
        setDeploymentProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Generate mock deployment hash
      const mockHash = '0x' + Math.random().toString(16).substr(2, 64);
      setDeploymentHash(mockHash);

      // Simulate contract deployment
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setUserContractAddress(mockAddress);
      localStorage.setItem('userContractAddress', mockAddress);

      setDeploymentStep('success');
    } catch (error) {
      alert('Deployment failed. Please try again.');
      setDeploymentStep('configure');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Deploy Security Traps
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our pre-configured security trap templates and deploy them 
              with one-click automation. Protect your DeFi protocols instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Deployment Progress */}
        {deploymentStep !== 'select' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Deployment Progress</h2>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                Step {deploymentStep === 'configure' ? '1' : deploymentStep === 'payment' ? '2' : deploymentStep === 'deploying' ? '3' : '4'} of 4
              </Badge>
            </div>
            
                         <div className="space-y-4">
               <div className="flex items-center">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-green-500">
                   <CheckCircle className="w-5 h-5 text-white" />
                 </div>
                 <span className="text-gray-300">Template Selection</span>
               </div>
               
               <div className="flex items-center">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                   deploymentStep === 'configure' ? 'bg-orange-500' : 'bg-green-500'
                 }`}>
                   {deploymentStep === 'configure' ? <Clock className="w-5 h-5 text-white" /> : <CheckCircle className="w-5 h-5 text-white" />}
                 </div>
                 <span className="text-gray-300">Configuration</span>
               </div>
               
               <div className="flex items-center">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                   deploymentStep === 'payment' ? 'bg-orange-500' : deploymentStep === 'deploying' || deploymentStep === 'success' ? 'bg-green-500' : 'bg-gray-600'
                 }`}>
                   {deploymentStep === 'payment' ? <Clock className="w-5 h-5 text-white" /> : deploymentStep === 'deploying' || deploymentStep === 'success' ? <CheckCircle className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                 </div>
                 <span className="text-gray-300">Payment</span>
               </div>
               
               <div className="flex items-center">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                   deploymentStep === 'success' ? 'bg-green-500' : deploymentStep === 'deploying' ? 'bg-orange-500' : 'bg-gray-600'
                 }`}>
                   {deploymentStep === 'deploying' ? <Clock className="w-5 h-5 text-white" /> : deploymentStep === 'success' ? <CheckCircle className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                 </div>
                 <span className="text-gray-300">Deployment</span>
               </div>
             </div>
          </div>
        )}

        {/* Template Selection */}
        {deploymentStep === 'select' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Choose Your Security Trap</h2>
              <p className="text-gray-300">Select from our professionally crafted security trap templates</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trapTemplates.map((template) => (
                <Card key={template.id} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-white mb-2">{template.name}</CardTitle>
                        <CardDescription className="text-gray-300 text-sm leading-relaxed">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-orange-400 mb-1">{template.cost}</div>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                          {template.deploymentTime}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Difficulty and Security Level */}
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <Badge className={getSecurityLevelColor(template.securityLevel)}>
                        {template.securityLevel} Security
                      </Badge>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="text-xs text-gray-400 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Select Button */}
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Select Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Configuration Step */}
        {deploymentStep === 'configure' && selectedTemplate && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Configure Your Trap</h2>
              <p className="text-gray-300">Customize the settings for your {selectedTemplate.name}</p>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Trap Configuration</CardTitle>
                <CardDescription className="text-gray-300">
                  Set up your security trap parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Trap Name</label>
                    <input
                      type="text"
                      value={customConfig.trapName}
                      onChange={(e) => setCustomConfig({...customConfig, trapName: e.target.value})}
                      placeholder="My Security Trap"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Reward Percentage</label>
                    <input
                      type="number"
                      value={customConfig.rewardPercentage}
                      onChange={(e) => setCustomConfig({...customConfig, rewardPercentage: Number(e.target.value)})}
                      min="1"
                      max="50"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={customConfig.description}
                    onChange={(e) => setCustomConfig({...customConfig, description: e.target.value})}
                    placeholder="Describe your security trap..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Attackers</label>
                  <input
                    type="number"
                    value={customConfig.maxAttackers}
                    onChange={(e) => setCustomConfig({...customConfig, maxAttackers: Number(e.target.value)})}
                    min="1"
                    max="100"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setDeploymentStep('select')}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setDeploymentStep('payment')}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Step */}
        {deploymentStep === 'payment' && selectedTemplate && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Payment & Deployment</h2>
              <p className="text-gray-300">Complete payment to deploy your security trap</p>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Payment Summary</CardTitle>
                <CardDescription className="text-gray-300">
                  Review your order and select payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Order Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Template:</span>
                      <span className="text-white">{selectedTemplate.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-orange-400 font-semibold">{selectedTemplate.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deployment Time:</span>
                      <span className="text-white">{selectedTemplate.deploymentTime}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Payment Method</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="wallet"
                        checked={paymentMethod === 'wallet'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-5 w-5 text-orange-400" />
                        <span className="text-white">Wallet Payment (Recommended)</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-orange-400" />
                        <span className="text-white">Credit Card (Coming Soon)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setDeploymentStep('configure')}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    {isProcessingPayment ? 'Processing...' : `Pay ${selectedTemplate.cost}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deployment Step */}
        {deploymentStep === 'deploying' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">Deploying Your Security Trap</h2>
              <p className="text-gray-300 mb-6">Please wait while we deploy your security trap to the blockchain</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${deploymentProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-400">{deploymentProgress}% Complete</p>
            </div>
          </div>
        )}

        {/* Success Step */}
        {deploymentStep === 'success' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">Deployment Successful!</h2>
              <p className="text-gray-300 mb-6">Your security trap has been deployed successfully</p>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Contract Address:</span>
                    <span className="text-white font-mono">{userContractAddress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Transaction Hash:</span>
                    <span className="text-white font-mono">{deploymentHash}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setDeploymentStep('select')}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Deploy Another
                </Button>
                <Button
                  onClick={() => window.location.href = '/app'}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
