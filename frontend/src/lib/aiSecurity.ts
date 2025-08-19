'use client';

import { ethers } from 'ethers';

export interface SecurityThreat {
  id: string;
  type: 'transaction' | 'contract' | 'wallet' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  address?: string;
  transactionHash?: string;
  confidence: number;
  recommendations: string[];
}

export interface SecurityScore {
  overall: number;
  wallet: number;
  contracts: number;
  transactions: number;
  network: number;
  lastUpdated: number;
}

export interface ContractAudit {
  contractAddress: string;
  securityScore: number;
  vulnerabilities: string[];
  recommendations: string[];
  lastAudit: number;
  auditStatus: 'pending' | 'completed' | 'failed';
}

export class AISecurityService {
  private provider: ethers.BrowserProvider | null = null;
  private threatPatterns: Map<string, RegExp> = new Map();
  private knownScamAddresses: Set<string> = new Set();
  private suspiciousPatterns: RegExp[] = [];

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Initialize known threat patterns
    this.threatPatterns.set('flashLoan', /flash.*loan|loan.*flash/gi);
    this.threatPatterns.set('sandwich', /sandwich.*attack|attack.*sandwich/gi);
    this.threatPatterns.set('frontrun', /front.*run|run.*front/gi);
    
    // Suspicious transaction patterns
    this.suspiciousPatterns = [
      /0x0{20,}/, // Multiple zero addresses
      /0x1{20,}/, // Multiple one addresses
      /0xdeadbeef/, // Known test addresses
    ];
  }

  async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        console.log('AI Security provider initialized');
      } catch (error) {
        console.error('Failed to initialize AI Security provider:', error);
      }
    }
  }

  async analyzeTransaction(transactionHash: string): Promise<SecurityThreat[]> {
    if (!this.provider) {
      await this.initializeProvider();
    }

    try {
      const tx = await this.provider!.getTransaction(transactionHash);
      const receipt = await this.provider!.getTransactionReceipt(transactionHash);
      
      if (!tx || !receipt) {
        return [];
      }

      const threats: SecurityThreat[] = [];
      
      // Analyze transaction data
      if (tx.data && tx.data !== '0x') {
        const dataThreats = this.analyzeTransactionData(tx.data);
        threats.push(...dataThreats);
      }

      // Analyze gas usage patterns
      if (receipt.gasUsed) {
        const gasThreats = this.analyzeGasUsage(receipt.gasUsed, tx.gasLimit);
        threats.push(...gasThreats);
      }

      // Analyze recipient address
      if (tx.to) {
        const addressThreats = await this.analyzeAddress(tx.to);
        threats.push(...addressThreats);
      }

      return threats;
    } catch (error) {
      console.error('Transaction analysis failed:', error);
      return [];
    }
  }

  private analyzeTransactionData(data: string): SecurityThreat[] {
    const threats: SecurityThreat[] = [];
    
    // Check for known malicious function signatures
    const functionSignatures = [
      '0xa9059cbb', // transfer(address,uint256)
      '0x23b872dd', // transferFrom(address,address,uint256)
      '0x40c10f19', // mint(address,uint256)
    ];

    for (const sig of functionSignatures) {
      if (data.startsWith(sig)) {
        threats.push({
          id: `tx_${Date.now()}_${Math.random()}`,
          type: 'transaction',
          severity: 'medium',
          description: `Detected standard ERC20 function call: ${sig}`,
          timestamp: Date.now(),
          confidence: 0.8,
          recommendations: ['Verify recipient address', 'Check token contract legitimacy']
        });
      }
    }

    return threats;
  }

  private analyzeGasUsage(gasUsed: bigint, gasLimit?: bigint): SecurityThreat[] {
    const threats: SecurityThreat[] = [];
    
    if (gasLimit) {
      const gasUsageRatio = Number(gasUsed) / Number(gasLimit);
      
      if (gasUsageRatio > 0.95) {
        threats.push({
          id: `gas_${Date.now()}_${Math.random()}`,
          type: 'transaction',
          severity: 'medium',
          description: 'High gas usage detected - potential complex operation',
          timestamp: Date.now(),
          confidence: 0.7,
          recommendations: ['Review transaction complexity', 'Verify gas estimation']
        });
      }
    }

    return threats;
  }

  async analyzeAddress(address: string): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];
    
    // Check if address is known scam
    if (this.knownScamAddresses.has(address.toLowerCase())) {
      threats.push({
        id: `scam_${Date.now()}_${Math.random()}`,
        type: 'wallet',
        severity: 'critical',
        description: 'Address identified as known scam address',
        timestamp: Date.now(),
        address,
        confidence: 0.95,
        recommendations: ['DO NOT interact with this address', 'Report to security team']
      });
    }

    // Check for suspicious patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(address)) {
        threats.push({
          id: `pattern_${Date.now()}_${Math.random()}`,
          type: 'wallet',
          severity: 'low',
          description: 'Address matches suspicious pattern',
          timestamp: Date.now(),
          address,
          confidence: 0.6,
          recommendations: ['Verify address legitimacy', 'Double-check before interaction']
        });
      }
    }

    return threats;
  }

  async auditSmartContract(contractAddress: string): Promise<ContractAudit> {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }

      const contract = new ethers.Contract(contractAddress, [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function totalSupply() view returns (uint256)',
        'function balanceOf(address) view returns (uint256)',
        'function transfer(address,uint256) returns (bool)',
        'function approve(address,uint256) returns (bool)',
        'function transferFrom(address,address,uint256) returns (bool)'
      ], this.provider);

      const vulnerabilities: string[] = [];
      const recommendations: string[] = [];
      let securityScore = 100;

      // Basic contract analysis
      try {
        const name = await contract.name();
        if (!name || name.length === 0) {
          vulnerabilities.push('Contract name is empty or undefined');
          securityScore -= 10;
        }
      } catch {
        vulnerabilities.push('Contract name function not accessible');
        securityScore -= 15;
      }

      try {
        const symbol = await contract.symbol();
        if (!symbol || symbol.length === 0) {
          vulnerabilities.push('Contract symbol is empty or undefined');
          securityScore -= 10;
        }
      } catch {
        vulnerabilities.push('Contract symbol function not accessible');
        securityScore -= 15;
      }

      // Check for basic ERC20 compliance
      try {
        await contract.totalSupply();
      } catch {
        vulnerabilities.push('Contract missing totalSupply function');
        securityScore -= 20;
        recommendations.push('Implement standard ERC20 totalSupply function');
      }

      try {
        await contract.balanceOf(ethers.ZeroAddress);
      } catch {
        vulnerabilities.push('Contract missing balanceOf function');
        securityScore -= 20;
        recommendations.push('Implement standard ERC20 balanceOf function');
      }

      // Security score adjustments
      if (vulnerabilities.length === 0) {
        recommendations.push('Contract appears to follow ERC20 standards');
      }

      if (securityScore < 0) securityScore = 0;

      return {
        contractAddress,
        securityScore,
        vulnerabilities,
        recommendations,
        lastAudit: Date.now(),
        auditStatus: 'completed'
      };
    } catch (error) {
      console.error('Contract audit failed:', error);
      return {
        contractAddress,
        securityScore: 0,
        vulnerabilities: ['Failed to audit contract'],
        recommendations: ['Check contract accessibility and try again'],
        lastAudit: Date.now(),
        auditStatus: 'failed'
      };
    }
  }

  async calculateSecurityScore(address: string): Promise<SecurityScore> {
    try {
      const walletScore = await this.analyzeWalletSecurity(address);
      const contractScore = await this.analyzeContractSecurity(address);
      const transactionScore = await this.analyzeTransactionHistory(address);
      const networkScore = await this.analyzeNetworkSecurity();

      const overall = Math.round((walletScore + contractScore + transactionScore + networkScore) / 4);

      return {
        overall,
        wallet: walletScore,
        contracts: contractScore,
        transactions: transactionScore,
        network: networkScore,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Security score calculation failed:', error);
      return {
        overall: 0,
        wallet: 0,
        contracts: 0,
        transactions: 0,
        network: 0,
        lastUpdated: Date.now()
      };
    }
  }

  private async analyzeWalletSecurity(address: string): Promise<number> {
    // Basic wallet security analysis
    let score = 100;
    
    // Check if address is a contract
    try {
      if (!this.provider) await this.initializeProvider();
      const code = await this.provider!.getCode(address);
      if (code !== '0x') {
        score -= 20; // Contract addresses have different security considerations
      }
    } catch {
      score -= 10;
    }

    return Math.max(0, score);
  }

  private async analyzeContractSecurity(address: string): Promise<number> {
    try {
      const audit = await this.auditSmartContract(address);
      return audit.securityScore;
    } catch {
      return 50; // Default score for failed audits
    }
  }

  private async analyzeTransactionHistory(address: string): Promise<number> {
    // Analyze recent transactions for suspicious patterns
    let score = 100;
    
    try {
      // This would typically analyze transaction history from an indexer
      // For now, return a default score
      return score;
    } catch {
      return 70; // Default score for failed analysis
    }
  }

  private async analyzeNetworkSecurity(): Promise<number> {
    // Analyze current network security status
    let score = 100;
    
    try {
      if (!this.provider) await this.initializeProvider();
      const network = await this.provider!.getNetwork();
      
      // Check if on testnet vs mainnet
      if (network.chainId === BigInt(560048)) { // Hoodi testnet
        score -= 20; // Testnets are less secure than mainnets
      }
      
      return Math.max(0, score);
    } catch {
      return 80; // Default score for failed analysis
    }
  }

  async addKnownScamAddress(address: string) {
    this.knownScamAddresses.add(address.toLowerCase());
  }

  async removeKnownScamAddress(address: string) {
    this.knownScamAddresses.delete(address.toLowerCase());
  }

  getKnownScamAddresses(): string[] {
    return Array.from(this.knownScamAddresses);
  }

  async getNetworkInfo() {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }

      const network = await this.provider!.getNetwork();
      return {
        chainId: network.chainId,
        name: network.name,
        isHoodiTestnet: network.chainId === BigInt(560048)
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const aiSecurityService = new AISecurityService();
