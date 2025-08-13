// Authentication routes for wallet connection and user management

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { DatabaseService } from '../services/database';
import { verifyWalletSignature } from '../middleware/auth';
import { createRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const db = new DatabaseService();

// Rate limiter for authentication attempts
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes
  message: 'Too many authentication attempts, please try again later.'
});

// Wallet signature verification middleware
router.use('/login', verifyWalletSignature);

// Rate limiting for login
router.use('/login', authRateLimiter);

// Login endpoint
router.post('/login', asyncHandler(async (req, res) => {
  try {
    const { walletAddress, chainId = 560048 } = req.body;
    
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Please provide a valid Ethereum wallet address'
      });
      return;
    }

    // Check if user exists, create if not
    let user = await db.getUser(walletAddress);
    
    if (!user) {
      // Create new user
      user = await db.createUser({
        walletAddress,
        chainId,
        preferences: {
          notifications: {
            email: false,
            push: true,
            telegram: false,
            discord: false
          }
        }
      });
    } else {
      // Update last active and chain ID
      await db.updateUser(walletAddress, {
        lastActive: new Date(),
        chainId
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.wallet_address,
        chainId: user.chain_id,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        chainId: user.chain_id,
        preferences: user.preferences,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
}));

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  try {
    const { walletAddress, chainId, preferences } = req.body;
    
    if (!walletAddress) {
      res.status(400).json({
        error: 'Missing wallet address',
        message: 'Wallet address is required'
      });
      return;
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    if (preferences !== undefined) {
      updateFields.push(`preferences = $${paramCount}`);
      updateValues.push(JSON.stringify(preferences));
      paramCount++;
    }

    if (chainId !== undefined) {
      updateFields.push(`chain_id = $${paramCount}`);
      updateValues.push(chainId);
      paramCount++;
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        error: 'No updates provided',
        message: 'Please provide at least one field to update'
      });
      return;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(walletAddress);

    const updatedUser = await db.updateUser(walletAddress, {
      chainId,
      preferences,
      lastActive: new Date()
    });

    if (!updatedUser) {
      res.status(404).json({
        error: 'User not found',
        message: 'User with the specified wallet address not found'
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        walletAddress: updatedUser.wallet_address,
        chainId: updatedUser.chain_id,
        preferences: updatedUser.preferences,
        updatedAt: updatedUser.updated_at
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'An error occurred while updating profile'
    });
  }
}));

// Get user profile
router.get('/profile/:walletAddress', asyncHandler(async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!ethers.isAddress(walletAddress)) {
      res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Please provide a valid Ethereum wallet address'
      });
      return;
    }

    const user = await db.getUser(walletAddress);
    
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User with the specified wallet address not found'
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        chainId: user.chain_id,
        preferences: user.preferences,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'An error occurred while retrieving profile'
    });
  }
}));

// Logout endpoint (client-side token removal)
router.post('/logout', asyncHandler(async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the logout event for analytics
    const { walletAddress } = req.body;
    
    if (walletAddress) {
      await db.updateUser(walletAddress, {
        lastActive: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout'
    });
  }
}));

// Refresh token endpoint
router.post('/refresh', asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({
        error: 'Missing token',
        message: 'Refresh token is required'
      });
      return;
    }

    // Verify the current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded || !decoded.walletAddress) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      });
      return;
    }

    // Get user to ensure they still exist
    const user = await db.getUser(decoded.walletAddress);
    
    if (!user) {
      res.status(401).json({
        error: 'User not found',
        message: 'User no longer exists'
      });
      return;
    }

    // Generate new token
    const newToken = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.wallet_address,
        chainId: user.chain_id,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: newToken,
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        chainId: user.chain_id,
        preferences: user.preferences,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing token'
    });
  }
}));

// Health check endpoint
router.get('/health', asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Auth service is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      error: 'Health check failed',
      message: 'Auth service is not healthy'
    });
  }
}));

export default router;