import { DatabaseService } from './database';
import { BlockchainService } from './blockchain';
import { NotificationService } from './notification';
import { ContractCompilationService } from './contractCompilation';
import { RealContractDeploymentService } from './realContractDeployment';

export interface BasicTrapRequest {
  userId: string;
  trapType: 'honeypot' | 'sandbox' | 'monitoring' | 'basic';
  network: number;
  customName?: string;
  customDescription?: string;
}

export interface BasicTrap {
  id: string;
  userId: string;
  trapType: string;
  trapName: string;
  description: string;
  contractAddress: string;
  deploymentTxHash: string;
  network: number;
  status: 'deploying' | 'deployed' | 'failed';
  estimatedCost: string;
  actualCost?: string;
  createdAt: Date;
  deployedAt?: Date;
  metadata: any;
}

export interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  type: 'honeypot' | 'sandbox' | 'monitoring' | 'basic';
  complexity: 'basic' | 'medium' | 'advanced';
  estimatedCost: number;
  estimatedGas: number;
  features: string[];
  abi: any[];
  bytecode: string;
  sourceCode: string;
  optimizerRuns: number;
}

export interface DeploymentResult {
  address: string;
  txHash: string;
  cost: string;
}

export class BasicTrapDeploymentService {
  private db: DatabaseService;
  private blockchain: BlockchainService;
  private notification: NotificationService;
  private compilation: ContractCompilationService;
  private realDeployment: RealContractDeploymentService;

  constructor(
    db: DatabaseService, 
    blockchain: BlockchainService, 
    notification: NotificationService
  ) {
    this.db = db;
    this.blockchain = blockchain;
    this.notification = notification;
    this.compilation = new ContractCompilationService();
    this.realDeployment = new RealContractDeploymentService(db, notification, this.compilation);
  }

  /**
   * Get available trap templates (now using real compiled contracts)
   */
  async getTrapTemplates(): Promise<TrapTemplate[]> {
    try {
      // Get available compiled contracts
      const availableContracts = await this.compilation.getAvailableContracts();
      
      // Map to trap templates
      const templates: TrapTemplate[] = [];
      
      for (const contractName of availableContracts) {
        // Get contract artifacts
        const artifacts = await this.compilation.getContractArtifacts(contractName);
        if (artifacts) {
                  const template: TrapTemplate = {
          id: contractName.toLowerCase(),
          name: this.formatContractName(contractName),
          description: this.getContractDescription(contractName),
          type: this.mapContractType(contractName) as 'honeypot' | 'sandbox' | 'monitoring' | 'basic',
          complexity: this.getContractComplexity(contractName) as 'basic' | 'medium' | 'advanced',
          estimatedCost: this.estimateDeploymentCost(contractName),
          estimatedGas: this.estimateGasUsage(contractName),
          features: this.getContractFeatures(contractName),
          abi: artifacts.abi,
          bytecode: artifacts.bytecode,
          sourceCode: '',
          optimizerRuns: 200
        };
          templates.push(template);
        }
      }
      
      // If no compiled contracts available, return basic templates
      if (templates.length === 0) {
        console.warn('No compiled contracts available, falling back to basic templates');
        return this.getBasicTemplates();
      }
      
      return templates;
    } catch (error) {
      console.error('Failed to get real contract templates:', error);
      console.warn('Falling back to basic templates');
      return this.getBasicTemplates();
    }
  }

  /**
   * Get basic fallback templates (kept for emergency fallback)
   */
  private getBasicTemplates(): TrapTemplate[] {
    return [
      {
        id: 'honeypot',
        name: 'Honeypot Trap',
        description: 'Advanced honeypot that lures attackers and captures their funds',
        type: 'honeypot',
        complexity: 'advanced',
        estimatedCost: 0.002,
        estimatedGas: 800000,
        features: ['Fund Capture', 'Attack Detection', 'Whitelist Management', 'Blacklist System'],
        abi: [],
        bytecode: '',
        sourceCode: '',
        optimizerRuns: 200
      },
      {
        id: 'sandbox',
        name: 'Sandbox Trap',
        description: 'Isolated environment for testing suspicious contracts safely',
        type: 'sandbox',
        complexity: 'medium',
        estimatedCost: 0.0015,
        estimatedGas: 600000,
        features: ['Isolation', 'Safe Testing', 'Resource Limits', 'Access Control'],
        abi: [],
        bytecode: '',
        sourceCode: '',
        optimizerRuns: 200
      },
      {
        id: 'monitoring',
        name: 'Monitoring Trap',
        description: 'Passive monitoring system for detecting malicious activities',
        type: 'monitoring',
        complexity: 'basic',
        estimatedCost: 0.001,
        estimatedGas: 400000,
        features: ['Activity Monitoring', 'Alert System', 'Logging', 'Threshold Detection'],
        abi: [],
        bytecode: '',
        sourceCode: '',
        optimizerRuns: 200
      },
      {
        id: 'basic',
        name: 'Basic Security Trap',
        description: 'Simple security trap with basic protection mechanisms',
        type: 'basic',
        complexity: 'basic',
        estimatedCost: 0.0008,
        estimatedGas: 300000,
        features: ['Basic Protection', 'Access Control', 'Emergency Stop', 'Simple Monitoring'],
        abi: [],
        bytecode: '',
        sourceCode: '',
        optimizerRuns: 200
      }
    ];
  }

  /**
   * Deploy basic trap with real compiled contracts
   */
  async deployBasicTrap(request: BasicTrapRequest): Promise<BasicTrap> {
    try {
      console.log(`🚀 Starting real contract deployment for user ${request.userId}`);
      
      // Get trap template
      const templates = await this.getTrapTemplates();
      const template = templates.find(t => t.type === request.trapType);
      if (!template) {
        throw new Error(`Invalid trap type: ${request.trapType}`);
      }

      // Create trap record
      const trap: BasicTrap = {
        id: `trap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: request.userId,
        trapType: request.trapType,
        trapName: request.customName || template.name,
        description: request.customDescription || template.description,
        contractAddress: '',
        deploymentTxHash: '',
        network: request.network,
        status: 'deploying',
        estimatedCost: template.estimatedCost.toString(),
        createdAt: new Date(),
        metadata: {
          template: template.id,
          features: template.features,
          complexity: template.complexity,
          estimatedGas: template.estimatedGas,
          useRealContract: true
        }
      };

      // Save to database
      await this.saveBasicTrap(trap);

      // Deploy real contract if available
      let deploymentResult;
      if (template.abi && template.bytecode && template.abi.length > 0) {
        console.log('🚀 Deploying real compiled contract...');
        deploymentResult = await this.deployRealContract(template, trap);
      } else {
        console.log('⚠️ No compiled contract available, using fallback...');
        deploymentResult = await this.deployFallbackContract(template, trap);
      }

      // Update trap with deployment info
      trap.contractAddress = deploymentResult.address;
      trap.deploymentTxHash = deploymentResult.txHash;
      trap.status = 'deployed';
      trap.deployedAt = new Date();
      trap.actualCost = deploymentResult.cost;

      // Update database
      await this.updateBasicTrap(trap);

      // Send notification
      await this.notification.sendNotification(request.userId, {
        type: 'success',
        title: 'Security Trap Deployed!',
        message: `Your ${trap.trapName} has been deployed successfully!`,
        userId: request.userId,
        data: {
          trapId: trap.id,
          contractAddress: trap.contractAddress,
          transactionHash: trap.deploymentTxHash,
          cost: trap.actualCost,
          network: trap.network,
          useRealContract: trap.metadata.useRealContract
        }
      });

      return trap;

    } catch (error) {
      console.error('❌ Basic trap deployment failed:', error);
      
      // Send failure notification
      await this.notification.sendNotification(request.userId, {
        type: 'error',
        title: 'Deployment Failed',
        message: `Failed to deploy ${request.trapType}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        userId: request.userId,
        data: {
          trapType: request.trapType,
          error: error instanceof Error ? error.message : 'Unknown error',
          network: request.network
        }
      });
      
      throw error;
    }
  }

  /**
   * Deploy real compiled contract
   */
  private async deployRealContract(template: TrapTemplate, trap: BasicTrap): Promise<DeploymentResult> {
    try {
      // Map template type to contract name
      const contractName = this.mapTemplateToContract(template.type);
      
      // Deploy using real contract service
      const deploymentRequest = {
        userId: trap.userId,
        contractName,
        constructorArgs: [],
        network: trap.network,
        customName: trap.trapName,
        customDescription: trap.description
      };

      const result = await this.realDeployment.deployRealContract(deploymentRequest);
      
      if (!result.success) {
        throw new Error(result.error || 'Real contract deployment failed');
      }

      return {
        address: result.contractAddress || '',
        txHash: result.transactionHash || '',
        cost: result.deploymentCost || '0'
      };

    } catch (error) {
      console.error('Real contract deployment failed:', error);
      throw error;
    }
  }

  /**
   * Deploy fallback contract (emergency fallback)
   */
  private async deployFallbackContract(template: TrapTemplate, trap: BasicTrap): Promise<DeploymentResult> {
    try {
      console.log('🔄 Using fallback deployment method...');
      
      // Use the existing blockchain service for fallback
      const deploymentResult = await this.blockchain.deploySecurityTrap(
        trap.userId,
        template.id,
        [],
        trap.network
      );

      return {
        address: deploymentResult.contractAddress,
        txHash: deploymentResult.transactionHash,
        cost: deploymentResult.actualCost
      };

    } catch (error) {
      console.error('Fallback deployment failed:', error);
      throw error;
    }
  }

  /**
   * Save basic trap to database
   */
  private async saveBasicTrap(trap: BasicTrap): Promise<void> {
    try {
      // Use REAL Supabase instead of fake SQL queries
      const result = await this.db.createBasicTrap({
        id: trap.id,
        user_id: trap.userId,
        trap_type: trap.trapType,
        trap_name: trap.trapName,
        description: trap.description || 'No description provided',
        contract_address: trap.contractAddress,
        deployment_tx_hash: trap.deploymentTxHash,
        network: trap.network,
        status: trap.status,
        estimated_cost: trap.estimatedCost,
        created_at: trap.createdAt,
        metadata: trap.metadata
      });

      console.log(`✅ Basic trap saved to database: ${trap.id}`);
    } catch (error) {
      console.error('Failed to save basic trap:', error);
      throw error;
    }
  }

  /**
   * Update basic trap in database
   */
  private async updateBasicTrap(trap: BasicTrap): Promise<void> {
    try {
      // Use REAL Supabase instead of fake SQL queries
      const result = await this.db.updateBasicTrap(trap.id, {
        contract_address: trap.contractAddress,
        deployment_tx_hash: trap.deploymentTxHash,
        status: trap.status,
        deployed_at: trap.deployedAt || null,
        actual_cost: trap.actualCost
      });

      console.log(`✅ Basic trap updated in database: ${trap.id}`);
    } catch (error) {
      console.error('Failed to update basic trap:', error);
      throw error;
    }
  }

  /**
   * Get user's basic traps
   */
  async getUserTraps(userId: string): Promise<BasicTrap[]> {
    try {
      // Use REAL Supabase instead of fake SQL queries
      const result = await this.db.getUserBasicTraps(userId);

      return result.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        trapType: row.trap_type,
        trapName: row.trap_name,
        description: row.description,
        contractAddress: row.contract_address,
        deploymentTxHash: row.deployment_tx_hash,
        network: row.network,
        status: row.status,
        estimatedCost: row.estimated_cost,
        actualCost: row.actual_cost,
        createdAt: new Date(row.created_at),
        deployedAt: row.deployed_at ? new Date(row.deployed_at) : undefined,
        metadata: row.metadata
      }));

    } catch (error) {
      console.error('Failed to get user traps:', error);
      return [];
    }
  }

  /**
   * Get trap by ID
   */
  async getTrapById(trapId: string): Promise<BasicTrap | null> {
    try {
      // Use REAL Supabase instead of fake SQL queries
      const result = await this.db.getBasicTrap(trapId);

      if (!result) return null;

      return {
        id: result.id,
        userId: result.user_id,
        trapType: result.trap_type,
        trapName: result.trap_name,
        description: result.description,
        contractAddress: result.contract_address,
        deploymentTxHash: result.deployment_tx_hash,
        network: result.network,
        status: result.status,
        estimatedCost: result.estimated_cost,
        actualCost: result.actual_cost,
        createdAt: new Date(result.created_at),
        deployedAt: result.deployed_at ? new Date(result.deployed_at) : undefined,
        metadata: result.metadata
      } as BasicTrap;

    } catch (error) {
      console.error('Failed to get trap by ID:', error);
      return null;
    }
  }

  /**
   * Map template type to contract name
   */
  private mapTemplateToContract(templateType: string): string {
    const contractMap: { [key: string]: string } = {
      'honeypot': 'AdvancedHoneypot',
      'sandbox': 'SecurityTrap',
      'monitoring': 'SecurityTrap',
      'basic': 'SecurityTrap'
    };
    
    return contractMap[templateType] || 'SecurityTrap';
  }

  /**
   * Format contract name for display
   */
  private formatContractName(contractName: string): string {
    return contractName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Get contract description
   */
  private getContractDescription(contractName: string): string {
    const descriptions: { [key: string]: string } = {
      'AdvancedHoneypot': 'Advanced honeypot trap with sophisticated attack detection and response mechanisms',
      'SecurityTrap': 'Versatile security trap supporting multiple protection strategies',
      'DroseraRegistry': 'Central registry for managing all deployed security traps',
      'FlashLoanDefender': 'Protection system against flash loan attacks',
      'MEVProtectionSuite': 'Comprehensive MEV protection mechanisms',
      'MultiSigVault': 'Multi-signature vault with enhanced security',
      'ReentrancyShield': 'Advanced reentrancy attack protection'
    };
    
    return descriptions[contractName] || 'Professional-grade security trap contract';
  }

  /**
   * Map contract to trap type
   */
  private mapContractType(contractName: string): string {
    const typeMap: { [key: string]: string } = {
      'AdvancedHoneypot': 'honeypot',
      'SecurityTrap': 'sandbox',
      'DroseraRegistry': 'basic',
      'FlashLoanDefender': 'monitoring',
      'MEVProtectionSuite': 'monitoring',
      'MultiSigVault': 'basic',
      'ReentrancyShield': 'monitoring'
    };
    
    return typeMap[contractName] || 'basic';
  }

  /**
   * Get contract complexity
   */
  private getContractComplexity(contractName: string): string {
    const complexityMap: { [key: string]: string } = {
      'AdvancedHoneypot': 'advanced',
      'SecurityTrap': 'medium',
      'DroseraRegistry': 'advanced',
      'FlashLoanDefender': 'advanced',
      'MEVProtectionSuite': 'advanced',
      'MultiSigVault': 'medium',
      'ReentrancyShield': 'advanced'
    };
    
    return complexityMap[contractName] || 'medium';
  }

  /**
   * Estimate deployment cost
   */
  private estimateDeploymentCost(contractName: string): number {
    const costMap: { [key: string]: number } = {
      'AdvancedHoneypot': 0.002,
      'SecurityTrap': 0.0015,
      'DroseraRegistry': 0.003,
      'FlashLoanDefender': 0.0025,
      'MEVProtectionSuite': 0.003,
      'MultiSigVault': 0.002,
      'ReentrancyShield': 0.002
    };
    
    return costMap[contractName] || 0.0015;
  }

  /**
   * Estimate gas usage
   */
  private estimateGasUsage(contractName: string): number {
    const gasMap: { [key: string]: number } = {
      'AdvancedHoneypot': 800000,
      'SecurityTrap': 600000,
      'DroseraRegistry': 1000000,
      'FlashLoanDefender': 900000,
      'MEVProtectionSuite': 1100000,
      'MultiSigVault': 700000,
      'ReentrancyShield': 850000
    };
    
    return gasMap[contractName] || 600000;
  }

  /**
   * Get contract features
   */
  private getContractFeatures(contractName: string): string[] {
    const featuresMap: { [key: string]: string[] } = {
      'AdvancedHoneypot': ['Fund Capture', 'Attack Detection', 'Whitelist Management', 'Blacklist System', 'Advanced Monitoring'],
      'SecurityTrap': ['Isolation', 'Safe Testing', 'Resource Limits', 'Access Control', 'Flexible Configuration'],
      'DroseraRegistry': ['Central Management', 'Trap Tracking', 'Metadata Storage', 'Access Control', 'Statistics'],
      'FlashLoanDefender': ['Flash Loan Detection', 'Attack Prevention', 'Real-time Monitoring', 'Emergency Response'],
      'MEVProtectionSuite': ['MEV Detection', 'Sandwich Attack Prevention', 'Gas Optimization', 'Transaction Protection'],
      'MultiSigVault': ['Multi-signature', 'Access Control', 'Fund Security', 'Emergency Recovery'],
      'ReentrancyShield': ['Reentrancy Prevention', 'State Protection', 'Attack Detection', 'Recovery Mechanisms']
    };
    
    return featuresMap[contractName] || ['Basic Protection', 'Access Control', 'Monitoring'];
  }
}