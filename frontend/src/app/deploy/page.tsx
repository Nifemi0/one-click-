"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Shield, Zap, Target, AlertTriangle, CheckCircle, Clock, DollarSign, CreditCard, Wallet, RefreshCw } from "lucide-react";
import { useWallet } from "../../providers/WalletProvider";
import { SmartContractDeploymentService } from "../../lib/smartContractDeployment";
import { TrapTemplate, DeploymentConfig, DeploymentResult } from "../../types/deploy";
import { Header } from "../../components/Header";

// Disable SSR for this page since it uses wallet hooks
export const dynamic = 'force-dynamic';

// Types are now imported from types/deploy.ts

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
  const [userContractAddress, setUserContractAddress] = useState<string | null>(null);
  
  // We'll load real contract templates dynamically
  const [trapTemplates, setTrapTemplates] = useState<TrapTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);



  useEffect(() => {
    try {
      const stored = localStorage.getItem('userContractAddress');
      if (stored) setUserContractAddress(stored);
    } catch {}
  }, []);

  // Load real contract templates with gas estimation from backend
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        
        // Fetch templates from backend API
        const response = await fetch('/api/contracts/templates');
        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.status}`);
        }
        
        const templatesWithGas = await response.json();
        setTrapTemplates(templatesWithGas);
        setTemplatesLoading(false);
      } catch (error) {
        console.error('Error loading templates:', error);
        // Fallback to static templates if API fails
        const fallbackTemplates = [
          {
            id: 'advancedhoneypot',
            name: 'AdvancedHoneypot',
            type: 'Honeypot',
            description: 'Advanced honeypot security trap with fund capture and attack detection',
            price: 0.02,
            difficulty: 'Advanced' as const,
            deploymentTime: '2-3 minutes',
            securityLevel: 'High' as const,
            features: ['Fund Capture', 'Attack Detection', 'Advanced Monitoring'],
            tags: ['Honeypot', 'Advanced', 'Security'],
            contractCode: '// Real compiled contract',
            preview: 'Advanced honeypot protection',
            author: 'SecurityMaster',
            lastUpdated: '2 days ago',
            gasEstimate: 270000 // Fallback estimate
          },
          {
            id: 'mevprotectionsuite',
            name: 'MEVProtectionSuite',
            type: 'Monitoring',
            description: 'MEV protection suite with sandwich attack prevention',
            price: 0.03,
            difficulty: 'Advanced' as const,
            deploymentTime: '3-4 minutes',
            securityLevel: 'High' as const,
            features: ['MEV Protection', 'Sandwich Attack Prevention', 'Real-time Monitoring'],
            tags: ['MEV', 'Advanced', 'Protection'],
            contractCode: '// Real compiled contract',
            preview: 'MEV attack prevention',
            author: 'DeFiGuard',
            lastUpdated: '1 week ago',
            gasEstimate: 360000 // Fallback estimate
          },
          {
            id: 'multisigvault',
            name: 'MultiSigVault',
            type: 'Basic',
            description: 'Multi-signature vault with access control',
            price: 0.01,
            difficulty: 'Intermediate' as const,
            deploymentTime: '2-3 minutes',
            securityLevel: 'Medium' as const,
            features: ['Multi-Signature', 'Access Control', 'Fund Security'],
            tags: ['MultiSig', 'Intermediate', 'Security'],
            contractCode: '// Real compiled contract',
            preview: 'Multi-signature security',
            author: 'VaultMaster',
            lastUpdated: '3 days ago',
            gasEstimate: 208000 // Fallback estimate
          }
        ];
        
        setTrapTemplates(fallbackTemplates);
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
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
      setDeploymentStep('deploying');
      setDeploymentProgress(0);

      // Initialize deployment service
      const deploymentService = new SmartContractDeploymentService();
      const initialized = await deploymentService.initialize();
      
      if (!initialized) {
        throw new Error('Failed to initialize deployment service');
      }

      // Create deployment configuration
      const config: DeploymentConfig = {
        template: selectedTemplate,
        customizations: {
          name: customConfig.trapName || selectedTemplate.name,
          description: customConfig.description || selectedTemplate.description,
          securityLevel: selectedTemplate.securityLevel,
        }
      };

      // Estimate gas first
      const gasEstimate = await deploymentService.estimateGas(config);
      if (!gasEstimate) {
        throw new Error('Failed to estimate gas costs');
      }

      // Update progress
      setDeploymentProgress(30);

      // Deploy the contract
      const result: DeploymentResult = await deploymentService.deployContract(config);
      
      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }

      // Update progress
      setDeploymentProgress(80);

      // Verify deployment
      if (result.contractAddress) {
        const verified = await deploymentService.verifyDeployment(result.contractAddress, selectedTemplate.type);
        if (verified) {
          setDeploymentProgress(100);
          setDeploymentHash(result.transactionHash || '');
          setUserContractAddress(result.contractAddress);
          localStorage.setItem('userContractAddress', result.contractAddress);
          setDeploymentStep('success');
        } else {
          throw new Error('Deployment verification failed');
        }
      } else {
        throw new Error('No contract address returned');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      alert(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 from-gray-50 via-blue-50 to-gray-100">
      <Header />
      {/* Header Section */}
      <div className="bg-white/5 dark:bg-white/5 bg-white/80 dark:backdrop-blur-sm backdrop-blur-sm border-b border-white/10 dark:border-white/10 border-gray-200 dark:border-gray-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white dark:text-white text-gray-900 mb-4">
              Deploy Security Traps
            </h1>
            <p className="text-xl text-gray-300 dark:text-gray-300 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our pre-configured security trap templates and deploy them 
              with one-click automation. Protect your DeFi protocols instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 {/* Deployment Progress */}
         {deploymentStep !== 'select' && (
           <div className="bg-white/5 dark:bg-white/5 bg-white/80 dark:backdrop-blur-sm backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10 dark:border-white/10 border-gray-200 dark:border-gray-800">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900">Deployment Progress</h2>
               <div className="flex items-center gap-2">
                 <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                   Step {deploymentStep === 'configure' ? '1' : deploymentStep === 'payment' ? '2' : deploymentStep === 'deploying' ? '3' : '4'} of 4
                 </Badge>
                {deploymentStep === 'deploying' && (
                  <Button
                    onClick={() => {
                      setDeploymentStep('select');
                      setDeploymentProgress(0);
                      setDeploymentHash('');
                      setUserContractAddress(null);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
            
                                                   <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-green-500">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-300 dark:text-gray-300 text-gray-600">Template Selection</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    deploymentStep === 'configure' ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {deploymentStep === 'configure' ? <Clock className="w-5 h-5 text-white" /> : <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-gray-300 dark:text-gray-300 text-gray-600">Configuration</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    deploymentStep === 'payment' ? 'bg-orange-500' : deploymentStep === 'deploying' || deploymentStep === 'success' ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    {deploymentStep === 'payment' ? <Clock className="w-5 h-5 text-white" /> : deploymentStep === 'deploying' || deploymentStep === 'success' ? <CheckCircle className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-gray-300 dark:text-gray-300 text-gray-600">Payment</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    deploymentStep === 'success' ? 'bg-green-500' : deploymentStep === 'deploying' ? 'bg-orange-500' : 'bg-gray-600'
                  }`}>
                    {deploymentStep === 'deploying' ? <Clock className="w-5 h-5 text-white" /> : deploymentStep === 'success' ? <CheckCircle className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-gray-300 dark:text-gray-300 text-gray-600">Deployment</span>
                </div>
              </div>

                           {/* Progress Bar for Deploying Step */}
              {deploymentStep === 'deploying' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300 dark:text-gray-300 text-gray-600">Deployment Progress</span>
                    <span className="text-sm text-orange-400 font-medium">{deploymentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 dark:bg-gray-700 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${deploymentProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-gray-300 dark:text-gray-300 text-gray-600 text-sm">
                      {deploymentProgress < 30 && 'Initializing deployment service...'}
                      {deploymentProgress >= 30 && deploymentProgress < 80 && 'Deploying smart contract...'}
                      {deploymentProgress >= 80 && deploymentProgress < 100 && 'Verifying deployment...'}
                      {deploymentProgress === 100 && 'Deployment successful!'}
                    </p>
                  </div>
                </div>
              )}
          </div>
        )}

                 {/* Template Selection */}
         {deploymentStep === 'select' && (
           <div className="space-y-6">
                           <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-4">Choose Your Security Trap</h2>
                <p className="text-gray-300 dark:text-gray-300 text-gray-600">Select from our professionally crafted security trap templates</p>
              </div>
             
             {templatesLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 animate-pulse">
                     <div className="h-4 bg-white/10 rounded mb-2"></div>
                     <div className="h-3 bg-white/10 rounded mb-4"></div>
                     <div className="h-3 bg-white/10 rounded mb-2"></div>
                     <div className="h-3 bg-white/10 rounded"></div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {trapTemplates.map((template) => (
                                 <Card key={template.id} className="bg-white/5 dark:bg-white/5 bg-white/80 dark:backdrop-blur-sm backdrop-blur-sm border border-white/10 dark:border-white/10 border-gray-200 dark:border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                   <CardHeader className="pb-4">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <CardTitle className="text-xl text-white dark:text-white text-gray-900 mb-2">{template.name}</CardTitle>
                         <CardDescription className="text-gray-300 dark:text-gray-300 text-gray-600 text-sm leading-relaxed">
                           {template.description}
                         </CardDescription>
                       </div>
                                            <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                          {template.price} ETH
                        </div>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                          {template.gasEstimate ? `${(template.gasEstimate / 1000).toFixed(0)}k Gas` : '~50k Gas'}
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
                       <h4 className="text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-600 mb-2">Features:</h4>
                       <ul className="space-y-1">
                         {template.features.map((feature, index) => (
                           <li key={index} className="text-xs text-gray-400 dark:text-gray-400 text-gray-500 flex items-center">
                             <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                             {feature}
                           </li>
                         ))}
                       </ul>
                     </div>

                                         {/* Real Contract Badge */}
                     {template.contractCode && template.contractCode !== '// Basic Honeypot Contract Code' && (
                       <div className="mt-3 p-2 bg-green-900/20 border border-green-500/30 rounded text-center">
                         <span className="text-green-400 text-xs">✅ Real Compiled Contract</span>
                       </div>
                     )}

                     {/* Select Button */}
                     <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                       <Shield className="h-4 w-4 mr-2" />
                       Select Template
                     </Button>
                   </CardContent>
                 </Card>
               ))}
             </div>
             )}
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
                      <span className="text-orange-400 font-semibold">{selectedTemplate.price} ETH</span>
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
                    {isProcessingPayment ? 'Processing...' : `Pay ${selectedTemplate.price} ETH`}
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
