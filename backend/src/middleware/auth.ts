// Authentication routes for wallet connection and user management

import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { DatabaseService } from '../services/database';
import { verifyWalletSignature } from '../middleware/auth';
import { createRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

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

const router = Router();

// Create rate limiter for login attempts
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

// Wallet connection endpoint
router.post('/connect', authRateLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: walletAddress, signature, message'
      });
    }

    // Verify the signature
    const isValidSignature = verifyWalletSignature(walletAddress, message, signature);
    
    if (!isValidSignature) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { walletAddress, role: 'user' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      token,
      user: {
        walletAddress,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect wallet',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get user profile
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    res.json({
      success: true,
      user: req.user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

export default router;
