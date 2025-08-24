export interface GasEstimate {
  estimatedGas: number;
  estimatedCost: string;
  gasPrice: number;
  network: string;
}

export class GasEstimationService {
  private static instance: GasEstimationService;
  
  private constructor() {}
  
  static getInstance(): GasEstimationService {
    if (!GasEstimationService.instance) {
      GasEstimationService.instance = new GasEstimationService();
    }
    return GasEstimationService.instance;
  }

  async estimateGasForContract(contractType: string, complexity: string): Promise<GasEstimate> {
    // Simulate network call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Base gas costs for different contract types
    const baseGasCosts: Record<string, number> = {
      'Honeypot': 150000,
      'Monitoring': 200000,
      'Basic': 120000,
      'Advanced': 250000
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
      'optimism': 0.001
    };
    
    const baseGas = baseGasCosts[contractType] || 150000;
    const multiplier = complexityMultipliers[complexity] || 1.0;
    const estimatedGas = Math.round(baseGas * multiplier);
    
    // Use BSC as default network (since that's what the user is targeting)
    const gasPrice = networkGasPrices['bsc'];
    const estimatedCost = (estimatedGas * gasPrice * 1e-9).toFixed(6); // Convert to ETH
    
    return {
      estimatedGas,
      estimatedCost,
      gasPrice,
      network: 'BSC'
    };
  }

  async getCurrentGasPrice(network: string = 'bsc'): Promise<number> {
    // Simulate fetching current gas price
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gasPrices: Record<string, number> = {
      'ethereum': 25,
      'polygon': 30,
      'bsc': 5,
      'arbitrum': 0.1,
      'optimism': 0.001
    };
    
    return gasPrices[network] || 5;
  }

  async estimateDeploymentCost(contractType: string, complexity: string): Promise<string> {
    const estimate = await this.estimateGasForContract(contractType, complexity);
    return estimate.estimatedCost;
  }
}

export default GasEstimationService;
