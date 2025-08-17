// Authentication middleware for JWT token verification

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

// Extend Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
        chainId: number;
        isConnected: boolean;
      };
    }
  }
}

interface JWTPayload {
  walletAddress: string;
  chainId: number;
  isConnected: boolean;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization header provided',
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Validate wallet address format
    if (!ethers.isAddress(decoded.walletAddress)) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid wallet address in token',
      });
      return;
    }

    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
      });
      return;
    }

    // Attach user information to request
    req.user = {
      walletAddress: decoded.walletAddress.toLowerCase(),
      chainId: decoded.chainId,
      isConnected: decoded.isConnected,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication failed',
      });
    }
  }
};

// Optional authentication middleware (doesn't block if no token)
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        
        if (ethers.isAddress(decoded.walletAddress) && decoded.exp >= Date.now() / 1000) {
          req.user = {
            walletAddress: decoded.walletAddress.toLowerCase(),
            chainId: decoded.chainId,
            isConnected: decoded.isConnected,
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Don't block the request, just continue without user info
    next();
  }
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // For now, we'll implement basic role checking
    // In the future, this could be expanded to check user roles from the database
    const userRole = req.user.isConnected ? 'user' : 'guest';
    
    if (!roles.includes(userRole)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Rate limiting middleware for specific endpoints
export const createRateLimiter = (windowMs: number, max: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.user?.walletAddress || req.ip;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      const requestData = requests.get(key)!;
      
      if (now > requestData.resetTime) {
        requestData.count = 1;
        requestData.resetTime = now + windowMs;
      } else {
        requestData.count++;
      }
      
      if (requestData.count > max) {
        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
        });
        return;
      }
    }
    
    next();
  };
};

// Wallet signature verification middleware
export const verifyWalletSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { address, signature, message } = req.body;
    
    if (!address || !signature || !message) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: address, signature, message',
      });
      return;
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid wallet address format',
      });
      return;
    }

    // Verify signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid signature',
        });
        return;
      }
    } catch (error) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Signature verification failed',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Signature verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Signature verification failed',
    });
  }
};

// Chain ID validation middleware
export const validateChainId = (allowedChains: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const chainId = parseInt(req.params.chainId || req.body.chainId);
    
    if (isNaN(chainId) || !allowedChains.includes(chainId)) {
      res.status(400).json({
        error: 'Bad Request',
        message: `Invalid chain ID. Supported chains: ${allowedChains.join(', ')}`,
      });
      return;
    }

    next();
  };
};