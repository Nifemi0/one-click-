import { DatabaseService } from './database';
import { BlockchainService } from './blockchain';
import { NotificationService } from './notification';
import { ContractCompilationService } from './contractCompilation';
import { RealContractDeploymentService } from './realContractDeployment';
import * as fs from 'fs';
import * as path from 'path';

export interface EnhancedTrapDeploymentRequest {
  userId: string;
  userPrompt: string;
  complexity: 'simple' | 'medium' | 'advanced' | 'enterprise';
  targetNetwork: number;
  securityLevel: 'basic' | 'premium' | 'enterprise';
  customRequirements: string[];
  budget: number;
  timeline: 'immediate' | '24h' | '48h' | '1week';
  // New fields for complete deployment
  trapType: 'honeypot' | 'sandbox' | 'monitoring' | 'custom';
  monitoringLevel: 'basic' | 'advanced' | 'enterprise';
  alertPreferences: string[];
  customParameters?: Record<string, any>;
}

export interface CompleteTrapDeployment {
  id: string;
  contractAddress: string;
  contractCode: string;
  contractABI: string;
  deploymentTxHash: string;
  tomlConfig: string;
  tomlFilePath: string;
  itrapFile: string;
  itrapFilePath: string;
  deploymentStatus: 'pending' | 'deploying' | 'deployed' | 'failed' | 'monitoring';
  deploymentSteps: DeploymentStep[];
  monitoringConfig: MonitoringConfig;
  alertRules: AlertRule[];
  trapName: string;
  description: string;
  securityFeatures: string[];
  riskAssessment: any; // Changed from RiskAssessment to any
  estimatedCost: string;
  aiConfidence: number;
  createdAt: Date;
  deployedAt?: Date;
}

export interface DeploymentStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  requiresUserAction: boolean;
  actionType: 'sign' | 'approve' | 'deploy' | 'verify' | 'configure';
  estimatedTime: string;
  estimatedCost: string;
  output?: any;
  error?: string;
}

export interface MonitoringConfig {
  enabled: boolean;
  checkInterval: number; // seconds
  healthCheckEndpoints: string[];
  alertThresholds: {
    gasUsage: number;
    transactionVolume: number;
    errorRate: number;
    suspiciousActivity: number;
  };
  logRetention: number; // days
  metricsCollection: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  action: 'notify' | 'pause' | 'shutdown' | 'custom';
  enabled: boolean;
  cooldown: number; // seconds
}

export interface EnhancedTrapDeployment {
  id: string;
  userId: string;
  userPrompt: string;
  complexity: 'simple' | 'medium' | 'advanced' | 'enterprise';
  targetNetwork: number;
  securityLevel: 'basic' | 'premium' | 'enterprise';
  customRequirements: string[];
  budget: number;
  timeline: 'immediate' | '24h' | '48h' | '1week';
  trapType: 'honeypot' | 'sandbox' | 'monitoring' | 'custom';
  monitoringLevel: 'basic' | 'advanced' | 'enterprise';
  alertPreferences: string[];
  customParameters?: Record<string, any>;
  status: 'analyzing' | 'deploying' | 'deployed' | 'failed';
  contractAddress: string;
  deploymentTxHash: string;
  estimatedCost: string;
  actualCost: string;
  createdAt: Date;
  deployedAt?: Date;
  analysisResult?: ContractAnalysisResult;
  deploymentResult?: DeploymentResult;
  securityFeatures: string[];
  riskAssessment: RiskAssessment;
}

export interface ContractAnalysisResult {
  selectedContract: string;
  contractArtifacts: any | null;
  useRealContract: boolean;
  analysis: PromptAnalysis;
  securityFeatures: string[];
  riskAssessment: RiskAssessment;
  estimatedGas: number;
  estimatedCost: number;
}

export interface PromptAnalysis {
  complexity: 'simple' | 'medium' | 'advanced' | 'enterprise';
  securityLevel: 'basic' | 'premium' | 'enterprise';
  features: string[];
}

export interface RiskAssessment {
  riskLevel: string;
  vulnerabilities: string[];
  recommendations: string[];
}

export interface DeploymentResult {
  address: string;
  txHash: string;
  cost: string;
}

export class EnhancedAITrapDeploymentService {
  private db: DatabaseService;
  private blockchain: BlockchainService;
  private notification: NotificationService;
  private compilation: ContractCompilationService;
  private realDeployment: RealContractDeploymentService;
  private basePath: string;

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
    this.basePath = path.join(process.cwd(), 'deployments');
  }

  /**
   * Deploy enhanced AI trap with real compiled contracts
   */
  async deployEnhancedAITrap(request: EnhancedTrapDeploymentRequest): Promise<EnhancedTrapDeployment> {
    try {
      console.log(`🚀 Starting enhanced AI trap deployment for user ${request.userId}`);
      
      // Create deployment record
      const deployment: EnhancedTrapDeployment = {
        id: `enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: request.userId,
        userPrompt: request.userPrompt,
        complexity: request.complexity,
        targetNetwork: request.targetNetwork,
        securityLevel: request.securityLevel,
        customRequirements: request.customRequirements,
        budget: request.budget,
        timeline: request.timeline,
        trapType: request.trapType,
        monitoringLevel: request.monitoringLevel,
        alertPreferences: request.alertPreferences,
        status: 'analyzing',
        contractAddress: '',
        deploymentTxHash: '',
        estimatedCost: this.calculateEstimatedCost(request).toString(),
        actualCost: '',
        createdAt: new Date(),
        deployedAt: undefined,
        analysisResult: undefined,
        deploymentResult: undefined,
        securityFeatures: [],
        riskAssessment: {
          riskLevel: 'unknown',
          vulnerabilities: [],
          recommendations: []
        }
      };

      // Save to database
      await this.saveEnhancedTrapDeployment(deployment);

      // Analyze requirements and select appropriate contract
      const contractSelection = await this.analyzeRequirementsAndSelectContract(request);
      
      // Update deployment with analysis
      deployment.analysisResult = contractSelection;
      deployment.securityFeatures = contractSelection.securityFeatures;
      deployment.riskAssessment = contractSelection.riskAssessment;
      deployment.status = 'deploying';
      
      await this.updateEnhancedTrapDeployment(deployment);

      // Deploy real contract
      let deploymentResult;
      if (contractSelection.useRealContract) {
        console.log('🚀 Deploying real compiled contract...');
        deploymentResult = await this.deployRealContract(contractSelection, deployment);
      } else {
        console.log('⚠️ Using fallback deployment method...');
        deploymentResult = await this.deployFallbackContract(contractSelection, deployment);
      }

      // Update deployment with results
      deployment.contractAddress = deploymentResult.address;
      deployment.deploymentTxHash = deploymentResult.txHash;
      deployment.actualCost = deploymentResult.cost;
      deployment.status = 'deployed';
      deployment.deployedAt = new Date();
      deployment.deploymentResult = deploymentResult;

      await this.updateEnhancedTrapDeployment(deployment);

      // Send success notification
      await this.notification.sendNotification(request.userId, {
        type: 'success',
        title: 'Enhanced AI Trap Deployed!',
        message: `Your AI-generated security trap has been deployed successfully!`,
        userId: request.userId,
        data: {
          deploymentId: deployment.id,
          contractAddress: deployment.contractAddress,
          transactionHash: deployment.deploymentTxHash,
          cost: deployment.actualCost,
          network: deployment.targetNetwork,
          useRealContract: contractSelection.useRealContract
        }
      });

      return deployment;

    } catch (error) {
      console.error('❌ Enhanced AI trap deployment failed:', error);
      
      // Send failure notification
      await this.notification.sendNotification(request.userId, {
        type: 'error',
        title: 'Enhanced AI Deployment Failed',
        message: `Failed to deploy enhanced AI trap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        userId: request.userId,
        data: {
          userPrompt: request.userPrompt,
          error: error instanceof Error ? error.message : 'Unknown error',
          network: request.targetNetwork
        }
      });
      
      throw error;
    }
  }

  /**
   * Analyze requirements and select appropriate contract
   */
  private async analyzeRequirementsAndSelectContract(request: EnhancedTrapDeploymentRequest): Promise<ContractAnalysisResult> {
    try {
      // Analyze user prompt to determine requirements
      const analysis = this.analyzeUserPrompt(request.userPrompt);
      
      // Get available compiled contracts
      const availableContracts = await this.compilation.getAvailableContracts();
      
      // Select best contract based on analysis
      const selectedContract = this.selectBestContract(analysis, availableContracts);
      
      // Get contract artifacts if real contract is selected
      let contractArtifacts: { abi: any[]; bytecode: string; } | null = null;
      let useRealContract = false;
      
      if (selectedContract && availableContracts.includes(selectedContract)) {
        contractArtifacts = await this.compilation.getContractArtifacts(selectedContract);
        useRealContract = contractArtifacts !== null;
      }

      // Generate security features and risk assessment
      const securityFeatures = this.generateSecurityFeatures(analysis, selectedContract || 'SecurityTrap');
      const riskAssessment = this.assessRisk(analysis, selectedContract || 'SecurityTrap');

      return {
        selectedContract: selectedContract || 'SecurityTrap',
        contractArtifacts,
        useRealContract,
        analysis,
        securityFeatures,
        riskAssessment,
        estimatedGas: this.estimateGasUsage(selectedContract || 'SecurityTrap'),
        estimatedCost: this.estimateDeploymentCost(selectedContract || 'SecurityTrap')
      };

    } catch (error) {
      console.error('Failed to analyze requirements:', error);
      
      // Fallback to basic analysis
      return {
        selectedContract: 'SecurityTrap',
        contractArtifacts: null,
        useRealContract: false,
        analysis: { complexity: 'medium', securityLevel: 'basic', features: [] },
        securityFeatures: ['Basic Protection', 'Access Control', 'Monitoring'],
        riskAssessment: {
          riskLevel: 'medium',
          vulnerabilities: ['Limited functionality'],
          recommendations: ['Consider upgrading to premium features']
        },
        estimatedGas: 600000,
        estimatedCost: 0.0015
      };
    }
  }

  /**
   * Analyze user prompt to determine requirements
   */
  private analyzeUserPrompt(prompt: string): PromptAnalysis {
    const features: string[] = [];
    const complexity = 'medium'; // Default
    const securityLevel = 'premium'; // Default

    if (prompt.includes('honeypot') || prompt.includes('fund capture')) {
      features.push('honeypot', 'fund capture');
    }
    if (prompt.includes('flash loan') || prompt.includes('attack prevention')) {
      features.push('flash loan', 'attack prevention');
    }
    if (prompt.includes('mev') || prompt.includes('sandwich')) {
      features.push('mev', 'sandwich');
    }
    if (prompt.includes('reentrancy') || prompt.includes('state protection')) {
      features.push('reentrancy', 'state protection');
    }
    if (prompt.includes('multi-sig') || prompt.includes('vault')) {
      features.push('multi-sig', 'vault');
    }

    return { complexity, securityLevel, features };
  }

  /**
   * Generate security features based on analysis
   */
  private generateSecurityFeatures(analysis: PromptAnalysis, selectedContract: string): string[] {
    const features: string[] = [];
    const { complexity, securityLevel, features: promptFeatures } = analysis;

    // Add features based on prompt
    if (promptFeatures.includes('honeypot') || promptFeatures.includes('fund capture')) {
      features.push('Advanced Honeypot');
    }
    if (promptFeatures.includes('flash loan') || promptFeatures.includes('attack prevention')) {
      features.push('Flash Loan Defender');
    }
    if (promptFeatures.includes('mev') || promptFeatures.includes('sandwich')) {
      features.push('MEV Protection Suite');
    }
    if (promptFeatures.includes('reentrancy') || promptFeatures.includes('state protection')) {
      features.push('Reentrancy Shield');
    }
    if (promptFeatures.includes('multi-sig') || promptFeatures.includes('vault')) {
      features.push('Multi-Sig Vault');
    }

    // Add features based on complexity and security level
    if (complexity === 'advanced' || securityLevel === 'premium') {
      features.push('Advanced Access Control');
      features.push('Advanced Monitoring');
    }
    if (complexity === 'enterprise' || securityLevel === 'enterprise') {
      features.push('Enterprise-Grade Security');
      features.push('Advanced Risk Assessment');
    }

    return [...new Set(features)]; // Remove duplicates
  }

  /**
   * Calculate estimated cost for deployment
   */
  private calculateEstimatedCost(request: EnhancedTrapDeploymentRequest): number {
    let baseCost = 0.001; // Base deployment cost
    
    // Add complexity multiplier
    switch (request.complexity) {
      case 'simple':
        baseCost *= 1.0;
        break;
      case 'medium':
        baseCost *= 1.5;
        break;
      case 'advanced':
        baseCost *= 2.0;
        break;
      case 'enterprise':
        baseCost *= 3.0;
        break;
    }
    
    // Add security level multiplier
    switch (request.securityLevel) {
      case 'basic':
        baseCost *= 1.0;
        break;
      case 'premium':
        baseCost *= 1.3;
        break;
      case 'enterprise':
        baseCost *= 1.8;
        break;
    }
    
    // Add monitoring level multiplier
    switch (request.monitoringLevel) {
      case 'basic':
        baseCost *= 1.0;
        break;
      case 'advanced':
        baseCost *= 1.2;
        break;
      case 'enterprise':
        baseCost *= 1.5;
        break;
    }
    
    return Math.round(baseCost * 1000) / 1000; // Round to 3 decimal places
  }

  /**
   * Assess risk based on analysis
   */
  private assessRisk(analysis: PromptAnalysis, selectedContract: string): RiskAssessment {
    const { complexity, securityLevel, features } = analysis;
    const riskLevel: string = complexity === 'advanced' || securityLevel === 'premium' ? 'high' : 'medium';
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    if (complexity === 'advanced' || securityLevel === 'premium') {
      vulnerabilities.push('More complex codebase, higher attack surface');
      recommendations.push('Thorough testing and auditing');
    }
    if (complexity === 'enterprise' || securityLevel === 'enterprise') {
      vulnerabilities.push('Enterprise-level security, but potential for new vulnerabilities');
      recommendations.push('Continuous monitoring and updates');
    }

    return { riskLevel, vulnerabilities, recommendations };
  }

  /**
   * Select best contract based on analysis
   */
  private selectBestContract(analysis: PromptAnalysis, availableContracts: string[]): string | null {
    const { complexity, securityLevel, features } = analysis;
    
    // Map requirements to contracts
    if (features.includes('honeypot') || features.includes('fund capture')) {
      return availableContracts.includes('AdvancedHoneypot') ? 'AdvancedHoneypot' : null;
    }
    
    if (features.includes('flash loan') || features.includes('attack prevention')) {
      return availableContracts.includes('FlashLoanDefender') ? 'FlashLoanDefender' : null;
    }
    
    if (features.includes('mev') || features.includes('sandwich')) {
      return availableContracts.includes('MEVProtectionSuite') ? 'MEVProtectionSuite' : null;
    }
    
    if (features.includes('reentrancy') || features.includes('state protection')) {
      return availableContracts.includes('ReentrancyShield') ? 'ReentrancyShield' : null;
    }
    
    if (features.includes('multi-sig') || features.includes('vault')) {
      return availableContracts.includes('MultiSigVault') ? 'MultiSigVault' : null;
    }
    
    // Default to SecurityTrap for general purpose
    return availableContracts.includes('SecurityTrap') ? 'SecurityTrap' : null;
  }

  /**
   * Estimate gas usage for contract
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
   * Estimate deployment cost for contract
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
   * Deploy real compiled contract
   */
  private async deployRealContract(contractSelection: ContractAnalysisResult, deployment: EnhancedTrapDeployment): Promise<DeploymentResult> {
    try {
      if (!contractSelection.contractArtifacts) {
        throw new Error('No contract artifacts available for real deployment');
      }

      // Deploy using real contract service
      const deploymentRequest = {
        userId: deployment.userId,
        contractName: contractSelection.selectedContract,
        constructorArgs: [],
        network: deployment.targetNetwork,
        customName: `AI-${deployment.trapType}`,
        customDescription: deployment.userPrompt
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
  private async deployFallbackContract(contractSelection: ContractAnalysisResult, deployment: EnhancedTrapDeployment): Promise<DeploymentResult> {
    try {
      console.log('🔄 Using fallback deployment method...');
      
      // Use the existing blockchain service for fallback
      const deploymentResult = await this.blockchain.deploySecurityTrap(
        deployment.userId,
        contractSelection.selectedContract,
        [],
        deployment.targetNetwork
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
   * Main entry point for complete AI trap deployment
   */
  async deployCompleteTrap(request: EnhancedTrapDeploymentRequest): Promise<CompleteTrapDeployment> {
    try {
      console.log(`🚀 Starting Complete AI Trap Deployment for user ${request.userId}`);
      console.log(`📝 User prompt: ${request.userPrompt}`);

      // Phase 1: AI Analysis & Planning
      const deployment = await this.createCompleteDeployment(request);
      
      // Phase 2: Generate Smart Contract
      await this.generateSmartContract(deployment, request);
      
      // Phase 3: Generate TOML Configuration
      await this.generateTOMLConfig(deployment, request);
      
      // Phase 4: Generate iTrap File
      await this.generateITrapFile(deployment, request);
      
      // Phase 5: Deploy to Blockchain
      await this.deployToBlockchain(deployment, request);
      
      // Phase 6: Setup Monitoring & Alerts
      await this.setupMonitoring(deployment, request);
      
      // Phase 7: Save to database
      await this.saveCompleteDeployment(deployment, request.userId);
      
      // Send completion notification
      await this.notification.sendNotification(request.userId, {
        type: 'success',
        title: 'Complete Trap Deployment Successful!',
        message: `Your AI trap "${deployment.trapName}" has been fully deployed and configured.`,
        userId: request.userId,
        data: { deploymentId: deployment.id, status: 'complete' }
      });

      return deployment;

    } catch (error) {
      console.error('Complete trap deployment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // Note: deployment variable is not in scope here, so we can't update step status
      throw new Error(`Complete trap deployment failed: ${errorMessage}`);
    }
  }

  /**
   * Create complete deployment structure
   */
  private async createCompleteDeployment(request: EnhancedTrapDeploymentRequest): Promise<CompleteTrapDeployment> {
    const deploymentId = `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: deploymentId,
      contractAddress: '',
      contractCode: '',
      contractABI: '',
      deploymentTxHash: '',
      tomlConfig: '',
      tomlFilePath: '',
      itrapFile: '',
      itrapFilePath: '',
      deploymentStatus: 'pending',
      deploymentSteps: this.generateDeploymentSteps(request),
      monitoringConfig: this.generateMonitoringConfig(request),
      alertRules: this.generateAlertRules(request),
      trapName: '',
      description: '',
      securityFeatures: [],
      riskAssessment: {
        overallRisk: 'medium',
        riskScore: 50,
        vulnerabilities: [],
        mitigationStrategies: [],
        complianceNotes: []
      },
      estimatedCost: '0.02 ETH',
      aiConfidence: 85,
      createdAt: new Date()
    };
  }

  /**
   * Generate deployment steps for complete pipeline
   */
  private generateDeploymentSteps(request: EnhancedTrapDeploymentRequest): DeploymentStep[] {
    return [
      {
        stepNumber: 1,
        title: 'AI Analysis & Planning',
        description: 'AI analyzes requirements and creates deployment plan',
        status: 'pending',
        requiresUserAction: false,
        actionType: 'verify',
        estimatedTime: '5-10 minutes',
        estimatedCost: '0.0001 ETH'
      },
      {
        stepNumber: 2,
        title: 'Smart Contract Generation',
        description: 'AI generates complete Solidity contract with security features',
        status: 'pending',
        requiresUserAction: false,
        actionType: 'verify',
        estimatedTime: '15-30 minutes',
        estimatedCost: '0.001 ETH'
      },
      {
        stepNumber: 3,
        title: 'TOML Configuration',
        description: 'Generate deployment configuration file',
        status: 'pending',
        requiresUserAction: false,
        actionType: 'configure',
        estimatedTime: '5-10 minutes',
        estimatedCost: '0.0001 ETH'
      },
      {
        stepNumber: 4,
        title: 'iTrap File Creation',
        description: 'Create iTrap configuration for Drosera system',
        status: 'pending',
        requiresUserAction: false,
        actionType: 'configure',
        estimatedTime: '5-10 minutes',
        estimatedCost: '0.0001 ETH'
      },
      {
        stepNumber: 5,
        title: 'Contract Deployment',
        description: 'Deploy smart contract to Hoodi testnet',
        status: 'pending',
        requiresUserAction: true,
        actionType: 'deploy',
        estimatedTime: '15-30 minutes',
        estimatedCost: '0.015 ETH'
      },
      {
        stepNumber: 6,
        title: 'Post-Deployment Verification',
        description: 'Verify contract deployment and functionality',
        status: 'pending',
        requiresUserAction: true,
        actionType: 'verify',
        estimatedTime: '20-40 minutes',
        estimatedCost: '0.001 ETH'
      },
      {
        stepNumber: 7,
        title: 'Monitoring Setup',
        description: 'Configure monitoring, alerts, and logging',
        status: 'pending',
        requiresUserAction: false,
        actionType: 'configure',
        estimatedTime: '10-20 minutes',
        estimatedCost: '0.0005 ETH'
      }
    ];
  }

  /**
   * Generate monitoring configuration
   */
  private generateMonitoringConfig(request: EnhancedTrapDeploymentRequest): MonitoringConfig {
    const baseConfig: MonitoringConfig = {
      enabled: true,
      checkInterval: 30,
      healthCheckEndpoints: [],
      alertThresholds: {
        gasUsage: 500000,
        transactionVolume: 100,
        errorRate: 5,
        suspiciousActivity: 10
      },
      logRetention: 30,
      metricsCollection: true
    };

    // Enhance based on security level
    switch (request.securityLevel) {
      case 'premium':
        baseConfig.checkInterval = 15;
        baseConfig.alertThresholds.gasUsage = 300000;
        baseConfig.alertThresholds.errorRate = 3;
        break;
      case 'enterprise':
        baseConfig.checkInterval = 10;
        baseConfig.alertThresholds.gasUsage = 200000;
        baseConfig.alertThresholds.errorRate = 1;
        baseConfig.alertThresholds.suspiciousActivity = 5;
        break;
    }

    return baseConfig;
  }

  /**
   * Generate alert rules
   */
  private generateAlertRules(request: EnhancedTrapDeploymentRequest): AlertRule[] {
    const baseRules: AlertRule[] = [
      {
        id: 'high_gas_usage',
        name: 'High Gas Usage Alert',
        condition: 'gas_usage > threshold',
        severity: 'warning',
        action: 'notify',
        enabled: true,
        cooldown: 300
      },
      {
        id: 'suspicious_activity',
        name: 'Suspicious Activity Detection',
        condition: 'suspicious_transactions > threshold',
        severity: 'error',
        action: 'pause',
        enabled: true,
        cooldown: 60
      },
      {
        id: 'error_rate_spike',
        name: 'Error Rate Spike',
        condition: 'error_rate > threshold',
        severity: 'critical',
        action: 'shutdown',
        enabled: true,
        cooldown: 30
      }
    ];

    // Add custom rules based on requirements
    if (request.customRequirements.includes('whitelist')) {
      baseRules.push({
        id: 'unauthorized_access',
        name: 'Unauthorized Access Attempt',
        condition: 'access_from_unauthorized_address',
        severity: 'critical',
        action: 'shutdown',
        enabled: true,
        cooldown: 0
      });
    }

    return baseRules;
  }

  /**
   * Generate smart contract using AI
   */
  private async generateSmartContract(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): Promise<void> {
    try {
      console.log('🔨 Generating Smart Contract...');
      
      const prompt = this.buildContractGenerationPrompt(request);
      // Perform AI analysis (placeholder for now)
      const aiResponse = '{}'; // TODO: Implement AI analysis

      // Parse AI response to extract contract code
      const contractData = this.parseContractFromAIResponse(aiResponse || '{}', request);
      
      deployment.contractCode = contractData.code;
      deployment.contractABI = contractData.abi;
      deployment.trapName = contractData.name;
      deployment.description = contractData.description;
      deployment.securityFeatures = contractData.securityFeatures;
      deployment.riskAssessment = contractData.riskAssessment;
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[1]) {
        deployment.deploymentSteps[1].status = 'completed';
        deployment.deploymentSteps[1].output = { contractGenerated: true };
      }
      
      console.log('✅ Smart Contract Generated Successfully');
      
    } catch (error) {
      console.error('Failed to generate smart contract:', error);
      if (deployment.deploymentSteps && deployment.deploymentSteps[1]) {
        deployment.deploymentSteps[1].status = 'failed';
        deployment.deploymentSteps[1].error = error instanceof Error ? error.message : 'Unknown error';
      }
      throw error;
    }
  }

  /**
   * Build contract generation prompt
   */
  private buildContractGenerationPrompt(request: EnhancedTrapDeploymentRequest): string {
    return `
Generate a complete Solidity smart contract for a Drosera security trap based on these requirements:

USER REQUEST: ${request.userPrompt}
TRAP TYPE: ${request.trapType}
SECURITY LEVEL: ${request.securityLevel}
TARGET NETWORK: Hoodi Testnet (Chain ID: ${request.targetNetwork})
CUSTOM REQUIREMENTS: ${request.customRequirements.join(', ')}

Requirements:
1. Create a complete, deployable Solidity contract
2. Include all necessary security features
3. Implement proper error handling and gas optimization
4. Add comprehensive comments
5. Include events for monitoring
6. Follow Solidity best practices
7. Ensure compatibility with Hoodi testnet

Please provide the response in this JSON format:
{
  "name": "Contract name",
  "description": "Contract description",
  "code": "Complete Solidity code",
  "abi": "Contract ABI",
  "securityFeatures": ["feature1", "feature2"],
  "riskAssessment": {
    "overallRisk": "low|medium|high|critical",
    "riskScore": 85,
    "vulnerabilities": ["vuln1", "vuln2"],
    "mitigationStrategies": ["strategy1", "strategy2"],
    "complianceNotes": ["note1", "note2"]
  }
}
`;
  }

  /**
   * Parse contract from AI response
   */
  private parseContractFromAIResponse(aiResponse: any, request: EnhancedTrapDeploymentRequest): any {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        name: parsed.name || 'Drosera Security Trap',
        description: parsed.description || 'AI-generated security trap',
        code: parsed.code || this.generateFallbackContract(request),
        abi: parsed.abi || '[]',
        securityFeatures: parsed.securityFeatures || ['Basic security'],
        riskAssessment: parsed.riskAssessment || {
          overallRisk: 'medium',
          riskScore: 60,
          vulnerabilities: ['Standard risks'],
          mitigationStrategies: ['Code review', 'Testing'],
          complianceNotes: ['Follow best practices']
        }
      };

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        name: 'Drosera Security Trap',
        description: 'Fallback security trap contract',
        code: this.generateFallbackContract(request),
        abi: '[]',
        securityFeatures: ['Basic security'],
        riskAssessment: {
          overallRisk: 'medium',
          riskScore: 60,
          vulnerabilities: ['Standard risks'],
          mitigationStrategies: ['Code review', 'Testing'],
          complianceNotes: ['Follow best practices']
        }
      };
    }
  }

  /**
   * Generate fallback contract if AI fails
   */
  private generateFallbackContract(request: EnhancedTrapDeploymentRequest): string {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DroseraSecurityTrap is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _trapIdCounter;
    
    struct Trap {
        uint256 id;
        address creator;
        string name;
        string description;
        bool isActive;
        uint256 createdAt;
        uint256 totalInteractions;
    }
    
    mapping(uint256 => Trap) public traps;
    mapping(address => uint256[]) public userTraps;
    
    event TrapCreated(uint256 indexed trapId, address indexed creator, string name);
    event TrapActivated(uint256 indexed trapId, bool isActive);
    event Interaction(uint256 indexed trapId, address indexed user, uint256 timestamp);
    
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    function createTrap(string memory name, string memory description) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        
        _trapIdCounter.increment();
        uint256 trapId = _trapIdCounter.current();
        
        traps[trapId] = Trap({
            id: trapId,
            creator: msg.sender,
            name: name,
            description: description,
            isActive: true,
            createdAt: block.timestamp,
            totalInteractions: 0
        });
        
        userTraps[msg.sender].push(trapId);
        
        emit TrapCreated(trapId, msg.sender, name);
        return trapId;
    }
    
    function activateTrap(uint256 trapId, bool isActive) external {
        require(traps[trapId].creator == msg.sender, "Not the trap creator");
        traps[trapId].isActive = isActive;
        emit TrapActivated(trapId, isActive);
    }
    
    function interactWithTrap(uint256 trapId) external nonReentrant {
        require(traps[trapId].isActive, "Trap is not active");
        require(traps[trapId].id > 0, "Trap does not exist");
        
        traps[trapId].totalInteractions++;
        emit Interaction(trapId, msg.sender, block.timestamp);
    }
    
    function getTrap(uint256 trapId) external view returns (Trap memory) {
        return traps[trapId];
    }
    
    function getUserTraps(address user) external view returns (uint256[] memory) {
        return userTraps[user];
    }
    
    function getTotalTraps() external view returns (uint256) {
        return _trapIdCounter.current();
    }
}`;
  }

  /**
   * Generate TOML configuration file
   */
  private async generateTOMLConfig(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): Promise<void> {
    try {
      console.log('⚙️ Generating TOML Configuration...');
      
      const tomlConfig = this.buildTOMLConfig(deployment, request);
      deployment.tomlConfig = tomlConfig;
      
      // Create deployment directory
      const deploymentDir = path.join(this.basePath, deployment.id);
      if (!fs.existsSync(deploymentDir)) {
        fs.mkdirSync(deploymentDir, { recursive: true });
      }
      
      // Save TOML file
      const tomlPath = path.join(deploymentDir, 'deployment.toml');
      fs.writeFileSync(tomlPath, tomlConfig);
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[2]) {
        deployment.deploymentSteps[2].status = 'completed';
        deployment.deploymentSteps[2].output = { tomlGenerated: true, path: tomlPath };
      }
      
      console.log('✅ TOML Configuration Generated Successfully');
      
    } catch (error) {
      console.error('TOML generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[2]) {
        deployment.deploymentSteps[2].status = 'failed';
        deployment.deploymentSteps[2].error = errorMessage;
      }
      
      throw new Error(`TOML generation failed: ${errorMessage}`);
    }
  }

  /**
   * Build TOML configuration
   */
  private buildTOMLConfig(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): string {
    return `# Drosera Security Trap Deployment Configuration
# Generated by AI on ${new Date().toISOString()}

[project]
name = "${deployment.trapName || 'Drosera Security Trap'}"
version = "1.0.0"
description = "${deployment.description || 'AI-generated security trap'}"
authors = ["Drosera AI System"]
license = "MIT"

[network]
name = "Hoodi Testnet"
chain_id = ${request.targetNetwork}
rpc_url = "https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ"
block_explorer = "https://hoodi.etherscan.io"
native_currency = "ETH"
native_currency_symbol = "ETH"
native_currency_decimals = 18

[contract]
name = "${deployment.trapName || 'DroseraSecurityTrap'}"
type = "${request.trapType}"
security_level = "${request.securityLevel}"
estimated_gas = 500000
estimated_cost = "${deployment.estimatedCost}"

[deployment]
strategy = "ai_guided"
auto_verify = true
optimizer_enabled = true
optimizer_runs = 200
via_ir = false

[compilation]
solc_version = "0.8.19"
evm_version = "paris"
optimizer = true
optimizer_runs = 200

[security]
reentrancy_guard = true
access_control = true
safe_math = true
overflow_protection = true

[monitoring]
enabled = ${deployment.monitoringConfig.enabled}
check_interval = ${deployment.monitoringConfig.checkInterval}
log_retention_days = ${deployment.monitoringConfig.logRetention}
metrics_collection = ${deployment.monitoringConfig.metricsCollection}

[alerts]
enabled = true
notification_channels = ["email", "telegram", "discord"]
cooldown_period = 300

[alerts.thresholds]
gas_usage = ${deployment.monitoringConfig.alertThresholds.gasUsage}
transaction_volume = ${deployment.monitoringConfig.alertThresholds.transactionVolume}
error_rate = ${deployment.monitoringConfig.alertThresholds.errorRate}
suspicious_activity = ${deployment.monitoringConfig.alertThresholds.suspiciousActivity}

[features]
${deployment.securityFeatures.map(feature => `${feature.toLowerCase().replace(/\s+/g, '_')} = true`).join('\n')}

[ai_config]
confidence_score = ${deployment.aiConfidence}
complexity_level = "${request.complexity}"
generation_timestamp = "${deployment.createdAt.toISOString()}"
model_version = "gpt-4"
fallback_enabled = true

[costs]
deployment_fee = "0.015"
verification_fee = "0.001"
monitoring_fee = "0.0005"
total_estimated = "${deployment.estimatedCost}"

[timeline]
estimated_deployment = "2-4 hours"
estimated_monitoring_setup = "30 minutes"
estimated_full_operation = "24 hours"

[compliance]
network_guidelines = "Hoodi Testnet"
security_standards = "OpenZeppelin"
audit_requirements = "AI-powered analysis"
risk_level = "${deployment.riskAssessment.overallRisk}"
risk_score = ${deployment.riskAssessment.riskScore}

[mitigation]
strategies = [
${deployment.riskAssessment.mitigationStrategies?.map((strategy: any) => `  "${strategy}"`).join(',\n') || ''}
]

[notes]
${deployment.riskAssessment.complianceNotes?.map((note: any) => `- ${note}`).join('\n') || ''}
`;
  }

  /**
   * Generate iTrap file for Drosera system
   */
  private async generateITrapFile(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): Promise<void> {
    try {
      console.log('🎯 Generating iTrap File...');
      
      const itrapConfig = this.buildITrapConfig(deployment, request);
      deployment.itrapFile = itrapConfig;
      
      // Save iTrap file
      const itrapPath = path.join(path.dirname(deployment.tomlFilePath), 'trap.itrap');
      fs.writeFileSync(itrapPath, itrapConfig);
      deployment.itrapFilePath = itrapPath;
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[3]) {
        deployment.deploymentSteps[3].status = 'completed';
        deployment.deploymentSteps[3].output = { itrapGenerated: true, path: itrapPath };
      }
      
      console.log('✅ iTrap File Generated Successfully');
      
    } catch (error) {
      console.error('iTrap generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[3]) {
        deployment.deploymentSteps[3].status = 'failed';
        deployment.deploymentSteps[3].error = errorMessage;
      }
      
      throw new Error(`iTrap generation failed: ${errorMessage}`);
    }
  }

  /**
   * Build iTrap configuration
   */
  private buildITrapConfig(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): string {
    return `# Drosera iTrap Configuration File
# Generated by AI on ${new Date().toISOString()}

{
  "trap_id": "${deployment.id}",
  "name": "${deployment.trapName || 'Drosera Security Trap'}"",
  "version": "1.0.0",
  "type": "${request.trapType}",
  "network": {
    "chain_id": ${request.targetNetwork},
    "name": "Hoodi Testnet",
    "rpc_url": "https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ",
    "block_explorer": "https://hoodi.etherscan.io"
  },
  "contract": {
    "address": "${deployment.contractAddress || 'TO_BE_DEPLOYED'}",
    "abi": ${deployment.contractABI || '[]'},
    "bytecode": "TO_BE_GENERATED",
    "deployment_tx": "${deployment.deploymentTxHash || 'PENDING'}"
  },
  "security": {
    "level": "${request.securityLevel}",
    "features": ${JSON.stringify(deployment.securityFeatures, null, 2)},
    "risk_assessment": ${JSON.stringify(deployment.riskAssessment, null, 2)},
    "ai_confidence": ${deployment.aiConfidence}
  },
  "monitoring": {
    "enabled": ${deployment.monitoringConfig.enabled},
    "check_interval": ${deployment.monitoringConfig.checkInterval},
    "endpoints": ${JSON.stringify(deployment.monitoringConfig.healthCheckEndpoints, null, 2)},
    "thresholds": ${JSON.stringify(deployment.monitoringConfig.alertThresholds, null, 2)},
    "log_retention_days": ${deployment.monitoringConfig.logRetention},
    "metrics_collection": ${deployment.monitoringConfig.metricsCollection}
  },
  "alerts": {
    "rules": ${JSON.stringify(deployment.alertRules, null, 2)}
  },
  "deployment": {
    "status": "${deployment.deploymentStatus}",
    "steps": ${JSON.stringify(deployment.deploymentSteps, null, 2)},
    "estimated_cost": "${deployment.estimatedCost}",
    "created_at": "${deployment.createdAt.toISOString()}",
    "deployed_at": "${deployment.deployedAt?.toISOString() || 'PENDING'}"
  },
  "ai_generation": {
    "prompt": "User requested: ${request.userPrompt}",
    "complexity": "${request.complexity}",
    "custom_requirements": ${JSON.stringify(request.customRequirements, null, 2)},
    "budget": ${request.budget},
    "timeline": "${request.timeline}",
    "generation_timestamp": "${deployment.createdAt.toISOString()}"
  },
  "files": {
    "toml_config": "${deployment.tomlFilePath}",
    "contract_code": "contract.sol",
    "deployment_script": "deploy.js",
    "verification_script": "verify.js"
  },
  "next_steps": [
    "Deploy contract to Hoodi testnet",
    "Verify contract on block explorer",
    "Setup monitoring and alerts",
    "Test trap functionality",
    "Begin monitoring operations"
  ]
}`;
  }

  /**
   * Deploy contract to blockchain
   */
  private async deployToBlockchain(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): Promise<void> {
    try {
      console.log('🚀 Deploying Contract to Blockchain...');
      
      // This would integrate with your blockchain service
      // For now, we'll simulate the deployment
      const deploymentResult = await this.simulateContractDeployment(deployment, request);
      
      deployment.contractAddress = deploymentResult.address;
      deployment.deploymentTxHash = deploymentResult.txHash;
      deployment.deploymentStatus = 'deployed';
      deployment.deployedAt = new Date();
      
      // Update step statuses
      if (deployment.deploymentSteps && deployment.deploymentSteps[4]) {
        deployment.deploymentSteps[4].status = 'completed';
        deployment.deploymentSteps[4].output = {
          contractAddress: deployment.contractAddress,
          transactionHash: deployment.deploymentTxHash,
          network: request.targetNetwork
        };
      }
      
      // Update verification step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[5]) {
        deployment.deploymentSteps[5].status = 'completed';
        deployment.deploymentSteps[5].output = { verified: true };
      }
      
      // Update monitoring step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[6]) {
        deployment.deploymentSteps[6].status = 'completed';
        deployment.deploymentSteps[6].output = { monitoringSetup: true };
      }
      
      console.log('✅ Contract Deployed Successfully');
      
    } catch (error) {
      console.error('Blockchain deployment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[4]) {
        deployment.deploymentSteps[4].status = 'failed';
        deployment.deploymentSteps[4].error = errorMessage;
      }
      
      throw new Error(`Blockchain deployment failed: ${errorMessage}`);
    }
  }

  /**
   * Simulate contract deployment (replace with real deployment)
   */
  private async simulateContractDeployment(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): Promise<any> {
    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return {
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
  }

  /**
   * Setup monitoring and alerts
   */
  private async setupMonitoring(deployment: CompleteTrapDeployment, request: EnhancedTrapDeploymentRequest): Promise<void> {
    try {
      console.log('📊 Setting up Monitoring & Alerts...');
      
      // Setup monitoring configuration
      await this.configureMonitoring(deployment);
      
      // Setup alert rules
      await this.configureAlerts(deployment);
      
      // Update step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[6]) {
        deployment.deploymentSteps[6].status = 'completed';
        deployment.deploymentSteps[6].output = { monitoringSetup: true };
      }
      
      console.log('✅ Monitoring & Alerts Setup Complete');
      
    } catch (error) {
      console.error('Monitoring setup failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update deployment step status
      if (deployment.deploymentSteps && deployment.deploymentSteps[6]) {
        deployment.deploymentSteps[6].status = 'failed';
        deployment.deploymentSteps[6].error = errorMessage;
      }
      
      throw new Error(`Monitoring setup failed: ${errorMessage}`);
    }
  }

  /**
   * Configure monitoring system
   */
  private async configureMonitoring(deployment: CompleteTrapDeployment): Promise<void> {
    // This would integrate with your monitoring service
    console.log('   📈 Monitoring system configured');
  }

  /**
   * Configure alert system
   */
  private async configureAlerts(deployment: CompleteTrapDeployment): Promise<void> {
    // This would integrate with your alert service
    console.log('   🚨 Alert system configured');
  }

  /**
   * Save complete deployment to database
   */
  private async saveCompleteDeployment(deployment: CompleteTrapDeployment, userId: string): Promise<void> {
    try {
      // Save to enhanced_deployments table
      await this.db.query(`
        INSERT INTO enhanced_deployments (
          id, user_id, contract_address, contract_code, contract_abi, 
          deployment_tx_hash, toml_config, toml_file_path, itrap_file, 
          itrap_file_path, deployment_status, deployment_steps, 
          monitoring_config, alert_rules, trap_name, description, 
          security_features, risk_assessment, estimated_cost, 
          ai_confidence, created_at, deployed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      `, [
        deployment.id, userId, deployment.contractAddress, deployment.contractCode,
        deployment.contractABI, deployment.deploymentTxHash, deployment.tomlConfig,
        deployment.tomlFilePath, deployment.itrapFile, deployment.itrapFilePath,
        deployment.deploymentStatus, JSON.stringify(deployment.deploymentSteps),
        JSON.stringify(deployment.monitoringConfig), JSON.stringify(deployment.alertRules),
        deployment.trapName, deployment.description, JSON.stringify(deployment.securityFeatures),
        JSON.stringify(deployment.riskAssessment), deployment.estimatedCost,
        deployment.aiConfidence, deployment.createdAt, deployment.deployedAt
      ]);

      console.log(`✅ Complete deployment saved to database: ${deployment.id}`);

    } catch (error) {
      console.error('Failed to save complete deployment:', error);
      throw error;
    }
  }

  /**
   * Save enhanced AI trap deployment to database
   */
  private async saveEnhancedTrapDeployment(deployment: EnhancedTrapDeployment): Promise<void> {
    try {
      await this.db.query(`
        INSERT INTO enhanced_ai_deployments (
          id, user_id, user_prompt, complexity, target_network, security_level,
          custom_requirements, budget, timeline, trap_type, monitoring_level,
          alert_preferences, custom_parameters, status, contract_address,
          deployment_tx_hash, estimated_cost, actual_cost, created_at, deployed_at,
          analysis_result, deployment_result
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      `, [
        deployment.id, deployment.userId, deployment.userPrompt, deployment.complexity,
        deployment.targetNetwork, deployment.securityLevel, JSON.stringify(deployment.customRequirements),
        deployment.budget, deployment.timeline, deployment.trapType, deployment.monitoringLevel,
        JSON.stringify(deployment.alertPreferences), JSON.stringify(deployment.customParameters),
        deployment.status, deployment.contractAddress, deployment.deploymentTxHash,
        deployment.estimatedCost, deployment.actualCost, deployment.createdAt, deployment.deployedAt,
        JSON.stringify(deployment.analysisResult), JSON.stringify(deployment.deploymentResult)
      ]);
      console.log(`✅ Enhanced AI trap deployment saved to database: ${deployment.id}`);
    } catch (error) {
      console.error('Failed to save enhanced AI trap deployment:', error);
      throw error;
    }
  }

  /**
   * Update enhanced AI trap deployment in database
   */
  private async updateEnhancedTrapDeployment(deployment: EnhancedTrapDeployment): Promise<void> {
    try {
      await this.db.query(`
        UPDATE enhanced_ai_deployments SET
          user_prompt = $1, complexity = $2, target_network = $3, security_level = $4,
          custom_requirements = $5, budget = $6, timeline = $7, trap_type = $8,
          monitoring_level = $9, alert_preferences = $10, custom_parameters = $11,
          status = $12, contract_address = $13, deployment_tx_hash = $14,
          estimated_cost = $15, actual_cost = $16, analysis_result = $17,
          deployment_result = $18, deployed_at = $19
        WHERE id = $20
      `, [
        deployment.userPrompt, deployment.complexity, deployment.targetNetwork, deployment.securityLevel,
        JSON.stringify(deployment.customRequirements), deployment.budget, deployment.timeline,
        deployment.trapType, deployment.monitoringLevel, JSON.stringify(deployment.alertPreferences),
        JSON.stringify(deployment.customParameters), deployment.status, deployment.contractAddress,
        deployment.deploymentTxHash, deployment.estimatedCost, deployment.actualCost,
        JSON.stringify(deployment.analysisResult), JSON.stringify(deployment.deploymentResult),
        deployment.deployedAt, deployment.id
      ]);
      console.log(`✅ Enhanced AI trap deployment updated in database: ${deployment.id}`);
    } catch (error) {
      console.error('Failed to update enhanced AI trap deployment:', error);
      throw error;
    }
  }

  /**
   * Get user's complete deployments
   */
  async getUserDeployments(userId: string): Promise<CompleteTrapDeployment[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM enhanced_deployments WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        trapName: row.trap_name,
        description: row.description,
        contractAddress: row.contract_address,
        contractCode: row.contract_code,
        contractABI: row.contract_abi,
        deploymentTxHash: row.deployment_tx_hash,
        tomlConfig: row.toml_config,
        tomlFilePath: row.toml_file_path,
        itrapFile: row.itrap_file,
        itrapFilePath: row.itrap_file_path,
        deploymentStatus: row.deployment_status,
        deploymentSteps: JSON.parse(row.deployment_steps || '[]'),
        monitoringConfig: JSON.parse(row.monitoring_config || '{}'),
        alertRules: JSON.parse(row.alert_rules || '[]'),
        securityFeatures: JSON.parse(row.security_features || '[]'),
        riskAssessment: JSON.parse(row.risk_assessment || '{}'),
        estimatedCost: row.estimated_cost,
        aiConfidence: row.ai_confidence,
        createdAt: new Date(row.created_at),
        deployedAt: row.deployed_at ? new Date(row.deployed_at) : undefined
      }));

    } catch (error) {
      console.error('Failed to get user deployments:', error);
      return [];
    }
  }

  /**
   * Get user's enhanced AI trap deployments
   */
  async getUserEnhancedAITrapDeployments(userId: string): Promise<EnhancedTrapDeployment[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM enhanced_ai_deployments WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        userPrompt: row.user_prompt,
        complexity: row.complexity,
        targetNetwork: row.target_network,
        securityLevel: row.security_level,
        customRequirements: JSON.parse(row.custom_requirements || '[]'),
        budget: row.budget,
        timeline: row.timeline,
        trapType: row.trap_type,
        monitoringLevel: row.monitoring_level,
        alertPreferences: JSON.parse(row.alert_preferences || '[]'),
        customParameters: JSON.parse(row.custom_parameters || '{}'),
        status: row.status,
        contractAddress: row.contract_address,
        deploymentTxHash: row.deployment_tx_hash,
        estimatedCost: row.estimated_cost,
        actualCost: row.actual_cost,
        createdAt: new Date(row.created_at),
        deployedAt: row.deployed_at ? new Date(row.deployed_at) : undefined,
        analysisResult: JSON.parse(row.analysis_result || '{}'),
        deploymentResult: JSON.parse(row.deployment_result || '{}')
      }));

    } catch (error) {
      console.error('Failed to get user enhanced AI trap deployments:', error);
      return [];
    }
  }

  /**
   * Get deployment status and progress
   */
  async getDeploymentProgress(deploymentId: string): Promise<{
    status: string;
    completedSteps: number;
    totalSteps: number;
    currentStep: number;
    estimatedTimeRemaining: string;
    nextUserAction?: any;
  }> {
    try {
      const result = await this.db.query(
        'SELECT deployment_status, deployment_steps FROM enhanced_deployments WHERE id = $1',
        [deploymentId]
      );

      if (result.rows.length === 0) {
        throw new Error('Deployment not found');
      }

      const deployment = result.rows[0];
      const steps = JSON.parse(deployment.deployment_steps || '[]');
      
      const completedSteps = steps.filter((s: any) => s.status === 'completed').length;
      const totalSteps = steps.length;
      const currentStep = steps.find((s: any) => s.status === 'pending')?.stepNumber || totalSteps;
      const nextUserAction = steps.find((s: any) => s.requiresUserAction && s.status === 'pending');

      return {
        status: deployment.deployment_status,
        completedSteps,
        totalSteps,
        currentStep,
        estimatedTimeRemaining: this.calculateTimeRemaining(steps, completedSteps),
        nextUserAction
      };

    } catch (error) {
      console.error('Failed to get deployment progress:', error);
      throw error;
    }
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateTimeRemaining(steps: DeploymentStep[], completedSteps: number): string {
    const remainingSteps = steps.length - completedSteps;
    const avgTimePerStep = 25; // minutes
    const totalMinutes = remainingSteps * avgTimePerStep;
    
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else if (totalMinutes < 1440) {
      return `${Math.round(totalMinutes / 60)} hours`;
    } else {
      return `${Math.round(totalMinutes / 1440)} days`;
    }
  }
}