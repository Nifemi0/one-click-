import { ethers } from 'ethers';
import { DatabaseService } from './database';
import { NotificationService } from './notification';
import { HOODI_CONFIG, HOODI_ERRORS, HOODI_MESSAGES, validateHoodiConfig } from '../config/hoodi';

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

export interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  actualCost: string;
  gasUsed: number;
  blockNumber: number;
}

export class BlockchainService {
  private db: DatabaseService;
  private notification: NotificationService;
  private hoodiProvider: ethers.JsonRpcProvider;
  
  // Hoodi Testnet Configuration
  private readonly HOODI_CHAIN_ID = HOODI_CONFIG.CHAIN_ID;
  private readonly HOODI_RPC_URL = HOODI_CONFIG.RPC_URL;
  private readonly HOODI_BLOCK_EXPLORER = HOODI_CONFIG.BLOCK_EXPLORER;
  private readonly HOODI_NATIVE_CURRENCY = HOODI_CONFIG.NATIVE_CURRENCY;

  constructor(db: DatabaseService, notification: NotificationService) {
    this.db = db;
    this.notification = notification;
    
    // Validate Hoodi configuration
    try {
      validateHoodiConfig();
    } catch (error) {
      console.error('❌ Hoodi configuration validation failed:', error);
      throw error;
    }
    
    // Initialize Hoodi testnet provider only
    this.hoodiProvider = new ethers.JsonRpcProvider(this.HOODI_RPC_URL);
    
    console.log('🔗 Blockchain service initialized for Hoodi testnet only');
    console.log(`📍 Chain ID: ${this.HOODI_CHAIN_ID}`);
    console.log(`🌐 RPC URL: ${this.HOODI_RPC_URL}`);
    console.log(`🔍 Block Explorer: ${this.HOODI_BLOCK_EXPLORER}`);
  }

  async initialize(): Promise<void> {
    try {
      console.log(HOODI_MESSAGES.INITIALIZING);
      
      // Test Hoodi connection
      const network = await this.hoodiProvider.getNetwork();
      if (network.chainId !== BigInt(this.HOODI_CHAIN_ID)) {
        throw new Error(`Expected Hoodi testnet (${this.HOODI_CHAIN_ID}), got ${network.chainId}`);
      }
      
      console.log(HOODI_MESSAGES.CONNECTED);
      console.log(`🔗 Network: ${network.name} (Chain ID: ${network.chainId})`);
      
      // Test basic functionality
      const latestBlock = await this.hoodiProvider.getBlockNumber();
      console.log(`📦 Latest block: ${latestBlock}`);
      
    } catch (error) {
      console.error('❌ Failed to connect to Hoodi testnet:', error);
      throw new Error(`Hoodi testnet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Hoodi testnet provider
   */
  getHoodiProvider(): ethers.JsonRpcProvider {
    return this.hoodiProvider;
  }

  /**
   * Get current Hoodi network info
   */
  async getHoodiNetworkInfo() {
    try {
      const network = await this.hoodiProvider.getNetwork();
      const latestBlock = await this.hoodiProvider.getBlockNumber();
      const gasPrice = await this.hoodiProvider.getFeeData();
      
      return {
        chainId: Number(network.chainId),
        name: network.name,
        latestBlock,
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        nativeCurrency: this.HOODI_NATIVE_CURRENCY,
        blockExplorer: this.HOODI_BLOCK_EXPLORER,
        rpcUrl: this.HOODI_RPC_URL
      };
    } catch (error) {
      console.error('Failed to get Hoodi network info:', error);
      throw error;
    }
  }

  /**
   * Deploy security trap contract to Hoodi testnet
   */
  async deploySecurityTrap(
    userId: string,
    templateId: string,
    constructorArgs: any[] = [],
    network: number = this.HOODI_CHAIN_ID
  ): Promise<DeploymentResult> {
    try {
      // Validate network is Hoodi testnet
      if (network !== this.HOODI_CHAIN_ID) {
        throw new Error(`Only Hoodi testnet (${this.HOODI_CHAIN_ID}) is supported. Got: ${network}`);
      }

      console.log(`🔨 Deploying security trap to Hoodi testnet...`);
      console.log(`👤 User: ${userId}`);
      console.log(`📋 Template: ${templateId}`);
      console.log(`🔧 Constructor Args: ${JSON.stringify(constructorArgs)}`);

      // Get template from database
      const template = await this.getTrapTemplate(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // Get user's wallet (this would come from your auth system)
      const userWallet = await this.getUserWallet(userId);
      if (!userWallet) {
        throw new Error(`User ${userId} wallet not found`);
      }

      // Create contract factory
      const contractFactory = new ethers.ContractFactory(
        template.abi,
        template.bytecode,
        userWallet
      );

      // Deploy contract
      console.log('📝 Deploying contract...');
      const contract = await contractFactory.deploy(...constructorArgs);
      
      // Wait for deployment
      console.log('⏳ Waiting for deployment confirmation...');
      const deploymentReceipt = await contract.waitForDeployment();
      
      // Get deployment details
      const contractAddress = await contract.getAddress();
      const deploymentTx = contract.deploymentTransaction();
      const transactionHash = deploymentTx?.hash || '';
      const blockNumber = 0; // We'll get this from the transaction receipt later
      const gasUsed = '0'; // We'll get this from the transaction receipt later
      
      // Calculate actual cost
      const gasPrice = await this.hoodiProvider.getFeeData();
      const actualCost = this.calculateDeploymentCost(gasUsed, gasPrice.gasPrice || BigInt(0));

      console.log(`✅ Contract deployed successfully!`);
      console.log(`📍 Address: ${contractAddress}`);
      console.log(`🔗 Transaction: ${transactionHash}`);
      console.log(`💰 Cost: ${actualCost} ${this.HOODI_NATIVE_CURRENCY}`);

      // Save deployment to database
      await this.saveDeployment({
        userId,
        templateId,
        contractAddress,
        transactionHash,
        network,
        gasUsed,
        cost: actualCost,
        blockNumber
      });

      // Send success notification
      await this.notification.sendNotification(userId, {
        type: 'success',
        title: 'Security Trap Deployed!',
        message: `Your ${template.name} has been deployed to Hoodi testnet at ${contractAddress}`,
        userId,
        data: {
          contractAddress,
          transactionHash,
          cost: actualCost,
          network: this.HOODI_CHAIN_ID
        }
      });

      return {
        contractAddress,
        transactionHash,
        actualCost,
        gasUsed: parseInt(gasUsed),
        blockNumber
      };

    } catch (error) {
      console.error('❌ Security trap deployment failed:', error);
      
      // Send failure notification
      await this.notification.sendNotification(userId, {
        type: 'error',
        title: 'Deployment Failed',
        message: `Failed to deploy ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        userId,
        data: {
          templateId,
          error: error instanceof Error ? error.message : 'Unknown error',
          network: this.HOODI_CHAIN_ID
        }
      });
      
      throw error;
    }
  }

  /**
   * Analyze contract on Hoodi testnet
   */
  async analyzeContract(contractAddress: string, chainId: number = this.HOODI_CHAIN_ID): Promise<ContractAnalysis> {
    try {
      // Validate network is Hoodi testnet
      if (chainId !== this.HOODI_CHAIN_ID) {
        throw new Error(`Only Hoodi testnet (${this.HOODI_CHAIN_ID}) is supported. Got: ${chainId}`);
      }

      console.log(`🔍 Analyzing contract ${contractAddress} on Hoodi testnet...`);

      // Get contract code
      const code = await this.hoodiProvider.getCode(contractAddress);
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

      if (code.includes('tx.origin')) {
        vulnerabilities.push('Uses tx.origin - potential phishing vulnerability');
        riskScore += 35;
        recommendations.push('Replace tx.origin with msg.sender');
      }

      if (code.includes('block.number') || code.includes('block.timestamp')) {
        vulnerabilities.push('Uses block data - can be manipulated by miners');
        riskScore += 20;
        recommendations.push('Be cautious with block data usage');
      }

      // Check for good practices
      if (code.includes('require(') || code.includes('revert(')) {
        recommendations.push('Good: Uses require/revert for input validation');
        riskScore = Math.max(0, riskScore - 10);
      }

      if (code.includes('modifier')) {
        recommendations.push('Good: Uses modifiers for access control');
        riskScore = Math.max(0, riskScore - 5);
      }

      // Normalize risk score to 0-100
      riskScore = Math.min(100, Math.max(0, riskScore));

      const analysis: ContractAnalysis = {
        contractAddress,
        chainId,
        riskScore,
        vulnerabilities,
        recommendations,
        analysisTimestamp: new Date()
      };

      console.log(`✅ Contract analysis completed`);
      console.log(`⚠️ Risk Score: ${riskScore}/100`);
      console.log(`🚨 Vulnerabilities found: ${vulnerabilities.length}`);
      console.log(`💡 Recommendations: ${recommendations.length}`);

      return analysis;

    } catch (error) {
      console.error('❌ Contract analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get contract balance on Hoodi testnet
   */
  async getContractBalance(contractAddress: string): Promise<string> {
    try {
      const balance = await this.hoodiProvider.getBalance(contractAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get contract balance:', error);
      throw error;
    }
  }

  /**
   * Get transaction details from Hoodi testnet
   */
  async getTransactionDetails(txHash: string): Promise<any> {
    try {
      const tx = await this.hoodiProvider.getTransaction(txHash);
      const receipt = await this.hoodiProvider.getTransactionReceipt(txHash);
      
      if (!tx || !receipt) {
        throw new Error('Transaction not found');
      }

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value || 0),
        gasPrice: tx.gasPrice?.toString() || '0',
        gasLimit: tx.gasLimit?.toString() || '0',
        gasUsed: receipt.gasUsed?.toString() || '0',
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'success' : 'failed',
        logs: receipt.logs
      };
    } catch (error) {
      console.error('Failed to get transaction details:', error);
      throw error;
    }
  }

  /**
   * Get Hoodi testnet gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const feeData = await this.hoodiProvider.getFeeData();
      return feeData.gasPrice?.toString() || '0';
    } catch (error) {
      console.error('Failed to get gas price:', error);
      throw error;
    }
  }

  /**
   * Estimate deployment cost for a contract
   */
  async estimateDeploymentCost(templateId: string, constructorArgs: any[] = []): Promise<string> {
    try {
      const template = await this.getTrapTemplate(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // Create contract factory for estimation
      const contractFactory = new ethers.ContractFactory(
        template.abi,
        template.bytecode,
        this.hoodiProvider
      );

      // Estimate gas (using a different approach for compatibility)
      const gasEstimate = await this.hoodiProvider.estimateGas({
        data: template.bytecode,
        value: 0
      });
      
      // Get current gas price
      const gasPrice = await this.getGasPrice();
      
      // Calculate cost
      const cost = this.calculateDeploymentCost(gasEstimate.toString(), gasPrice);
      
      return cost;
    } catch (error) {
      console.error('Failed to estimate deployment cost:', error);
      throw error;
    }
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  private async getTrapTemplate(templateId: string): Promise<any> {
    try {
      const result = await this.db.getSupabase()
        .from('trap_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      console.error('Failed to get trap template:', error);
      return null;
    }
  }

  private async getUserWallet(userId: string): Promise<ethers.Wallet | null> {
    try {
      // This is a placeholder - you'll need to implement based on your auth system
      // For now, we'll use a test wallet (you should replace this with real user wallet management)
      const testPrivateKey = process.env.TEST_WALLET_PRIVATE_KEY;
      if (!testPrivateKey) {
        throw new Error('TEST_WALLET_PRIVATE_KEY not configured');
      }
      
      return new ethers.Wallet(testPrivateKey, this.hoodiProvider);
    } catch (error) {
      console.error('Failed to get user wallet:', error);
      return null;
    }
  }

  private async saveDeployment(deploymentData: any): Promise<void> {
    try {
      const result = await this.db.getSupabase()
        .from('deployed_traps')
        .insert({
          user_id: deploymentData.userId,
          template_id: deploymentData.templateId,
          contract_address: deploymentData.contractAddress,
          transaction_hash: deploymentData.transactionHash,
          network: deploymentData.network,
          gas_used: deploymentData.gasUsed,
          cost: deploymentData.cost,
          block_number: deploymentData.blockNumber,
          status: 'active',
          deployed_at: new Date()
        });

      if (result.error) throw result.error;
      console.log('✅ Deployment saved to database');
    } catch (error) {
      console.error('Failed to save deployment:', error);
      // Don't throw here - deployment succeeded even if save failed
    }
  }

  private calculateDeploymentCost(gasUsed: string, gasPrice: string | bigint): string {
    try {
      const gasUsedBigInt = BigInt(gasUsed);
      const gasPriceBigInt = typeof gasPrice === 'string' ? BigInt(gasPrice) : gasPrice;
      const totalWei = gasUsedBigInt * gasPriceBigInt;
      const totalEth = ethers.formatEther(totalWei);
      
      // Format to 6 decimal places
      return parseFloat(totalEth).toFixed(6);
    } catch (error) {
      console.error('Failed to calculate deployment cost:', error);
      return '0.000000';
    }
  }

  // =====================================================
  // DEPRECATED METHODS (for backward compatibility)
  // =====================================================

  /**
   * @deprecated Use getHoodiProvider() instead
   */
  getProvider(chainId: number): ethers.Provider | null {
    if (chainId === this.HOODI_CHAIN_ID) {
      return this.hoodiProvider;
    }
    console.warn(`⚠️ Chain ID ${chainId} not supported. Only Hoodi testnet (${this.HOODI_CHAIN_ID}) is supported.`);
    return null;
  }

  /**
   * @deprecated Use getHoodiNetworkInfo() instead
   */
  async initializeProviders(): Promise<void> {
    console.warn('⚠️ initializeProviders() is deprecated. Use initialize() instead.');
    await this.initialize();
  }
}