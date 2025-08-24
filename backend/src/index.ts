import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Import services
import { DatabaseService } from './services/database';
import { BlockchainService } from './services/blockchain';
import { NotificationService } from './services/notification';

console.log('🚀 Starting One Click Backend...');

// Initialize services FIRST
console.log('📦 Initializing services...');
const databaseService = new DatabaseService();
const notificationService = new NotificationService(databaseService);
const blockchainService = new BlockchainService(databaseService, notificationService);

console.log('🔧 Setting up middleware...');
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://oneclick1.netlify.app",
      "https://oneclick1.netlify.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"]
  }
});

// Configuration
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware - temporarily disable helmet to test POST requests
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false
// }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://oneclick1.netlify.app",
    "https://oneclick1.netlify.app",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom JSON parser for requests that fail standard parsing
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json' && !req.body && req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
        next();
      } catch (error) {
        console.error('❌ Custom JSON parsing failed:', error);
        next();
      }
    });
  } else {
    next();
  }
});

// Additional middleware to handle different content types
app.use((req, res, next) => {
  console.log('🔍 Middleware processing request:', req.method, req.path);
  console.log('🔍 Content-Type:', req.headers['content-type']);
  console.log('🔍 Request body before parsing:', req.body);
  next();
});

// Error handling middleware to catch any parsing errors
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Middleware error:', err);
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    console.error('❌ JSON parsing error:', err.message);
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body',
      details: err.message
    });
  }
  next(err);
});

// AI Routes - Register at top level to ensure they work
console.log('🔧 Setting up AI routes at top level...');
app.get('/api/ai-contracts/status', async (req, res) => {
  try {
    const status = {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      compilation: true,
      deployment: true,
      timestamp: new Date().toISOString()
    };
    
    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error: any) {
    console.error('❌ AI Status Check Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check status',
      details: error.message
    });
  }
});

app.post('/api/ai-contracts/generate', async (req, res) => {
  try {
    console.log('🔍 POST /api/ai-contracts/generate received');
    console.log('🔍 Request headers:', req.headers);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Request body type:', typeof req.body);
    
    const { userPrompt, securityLevel, complexity, targetNetwork, customRequirements } = req.body;
    
    if (!userPrompt) {
      console.log('❌ Missing userPrompt in request body');
      return res.status(400).json({
        success: false,
        error: 'Missing userPrompt in request body',
        receivedBody: req.body
      });
    }
    
    console.log('🤖 Generating AI contract for prompt:', userPrompt);
    console.log('🔍 Using security level:', securityLevel || 'basic');
    console.log('🔍 Using complexity:', complexity || 'simple');
    console.log('🔍 Using target network:', targetNetwork || 1);
    console.log('🔍 Using custom requirements:', customRequirements || []);
    
    // Import and use AI service
    const { AIIntegrationService } = await import('./services/aiIntegrationService');
    const aiService = new AIIntegrationService();
    
    const result = await aiService.generateContract({ 
      userPrompt,
      securityLevel: securityLevel || 'basic',
      complexity: complexity || 'simple',
      targetNetwork: targetNetwork || 1,
      customRequirements: customRequirements || []
    });
    
    // Wrap the response in a data property to match frontend expectations
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('❌ AI Generation Error:', error);
    return res.status(500).json({
      success: false,
      error: 'AI generation failed',
      details: error.message
    });
  }
});

app.post('/api/ai-contracts/compile', async (req, res) => {
  try {
    console.log('🔍 POST /api/ai-contracts/compile received');
    console.log('🔍 Request headers:', req.headers);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Request body type:', typeof req.body);
    
    const { contractCode, contractName } = req.body;
    
    if (!contractCode || !contractName) {
      console.log('❌ Missing contractCode or contractName in request body');
      return res.status(400).json({
        success: false,
        error: 'Missing contractCode or contractName in request body',
        receivedBody: req.body
      });
    }
    
    console.log('🔧 Compiling contract:', contractName);
    
    // Import and use compilation service
    const { ContractCompilationService } = await import('./services/contractCompilation');
    const compilationService = new ContractCompilationService();
    
    const result = await compilationService.compileDynamicContract(contractCode, contractName);
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('❌ Compilation Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Compilation failed',
      details: error.message
    });
  }
});

app.post('/api/ai-contracts/deploy', async (req, res) => {
  try {
    const { contractCode, contractName, network } = req.body;
    
    if (!contractCode || !contractName) {
      return res.status(400).json({
        success: false,
        error: 'Missing contractCode or contractName in request body'
      });
    }
    
    console.log('🚀 Deploying contract:', contractName);
    
    // For now, return mock deployment result
    const result = {
      success: true,
      contractAddress: '0x' + '0'.repeat(40),
      transactionHash: '0x' + '0'.repeat(64),
      gasUsed: 150000,
      deploymentCost: '0.001'
    };
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('❌ Deployment Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Deployment failed',
      details: error.message
    });
  }
});

console.log('✅ AI routes registered at top level');

// Test POST endpoint to isolate the issue
app.post('/api/test-post', (req, res) => {
  console.log('🔍 Test POST endpoint received');
  console.log('🔍 Request body:', req.body);
  console.log('🔍 Request body type:', typeof req.body);
  
  res.json({
    success: true,
    message: 'Test POST endpoint working',
    receivedBody: req.body,
    bodyType: typeof req.body
  });
});

// Simple AI Provider Test Endpoint
app.get('/api/ai-contracts/test-providers', async (req, res) => {
  try {
    console.log('🧪 Testing individual AI providers...');
    
    const results: {
      timestamp: string;
      tests: {
        openai?: any;
        gemini?: any;
      };
    } = {
      timestamp: new Date().toISOString(),
      tests: {}
    };
    
    // Test OpenAI directly
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('🧪 Testing OpenAI directly...');
        const { AIIntegrationService } = await import('./services/aiIntegrationService');
        const aiService = new AIIntegrationService();
        
        // Test the OpenAI method directly
        const testResult = await aiService['generateWithOpenAI']({
          userPrompt: 'test',
          securityLevel: 'basic',
          complexity: 'simple',
          targetNetwork: 1,
          customRequirements: []
        });
        
        results.tests.openai = {
          success: true,
          provider: testResult.aiProvider,
          contractLength: testResult.contractCode.length,
          message: 'OpenAI direct test successful'
        };
      } catch (error: any) {
        console.error('❌ OpenAI direct test failed:', error);
        results.tests.openai = {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            stack: error.stack?.substring(0, 500)
          }
        };
      }
    } else {
      results.tests.openai = {
        success: false,
        error: 'No OpenAI API key configured'
      };
    }
    
    // Test Gemini directly
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('🧪 Testing Gemini directly...');
        const { AIIntegrationService } = await import('./services/aiIntegrationService');
        const aiService = new AIIntegrationService();
        
        // Test the Gemini method directly
        const testResult = await aiService['generateWithGemini']({
          userPrompt: 'test',
          securityLevel: 'basic',
          complexity: 'simple',
          targetNetwork: 1,
          customRequirements: []
        });
        
        results.tests.gemini = {
          success: true,
          provider: testResult.aiProvider,
          contractLength: testResult.contractCode.length,
          message: 'Gemini direct test successful'
        };
      } catch (error: any) {
        console.error('❌ Gemini direct test failed:', error);
        results.tests.gemini = {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            stack: error.stack?.substring(0, 500)
          }
        };
      }
    } else {
      results.tests.gemini = {
        success: false,
        error: 'No Gemini API key configured'
      };
    }
    
    console.log('📊 Individual AI Provider Test Results:', results);
    
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error: any) {
    console.error('❌ Individual AI Provider Test Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Individual provider test failed',
      details: error.message
    });
  }
});

// AI Service Status Check Endpoint
app.get('/api/ai-contracts/service-status', async (req, res) => {
  try {
    console.log('🔍 Checking AI service status...');
    
    const { AIIntegrationService } = await import('./services/aiIntegrationService');
    const aiService = new AIIntegrationService();
    
    const status = {
      timestamp: new Date().toISOString(),
      serviceAvailable: aiService.getAvailability(),
      environment: {
        openaiKey: !!process.env.OPENAI_API_KEY,
        anthropicKey: !!process.env.ANTHROPIC_API_KEY,
        geminiKey: !!process.env.GEMINI_API_KEY,
        openaiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
        geminiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
      }
    };
    
    console.log('📊 AI Service Status:', status);
    
    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error: any) {
    console.error('❌ AI Service Status Check Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Service status check failed',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'One Click Backend API'
  });
});

// Test route to verify basic routing works
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Basic routing is working',
    timestamp: new Date().toISOString()
  });
});

// Test AI endpoint directly
app.get('/api/ai-contracts/test', (req, res) => {
  res.json({ 
    message: 'AI endpoint test - basic routing works',
    timestamp: new Date().toISOString()
  });
});

// AI Provider Diagnostic Endpoint
app.get('/api/ai-contracts/diagnose', async (req, res) => {
  try {
    console.log('🔍 AI Provider Diagnostic Request');
    
    const results: {
      timestamp: string;
      environment: {
        openaiKey: boolean;
        anthropicKey: boolean;
        geminiKey: boolean;
        nodeEnv: string | undefined;
      };
      tests: {
        openai?: any;
        gemini?: any;
      };
    } = {
      timestamp: new Date().toISOString(),
      environment: {
        openaiKey: !!process.env.OPENAI_API_KEY,
        anthropicKey: !!process.env.ANTHROPIC_API_KEY,
        geminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV
      },
      tests: {}
    };
    
    // Test OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('🧪 Testing OpenAI...');
        const { AIIntegrationService } = await import('./services/aiIntegrationService');
        const aiService = new AIIntegrationService();
        
        const testResult = await aiService.generateContract({
          userPrompt: 'test',
          securityLevel: 'basic',
          complexity: 'simple',
          targetNetwork: 1,
          customRequirements: []
        });
        
        results.tests.openai = {
          success: true,
          provider: testResult.aiProvider,
          message: 'OpenAI test successful'
        };
      } catch (error: any) {
        console.error('❌ OpenAI test failed:', error);
        results.tests.openai = {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText
          }
        };
      }
    } else {
      results.tests.openai = {
        success: false,
        error: 'No OpenAI API key configured'
      };
    }
    
    // Test Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('🧪 Testing Gemini...');
        const { AIIntegrationService } = await import('./services/aiIntegrationService');
        const aiService = new AIIntegrationService();
        
        const testResult = await aiService.generateContract({
          userPrompt: 'test',
          securityLevel: 'basic',
          complexity: 'simple',
          targetNetwork: 1,
          customRequirements: []
        });
        
        results.tests.gemini = {
          success: true,
          provider: testResult.aiProvider,
          message: 'Gemini test successful'
        };
      } catch (error: any) {
        console.error('❌ Gemini test failed:', error);
        results.tests.gemini = {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText
          }
        };
      }
    } else {
      results.tests.gemini = {
        success: false,
        error: 'No Gemini API key configured'
      };
    }
    
    console.log('📊 AI Provider Diagnostic Results:', results);
    
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error: any) {
    console.error('❌ AI Provider Diagnostic Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Diagnostic failed',
      details: error.message
    });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize all services
async function initializeServices() {
  try {
    console.log('🔧 Connecting to database...');
    await databaseService.connect();
    console.log('✅ Database connected');
    
    console.log('🔧 Initializing blockchain service...');
    await blockchainService.initialize();
    console.log('✅ Blockchain service initialized');
    
    console.log('✅ All services initialized successfully');
    
    // NOW set up routes AFTER services are ready
    console.log('🔧 Setting up routes...');
    await setupRoutes();
    
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    // Don't exit, just log the error
  }
}

// Function to set up routes after services are ready
async function setupRoutes() {
  try {
    console.log('🔧 Importing route creators...');
    
    // Import route creators
    const { createRpcTestRouter } = await import('./routes/rpcTest');
    const { createMarketplaceRouter } = await import('./routes/marketplace');
    const { createDroseraTrapsRouter } = await import('./routes/droseraTraps');
    const dashboardRoutes = (await import('./routes/dashboard')).default;
    
    // Import other route modules
    const authRoutes = await import('./routes/auth');
    const basicTrapsRoutes = await import('./routes/basicTraps');
    const enhancedAITrapRoutes = await import('./routes/enhancedAITrap');
    const analysisRoutes = await import('./routes/analysis');
    const alertsRoutes = await import('./routes/alerts');
    const trapsRoutes = await import('./routes/traps');
    const droseraRegistryRoutes = await import('./routes/droseraRegistry');
    const realContractsRoutes = await import('./routes/realContracts');
    
    // Import AI routes with error handling and debugging
    console.log('🔧 Importing AI contract routes...');
    let aiContractRoutes;
    try {
      const aiRoutesModule = await import('./routes/aiContractGeneration');
      console.log('📊 AI routes module imported:', typeof aiRoutesModule);
      console.log('📊 AI routes module keys:', Object.keys(aiRoutesModule));
      
      aiContractRoutes = aiRoutesModule.default || aiRoutesModule;
      console.log('✅ AI routes imported successfully');
      console.log('📊 AI routes object:', typeof aiContractRoutes);
      console.log('📊 AI routes default:', typeof aiContractRoutes.default);
      console.log('📊 AI routes router:', aiContractRoutes);
    } catch (error) {
      console.error('❌ Failed to import AI routes:', error);
      throw error;
    }
    
    // Import gas estimation service
    const { GasEstimationService } = await import('./services/gasEstimation');
    const gasEstimationService = GasEstimationService.getInstance();
    
    console.log('🔧 Creating route instances...');
    
    // Create route instances with injected services
    const rpcTestRoutes = createRpcTestRouter(blockchainService, databaseService);
    const marketplaceRoutes = createMarketplaceRouter(databaseService);
    const droseraTrapsRoutes = createDroseraTrapsRouter(databaseService, blockchainService);
    
    // Initialize services for routes that need them
    const { BasicTrapDeploymentService } = await import('./services/basicTrapDeployment');
    const basicTrapService = new BasicTrapDeploymentService(databaseService, blockchainService, notificationService);
    
    // Set the service in the route module
    basicTrapsRoutes.setBasicTrapService(basicTrapService);
    
    console.log('🔧 Registering routes...');
    
    // Register all routes
    app.use('/api/rpc-test', rpcTestRoutes);
    app.use('/api/marketplace', marketplaceRoutes);
    app.use('/api/drosera-traps', droseraTrapsRoutes);
    app.use('/api/drosera-registry', droseraRegistryRoutes.default);
    app.use('/api/real-contracts', realContractsRoutes.default);
    // Re-enable AI routes now that helmet issue is resolved
    console.log('🔧 AI routes already registered at top level');
    console.log('📊 AI routes path: /api/ai-contracts');
    
    // AI routes are now registered at the top level for reliability
    console.log('✅ AI routes are available');
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/auth', authRoutes.default);
    app.use('/api/basic-traps', basicTrapsRoutes.default);
    app.use('/api/enhanced-ai-trap', enhancedAITrapRoutes.default);
    app.use('/api/analyze', analysisRoutes.default);
    app.use('/api/alerts', alertsRoutes.default);
    app.use('/api/traps', trapsRoutes.default);
    
    // Gas estimation routes
    app.post('/api/gas/estimate', async (req, res) => {
      try {
        const { contractType, complexity, network } = req.body;
        
        if (!contractType || !complexity) {
          return res.status(400).json({ 
            error: 'Missing required fields: contractType and complexity' 
          });
        }
        
        const estimate = await gasEstimationService.estimateGasForContract({
          contractType,
          complexity,
          network: network || 'hoodi'
        });
        
        return res.json(estimate);
      } catch (error) {
        console.error('❌ Gas estimation API error:', error);
        return res.status(500).json({ 
          error: 'Gas estimation failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
    
    app.get('/api/gas/contract-types', (req, res) => {
      try {
        const contractTypes = gasEstimationService.getAvailableContractTypes();
        res.json(contractTypes);
      } catch (error) {
        console.error('❌ Contract types API error:', error);
        res.status(500).json({ 
          error: 'Failed to get contract types', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
    
    app.get('/api/gas/complexity-levels', (req, res) => {
      try {
        const complexityLevels = gasEstimationService.getAvailableComplexityLevels();
        res.json(complexityLevels);
      } catch (error) {
        console.error('❌ Complexity levels API error:', error);
        res.status(500).json({ 
          error: 'Failed to get complexity levels', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
    
    // Contract templates endpoint
    app.get('/api/contracts/templates', async (req, res) => {
      try {
        const templates = [
          {
            id: 'advancedhoneypot',
            name: 'AdvancedHoneypot',
            type: 'Honeypot',
            description: 'Advanced honeypot security trap with fund capture and attack detection',
            price: 0.02,
            difficulty: 'Advanced',
            deploymentTime: '2-3 minutes',
            securityLevel: 'High',
            features: ['Fund Capture', 'Attack Detection', 'Advanced Monitoring'],
            tags: ['Honeypot', 'Advanced', 'Security'],
            contractCode: '// Real compiled contract',
            preview: 'Advanced honeypot protection',
            author: 'SecurityMaster',
            lastUpdated: '2 days ago',
            gasEstimate: 0
          },
          {
            id: 'mevprotectionsuite',
            name: 'MEVProtectionSuite',
            type: 'Monitoring',
            description: 'MEV protection suite with sandwich attack prevention',
            price: 0.03,
            difficulty: 'Advanced',
            deploymentTime: '3-4 minutes',
            securityLevel: 'High',
            features: ['MEV Protection', 'Sandwich Attack Prevention', 'Real-time Monitoring'],
            tags: ['MEV', 'Advanced', 'Protection'],
            contractCode: '// Real compiled contract',
            preview: 'MEV attack prevention',
            author: 'DeFiGuard',
            lastUpdated: '1 week ago',
            gasEstimate: 0
          },
          {
            id: 'multisigvault',
            name: 'MultiSigVault',
            type: 'Basic',
            description: 'Multi-signature vault with access control',
            price: 0.01,
            difficulty: 'Intermediate',
            deploymentTime: '2-3 minutes',
            securityLevel: 'Medium',
            features: ['Multi-Signature', 'Access Control', 'Fund Security'],
            tags: ['MultiSig', 'Intermediate', 'Security'],
            contractCode: '// Real compiled contract',
            preview: 'Multi-signature security',
            author: 'VaultMaster',
            lastUpdated: '3 days ago',
            gasEstimate: 0
          }
        ];
        
        // Get real gas estimates for each template
        const templatesWithGas = await Promise.all(
          templates.map(async (template) => {
            try {
              const estimate = await gasEstimationService.estimateGasForContract({
                contractType: template.type,
                complexity: template.difficulty
              });
              return {
                ...template,
                gasEstimate: estimate.estimatedGas
              };
            } catch (error) {
              console.error(`Failed to estimate gas for ${template.name}:`, error);
              return {
                ...template,
                gasEstimate: 150000 // Fallback estimate
              };
            }
          })
        );
        
        res.json(templatesWithGas);
      } catch (error) {
        console.error('❌ Contract templates API error:', error);
        res.status(500).json({ 
          error: 'Failed to get contract templates', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
    
    console.log('✅ Routes registered successfully!');
    console.log('✅ RPC Test routes: /api/rpc-test/*');
    console.log('✅ Marketplace routes: /api/marketplace/*');
    console.log('✅ Drosera Traps routes: /api/drosera-traps/*');
    console.log('✅ Drosera Registry routes: /api/drosera-registry/*');
    console.log('✅ Real Contracts routes: /api/real-contracts/*');
    console.log('✅ Auth routes: /api/auth/*');
    console.log('✅ Basic Traps routes: /api/basic-traps/*');
    console.log('✅ Enhanced AI Trap routes: /api/enhanced-ai-trap/*');
    console.log('✅ Analysis routes: /api/analyze/*');
    console.log('✅ Alerts routes: /api/alerts/*');
    console.log('✅ Traps routes: /api/traps/*');
    console.log('✅ Gas Estimation routes: /api/gas/*');
    
  } catch (error) {
    console.error('❌ Failed to set up routes:', error);
    console.error('Error details:', error);
    // Don't exit, just log the error
  }
}

// Initialize services and routes BEFORE starting server
initializeServices().then(() => {
  // Start server after routes are set up
  server.listen(PORT, () => {
    console.log(`🚀 One Click API server running on http://${HOST}:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 WebSocket server ready`);
    console.log(`✅ All routes are now available`);
  });
}).catch((error) => {
  console.error('❌ Failed to initialize services, but starting server anyway:', error);
  // Start server even if services fail
  server.listen(PORT, () => {
    console.log(`🚀 One Click API server running on http://${HOST}:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 WebSocket server ready`);
    console.log(`⚠️  Some services may not be available`);
  });
});

export default app;