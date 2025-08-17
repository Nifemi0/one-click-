import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

// Extend Request interface to include user
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

// Verify wallet signature function
export function verifyWalletSignature(walletAddress: string, message: string, signature: string): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Auth middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    req.user = {
      id: decoded.id || decoded.walletAddress,
      walletAddress: decoded.walletAddress,
      role: decoded.role || 'user'
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
    return;
  }
}

// Optional auth middleware
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      req.user = {
        id: decoded.id || decoded.walletAddress,
        walletAddress: decoded.walletAddress,
        role: decoded.role || 'user'
      };
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
}

// Require role middleware
export function requireRole(requiredRole: string): (req: Request, res: Response, next: NextFunction) => void {
  return function(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
}

// Create rate limiter function
export function createRateLimiter(options: { windowMs: number; max: number; message?: string }): (req: Request, res: Response, next: NextFunction) => void {
  const { windowMs, max, message = 'Too many requests' } = options;
  
  const requests = new Map();
  
  return function(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter((timestamp: number) => timestamp > windowStart);
      requests.set(ip, userRequests);
    }
    
    const userRequests = requests.get(ip) || [];
    
    if (userRequests.length >= max) {
      res.status(429).json({
        success: false,
        message: message
      });
      return;
    }
    
    userRequests.push(now);
    requests.set(ip, userRequests);
    
    next();
  };
}
