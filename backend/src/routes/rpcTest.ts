import { Router } from 'express';
import { BlockchainService } from '../services/blockchain';
import { DatabaseService } from '../services/database';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const db = new DatabaseService();
const blockchainService = new BlockchainService(db, {} as any);

// Test RPC connection
router.get('/test', async (req, res) => {
  try {
    const { chainId = 560048 } = req.query;
    const provider = blockchainService.getProvider(parseInt(chainId as string));
    
    if (!provider) {
      res.status(400).json({
        success: false,
        error: 'No provider available for this chain ID'
      });
      return;
    }

    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const currentProvider = await blockchainService.getCurrentRPCProvider();
    const rpcStatus = await blockchainService.getRPCStatus();
    const rpcStats = await blockchainService.getRPCStats();

    res.json({
      success: true,
      data: {
        chainId: network.chainId.toString(),
        networkName: network.name,
        blockNumber: blockNumber.toString(),
        currentProvider,
        rpcStatus,
        rpcStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('RPC test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to test RPC connection'
    });
  }
});

// Test RPC fallback
router.post('/test-fallback', async (req, res) => {
  try {
    const { providerName, chainId = 560048 } = req.body;
    
    if (!providerName) {
      res.status(400).json({
        success: false,
        error: 'Provider name is required'
      });
      return;
    }

    // Switch to specified provider
    const success = await blockchainService.switchRPCProvider(providerName);
    
    if (success) {
      const provider = blockchainService.getProvider(parseInt(chainId));
      const network = await provider!.getNetwork();
      const currentProvider = await blockchainService.getCurrentRPCProvider();
      
      res.json({
        success: true,
        data: {
          message: `Successfully switched to ${providerName}`,
          chainId: network.chainId.toString(),
          networkName: network.name,
          currentProvider,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: `Failed to switch to provider ${providerName}`
      });
    }
  } catch (error) {
    console.error('RPC fallback test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to test RPC fallback'
    });
  }
});

// Get RPC status
router.get('/status', async (req, res) => {
  try {
    const rpcStatus = await blockchainService.getRPCStatus();
    const rpcStats = await blockchainService.getRPCStats();
    const currentProvider = await blockchainService.getCurrentRPCProvider();
    
    res.json({
      success: true,
      data: {
        rpcStatus,
        rpcStats,
        currentProvider,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to get RPC status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test specific endpoint
router.post('/test-endpoint', async (req, res) => {
  try {
    const { endpoint, chainId = 560048, method = 'GET', params = {} } = req.body;
    
    if (!endpoint) {
      res.status(400).json({
        success: false,
        error: 'Endpoint is required'
      });
      return;
    }

    const provider = blockchainService.getProvider(parseInt(chainId));
    
    if (!provider) {
      res.status(400).json({
        success: false,
        error: 'No provider available for this chain ID'
      });
      return;
    }

    // Test the endpoint
    let result;
    try {
      // Use the provider's request method for custom RPC calls
      if (method === 'POST') {
        result = await provider.send(endpoint, params);
      } else {
        result = await provider.send(endpoint, params);
      }
    } catch (error) {
      // Fallback to basic provider methods
      result = {
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'fallback'
      };
    }

    res.json({
      success: true,
      data: {
        endpoint,
        method,
        params,
        result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Endpoint test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to test endpoint'
    });
  }
});

export default router;