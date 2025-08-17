import express from 'express';
import { BasicTrapDeploymentService } from '../services/basicTrapDeployment';
import { DatabaseService } from '../services/database';
import { BlockchainService } from '../services/blockchain';
import { NotificationService } from '../services/notification';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Don't instantiate services here - they'll be passed from the main app
let basicTrapService: BasicTrapDeploymentService;

// Function to set the service (called from main app)
export const setBasicTrapService = (service: BasicTrapDeploymentService) => {
  basicTrapService = service;
};

router.get('/templates', async (req, res) => {
  try {
    const templates = await basicTrapService.getTrapTemplates();
    res.json({
      success: true,
      data: templates,
      message: 'Basic trap templates retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve templates',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Basic traps service is healthy',
      timestamp: new Date().toISOString(),
      service: 'Basic Traps'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Service health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/deploy', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Deploy endpoint' });
});

router.get('/', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Get traps endpoint' });
});

router.get('/:id', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Get trap by ID endpoint' });
});

router.get('/:id/contract', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Get trap contract endpoint' });
});

router.get('/:id/status', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Get trap status endpoint' });
});

export default router;
