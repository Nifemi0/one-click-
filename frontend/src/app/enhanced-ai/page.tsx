"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Brain, Code, Rocket, MessageSquare, Zap, CheckCircle } from 'lucide-react';

interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ContractSpecification {
  description: string;
  securityLevel: 'basic' | 'premium' | 'enterprise';
  complexity: 'simple' | 'medium' | 'complex';
  targetNetwork: number;
  budget: number;
  customRequirements: string[];
}

export default function EnhancedAIPage() {
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [contractSpec, setContractSpec] = useState<ContractSpecification>({
    description: '',
    securityLevel: 'premium',
    complexity: 'medium',
    targetNetwork: 560048, // Hoodi testnet
    budget: 0.02,
    customRequirements: []
  });
  
  const CORRECT_PASSWORD = 'oneclick2024';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsPasswordProtected(false);
      setShowPasswordForm(false);
      alert('✅ Access granted! Welcome to the Enhanced AI Trap Creation feature.');
    } else {
      alert('❌ Incorrect password. This feature is restricted.');
      setPassword('');
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: AIChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setUserInput('');
    addMessage('user', userMessage);

    // Start AI generation
    setIsGenerating(true);
    addMessage('assistant', '🤖 Analyzing your requirements and generating contract specifications...');

    try {
      // Call the real AI backend API
      const response = await fetch('https://one-click-c308.onrender.com/api/ai-contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: userMessage,
          securityLevel: 'premium',
          complexity: 'medium',
          targetNetwork: 560048, // Hoodi testnet
          customRequirements: extractRequirements(userMessage)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate contract');
      }

      const result = await response.json();
      
      if (result.success) {
        const generatedSpec = {
          description: result.data.description,
          securityLevel: 'premium' as const,
          complexity: 'medium' as const,
          targetNetwork: 560048,
          budget: result.data.estimatedGas * 0.00000002, // Convert gas to ETH estimate
          customRequirements: result.data.securityFeatures
        };
        
        setContractSpec(generatedSpec);
        
        addMessage('assistant', `✅ Contract generated using ${result.data.aiProvider}!\n\n**Security Level:** ${generatedSpec.securityLevel}\n**Complexity:** ${generatedSpec.complexity}\n**Estimated Cost:** ${generatedSpec.budget.toFixed(4)} ETH\n**AI Confidence:** ${(result.data.confidence * 100).toFixed(1)}%\n\n**Security Features:**\n${result.data.securityFeatures.map((f: string) => `• ${f}`).join('\n')}\n\n**Risk Assessment:** ${result.data.riskAssessment.overallRisk.toUpperCase()} (${result.data.riskAssessment.riskScore}/100)\n\nReady to compile and deploy?`);
        
        // Store the generated contract data for later use
        localStorage.setItem('generatedContract', JSON.stringify(result.data));
      } else {
        throw new Error(result.error || 'Generation failed');
      }
      
    } catch (error: any) {
      console.error('AI generation failed:', error);
      addMessage('assistant', '❌ Error generating contract. Please try again or check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };



  const extractRequirements = (input: string): string[] => {
    const requirements = [];
    if (input.toLowerCase().includes('honeypot')) requirements.push('Honeypot functionality');
    if (input.toLowerCase().includes('monitoring')) requirements.push('Real-time monitoring');
    if (input.toLowerCase().includes('sandbox')) requirements.push('Sandbox environment');
    if (input.toLowerCase().includes('alert')) requirements.push('Alert system');
    return requirements;
  };

  const handleCompileAndDeploy = async () => {
    if (!contractSpec.description) {
      alert('Please generate a contract specification first.');
      return;
    }

    setIsDeploying(true);
    addMessage('assistant', '🚀 Starting compilation and deployment process...');

    try {
      // Get the generated contract data
      const generatedContractData = localStorage.getItem('generatedContract');
      if (!generatedContractData) {
        throw new Error('No generated contract data found');
      }

      const contractData = JSON.parse(generatedContractData);

      // Step 1: Compile contract
      addMessage('assistant', '📋 Compiling smart contract...');
      
      const compileResponse = await fetch('https://one-click-c308.onrender.com/api/ai-contracts/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractCode: contractData.contractCode,
          contractName: contractData.contractName
        })
      });

      if (!compileResponse.ok) {
        throw new Error('Contract compilation failed');
      }

      const compileResult = await compileResponse.json();
      if (!compileResult.success) {
        throw new Error(compileResult.error || 'Compilation failed');
      }

      addMessage('assistant', `✅ Contract compiled successfully!\n\n**Gas Estimate:** ${compileResult.data.gasEstimate.toLocaleString()}\n**Compiler Version:** ${compileResult.data.compilerVersion}\n**Bytecode Size:** ${(compileResult.data.bytecode.length / 2).toLocaleString()} bytes`);
      
      // Step 2: Deploy to blockchain
      addMessage('assistant', '⛓️ Deploying to Hoodi testnet...');
      
      const deployResponse = await fetch('https://one-click-c308.onrender.com/api/ai-contracts/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractName: contractData.contractName,
          abi: compileResult.data.abi,
          bytecode: compileResult.data.bytecode,
          gasLimit: compileResult.data.gasEstimate * 1.2, // Add 20% buffer
          gasPrice: '20000000000' // 20 gwei
        })
      });

      if (!deployResponse.ok) {
        throw new Error('Contract deployment failed');
      }

      const deployResult = await deployResponse.json();
      if (!deployResult.success) {
        throw new Error(deployResult.error || 'Deployment failed');
      }
      
      // Step 3: Success
      addMessage('assistant', `🎉 Drosera trap successfully deployed!\n\n**Contract Address:** ${deployResult.data.contractAddress}\n**Transaction Hash:** ${deployResult.data.transactionHash}\n**Gas Used:** ${deployResult.data.gasUsed.toLocaleString()}\n**Deployment Cost:** ${deployResult.data.deploymentCost} ETH\n\nYour Drosera security trap is now active on the Hoodi testnet! 🚀`);
      
      // Clear stored contract data
      localStorage.removeItem('generatedContract');
      
    } catch (error: any) {
      console.error('Deployment failed:', error);
      addMessage('assistant', `❌ Deployment failed: ${error.message}\n\nPlease check your wallet connection and try again.`);
    } finally {
      setIsDeploying(false);
    }
  };

  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Enhanced AI Access</h1>
            <p className="text-gray-300">This premium feature requires authentication</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold"
            >
              <Shield className="w-5 h-5 mr-2" />
              Access Enhanced AI
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              This is a premium feature for authorized users only
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPasswordProtected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Enhanced AI Dashboard</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI-powered DROSERA TRAP creation and deployment. Generate, customize, and deploy 
              sophisticated security traps that monitor, capture, and analyze malicious transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Generation</h3>
            <p className="text-gray-300 text-sm">
              Generate custom Drosera trap contracts using advanced AI algorithms
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Drosera Traps</h3>
            <p className="text-gray-300 text-sm">
              Deploy intelligent security traps with built-in monitoring and capture mechanisms
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Deployment</h3>
            <p className="text-gray-300 text-sm">
              One-click deployment to Hoodi testnet with real-time trap monitoring
            </p>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">AI Drosera Trap Generator</h2>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4 p-4 bg-black/20 rounded-lg">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start a conversation with AI to generate your Drosera security trap</p>
                <p className="text-sm mt-2">Example: "Create a DEX watcher that monitors transactions and flags farming wallets"</p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {(isGenerating || isDeploying) && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span>Processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input and Actions */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your Drosera trap requirements..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isGenerating || isDeploying}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isGenerating || isDeploying}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>

            {/* Contract Specification Display */}
            {contractSpec.description && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Generated Specification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-300"><span className="text-green-400">Description:</span> {contractSpec.description}</p>
                    <p className="text-gray-300"><span className="text-green-400">Security Level:</span> {contractSpec.securityLevel}</p>
                    <p className="text-gray-300"><span className="text-green-400">Complexity:</span> {contractSpec.complexity}</p>
                  </div>
                  <div>
                    <p className="text-gray-300"><span className="text-green-400">Network:</span> Hoodi Testnet</p>
                    <p className="text-green-400"><span className="text-green-400">Estimated Cost:</span> {contractSpec.budget} ETH</p>
                    <p className="text-gray-300"><span className="text-green-400">Requirements:</span> {contractSpec.customRequirements.join(', ') || 'None'}</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleCompileAndDeploy}
                  disabled={isDeploying}
                  className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {isDeploying ? 'Deploying...' : 'Compile & Deploy'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
