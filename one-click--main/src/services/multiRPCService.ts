import { ethers } from 'ethers';
import { DatabaseService } from './database';

export interface RPCProvider {
  name: string;
  url: string;
  apiKey?: string;
  priority: number;
  chainId: number;
  isActive: boolean;
  lastHealthCheck: Date;
  responseTime: number;
  errorCount: number;
  maxErrors: number;
  rateLimit: {
    requestsPerSecond: number;
    requestsPerMinute: number;
    lastRequest: Date;
    requestCount: number;
  };
}

export interface RPCHealthStatus {
  provider: string;
  isHealthy: boolean;
  responseTime: number;
  lastError?: string;
  chainId: number;
  blockNumber?: number;
  timestamp: Date;
}

export interface RPCFallbackConfig {
  maxRetries: number;
  retryDelay: number;
  healthCheckInterval: number;
  circuitBreakerThreshold: number;
  loadBalancing: 'round-robin' | 'priority' | 'performance';
}

export class MultiRPCService {
  private providers: Map<string, RPCProvider> = new Map();
  private currentProvider: RPCProvider | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private db: DatabaseService;
  private config: RPCFallbackConfig;

  constructor(db: DatabaseService, config?: Partial<RPCFallbackConfig>) {
    this.db = db;
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      healthCheckInterval: 30000, // 30 seconds
      circuitBreakerThreshold: 5,
      loadBalancing: 'priority',
      ...config
    };

    this.initializeProviders();
    this.startHealthChecks();
  }

  private initializeProviders() {
    // Initialize Hoodi testnet RPC providers with fallback priority
    const hoodiProviders: RPCProvider[] = [
      {
        name: 'Alchemy Hoodi',
        url: process.env.ALCHEMY_HOODI_RPC_URL || 'https://eth-hoodi.g.alchemy.com/v2/your_key',
        apiKey: process.env.ALCHEMY_API_KEY,
        priority: 1,
        chainId: 560048,
        isActive: true,
        lastHealthCheck: new Date(),
        responseTime: 0,
        errorCount: 0,
        maxErrors: this.config.circuitBreakerThreshold,
        rateLimit: {
          requestsPerSecond: 100,
          requestsPerMinute: 1000,
          lastRequest: new Date(),
          requestCount: 0
        }
      },
      {
        name: 'Hoodi Official',
        url: process.env.HOODI_RPC_URL || 'https://rpc.hoodi.network',
        priority: 2,
        chainId: 560048,
        isActive: true,
        lastHealthCheck: new Date(),
        responseTime: 0,
        errorCount: 0,
        maxErrors: this.config.circuitBreakerThreshold,
        rateLimit: {
          requestsPerSecond: 50,
          requestsPerMinute: 500,
          lastRequest: new Date(),
          requestCount: 0
        }
      },
      {
        name: 'Hoodi Alternative',
        url: process.env.HOODI_ALT_RPC_URL || 'https://rpc2.hoodi.network',
        priority: 3,
        chainId: 560048,
        isActive: true,
        lastHealthCheck: new Date(),
        responseTime: 0,
        errorCount: 0,
        maxErrors: this.config.circuitBreakerThreshold,
        rateLimit: {
          requestsPerSecond: 30,
          requestsPerMinute: 300,
          lastRequest: new Date(),
          requestCount: 0
        }
      },
      {
        name: 'Public Hoodi',
        url: process.env.PUBLIC_HOODI_RPC_URL || 'https://public-rpc.hoodi.network',
        priority: 4,
        chainId: 560048,
        isActive: true,
        lastHealthCheck: new Date(),
        responseTime: 0,
        errorCount: 0,
        maxErrors: this.config.circuitBreakerThreshold,
        rateLimit: {
          requestsPerSecond: 10,
          requestsPerMinute: 100,
          lastRequest: new Date(),
          requestCount: 0
        }
      }
    ];

    // Add providers to the map
    hoodiProviders.forEach(provider => {
      this.providers.set(provider.name, provider);
    });

    // Set initial provider
    this.selectBestProvider();
  }

  // Get the best available RPC provider
  private selectBestProvider(): RPCProvider | null {
    const activeProviders = Array.from(this.providers.values())
      .filter(provider => provider.isActive && provider.errorCount < provider.maxErrors)
      .sort((a, b) => {
        switch (this.config.loadBalancing) {
          case 'priority':
            return a.priority - b.priority;
          case 'performance':
            return a.responseTime - b.responseTime;
          case 'round-robin':
            return Math.random() - 0.5;
          default:
            return a.priority - b.priority;
        }
      });

    this.currentProvider = activeProviders[0] || null;
    return this.currentProvider;
  }

  // Get RPC provider with automatic fallback
  async getProvider(chainId: number = 560048): Promise<ethers.Provider> {
    if (!this.currentProvider || !this.currentProvider.isActive) {
      this.selectBestProvider();
    }

    if (!this.currentProvider) {
      throw new Error('No healthy RPC providers available');
    }

    try {
      // Check rate limits
      if (this.isRateLimited(this.currentProvider)) {
        await this.waitForRateLimit(this.currentProvider);
      }

      // Create provider
      const provider = new ethers.JsonRpcProvider(this.currentProvider.url);
      
      // Test connection
      await this.testProviderConnection(provider, this.currentProvider);
      
      // Update rate limit tracking
      this.updateRateLimit(this.currentProvider);
      
      return provider;
    } catch (error) {
      console.error(`Provider ${this.currentProvider.name} failed:`, error);
      
      // Mark provider as failed
      this.markProviderFailed(this.currentProvider);
      
      // Try next provider
      return this.getProviderWithFallback(chainId);
    }
  }

  // Get provider with automatic fallback
  private async getProviderWithFallback(chainId: number, retryCount: number = 0): Promise<ethers.Provider> {
    if (retryCount >= this.config.maxRetries) {
      throw new Error(`Failed to get RPC provider after ${this.config.maxRetries} retries`);
    }

    // Select next best provider
    this.selectBestProvider();
    
    if (!this.currentProvider) {
      throw new Error('No healthy RPC providers available');
    }

    try {
      const provider = new ethers.JsonRpcProvider(this.currentProvider.url);
      await this.testProviderConnection(provider, this.currentProvider);
      this.updateRateLimit(this.currentProvider);
      return provider;
    } catch (error) {
      console.error(`Provider ${this.currentProvider.name} failed:`, error);
      this.markProviderFailed(this.currentProvider);
      
      // Wait before retry
      await this.delay(this.config.retryDelay);
      
      return this.getProviderWithFallback(chainId, retryCount + 1);
    }
  }

  // Test provider connection
  private async testProviderConnection(provider: ethers.Provider, rpcProvider: RPCProvider): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Test basic connectivity
      const chainId = await provider.getNetwork();
      
      if (chainId.chainId !== BigInt(rpcProvider.chainId)) {
        throw new Error(`Chain ID mismatch: expected ${rpcProvider.chainId}, got ${chainId.chainId}`);
      }

      // Test block number retrieval
      await provider.getBlockNumber();
      
      // Update provider health
      const responseTime = Date.now() - startTime;
      this.updateProviderHealth(rpcProvider, true, responseTime);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateProviderHealth(rpcProvider, false, responseTime, error.message);
      throw error;
    }
  }

  // Update provider health status
  private updateProviderHealth(provider: RPCProvider, isHealthy: boolean, responseTime: number, error?: string): void {
    provider.lastHealthCheck = new Date();
    provider.responseTime = responseTime;
    
    if (isHealthy) {
      provider.errorCount = Math.max(0, provider.errorCount - 1);
    } else {
      provider.errorCount++;
      if (provider.errorCount >= provider.maxErrors) {
        provider.isActive = false;
        console.warn(`Provider ${provider.name} marked as inactive due to ${provider.errorCount} consecutive errors`);
      }
    }

    // Log health status
    this.logProviderHealth(provider, isHealthy, error);
  }

  // Mark provider as failed
  private markProviderFailed(provider: RPCProvider): void {
    provider.errorCount++;
    if (provider.errorCount >= provider.maxErrors) {
      provider.isActive = false;
      console.warn(`Provider ${provider.name} marked as inactive due to ${provider.errorCount} consecutive errors`);
    }
  }

  // Check rate limits
  private isRateLimited(provider: RPCProvider): boolean {
    const now = new Date();
    const timeSinceLastRequest = now.getTime() - provider.rateLimit.lastRequest.getTime();
    
    // Check per-second limit
    if (timeSinceLastRequest < 1000 && provider.rateLimit.requestCount >= provider.rateLimit.requestsPerSecond) {
      return true;
    }
    
    // Check per-minute limit
    if (timeSinceLastRequest < 60000 && provider.rateLimit.requestCount >= provider.rateLimit.requestsPerMinute) {
      return true;
    }
    
    return false;
  }

  // Wait for rate limit
  private async waitForRateLimit(provider: RPCProvider): Promise<void> {
    const now = new Date();
    const timeSinceLastRequest = now.getTime() - provider.rateLimit.lastRequest.getTime();
    
    if (timeSinceLastRequest < 1000) {
      await this.delay(1000 - timeSinceLastRequest);
    }
    
    // Reset request count
    provider.rateLimit.requestCount = 0;
  }

  // Update rate limit tracking
  private updateRateLimit(provider: RPCProvider): void {
    const now = new Date();
    const timeSinceLastRequest = now.getTime() - provider.rateLimit.lastRequest.getTime();
    
    // Reset counters if enough time has passed
    if (timeSinceLastRequest >= 1000) {
      provider.rateLimit.requestCount = 0;
    }
    if (timeSinceLastRequest >= 60000) {
      provider.rateLimit.requestCount = 0;
    }
    
    provider.rateLimit.lastRequest = now;
    provider.rateLimit.requestCount++;
  }

  // Start health check interval
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheckInterval);
  }

  // Perform health checks on all providers
  private async performHealthChecks(): Promise<void> {
    const healthChecks = Array.from(this.providers.values()).map(async (provider) => {
      try {
        const testProvider = new ethers.JsonRpcProvider(provider.url);
        const startTime = Date.now();
        
        await testProvider.getBlockNumber();
        const responseTime = Date.now() - startTime;
        
        this.updateProviderHealth(provider, true, responseTime);
        
        // Reactivate provider if it was marked inactive
        if (!provider.isActive && provider.errorCount < provider.maxErrors) {
          provider.isActive = true;
          console.log(`Provider ${provider.name} reactivated`);
        }
        
      } catch (error) {
        this.updateProviderHealth(provider, false, 0, error.message);
      }
    });

    await Promise.allSettled(healthChecks);
    
    // Select best provider after health checks
    this.selectBestProvider();
  }

  // Get current provider status
  getProviderStatus(): RPCHealthStatus[] {
    return Array.from(this.providers.values()).map(provider => ({
      provider: provider.name,
      isHealthy: provider.isActive && provider.errorCount < provider.maxErrors,
      responseTime: provider.responseTime,
      lastError: provider.errorCount > 0 ? `Last error: ${provider.errorCount} failures` : undefined,
      chainId: provider.chainId,
      timestamp: provider.lastHealthCheck
    }));
  }

  // Get current active provider
  getCurrentProvider(): RPCProvider | null {
    return this.currentProvider;
  }

  // Manually switch to a specific provider
  async switchToProvider(providerName: string): Promise<boolean> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    if (!provider.isActive) {
      throw new Error(`Provider ${providerName} is not active`);
    }

    try {
      // Test the provider before switching
      const testProvider = new ethers.JsonRpcProvider(provider.url);
      await testProvider.getBlockNumber();
      
      // Switch to the provider
      this.currentProvider = provider;
      console.log(`Switched to provider: ${provider.name}`);
      return true;
    } catch (error) {
      console.error(`Failed to switch to provider ${provider.name}:`, error);
      return false;
    }
  }

  // Add new RPC provider
  addProvider(provider: RPCProvider): void {
    this.providers.set(provider.name, provider);
    this.selectBestProvider();
  }

  // Remove RPC provider
  removeProvider(providerName: string): void {
    if (this.currentProvider?.name === providerName) {
      this.currentProvider = null;
    }
    this.providers.delete(providerName);
    this.selectBestProvider();
  }

  // Get provider statistics
  getProviderStats(): any {
    const stats = {
      totalProviders: this.providers.size,
      activeProviders: Array.from(this.providers.values()).filter(p => p.isActive).length,
      currentProvider: this.currentProvider?.name || 'None',
      loadBalancing: this.config.loadBalancing,
      healthCheckInterval: this.config.healthCheckInterval,
      providers: Array.from(this.providers.values()).map(provider => ({
        name: provider.name,
        priority: provider.priority,
        isActive: provider.isActive,
        errorCount: provider.errorCount,
        responseTime: provider.responseTime,
        lastHealthCheck: provider.lastHealthCheck,
        rateLimit: provider.rateLimit
      }))
    };

    return stats;
  }

  // Log provider health
  private logProviderHealth(provider: RPCProvider, isHealthy: boolean, error?: string): void {
    const status = isHealthy ? '✅' : '❌';
    const message = isHealthy 
      ? `Provider ${provider.name} healthy (${provider.responseTime}ms)`
      : `Provider ${provider.name} failed: ${error}`;
    
    console.log(`${status} ${message}`);
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}