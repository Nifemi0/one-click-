import * as express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

// Create a function that returns the router with injected services
export function createRpcTestRouter(blockchainService: any, databaseService: any) {
  const router = express.Router();
  
  console.log('🔧 Creating RPC Test router with services:', !!blockchainService, !!databaseService);
  
  // Test Hoodi testnet connection
  router.get('/test', asyncHandler(async (req, res) => {
    console.log('🔧 RPC Test /test endpoint called');
    try {
      const networkInfo = await blockchainService.getHoodiNetworkInfo();
      res.json({
        success: true,
        message: 'Hoodi testnet connection test',
        status: 'Connected',
        networkInfo
      });
    } catch (error) {
      console.error('❌ RPC Test /test error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test Hoodi connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get Hoodi testnet status
  router.get('/status', asyncHandler(async (req, res) => {
    console.log('🔧 RPC Test /status endpoint called');
    try {
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
      console.error('❌ RPC Test /status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get Hoodi status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get gas price
  router.get('/gas-price', asyncHandler(async (req, res) => {
    console.log('🔧 RPC Test /gas-price endpoint called');
    try {
      const gasPrice = await blockchainService.getGasPrice();
      res.json({
        success: true,
        message: 'Hoodi testnet gas price',
        gasPrice,
        network: 'Hoodi Testnet'
      });
    } catch (error) {
      console.error('❌ RPC Test /gas-price error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get gas price',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  console.log('✅ RPC Test router created with endpoints:', router.stack.length);
  return router;
}

// Keep the old export for backward compatibility
export default express.Router();
