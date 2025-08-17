import * as express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

// Create a function that returns the router with injected services
export function createMarketplaceRouter(databaseService: any) {
  const router = express.Router();
  
  console.log('🔧 Creating Marketplace router with service:', !!databaseService);
  
  // Get marketplace overview
  router.get('/overview', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /overview endpoint called');
    try {
      const templates = await databaseService.getTrapTemplates();
      const userCount = await databaseService.getUserCount();
      
      const overview = {
        totalTemplates: templates.length,
        totalUsers: userCount,
        totalDeployments: 0,
        totalRevenue: 0,
        topCategories: ['Security', 'Monitoring', 'Honeypot'],
        trendingTemplates: templates.slice(0, 5)
      };
      
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('❌ Marketplace /overview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get marketplace overview',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get trap templates
  router.get('/templates', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /templates endpoint called');
    try {
      const templates = await databaseService.getTrapTemplates();
      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('❌ Marketplace /templates error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get trap templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get trending templates
  router.get('/trending', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /trending endpoint called');
    try {
      const templates = await databaseService.getTrapTemplates();
      const trending = templates.slice(0, 5);
      res.json({
        success: true,
        data: trending
      });
    } catch (error) {
      console.error('❌ Marketplace /trending error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get trending templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get recent activity
  router.get('/activity', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /activity endpoint called');
    try {
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
      console.error('❌ Marketplace /activity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recent activity',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  console.log('✅ Marketplace router created with endpoints:', router.stack.length);
  return router;
}

// Keep the old export for backward compatibility
export default express.Router();
