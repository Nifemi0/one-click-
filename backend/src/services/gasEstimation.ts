export interface GasEstimate {
  estimatedGas: number;
  estimatedCost: string;
  gasPrice: number;
  network: string;
  contractType: string;
  complexity: string;
}

export interface GasEstimationRequest {
  contractType: string;
  complexity: string;
  network?: string;
}

/**
 * @title GasEstimationService
 * @dev Service for estimating gas costs for smart contract deployment
 * @dev Provides realistic gas estimates based on contract type and complexity
 */
export class GasEstimationService {
  private static instance: GasEstimationService;
  
  private constructor() {}
  
  static getInstance(): GasEstimationService {
    if (!GasEstimationService.instance) {
      GasEstimationService.instance = new GasEstimationService();
    }
    return GasEstimationService.instance;
  }

  /**
   * @dev Estimate gas for contract deployment
   */
  async estimateGasForContract(request: GasEstimationRequest): Promise<GasEstimate> {
    try {
      console.log(`🔍 Estimating gas for ${request.contractType} (${request.complexity})`);
      
      // Base gas costs for different contract types
      const baseGasCosts: Record<string, number> = {
        'Honeypot': 150000,
        'Monitoring': 200000,
        'Basic': 120000,
        'Advanced': 250000,
        'ReentrancyGuard': 180000,
        'FlashLoanProtection': 220000,
        'MultiSig': 160000
      };
      
      // Complexity multipliers
      const complexityMultipliers: Record<string, number> = {
        'Basic': 1.0,
        'Intermediate': 1.3,
        'Advanced': 1.8
      };
      
      // Network-specific gas prices (in gwei)
      const networkGasPrices: Record<string, number> = {
        'ethereum': 25,
        'polygon': 30,
        'bsc': 5,
        'arbitrum': 0.1,
        'optimism': 0.001,
        'hoodi': 5 // BSC testnet
      };
      
      const baseGas = baseGasCosts[request.contractType] || 150000;
      const multiplier = complexityMultipliers[request.complexity] || 1.0;
      const estimatedGas = Math.round(baseGas * multiplier);
      
      // Use specified network or default to BSC/Hoodi
      const network = request.network || 'hoodi';
      const gasPrice = networkGasPrices[network] || 5;
      const estimatedCost = (estimatedGas * gasPrice * 1e-9).toFixed(6); // Convert to ETH
      
      console.log(`✅ Gas estimation: ${estimatedGas} gas units, ${estimatedCost} ETH`);
      
      return {
        estimatedGas,
        estimatedCost,
        gasPrice,
        network,
        contractType: request.contractType,
        complexity: request.complexity
      };
      
    } catch (error) {
      console.error('❌ Gas estimation failed:', error);
      throw new Error(`Gas estimation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * @dev Get current gas price for a network
   */
  async getCurrentGasPrice(network: string = 'hoodi'): Promise<number> {
    try {
      console.log(`🔍 Fetching current gas price for ${network}`);
      
      // Simulate fetching current gas price (in production, this would call a real API)
      const gasPrices: Record<string, number> = {
        'ethereum': 25,
        'polygon': 30,
        'bsc': 5,
        'arbitrum': 0.1,
        'optimism': 0.001,
        'hoodi': 5
      };
      
      const gasPrice = gasPrices[network] || 5;
      console.log(`✅ Current gas price for ${network}: ${gasPrice} gwei`);
      
      return gasPrice;
      
    } catch (error) {
      console.error('❌ Failed to fetch gas price:', error);
      return 5; // Return default gas price
    }
  }

  /**
   * @dev Estimate deployment cost for a contract
   */
  async estimateDeploymentCost(request: GasEstimationRequest): Promise<string> {
    try {
      const estimate = await this.estimateGasForContract(request);
      return estimate.estimatedCost;
    } catch (error) {
      console.error('❌ Deployment cost estimation failed:', error);
      throw error;
    }
  }

  /**
   * @dev Get available contract types and their base gas costs
   */
  getAvailableContractTypes(): Array<{type: string, baseGas: number, description: string}> {
    return [
      { type: 'Honeypot', baseGas: 150000, description: 'Honeypot security trap contracts' },
      { type: 'Monitoring', baseGas: 200000, description: 'Real-time monitoring and protection contracts' },
      { type: 'Basic', baseGas: 120000, description: 'Basic security and utility contracts' },
      { type: 'Advanced', baseGas: 250000, description: 'Advanced security and DeFi protection contracts' },
      { type: 'ReentrancyGuard', baseGas: 180000, description: 'Reentrancy attack protection contracts' },
      { type: 'FlashLoanProtection', baseGas: 220000, description: 'Flash loan attack protection contracts' },
      { type: 'MultiSig', baseGas: 160000, description: 'Multi-signature wallet contracts' }
    ];
  }

  /**
   * @dev Get available complexity levels and their multipliers
   */
  getAvailableComplexityLevels(): Array<{level: string, multiplier: number, description: string}> {
    return [
      { level: 'Basic', multiplier: 1.0, description: 'Simple contracts with basic functionality' },
      { level: 'Intermediate', multiplier: 1.3, description: 'Moderate complexity with advanced features' },
      { level: 'Advanced', multiplier: 1.8, description: 'Complex contracts with sophisticated security' }
    ];
  }
}

export default GasEstimationService;
