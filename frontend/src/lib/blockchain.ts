import { ethers } from 'ethers';

// SecurityTrap ABI - minimal interface for the functions we need
const SECURITY_TRAP_ABI = [
  "function deployTrap(string name, string description, uint256 rewardPercentage, uint256 maxAttackers) external payable",
  "function getTrap(uint256 trapId) external view returns (uint256 id, string name, string description, uint256 rewardPercentage, uint256 maxAttackers, uint256 deploymentCost, address deployer, bool isActive, uint256 createdAt)",
  "function getTotalTraps() external view returns (uint256)",
  "event TrapDeployed(uint256 indexed trapId, string name, address indexed deployer, uint256 cost)"
];

export interface TrapTemplate {
  id: string;
  name: string;
  description: string;
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
  cost?: string;
  costInEth: number;
  deploymentTime?: string;
  securityLevel?: 'Low' | 'Medium' | 'High';
  features?: string[];
  contractCode: string;
  rewardPercentage?: number;
  maxAttackers?: number;
}

export interface DeploymentResult {
  success: boolean;
  transactionHash?: string;
  contractAddress?: string;
  trapId?: number;
  error?: string;
}

export interface TrapData {
  id: number;
  name: string;
  description: string;
  rewardPercentage: number;
  maxAttackers: number;
  deploymentCost: string;
  deployer: string;
  isActive: boolean;
  createdAt: number;
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', () => {
          this.initializeProvider(); // Re-initialize when account changes
        });

        console.log('Blockchain provider initialized');
      } catch (error) {
        console.error('Failed to initialize blockchain provider:', error);
      }
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }
      
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const address = await this.signer.getAddress();
      console.log('Wallet connected:', address);
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  async switchToHoodiTestnet(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const chainId = '0x88b0'; // 560048 in hex
      
      try {
        // Try to switch to Hoodi testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
        return true;
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId,
              chainName: 'Hoodi Testnet',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.hoodi.network'],
              blockExplorerUrls: ['https://explorer.hoodi.network'],
            }],
          });
          return true;
        }
        throw switchError;
      }
    } catch (error) {
      console.error('Failed to switch to Hoodi testnet:', error);
      return false;
    }
  }

  async initializeContract(contractAddress: string): Promise<boolean> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      this.contract = new ethers.Contract(
        contractAddress,
        SECURITY_TRAP_ABI,
        this.provider
      );

      console.log('Contract initialized at:', contractAddress);
      return true;
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      return false;
    }
  }

  async deployTrap(
    template: TrapTemplate,
    customConfig: {
      trapName: string;
      description: string;
      rewardPercentage: number;
      maxAttackers: number;
    }
  ): Promise<DeploymentResult> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not initialized');
      }

      // Ensure we're on Hoodi testnet
      await this.switchToHoodiTestnet();

      // Convert ETH cost to Wei
      const costInWei = ethers.parseEther(template.costInEth.toString());

      // Deploy the trap
      const tx = await this.contract.deployTrap(
        customConfig.trapName,
        customConfig.description,
        customConfig.rewardPercentage,
        customConfig.maxAttackers,
        { value: costInWei }
      );

      console.log('Deployment transaction sent:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Deployment confirmed in block:', receipt.blockNumber);

      // Get the trap ID from the event
      const event = receipt.events?.find((e: any) => e.event === 'TrapDeployed');
      const trapId = event?.args?.trapId;

      return {
        success: true,
        transactionHash: tx.hash,
        contractAddress: await this.contract.getAddress(),
        trapId: trapId ? Number(trapId) : undefined
      };
    } catch (error: any) {
      console.error('Deployment failed:', error);
      return {
        success: false,
        error: error.message || 'Deployment failed'
      };
    }
  }

  async getTrap(trapId: number): Promise<TrapData | null> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const trap = await this.contract.getTrap(trapId);
      
              return {
          id: Number(trap.id),
          name: trap.name,
          description: trap.description,
          rewardPercentage: Number(trap.rewardPercentage),
          maxAttackers: Number(trap.maxAttackers),
          deploymentCost: ethers.formatEther(trap.deploymentCost),
          deployer: trap.deployer,
          isActive: trap.isActive,
          createdAt: Number(trap.createdAt)
        };
    } catch (error) {
      console.error('Failed to get trap:', error);
      return null;
    }
  }

  async getTotalTraps(): Promise<number> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const total = await this.contract.getTotalTraps();
      return Number(total);
    } catch (error) {
      console.error('Failed to get total traps:', error);
      return 0;
    }
  }

  async getGasEstimate(
    template: TrapTemplate,
    customConfig: {
      trapName: string;
      description: string;
      rewardPercentage: number;
      maxAttackers: number;
    }
  ): Promise<string> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not initialized');
      }

      const costInWei = ethers.parseEther(template.costInEth.toString());
      
      const gasEstimate = await this.contract.deployTrap.estimateGas(
        customConfig.trapName,
        customConfig.description,
        customConfig.rewardPercentage,
        customConfig.maxAttackers,
        { value: costInWei }
      );

      // Get current gas price
      const feeData = await this.provider!.getFeeData();
      const gasPrice = feeData.gasPrice;
      
      if (!gasPrice) {
        throw new Error('Unable to get gas price');
      }
      
      // Calculate total gas cost
      const totalGasCost = gasEstimate * gasPrice;
      
      return ethers.formatEther(totalGasCost);
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      return '0';
    }
  }

  async getBalance(): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('Signer not initialized');
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const network = await this.provider.getNetwork();
      return {
        chainId: network.chainId,
        name: network.name,
        isHoodiTestnet: network.chainId === BigInt(560048)
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
