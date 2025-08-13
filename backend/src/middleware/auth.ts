// Authentication middleware for JWT token verification

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { DatabaseService } from '../services/database';
import { createRateLimiter } from './rateLimiter';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        walletAddress: string;
        role: string;
      };
    }
  }
}

// Rate limiter for wallet signature verification
const walletSignatureLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 wallet signature attempts per windowMs
  message: 'Too many wallet signature attempts, please try again later.',
});

// Rate limiter for login attempts
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
});

// Verify wallet signature middleware
export const verifyWalletSignature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { walletAddress, signature, message, nonce } = req.body;

    if (!walletAddress || !signature || !message || !nonce) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'walletAddress, signature, message, and nonce are required',
      });
      return;
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      res.status(401).json({
        error: 'Invalid signature',
        message: 'Wallet signature verification failed',
      });
      return;
    }

    // Verify nonce (you might want to store and check nonces in your database)
    // For now, we'll just check if it exists
    if (!nonce || typeof nonce !== 'string') {
      res.status(400).json({
        error: 'Invalid nonce',
        message: 'Nonce must be a valid string',
      });
      return;
    }

    // Add wallet address to request for later use
    req.body.verifiedWalletAddress = walletAddress;
    next();
  } catch (error) {
    console.error('Wallet signature verification error:', error);
    res.status(500).json({
      error: 'Signature verification failed',
      message: 'An error occurred during signature verification',
    });
  }
};

// JWT authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'No token provided',
        message: 'Authorization header must start with Bearer',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      res.status(500).json({
        error: 'Server configuration error',
        message: 'Authentication service is not properly configured',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId || !decoded.walletAddress) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'Token is malformed or expired',
      });
      return;
    }

    // Add user info to request
    req.user = {
      id: decoded.userId,
      walletAddress: decoded.walletAddress,
      role: decoded.role || 'user',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired',
      });
      return;
    }
    
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication',
    });
  }
};

// Role-based access control middleware
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to access this resource',
      });
      return;
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: `Role '${requiredRole}' is required to access this resource`,
      });
      return;
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (process.env.JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
          
          if (decoded && decoded.userId && decoded.walletAddress) {
            req.user = {
              id: decoded.userId,
              walletAddress: decoded.walletAddress,
              role: decoded.role || 'user',
            };
          }
        } catch (error) {
          // Token is invalid, but we don't fail the request
          console.log('Optional auth: Invalid token provided');
        }
      }
    }
    
    next();
  } catch (error) {
    // Don't fail the request for optional auth errors
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Chain ID validation middleware
export const validateChainId = (allowedChainIds: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const chainId = parseInt(req.body.chainId || req.query.chainId as string);
    
    if (!chainId || !allowedChainIds.includes(chainId)) {
      res.status(400).json({
        error: 'Invalid chain ID',
        message: `Chain ID must be one of: ${allowedChainIds.join(', ')}`,
        allowedChainIds,
      });
      return;
    }
    
    next();
  };
};