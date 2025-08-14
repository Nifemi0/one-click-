import express from 'express';

const router = express.Router();

// Simple route handlers
router.get('/overview', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalTemplates: 6,
        totalUsers: 0,
        totalDeployments: 0,
        totalRevenue: 0,
        topCategories: ['Security', 'Monitoring', 'Honeypot'],
        trendingTemplates: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Marketplace overview failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/templates', async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        {
          id: 'honeypot_basic',
          name: 'Basic Honeypot',
          description: 'Simple honeypot that looks like a legitimate contract',
          category: 'honeypot',
          complexity: 'simple',
          estimated_cost: '0.008 ETH'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Templates failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
