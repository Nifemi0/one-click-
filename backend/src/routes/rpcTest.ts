import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { BlockchainService } from '../services/blockchain';
import { DatabaseService } from '../services/database';

const router = express.Router();

// Don't instantiate services here - they'll be passed from the main app
let db: DatabaseService;
let blockchainService: BlockchainService;

// Function to set the services (called from main app)
export const setServices = (database: DatabaseService, blockchain: BlockchainService) => {
  db = database;
  blockchainService = blockchain;
};

// Test Hoodi testnet connection
router.get('/test', asyncHandler(async (req, res) => {
  try {
    // Check if services are available
    if (!blockchainService) {
      return res.status(500).json({
        success: false,
        message: 'Blockchain service not initialized'
      });
    }
    
    // Use existing methods from BlockchainService
    const networkInfo = await blockchainService.getHoodiNetworkInfo();
    res.json({
      success: true,
      message: 'Hoodi testnet connection test',
      status: 'Connected',
      networkInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to test Hoodi connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get Hoodi testnet status
router.get('/status', asyncHandler(async (req, res) => {
  try {
    // Check if services are available
    if (!blockchainService) {
      return res.status(500).json({
        success: false,
        message: 'Blockchain service not initialized'
      });
    }
    
    // Use existing methods from BlockchainService
    const networkInfo = await blockchainService.getHoodiNetworkInfo();
    const gasPrice = await blockchainService.getGasPrice();
    
    res.json({
      success: true,
      message: 'Hoodi testnet status',
      status: 'Operational',
      network: 'Hoodi Testnet',
      chainId: 560048,
      networkInfo,
      gasPrice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get Hoodi status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get Hoodi testnet balance (using contract balance method)
router.get('/balance/:address', asyncHandler(async (req, res) => {
  try {
    // Check if services are available
    if (!blockchainService) {
      return res.status(500).json({
        success: false,
        message: 'Blockchain service not initialized'
      });
    }
    
    const { address } = req.params;
    // Note: getContractBalance is for contracts, but we'll use it for testing
    const balance = await blockchainService.getContractBalance(address);
    res.json({
      success: true,
      message: 'Hoodi testnet balance',
      address,
      balance,
      network: 'Hoodi Testnet',
      note: 'This shows contract balance if address is a contract'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get Hoodi balance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get gas price
router.get('/gas-price', asyncHandler(async (req, res) => {
  try {
    // Check if services are available
    if (!blockchainService) {
      return res.status(500).json({
        success: false,
        message: 'Blockchain service not initialized'
      });
    }
    
    const gasPrice = await blockchainService.getGasPrice();
    res.json({
      success: true,
      message: 'Hoodi testnet gas price',
      gasPrice,
      network: 'Hoodi Testnet'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get gas price',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

export default router;
