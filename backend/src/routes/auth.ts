// Authentication routes for wallet connection and user management

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { DatabaseService } from '../services/database';
import { verifyWalletSignature } from '../middleware/auth';
import { createRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Create rate limiter for login attempts
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
});

// Don't instantiate services here - they'll be passed from the main app
let databaseService: DatabaseService;

// Function to set the database service (called from main app)
export const setDatabaseService = (db: DatabaseService) => {
  databaseService = db;
};

// Wallet connection and authentication
router.use('/login', verifyWalletSignature);
router.use('/login', authRateLimiter);

router.post('/login', asyncHandler(async (req, res) => {
  // Your login logic here
  res.json({ success: true, message: 'Login endpoint' });
}));

router.put('/profile', asyncHandler(async (req, res) => {
  // Your profile update logic here
  res.json({ success: true, message: 'Profile update endpoint' });
}));

router.get('/profile/:walletAddress', asyncHandler(async (req, res) => {
  // Your profile get logic here
  res.json({ success: true, message: 'Profile get endpoint' });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  // Your logout logic here
  res.json({ success: true, message: 'Logout endpoint' });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  // Your token refresh logic here
  res.json({ success: true, message: 'Token refresh endpoint' });
}));

router.get('/health', asyncHandler(async (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Auth Service',
    timestamp: new Date().toISOString()
  });
}));

export default router;
