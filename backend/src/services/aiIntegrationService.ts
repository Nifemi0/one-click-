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
  private isAvailable: boolean;

  constructor() {
    try {
      this.openaiApiKey = process.env.OPENAI_API_KEY || '';
      this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
      this.geminiApiKey = process.env.GEMINI_API_KEY || '';
      
      // Check if any AI provider is available
      this.isAvailable = !!(this.openaiApiKey || this.anthropicApiKey || this.geminiApiKey);
      
      if (!this.isAvailable) {
        console.log('⚠️ No AI API keys configured, using fallback mode');
      }
    } catch (error) {
      console.error('❌ Error initializing AI service:', error);
      this.openaiApiKey = '';
      this.anthropicApiKey = '';
      this.geminiApiKey = '';
      this.isAvailable = false;
    }
  }

  /**
   * Check if AI service is available
   */
  public getAvailability(): boolean {
    return this.isAvailable;
  }

  /**
   * Generate smart contract using multiple AI providers
   */
  async generateContract(request: AIContractRequest): Promise<AIContractResponse> {
    try {
      console.log('🤖 Starting AI contract generation...');
      console.log('🔍 AI Service Status:', {
        isAvailable: this.isAvailable,
        openaiKey: !!this.openaiApiKey,
        anthropicKey: !!this.anthropicApiKey,
        geminiKey: !!this.geminiApiKey,
        openaiKeyLength: this.openaiApiKey ? this.openaiApiKey.length : 0,
        geminiKeyLength: this.geminiApiKey ? this.geminiApiKey.length : 0
      });
      
      // If no AI providers are available, use fallback immediately
      if (!this.isAvailable) {
        console.log('🔄 No AI providers available, using fallback contract');
        return this.generateFallbackContract(request);
      }
      
      console.log('✅ AI providers are available, proceeding with generation...');
      
      // Try multiple AI providers in order of preference
      const providers = [
        { name: 'OpenAI', method: this.generateWithOpenAI.bind(this), available: !!this.openaiApiKey },
        { name: 'Anthropic', method: this.generateWithAnthropic.bind(this), available: !!this.anthropicApiKey },
        { name: 'Gemini', method: this.generateWithGemini.bind(this), available: !!this.geminiApiKey },
        { name: 'Fallback', method: this.generateFallbackContract.bind(this), available: true }
      ];

      console.log('🔍 Provider availability:', providers.map(p => ({ name: p.name, available: p.available })));

      for (const provider of providers) {
        if (!provider.available) {
          console.log(`⏭️ Skipping ${provider.name} - not configured`);
          continue;
        }
        
        try {
          console.log(`🔄 Trying ${provider.name}...`);
          const result = await provider.method(request);
          if (result.success) {
            console.log(`✅ Successfully generated contract using ${provider.name}`);
            return result;
          } else {
            console.warn(`⚠️ ${provider.name} returned unsuccessful result:`, result);
          }
        } catch (error: any) {
          console.error(`❌ ${provider.name} failed with error:`, error);
          console.error(`❌ Error details:`, {
            message: error.message,
            stack: error.stack,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText
          });
          continue;
        }
      }

      console.log('❌ All AI providers failed, falling back to fallback method');
      throw new Error('All AI providers failed');
    } catch (error) {
      console.error('❌ AI contract generation failed:', error);
      console.log('🔄 Falling back to fallback contract generation...');
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

    try {
      console.log('🔄 OpenAI: Building prompt...');
      const prompt = this.buildOpenAIPrompt(request);
      console.log('🔄 OpenAI: Prompt built, length:', prompt.length);
      
      console.log('🔄 OpenAI: Making API call to OpenAI...');
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
          },
          timeout: 30000
        }
      );

      console.log('🔄 OpenAI: API call successful, processing response...');
      if (response.data.choices && response.data.choices[0]) {
        const contractCode = response.data.choices[0].message.content;
        console.log('🔄 OpenAI: Contract code received, length:', contractCode.length);
        return this.parseAIResponse(contractCode, 'OpenAI', request);
      }

      throw new Error('Invalid OpenAI response');
    } catch (error: any) {
      console.error('❌ OpenAI API error:', error);
      
      // Provide more specific error information
      if (error.response) {
        console.error('❌ OpenAI API response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        if (error.response.status === 401) {
          throw new Error('OpenAI API key invalid or expired');
        } else if (error.response.status === 400) {
          throw new Error(`OpenAI API request error: ${error.response.data?.error?.message || 'Bad request'}`);
        } else if (error.response.status === 429) {
          throw new Error('OpenAI API rate limit exceeded');
        } else if (error.response.status >= 500) {
          throw new Error('OpenAI API server error');
        }
      }
      
      throw error;
    }
  }

  /**
   * Generate contract using Anthropic Claude
   */
  private async generateWithAnthropic(request: AIContractRequest): Promise<AIContractResponse> {
    if (!this.anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
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
          },
          timeout: 30000
        }
      );

      if (response.data.content && response.data.content[0]) {
        const contractCode = response.data.content[0].text;
        return this.parseAIResponse(contractCode, 'Anthropic', request);
      }

      throw new Error('Invalid Anthropic response');
    } catch (error) {
      console.error('❌ Anthropic API error:', error);
      throw error;
    }
  }

  /**
   * Generate contract using Google Gemini
   */
  private async generateWithGemini(request: AIContractRequest): Promise<AIContractResponse> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Try multiple Gemini API endpoints in case one is deprecated
    const geminiEndpoints = [
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
    ];

    for (const endpoint of geminiEndpoints) {
      try {
        console.log(`🔄 Gemini: Trying endpoint: ${endpoint}`);
        const prompt = this.buildGeminiPrompt(request);
        console.log('🔄 Gemini: Prompt built, length:', prompt.length);
        
        console.log('🔄 Gemini: Making API call to Gemini...');
        
        const response = await axios.post(
          `${endpoint}?key=${this.geminiApiKey}`,
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
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );

        console.log('🔄 Gemini: API call successful, processing response...');
        if (response.data.candidates && response.data.candidates[0]) {
          const contractCode = response.data.candidates[0].content.parts[0].text;
          console.log('🔄 Gemini: Contract code received, length:', contractCode.length);
          return this.parseAIResponse(contractCode, 'Gemini', request);
        }

        throw new Error('Invalid Gemini response');
      } catch (error: any) {
        console.error(`❌ Gemini API error with endpoint ${endpoint}:`, error);
        
        // If this is the last endpoint, throw the error
        if (endpoint === geminiEndpoints[geminiEndpoints.length - 1]) {
          // Provide more specific error information
          if (error.response) {
            console.error('❌ Gemini API response error:', {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data
            });
            
            if (error.response.status === 404) {
              throw new Error('All Gemini API endpoints failed - API may have changed');
            } else if (error.response.status === 400) {
              throw new Error(`Gemini API request error: ${error.response.data?.error?.message || 'Bad request'}`);
            } else if (error.response.status === 429) {
              throw new Error('Gemini API rate limit exceeded');
            } else if (error.response.status >= 500) {
              throw new Error('Gemini API server error');
            }
          }
          
          throw error;
        }
        
        // Continue to next endpoint
        console.log(`🔄 Gemini: Endpoint ${endpoint} failed, trying next...`);
        continue;
      }
    }

    throw new Error('All Gemini API endpoints failed');
  }

  /**
   * Generate fallback contract when AI providers are unavailable
   */
  private generateFallbackContract(request: AIContractRequest): AIContractResponse {
    console.log('🔄 Generating fallback contract...');
    
    const contractName = this.generateContractName(request.userPrompt);
    
    // Generate different contract types based on user prompt
    let contractCode: string;
    let description: string;
    
    if (request.userPrompt.toLowerCase().includes('dex') || request.userPrompt.toLowerCase().includes('watcher')) {
      // Generate a DEX monitoring contract
      contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title DEXWatcherTrap
 * @dev Advanced DEX monitoring and attack detection trap
 * @custom:security-contact security@drosera.com
 */
contract DEXWatcherTrap is ReentrancyGuard, Pausable, Ownable {
    using Address for address payable;
    
    // DEX monitoring state
    mapping(address => bool) public monitoredTokens;
    mapping(address => uint256) public lastPriceCheck;
    mapping(address => uint256) public priceThresholds;
    
    uint256 public constant MINIMUM_MONITORING_AMOUNT = 0.001 ether;
    uint256 public constant MAXIMUM_MONITORING_AMOUNT = 5 ether;
    uint256 public constant MONITORING_INTERVAL = 5 minutes;
    
    uint256 public totalMonitoredValue;
    uint256 public attackDetectionCount;
    
    // Events
    event TokenAdded(address indexed token, uint256 threshold, uint256 timestamp);
    event AttackDetected(address indexed token, uint256 price, string reason, uint256 timestamp);
    event MonitoringUpdated(address indexed token, uint256 newThreshold);
    
    constructor() {
        // Initialize with some default monitored tokens
        monitoredTokens[address(0)] = true; // ETH
        priceThresholds[address(0)] = 1000; // $1000 threshold
    }
    
    /**
     * @dev Add a token to monitoring
     */
    function addTokenToMonitoring(address token, uint256 threshold) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(threshold > 0, "Threshold must be greater than 0");
        
        monitoredTokens[token] = true;
        priceThresholds[token] = threshold;
        lastPriceCheck[token] = block.timestamp;
        
        emit TokenAdded(token, threshold, block.timestamp);
    }
    
    /**
     * @dev Check if a token price has crossed threshold (simulated)
     */
    function checkPriceThreshold(address token) external view returns (bool) {
        require(monitoredTokens[token], "Token not monitored");
        require(block.timestamp >= lastPriceCheck[token] + MONITORING_INTERVAL, "Too soon to check");
        
        // Simulate price check - in real implementation, this would call price oracle
        return true; // Simulated threshold breach
    }
    
    /**
     * @dev Report suspicious activity
     */
    function reportSuspiciousActivity(address token, string memory reason) external onlyOwner {
        require(monitoredTokens[token], "Token not monitored");
        
        attackDetectionCount++;
        emit AttackDetected(token, 0, reason, block.timestamp);
    }
    
    /**
     * @dev Update monitoring threshold
     */
    function updateThreshold(address token, uint256 newThreshold) external onlyOwner {
        require(monitoredTokens[token], "Token not monitored");
        require(newThreshold > 0, "Threshold must be greater than 0");
        
        priceThresholds[token] = newThreshold;
        emit MonitoringUpdated(token, newThreshold);
    }
    
    /**
     * @dev Pause monitoring
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Resume monitoring
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}`;
      
      description = `Advanced DEX monitoring trap with price threshold detection and attack reporting. Generated based on: ${request.userPrompt}`;
    } else if (request.userPrompt.toLowerCase().includes('honeypot')) {
      // Generate a honeypot contract
      contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HoneypotTrap
 * @dev Advanced honeypot security trap with fund capture
 * @custom:security-contact security@drosera.com
 */
contract HoneypotTrap is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;
    mapping(address => bool) public whitelisted;
    
    uint256 public totalDeposits;
    uint256 public totalCaptured;
    
    event Deposit(address indexed user, uint256 amount);
    event FundsCaptured(address indexed attacker, uint256 amount);
    
    constructor() {
        whitelisted[msg.sender] = true;
    }
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw() external {
        require(whitelisted[msg.sender], "Not whitelisted");
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
    
    function captureFunds(address attacker) external onlyOwner {
        uint256 amount = balances[attacker];
        balances[attacker] = 0;
        totalCaptured += amount;
        emit FundsCaptured(attacker, amount);
    }
}`;
      
      description = `Advanced honeypot security trap with fund capture and attack detection. Generated based on: ${request.userPrompt}`;
    } else {
      // Default advanced security trap
      contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title DroseraSecurityTrap
 * @dev Advanced security trap with fund capture and attack detection
 * @custom:security-contact security@drosera.com
 */
contract DroseraSecurityTrap is ReentrancyGuard, Pausable, Ownable {
    using Address for address payable;
    
    // State variables
    mapping(address => uint256) public userBalances;
    mapping(address => bool) public isWhitelisted;
    mapping(address => uint256) public lastInteraction;
    
    uint256 public constant MINIMUM_DEPOSIT = 0.01 ether;
    uint256 public constant MAXIMUM_DEPOSIT = 10 ether;
    uint256 public constant WITHDRAWAL_DELAY = 24 hours;
    uint256 public constant INTERACTION_COOLDOWN = 1 hours;
    
    uint256 public totalDeposits;
    uint256 public totalCaptured;
    uint256 public attackCount;
    
    // Events
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
    event AttackDetected(address indexed attacker, uint256 amount, string reason);
    event FundsCaptured(address indexed attacker, uint256 amount, uint256 timestamp);
    event WhitelistUpdated(address indexed user, bool status);
    
    // Modifiers
    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "DroseraSecurityTrap: User not whitelisted");
        _;
    }
    
    modifier notInCooldown() {
        require(block.timestamp >= lastInteraction[msg.sender] + INTERACTION_COOLDOWN, "DroseraSecurityTrap: Cooldown active");
        _;
    }
    
    modifier validDeposit() {
        require(msg.value >= MINIMUM_DEPOSIT, "DroseraSecurityTrap: Deposit too small");
        require(msg.value <= MAXIMUM_DEPOSIT, "DroseraSecurityTrap: Deposit too large");
        require(userBalances[msg.sender] + msg.value <= MAXIMUM_DEPOSIT, "DroseraSecurityTrap: Exceeds maximum balance");
        _;
    }
    
    constructor() {
        isWhitelisted[msg.sender] = true;
        emit WhitelistUpdated(msg.sender, true);
    }
    
    /**
     * @dev Deposit funds into the security trap
     */
    function deposit() external payable nonReentrant validDeposit notInCooldown {
        userBalances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        lastInteraction[msg.sender] = block.timestamp;
        
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Withdraw funds from the security trap
     */
    function withdraw(uint256 amount) external nonReentrant onlyWhitelisted notInCooldown {
        require(amount > 0, "DroseraSecurityTrap: Amount must be greater than 0");
        require(userBalances[msg.sender] >= amount, "DroseraSecurityTrap: Insufficient balance");
        require(block.timestamp >= lastInteraction[msg.sender] + WITHDRAWAL_DELAY, "DroseraSecurityTrap: Withdrawal delay not met");
        
        userBalances[msg.sender] -= amount;
        totalDeposits -= amount;
        lastInteraction[msg.sender] = block.timestamp;
        
        payable(msg.sender).sendValue(amount);
        emit Withdrawal(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Emergency withdrawal for whitelisted users
     */
    function emergencyWithdraw() external nonReentrant onlyWhitelisted {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "DroseraSecurityTrap: No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        totalDeposits -= balance;
        lastInteraction[msg.sender] = block.timestamp;
        
        payable(msg.sender).sendValue(balance);
        emit Withdrawal(msg.sender, balance, block.timestamp);
    }
    
    /**
     * @dev Capture funds from detected attacks
     */
    function captureFunds(address attacker, string memory reason) external onlyOwner {
        uint256 balance = userBalances[attacker];
        require(balance > 0, "DroseraSecurityTrap: No funds to capture");
        
        userBalances[attacker] = 0;
        totalDeposits -= balance;
        totalCaptured += balance;
        attackCount++;
        
        emit AttackDetected(attacker, balance, reason);
        emit FundsCaptured(attacker, balance, block.timestamp);
    }
    
    /**
     * @dev Update whitelist status
     */
    function updateWhitelist(address user, bool status) external onlyOwner {
        isWhitelisted[user] = status;
        emit WhitelistUpdated(user, status);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get user information
     */
    function getUserInfo(address user) external view returns (
        uint256 balance,
        bool whitelisted,
        uint256 lastInteractionTime,
        bool canWithdraw
    ) {
        balance = userBalances[user];
        whitelisted = isWhitelisted[user];
        lastInteractionTime = lastInteraction[user];
        canWithdraw = block.timestamp >= lastInteraction[user] + WITHDRAWAL_DELAY;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalDepositsAmount,
        uint256 totalCapturedAmount,
        uint256 attackCountValue,
        uint256 contractBalance
    ) {
        totalDepositsAmount = totalDeposits;
        totalCapturedAmount = totalCaptured;
        attackCountValue = attackCount;
        contractBalance = address(this).balance;
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Only accept deposits through the deposit function
        revert("DroseraSecurityTrap: Use deposit() function");
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("DroseraSecurityTrap: Function not found");
    }
}`;
      
      description = `Advanced Drosera security trap with fund capture and attack detection. Generated based on: ${request.userPrompt}`;
    }

    // Now extract security features from the actual contract code
    const securityFeatures = this.extractSecurityFeatures(contractCode);

    return {
      success: true,
      contractCode,
      contractName,
      description,
      securityFeatures,
      estimatedGas: 250000,
      riskAssessment: {
        overallRisk: 'low',
        riskScore: 0.1,
        details: ['Uses OpenZeppelin security patterns', 'Implements reentrancy protection', 'Includes access controls', 'Has withdrawal delays and cooldowns']
      },
      compilationInstructions: 'Contract uses OpenZeppelin contracts. Ensure @openzeppelin/contracts is installed.',
      deploymentNotes: 'Deploy with appropriate constructor parameters. Test thoroughly on testnet first.',
      aiProvider: 'Fallback',
      confidence: 0.95
    };
  }

  /**
   * Build OpenAI prompt
   */
  private buildOpenAIPrompt(request: AIContractRequest): string {
    return `Generate a Solidity smart contract for a DROSERA SECURITY TRAP based on the following requirements:

User Prompt: ${request.userPrompt}
Security Level: ${request.securityLevel}
Complexity: ${request.complexity}
Target Network: ${request.targetNetwork}
Custom Requirements: ${request.customRequirements.join(', ')}

Requirements:
1. Create a production-ready Solidity smart contract
2. Implement security best practices (OpenZeppelin patterns, reentrancy protection, etc.)
3. Include comprehensive error handling and events
4. Add detailed NatSpec documentation
5. Ensure gas optimization
6. Make it a sophisticated security trap/honeypot that can detect and capture malicious actors
7. Include fund capture mechanisms and attack detection
8. Use proper access controls and timelocks where appropriate

Return only the Solidity contract code with no additional text or explanations.`;
  }

  /**
   * Build Anthropic prompt
   */
  private buildAnthropicPrompt(request: AIContractRequest): string {
    return `You are an expert Solidity developer. Create a DROSERA SECURITY TRAP smart contract based on:

Prompt: ${request.userPrompt}
Security: ${request.securityLevel}
Complexity: ${request.complexity}
Network: ${request.targetNetwork}
Requirements: ${request.customRequirements.join(', ')}

Generate a production-ready contract with:
- OpenZeppelin security patterns
- Reentrancy protection
- Attack detection and fund capture
- Comprehensive documentation
- Gas optimization
- Proper access controls

Return only the Solidity code.`;
  }

  /**
   * Build Gemini prompt
   */
  private buildGeminiPrompt(request: AIContractRequest): string {
    return `Create a Solidity smart contract for a DROSERA SECURITY TRAP:

Requirements: ${request.userPrompt}
Security Level: ${request.securityLevel}
Complexity: ${request.complexity}
Network: ${request.targetNetwork}
Custom: ${request.customRequirements.join(', ')}

Features needed:
- Security best practices
- OpenZeppelin patterns
- Reentrancy protection
- Attack detection
- Fund capture mechanisms
- Access controls
- Gas optimization

Return only the Solidity contract code.`;
  }

  /**
   * Parse AI response and extract contract information
   */
  private parseAIResponse(aiResponse: string, provider: string, request: AIContractRequest): AIContractResponse {
    try {
      console.log(`🔄 ${provider}: Starting to parse AI response...`);
      console.log(`🔄 ${provider}: Raw response length:`, aiResponse.length);
      console.log(`🔄 ${provider}: Raw response preview:`, aiResponse.substring(0, 200));
      
      // Extract contract code (remove markdown if present)
      let contractCode = aiResponse;
      if (aiResponse.includes('```solidity')) {
        console.log(`🔄 ${provider}: Found Solidity code block, extracting...`);
        const start = aiResponse.indexOf('```solidity') + 11;
        const end = aiResponse.lastIndexOf('```');
        if (start > 10 && end > start) {
          contractCode = aiResponse.substring(start, end).trim();
          console.log(`🔄 ${provider}: Extracted Solidity code, length:`, contractCode.length);
        } else {
          console.log(`🔄 ${provider}: Code block extraction failed, using full response`);
        }
      } else if (aiResponse.includes('```')) {
        console.log(`🔄 ${provider}: Found generic code block, extracting...`);
        const start = aiResponse.indexOf('```') + 3;
        const end = aiResponse.lastIndexOf('```');
        if (start > 2 && end > start) {
          contractCode = aiResponse.substring(start, end).trim();
          console.log(`🔄 ${provider}: Extracted generic code, length:`, contractCode.length);
        } else {
          console.log(`🔄 ${provider}: Code block extraction failed, using full response`);
        }
      } else {
        console.log(`🔄 ${provider}: No code blocks found, using full response`);
      }

      console.log(`🔄 ${provider}: Final contract code length:`, contractCode.length);
      console.log(`🔄 ${provider}: Contract code preview:`, contractCode.substring(0, 200));

      // Generate contract name
      const contractName = this.generateContractName(request.userPrompt);
      console.log(`🔄 ${provider}: Generated contract name:`, contractName);
      
      // Extract security features
      const securityFeatures = this.extractSecurityFeatures(contractCode);
      console.log(`🔄 ${provider}: Extracted security features:`, securityFeatures);
      
      // Estimate gas (rough calculation)
      const estimatedGas = this.estimateGas(contractCode, request.complexity);
      console.log(`🔄 ${provider}: Estimated gas:`, estimatedGas);
      
      // Assess risk
      const riskAssessment = this.assessRisk(contractCode, request.securityLevel);
      console.log(`🔄 ${provider}: Risk assessment:`, riskAssessment);
      
      console.log(`🔄 ${provider}: Successfully parsed AI response, returning result`);
      
      return {
        success: true,
        contractCode,
        contractName,
        description: `AI-generated Drosera security trap based on: ${request.userPrompt}`,
        securityFeatures,
        estimatedGas,
        riskAssessment,
        compilationInstructions: 'Review and test the generated code thoroughly before deployment',
        deploymentNotes: 'Ensure all dependencies are installed and test on testnet first',
        aiProvider: provider,
        confidence: 0.85
      };
    } catch (error: unknown) {
      console.error(`❌ ${provider}: Failed to parse AI response:`, error);
      console.error(`❌ ${provider}: Error details:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse ${provider} response: ${errorMessage}`);
    }
  }

  /**
   * Generate contract name from user prompt
   */
  private generateContractName(userPrompt: string): string {
    // Extract key words and create a meaningful name
    const words = userPrompt.toLowerCase().split(' ');
    const keyWords = words.filter(word => 
      ['security', 'trap', 'honeypot', 'defi', 'drosera', 'protection', 'monitoring'].includes(word)
    );
    
    if (keyWords.length > 0) {
      const baseName = keyWords[0].charAt(0).toUpperCase() + keyWords[0].slice(1);
      return `${baseName}SecurityTrap`;
    }
    
    return 'DroseraSecurityTrap';
  }

  /**
   * Extract security features from contract code
   */
  private extractSecurityFeatures(contractCode: string): string[] {
    const features: string[] = [];
    
    if (contractCode.includes('ReentrancyGuard')) features.push('Reentrancy Protection');
    if (contractCode.includes('Ownable')) features.push('Access Control');
    if (contractCode.includes('Pausable')) features.push('Emergency Pause');
    if (contractCode.includes('SafeMath') || contractCode.includes('unchecked')) features.push('Safe Math Operations');
    if (contractCode.includes('require(')) features.push('Input Validation');
    if (contractCode.includes('event ')) features.push('Event Logging');
    if (contractCode.includes('modifier ')) features.push('Custom Modifiers');
    if (contractCode.includes('mapping(')) features.push('Secure Storage');
    if (contractCode.includes('external') || contractCode.includes('public')) features.push('Function Visibility');
    
    // Add default features if none detected
    if (features.length === 0) {
      features.push('Basic Security', 'Input Validation', 'Event Logging');
    }
    
    return features;
  }

  /**
   * Estimate gas usage
   */
  private estimateGas(contractCode: string, complexity: string): number {
    let baseGas = 150000;
    
    // Adjust based on complexity
    switch (complexity) {
      case 'simple':
        baseGas = 100000;
        break;
      case 'medium':
        baseGas = 200000;
        break;
      case 'complex':
        baseGas = 300000;
        break;
    }
    
    // Adjust based on contract features
    if (contractCode.includes('mapping(')) baseGas += 50000;
    if (contractCode.includes('event ')) baseGas += 10000;
    if (contractCode.includes('modifier ')) baseGas += 20000;
    if (contractCode.includes('external')) baseGas += 15000;
    
    return baseGas;
  }

  /**
   * Assess contract risk
   */
  private assessRisk(contractCode: string, securityLevel: string): {
    overallRisk: 'low' | 'medium' | 'high';
    riskScore: number;
    details: string[];
  } {
    const details: string[] = [];
    let riskScore = 0.3; // Base risk
    
    // Check for security features
    if (contractCode.includes('ReentrancyGuard')) {
      details.push('✅ Reentrancy protection implemented');
      riskScore -= 0.1;
    } else {
      details.push('⚠️ No reentrancy protection detected');
      riskScore += 0.2;
    }
    
    if (contractCode.includes('Ownable')) {
      details.push('✅ Access control implemented');
      riskScore -= 0.1;
    } else {
      details.push('⚠️ No access control detected');
      riskScore += 0.2;
    }
    
    if (contractCode.includes('require(')) {
      details.push('✅ Input validation present');
      riskScore -= 0.05;
    } else {
      details.push('⚠️ Limited input validation');
      riskScore += 0.1;
    }
    
    // Adjust based on security level
    switch (securityLevel) {
      case 'basic':
        riskScore += 0.1;
        details.push('📊 Basic security level - moderate risk');
        break;
      case 'premium':
        riskScore -= 0.05;
        details.push('📊 Premium security level - lower risk');
        break;
      case 'enterprise':
        riskScore -= 0.1;
        details.push('📊 Enterprise security level - minimal risk');
        break;
    }
    
    // Clamp risk score
    riskScore = Math.max(0, Math.min(1, riskScore));
    
    let overallRisk: 'low' | 'medium' | 'high';
    if (riskScore <= 0.3) overallRisk = 'low';
    else if (riskScore <= 0.6) overallRisk = 'medium';
    else overallRisk = 'high';
    
    return {
      overallRisk,
      riskScore,
      details
    };
  }
}

export default AIIntegrationService;
