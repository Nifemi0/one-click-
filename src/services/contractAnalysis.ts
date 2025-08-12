import axios from 'axios';
import { DatabaseService } from './database';
import { BlockchainService, ContractAnalysis as BlockchainContractAnalysis } from './blockchain';

export interface AIAnalysisResult {
  riskScore: number;
  vulnerabilities: string[];
  recommendations: string[];
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  auditRecommendation: boolean;
  estimatedAuditCost: string;
  complexityScore: number;
  gasOptimization: string[];
  bestPractices: string[];
  aiProvider: string; // Track which AI provider was used
}

export interface ContractSourceCode {
  address: string;
  chainId: number;
  sourceCode: string;
  contractName: string;
  compilerVersion: string;
  optimization: boolean;
  runs: number;
  constructorArguments: string;
  libraries: Record<string, string>;
  abi: any[];
}

export interface EnhancedContractAnalysis extends BlockchainContractAnalysis {
  aiAnalysis?: AIAnalysisResult;
  sourceCode?: ContractSourceCode;
  blockExplorerData?: any;
  socialSentiment?: {
    score: number;
    mentions: number;
    lastUpdated: Date;
  };
}

// AI Provider Configuration
interface AIProvider {
  name: string;
  apiKey: string;
  endpoint: string;
  headers: Record<string, string>;
  model: string;
  maxTokens: number;
  temperature: number;
}

export class ContractAnalysisService {
  private aiProviders: AIProvider[] = [];
  private db: DatabaseService;
  private blockchain: BlockchainService;
  private blockExplorerApis: Map<number, string> = new Map();

  constructor(db: DatabaseService, blockchain: BlockchainService) {
    this.db = db;
    this.blockchain = blockchain;
    
    // Initialize AI Providers with fallback priority
    this.initializeAIProviders();

    // Initialize block explorer APIs for Hoodie testnet
    this.initializeBlockExplorers();
  }

  private initializeAIProviders() {
    // Priority 1: Cursor API
    if (process.env.CURSOR_API_KEY) {
      this.aiProviders.push({
        name: 'Cursor',
        apiKey: process.env.CURSOR_API_KEY,
        endpoint: 'https://api.cursor.sh/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${process.env.CURSOR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        model: 'gpt-4',
        maxTokens: 2000,
        temperature: 0.1,
      });
    }

    // Priority 2: Gemini API
    if (process.env.GEMINI_API_KEY) {
      this.aiProviders.push({
        name: 'Gemini',
        apiKey: process.env.GEMINI_API_KEY,
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        headers: {
          'Content-Type': 'application/json',
        },
        model: 'gemini-pro',
        maxTokens: 2000,
        temperature: 0.1,
      });
    }

    // Priority 3: Claude API
    if (process.env.CLAUDE_API_KEY) {
      this.aiProviders.push({
        name: 'Claude',
        apiKey: process.env.CLAUDE_API_KEY,
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
          'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        model: 'claude-3-sonnet-20240229',
        maxTokens: 2000,
        temperature: 0.1,
      });
    }

    // Priority 4: OpenAI API (as last resort)
    if (process.env.OPENAI_API_KEY) {
      this.aiProviders.push({
        name: 'OpenAI',
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        model: 'gpt-4',
        maxTokens: 2000,
        temperature: 0.1,
      });
    }

    if (this.aiProviders.length === 0) {
      console.warn('No AI providers configured. AI analysis will be disabled.');
    } else {
      console.log(`Initialized ${this.aiProviders.length} AI providers: ${this.aiProviders.map(p => p.name).join(', ')}`);
    }
  }

  private initializeBlockExplorers() {
    // Hoodie testnet configuration
    this.blockExplorerApis.set(1337, process.env.HOODIE_BLOCK_EXPLORER_API_KEY || ''); // Hoodie testnet
    this.blockExplorerApis.set(31337, process.env.HOODIE_BLOCK_EXPLORER_API_KEY || ''); // Alternative Hoodie testnet port
  }

  async analyzeContract(address: string, chainId: number): Promise<EnhancedContractAnalysis> {
    try {
      // Start with blockchain analysis
      const blockchainAnalysis = await this.blockchain.analyzeContract(address, chainId);
      
      // Get source code if available
      const sourceCode = await this.getContractSourceCode(address, chainId);
      
      // Get block explorer data
      const blockExplorerData = await this.getBlockExplorerData(address, chainId);
      
      // Perform AI analysis if source code is available and AI providers are configured
      let aiAnalysis: AIAnalysisResult | undefined;
      if (sourceCode?.sourceCode && this.aiProviders.length > 0) {
        aiAnalysis = await this.performAIAnalysisWithFallback(sourceCode, blockchainAnalysis);
      }
      
      // Get social sentiment data
      const socialSentiment = await this.getSocialSentiment(address, chainId);
      
      // Combine all analysis results
      const enhancedAnalysis: EnhancedContractAnalysis = {
        ...blockchainAnalysis,
        sourceCode,
        blockExplorerData,
        socialSentiment,
        aiAnalysis,
      };

      // Cache the analysis result
      await this.cacheAnalysisResult(address, chainId, enhancedAnalysis);
      
      return enhancedAnalysis;
    } catch (error) {
      console.error('Contract analysis failed:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  private async getContractSourceCode(address: string, chainId: number): Promise<ContractSourceCode | undefined> {
    try {
      const apiKey = this.blockExplorerApis.get(chainId);
      if (!apiKey) {
        console.log(`No API key for chain ${chainId}`);
        return undefined;
      }

      const baseUrl = this.getBlockExplorerBaseUrl(chainId);
      const response = await axios.get(`${baseUrl}/api`, {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address,
          apikey: apiKey,
        },
        timeout: 10000,
      });

      if (response.data.status === '1' && response.data.result[0]) {
        const result = response.data.result[0];
        
        if (result.SourceCode && result.SourceCode !== '') {
          return {
            address,
            chainId,
            sourceCode: result.SourceCode,
            contractName: result.ContractName || 'Unknown',
            compilerVersion: result.CompilerVersion || 'Unknown',
            optimization: result.OptimizationUsed === '1',
            runs: parseInt(result.Runs) || 200,
            constructorArguments: result.ConstructorArguments || '',
            libraries: this.parseLibraries(result.Library || ''),
            abi: result.ABI ? JSON.parse(result.ABI) : [],
          };
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Failed to get source code:', error);
      return undefined;
    }
  }

  private getBlockExplorerBaseUrl(chainId: number): string {
    switch (chainId) {
      case 1: return 'https://api.etherscan.io';
      case 137: return 'https://api.polygonscan.com';
      case 42161: return 'https://api.arbiscan.io';
      case 8453: return 'https://api.basescan.org';
      default: return 'https://api.etherscan.io';
    }
  }

  private parseLibraries(libraryString: string): Record<string, string> {
    const libraries: Record<string, string> = {};
    
    if (!libraryString) return libraries;
    
    try {
      // Parse library string format: "Library1:Address1,Library2:Address2"
      const pairs = libraryString.split(',');
      pairs.forEach(pair => {
        const [name, address] = pair.split(':');
        if (name && address) {
          libraries[name.trim()] = address.trim();
        }
      });
    } catch (error) {
      console.error('Failed to parse libraries:', error);
    }
    
    return libraries;
  }

  private async getBlockExplorerData(address: string, chainId: number): Promise<any> {
    try {
      const apiKey = this.blockExplorerApis.get(chainId);
      if (!apiKey) return undefined;

      const baseUrl = this.getBlockExplorerBaseUrl(chainId);
      
      // Get contract transactions
      const txResponse = await axios.get(`${baseUrl}/api`, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: apiKey,
        },
        timeout: 10000,
      });

      // Get contract events
      const eventResponse = await axios.get(`${baseUrl}/api`, {
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: apiKey,
        },
        timeout: 10000,
      });

      return {
        transactions: txResponse.data.status === '1' ? txResponse.data.result : [],
        events: eventResponse.data.status === '1' ? eventResponse.data.result : [],
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Failed to get block explorer data:', error);
      return undefined;
    }
  }

  private async performAIAnalysisWithFallback(
    sourceCode: ContractSourceCode,
    blockchainAnalysis: BlockchainContractAnalysis
  ): Promise<AIAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(sourceCode, blockchainAnalysis);
    
    // Try each AI provider in order until one succeeds
    for (const provider of this.aiProviders) {
      try {
        console.log(`Attempting AI analysis with ${provider.name}...`);
        const result = await this.callAIProvider(provider, prompt);
        return {
          ...this.parseAIAnalysis(result),
          aiProvider: provider.name,
        };
      } catch (error) {
        console.error(`${provider.name} analysis failed:`, error);
        continue; // Try next provider
      }
    }
    
    // If all providers fail, return fallback analysis
    console.warn('All AI providers failed, using fallback analysis');
    return {
      ...this.generateFallbackAnalysis(blockchainAnalysis),
      aiProvider: 'fallback',
    };
  }

  private buildAnalysisPrompt(sourceCode: ContractSourceCode, blockchainAnalysis: BlockchainContractAnalysis): string {
    return `
Please analyze this Solidity smart contract for security vulnerabilities and provide recommendations.

Contract Details:
- Name: ${sourceCode.contractName}
- Compiler Version: ${sourceCode.compilerVersion}
- Optimization: ${sourceCode.optimization ? 'Enabled' : 'Disabled'}
- Runs: ${sourceCode.runs}

Blockchain Analysis Results:
- Risk Score: ${blockchainAnalysis.riskScore}/100
- Detected Vulnerabilities: ${blockchainAnalysis.vulnerabilities.join(', ')}

Source Code:
\`\`\`solidity
${sourceCode.sourceCode}
\`\`\`

Please provide:
1. Risk score (0-100)
2. List of specific vulnerabilities found
3. Actionable security recommendations
4. Security level (low/medium/high/critical)
5. Whether an audit is recommended
6. Estimated audit cost
7. Complexity score (1-10)
8. Gas optimization suggestions
9. Best practices to implement

Format your response as JSON:
{
  "riskScore": number,
  "vulnerabilities": ["vuln1", "vuln2"],
  "recommendations": ["rec1", "rec2"],
  "securityLevel": "low|medium|high|critical",
  "auditRecommendation": boolean,
  "estimatedAuditCost": "string",
  "complexityScore": number,
  "gasOptimization": ["opt1", "opt2"],
  "bestPractices": ["practice1", "practice2"]
}
`;
  }

  private parseAIAnalysis(analysis: string): AIAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          riskScore: parsed.riskScore || 50,
          vulnerabilities: parsed.vulnerabilities || [],
          recommendations: parsed.recommendations || [],
          securityLevel: parsed.securityLevel || 'medium',
          auditRecommendation: parsed.auditRecommendation || false,
          estimatedAuditCost: parsed.estimatedAuditCost || 'Unknown',
          complexityScore: parsed.complexityScore || 5,
          gasOptimization: parsed.gasOptimization || [],
          bestPractices: parsed.bestPractices || [],
          aiProvider: 'fallback', // Default to fallback if JSON parsing fails
        };
      }
      
      // Fallback parsing if JSON extraction fails
      return this.parseFallbackAnalysis(analysis);
    } catch (error) {
      console.error('Failed to parse AI analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private parseFallbackAnalysis(analysis: string): AIAnalysisResult {
    // Simple keyword-based parsing as fallback
    const riskScore = this.extractRiskScore(analysis);
    const vulnerabilities = this.extractVulnerabilities(analysis);
    const recommendations = this.extractRecommendations(analysis);
    
    return {
      riskScore,
      vulnerabilities,
      recommendations,
      securityLevel: this.calculateSecurityLevel(riskScore),
      auditRecommendation: riskScore > 70,
      estimatedAuditCost: riskScore > 80 ? '$10,000-$50,000' : '$5,000-$15,000',
      complexityScore: this.calculateComplexityScore(analysis),
      gasOptimization: this.extractGasOptimization(analysis),
      bestPractices: this.extractBestPractices(analysis),
      aiProvider: 'fallback', // Default to fallback if keyword parsing fails
    };
  }

  private extractRiskScore(analysis: string): number {
    const riskKeywords = {
      'critical': 90,
      'high': 75,
      'medium': 50,
      'low': 25,
      'safe': 10,
    };

    for (const [keyword, score] of Object.entries(riskKeywords)) {
      if (analysis.toLowerCase().includes(keyword)) {
        return score;
      }
    }

    return 50; // Default medium risk
  }

  private extractVulnerabilities(analysis: string): string[] {
    const vulnerabilities: string[] = [];
    const vulnKeywords = [
      'reentrancy',
      'overflow',
      'access control',
      'delegatecall',
      'selfdestruct',
      'tx.origin',
      'unchecked external calls',
      'timestamp dependency',
    ];

    vulnKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) {
        vulnerabilities.push(keyword);
      }
    });

    return vulnerabilities.length > 0 ? vulnerabilities : ['No specific vulnerabilities detected'];
  }

  private extractRecommendations(analysis: string): string[] {
    const recommendations: string[] = [];
    const recKeywords = [
      'audit',
      'reentrancy guard',
      'access control',
      'safe math',
      'timelock',
      'multi-sig',
      'pause mechanism',
    ];

    recKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) {
        recommendations.push(`Implement ${keyword}`);
      }
    });

    return recommendations.length > 0 ? recommendations : ['Follow Solidity best practices'];
  }

  private calculateSecurityLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  private calculateComplexityScore(analysis: string): number {
    const complexityKeywords = [
      'complex', 'complicated', 'advanced', 'sophisticated',
      'simple', 'basic', 'straightforward', 'elementary',
    ];

    let score = 5; // Default medium complexity
    
    complexityKeywords.forEach((keyword, index) => {
      if (analysis.toLowerCase().includes(keyword)) {
        if (index < 4) score += 2; // Complex keywords
        else score -= 2; // Simple keywords
      }
    });

    return Math.max(1, Math.min(10, score));
  }

  private extractGasOptimization(analysis: string): string[] {
    const optimizations: string[] = [];
    const optKeywords = [
      'gas optimization',
      'storage vs memory',
      'loop optimization',
      'external vs public',
      'packed structs',
    ];

    optKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) {
        optimizations.push(keyword);
      }
    });

    return optimizations.length > 0 ? optimizations : ['Consider gas optimization techniques'];
  }

  private extractBestPractices(analysis: string): string[] {
    const practices: string[] = [];
    const practiceKeywords = [
      'best practices',
      'security patterns',
      'design patterns',
      'standards',
      'guidelines',
    ];

    practiceKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) {
        practices.push(keyword);
      }
    });

    return practices.length > 0 ? practices : ['Follow industry security standards'];
  }

  private generateFallbackAnalysis(blockchainAnalysis: BlockchainContractAnalysis): AIAnalysisResult {
    return {
      riskScore: blockchainAnalysis.riskScore,
      vulnerabilities: blockchainAnalysis.vulnerabilities,
      recommendations: blockchainAnalysis.recommendations,
      securityLevel: this.calculateSecurityLevel(blockchainAnalysis.riskScore),
      auditRecommendation: blockchainAnalysis.riskScore > 70,
      estimatedAuditCost: blockchainAnalysis.riskScore > 80 ? '$10,000-$50,000' : '$5,000-$15,000',
      complexityScore: 5,
      gasOptimization: ['Optimize storage usage', 'Use external functions where possible'],
      bestPractices: ['Implement access controls', 'Add reentrancy guards'],
      aiProvider: 'fallback', // Default to fallback if blockchain analysis is not available
    };
  }

  private getDefaultAnalysis(): AIAnalysisResult {
    return {
      riskScore: 50,
      vulnerabilities: ['Analysis unavailable'],
      recommendations: ['Perform manual security review'],
      securityLevel: 'medium',
      auditRecommendation: true,
      estimatedAuditCost: '$5,000-$15,000',
      complexityScore: 5,
      gasOptimization: ['Standard optimization techniques'],
      bestPractices: ['Follow Solidity security guidelines'],
      aiProvider: 'fallback', // Default to fallback if no analysis is available
    };
  }

  private async getSocialSentiment(address: string, chainId: number): Promise<any> {
    try {
      // This would integrate with social media APIs or blockchain forums
      // For now, return mock data
      return {
        score: Math.random() * 100,
        mentions: Math.floor(Math.random() * 100),
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Failed to get social sentiment:', error);
      return undefined;
    }
  }

  private async cacheAnalysisResult(
    address: string,
    chainId: number,
    analysis: EnhancedContractAnalysis
  ): Promise<void> {
    try {
      await this.db.createContractAnalysis({
        id: this.generateId(),
        address,
        chainId,
        analysis: JSON.stringify(analysis),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to cache analysis result:', error);
    }
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getCachedAnalysis(address: string, chainId: number): Promise<EnhancedContractAnalysis | null> {
    try {
      const cached = await this.db.getContractAnalysis(address, chainId);
      if (cached && this.isAnalysisFresh(cached.updatedAt)) {
        return JSON.parse(cached.analysis);
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached analysis:', error);
      return null;
    }
  }

  private isAnalysisFresh(updatedAt: Date): boolean {
    const now = new Date();
    const diffInHours = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24; // Consider fresh if less than 24 hours old
  }

  async getAnalysisHistory(address: string, chainId: number): Promise<any[]> {
    try {
      return await this.db.getContractAnalysisHistory(address, chainId);
    } catch (error) {
      console.error('Failed to get analysis history:', error);
      return [];
    }
  }

  async compareContracts(addresses: string[], chainId: number): Promise<any> {
    try {
      const analyses = await Promise.all(
        addresses.map(addr => this.analyzeContract(addr, chainId))
      );

      return {
        contracts: analyses,
        comparison: {
          averageRiskScore: analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length,
          highestRisk: analyses.reduce((max, a) => Math.max(max, a.riskScore), 0),
          lowestRisk: analyses.reduce((min, a) => Math.min(min, a.riskScore), 100),
          commonVulnerabilities: this.findCommonVulnerabilities(analyses),
          recommendations: this.consolidateRecommendations(analyses),
        },
      };
    } catch (error) {
      console.error('Contract comparison failed:', error);
      throw error;
    }
  }

  private findCommonVulnerabilities(analyses: EnhancedContractAnalysis[]): string[] {
    const vulnCount: Record<string, number> = {};
    
    analyses.forEach(analysis => {
      analysis.vulnerabilities.forEach(vuln => {
        vulnCount[vuln] = (vulnCount[vuln] || 0) + 1;
      });
    });

    return Object.entries(vulnCount)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .map(([vuln, _]) => vuln);
  }

  private consolidateRecommendations(analyses: EnhancedContractAnalysis[]): string[] {
    const recCount: Record<string, number> = {};
    
    analyses.forEach(analysis => {
      analysis.recommendations.forEach(rec => {
        recCount[rec] = (recCount[rec] || 0) + 1;
      });
    });

    return Object.entries(recCount)
      .sort(([_, a], [__, b]) => b - a)
      .map(([rec, _]) => rec)
      .slice(0, 10); // Top 10 recommendations
  }
}