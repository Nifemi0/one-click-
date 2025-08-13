import { ethers } from 'ethers';
import { DatabaseService } from './database';
import { MultiRPCService } from './multiRPCService';
import { NotificationService } from './notification';

export interface ContractAnalysis {
  contractAddress: string;
  chainId: number;
  riskScore: number;
  vulnerabilities: string[];
  recommendations: string[];
  analysisTimestamp: Date;
}

export interface DeploymentStatus {
  id: string;
  status: 'pending' | 'deploying' | 'active' | 'inactive' | 'compromised' | 'error';
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

export class BlockchainService {
  private db: DatabaseService;
  private multiRPC: MultiRPCService;
  private notification: NotificationService;
  private providers: Map<number, ethers.Provider> = new Map();

  constructor(db: DatabaseService, notification: NotificationService) {
    this.db = db;
    this.notification = notification;
    this.multiRPC = new MultiRPCService(db);
  }

  async initialize(): Promise<void> {
    try {
      // Initialize RPC providers for supported networks
      await this.initializeProviders();
      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  private async initializeProviders(): Promise<void> {
    try {
      // Initialize Hoodi testnet provider
      const hoodiProvider = new ethers.JsonRpcProvider(process.env.HOODI_RPC_URL);
      this.providers.set(560048, hoodiProvider);
      
      // Initialize other providers as needed
      if (process.env.ALCHEMY_API_KEY) {
        const alchemyProvider = new ethers.AlchemyProvider(
          'mainnet',
          process.env.ALCHEMY_API_KEY
        );
        this.providers.set(1, alchemyProvider);
      }

      console.log(`Initialized ${this.providers.size} blockchain providers`);
    } catch (error) {
      console.error('Error initializing blockchain providers:', error);
      throw error;
    }
  }

  getProvider(chainId: number): ethers.Provider | null {
    return this.providers.get(chainId) || null;
  }

  async analyzeContract(contractAddress: string, chainId: number): Promise<ContractAnalysis> {
    try {
      const provider = this.getProvider(chainId);
      if (!provider) {
        throw new Error(`No provider available for chain ID ${chainId}`);
      }

      // Get contract code
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error('Contract not found at specified address');
      }

      // Basic security analysis
      const vulnerabilities: string[] = [];
      const recommendations: string[] = [];
      let riskScore = 0;

      // Check for common vulnerabilities
      if (code.includes('delegatecall')) {
        vulnerabilities.push('Uses delegatecall - potential security risk');
        riskScore += 30;
        recommendations.push('Review delegatecall usage carefully');
      }

      if (code.includes('selfdestruct')) {
        vulnerabilities.push('Contains selfdestruct function');
        riskScore += 25;
        recommendations.push('Ensure selfdestruct is properly controlled');
      }

      if (code.includes('suicide')) {
        vulnerabilities.push('Contains deprecated suicide function');
        riskScore += 20;
        recommendations.push('Update to use selfdestruct instead');
      }

      // Check for reentrancy patterns
      if (code.includes('call') && code.includes('value')) {
        vulnerabilities.push('Uses low-level call with value - potential reentrancy risk');
        riskScore += 35;
        recommendations.push('Implement reentrancy guards');
      }

      // Check for access control
      if (!code.includes('onlyOwner') && !code.includes('modifier')) {
        vulnerabilities.push('No apparent access control mechanisms');
        riskScore += 15;
        recommendations.push('Implement proper access control');
      }

      // Normalize risk score to 0-100
      riskScore = Math.min(riskScore, 100);

      const analysis: ContractAnalysis = {
        contractAddress,
        chainId,
        riskScore,
        vulnerabilities,
        recommendations,
        analysisTimestamp: new Date()
      };

      // Store analysis in database
      await this.db.query(
        'INSERT INTO contract_analysis (contract_address, chain_id, analysis_result, risk_score, analyzed_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (contract_address) DO UPDATE SET analysis_result = $3, risk_score = $4, analyzed_at = $5, expires_at = $6',
        [
          contractAddress,
          chainId,
          JSON.stringify(analysis),
          riskScore,
          analysis.analysisTimestamp,
          new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        ]
      );

      return analysis;
    } catch (error) {
      console.error('Contract analysis failed:', error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deploySecurityTrap(
    userId: string,
    templateId: string,
    constructorArgs: any[],
    network: number
  ): Promise<DeploymentStatus> {
    try {
      // Get template from database
      const template = await this.db.getTrapTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Get user's wallet
      const user = await this.db.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get provider for the network
      const provider = this.getProvider(network);
      if (!provider) {
        throw new Error(`No provider available for network ${network}`);
      }

      // Create deployment record
      const deployment = await this.db.createDeployedTrap({
        userId,
        templateId,
        network,
        contractAddress: '',
        deploymentTxHash: '',
        status: 'deploying',
        estimatedCost: template.estimatedCost || '0',
        actualCost: '0'
      });

      try {
        // Deploy the contract using the template's ABI and bytecode
        const factory = new ethers.ContractFactory(
          template.abi,
          template.bytecode,
          provider
        );

        // Use the standard deploy method instead of deployTrap
        const tx = await factory.deploy(...constructorArgs);
        const receipt = await tx.waitForDeployment();
        const deployedAddress = await tx.getAddress();

        if (deployedAddress) {
          // Update deployment record
          await this.db.updateDeployedTrap(deployment.id, {
            contractAddress: deployedAddress,
            deploymentTxHash: tx.deploymentTransaction()?.hash || '',
            status: 'active',
            actualCost: '0' // Will be updated when we get the receipt
          });

          // Send success notification
          await this.notification.sendNotification(userId, {
            type: 'success',
            title: 'Deployment Successful',
            message: 'Security trap deployed successfully',
            data: { deploymentId: deployment.id, contractAddress: deployedAddress },
            userId
          });

          return {
            id: deployment.id,
            status: 'active',
            contractAddress: deployedAddress,
            transactionHash: tx.deploymentTransaction()?.hash || ''
          };
        } else {
          throw new Error('Failed to get deployed address');
        }
      } catch (error) {
        // Update deployment status to error
        await this.db.updateDeployedTrap(deployment.id, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        // Send error notification
        await this.notification.sendNotification(userId, {
          type: 'error',
          title: 'Deployment Failed',
          message: `Failed to deploy security trap: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: { deploymentId: deployment.id },
          userId
        });

        throw new Error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      throw error;
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus | null> {
    try {
      const deployment = await this.db.getDeployedTrap(deploymentId);
      if (!deployment) {
        return null;
      }

      return {
        id: deployment.id,
        status: deployment.status as any,
        contractAddress: deployment.contract_address,
        transactionHash: deployment.deployment_tx_hash,
        error: deployment.error
      };
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      return null;
    }
  }

  async pauseDeployment(deploymentId: string): Promise<boolean> {
    try {
      const deployment = await this.db.getDeployedTrap(deploymentId);
      if (!deployment) {
        return false;
      }

      await this.db.updateDeployedTrap(deploymentId, { status: 'inactive' });
      return true;
    } catch (error) {
      console.error('Failed to pause deployment:', error);
      return false;
    }
  }

  async resumeDeployment(deploymentId: string): Promise<boolean> {
    try {
      const deployment = await this.db.getDeployedTrap(deploymentId);
      if (!deployment) {
        return false;
      }

      await this.db.updateDeployedTrap(deploymentId, { status: 'active' });
      return true;
    } catch (error) {
      console.error('Failed to resume deployment:', error);
      return false;
    }
  }

  async deleteDeployment(deploymentId: string): Promise<boolean> {
    try {
      await this.db.query('DELETE FROM deployed_traps WHERE id = $1', [deploymentId]);
      return true;
    } catch (error) {
      console.error('Failed to delete deployment:', error);
      return false;
    }
  }

  // Add missing method for calculating deployment cost
  async calculateDeploymentCost(
    bytecode: string,
    constructorArgs: any[],
    network: number
  ): Promise<string> {
    try {
      const provider = this.getProvider(network);
      if (!provider) {
        throw new Error(`No provider available for network ${network}`);
      }

      // Estimate gas for deployment
      const gasEstimate = await provider.estimateGas({
        data: bytecode,
        value: 0
      });

      // Get current gas price
      const gasPrice = await provider.getFeeData();
      const estimatedGasPrice = gasPrice.gasPrice || ethers.parseUnits('20', 'gwei');

      // Calculate estimated cost
      const estimatedCost = gasEstimate * estimatedGasPrice;
      const costInEth = ethers.formatEther(estimatedCost);

      return `${costInEth} ETH`;
    } catch (error) {
      console.error('Failed to calculate deployment cost:', error);
      return 'Unknown';
    }
  }

  async getNetworkInfo(network: number): Promise<any> {
    try {
      const provider = this.getProvider(network);
      if (!provider) {
        return null;
      }

      const [blockNumber, gasPrice] = await Promise.all([
        provider.getBlockNumber(),
        provider.getFeeData()
      ]);

      return {
        network,
        blockNumber,
        gasPrice: gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : 'Unknown',
        isConnected: true
      };
    } catch (error) {
      console.error(`Failed to get network info for ${network}:`, error);
      return {
        network,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  async getTransactionReceipt(txHash: string, network: number): Promise<any> {
    try {
      const provider = this.getProvider(network);
      if (!provider) {
        throw new Error(`No provider available for network ${network}`);
      }

      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      throw error;
    }
  }

  // Add missing methods for RPC testing
  async getRPCStatus(): Promise<any> {
    try {
      return await this.multiRPC.getProviderStatus();
    } catch (error) {
      console.error('Failed to get RPC status:', error);
      return { error: 'Failed to get RPC status' };
    }
  }

  async getRPCStats(): Promise<any> {
    try {
      return await this.multiRPC.getProviderStats();
    } catch (error) {
      console.error('Failed to get RPC stats:', error);
      return { error: 'Failed to get RPC stats' };
    }
  }

  async getCurrentRPCProvider(): Promise<any> {
    try {
      return await this.multiRPC.getCurrentProvider();
    } catch (error) {
      console.error('Failed to get current RPC provider:', error);
      return { error: 'Failed to get current RPC provider' };
    }
  }

  async switchRPCProvider(providerName: string): Promise<boolean> {
    try {
      return await this.multiRPC.switchToProvider(providerName);
    } catch (error) {
      console.error('Failed to switch RPC provider:', error);
      return false;
    }
  }

  async getBalance(address: string, chainId: number): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      if (!provider) {
        throw new Error(`No provider available for chain ID ${chainId}`);
      }

      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }
}