export interface TrapDeployment {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'deploying' | 'failed';
  deployedAt: string;
  contractAddress: string;
  transactionHash: string;
  gasUsed: number;
  gasPrice: number;
  totalCost: number;
  securityScore: number;
  revenueGenerated: number;
  triggers: number;
  lastTriggered?: string;
  network: string;
  userAddress: string;
}

export interface SecurityAlert {
  id: string;
  type: 'threat_detected' | 'trap_triggered' | 'suspicious_activity' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  trapId?: string;
  userAddress: string;
  isRead: boolean;
  metadata?: {
    attackerAddress?: string;
    attackType?: string;
    fundsProtected?: number;
    [key: string]: any;
  };
}

export interface TrapStats {
  totalDeployments: number;
  activeTraps: number;
  totalRevenue: number;
  successRate: number;
  totalGasUsed: number;
  lastDeployment: string | null;
  monthlyDeployments: number;
  securityScore: number;
  totalFundsProtected?: number;
  averageResponseTime?: number;
  threatDetectionRate?: number;
}

export interface DashboardActivity {
  id: string;
  type: 'deployment' | 'alert' | 'revenue' | 'security_event';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
  userAddress: string;
}
