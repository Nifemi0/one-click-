import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { DatabaseService } from '../services/database';
import { verifyWalletSignature, createRateLimiter } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Create rate limiter for login attempts
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts'
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

    return res.json({
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
    return res.status(500).json({
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

    return res.json({
      success: true,
      user: req.user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

export default router;
