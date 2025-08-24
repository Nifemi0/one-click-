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
      const deployTx = await factory.getDeployTransaction();
      const gasLimit = config.customizations.gasLimit || Number(deployTx.gasLimit) || 500000;
      
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
      const deploymentTx = deploymentReceipt.deploymentTransaction();
      if (!deploymentTx?.hash) {
        throw new Error('Deployment transaction hash not found');
      }
      
      const receipt = await this.provider.getTransactionReceipt(deploymentTx.hash);
      const gasUsed = Number(receipt?.gasUsed || gasLimit);
      const totalCost = (gasUsed * Number(gasPrice)) / Number(ethers.parseUnits('1', 'ether'));

      return {
        success: true,
        contractAddress,
        transactionHash: deploymentTx.hash,
        gasUsed: gasUsed,
        gasPrice: Number(gasPrice),
        totalCost: totalCost,
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
      // Fetch real compiled contracts from backend API
      const response = await fetch('https://one-click-c308.onrender.com/api/real-contracts/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch contract templates');
      }
      
      const result = await response.json();
      if (!result.success || !result.data.templates) {
        throw new Error('Invalid response format from templates API');
      }
      
      const templates = result.data.templates;
      const template = templates.find((t: any) => t.type === templateType || t.name === templateType);
      
      if (template && template.abi && template.bytecode) {
        console.log(`✅ Found template: ${template.name} for type: ${templateType}`);
        return {
          abi: template.abi,
          bytecode: template.bytecode
        };
      }
      
      // Fallback to basic contract structure if template not found
      console.warn(`Template ${templateType} not found, using fallback structure`);
      return {
        abi: [],
        bytecode: '0x'
      };
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

      const deployTx = await factory.getDeployTransaction();
    const gasLimit = Number(deployTx.gasLimit) || 500000;
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
      const totalCost = (Number(gasLimit) * Number(gasPrice)) / Number(ethers.parseUnits('1', 'ether'));

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
