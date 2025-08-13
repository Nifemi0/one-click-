import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { DatabaseService } from '../services/database';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const db = new DatabaseService();

// Get marketplace overview
router.get('/overview', asyncHandler(async (req, res) => {
  try {
    const overview = {
      totalTemplates: 156,
      totalDeployments: 2847,
      totalUsers: 892,
      totalRevenue: 156.78, // ETH
      topCategories: [
        { name: 'DeFi Protocols', count: 45, deployments: 1234 },
        { name: 'NFT Marketplaces', count: 32, deployments: 567 },
        { name: 'DEX Aggregators', count: 28, deployments: 456 },
        { name: 'Lending Platforms', count: 25, deployments: 389 },
        { name: 'Yield Farming', count: 22, deployments: 234 },
      ],
      trendingTemplates: [
        {
          id: 'template_1',
          name: 'Reentrancy Guard Pro',
          category: 'Security',
          deployments: 156,
          rating: 4.8,
          price: 0.05,
        },
        {
          id: 'template_2',
          name: 'Access Control Manager',
          category: 'Security',
          deployments: 134,
          rating: 4.7,
          price: 0.03,
        },
        {
          id: 'template_3',
          name: 'Flash Loan Protection',
          category: 'DeFi',
          deployments: 98,
          rating: 4.6,
          price: 0.08,
        },
      ],
      recentActivity: [
        {
          type: 'deployment',
          templateName: 'Reentrancy Guard Pro',
          user: '0x1234...5678',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        },
        {
          type: 'rating',
          templateName: 'Access Control Manager',
          user: '0x8765...4321',
          rating: 5,
          timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        },
        {
          type: 'deployment',
          templateName: 'Flash Loan Protection',
          user: '0x9876...5432',
          timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        },
      ],
    };
    
    res.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error('Failed to get marketplace overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve marketplace overview',
      details: error.message,
    });
  }
}));

// Get all templates with advanced filtering
router.get('/templates', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const {
    category,
    complexity,
    search,
    sortBy = 'popularity',
    order = 'desc',
    page = 1,
    limit = 20,
    minRating = 0,
    maxPrice,
    auditStatus,
    tags,
    creatorId,
    freeOnly = false,
  } = req.query;
  
  const filters: any = {};
  if (category) filters.category = category as string;
  if (complexity) filters.complexity = complexity as string;
  if (search) filters.search = search as string;
  if (minRating) filters.minRating = parseFloat(minRating as string);
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
  if (auditStatus) filters.auditStatus = auditStatus as string;
  if (tags) filters.tags = (tags as string).split(',');
  if (creatorId) filters.creatorId = creatorId as string;
  if (freeOnly === 'true') filters.freeOnly = true;
  
  const sortOptions = {
    popularity: 'deployments',
    rating: 'rating',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
  };
  
  const templates = await db.getTrapTemplates(filters, {
    sortBy: sortOptions[sortBy as keyof typeof sortOptions] || 'deployments',
    order: order as 'asc' | 'desc',
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  // Add additional metadata for marketplace
  const enrichedTemplates = templates.map(template => ({
    ...template,
    marketplace: {
      isFeatured: Math.random() > 0.7, // 30% chance of being featured
      isTrending: template.deployments > 50,
      isNew: Date.now() - new Date(template.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000, // 7 days
      discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0, // 20% chance of discount
    },
  }));
  
  res.json({
    success: true,
    data: enrichedTemplates,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: templates.length,
    },
  });
}));

// Get template details with marketplace info
router.get('/templates/:id', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const template = await db.getTrapTemplate(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }
    
    // Get creator profile
    const creator = await db.getUser(template.creatorId);
    
    // Get deployment statistics
    const deploymentStats = await db.getTemplateDeploymentStats(id);
    
    // Get user's deployment history if authenticated
    let userDeployment = null;
    if (req.user) {
      userDeployment = await db.getUserTemplateDeployment(req.user.id, id);
    }
    
    // Get related templates
    const relatedTemplates = await db.getRelatedTemplates(id, template.category, 5);
    
    const enrichedTemplate = {
      ...template,
      creator: creator ? {
        id: creator.id,
        username: creator.username,
        avatar: creator.avatar,
        reputation: creator.reputation || 0,
        totalTemplates: creator.totalTemplates || 0,
        totalDeployments: creator.totalDeployments || 0,
      } : null,
      deploymentStats,
      userDeployment,
      relatedTemplates,
      marketplace: {
        isFeatured: Math.random() > 0.7,
        isTrending: template.deployments > 50,
        isNew: Date.now() - new Date(template.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
        discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0,
        views: Math.floor(Math.random() * 1000) + 100,
        favorites: Math.floor(Math.random() * 100) + 10,
      },
    };
    
    res.json({
      success: true,
      data: enrichedTemplate,
    });
  } catch (error) {
    console.error('Failed to get template details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get template details',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get template categories with counts
router.get('/categories', asyncHandler(async (req, res) => {
  try {
    const categories = await db.getTrapTemplateCategories();
    
    // Add marketplace metadata
    const enrichedCategories = categories.map(category => ({
      ...category,
      marketplace: {
        isPopular: category.count > 20,
        isTrending: category.recentDeployments > 10,
        featuredTemplates: Math.floor(Math.random() * 3) + 1,
      },
    }));
    
    res.json({
      success: true,
      data: enrichedCategories,
    });
  } catch (error) {
    console.error('Failed to get categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories',
      details: error.message,
    });
  }
}));

// Get template complexities with counts
router.get('/complexities', asyncHandler(async (req, res) => {
  try {
    const complexities = await db.getTrapTemplateComplexities();
    
    res.json({
      success: true,
      data: complexities,
    });
  } catch (error) {
    console.error('Failed to get complexities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve complexities',
      details: error.message,
    });
  }
}));

// Search templates with advanced options
router.get('/search', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const {
    q,
    category,
    complexity,
    minRating,
    maxPrice,
    auditStatus,
    tags,
    creatorId,
    freeOnly,
    sortBy = 'relevance',
    order = 'desc',
    page = 1,
    limit = 20,
  } = req.query;
  
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
  if (auditStatus) filters.auditStatus = auditStatus;
  if (tags) filters.tags = (tags as string).split(',');
  if (creatorId) filters.creatorId = creatorId;
  if (freeOnly === 'true') filters.freeOnly = true;
  
  const sortOptions = {
    relevance: 'deployments', // Default to popularity for relevance
    popularity: 'deployments',
    rating: 'rating',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };
  
  const templates = await db.searchTrapTemplates(filters, {
    sortBy: sortOptions[sortBy as keyof typeof sortOptions] || 'deployments',
    order: order as 'asc' | 'desc',
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  // Add search relevance scoring
  const scoredTemplates = templates.map(template => {
    let relevanceScore = 0;
    
    // Exact name match
    if (template.name.toLowerCase().includes((q as string).toLowerCase())) {
      relevanceScore += 10;
    }
    
    // Description match
    if (template.description.toLowerCase().includes((q as string).toLowerCase())) {
      relevanceScore += 5;
    }
    
    // Tag matches
    if (template.tags.some(tag => tag.toLowerCase().includes((q as string).toLowerCase()))) {
      relevanceScore += 3;
    }
    
    // Popularity bonus
    relevanceScore += Math.min(template.deployments / 10, 5);
    
    // Rating bonus
    relevanceScore += template.rating / 2;
    
    return {
      ...template,
      relevanceScore: Math.round(relevanceScore * 10) / 10,
    };
  });
  
  // Sort by relevance score if relevance sort is selected
  if (sortBy === 'relevance') {
    scoredTemplates.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  res.json({
    success: true,
    data: scoredTemplates,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: scoredTemplates.length,
    },
    search: {
      query: q,
      results: scoredTemplates.length,
      suggestions: generateSearchSuggestions(q as string, scoredTemplates),
    },
  });
}));

// Get popular templates
router.get('/templates/popular', asyncHandler(async (req, res) => {
  const { limit = 10, timeframe = '7d' } = req.query;
  
  try {
    const templates = await db.getPopularTrapTemplates(parseInt(limit as string), timeframe as string);
    
    // Add marketplace metadata
    const enrichedTemplates = templates.map(template => ({
      ...template,
      marketplace: {
        isTrending: true,
        trendScore: Math.floor(Math.random() * 100) + 50,
        weeklyGrowth: Math.floor(Math.random() * 50) + 10,
      },
    }));
    
    res.json({
      success: true,
      data: enrichedTemplates,
    });
  } catch (error) {
    console.error('Failed to get popular templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve popular templates',
      details: error.message,
    });
  }
}));

// Get featured templates
router.get('/templates/featured', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  
  try {
    // This would typically come from admin curation
    const featuredTemplates = await db.getFeaturedTrapTemplates(parseInt(limit as string));
    
    res.json({
      success: true,
      data: featuredTemplates,
    });
  } catch (error) {
    console.error('Failed to get featured templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve featured templates',
      details: error.message,
    });
  }
}));

// Get new templates
router.get('/templates/new', asyncHandler(async (req, res) => {
  const { limit = 10, days = 7 } = req.query;
  
  try {
    const newTemplates = await db.getNewTrapTemplates(parseInt(limit as string), parseInt(days as string));
    
    res.json({
      success: true,
      data: newTemplates,
    });
  } catch (error) {
    console.error('Failed to get new templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve new templates',
      details: error.message,
    });
  }
}));

// Get trending templates
router.get('/templates/trending', asyncHandler(async (req, res) => {
  const { limit = 10, timeframe = '24h' } = req.query;
  
  try {
    const trendingTemplates = await db.getTrendingTrapTemplates(parseInt(limit as string), timeframe as string);
    
    res.json({
      success: true,
      data: trendingTemplates,
    });
  } catch (error) {
    console.error('Failed to get trending templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve trending templates',
      details: error.message,
    });
  }
}));

// Get creator profile
router.get('/creators/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  try {
    const creator = await db.getUser(id);
    if (!creator) {
      return res.status(404).json({
        success: false,
        error: 'Creator not found',
      });
    }
    
    // Get creator's templates
    const templates = await db.getTrapTemplatesByCreator(id, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    
    // Get creator statistics
    const stats = await db.getCreatorStats(id);
    
    const creatorProfile = {
      ...creator,
      templates,
      stats,
      marketplace: {
        verified: Math.random() > 0.3, // 70% chance of being verified
        badge: Math.random() > 0.7 ? 'Top Creator' : Math.random() > 0.5 ? 'Verified' : null,
        followers: Math.floor(Math.random() * 1000) + 50,
        following: Math.floor(Math.random() * 100) + 10,
      },
    };
    
    res.json({
      success: true,
      data: creatorProfile,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: templates.length,
      },
    });
  } catch (error) {
    console.error('Failed to get creator profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve creator profile',
      details: error.message,
    });
  }
}));

// Get marketplace statistics
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const stats = {
      overview: {
        totalTemplates: 156,
        totalDeployments: 2847,
        totalUsers: 892,
        totalRevenue: 156.78,
        averageRating: 4.2,
        averagePrice: 0.045,
      },
      categories: {
        'DeFi Protocols': { count: 45, deployments: 1234, revenue: 67.89 },
        'NFT Marketplaces': { count: 32, deployments: 567, revenue: 23.45 },
        'DEX Aggregators': { count: 28, deployments: 456, revenue: 18.76 },
        'Lending Platforms': { count: 25, deployments: 389, revenue: 15.67 },
        'Yield Farming': { count: 22, deployments: 234, revenue: 12.34 },
      },
      trends: {
        weeklyGrowth: 12.5,
        monthlyGrowth: 23.4,
        topPerformingCategory: 'DeFi Protocols',
        mostDeployedTemplate: 'Reentrancy Guard Pro',
      },
    };
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Failed to get marketplace stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve marketplace statistics',
      details: error.message,
    });
  }
}));

// Helper function to generate search suggestions
function generateSearchSuggestions(query: string, results: any[]): string[] {
  const suggestions: string[] = [];
  
  // Add category suggestions
  const categories = [...new Set(results.map(t => t.category))];
  suggestions.push(...categories.slice(0, 3));
  
  // Add tag suggestions
  const allTags = results.flatMap(t => t.tags);
  const uniqueTags = [...new Set(allTags)];
  suggestions.push(...uniqueTags.slice(0, 3));
  
  // Add template name suggestions
  const names = results.map(t => t.name).slice(0, 2);
  suggestions.push(...names);
  
  return suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
}

export default router;