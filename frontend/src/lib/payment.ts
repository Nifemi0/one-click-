import { ethers } from 'ethers';
import { blockchainService } from './blockchain';

export interface PaymentRequest {
  amount: number; // Amount in ETH
  recipient: string; // Contract address
  gasLimit?: number;
  gasPrice?: number;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  gasUsed?: string;
  totalCost?: string;
  error?: string;
}

export interface PaymentVerification {
  isVerified: boolean;
  blockNumber?: number;
  confirmations?: number;
  status: 'pending' | 'confirmed' | 'failed';
  error?: string;
}

export class PaymentService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        window.ethereum.on('accountsChanged', () => {
          this.initializeProvider(); // Re-initialize when account changes
        });

        console.log('Payment service provider initialized');
      } catch (error) {
        console.error('Failed to initialize payment provider:', error);
      }
    }
  }

  async getBalance(): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async estimateGas(request: PaymentRequest): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const amountInWei = ethers.parseEther(request.amount.toString());
      
      // Estimate gas for the transaction
      const gasEstimate = await this.provider!.estimateGas({
        to: request.recipient,
        value: amountInWei,
        gasLimit: request.gasLimit || 21000
      });

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

  async sendPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      // Ensure we're on Hoodi testnet
      await blockchainService.switchToHoodiTestnet();

      const amountInWei = ethers.parseEther(request.amount.toString());
      
      // Get current gas price if not specified
      const feeData = await this.provider!.getFeeData();
      const gasPrice = request.gasPrice || feeData.gasPrice;
      
      if (!gasPrice) {
        throw new Error('Unable to get gas price');
      }
      
      // Ensure gasPrice is a bigint
      const gasPriceBigInt = BigInt(gasPrice);
      
      // Create transaction
      const tx = await this.signer.sendTransaction({
        to: request.recipient,
        value: amountInWei,
        gasLimit: request.gasLimit || 21000,
        gasPrice: gasPriceBigInt
      });

      console.log('Payment transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error('Transaction receipt not received');
      }
      
      console.log('Payment confirmed in block:', receipt.blockNumber);

      // Calculate gas used
      const gasUsed = receipt.gasUsed;
      const totalGasCost = gasUsed * gasPriceBigInt;
      const totalCost = amountInWei + totalGasCost;
      
      return {
        success: true,
        transactionHash: tx.hash,
        gasUsed: ethers.formatEther(totalGasCost),
        totalCost: ethers.formatEther(totalCost)
      };
    } catch (error: any) {
      console.error('Payment failed:', error);
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    }
  }

  async verifyPayment(transactionHash: string): Promise<PaymentVerification> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const tx = await this.provider.getTransaction(transactionHash);
      if (!tx) {
        return {
          isVerified: false,
          status: 'failed',
          error: 'Transaction not found'
        };
      }

      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      if (!receipt) {
        return {
          isVerified: false,
          status: 'pending'
        };
      }

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        isVerified: true,
        blockNumber: receipt.blockNumber,
        confirmations,
        status: confirmations >= 12 ? 'confirmed' : 'pending'
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        isVerified: false,
        status: 'failed',
        error: 'Verification failed'
      };
    }
  }

  async getTransactionHistory(address: string, limit: number = 10): Promise<any[]> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      // This would typically integrate with a blockchain indexer
      // For now, we'll return a placeholder
      console.log('Transaction history requested for:', address);
      return [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  async validatePaymentAmount(amount: number, userBalance: string): Promise<boolean> {
    try {
      const balanceInEth = parseFloat(userBalance);
      const requiredAmount = amount + 0.01; // Add buffer for gas fees
      
      return balanceInEth >= requiredAmount;
    } catch (error) {
      console.error('Failed to validate payment amount:', error);
      return false;
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
export const paymentService = new PaymentService();
