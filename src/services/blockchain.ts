import { ethers } from 'ethers';
import { DatabaseService } from './database';
import { MultiRPCService } from './multiRPCService';
import { NotificationService } from './notification';

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts: {
    droseraFactory: string;
    droseraRegistry: string;
    droseraOracle: string;
  };
}

export interface ContractAnalysis {
  address: string;
  chainId: number;
  riskScore: number;
  vulnerabilities: string[];
  recommendations: string[];
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  auditRecommendation: boolean;
  estimatedAuditCost: string;
  complexityScore: number;
  gasOptimization: string[];
  bestPractices: string[];
  lastAnalyzed: Date;
  analysisVersion: string;
}

export interface TrapDeployment {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
  chainId: number;
  owner: string;
  status: 'active' | 'inactive' | 'compromised';
  deployedAt: Date;
  lastActivity: Date;
  securityScore: number;
  revenueGenerated: number;
  gasUsed: number;
  transactionHash: string;
}

export class BlockchainService {
  private networks: NetworkConfig[] = [];
  private multiRPCService: MultiRPCService;
  private db: DatabaseService;
  private notification: NotificationService;

  constructor(db: DatabaseService, notification: NotificationService) {
    this.db = db;
    this.notification = notification;
    this.multiRPCService = new MultiRPCService(db);
    this.initializeNetworks();
  }

  private initializeNetworks() {
    this.networks = [
      {
        chainId: 560048,
        name: 'Ethereum Hoodi Testnet',
        rpcUrl: 'https://rpc.hoodi.network', // This will be overridden by multiRPCService
        blockExplorer: 'https://hoodi.etherscan.io',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        contracts: {
          droseraFactory: process.env.HOODI_DROSERA_FACTORY || '',
          droseraRegistry: process.env.HOODI_DROSERA_REGISTRY || '',
          droseraOracle: process.env.HOODI_DROSERA_ORACLE || '',
        },
      },
    ];
  }

  async getProvider(chainId: number): Promise<ethers.Provider> {
    try {
      return await this.multiRPCService.getProvider(chainId);
    } catch (error) {
      console.error(`Failed to get provider for chain ${chainId}:`, error);
      throw new Error(`Provider not available for chain ${chainId}`);
    }
  }

  async getNetworkInfo(chainId: number): Promise<NetworkConfig | null> {
    return this.networks.find(n => n.chainId === chainId) || null;
  }

  async getSupportedNetworks(): Promise<NetworkConfig[]> {
    return this.networks;
  }

  // Multi-RPC service methods
  async getRPCStatus() {
    return this.multiRPCService.getProviderStatus();
  }

  async getRPCStats() {
    return this.multiRPCService.getProviderStats();
  }

  async switchRPCProvider(providerName: string) {
    return this.multiRPCService.switchToProvider(providerName);
  }

  async getCurrentRPCProvider() {
    return this.multiRPCService.getCurrentProvider();
  }

  async analyzeContract(address: string, chainId: number): Promise<ContractAnalysis> {
    try {
      const provider = await this.getProvider(chainId);
      
      // Get contract code
      const code = await provider.getCode(address);
      if (code === '0x') {
        throw new Error('No contract found at address');
      }

      // Basic contract analysis
      const analysis: ContractAnalysis = {
        address,
        chainId,
        riskScore: this.calculateRiskScore(code),
        vulnerabilities: this.detectVulnerabilities(code),
        recommendations: this.generateRecommendations(code),
        securityLevel: this.determineSecurityLevel(code),
        auditRecommendation: this.shouldRecommendAudit(code),
        estimatedAuditCost: this.estimateAuditCost(code),
        complexityScore: this.calculateComplexityScore(code),
        gasOptimization: this.suggestGasOptimizations(code),
        bestPractices: this.suggestBestPractices(code),
        lastAnalyzed: new Date(),
        analysisVersion: '1.0.0',
      };

      return analysis;
    } catch (error) {
      console.error('Contract analysis failed:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  private calculateRiskScore(code: string): number {
    // Basic risk scoring based on code size and patterns
    let riskScore = 50; // Base score
    
    if (code.length > 10000) riskScore += 20; // Large contracts are riskier
    if (code.includes('delegatecall')) riskScore += 15; // Dangerous pattern
    if (code.includes('selfdestruct')) riskScore += 20; // Very dangerous
    if (code.includes('suicide')) riskScore += 20; // Deprecated but dangerous
    
    return Math.min(riskScore, 100);
  }

  private detectVulnerabilities(code: string): string[] {
    const vulnerabilities: string[] = [];
    
    if (code.includes('delegatecall')) {
      vulnerabilities.push('Potential delegatecall vulnerability');
    }
    if (code.includes('selfdestruct') || code.includes('suicide')) {
      vulnerabilities.push('Self-destruct functionality detected');
    }
    if (code.includes('tx.origin')) {
      vulnerabilities.push('tx.origin usage may be unsafe');
    }
    
    return vulnerabilities;
  }

  private generateRecommendations(code: string): string[] {
    const recommendations: string[] = [];
    
    if (code.includes('delegatecall')) {
      recommendations.push('Review delegatecall usage for security implications');
    }
    if (code.includes('tx.origin')) {
      recommendations.push('Consider using msg.sender instead of tx.origin');
    }
    
    return recommendations;
  }

  private determineSecurityLevel(code: string): 'low' | 'medium' | 'high' | 'critical' {
    const riskScore = this.calculateRiskScore(code);
    
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  private shouldRecommendAudit(code: string): boolean {
    const riskScore = this.calculateRiskScore(code);
    return riskScore >= 60; // Recommend audit for medium-high risk contracts
  }

  private estimateAuditCost(code: string): string {
    const riskScore = this.calculateRiskScore(code);
    
    if (riskScore >= 80) return '$50,000 - $100,000';
    if (riskScore >= 60) return '$25,000 - $50,000';
    if (riskScore >= 40) return '$10,000 - $25,000';
    return '$5,000 - $10,000';
  }

  private calculateComplexityScore(code: string): number {
    // Simple complexity scoring
    let complexity = 1;
    
    if (code.length > 5000) complexity += 2;
    if (code.length > 10000) complexity += 2;
    if (code.includes('assembly')) complexity += 3;
    
    return Math.min(complexity, 10);
  }

  private suggestGasOptimizations(code: string): string[] {
    const optimizations: string[] = [];
    
    if (code.includes('storage')) {
      optimizations.push('Consider using memory for temporary data');
    }
    if (code.includes('for')) {
      optimizations.push('Optimize loop iterations');
    }
    
    return optimizations;
  }

  private suggestBestPractices(code: string): string[] {
    const practices: string[] = [];
    
    practices.push('Implement access controls');
    practices.push('Add reentrancy guards');
    practices.push('Use SafeMath or Solidity 0.8+');
    
    return practices;
  }

  // Revenue tracking methods
  async trackDeploymentRevenue(trapId: string, revenue: number, gasUsed: number): Promise<void> {
    try {
      await this.db.query(
        'UPDATE trap_deployments SET revenue_generated = revenue_generated + $1, gas_used = gas_used + $2, last_activity = NOW() WHERE id = $3',
        [revenue, gasUsed, trapId]
      );
    } catch (error) {
      console.error('Failed to track deployment revenue:', error);
    }
  }

  async getTotalRevenue(): Promise<number> {
    try {
      const result = await this.db.query('SELECT SUM(revenue_generated) as total FROM trap_deployments');
      return parseFloat(result.rows[0]?.total || '0');
    } catch (error) {
      console.error('Failed to get total revenue:', error);
      return 0;
    }
  }

  async getRevenueByNetwork(chainId: number): Promise<number> {
    try {
      const result = await this.db.query(
        'SELECT SUM(revenue_generated) as total FROM trap_deployments WHERE chain_id = $1',
        [chainId]
      );
      return parseFloat(result.rows[0]?.total || '0');
    } catch (error) {
      console.error('Failed to get revenue by network:', error);
      return 0;
    }
  }

  async deployTrap(
    userId: string,
    templateId: string,
    chainId: number,
    configuration: any,
    wallet: ethers.Wallet
  ): Promise<TrapDeployment> {
    try {
      const provider = await this.getProvider(chainId);
      const network = await this.getNetworkInfo(chainId);
      
      if (!network) {
        throw new Error(`Unsupported network: ${chainId}`);
      }

      // Connect wallet to provider
      const connectedWallet = wallet.connect(provider);
      
      // Get trap template
      const template = await this.db.getTrapTemplate(templateId);
      if (!template) {
        throw new Error('Trap template not found');
      }

      // Create deployment record
      const deployment: TrapDeployment = {
        id: this.generateId(),
        name: 'New Trap', // Placeholder, will be updated
        description: 'Deployed by user', // Placeholder, will be updated
        contractAddress: '',
        chainId,
        owner: userId,
        status: 'active',
        deployedAt: new Date(),
        lastActivity: new Date(),
        securityScore: 0, // Placeholder, will be updated
        revenueGenerated: 0, // Placeholder, will be updated
        gasUsed: 0, // Placeholder, will be updated
        transactionHash: '', // Placeholder, will be updated
      };

      // Save initial deployment record
      await this.db.createDeployedTrap(deployment);

      try {
        // Update status to deploying
        deployment.status = 'deploying';
        await this.db.updateDeployedTrap(deployment.id, { status: 'deploying' });

        // Deploy the contract
        const factory = new ethers.Contract(
          network.contracts.droseraFactory,
          ['function deployTrap(bytes memory bytecode, bytes memory constructorArgs) external returns (address)'],
          connectedWallet
        );

        const constructorArgs = this.encodeConstructorArgs(template, configuration);
        const tx = await factory.deployTrap(template.bytecode, constructorArgs);
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        
        // Extract deployed contract address from logs
        const deployedAddress = this.extractDeployedAddress(receipt.logs);
        
        // Update deployment record
        deployment.contractAddress = deployedAddress;
        deployment.status = 'active';
        deployment.gasUsed = Number(receipt.gasUsed);
        deployment.transactionHash = receipt.transactionHash;
        deployment.lastActivity = new Date();
        
        await this.db.updateDeployedTrap(deployment.id, {
          contractAddress: deployedAddress,
          status: 'active',
          gasUsed: deployment.gasUsed,
          transactionHash: deployment.transactionHash,
          lastActivity: deployment.lastActivity,
        });

        // Send success notification
        await this.notification.sendNotification(userId, {
          type: 'success',
          title: 'Trap Deployed Successfully',
          message: `Your security trap has been deployed on ${network.name}`,
          data: { deploymentId: deployment.id, contractAddress: deployedAddress },
        });

        return deployment;
      } catch (error) {
        // Update status to error
        deployment.status = 'error';
        await this.db.updateDeployedTrap(deployment.id, { status: 'error' });
        
        // Send error notification
        await this.notification.sendNotification(userId, {
          type: 'error',
          title: 'Trap Deployment Failed',
          message: `Failed to deploy security trap: ${error.message}`,
          data: { deploymentId: deployment.id },
        });
        
        throw error;
      }
    } catch (error) {
      console.error('Trap deployment failed:', error);
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }

  private encodeConstructorArgs(template: any, configuration: any): string {
    // This would encode the constructor arguments based on the template ABI
    // For now, return empty bytes
    return '0x';
  }

  private extractDeployedAddress(logs: any[]): string {
    // This would extract the deployed contract address from transaction logs
    // For now, return a placeholder
    return '0x0000000000000000000000000000000000000000';
  }

  private generateId(): string {
    return `trap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async monitorContract(address: string, chainId: number): Promise<void> {
    try {
      const provider = await this.getProvider(chainId);
      
      // Set up event listeners for the contract
      provider.on(address, (log) => {
        this.handleContractEvent(log, address, chainId);
      });
      
      console.log(`Started monitoring contract ${address} on chain ${chainId}`);
    } catch (error) {
      console.error('Failed to start contract monitoring:', error);
      throw error;
    }
  }

  private async handleContractEvent(log: any, address: string, chainId: number): Promise<void> {
    try {
      // Parse the event log
      const event = this.parseEventLog(log);
      
      if (event) {
        // Store event in database
        await this.db.createAlert({
          id: this.generateId(),
          userId: '', // Will be filled based on contract ownership
          type: 'contract_event',
          severity: 'info',
          title: `Contract Event: ${event.name}`,
          message: `Event ${event.name} triggered on contract ${address}`,
          data: event,
          chainId,
          contractAddress: address,
          createdAt: new Date(),
          isRead: false,
        });
        
        // Send real-time notification if needed
        // This would be handled by the WebSocket service
      }
    } catch (error) {
      console.error('Failed to handle contract event:', error);
    }
  }

  private parseEventLog(log: any): any {
    try {
      // This would parse the event log based on the contract ABI
      // For now, return a basic structure
      return {
        name: 'UnknownEvent',
        args: {},
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      };
    } catch (error) {
      console.error('Failed to parse event log:', error);
      return null;
    }
  }

  async getGasPrice(chainId: number): Promise<string> {
    try {
      const provider = await this.getProvider(chainId);
      const gasPrice = await provider.getFeeData();
      return gasPrice.gasPrice?.toString() || '0';
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return '0';
    }
  }

  async getBalance(address: string, chainId: number): Promise<string> {
    try {
      const provider = await this.getProvider(chainId);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }
}