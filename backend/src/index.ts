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

// Middleware
app.use(helmet());
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'One Click Backend API'
  });
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
    
    // Import other route modules
    const authRoutes = await import('./routes/auth');
    const basicTrapsRoutes = await import('./routes/basicTraps');
    const enhancedAITrapRoutes = await import('./routes/enhancedAITrap');
    const analysisRoutes = await import('./routes/analysis');
    const alertsRoutes = await import('./routes/alerts');
    const trapsRoutes = await import('./routes/traps');
    
    console.log('🔧 Creating route instances...');
    
    // Create route instances with injected services
    const rpcTestRoutes = createRpcTestRouter(blockchainService, databaseService);
    const marketplaceRoutes = createMarketplaceRouter(databaseService);
    
    // Initialize services for routes that need them
    const { BasicTrapDeploymentService } = await import('./services/basicTrapDeployment');
    const basicTrapService = new BasicTrapDeploymentService(databaseService, blockchainService, notificationService);
    
    // Set the service in the route module
    basicTrapsRoutes.setBasicTrapService(basicTrapService);
    
    console.log('🔧 Registering routes...');
    
    // Register all routes
    app.use('/api/rpc-test', rpcTestRoutes);
    app.use('/api/marketplace', marketplaceRoutes);
    app.use('/api/auth', authRoutes.default);
    app.use('/api/basic-traps', basicTrapsRoutes.default);
    app.use('/api/enhanced-ai-trap', enhancedAITrapRoutes.default);
    app.use('/api/analyze', analysisRoutes.default);
    app.use('/api/alerts', alertsRoutes.default);
    app.use('/api/traps', trapsRoutes.default);
    
    console.log('✅ Routes registered successfully!');
    console.log('✅ RPC Test routes: /api/rpc-test/*');
    console.log('✅ Marketplace routes: /api/marketplace/*');
    console.log('✅ Auth routes: /api/auth/*');
    console.log('✅ Basic Traps routes: /api/basic-traps/*');
    console.log('✅ Enhanced AI Trap routes: /api/enhanced-ai-trap/*');
    console.log('✅ Analysis routes: /api/analyze/*');
    console.log('✅ Alerts routes: /api/alerts/*');
    console.log('✅ Traps routes: /api/traps/*');
    
  } catch (error) {
    console.error('❌ Failed to set up routes:', error);
    console.error('Error details:', error);
    // Don't exit, just log the error
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 One Click API server running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 WebSocket server ready`);
});

// Initialize services after server starts
initializeServices();

export default app;
