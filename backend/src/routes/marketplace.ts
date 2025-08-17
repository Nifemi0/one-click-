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

  // Get marketplace categories
  router.get('/categories', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /categories endpoint called');
    try {
      const categories = [
        {
          id: 'security',
          name: 'Security',
          description: 'Security-focused trap templates',
          count: 15,
          icon: '🛡️'
        },
        {
          id: 'monitoring',
          name: 'Monitoring',
          description: 'Monitoring and surveillance traps',
          count: 8,
          icon: '👁️'
        },
        {
          id: 'honeypot',
          name: 'Honeypot',
          description: 'Honeypot trap templates',
          count: 12,
          icon: '🍯'
        },
        {
          id: 'governance',
          name: 'Governance',
          description: 'Governance and voting traps',
          count: 6,
          icon: '🗳️'
        },
        {
          id: 'defi',
          name: 'DeFi',
          description: 'DeFi protocol traps',
          count: 10,
          icon: '💰'
        }
      ];
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('❌ Marketplace /categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get marketplace complexities
  router.get('/complexities', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /complexities endpoint called');
    try {
      const complexities = [
        {
          id: 'basic',
          name: 'Basic',
          description: 'Simple trap templates for beginners',
          count: 20,
          icon: '🟢'
        },
        {
          id: 'intermediate',
          name: 'Intermediate',
          description: 'Moderate complexity traps',
          count: 15,
          icon: '🟡'
        },
        {
          id: 'advanced',
          name: 'Advanced',
          description: 'Complex trap templates for experts',
          count: 8,
          icon: '🔴'
        }
      ];
      
      res.json({
        success: true,
        data: complexities
      });
    } catch (error) {
      console.error('❌ Marketplace /complexities error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get complexities',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get marketplace stats
  router.get('/stats', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /stats endpoint called');
    try {
      const stats = {
        totalTemplates: 43,
        totalUsers: 156,
        totalDeployments: 289,
        totalRevenue: '12.5 ETH',
        topCategory: 'Security',
        mostPopularTemplate: 'Basic Honeypot',
        averageRating: 4.2
      };
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Marketplace /stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get featured templates
  router.get('/featured', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /featured endpoint called');
    try {
      const featured = [
        {
          id: 'honeypot_basic',
          name: 'Basic Honeypot',
          description: 'Simple honeypot that looks like a legitimate contract',
          type: 'honeypot',
          complexity: 'simple',
          rating: 4.5,
          downloads: 156,
          featured: true
        },
        {
          id: 'security_monitoring',
          name: 'Security Monitor',
          description: 'Advanced security monitoring trap',
          type: 'monitoring',
          complexity: 'intermediate',
          rating: 4.8,
          downloads: 89,
          featured: true
        }
      ];
      
      res.json({
        success: true,
        data: featured
      });
    } catch (error) {
      console.error('❌ Marketplace /featured error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get featured templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // Get trending templates
  router.get('/trending', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /trending endpoint called');
    try {
      const trending = [
        {
          id: 'honeypot_advanced',
          name: 'Advanced Honeypot',
          description: 'Sophisticated honeypot with realistic DeFi interface',
          type: 'honeypot',
          complexity: 'medium',
          rating: 4.6,
          downloads: 234,
          trending: true
        },
        {
          id: 'governance_trap',
          name: 'Governance Trap',
          description: 'Governance and voting manipulation trap',
          type: 'governance',
          complexity: 'advanced',
          rating: 4.3,
          downloads: 67,
          trending: true
        }
      ];
      
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

  // Search templates
  router.get('/search', asyncHandler(async (req, res) => {
    console.log('🔧 Marketplace /search endpoint called');
    try {
      const { q, category, complexity } = req.query;
      
      // Mock search results
      const searchResults = [
        {
          id: 'search_result_1',
          name: 'Search Result 1',
          description: 'Template matching search criteria',
          type: 'security',
          complexity: 'basic',
          rating: 4.2
        }
      ];
      
      res.json({
        success: true,
        data: searchResults,
        query: { q, category, complexity }
      });
    } catch (error) {
      console.error('❌ Marketplace /search error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search templates',
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
