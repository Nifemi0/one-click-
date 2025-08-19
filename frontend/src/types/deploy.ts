export interface TrapTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  securityLevel: 'Low' | 'Medium' | 'High';
  features: string[];
  tags: string[];
  deploymentTime: string;
  gasEstimate: number;
  contractCode: string;
  preview: string;
  author: string;
  lastUpdated: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface DeploymentProgress {
  step: 'select' | 'configure' | 'payment' | 'deploying' | 'success' | 'failed';
  progress: number;
  message: string;
}

export interface DeploymentConfig {
  template: TrapTemplate;
  customizations: {
    name: string;
    description: string;
    securityLevel: 'Low' | 'Medium' | 'High';
    gasLimit?: number;
    gasPrice?: number;
    customParameters?: Record<string, any>;
  };
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  gasUsed?: number;
  gasPrice?: number;
  totalCost?: number;
  deploymentTime?: number;
  error?: string;
  verificationStatus?: 'pending' | 'verified' | 'failed';
}

export interface GasEstimate {
  gasLimit: number;
  gasPrice: number;
  totalCost: number;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
}

export interface NetworkInfo {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isSupported: boolean;
}
