import express from 'express';
import { EnhancedAITrapDeploymentService } from '../services/enhancedAITrapDeployment';
import { DatabaseService } from '../services/database';
import { ContractAnalysisService } from '../services/contractAnalysis';
import { NotificationService } from '../services/notification';
import { BlockchainService } from '../services/blockchain';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Initialize services
const db = new DatabaseService();
const contractAnalysis = new ContractAnalysisService(db, {} as any); // Simplified for demo
const notification = new NotificationService(db);
const blockchain = new BlockchainService(db);
const enhancedAIService = new EnhancedAITrapDeploymentService(
  db, 
  contractAnalysis, 
  notification, 
  blockchain
);

// Rate limiting for premium features
const premiumRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes for premium features
  message: 'Too many premium requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// =====================================================
// ENHANCED AI TRAP DEPLOYMENT ROUTES
// =====================================================

/**
 * @route POST /api/enhanced-ai-trap/deploy
 * @desc Deploy complete AI trap with TOML and iTrap files
 * @access Private (Premium users only)
 */
router.post('/deploy', 
  authenticateToken, 
  premiumRateLimit,
  async (req, res) => {
    try {
      const {
        userPrompt,
        complexity,
        targetNetwork,
        securityLevel,
        customRequirements,
        budget,
        timeline,
        trapType,
        monitoringLevel,
        alertPreferences,
        customParameters
      } = req.body;

      // Validate required fields
      if (!userPrompt || !complexity || !targetNetwork || !securityLevel) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: userPrompt, complexity, targetNetwork, securityLevel'
        });
      }

      // Check if user has premium subscription
      const user = await db.getUserById(req.user.id);
      if (!user || !['premium', 'enterprise'].includes(user.subscription_tier)) {
        return res.status(403).json({
          success: false,
          message: 'Enhanced AI Trap Deployment requires Premium or Enterprise subscription'
        });
      }

      // Create deployment request
      const deploymentRequest = {
        userId: req.user.id,
        userPrompt,
        complexity: complexity || 'medium',
        targetNetwork: parseInt(targetNetwork),
        securityLevel: securityLevel || 'premium',
        customRequirements: customRequirements || [],
        budget: parseFloat(budget) || 0.02,
        timeline: timeline || '24h',
        trapType: trapType || 'honeypot',
        monitoringLevel: monitoringLevel || 'advanced',
        alertPreferences: alertPreferences || ['email'],
        customParameters: customParameters || {}
      };

      // Start enhanced AI deployment
      const deployment = await enhancedAIService.deployCompleteTrap(deploymentRequest);

      res.status(201).json({
        success: true,
        message: 'Enhanced AI Trap Deployment started successfully',
        data: {
          deploymentId: deployment.id,
          trapName: deployment.trapName,
          estimatedCost: deployment.estimatedCost,
          estimatedTime: deployment.estimatedTime,
          aiConfidence: deployment.aiConfidence,
          status: deployment.deploymentStatus
        }
      });

    } catch (error) {
      console.error('Enhanced AI trap deployment failed:', error);
      res.status(500).json({
        success: false,
        message: 'Enhanced AI trap deployment failed',
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/enhanced-ai-trap/deployments
 * @desc Get user's enhanced AI trap deployments
 * @access Private
 */
router.get('/deployments', 
  authenticateToken,
  async (req, res) => {
    try {
      const deployments = await enhancedAIService.getUserDeployments(req.user.id);
      
      res.json({
        success: true,
        data: deployments.map(deployment => ({
          id: deployment.id,
          trapName: deployment.trapName,
          description: deployment.description,
          deploymentStatus: deployment.deploymentStatus,
          estimatedCost: deployment.estimatedCost,
          aiConfidence: deployment.aiConfidence,
          createdAt: deployment.createdAt,
          deployedAt: deployment.deployedAt,
          securityFeatures: deployment.securityFeatures,
          riskAssessment: deployment.riskAssessment
        }))
      });

    } catch (error) {
      console.error('Failed to get deployments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get deployments',
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/enhanced-ai-trap/deployments/:id
 * @desc Get specific enhanced AI trap deployment details
 * @access Private
 */
router.get('/deployments/:id', 
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get deployment progress
      const progress = await enhancedAIService.getDeploymentProgress(id);
      
      // Get deployment details
      const deployments = await enhancedAIService.getUserDeployments(req.user.id);
      const deployment = deployments.find(d => d.id === id);
      
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: 'Deployment not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...deployment,
          progress
        }
      });

    } catch (error) {
      console.error('Failed to get deployment details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get deployment details',
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/enhanced-ai-trap/deployments/:id/files
 * @desc Download deployment files (TOML, iTrap, contract)
 * @access Private
 */
router.get('/deployments/:id/files', 
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fileType } = req.query; // 'toml', 'itrap', 'contract'
      
      const deployments = await enhancedAIService.getUserDeployments(req.user.id);
      const deployment = deployments.find(d => d.id === id);
      
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: 'Deployment not found'
        });
      }

      let fileContent = '';
      let fileName = '';
      let contentType = 'text/plain';

      switch (fileType) {
        case 'toml':
          fileContent = deployment.tomlConfig;
          fileName = `${deployment.trapName.replace(/\s+/g, '_')}_deployment.toml`;
          break;
        case 'itrap':
          fileContent = deployment.itrapFile;
          fileName = `${deployment.trapName.replace(/\s+/g, '_')}.itrap`;
          contentType = 'application/json';
          break;
        case 'contract':
          fileContent = deployment.contractCode;
          fileName = `${deployment.trapName.replace(/\s+/g, '_')}.sol`;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid file type. Use: toml, itrap, or contract'
          });
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(fileContent);

    } catch (error) {
      console.error('Failed to download file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download file',
        error: error.message
      });
    }
  }
);

/**
 * @route POST /api/enhanced-ai-trap/deployments/:id/actions
 * @desc Handle user actions for deployment steps
 * @access Private
 */
router.post('/deployments/:id/actions', 
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { actionType, stepNumber, data } = req.body;
      
      // This would integrate with the deployment service to handle user actions
      // For now, we'll return a success response
      
      res.json({
        success: true,
        message: `Action ${actionType} completed for step ${stepNumber}`,
        data: {
          deploymentId: id,
          stepNumber,
          actionType,
          completed: true,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Failed to handle user action:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to handle user action',
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/enhanced-ai-trap/status
 * @desc Get enhanced AI trap service status
 * @access Private
 */
router.get('/status', 
  authenticateToken,
  async (req, res) => {
    try {
      // Check if user has access to enhanced features
      const user = await db.getUserById(req.user.id);
      const hasAccess = user && ['premium', 'enterprise'].includes(user.subscription_tier);
      
      res.json({
        success: true,
        data: {
          service: 'Enhanced AI Trap Deployment',
          status: hasAccess ? 'available' : 'locked',
          subscriptionRequired: 'premium',
          features: hasAccess ? [
            'AI-powered smart contract generation',
            'TOML configuration files',
            'iTrap file generation',
            'Complete deployment pipeline',
            'Automated monitoring setup',
            'Enterprise security features'
          ] : [],
          limitations: hasAccess ? [] : [
            'Requires Premium or Enterprise subscription',
            'Rate limited to 5 requests per 15 minutes',
            'Advanced features require enterprise tier'
          ]
        }
      });

    } catch (error) {
      console.error('Failed to get service status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get service status',
        error: error.message
      });
    }
  }
);

export default router;