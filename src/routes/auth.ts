// Authentication routes for wallet connection and user management

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { DatabaseService } from '../services/database';
import { verifyWalletSignature, createRateLimiter } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const databaseService = new DatabaseService();

// Rate limiting for auth endpoints
const authRateLimiter = createRateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes

// Generate JWT token
const generateToken = (walletAddress: string, chainId: number, isConnected: boolean): string => {
  const payload = {
    walletAddress: walletAddress.toLowerCase(),
    chainId,
    isConnected,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.JWT_EXPIRES_IN || '7d') * 24 * 60 * 60),
  };

  return jwt.sign(payload, process.env.JWT_SECRET!);
};

// Connect wallet with signature verification
router.post('/connect', 
  authRateLimiter,
  verifyWalletSignature,
  asyncHandler(async (req, res) => {
    const { address, chainId = 1 } = req.body;
    
    try {
      // Check if user exists
      const existingUser = await databaseService.query(
        'SELECT * FROM users WHERE wallet_address = $1',
        [address.toLowerCase()]
      );

      let user;
      
      if (existingUser.rows.length > 0) {
        // Update existing user
        user = await databaseService.query(
          `UPDATE users 
           SET chain_id = $1, is_connected = true, updated_at = NOW()
           WHERE wallet_address = $2
           RETURNING *`,
          [chainId, address.toLowerCase()]
        );
        user = user.rows[0];
      } else {
        // Create new user
        user = await databaseService.query(
          `INSERT INTO users (wallet_address, chain_id, is_connected, preferences)
           VALUES ($1, $2, true, '{}')
           RETURNING *`,
          [address.toLowerCase(), chainId]
        );
        user = user.rows[0];
      }

      // Generate JWT token
      const token = generateToken(address, chainId, true);

      // Return user data and token
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          walletAddress: user.wallet_address,
          chainId: user.chain_id,
          isConnected: user.is_connected,
          preferences: user.preferences,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect wallet',
        message: 'Internal server error',
      });
    }
  })
);

// Get user profile
router.get('/profile', 
  asyncHandler(async (req, res) => {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    try {
      const user = await databaseService.query(
        'SELECT * FROM users WHERE wallet_address = $1',
        [walletAddress]
      );

      if (user.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const userData = user.rows[0];

      res.status(200).json({
        success: true,
        user: {
          id: userData.id,
          walletAddress: userData.wallet_address,
          chainId: userData.chain_id,
          isConnected: userData.is_connected,
          preferences: userData.preferences,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        },
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to fetch user profile',
      });
    }
  })
);

// Update user settings
router.put('/settings', 
  asyncHandler(async (req, res) => {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { preferences, chainId } = req.body;

    try {
      const updateFields = [];
      const updateValues = [];
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
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'No fields to update',
        });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(walletAddress);

      const user = await databaseService.query(
        `UPDATE users 
         SET ${updateFields.join(', ')}
         WHERE wallet_address = $${paramCount}
         RETURNING *`,
        updateValues
      );

      if (user.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const userData = user.rows[0];

      res.status(200).json({
        success: true,
        user: {
          id: userData.id,
          walletAddress: userData.wallet_address,
          chainId: userData.chain_id,
          isConnected: userData.is_connected,
          preferences: userData.preferences,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        },
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update user settings',
      });
    }
  })
);

// Disconnect wallet
router.post('/disconnect', 
  asyncHandler(async (req, res) => {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    try {
      await databaseService.query(
        'UPDATE users SET is_connected = false, updated_at = NOW() WHERE wallet_address = $1',
        [walletAddress]
      );

      res.status(200).json({
        success: true,
        message: 'Wallet disconnected successfully',
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to disconnect wallet',
      });
    }
  })
);

// Refresh token
router.post('/refresh', 
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const walletAddress = req.user?.walletAddress;
    const chainId = req.user?.chainId || 1;
    
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    try {
      // Verify user still exists and is connected
      const user = await databaseService.query(
        'SELECT * FROM users WHERE wallet_address = $1 AND is_connected = true',
        [walletAddress]
      );

      if (user.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not found or not connected',
        });
      }

      // Generate new token
      const token = generateToken(walletAddress, chainId, true);

      res.status(200).json({
        success: true,
        token,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to refresh token',
      });
    }
  })
);

// Validate token
router.get('/validate', 
  asyncHandler(async (req, res) => {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    try {
      const user = await databaseService.query(
        'SELECT * FROM users WHERE wallet_address = $1',
        [walletAddress]
      );

      if (user.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        user: {
          walletAddress: user.rows[0].wallet_address,
          chainId: user.rows[0].chain_id,
          isConnected: user.rows[0].is_connected,
        },
      });
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to validate token',
      });
    }
  })
);

export default router;