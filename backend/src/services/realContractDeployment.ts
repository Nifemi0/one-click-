import { ethers } from 'ethers';
import { ContractCompilationService, CompiledContract } from './contractCompilation';
import { DatabaseService } from './database';
import { NotificationService } from './notification';

export interface RealDeploymentRequest {
  userId: string;
  contractName: string;
  constructorArgs: any[];
  network: number;
  customName?: string;
  customDescription?: string;
}

export interface RealDeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  gasUsed?: string;
  deploymentCost?: string;
  error?: string;
  contractName: string;
  network: number;
}

/**
 * @title RealContractDeploymentService
 * @dev Service for deploying real compiled Solidity contracts
 * @dev Replaces the fallback contract system with actual blockchain deployments
 */
export class RealContractDeploymentService {
  private db: DatabaseService;
  private notification: NotificationService;
  private compilation: ContractCompilationService;
  private provider: ethers.JsonRpcProvider | null = null;
  private deployerWallet: ethers.Wallet | null = null;

  constructor(
    db: DatabaseService,
    notification: NotificationService,
    compilation: ContractCompilationService
  ) {
    this.db = db;
    this.notification = notification;
    this.compilation = compilation;
    this.initializeProvider();
  }

  /**
   * @dev Initialize blockchain provider and deployer wallet
   */
  private async initializeProvider() {
    try {
      // Initialize provider for Hoodi testnet
      const rpcUrl = process.env.HOODI_RPC_URL || 'https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Initialize deployer wallet
      const privateKey = process.env.TEST_WALLET_PRIVATE_KEY;
      if (privateKey) {
        this.deployerWallet = new ethers.Wallet(privateKey, this.provider);
        console.log('🔑 Real contract deployment wallet initialized:', this.deployerWallet.address);
      } else {
        console.warn('⚠️ No TEST_WALLET_PRIVATE_KEY found, real deployments will be limited');
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize real contract deployment service:', error);
    }
  }

  /**
   * @dev Deploy a real compiled contract
   */
  async deployRealContract(request: RealDeploymentRequest): Promise<RealDeploymentResult> {
    try {
      console.log(`🚀 Starting REAL contract deployment: ${request.contractName}`);
      console.log(`👤 User: ${request.userId}`);
      console.log(`🌐 Network: ${request.network}`);
      console.log(`🔧 Constructor Args: ${JSON.stringify(request.constructorArgs)}`);

      // Validate network
      if (request.network !== 560048) { // Hoodi testnet
        throw new Error(`Only Hoodi testnet (560048) is supported for real deployments. Got: ${request.network}`);
      }

      // Check if service is initialized
      if (!this.provider || !this.deployerWallet) {
        throw new Error('Real contract deployment service not initialized');
      }

      // Compile the contract
      console.log('🔨 Compiling contract...');
      const compiledContract = await this.compilation.compileContract(request.contractName);
      
      if (!compiledContract) {
        throw new Error(`Failed to compile contract: ${request.contractName}`);
      }

      console.log('✅ Contract compiled successfully');

      // Create contract factory
      const contractFactory = new ethers.ContractFactory(
        compiledContract.abi,
        compiledContract.bytecode,
        this.deployerWallet
      );

      // Deploy contract
      console.log('📝 Deploying contract to blockchain...');
      const contract = await contractFactory.deploy(...request.constructorArgs);
      
      // Wait for deployment
      console.log('⏳ Waiting for deployment confirmation...');
      const deploymentReceipt = await contract.waitForDeployment();
      
      // Get deployment details
      const contractAddress = await contract.getAddress();
      const deploymentTx = contract.deploymentTransaction();
      const transactionHash = deploymentTx?.hash || '';
      
      // Get gas information from the deployment transaction
      const gasUsed = deploymentTx?.gasLimit?.toString() || '0';
      
      // Calculate deployment cost (estimate)
      const gasPrice = deploymentTx?.gasPrice || ethers.parseUnits('0.000000001', 'gwei');
      const deploymentCost = ethers.formatEther(BigInt(gasUsed) * gasPrice);

      console.log('✅ Real contract deployed successfully!');
      console.log('📍 Contract Address:', contractAddress);
      console.log('🔗 Transaction Hash:', transactionHash);
      console.log('⛽ Gas Used:', gasUsed);
      console.log('💰 Deployment Cost:', deploymentCost);

      // Save deployment to database
      await this.saveRealDeployment(request, contractAddress, transactionHash, gasUsed, deploymentCost);

      // Send success notification
      await this.notification.sendNotification(request.userId, {
        type: 'success',
        title: 'Real Contract Deployed Successfully!',
        message: `Your ${request.contractName} contract has been deployed to the blockchain at ${contractAddress}`,
        userId: request.userId,
        data: {
          contractAddress,
          transactionHash,
          gasUsed,
          deploymentCost,
          contractName: request.contractName,
          network: request.network
        }
      });

      return {
        success: true,
        contractAddress,
        transactionHash,
        gasUsed,
        deploymentCost,
        contractName: request.contractName,
        network: request.network
      };

    } catch (error: any) {
      console.error('❌ Real contract deployment failed:', error);
      
      // Send error notification
      await this.notification.sendNotification(request.userId, {
        type: 'error',
        title: 'Real Contract Deployment Failed',
        message: `Failed to deploy your ${request.contractName} contract: ${error.message}`,
        userId: request.userId,
        data: {
          contractName: request.contractName,
          network: request.network,
          error: error.message
        }
      });

      return {
        success: false,
        error: error.message || 'Deployment failed',
        contractName: request.contractName,
        network: request.network
      };
    }
  }

  /**
   * @dev Deploy multiple contracts in sequence
   */
  async deployMultipleContracts(
    userId: string,
    deployments: Array<{ contractName: string; constructorArgs: any[] }>,
    network: number
  ): Promise<RealDeploymentResult[]> {
    const results: RealDeploymentResult[] = [];
    
    for (const deployment of deployments) {
      console.log(`🚀 Deploying ${deployment.contractName}...`);
      
      const result = await this.deployRealContract({
        userId,
        contractName: deployment.contractName,
        constructorArgs: deployment.constructorArgs,
        network
      });
      
      results.push(result);
      
      if (!result.success) {
        console.error(`❌ Failed to deploy ${deployment.contractName}, stopping sequence`);
        break;
      }
      
      // Wait a bit between deployments to avoid nonce issues
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  }

  /**
   * @dev Verify contract on block explorer (if supported)
   */
  async verifyContract(
    contractAddress: string,
    contractName: string,
    constructorArgs: any[],
    network: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔍 Verifying contract ${contractName} at ${contractAddress}...`);
      
      // This would integrate with block explorer verification APIs
      // For now, we'll just log the verification attempt
      console.log('📋 Verification data:', {
        contractAddress,
        contractName,
        constructorArgs,
        network
      });
      
      return { success: true };
      
    } catch (error: any) {
      console.error('❌ Contract verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * @dev Get deployment status and details
   */
  async getDeploymentStatus(transactionHash: string): Promise<{
    confirmed: boolean;
    blockNumber?: number;
    gasUsed?: string;
    status?: string;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (!receipt) {
        return { confirmed: false };
      }

      return {
        confirmed: true,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      };
      
    } catch (error: any) {
      console.error('❌ Failed to get deployment status:', error);
      return { confirmed: false };
    }
  }

  /**
   * @dev Save real deployment to database
   */
  private async saveRealDeployment(
    request: RealDeploymentRequest,
    contractAddress: string,
    transactionHash: string,
    gasUsed: string,
    deploymentCost: string
  ): Promise<void> {
    try {
      // Save to basic_traps table
      const trapData = {
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: request.userId,
        trap_type: request.contractName.toLowerCase(),
        trap_name: request.customName || request.contractName,
        description: request.customDescription || `Real ${request.contractName} contract deployment`,
        contract_address: contractAddress,
        deployment_tx_hash: transactionHash,
        network: request.network,
        status: 'deployed',
        estimated_cost: '0', // We don't have this for real deployments
        actual_cost: deploymentCost,
        metadata: {
          deployment_type: 'real',
          gas_used: gasUsed,
          constructor_args: request.constructorArgs,
          compilation_info: {
            compiler_version: '0.8.19',
            optimization: true,
            runs: 200
          }
        }
      };

      await this.db.query('INSERT INTO basic_traps (id, user_id, trap_type, trap_name, description, contract_address, deployment_tx_hash, network, status, estimated_cost, actual_cost, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [
        trapData.id,
        trapData.user_id,
        trapData.trap_type,
        trapData.trap_name,
        trapData.description,
        trapData.contract_address,
        trapData.deployment_tx_hash,
        trapData.network,
        trapData.status,
        trapData.estimated_cost,
        trapData.actual_cost,
        JSON.stringify(trapData.metadata)
      ]);
      console.log('💾 Real deployment saved to database');

    } catch (error) {
      console.error('❌ Failed to save real deployment to database:', error);
    }
  }

  /**
   * @dev Check if the service is properly initialized
   */
  isInitialized(): boolean {
    return !!(this.provider && this.deployerWallet);
  }

  /**
   * @dev Get service status
   */
  getStatus() {
    return {
      initialized: this.isInitialized(),
      providerConnected: !!this.provider,
      deployerWallet: !!this.deployerWallet,
      deployerAddress: this.deployerWallet?.address || null,
      compilationService: !!this.compilation
    };
  }
}
