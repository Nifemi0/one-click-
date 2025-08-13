import { Router } from 'express';
import { BlockchainService } from '../services/blockchain';

const router = Router();

// Test RPC connectivity
router.get('/test', async (req, res) => {
  try {
    const blockchainService = req.app.locals.blockchainService as BlockchainService;
    
    if (!blockchainService) {
      return res.status(500).json({ error: 'Blockchain service not initialized' });
    }

    // Test basic connectivity
    const provider = await blockchainService.getProvider(560048);
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const currentProvider = await blockchainService.getCurrentRPCProvider();
    const rpcStatus = await blockchainService.getRPCStatus();
    const rpcStats = await blockchainService.getRPCStats();

    res.json({
      success: true,
      message: 'RPC connection successful',
      data: {
        chainId: network.chainId.toString(),
        chainName: network.name,
        blockNumber: blockNumber.toString(),
        currentProvider: currentProvider?.name || 'None',
        rpcStatus,
        rpcStats
      }
    });

  } catch (error) {
    console.error('RPC test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'RPC connection failed'
    });
  }
});

// Test RPC fallback
router.post('/test-fallback', async (req, res) => {
  try {
    const blockchainService = req.app.locals.blockchainService as BlockchainService;
    
    if (!blockchainService) {
      return res.status(500).json({ error: 'Blockchain service not initialized' });
    }

    const { providerName } = req.body;
    
    if (providerName) {
      // Test switching to specific provider
      const success = await blockchainService.switchRPCProvider(providerName);
      const currentProvider = await blockchainService.getCurrentRPCProvider();
      
      res.json({
        success: true,
        message: `Switched to provider: ${providerName}`,
        data: {
          switchSuccess: success,
          currentProvider: currentProvider?.name || 'None'
        }
      });
    } else {
      // Test automatic fallback
      const provider = await blockchainService.getProvider(560048);
      const network = await provider.getNetwork();
      const currentProvider = await blockchainService.getCurrentRPCProvider();
      
      res.json({
        success: true,
        message: 'Automatic fallback test successful',
        data: {
          chainId: network.chainId.toString(),
          currentProvider: currentProvider?.name || 'None'
        }
      });
    }

  } catch (error) {
    console.error('RPC fallback test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'RPC fallback test failed'
    });
  }
});

// Get RPC status
router.get('/status', async (req, res) => {
  try {
    const blockchainService = req.app.locals.blockchainService as BlockchainService;
    
    if (!blockchainService) {
      return res.status(500).json({ error: 'Blockchain service not initialized' });
    }

    const rpcStatus = await blockchainService.getRPCStatus();
    const rpcStats = await blockchainService.getRPCStats();
    const currentProvider = await blockchainService.getCurrentRPCProvider();

    res.json({
      success: true,
      data: {
        rpcStatus,
        rpcStats,
        currentProvider: currentProvider?.name || 'None'
      }
    });

  } catch (error) {
    console.error('Failed to get RPC status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test specific RPC endpoint
router.post('/test-endpoint', async (req, res) => {
  try {
    const { rpcUrl, chainId = 560048 } = req.body;
    
    if (!rpcUrl) {
      return res.status(400).json({ error: 'RPC URL is required' });
    }

    // Test the specific RPC endpoint
    const provider = new (await import('ethers')).JsonRpcProvider(rpcUrl);
    
    const startTime = Date.now();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      message: 'RPC endpoint test successful',
      data: {
        rpcUrl,
        chainId: network.chainId.toString(),
        chainName: network.name,
        blockNumber: blockNumber.toString(),
        responseTime: `${responseTime}ms`
      }
    });

  } catch (error) {
    console.error('RPC endpoint test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'RPC endpoint test failed'
    });
  }
});

export default router;