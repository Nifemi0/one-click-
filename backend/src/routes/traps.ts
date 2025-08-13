import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { DatabaseService } from '../services/database';
import { BlockchainService } from '../services/blockchain';
import { ContractAnalysisService } from '../services/contractAnalysis';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const db = new DatabaseService();
const blockchain = new BlockchainService(db, {} as any); // Will be properly initialized
const analysis = new ContractAnalysisService(db, blockchain);

// Get all trap templates (public)
router.get('/templates', asyncHandler(async (req, res) => {
  const { category, complexity, search, sortBy = 'rating', order = 'desc', page = 1, limit = 20 } = req.query;
  
  const filters: any = {};
  if (category) filters.category = category as string;
  if (complexity) filters.complexity = complexity as string;
  if (search) filters.search = search as string;
  
  const templates = await db.getTrapTemplates(filters, {
    sortBy: sortBy as string,
    order: order as 'asc' | 'desc',
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: templates,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: templates.length,
    },
  });
}));

// Get trap template by ID (public)
router.get('/templates/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const template = await db.getTrapTemplate(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  res.json({
    success: true,
    data: template,
  });
}));

// Create new trap template (admin only)
router.post('/templates', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    complexity,
    bytecode,
    abi,
    constructorArgs,
    gasEstimate,
    price,
    tags,
    auditStatus,
    auditReport,
  } = req.body;
  
  // Validate required fields
  if (!name || !description || !category || !complexity || !bytecode) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }
  
  const template = await db.createTrapTemplate({
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    category,
    complexity,
    bytecode,
    abi: abi || [],
    constructorArgs: constructorArgs || '',
    gasEstimate: gasEstimate || 500000,
    price: price || 0,
    tags: tags || [],
    auditStatus: auditStatus || 'pending',
    auditReport: auditReport || '',
    creatorId: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deployments: 0,
    rating: 0,
    totalRatings: 0,
  });
  
  res.status(201).json({
    success: true,
    data: template,
  });
}));

// Update trap template (admin only)
router.put('/templates/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const template = await db.getTrapTemplate(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  updateData.updatedAt = new Date();
  const updatedTemplate = await db.updateTrapTemplate(id, updateData);
  
  res.json({
    success: true,
    data: updatedTemplate,
  });
}));

// Delete trap template (admin only)
router.delete('/templates/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const template = await db.getTrapTemplate(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  await db.deleteTrapTemplate(id);
  
  res.json({
    success: true,
    message: 'Template deleted successfully',
  });
}));

// Get user's deployed traps
router.get('/deployed', authMiddleware, asyncHandler(async (req, res) => {
  const { status, chainId, page = 1, limit = 20 } = req.query;
  
  const filters: any = { userId: req.user.id };
  if (status) filters.status = status;
  if (chainId) filters.chainId = parseInt(chainId as string);
  
  const traps = await db.getDeployedTraps(filters, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: traps,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: traps.length,
    },
  });
}));

// Get deployed trap by ID
router.get('/deployed/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const trap = await db.getDeployedTrap(id);
  if (!trap) {
    return res.status(404).json({
      success: false,
      error: 'Trap not found',
    });
  }
  
  // Check if user owns this trap
  if (trap.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  res.json({
    success: true,
    data: trap,
  });
}));

// Deploy new trap
router.post('/deploy', authMiddleware, asyncHandler(async (req, res) => {
  const { templateId, chainId, configuration, gasLimit, gasPrice } = req.body;
  
  // Validate required fields
  if (!templateId || !chainId || !configuration) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }
  
  // Get template
  const template = await db.getTrapTemplate(templateId);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  // Check if user has sufficient balance
  const userBalance = await blockchain.getBalance(req.user.walletAddress, chainId);
  const estimatedCost = await blockchain.calculateDeploymentCost(
    gasLimit || template.gasEstimate,
    chainId
  );
  
  if (parseFloat(userBalance) < parseFloat(estimatedCost)) {
    return res.status(400).json({
      success: false,
      error: 'Insufficient balance for deployment',
    });
  }
  
  // Create deployment record
  const deployment = await db.createDeployedTrap({
    id: `trap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: req.user.id,
    templateId,
    contractAddress: '',
    chainId,
    status: 'pending',
    gasUsed: 0,
    gasPrice: gasPrice || '0',
    deploymentCost: '0',
    deployedAt: new Date(),
    lastActivity: new Date(),
    configuration,
  });
  
  // Start deployment process (this would be handled by a queue in production)
  try {
    // For now, simulate deployment
    setTimeout(async () => {
      await db.updateDeployedTrap(deployment.id, {
        status: 'active',
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        deployedAt: new Date(),
      });
    }, 5000);
    
    res.json({
      success: true,
      data: {
        deploymentId: deployment.id,
        status: 'pending',
        message: 'Deployment started',
      },
    });
  } catch (error) {
    await db.updateDeployedTrap(deployment.id, { status: 'error' });
    throw error;
  }
}));

// Update deployed trap
router.put('/deployed/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const trap = await db.getDeployedTrap(id);
  if (!trap) {
    return res.status(404).json({
      success: false,
      error: 'Trap not found',
    });
  }
  
  // Check if user owns this trap
  if (trap.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  updateData.lastActivity = new Date();
  const updatedTrap = await db.updateDeployedTrap(id, updateData);
  
  res.json({
    success: true,
    data: updatedTrap,
  });
}));

// Pause deployed trap
router.post('/deployed/:id/pause', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const trap = await db.getDeployedTrap(id);
  if (!trap) {
    return res.status(404).json({
      success: false,
      error: 'Trap not found',
    });
  }
  
  // Check if user owns this trap
  if (trap.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  if (trap.status !== 'active') {
    return res.status(400).json({
      success: false,
      error: 'Trap is not active',
    });
  }
  
  const updatedTrap = await db.updateDeployedTrap(id, {
    status: 'paused',
    lastActivity: new Date(),
  });
  
  res.json({
    success: true,
    data: updatedTrap,
    message: 'Trap paused successfully',
  });
}));

// Resume deployed trap
router.post('/deployed/:id/resume', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const trap = await db.getDeployedTrap(id);
  if (!trap) {
    return res.status(404).json({
      success: false,
      error: 'Trap not found',
    });
  }
  
  // Check if user owns this trap
  if (trap.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  if (trap.status !== 'paused') {
    return res.status(400).json({
      success: false,
      error: 'Trap is not paused',
    });
  }
  
  const updatedTrap = await db.updateDeployedTrap(id, {
    status: 'active',
    lastActivity: new Date(),
  });
  
  res.json({
    success: true,
    data: updatedTrap,
    message: 'Trap resumed successfully',
  });
}));

// Delete deployed trap
router.delete('/deployed/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const trap = await db.getDeployedTrap(id);
  if (!trap) {
    return res.status(404).json({
      success: false,
      error: 'Trap not found',
    });
  }
  
  // Check if user owns this trap
  if (trap.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  await db.deleteDeployedTrap(id);
  
  res.json({
    success: true,
    message: 'Trap deleted successfully',
  });
}));

// Rate trap template
router.post('/templates/:id/rate', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be between 1 and 5',
    });
  }
  
  const template = await db.getTrapTemplate(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  // Check if user has already rated this template
  const existingRating = await db.getTemplateRating(id, req.user.id);
  if (existingRating) {
    return res.status(400).json({
      success: false,
      error: 'You have already rated this template',
    });
  }
  
  // Create rating
  await db.createTemplateRating({
    id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    templateId: id,
    userId: req.user.id,
    rating,
    comment: comment || '',
    createdAt: new Date(),
  });
  
  // Update template rating
  const newRating = (template.rating * template.totalRatings + rating) / (template.totalRatings + 1);
  await db.updateTrapTemplate(id, {
    rating: newRating,
    totalRatings: template.totalRatings + 1,
  });
  
  res.json({
    success: true,
    message: 'Rating submitted successfully',
    data: { rating: newRating, totalRatings: template.totalRatings + 1 },
  });
}));

// Get template ratings
router.get('/templates/:id/ratings', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const ratings = await db.getTemplateRatings(id, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: ratings,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: ratings.length,
    },
  });
}));

// Get deployment statistics
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.role === 'admin' ? undefined : req.user.id;
  
  const stats = await db.getTrapStats(userId);
  
  res.json({
    success: true,
    data: stats,
  });
}));

// Get popular templates
router.get('/templates/popular', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const templates = await db.getPopularTrapTemplates(parseInt(limit as string));
  
  res.json({
    success: true,
    data: templates,
  });
}));

// Search templates
router.get('/templates/search', asyncHandler(async (req, res) => {
  const { q, category, complexity, minRating, maxPrice, page = 1, limit = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }
  
  const filters: any = { search: q as string };
  if (category) filters.category = category;
  if (complexity) filters.complexity = complexity;
  if (minRating) filters.minRating = parseFloat(minRating as string);
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
  
  const templates = await db.searchTrapTemplates(filters, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: templates,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: templates.length,
    },
  });
}));

// Get template categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await db.getTrapTemplateCategories();
  
  res.json({
    success: true,
    data: categories,
  });
}));

// Get template complexities
router.get('/complexities', asyncHandler(async (req, res) => {
  const complexities = await db.getTrapTemplateComplexities();
  
  res.json({
    success: true,
    data: complexities,
  });
}));

export default router;