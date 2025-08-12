import express from 'express';
import { BasicTrapDeploymentService } from '../services/basicTrapDeployment';
import { DatabaseService } from '../services/database';
import { BlockchainService } from '../services/blockchain';
import { NotificationService } from '../services/notification';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Initialize services
const db = new DatabaseService();
const blockchain = new BlockchainService(db);
const notification = new NotificationService(db);
const basicTrapService = new BasicTrapDeploymentService(db, blockchain, notification);

// =====================================================
// BASIC TRAP DEPLOYMENT ROUTES
// =====================================================

/**
 * @route GET /api/basic-traps/templates
 * @desc Get available trap templates
 * @access Public
 */
router.get('/templates', async (req, res) => {
  try {
    const templates = basicTrapService.getTrapTemplates();
    
    res.json({
      success: true,
      data: templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        type: template.type,
        complexity: template.complexity,
        estimatedCost: template.estimatedCost,
        estimatedGas: template.estimatedGas,
        features: template.features
      }))
    });

  } catch (error) {
    console.error('Failed to get trap templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trap templates',
      error: error.message
    });
  }
});

/**
 * @route POST /api/basic-traps/deploy
 * @desc Deploy basic trap with one click
 * @access Private
 */
router.post('/deploy', authenticateToken, async (req, res) => {
  try {
    const {
      trapType,
      network,
      customName,
      customDescription
    } = req.body;

    // Validate required fields
    if (!trapType || !network) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: trapType, network'
      });
    }

    // Validate trap type
    const validTypes = ['honeypot', 'sandbox', 'monitoring', 'basic'];
    if (!validTypes.includes(trapType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid trap type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    // Create deployment request
    const deploymentRequest = {
      userId: req.user.id,
      trapType,
      network: parseInt(network),
      customName,
      customDescription
    };

    // Deploy trap
    const trap = await basicTrapService.deployBasicTrap(deploymentRequest);

    res.status(201).json({
      success: true,
      message: 'Basic trap deployment started successfully',
      data: {
        trapId: trap.id,
        trapName: trap.trapName,
        trapType: trap.trapType,
        status: trap.status,
        estimatedCost: trap.estimatedCost,
        network: trap.network
      }
    });

  } catch (error) {
    console.error('Basic trap deployment failed:', error);
    res.status(500).json({
      success: false,
      message: 'Basic trap deployment failed',
      error: error.message
    });
  }
});

/**
 * @route GET /api/basic-traps
 * @desc Get user's basic traps
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const traps = await basicTrapService.getUserTraps(req.user.id);
    
    res.json({
      success: true,
      data: traps
    });

  } catch (error) {
    console.error('Failed to get user traps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user traps',
      error: error.message
    });
  }
});

/**
 * @route GET /api/basic-traps/:id
 * @desc Get specific basic trap details
 * @access Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const trap = await basicTrapService.getTrapById(id);
    
    if (!trap) {
      return res.status(404).json({
        success: false,
        message: 'Trap not found'
      });
    }

    // Check if user owns this trap
    if (trap.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: trap
    });

  } catch (error) {
    console.error('Failed to get trap details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trap details',
      error: error.message
    });
  }
});

/**
 * @route GET /api/basic-traps/:id/contract
 * @desc Get trap contract code
 * @access Private
 */
router.get('/:id/contract', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const trap = await basicTrapService.getTrapById(id);
    
    if (!trap) {
      return res.status(404).json({
        success: false,
        message: 'Trap not found'
      });
    }

    // Check if user owns this trap
    if (trap.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get contract code from template
    const templates = basicTrapService.getTrapTemplates();
    const template = templates.find(t => t.type === trap.trapType);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: {
        contractCode: template.contractCode,
        contractName: template.name,
        trapType: template.type,
        features: template.features
      }
    });

  } catch (error) {
    console.error('Failed to get contract code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contract code',
      error: error.message
    });
  }
});

/**
 * @route GET /api/basic-traps/:id/status
 * @desc Get trap deployment status
 * @access Private
 */
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const trap = await basicTrapService.getTrapById(id);
    
    if (!trap) {
      return res.status(404).json({
        success: false,
        message: 'Trap not found'
      });
    }

    // Check if user owns this trap
    if (trap.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: trap.id,
        status: trap.status,
        estimatedCost: trap.estimatedCost,
        actualCost: trap.actualCost,
        contractAddress: trap.contractAddress,
        deploymentTxHash: trap.deploymentTxHash,
        createdAt: trap.createdAt,
        deployedAt: trap.deployedAt
      }
    });

  } catch (error) {
    console.error('Failed to get trap status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trap status',
      error: error.message
    });
  }
});

export default router;