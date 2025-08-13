// Core application types for Drosera One-Click Deployment System

export interface User {
  id: string;
  walletAddress: string;
  chainId: number;
  isConnected: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    telegram: boolean;
    discord: boolean;
    push: boolean;
  };
  defaultChain: number;
  gasPreferences: {
    auto: boolean;
    custom: number;
  };
}

export interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  category: TrapCategory;
  complexity: TrapComplexity;
  audited: boolean;
  rating: number;
  deployments: number;
  creator: string;
  price: number;
  code: string;
  abi: any[];
  bytecode: string;
  ipfsHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TrapCategory = 'rugpull' | 'governance' | 'minting' | 'oracle' | 'flashloan' | 'reentrancy' | 'access-control';

export type TrapComplexity = 'basic' | 'intermediate' | 'advanced';

export interface DeployedTrap {
  id: string;
  userAddress: string;
  contractAddress: string;
  templateId: string;
  chainId: number;
  deploymentTx: string;
  configuration: TrapConfiguration;
  isActive: boolean;
  deployedAt: Date;
  template?: TrapTemplate;
}

export interface TrapConfiguration {
  targetContract: string;
  vulnerabilityType: TrapCategory;
  responseActions: ResponseAction[];
  monitoringRules: MonitoringRule[];
  gasLimit: number;
  emergencyContacts: string[];
}

export interface ResponseAction {
  type: 'pause' | 'withdraw' | 'freeze' | 'alert' | 'custom';
  parameters: Record<string, any>;
  priority: number;
}

export interface MonitoringRule {
  condition: string;
  threshold: number;
  action: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  trapId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  metadata: Record<string, any>;
  isAcknowledged: boolean;
  createdAt: Date;
  trap?: DeployedTrap;
}

export type AlertType = 'threat_detected' | 'trap_triggered' | 'emergency_executed' | 'configuration_updated' | 'contract_paused';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ContractAnalysis {
  contractAddress: string;
  chainId: number;
  analysisResult: AnalysisResult;
  riskScore: number;
  analyzedAt: Date;
  expiresAt: Date;
}

export interface AnalysisResult {
  vulnerabilities: Vulnerability[];
  recommendations: Recommendation[];
  riskFactors: RiskFactor[];
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
}

export interface Vulnerability {
  type: string;
  description: string;
  severity: AlertSeverity;
  lineNumbers?: number[];
  impact: string;
  remediation: string;
}

export interface Recommendation {
  type: TrapCategory;
  priority: number;
  description: string;
  templateId?: string;
  estimatedCost: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
}

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  data?: any;
}

export interface AppState {
  user: User | null;
  traps: {
    deployed: DeployedTrap[];
    templates: TrapTemplate[];
    activeAlerts: Alert[];
  };
  ui: {
    isLoading: boolean;
    currentStep: DeploymentStep | null;
    notifications: Notification[];
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: Date;
}

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
  };
}

export interface TrapDeploymentParams {
  templateId: string;
  targetContract: string;
  chainId: number;
  configuration: Partial<TrapConfiguration>;
  gasLimit?: number;
  gasPrice?: string;
}

export interface DeploymentResult {
  success: boolean;
  transactionHash?: string;
  trapAddress?: string;
  error?: string;
  gasUsed?: number;
}