import { DatabaseService } from './database';

export interface PricingTier {
  name: string;
  deploymentFee: number;
  monthlyFee: number;
  features: string[];
  gasMultiplier: number;
  supportLevel: 'basic' | 'premium' | 'enterprise' | '24_7';
}

export interface RevenueTransaction {
  id: string;
  userId: string;
  trapId: string;
  type: 'deployment' | 'subscription' | 'feature' | 'gas' | 'marketplace';
  amount: number;
  currency: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: any;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurring: number;
  deploymentRevenue: number;
  subscriptionRevenue: number;
  featureRevenue: number;
  gasRevenue: number;
  marketplaceRevenue: number;
  activeSubscriptions: number;
  averageRevenuePerUser: number;
}

export class RevenueService {
  private db: DatabaseService;
  
  // Premium Testnet Pricing Tiers
  private readonly pricingTiers: Map<string, PricingTier> = new Map([
    ['basic', {
      name: 'Basic',
      deploymentFee: 0.005,
      monthlyFee: 0.015,
      features: ['Basic monitoring', 'Standard reports', 'Email support'],
      gasMultiplier: 1.0,
      supportLevel: 'basic'
    }],
    ['premium', {
      name: 'Premium',
      deploymentFee: 0.01,
      monthlyFee: 0.03,
      features: ['Advanced monitoring', 'AI analysis', 'Priority support', 'Testnet analytics'],
      gasMultiplier: 1.5,
      supportLevel: 'premium'
    }],
    ['custom', {
      name: 'Custom',
      deploymentFee: 0.015,
      monthlyFee: 0.045,
      features: ['Custom configuration', 'Advanced AI analysis', 'Custom reports', 'Sandbox environment'],
      gasMultiplier: 1.8,
      supportLevel: 'premium'
    }],
    ['enterprise', {
      name: 'Enterprise',
      deploymentFee: 0.025,
      monthlyFee: 0.05,
      features: ['Enterprise monitoring', 'Custom integrations', 'Dedicated support', 'White-label options'],
      gasMultiplier: 2.0,
      supportLevel: 'enterprise'
    }],
    ['24_7', {
      name: '24/7 Support',
      deploymentFee: 0.03,
      monthlyFee: 0.075,
      features: ['24/7 monitoring', 'Instant alerts', 'Phone support', 'Emergency response'],
      gasMultiplier: 2.5,
      supportLevel: '24_7'
    }]
  ]);

  // Feature pricing
  private readonly featurePricing = {
    aiAnalysis: 0.005,
    advancedReports: 0.003,
    prioritySupport: 0.015,
    testnetAnalytics: 0.008,
    sandboxEnvironment: 0.02,
    fastTrackDeployment: 0.01,
    customIntegration: 0.025
  };

  constructor(db: DatabaseService) {
    this.db = db;
  }

  // Get pricing tier information
  getPricingTier(tierName: string): PricingTier | undefined {
    return this.pricingTiers.get(tierName);
  }

  getAllPricingTiers(): PricingTier[] {
    return Array.from(this.pricingTiers.values());
  }

  // Calculate deployment cost
  calculateDeploymentCost(tierName: string, customFeatures: string[] = []): number {
    const tier = this.pricingTiers.get(tierName);
    if (!tier) {
      throw new Error(`Invalid pricing tier: ${tierName}`);
    }

    let totalCost = tier.deploymentFee;

    // Add custom feature costs
    customFeatures.forEach(feature => {
      if (this.featurePricing[feature as keyof typeof this.featurePricing]) {
        totalCost += this.featurePricing[feature as keyof typeof this.featurePricing];
      }
    });

    return totalCost;
  }

  // Calculate monthly subscription cost
  calculateMonthlyCost(tierName: string, additionalFeatures: string[] = []): number {
    const tier = this.pricingTiers.get(tierName);
    if (!tier) {
      throw new Error(`Invalid pricing tier: ${tierName}`);
    }

    let totalCost = tier.monthlyFee;

    // Add additional feature costs
    additionalFeatures.forEach(feature => {
      if (this.featurePricing[feature as keyof typeof this.featurePricing]) {
        totalCost += this.featurePricing[feature as keyof typeof this.featurePricing];
      }
    });

    return totalCost;
  }

  // Calculate gas cost with multiplier
  calculateGasCost(baseGasCost: number, tierName: string, fastTrack: boolean = false): number {
    const tier = this.pricingTiers.get(tierName);
    if (!tier) {
      throw new Error(`Invalid pricing tier: ${tierName}`);
    }

    let multiplier = tier.gasMultiplier;
    
    if (fastTrack) {
      multiplier *= 2.0; // Fast track doubles the gas multiplier
    }

    return baseGasCost * multiplier;
  }

  // Record revenue transaction
  async recordTransaction(transaction: Omit<RevenueTransaction, 'id' | 'timestamp'>): Promise<string> {
    const id = this.generateId();
    const timestamp = new Date();

    try {
      await this.db.query(
        `INSERT INTO revenue_transactions 
         (id, user_id, trap_id, type, amount, currency, description, timestamp, status, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          id,
          transaction.userId,
          transaction.trapId,
          transaction.type,
          transaction.amount,
          transaction.currency,
          transaction.description,
          timestamp,
          transaction.status,
          JSON.stringify(transaction.metadata || {})
        ]
      );

      return id;
    } catch (error) {
      console.error('Failed to record revenue transaction:', error);
      throw new Error('Failed to record transaction');
    }
  }

  // Get revenue metrics
  async getRevenueMetrics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RevenueMetrics> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      
      // Get total revenue
      const totalResult = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE status = 'completed' AND timestamp >= $1`,
        [timeFilter]
      );

      // Get monthly recurring revenue
      const mrrResult = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE status = 'completed' AND type = 'subscription' AND timestamp >= $1`,
        [timeFilter]
      );

      // Get deployment revenue
      const deploymentResult = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE status = 'completed' AND type = 'deployment' AND timestamp >= $1`,
        [timeFilter]
      );

      // Get feature revenue
      const featureResult = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE status = 'completed' AND type = 'feature' AND timestamp >= $1`,
        [timeFilter]
      );

      // Get gas revenue
      const gasResult = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE status = 'completed' AND type = 'gas' AND timestamp >= $1`,
        [timeFilter]
      );

      // Get marketplace revenue
      const marketplaceResult = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE status = 'completed' AND type = 'marketplace' AND timestamp >= $1`,
        [timeFilter]
      );

      // Get active subscriptions count
      const subscriptionsResult = await this.db.query(
        `SELECT COUNT(DISTINCT user_id) as count FROM revenue_transactions 
         WHERE status = 'completed' AND type = 'subscription' AND timestamp >= $1`,
        [timeFilter]
      );

      const totalRevenue = parseFloat(totalResult.rows[0]?.total || '0');
      const activeSubscriptions = parseInt(subscriptionsResult.rows[0]?.count || '0');
      const averageRevenuePerUser = activeSubscriptions > 0 ? totalRevenue / activeSubscriptions : 0;

      return {
        totalRevenue,
        monthlyRecurring: parseFloat(mrrResult.rows[0]?.total || '0'),
        deploymentRevenue: parseFloat(deploymentResult.rows[0]?.total || '0'),
        subscriptionRevenue: parseFloat(mrrResult.rows[0]?.total || '0'),
        featureRevenue: parseFloat(featureResult.rows[0]?.total || '0'),
        gasRevenue: parseFloat(gasResult.rows[0]?.total || '0'),
        marketplaceRevenue: parseFloat(marketplaceResult.rows[0]?.total || '0'),
        activeSubscriptions,
        averageRevenuePerUser
      };
    } catch (error) {
      console.error('Failed to get revenue metrics:', error);
      throw new Error('Failed to get revenue metrics');
    }
  }

  // Get revenue by user
  async getUserRevenue(userId: string, timeframe: 'month' | 'year' = 'month'): Promise<number> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      
      const result = await this.db.query(
        `SELECT SUM(amount) as total FROM revenue_transactions 
         WHERE user_id = $1 AND status = 'completed' AND timestamp >= $2`,
        [userId, timeFilter]
      );

      return parseFloat(result.rows[0]?.total || '0');
    } catch (error) {
      console.error('Failed to get user revenue:', error);
      return 0;
    }
  }

  // Get revenue by network/chain
  async getNetworkRevenue(chainId: number, timeframe: 'month' | 'year' = 'month'): Promise<number> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      
      const result = await this.db.query(
        `SELECT SUM(rt.amount) as total 
         FROM revenue_transactions rt
         JOIN trap_deployments td ON rt.trap_id = td.id
         WHERE td.chain_id = $1 AND rt.status = 'completed' AND rt.timestamp >= $2`,
        [chainId, timeFilter]
      );

      return parseFloat(result.rows[0]?.total || '0');
    } catch (error) {
      console.error('Failed to get network revenue:', error);
      return 0;
    }
  }

  // Process payment
  async processPayment(
    userId: string,
    trapId: string,
    amount: number,
    type: RevenueTransaction['type'],
    description: string,
    metadata?: any
  ): Promise<string> {
    try {
      // In a real implementation, you would integrate with a payment processor here
      // For now, we'll simulate successful payment processing
      
      const transactionId = await this.recordTransaction({
        userId,
        trapId,
        type,
        amount,
        currency: 'ETH',
        description,
        status: 'completed',
        metadata
      });

      // Update trap revenue tracking
      await this.db.query(
        'UPDATE trap_deployments SET revenue_generated = revenue_generated + $1, last_activity = NOW() WHERE id = $2',
        [amount, trapId]
      );

      return transactionId;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error('Payment processing failed');
    }
  }

  // Refund transaction
  async refundTransaction(transactionId: string, reason: string): Promise<void> {
    try {
      await this.db.query(
        'UPDATE revenue_transactions SET status = $1, metadata = jsonb_set(metadata, \'{refund_reason}\', $2) WHERE id = $3',
        ['refunded', reason, transactionId]
      );
    } catch (error) {
      console.error('Failed to refund transaction:', error);
      throw new Error('Refund failed');
    }
  }

  // Helper methods
  private generateId(): string {
    return `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTimeFilter(timeframe: 'day' | 'week' | 'month' | 'year'): Date {
    const now = new Date();
    switch (timeframe) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}