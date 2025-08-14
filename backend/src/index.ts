import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import services
import { DatabaseService } from './services/database';
import { BlockchainService } from './services/blockchain';
import { NotificationService } from './services/notification';

// Import routes
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';
import rpcTestRoutes from './routes/rpcTest';
import trapsRoutes from './routes/traps';
import basicTrapsRoutes from './routes/basicTraps';
import marketplaceRoutes from './routes/marketplace';
import enhancedAITrapRoutes from './routes/enhancedAITrap';
import alertsRoutes from './routes/alerts';

// Import service setters
import { setServices as setRpcTestServices } from './routes/rpcTest';
import { setAnalysisService } from './routes/analysis';
import { setBasicTrapService } from './routes/basicTraps';
import { setTrapsServices } from './routes/traps';
import { setMarketplaceDatabaseService } from './routes/marketplace';
import { setEnhancedAITrapService } from './routes/enhancedAITrap';
import { setAlertsServices } from './routes/alerts';
import { BasicTrapDeploymentService } from './services/basicTrapDeployment';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://your-frontend-domain.netlify.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"]
  }
});

// Configuration
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize services (in correct dependency order)
const databaseService = new DatabaseService();
const notificationService = new NotificationService(databaseService);
const blockchainService = new BlockchainService(databaseService, notificationService);

// Set the services in all routes BEFORE registering them
setRpcTestServices(databaseService, blockchainService);
setAnalysisService({} as any);
setBasicTrapService(new BasicTrapDeploymentService(databaseService, blockchainService, notificationService));
setTrapsServices(databaseService, blockchainService);
setMarketplaceDatabaseService(databaseService);
setEnhancedAITrapService({} as any);
setAlertsServices(databaseService, notificationService);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://your-frontend-domain.netlify.app",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes - Register AFTER setting services
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/rpc-test', rpcTestRoutes);
app.use('/api/traps', trapsRoutes);
app.use('/api/basic-traps', basicTrapsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/enhanced-ai-trap', enhancedAITrapRoutes);
app.use('/api/alerts', alertsRoutes);

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
    await databaseService.connect();
    console.log('✅ Database connected');
    
    await blockchainService.initialize();
    console.log('✅ Blockchain service initialized');
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
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
