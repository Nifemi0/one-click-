import { ethers } from 'ethers';
import { DatabaseService } from './database';
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
  bytecode: string;
  sourceCode?: string;
  abi?: any[];
  riskScore: number;
  vulnerabilities: string[];
  recommendations: string[];
  gasEstimate: number;
  deploymentCost: string;
}

export interface TrapDeployment {
  id: string;
  userId: string;
  templateId: string;
  contractAddress: string;
  chainId: number;
  status: 'pending' | 'deploying' | 'active' | 'paused' | 'error';
  gasUsed: number;
  gasPrice: string;
  deploymentCost: string;
  deployedAt: Date;
  lastActivity: Date;
  configuration: any;
}

export class BlockchainService {
  private providers: Map<number, ethers.Provider> = new Map();
  private networks: NetworkConfig[] = [];
  private db: DatabaseService;
  private notification: NotificationService;

  constructor(db: DatabaseService, notification: NotificationService) {
    this.db = db;
    this.notification = notification;
    this.initializeNetworks();
  }

  private initializeNetworks() {
    this.networks = [
      {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/your-key',
        blockExplorer: 'https://etherscan.io',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        contracts: {
          droseraFactory: process.env.ETHEREUM_DROSERA_FACTORY || '',
          droseraRegistry: process.env.ETHEREUM_DROSERA_REGISTRY || '',
          droseraOracle: process.env.ETHEREUM_DROSERA_ORACLE || '',
        },
      },
      {
        chainId: 137,
        name: 'Polygon',
        rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        contracts: {
          droseraFactory: process.env.POLYGON_DROSERA_FACTORY || '',
          droseraRegistry: process.env.POLYGON_DROSERA_REGISTRY || '',
          droseraOracle: process.env.POLYGON_DROSERA_ORACLE || '',
        },
      },
      {
        chainId: 42161,
        name: 'Arbitrum One',
        rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
        blockExplorer: 'https://arbiscan.io',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        contracts: {
          droseraFactory: process.env.ARBITRUM_DROSERA_FACTORY || '',
          droseraRegistry: process.env.ARBITRUM_DROSERA_REGISTRY || '',
          droseraOracle: process.env.ARBITRUM_DROSERA_ORACLE || '',
        },
      },
      {
        chainId: 8453,
        name: 'Base',
        rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
        blockExplorer: 'https://basescan.org',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        contracts: {
          droseraFactory: process.env.BASE_DROSERA_FACTORY || '',
          droseraRegistry: process.env.BASE_DROSERA_REGISTRY || '',
          droseraOracle: process.env.BASE_DROSERA_ORACLE || '',
        },
      },
    ];

    // Initialize providers
    this.networks.forEach(network => {
      try {
        const provider = new ethers.JsonRpcProvider(network.rpcUrl);
        this.providers.set(network.chainId, provider);
      } catch (error) {
        console.error(`Failed to initialize provider for chain ${network.chainId}:`, error);
      }
    });
  }

  async getProvider(chainId: number): Promise<ethers.Provider> {
    const provider = this.providers.get(chainId);
    if (!provider) {
      throw new Error(`Provider not found for chain ${chainId}`);
    }
    return provider;
  }

  async getNetworkInfo(chainId: number): Promise<NetworkConfig | null> {
    return this.networks.find(n => n.chainId === chainId) || null;
  }

  async getSupportedNetworks(): Promise<NetworkConfig[]> {
    return this.networks;
  }

  async analyzeContract(address: string, chainId: number): Promise<ContractAnalysis> {
    try {
      const provider = await this.getProvider(chainId);
      
      // Get contract bytecode
      const bytecode = await provider.getCode(address);
      
      if (bytecode === '0x') {
        throw new Error('Contract not found or not deployed');
      }

      // Basic bytecode analysis
      const riskScore = this.calculateRiskScore(bytecode);
      const vulnerabilities = this.detectVulnerabilities(bytecode);
      const recommendations = this.generateRecommendations(vulnerabilities);
      
      // Estimate gas for deployment
      const gasEstimate = await this.estimateGas(bytecode, chainId);
      const deploymentCost = await this.calculateDeploymentCost(gasEstimate, chainId);

      return {
        address,
        chainId,
        bytecode,
        riskScore,
        vulnerabilities,
        recommendations,
        gasEstimate,
        deploymentCost,
      };
    } catch (error) {
      console.error('Contract analysis failed:', error);
      throw new Error(`Failed to analyze contract: ${error.message}`);
    }
  }

  private calculateRiskScore(bytecode: string): number {
    let riskScore = 0;
    
    // Check for common risky patterns
    if (bytecode.includes('DELEGATECALL')) riskScore += 30;
    if (bytecode.includes('CALLCODE')) riskScore += 25;
    if (bytecode.includes('SELFDESTRUCT')) riskScore += 40;
    if (bytecode.includes('SUICIDE')) riskScore += 40;
    
    // Check for access control patterns
    if (bytecode.includes('CALLER') && bytecode.includes('EQ')) riskScore -= 10;
    if (bytecode.includes('ORIGIN') && bytecode.includes('EQ')) riskScore += 20;
    
    // Check for reentrancy protection
    if (bytecode.includes('REENTRANCY_GUARD')) riskScore -= 15;
    
    return Math.max(0, Math.min(100, riskScore));
  }

  private detectVulnerabilities(bytecode: string): string[] {
    const vulnerabilities: string[] = [];
    
    if (bytecode.includes('DELEGATECALL')) {
      vulnerabilities.push('Unrestricted delegatecall - potential code injection');
    }
    if (bytecode.includes('SELFDESTRUCT') || bytecode.includes('SUICIDE')) {
      vulnerabilities.push('Self-destruct function - contract can be destroyed');
    }
    if (bytecode.includes('ORIGIN') && !bytecode.includes('CALLER')) {
      vulnerabilities.push('tx.origin usage - potential phishing vulnerability');
    }
    if (!bytecode.includes('REENTRANCY_GUARD')) {
      vulnerabilities.push('No reentrancy protection detected');
    }
    
    return vulnerabilities;
  }

  private generateRecommendations(vulnerabilities: string[]): string[] {
    const recommendations: string[] = [];
    
    if (vulnerabilities.some(v => v.includes('delegatecall'))) {
      recommendations.push('Implement strict access controls for delegatecall functions');
    }
    if (vulnerabilities.some(v => v.includes('Self-destruct'))) {
      recommendations.push('Add timelock or multi-sig for self-destruct function');
    }
    if (vulnerabilities.some(v => v.includes('tx.origin'))) {
      recommendations.push('Replace tx.origin with msg.sender for access control');
    }
    if (vulnerabilities.some(v => v.includes('reentrancy'))) {
      recommendations.push('Implement reentrancy guards for state-changing functions');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Contract appears to follow security best practices');
    }
    
    return recommendations;
  }

  private async estimateGas(bytecode: string, chainId: number): Promise<number> {
    try {
      const provider = await this.getProvider(chainId);
      const gasPrice = await provider.getFeeData();
      
      // Basic gas estimation based on bytecode size
      const baseGas = 21000;
      const bytecodeGas = Math.ceil(bytecode.length / 2) * 16; // 16 gas per byte
      const deploymentGas = baseGas + bytecodeGas;
      
      // Add buffer for safety
      return Math.ceil(deploymentGas * 1.2);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return 500000; // Default fallback
    }
  }

  private async calculateDeploymentCost(gasEstimate: number, chainId: number): Promise<string> {
    try {
      const provider = await this.getProvider(chainId);
      const gasPrice = await provider.getFeeData();
      
      if (!gasPrice.gasPrice) {
        return 'Unknown';
      }
      
      const cost = gasPrice.gasPrice * BigInt(gasEstimate);
      return ethers.formatEther(cost);
    } catch (error) {
      console.error('Cost calculation failed:', error);
      return 'Unknown';
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
        userId,
        templateId,
        contractAddress: '',
        chainId,
        status: 'pending',
        gasUsed: 0,
        gasPrice: '0',
        deploymentCost: '0',
        deployedAt: new Date(),
        lastActivity: new Date(),
        configuration,
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
        deployment.gasPrice = receipt.gasPrice?.toString() || '0';
        deployment.deploymentCost = ethers.formatEther(
          BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice || 0)
        );
        deployment.deployedAt = new Date();
        
        await this.db.updateDeployedTrap(deployment.id, {
          contractAddress: deployedAddress,
          status: 'active',
          gasUsed: deployment.gasUsed,
          gasPrice: deployment.gasPrice,
          deploymentCost: deployment.deploymentCost,
          deployedAt: deployment.deployedAt,
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