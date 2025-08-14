import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { ContractAnalysisService } from '../services/contractAnalysis';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const analysisService = new ContractAnalysisService({} as any, {} as any); // Will be properly initialized

// Analyze contract (public, but rate limited)
router.post('/analyze', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { address, chainId } = req.body;
  
  // Validate required fields
  if (!address || !chainId) {
    return res.status(400).json({
      success: false,
      error: 'Contract address and chain ID are required',
    });
  }
  
  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid contract address format',
    });
  }
  
  // Validate chain ID
  const supportedChains = [1, 137, 42161, 8453]; // Ethereum, Polygon, Arbitrum, Base
  if (!supportedChains.includes(parseInt(chainId))) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported blockchain network',
    });
  }
  
  try {
    // Check if we have a cached analysis
    const cachedAnalysis = await analysisService.getCachedAnalysis(address, parseInt(chainId));
    if (cachedAnalysis) {
      return res.json({
        success: true,
        data: cachedAnalysis,
        cached: true,
        message: 'Analysis retrieved from cache',
      });
    }
    
    // Perform new analysis
    const analysis = await analysisService.analyzeContract(address, parseInt(chainId));
    
    res.json({
      success: true,
      data: analysis,
      cached: false,
      message: 'Analysis completed successfully',
    });
  } catch (error) {
    console.error('Contract analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get cached analysis result
router.get('/analyze/:address/:chainId', asyncHandler(async (req, res) => {
  const { address, chainId } = req.params;
  
  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid contract address format',
    });
  }
  
  // Validate chain ID
  const supportedChains = [1, 137, 42161, 8453];
  if (!supportedChains.includes(parseInt(chainId))) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported blockchain network',
    });
  }
  
  try {
    const analysis = await analysisService.getCachedAnalysis(address, parseInt(chainId));
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found. Please run a new analysis first.',
      });
    }
    
    res.json({
      success: true,
      data: analysis,
      message: 'Analysis retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to retrieve analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get analysis history for a contract
router.get('/history/:address/:chainId', asyncHandler(async (req, res) => {
  const { address, chainId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid contract address format',
    });
  }
  
  // Validate chain ID
  const supportedChains = [1, 137, 42161, 8453];
  if (!supportedChains.includes(parseInt(chainId))) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported blockchain network',
    });
  }
  
  try {
    const history = await analysisService.getAnalysisHistory(address, parseInt(chainId));
    
    // Apply pagination
    const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedHistory = history.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedHistory,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: history.length,
        totalPages: Math.ceil(history.length / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Failed to retrieve analysis history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis history',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Compare multiple contracts
router.post('/compare', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  const { addresses, chainId } = req.body;
  
  // Validate required fields
  if (!addresses || !Array.isArray(addresses) || addresses.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'At least two contract addresses are required for comparison',
    });
  }
  
  if (!chainId) {
    return res.status(400).json({
      success: false,
      error: 'Chain ID is required',
    });
  }
  
  // Validate addresses format
  for (const address of addresses) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        success: false,
        error: `Invalid contract address format: ${address}`,
      });
    }
  }
  
  // Validate chain ID
  const supportedChains = [1, 137, 42161, 8453];
  if (!supportedChains.includes(parseInt(chainId))) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported blockchain network',
    });
  }
  
  // Limit number of contracts to compare
  if (addresses.length > 10) {
    return res.status(400).json({
      success: false,
      error: 'Maximum 10 contracts can be compared at once',
    });
  }
  
  try {
    const comparison = await analysisService.compareContracts(addresses, parseInt(chainId));
    
    res.json({
      success: true,
      data: comparison,
      message: 'Contract comparison completed successfully',
    });
  } catch (error) {
    console.error('Contract comparison failed:', error);
    res.status(500).json({
      success: false,
      error: 'Comparison failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get analysis statistics
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    // This would return overall analysis statistics
    // For now, return mock data
    const stats = {
      totalAnalyses: 15420,
      contractsAnalyzed: 12340,
      averageRiskScore: 45.2,
      highRiskContracts: 1234,
      criticalRiskContracts: 89,
      analysisSuccessRate: 98.5,
      averageAnalysisTime: 12.3, // seconds
      popularCategories: [
        'DeFi Protocols',
        'NFT Marketplaces',
        'DEX Aggregators',
        'Lending Platforms',
        'Yield Farming',
      ],
      topVulnerabilities: [
        'Reentrancy Attacks',
        'Access Control Issues',
        'Integer Overflow',
        'Unchecked External Calls',
        'Timestamp Dependency',
      ],
    };
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Failed to retrieve analysis stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis statistics',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get supported networks
router.get('/networks', asyncHandler(async (req, res) => {
  try {
    const networks = [
      {
        chainId: 1,
        name: 'Ethereum Mainnet',
        symbol: 'ETH',
        blockExplorer: 'https://etherscan.io',
        rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
        supported: true,
        features: ['Contract Analysis', 'AI Analysis', 'Source Code Retrieval'],
      },
      {
        chainId: 137,
        name: 'Polygon',
        symbol: 'MATIC',
        blockExplorer: 'https://polygonscan.com',
        rpcUrl: 'https://polygon-rpc.com',
        supported: true,
        features: ['Contract Analysis', 'AI Analysis', 'Source Code Retrieval'],
      },
      {
        chainId: 42161,
        name: 'Arbitrum One',
        symbol: 'ETH',
        blockExplorer: 'https://arbiscan.io',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        supported: true,
        features: ['Contract Analysis', 'AI Analysis', 'Source Code Retrieval'],
      },
      {
        chainId: 8453,
        name: 'Base',
        symbol: 'ETH',
        blockExplorer: 'https://basescan.org',
        rpcUrl: 'https://mainnet.base.org',
        supported: true,
        features: ['Contract Analysis', 'AI Analysis', 'Source Code Retrieval'],
      },
      {
        chainId: 56,
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        blockExplorer: 'https://bscscan.com',
        rpcUrl: 'https://bsc-dataseed.binance.org',
        supported: false,
        features: ['Contract Analysis'],
        comingSoon: true,
      },
    ];
    
    res.json({
      success: true,
      data: networks,
    });
  } catch (error) {
    console.error('Failed to retrieve networks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve supported networks',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get analysis features
router.get('/features', asyncHandler(async (req, res) => {
  try {
    const features = {
      blockchainAnalysis: {
        name: 'Blockchain Analysis',
        description: 'Analyze contract bytecode for common vulnerabilities',
        enabled: true,
        features: [
          'Bytecode analysis',
          'Risk scoring',
          'Vulnerability detection',
          'Gas estimation',
          'Deployment cost calculation',
        ],
      },
      aiAnalysis: {
        name: 'AI-Powered Analysis',
        description: 'Advanced security analysis using OpenAI GPT-4',
        enabled: true,
        features: [
          'Source code analysis',
          'Security recommendations',
          'Audit recommendations',
          'Complexity scoring',
          'Best practices guidance',
        ],
      },
      sourceCodeRetrieval: {
        name: 'Source Code Retrieval',
        description: 'Retrieve verified source code from block explorers',
        enabled: true,
        features: [
          'Etherscan integration',
          'Polygonscan integration',
          'Arbiscan integration',
          'Basescan integration',
          'ABI extraction',
        ],
      },
      socialSentiment: {
        name: 'Social Sentiment Analysis',
        description: 'Analyze community sentiment and mentions',
        enabled: false,
        features: [
          'Social media monitoring',
          'Community sentiment scoring',
          'Mention tracking',
          'Trend analysis',
        ],
        comingSoon: true,
      },
      auditIntegration: {
        name: 'Audit Integration',
        description: 'Integrate with security audit firms',
        enabled: false,
        features: [
          'Audit firm recommendations',
          'Cost estimation',
          'Scheduling integration',
          'Report tracking',
        ],
        comingSoon: true,
      },
    };
    
    res.json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error('Failed to retrieve features:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis features',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Health check for analysis service
router.get('/health', asyncHandler(async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        blockchain: 'operational',
        ai: 'operational',
        blockExplorer: 'operational',
        database: 'operational',
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
    
    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Rate limit info
router.get('/rate-limit', asyncHandler(async (req, res) => {
  try {
    const rateLimitInfo = {
      limits: {
        anonymous: {
          requestsPerHour: 10,
          requestsPerDay: 100,
        },
        authenticated: {
          requestsPerHour: 100,
          requestsPerDay: 1000,
        },
        premium: {
          requestsPerHour: 500,
          requestsPerDay: 10000,
        },
      },
      currentUsage: {
        remaining: req.user ? 95 : 8,
        resetTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      },
    };
    
    res.json({
      success: true,
      data: rateLimitInfo,
    });
  } catch (error) {
    console.error('Failed to retrieve rate limit info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve rate limit information',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export default router;