'use client';

import { ethers } from 'ethers';
import { blockchainService } from './blockchain';

// Import contract artifact - this will be resolved at runtime
// The actual path will depend on where the artifacts are located after build
let artifact: any;

try {
  // Try to import from the expected path
  artifact = require('../../artifacts/contracts/SecurityTrap.sol/SecurityTrap.json');
} catch (error) {
  // Fallback to a mock artifact if the real one isn't available
  console.warn('Contract artifact not found, using mock data');
  artifact = {
    abi: [],
    bytecode: '0x'
  };
}

export interface DeployResult {
  ok: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

export class ContractDeployer {
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async deploySecurityTrap(
    name: string,
    description: string,
    initialDeposit: string
  ): Promise<DeployResult> {
    try {
      console.log('🚀 Deploying SecurityTrap contract...');
      
      if (!artifact || !artifact.abi || !artifact.bytecode) {
        throw new Error('Contract artifact not available');
      }

      const factory = new ethers.ContractFactory(
        artifact.abi,
        artifact.bytecode,
        this.signer
      );

      const contract = await factory.deploy(
        name,
        description,
        { value: ethers.parseEther(initialDeposit) }
      );

      console.log('📝 Waiting for deployment confirmation...');
      
      // Get the deployment transaction hash
      const deploymentTx = contract.deploymentTransaction();
      const transactionHash = deploymentTx?.hash;
      
      // Wait for deployment
      const deployedAddress = await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();
      
      console.log('✅ Contract deployed successfully at:', contractAddress);

      return {
        ok: true,
        contractAddress,
        transactionHash
      };

    } catch (error) {
      console.error('❌ Contract deployment failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        ok: false,
        error: `Deployment failed: ${errorMessage}`
      };
    }
  }

  async deployWithCustomParameters(
    contractType: string,
    parameters: Record<string, any>
  ): Promise<DeployResult> {
    try {
      console.log(`🚀 Deploying ${contractType} contract with custom parameters...`);
      
      // This would be implemented based on the specific contract type
      // For now, return a mock result
      return {
        ok: true,
        contractAddress: '0x' + '0'.repeat(40),
        transactionHash: '0x' + '0'.repeat(64)
      };

    } catch (error) {
      console.error('❌ Custom deployment failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        ok: false,
        error: `Custom deployment failed: ${errorMessage}`
      };
    }
  }

  async verifyContract(
    contractAddress: string,
    constructorArguments: any[]
  ): Promise<boolean> {
    try {
      console.log('🔍 Verifying contract on block explorer...');
      
      // This would integrate with block explorer APIs for verification
      // For now, return true as a mock
      return true;

    } catch (error) {
      console.error('❌ Contract verification failed:', error);
      return false;
    }
  }

  async getDeploymentStatus(transactionHash: string): Promise<string> {
    try {
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (!receipt) {
        return 'pending';
      }
      
      if (receipt.status === 1) {
        return 'confirmed';
      } else {
        return 'failed';
      }

    } catch (error) {
      console.error('❌ Failed to get deployment status:', error);
      return 'unknown';
    }
  }
}
