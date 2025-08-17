import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { ContractAnalysisService } from '../services/contractAnalysis';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Don't instantiate services here - they'll be passed from the main app
let analysisService: ContractAnalysisService;

// Function to set the analysis service (called from main app)
export const setAnalysisService = (service: ContractAnalysisService) => {
  analysisService = service;
};

// Analyze contract (public, but rate limited)
router.post('/analyze', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Analysis endpoint' });
}));

router.get('/analyze/:address/:chainId', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Analysis get endpoint' });
}));

router.get('/history/:address/:chainId', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'History endpoint' });
}));

router.post('/compare', optionalAuthMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Compare endpoint' });
}));

router.get('/stats', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Stats endpoint' });
}));

router.get('/networks', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Networks endpoint' });
}));

router.get('/features', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Features endpoint' });
}));

router.get('/health', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Health endpoint' });
}));

router.get('/rate-limit', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Rate limit endpoint' });
}));

export default router;
