import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { BlockchainService } from '../services/blockchain';
import { DatabaseService } from '../services/database';

const router = express.Router();
const db = new DatabaseService();
const blockchainService = new BlockchainService(db, {} as any); // Notification service not needed for RPC tests

// Test Hoodi testnet connection
router.get('/test', asyncHandler(async (req, res) => {
  try {
    console.log('🧪 Testing Hoodi testnet connection...');
    
    // Get Hoodi network info
    const hoodiInfo = await blockchainService.getHoodiNetworkInfo();
    const currentProvider = blockchainService.getHoodiProvider();
    
    // Test basic connectivity
    const latestBlock = await currentProvider.getBlockNumber();
    const gasPrice = await currentProvider.getFeeData();
    
    const testResult = {
      success: true,
      message: 'Hoodi testnet connection test completed',
      hoodiInfo,
      connectivity: {
        latestBlock: latestBlock.toString(),
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        isConnected: true
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Hoodi testnet connection test passed');
    res.json(testResult);
    
  } catch (error) {
    console.error('❌ Hoodi testnet connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Hoodi testnet connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}));

// Get Hoodi testnet status
router.get('/status', asyncHandler(async (req, res) => {
  try {
    console.log('📊 Getting Hoodi testnet status...');
    
    const hoodiInfo = await blockchainService.getHoodiNetworkInfo();
    const currentProvider = blockchainService.getHoodiProvider();
    
    // Get detailed status
    const [latestBlock, gasPrice, peerCount] = await Promise.all([
      currentProvider.getBlockNumber(),
      currentProvider.getFeeData(),
      currentProvider.send('net_peerCount', [])
    ]);
    
    const status = {
      success: true,
      network: 'Hoodi Testnet',
      chainId: hoodiInfo.chainId,
      status: 'connected',
      details: {
        latestBlock: latestBlock.toString(),
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        peerCount: peerCount.toString(),
        blockExplorer: hoodiInfo.blockExplorer,
        nativeCurrency: hoodiInfo.nativeCurrency
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Hoodi testnet status retrieved successfully');
    res.json(status);
    
  } catch (error) {
    console.error('❌ Failed to get Hoodi testnet status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Hoodi testnet status',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}));

// Test Hoodi testnet fallback (for future use)
router.post('/test-fallback', asyncHandler(async (req, res) => {
  try {
    const { providerName } = req.body;
    
    if (!providerName) {
      return res.status(400).json({
        success: false,
        message: 'Provider name is required'
      });
    }
    
    console.log(`🔄 Testing Hoodi testnet fallback to: ${providerName}`);
    
    // For now, we only support Hoodi testnet
    // This endpoint is for future expansion
    const currentProvider = blockchainService.getHoodiProvider();
    const hoodiInfo = await blockchainService.getHoodiNetworkInfo();
    
    const result = {
      success: true,
      message: `Hoodi testnet is the only supported network`,
      currentNetwork: hoodiInfo,
      fallbackTest: 'Not applicable - single network mode',
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Hoodi testnet fallback test completed');
    res.json(result);
    
  } catch (error) {
    console.error('❌ Hoodi testnet fallback test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Hoodi testnet fallback test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}));

// Get Hoodi testnet health
router.get('/health', asyncHandler(async (req, res) => {
  try {
    console.log('🏥 Checking Hoodi testnet health...');
    
    const currentProvider = blockchainService.getHoodiProvider();
    
    // Perform health checks
    const [network, latestBlock, gasPrice] = await Promise.all([
      currentProvider.getNetwork(),
      currentProvider.getBlockNumber(),
      currentProvider.getFeeData()
    ]);
    
    const healthStatus = {
      success: true,
      status: 'healthy',
      network: {
        name: network.name,
        chainId: Number(network.chainId),
        isHoodi: Number(network.chainId) === 560048
      },
      connectivity: {
        latestBlock: latestBlock.toString(),
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        isConnected: true
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Hoodi testnet health check passed');
    res.json(healthStatus);
    
  } catch (error) {
    console.error('❌ Hoodi testnet health check failed:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      message: 'Hoodi testnet health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}));

export default router;