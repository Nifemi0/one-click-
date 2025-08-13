import { Router } from 'express';
import { DatabaseService } from '../services/database';
import { BlockchainService } from '../services/blockchain';
import { NotificationService } from '../services/notification';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRole } from '../middleware/auth';

const router = Router();
const db = new DatabaseService();
const blockchain = new BlockchainService(db, {} as any);
const notification = new NotificationService(db);

// Get all deployed traps for the authenticated user
router.get('/', asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    const { 
      status, 
      chainId, 
      limit = '50', 
      offset = '0',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (chainId) filters.chain_id = parseInt(chainId as string);

    const options = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const traps = await db.getDeployedTrapsByUser(userId, filters, options);
    
    res.json({
      success: true,
      data: traps,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        total: traps.length
      }
    });
  } catch (error) {
    console.error('Failed to get deployed traps:', error);
    res.status(500).json({
      error: 'Failed to get deployed traps',
      message: 'An error occurred while retrieving deployed traps'
    });
  }
}));

// Get a specific deployed trap
router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    const trap = await db.getDeployedTrap(id);
    
    if (!trap) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Deployed trap not found'
      });
      return;
    }

    // Check if user owns this trap
    if (trap.user_id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this trap'
      });
      return;
    }

    res.json({
      success: true,
      data: trap
    });
  } catch (error) {
    console.error('Failed to get deployed trap:', error);
    res.status(500).json({
      error: 'Failed to get deployed trap',
      message: 'An error occurred while retrieving the trap'
    });
  }
}));

// Deploy a new trap
router.post('/deploy', asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    const { 
      templateId, 
      constructorArgs = [], 
      chainId = 560048
    } = req.body;

    if (!templateId) {
      res.status(400).json({
        error: 'Missing template ID',
        message: 'Template ID is required'
      });
      return;
    }

    // Get user's wallet address
    const user = await db.getUser(userId);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
      return;
    }

    // Get user balance and estimate deployment cost
    const userBalance = await blockchain.getBalance(user.wallet_address, chainId);
    const estimatedCost = await blockchain.calculateDeploymentCost(
      templateId,
      constructorArgs,
      chainId
    );

    // Check if user has sufficient balance
    const balanceInEth = parseFloat(userBalance);
    const estimatedCostInEth = parseFloat(estimatedCost.replace(' ETH', ''));
    
    if (balanceInEth < estimatedCostInEth) {
      res.status(400).json({
        error: 'Insufficient balance',
        message: `Insufficient balance. Required: ${estimatedCost}, Available: ${userBalance}`
      });
      return;
    }

    // Deploy the trap
    const deployment = await blockchain.deploySecurityTrap(
      userId,
      templateId,
      constructorArgs,
      chainId
    );

    res.json({
      success: true,
      data: deployment,
      message: 'Trap deployment initiated successfully'
    });
  } catch (error) {
    console.error('Failed to deploy trap:', error);
    res.status(500).json({
      error: 'Failed to deploy trap',
      message: 'An error occurred while deploying the trap'
    });
  }
}));

// Update deployed trap status
router.patch('/:id/status', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    if (!['active', 'inactive', 'compromised'].includes(status)) {
      res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: active, inactive, compromised'
      });
      return;
    }

    const trap = await db.getDeployedTrap(id);
    
    if (!trap) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Deployed trap not found'
      });
      return;
    }

    if (trap.user_id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this trap'
      });
      return;
    }

    const updatedTrap = await db.updateDeployedTrap(id, { status });
    
    res.json({
      success: true,
      data: updatedTrap,
      message: 'Trap status updated successfully'
    });
  } catch (error) {
    console.error('Failed to update trap status:', error);
    res.status(500).json({
      error: 'Failed to update trap status',
      message: 'An error occurred while updating the trap status'
    });
  }
}));

// Delete deployed trap
router.delete('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    const trap = await db.getDeployedTrap(id);
    
    if (!trap) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Deployed trap not found'
      });
      return;
    }

    if (trap.user_id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this trap'
      });
      return;
    }

    await db.query('DELETE FROM deployed_traps WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Trap deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete trap:', error);
    res.status(500).json({
      error: 'Failed to delete trap',
      message: 'An error occurred while deleting the trap'
    });
  }
}));

// Rate a trap template
router.post('/:id/rate', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be between 1 and 5'
      });
      return;
    }

    // Check if user has already rated this template
    const existingRating = await db.query(
      'SELECT * FROM template_ratings WHERE template_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingRating.rows.length > 0) {
      res.status(400).json({
        error: 'Already rated',
        message: 'You have already rated this template'
      });
      return;
    }

    // Create the rating
    await db.query(
      'INSERT INTO template_ratings (template_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [id, userId, rating, comment || '']
    );
    
    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Failed to submit rating:', error);
    res.status(500).json({
      error: 'Failed to submit rating',
      message: 'An error occurred while submitting the rating'
    });
  }
}));

// Get trap template ratings
router.get('/:id/ratings', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = '20', offset = '0' } = req.query;

    const ratings = await db.query(
      'SELECT r.*, u.wallet_address FROM template_ratings r JOIN users u ON r.user_id = u.id WHERE r.template_id = $1 ORDER BY r.created_at DESC LIMIT $2 OFFSET $3',
      [id, parseInt(limit as string), parseInt(offset as string)]
    );
    
    res.json({
      success: true,
      data: ratings.rows,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: ratings.rows.length
      }
    });
  } catch (error) {
    console.error('Failed to get template ratings:', error);
    res.status(500).json({
      error: 'Failed to get template ratings',
      message: 'An error occurred while retrieving ratings'
    });
  }
}));

// Get user's trap statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    const stats = await db.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Failed to get trap statistics:', error);
    res.status(500).json({
      error: 'Failed to get trap statistics',
      message: 'An error occurred while retrieving statistics'
    });
  }
}));

// Get popular trap templates
router.get('/templates/popular', asyncHandler(async (req, res) => {
  try {
    const { limit = '10' } = req.query;

    const templates = await db.getTrapTemplates({}, { limit: parseInt(limit as string) });
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Failed to get popular templates:', error);
    res.status(500).json({
      error: 'Failed to get popular templates',
      message: 'An error occurred while retrieving templates'
    });
  }
}));

// Get trap template categories
router.get('/templates/categories', asyncHandler(async (req, res) => {
  try {
    const categories = await db.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Failed to get template categories:', error);
    res.status(500).json({
      error: 'Failed to get template categories',
      message: 'An error occurred while retrieving categories'
    });
  }
}));

// Get trap template complexities
router.get('/templates/complexities', asyncHandler(async (req, res) => {
  try {
    const complexities = await db.getComplexities();
    
    res.json({
      success: true,
      data: complexities
    });
  } catch (error) {
    console.error('Failed to get template complexities:', error);
    res.status(500).json({
      error: 'Failed to get template complexities',
      message: 'An error occurred while retrieving complexities'
    });
  }
}));

export default router;