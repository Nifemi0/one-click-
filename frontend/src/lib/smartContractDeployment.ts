import { ethers } from 'ethers';
import { TrapTemplate } from '../types/deploy';

const HOODI_RPC_URL = process.env.NEXT_PUBLIC_HOODI_RPC_URL || 'https://rpc.hoodi.network';
const HOODI_CHAIN_ID = 560048; // Hoodi testnet chain ID

export interface DeploymentConfig {
  template: TrapTemplate;
  customizations: {
    name: string;
    description: string;
    securityLevel: 'Low' | 'Medium' | 'High';
    gasLimit?: number;
    gasPrice?: number;
  };
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  gasUsed?: number;
  gasPrice?: number;
  totalCost?: number;
  error?: string;
}

export class SmartContractDeploymentService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(HOODI_CHAIN_ID)) {
        await this.switchToHoodiNetwork();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize deployment service:', error);
      return false;
    }
  }

  private async switchToHoodiNetwork(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${HOODI_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${HOODI_CHAIN_ID.toString(16)}`,
            chainName: 'Hoodi Testnet',
            nativeCurrency: {
              name: 'HOODI',
              symbol: 'HOODI',
              decimals: 18,
            },
            rpcUrls: [HOODI_RPC_URL],
            blockExplorerUrls: ['https://explorer.hoodi.network'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  }

  async deployContract(config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      if (!this.provider || !this.signer) {
        throw new Error('Deployment service not initialized. Please connect your wallet.');
      }

      // Get the contract ABI and bytecode
      const contractData = await this.getContractData(config.template.type);
      if (!contractData) {
        throw new Error('Contract template not found');
      }

      // Create contract factory
      const factory = new ethers.ContractFactory(
        contractData.abi,
        contractData.bytecode,
        this.signer
      );

      // Estimate gas
      const gasLimit = config.customizations.gasLimit || await factory.getDeployTransaction().gasLimit || 500000;
      
      // Get current gas price
      const feeData = await this.provider.getFeeData();
      const gasPrice = config.customizations.gasPrice || feeData.gasPrice || ethers.parseUnits('20', 'gwei');

      // Deploy the contract
      const contract = await factory.deploy({
        gasLimit,
        gasPrice,
      });

      // Wait for deployment
      const deploymentReceipt = await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      // Get transaction receipt for gas used
      const receipt = await this.provider.getTransactionReceipt(deploymentReceipt.hash!);
      const gasUsed = receipt?.gasUsed || gasLimit;
      const totalCost = (gasUsed * gasPrice) / ethers.parseUnits('1', 'ether');

      return {
        success: true,
        contractAddress,
        transactionHash: deploymentReceipt.hash!,
        gasUsed: Number(gasUsed),
        gasPrice: Number(gasPrice),
        totalCost: Number(totalCost),
      };
    } catch (error) {
      console.error('Contract deployment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
      };
    }
  }

  private async getContractData(templateType: string): Promise<{ abi: any; bytecode: string } | null> {
    try {
      // Import the appropriate contract based on template type
      switch (templateType) {
        case 'Honeypot':
          const { AdvancedHoneypot } = await import('../contracts/AdvancedHoneypot');
          return {
            abi: AdvancedHoneypot.abi,
            bytecode: AdvancedHoneypot.bytecode,
          };
        
        case 'ReentrancyGuard':
          const { ReentrancyGuard } = await import('../contracts/ReentrancyGuard');
          return {
            abi: ReentrancyGuard.abi,
            bytecode: ReentrancyGuard.bytecode,
          };
        
        case 'FlashLoanProtection':
          const { FlashLoanProtection } = await import('../contracts/FlashLoanProtection');
          return {
            abi: FlashLoanProtection.abi,
            bytecode: FlashLoanProtection.bytecode,
          };
        
        case 'MEVProtection':
          const { MEVProtection } = await import('../contracts/MEVProtection');
          return {
            abi: MEVProtection.abi,
            bytecode: MEVProtection.bytecode,
          };
        
        default:
          // Try to import a generic security trap
          const { SecurityTrap } = await import('../contracts/SecurityTrap');
          return {
            abi: SecurityTrap.abi,
            bytecode: SecurityTrap.bytecode,
          };
      }
    } catch (error) {
      console.error('Failed to load contract data:', error);
      return null;
    }
  }

  async estimateGas(config: DeploymentConfig): Promise<{ gasLimit: number; gasPrice: number; totalCost: number } | null> {
    try {
      if (!this.provider || !this.signer) {
        throw new Error('Deployment service not initialized');
      }

      const contractData = await this.getContractData(config.template.type);
      if (!contractData) {
        throw new Error('Contract template not found');
      }

      const factory = new ethers.ContractFactory(
        contractData.abi,
        contractData.bytecode,
        this.signer
      );

      const gasLimit = await factory.getDeployTransaction().gasLimit || 500000;
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
      const totalCost = (gasLimit * gasPrice) / ethers.parseUnits('1', 'ether');

      return {
        gasLimit: Number(gasLimit),
        gasPrice: Number(gasPrice),
        totalCost: Number(totalCost),
      };
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      return null;
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

  async verifyDeployment(contractAddress: string, templateType: string): Promise<boolean> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const contractData = await this.getContractData(templateType);
      if (!contractData) {
        return false;
      }

      // Create contract instance to verify it's deployed
      const contract = new ethers.Contract(contractAddress, contractData.abi, this.provider);
      
      // Try to call a view function to verify the contract exists
      try {
        await contract.getTrapInfo();
        return true;
      } catch {
        // If getTrapInfo fails, try a basic call
        const code = await this.provider.getCode(contractAddress);
        return code !== '0x';
      }
    } catch (error) {
      console.error('Failed to verify deployment:', error);
      return false;
    }
  }
}
