import { TrapDeployment, SecurityAlert, TrapStats } from '../types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://one-click-c308.onrender.com';

export class DashboardService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  static async getTrapDeployments(userAddress?: string): Promise<TrapDeployment[]> {
    try {
      const endpoint = userAddress 
        ? `/api/deployments?userAddress=${userAddress}`
        : '/api/deployments';
      
      const data = await this.makeRequest<{ deployments: TrapDeployment[] }>(endpoint);
      return data.deployments || [];
    } catch (error) {
      console.error('Failed to fetch trap deployments:', error);
      return [];
    }
  }

  static async getSecurityAlerts(userAddress?: string): Promise<SecurityAlert[]> {
    try {
      const endpoint = userAddress 
        ? `/api/alerts?userAddress=${userAddress}`
        : '/api/alerts';
      
      const data = await this.makeRequest<{ alerts: SecurityAlert[] }>(endpoint);
      return data.alerts || [];
    } catch (error) {
      console.error('Failed to fetch security alerts:', error);
      return [];
    }
  }

  static async getTrapStats(userAddress?: string): Promise<TrapStats> {
    try {
      const endpoint = userAddress 
        ? `/api/stats?userAddress=${userAddress}`
        : '/api/stats';
      
      const data = await this.makeRequest<{ stats: TrapStats }>(endpoint);
      return data.stats || this.getDefaultStats();
    } catch (error) {
      console.error('Failed to fetch trap stats:', error);
      return this.getDefaultStats();
    }
  }

  private static getDefaultStats(): TrapStats {
    return {
      totalDeployments: 0,
      activeTraps: 0,
      totalRevenue: 0,
      successRate: 0,
      totalGasUsed: 0,
      lastDeployment: null,
      monthlyDeployments: 0,
      securityScore: 0
    };
  }

  static async getRecentActivity(userAddress?: string): Promise<any[]> {
    try {
      const endpoint = userAddress 
        ? `/api/activity?userAddress=${userAddress}&limit=10`
        : '/api/activity?limit=10';
      
      const data = await this.makeRequest<{ activities: any[] }>(endpoint);
      return data.activities || [];
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      return [];
    }
  }

  static async refreshDashboard(userAddress?: string): Promise<{
    deployments: TrapDeployment[];
    alerts: SecurityAlert[];
    stats: TrapStats;
    activity: any[];
  }> {
    try {
      const [deployments, alerts, stats, activity] = await Promise.all([
        this.getTrapDeployments(userAddress),
        this.getSecurityAlerts(userAddress),
        this.getTrapStats(userAddress),
        this.getRecentActivity(userAddress)
      ]);

      return { deployments, alerts, stats, activity };
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      return {
        deployments: [],
        alerts: [],
        stats: this.getDefaultStats(),
        activity: []
      };
    }
  }
}
