import axios from 'axios';

export interface AIContractRequest {
  userPrompt: string;
  securityLevel: 'basic' | 'premium' | 'enterprise';
  complexity: 'simple' | 'medium' | 'complex';
  targetNetwork: number;
  customRequirements: string[];
}

export interface AIContractResponse {
  success: boolean;
  contractCode: string;
  contractName: string;
  description: string;
  securityFeatures: string[];
  estimatedGas: number;
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    riskScore: number;
    details: string[];
  };
  compilationInstructions: string;
  deploymentNotes: string;
  aiProvider: string;
  confidence: number;
}

export class AIIntegrationService {
  private openaiApiKey: string;
  private anthropicApiKey: string;
  private geminiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Generate smart contract using multiple AI providers
   */
  async generateContract(request: AIContractRequest): Promise<AIContractResponse> {
    try {
      console.log('🤖 Starting AI contract generation...');
      
      // Try multiple AI providers in order of preference
      const providers = [
        { name: 'OpenAI', method: this.generateWithOpenAI.bind(this) },
        { name: 'Anthropic', method: this.generateWithAnthropic.bind(this) },
        { name: 'Gemini', method: this.generateWithGemini.bind(this) },
        { name: 'Fallback', method: this.generateFallbackContract.bind(this) }
      ];

      for (const provider of providers) {
        try {
          console.log(`🔄 Trying ${provider.name}...`);
          const result = await provider.method(request);
          if (result.success) {
            console.log(`✅ Successfully generated contract using ${provider.name}`);
            return result;
          }
        } catch (error) {
          console.warn(`⚠️ ${provider.name} failed:`, error);
          continue;
        }
      }

      throw new Error('All AI providers failed');
    } catch (error) {
      console.error('❌ AI contract generation failed:', error);
      return this.generateFallbackContract(request);
    }
  }

  /**
   * Generate contract using OpenAI GPT-4
   */
  private async generateWithOpenAI(request: AIContractRequest): Promise<AIContractResponse> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildOpenAIPrompt(request);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Solidity smart contract developer specializing in DeFi security traps and honeypots. Generate production-ready, secure smart contracts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const contractCode = response.data.choices[0].message.content;
    
    return {
      success: true,
      contractCode: this.extractContractCode(contractCode),
      contractName: this.generateContractName(request),
      description: request.userPrompt,
      securityFeatures: this.extractSecurityFeatures(contractCode),
      estimatedGas: this.estimateGas(request.complexity),
      riskAssessment: this.assessRisk(request.securityLevel, request.complexity),
      compilationInstructions: this.generateCompilationInstructions(),
      deploymentNotes: this.generateDeploymentNotes(request),
      aiProvider: 'OpenAI GPT-4',
      confidence: 0.95
    };
  }

  /**
   * Generate contract using Anthropic Claude
   */
  private async generateWithAnthropic(request: AIContractRequest): Promise<AIContractResponse> {
    if (!this.anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const prompt = this.buildAnthropicPrompt(request);
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': this.anthropicApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const contractCode = response.data.content[0].text;
    
    return {
      success: true,
      contractCode: this.extractContractCode(contractCode),
      contractName: this.generateContractName(request),
      description: request.userPrompt,
      securityFeatures: this.extractSecurityFeatures(contractCode),
      estimatedGas: this.estimateGas(request.complexity),
      riskAssessment: this.assessRisk(request.securityLevel, request.complexity),
      compilationInstructions: this.generateCompilationInstructions(),
      deploymentNotes: this.generateDeploymentNotes(request),
      aiProvider: 'Anthropic Claude',
      confidence: 0.93
    };
  }

  /**
   * Generate contract using Google Gemini
   */
  private async generateWithGemini(request: AIContractRequest): Promise<AIContractResponse> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = this.buildGeminiPrompt(request);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000
        }
      }
    );

    const contractCode = response.data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      contractCode: this.extractContractCode(contractCode),
      contractName: this.generateContractName(request),
      description: request.userPrompt,
      securityFeatures: this.extractSecurityFeatures(contractCode),
      estimatedGas: this.estimateGas(request.complexity),
      riskAssessment: this.assessRisk(request.securityLevel, request.complexity),
      compilationInstructions: this.generateCompilationInstructions(),
      deploymentNotes: this.generateDeploymentNotes(request),
      aiProvider: 'Google Gemini',
      confidence: 0.90
    };
  }

  /**
   * Fallback contract generation when AI providers fail
   */
  private generateFallbackContract(request: AIContractRequest): AIContractResponse {
    console.log('🔄 Using fallback contract generation...');
    
    const contractCode = this.generateBasicContractTemplate(request);
    
    return {
      success: true,
      contractCode,
      contractName: this.generateContractName(request),
      description: request.userPrompt,
      securityFeatures: ['Basic security', 'Input validation', 'Access control'],
      estimatedGas: this.estimateGas(request.complexity),
      riskAssessment: this.assessRisk(request.securityLevel, request.complexity),
      compilationInstructions: this.generateCompilationInstructions(),
      deploymentNotes: this.generateDeploymentNotes(request),
      aiProvider: 'Fallback Template',
      confidence: 0.75
    };
  }

  /**
   * Build prompts for different AI providers
   */
  private buildOpenAIPrompt(request: AIContractRequest): string {
    return `Generate a Solidity smart contract for a DROSERA SECURITY TRAP with the following requirements:

User Request: ${request.userPrompt}
Security Level: ${request.securityLevel}
Complexity: ${request.complexity}
Target Network: Hoodi Testnet (Chain ID: ${request.targetNetwork})
Custom Requirements: ${request.customRequirements.join(', ')}

IMPORTANT: This must be a DROSERA TRAP - a specialized security contract that:
1. Monitors and captures malicious transactions
2. Implements honeypot-like behavior to attract attackers
3. Has built-in analysis and reporting mechanisms
4. Can flag suspicious wallet addresses
5. Implements fund capture mechanisms for security research
6. Includes real-time monitoring and alert systems

Requirements:
1. Generate a complete, compilable Solidity contract
2. Include proper security measures and access controls
3. Add comprehensive error handling and events
4. Include NatSpec documentation
5. Ensure the contract follows best practices
6. Make it deployable to Hoodi testnet
7. MUST implement Drosera trap functionality

Return only the Solidity contract code with no additional text.`;
  }

  private buildAnthropicPrompt(request: AIContractRequest): string {
    return `You are an expert Solidity developer specializing in DROSERA SECURITY TRAPS. Create a Drosera trap smart contract with these specifications:

Request: ${request.userPrompt}
Security: ${request.securityLevel}
Complexity: ${request.complexity}
Network: Hoodi Testnet (${request.targetNetwork})
Features: ${request.customRequirements.join(', ')}

CRITICAL: This must be a DROSERA TRAP contract that:
- Monitors and captures malicious transactions
- Implements honeypot behavior to attract attackers
- Has built-in analysis and reporting mechanisms
- Flags suspicious wallet addresses
- Implements fund capture for security research
- Includes real-time monitoring and alert systems

Generate a production-ready Solidity contract with:
- Proper security implementations
- Access control mechanisms
- Event logging
- Error handling
- NatSpec documentation
- Hoodi testnet compatibility
- DROSERA TRAP functionality

Return only the Solidity code.`;
  }

  private buildGeminiPrompt(request: AIContractRequest): string {
    return `Create a Solidity smart contract for a DROSERA SECURITY TRAP with:

Description: ${request.userPrompt}
Security Level: ${request.securityLevel}
Complexity: ${request.complexity}
Target: Hoodi Testnet
Requirements: ${request.customRequirements.join(', ')}

ESSENTIAL: This must be a DROSERA TRAP contract that:
- Monitors and captures malicious transactions
- Implements honeypot behavior to attract attackers
- Has built-in analysis and reporting mechanisms
- Flags suspicious wallet addresses
- Implements fund capture for security research
- Includes real-time monitoring and alert systems

Generate a complete, secure Solidity contract that:
- Implements proper security measures
- Includes access controls
- Has comprehensive error handling
- Follows Solidity best practices
- Is deployable to Hoodi testnet
- Implements DROSERA TRAP functionality

Return only the Solidity contract code.`;
  }

  /**
   * Helper methods
   */
  private extractContractCode(response: string): string {
    // Extract Solidity code from AI response
    const codeMatch = response.match(/```solidity\s*([\s\S]*?)\s*```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }
    
    // Fallback: look for contract keyword
    const contractMatch = response.match(/contract\s+\w+\s*\{[\s\S]*\}/);
    if (contractMatch) {
      return contractMatch[0];
    }
    
    return response;
  }

  private generateContractName(request: AIContractRequest): string {
    const baseName = request.userPrompt.split(' ').slice(0, 3).join('');
    return `${baseName}SecurityTrap`;
  }

  private extractSecurityFeatures(code: string): string[] {
    const features: string[] = [];
    if (code.includes('onlyOwner')) features.push('Owner access control');
    if (code.includes('require(')) features.push('Input validation');
    if (code.includes('event ')) features.push('Event logging');
    if (code.includes('modifier')) features.push('Custom modifiers');
    if (code.includes('SafeMath')) features.push('Safe math operations');
    return features.length > 0 ? features : ['Basic security'];
  }

  private estimateGas(complexity: string): number {
    switch (complexity) {
      case 'simple': return 80000;
      case 'medium': return 150000;
      case 'complex': return 250000;
      default: return 150000;
    }
  }

  private assessRisk(securityLevel: string, complexity: string): AIContractResponse['riskAssessment'] {
    let riskScore = 50;
    
    if (securityLevel === 'enterprise') riskScore -= 20;
    if (securityLevel === 'basic') riskScore += 20;
    if (complexity === 'simple') riskScore -= 15;
    if (complexity === 'complex') riskScore += 15;
    
    riskScore = Math.max(10, Math.min(90, riskScore));
    
    return {
      overallRisk: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high',
      riskScore,
      details: [
        `Security level: ${securityLevel}`,
        `Complexity: ${complexity}`,
        `Estimated risk score: ${riskScore}/100`
      ]
    };
  }

  private generateCompilationInstructions(): string {
    return 'Compile using Solidity 0.8.19+ with optimization enabled. Ensure all dependencies are available.';
  }

  private generateDeploymentNotes(request: AIContractRequest): string {
    return `Deploy to Hoodi testnet (Chain ID: ${request.targetNetwork}). Estimated gas: ${this.estimateGas(request.complexity)}. Ensure sufficient testnet ETH for deployment.`;
  }

  private generateBasicContractTemplate(request: AIContractRequest): string {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ${this.generateContractName(request)} is Ownable, ReentrancyGuard, Pausable {
    // Events for Drosera trap monitoring
    event TrapTriggered(address indexed attacker, uint256 amount, uint256 timestamp, string attackType);
    event SuspiciousAddressFlagged(address indexed wallet, string reason, uint256 timestamp);
    event FundsCaptured(address indexed attacker, uint256 amount, uint256 timestamp);
    event AnalysisReport(address indexed target, string findings, uint256 timestamp);
    
    // State variables for Drosera trap functionality
    uint256 public totalTraps;
    uint256 public totalFundsCaptured;
    mapping(address => bool) public hasTriggered;
    mapping(address => bool) public flaggedAddresses;
    mapping(address => uint256) public attackCount;
    mapping(address => string) public attackTypes;
    
    // Drosera trap configuration
    uint256 public minTrapAmount = 0.001 ether;
    uint256 public maxTrapAmount = 10 ether;
    bool public trapActive = true;
    
    constructor() {
        totalTraps = 0;
        totalFundsCaptured = 0;
    }
    
    // Main Drosera trap function - attracts and captures malicious actors
    function triggerTrap() external payable nonReentrant whenNotPaused {
        require(trapActive, "Drosera trap is currently inactive");
        require(msg.value >= minTrapAmount, "Amount too small to trigger trap");
        require(msg.value <= maxTrapAmount, "Amount exceeds trap limit");
        require(!hasTriggered[msg.sender], "Address already triggered trap");
        
        // Capture the malicious actor
        hasTriggered[msg.sender] = true;
        attackCount[msg.sender]++;
        totalTraps++;
        totalFundsCaptured += msg.value;
        
        // Analyze the attack pattern
        string memory attackType = _analyzeAttackPattern(msg.sender, msg.value);
        attackTypes[msg.sender] = attackType;
        
        // Flag suspicious address
        if (msg.value > 1 ether) {
            flaggedAddresses[msg.sender] = true;
            emit SuspiciousAddressFlagged(msg.sender, "High value attack", block.timestamp);
        }
        
        emit TrapTriggered(msg.sender, msg.value, block.timestamp, attackType);
        emit FundsCaptured(msg.sender, msg.value, block.timestamp);
        emit AnalysisReport(msg.sender, attackType, block.timestamp);
    }
    
    // Analyze attack patterns (Drosera trap intelligence)
    function _analyzeAttackPattern(address attacker, uint256 amount) internal view returns (string memory) {
        if (amount > 5 ether) {
            return "High-Value Attack";
        } else if (amount > 1 ether) {
            return "Medium-Value Attack";
        } else if (attackCount[attacker] > 1) {
            return "Repeat Attacker";
        } else {
            return "Standard Attack";
        }
    }
    
    // Get comprehensive trap statistics
    function getTrapStats() external view returns (
        uint256 _totalTraps,
        uint256 _totalFundsCaptured,
        uint256 _contractBalance,
        uint256 _flaggedAddresses
    ) {
        uint256 flaggedCount = 0;
        // Count flagged addresses (simplified for gas efficiency)
        return (totalTraps, totalFundsCaptured, address(this).balance, flaggedCount);
    }
    
    // Check if address is flagged
    function isAddressFlagged(address wallet) external view returns (bool) {
        return flaggedAddresses[wallet];
    }
    
    // Get attack history for an address
    function getAttackHistory(address wallet) external view returns (
        bool triggered,
        uint256 count,
        string memory lastAttackType
    ) {
        return (hasTriggered[wallet], attackCount[wallet], attackTypes[wallet]);
    }
    
    // Owner functions for Drosera trap management
    function withdrawCapturedFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    function setTrapConfiguration(
        uint256 _minAmount,
        uint256 _maxAmount,
        bool _active
    ) external onlyOwner {
        minTrapAmount = _minAmount;
        maxTrapAmount = _maxAmount;
        trapActive = _active;
    }
    
    function pauseTrap() external onlyOwner {
        _pause();
    }
    
    function unpauseTrap() external onlyOwner {
        _unpause();
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Emergency withdrawal failed");
        }
    }
    
    // Receive function to capture additional funds
    receive() external payable {
        if (msg.value > 0) {
            totalFundsCaptured += msg.value;
            emit FundsCaptured(msg.sender, msg.value, block.timestamp);
        }
    }
}`;
  }
}

export default AIIntegrationService;
