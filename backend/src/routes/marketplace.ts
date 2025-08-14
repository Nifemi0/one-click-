import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { DatabaseService } from '../services/database';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Don't instantiate services here - they'll be passed from the main app
let db: DatabaseService;

// Function to set the database service (called from main app)
export const setMarketplaceDatabaseService = (database: DatabaseService) => {
  db = database;
};

// Get marketplace overview
router.get('/overview', asyncHandler(async (req, res) => {
  try {
    // Check if service is available
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database service not initialized'
      });
    }
    
    // Use existing methods from DatabaseService
    const templates = await db.getTrapTemplates();
    const userCount = await db.getUserCount();
    
    const overview = {
      totalTemplates: templates.length,
      totalUsers: userCount,
      totalDeployments: 0, // Will be implemented later
      totalRevenue: 0, // Will be implemented later
      topCategories: ['Security', 'Monitoring', 'Honeypot'],
      trendingTemplates: templates.slice(0, 5)
    };
    
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get marketplace overview',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get trap templates
router.get('/templates', asyncHandler(async (req, res) => {
  try {
    // Check if service is available
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database service not initialized'
      });
    }
    
    const templates = await db.getTrapTemplates();
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get trap templates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get trending templates
router.get('/trending', asyncHandler(async (req, res) => {
  try {
    // Check if service is available
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database service not initialized'
      });
    }
    
    const templates = await db.getTrapTemplates();
    const trending = templates.slice(0, 5); // Get first 5 as trending
    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get trending templates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get recent activity
router.get('/activity', asyncHandler(async (req, res) => {
  try {
    // For now, return mock activity data
    const activity = [
      {
        id: 1,
        type: 'deployment',
        user: '0x1234...',
        template: 'Basic Security Trap',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'template_created',
        user: '0x5678...',
        template: 'Advanced Honeypot',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get recent activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

export default router;
