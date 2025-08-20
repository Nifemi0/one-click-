import express from 'express';
import { DroseraRegistryService, TrapRegistrationData } from '../services/droseraRegistryService';
import { DatabaseService } from '../services/database';
import { NotificationService } from '../services/notification';

const router = express.Router();

// Initialize services
const db = new DatabaseService();
const notification = new NotificationService(db);
const registryService = new DroseraRegistryService(db, notification);

/**
 * @route POST /api/registry/register
 * @desc Register a deployed security trap in the Drosera registry
 * @access Public (but requires valid deployment data)
 */
router.post('/register', async (req, res) => {
  try {
    const {
      contractAddress,
      trapType,
      trapName,
      description,
      deployerAddress,
      network,
      chainId,
      deploymentTxHash,
      metadata
    } = req.body;

    // Validate required fields
    if (!contractAddress || !trapType || !trapName || !description || !deployerAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: contractAddress, trapType, trapName, description, deployerAddress'
      });
    }

    // Validate contract address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contract address format'
      });
    }

    // Validate deployer address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(deployerAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid deployer address format'
      });
    }

    // Check if service is initialized
    if (!registryService.isInitialized()) {
      return res.status(503).json({
        success: false,
        error: 'Drosera Registry service not initialized'
      });
    }

    // Prepare registration data
    const registrationData: TrapRegistrationData = {
      contractAddress,
      trapType,
      trapName,
      description,
      deployerAddress,
      network: network || 'Hoodi Testnet',
      chainId: chainId || 560048,
      deploymentTxHash: deploymentTxHash || '',
      metadata: metadata || {}
    };

    console.log('📝 Registering trap:', registrationData);

    // Register the trap
    const result = await registryService.registerTrap(registrationData);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          trapId: result.trapId,
          transactionHash: result.transactionHash,
          contractAddress,
          trapType,
          trapName
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error: any) {
    console.error('❌ Registry registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/registry/status
 * @desc Get the status of the Drosera Registry service
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = registryService.getStatus();
    
    return res.status(200).json({
      success: true,
      data: {
        service: 'Drosera Registry',
        status: status.initialized ? 'operational' : 'initializing',
        details: status
      }
    });
  } catch (error: any) {
    console.error('❌ Registry status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/drosera-registry/traps
 * @desc Get paginated traps for frontend display
 * @access Public
 */
router.get('/traps', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    
    if (page < 0 || pageSize <= 0 || pageSize > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page or pageSize parameters'
      });
    }

    const traps = await registryService.getTrapsPaginated(page, pageSize);
    
    if (traps) {
      return res.status(200).json({
        success: true,
        data: traps
      });
    } else {
      return res.status(503).json({
        success: false,
        error: 'Registry service not available'
      });
    }
  } catch (error: any) {
    console.error('❌ Get traps error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/drosera-registry/stats
 * @desc Get registry statistics
 * @access Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await registryService.getRegistryStats();
    
    if (stats) {
      return res.status(200).json({
        success: true,
        data: stats
      });
    } else {
      return res.status(503).json({
        success: false,
        error: 'Registry service not available'
      });
    }
  } catch (error: any) {
    console.error('❌ Registry stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/registry/trap/:trapId
 * @desc Get information about a specific trap
 * @access Public
 */
router.get('/trap/:trapId', async (req, res) => {
  try {
    const trapId = parseInt(req.params.trapId);
    
    if (isNaN(trapId) || trapId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trap ID'
      });
    }

    const trapInfo = await registryService.getTrapInfo(trapId);
    
    if (trapInfo) {
      return res.status(200).json({
        success: true,
        data: trapInfo
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Trap not found'
      });
    }
  } catch (error: any) {
    console.error('❌ Get trap info error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/registry/deployer/:address
 * @desc Get all traps deployed by a specific address
 * @access Public
 */
router.get('/deployer/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format'
      });
    }

    const traps = await registryService.getDeployerTraps(address);
    
    return res.status(200).json({
      success: true,
      data: {
        deployer: address,
        traps,
        count: traps.length
      }
    });
  } catch (error: any) {
    console.error('❌ Get deployer traps error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/registry/type/:trapType
 * @desc Get all traps of a specific type
 * @access Public
 */
router.get('/type/:trapType', async (req, res) => {
  try {
    const { trapType } = req.params;
    
    if (!trapType || trapType.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Trap type is required'
      });
    }

    const traps = await registryService.getTrapsByType(trapType.trim());
    
    return res.status(200).json({
      success: true,
      data: {
        trapType: trapType.trim(),
        traps,
        count: traps.length
      }
    });
  } catch (error: any) {
    console.error('❌ Get traps by type error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/registry/check/:contractAddress
 * @desc Check if a contract is already registered
 * @access Public
 */
router.get('/check/:contractAddress', async (req, res) => {
  try {
    const { contractAddress } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contract address format'
      });
    }

    const isRegistered = await registryService.isContractRegistered(contractAddress);
    
    return res.status(200).json({
      success: true,
      data: {
        contractAddress,
        isRegistered
      }
    });
  } catch (error: any) {
    console.error('❌ Check contract registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route POST /api/registry/update/:trapId
 * @desc Update trap status and metadata
 * @access Public (but requires valid trap ID)
 */
router.post('/update/:trapId', async (req, res) => {
  try {
    const trapId = parseInt(req.params.trapId);
    const { newStatus, newMetadata } = req.body;
    
    if (isNaN(trapId) || trapId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trap ID'
      });
    }

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: 'New status is required'
      });
    }

    const result = await registryService.updateTrap(trapId, newStatus, newMetadata || {});
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          trapId,
          newStatus,
          transactionHash: result.transactionHash
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    console.error('❌ Update trap error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route POST /api/registry/grant-access
 * @desc Grant registry access to a user (owner only)
 * @access Private (requires owner privileges)
 */
router.post('/grant-access', async (req, res) => {
  try {
    const { userAddress } = req.body;
    
    if (!userAddress || !/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Valid user address is required'
      });
    }

    const result = await registryService.grantAccess(userAddress);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          userAddress,
          transactionHash: result.transactionHash
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    console.error('❌ Grant access error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router;
