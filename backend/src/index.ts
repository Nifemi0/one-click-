// Main Express server for One Click Security Traps API

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import trapRoutes from './routes/traps';
import analysisRoutes from './routes/analysis';
import alertRoutes from './routes/alerts';
import marketplaceRoutes from './routes/marketplace';
import rpcTestRoutes from './routes/rpcTest';

// Import enhanced AI trap routes (hidden feature)
import enhancedAITrapRoutes from './routes/enhancedAITrap';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import services
import { DatabaseService } from './services/database';
import { BlockchainService } from './services/blockchain';
import { NotificationService } from './services/notification';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize services
const databaseService = new DatabaseService();
const blockchainService = new BlockchainService(databaseService, {} as any);
const notificationService = new NotificationService(databaseService);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/traps', authMiddleware, trapRoutes);
app.use('/api/analyze', authMiddleware, analysisRoutes);
app.use('/api/alerts', authMiddleware, alertRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/rpc-test', rpcTestRoutes);

// Enhanced AI Trap Routes (Hidden Premium Feature)
app.use('/api/enhanced-ai-trap', enhancedAITrapRoutes);

// Basic Trap Routes (One-Click Deployments)
import basicTrapRoutes from './routes/basicTraps';
app.use('/api/basic-traps', basicTrapRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user subscription to specific addresses
  socket.on('subscribe-address', (data) => {
    const { address, chainId } = data;
    if (address && chainId) {
      socket.join(`address:${address}:${chainId}`);
      console.log(`Client ${socket.id} subscribed to address ${address} on chain ${chainId}`);
    }
  });

  // Handle user subscription to specific traps
  socket.on('subscribe-trap', (data) => {
    const { trapId } = data;
    if (trapId) {
      socket.join(`trap:${trapId}`);
      console.log(`Client ${socket.id} subscribed to trap ${trapId}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, () => {
  console.log(`🚀 One Click API server running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 WebSocket server ready`);
});

// Initialize services
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

// Start initialization
initializeServices();

export { app, server, io };