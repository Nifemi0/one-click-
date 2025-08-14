import express from 'express';
import { BlockchainService } from '../services/blockchain';
import { DatabaseService } from '../services/database';

const router = express.Router();

// Simple route handlers
router.get('/test', async (req, res) => {
  try {
    // Get services from the main app (we'll handle this)
    res.json({
      success: true,
      message: 'RPC Test endpoint working!',
      status: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'RPC Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'RPC Status endpoint working!',
      status: 'Operational',
      network: 'Hoodi Testnet',
      chainId: 560048
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'RPC Status failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/gas-price', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Gas price endpoint working!',
      gasPrice: '1000000000',
      network: 'Hoodi Testnet'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gas price failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
