import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { DatabaseService } from '../services/database';
import { NotificationService } from '../services/notification';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Don't instantiate services here - they'll be passed from the main app
let db: DatabaseService;
let notification: NotificationService;

// Function to set the services (called from main app)
export const setAlertsServices = (database: DatabaseService, notificationService: NotificationService) => {
  db = database;
  notification = notificationService;
};

router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alerts endpoint' });
}));

router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert by ID endpoint' });
}));

router.patch('/:id/read', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Mark alert as read endpoint' });
}));

router.patch('/read-multiple', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Mark multiple alerts as read endpoint' });
}));

router.patch('/read-all', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Mark all alerts as read endpoint' });
}));

router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Delete alert endpoint' });
}));

router.delete('/delete-multiple', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Delete multiple alerts endpoint' });
}));

router.get('/stats/overview', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert stats overview endpoint' });
}));

router.get('/stats/trends', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert stats trends endpoint' });
}));

router.get('/stats/distribution', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert stats distribution endpoint' });
}));

router.get('/stats/severity', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert stats severity endpoint' });
}));

router.get('/stats/networks', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert stats networks endpoint' });
}));

router.get('/count/unread', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get unread alert count endpoint' });
}));

router.get('/contract/:address', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get contract alerts endpoint' });
}));

router.get('/deployment/:deploymentId', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get deployment alerts endpoint' });
}));

router.post('/custom', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Create custom alert endpoint' });
}));

router.get('/system/all', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get all system alerts endpoint' });
}));

router.get('/templates', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert templates endpoint' });
}));

router.post('/templates', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Create alert template endpoint' });
}));

router.put('/templates/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Update alert template endpoint' });
}));

router.delete('/templates/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Delete alert template endpoint' });
}));

router.get('/preferences', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get alert preferences endpoint' });
}));

router.put('/preferences', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Update alert preferences endpoint' });
}));

router.post('/test-notification', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Test notification endpoint' });
}));

router.get('/channels/health', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get notification channels health endpoint' });
}));

export default router;
