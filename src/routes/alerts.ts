import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { DatabaseService } from '../services/database';
import { NotificationService } from '../services/notification';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const db = new DatabaseService();
const notification = new NotificationService(db);

// Get user's alerts
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { type, severity, isRead, chainId, page = 1, limit = 20 } = req.query;
  
  const filters: any = { userId: req.user.id };
  if (type) filters.type = type;
  if (severity) filters.severity = severity;
  if (isRead !== undefined) filters.isRead = isRead === 'true';
  if (chainId) filters.chainId = parseInt(chainId as string);
  
  const alerts = await db.getAlertsByUser(req.user.id, filters, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: alerts,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: alerts.length,
    },
  });
}));

// Get alert by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const alert = await db.getAlert(id);
  if (!alert) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found',
    });
  }
  
  // Check if user owns this alert
  if (alert.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  res.json({
    success: true,
    data: alert,
  });
}));

// Mark alert as read
router.patch('/:id/read', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const alert = await db.getAlert(id);
  if (!alert) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found',
    });
  }
  
  // Check if user owns this alert
  if (alert.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  const updatedAlert = await db.updateAlert(id, {
    isRead: true,
    readAt: new Date(),
  });
  
  res.json({
    success: true,
    data: updatedAlert,
    message: 'Alert marked as read',
  });
}));

// Mark multiple alerts as read
router.patch('/read-multiple', authMiddleware, asyncHandler(async (req, res) => {
  const { alertIds } = req.body;
  
  if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Alert IDs array is required',
    });
  }
  
  // Verify user owns all alerts
  for (const alertId of alertIds) {
    const alert = await db.getAlert(alertId);
    if (!alert || (alert.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: `Access denied to alert ${alertId}`,
      });
    }
  }
  
  // Mark all alerts as read
  const updatePromises = alertIds.map(alertId =>
    db.updateAlert(alertId, {
      isRead: true,
      readAt: new Date(),
    })
  );
  
  await Promise.all(updatePromises);
  
  res.json({
    success: true,
    message: `${alertIds.length} alerts marked as read`,
  });
}));

// Mark all user alerts as read
router.patch('/read-all', authMiddleware, asyncHandler(async (req, res) => {
  const { type, severity, chainId } = req.query;
  
  const filters: any = { userId: req.user.id, isRead: false };
  if (type) filters.type = type;
  if (severity) filters.severity = severity;
  if (chainId) filters.chainId = parseInt(chainId as string);
  
  const unreadAlerts = await db.getAlertsByUser(req.user.id, filters);
  
  if (unreadAlerts.length === 0) {
    return res.json({
      success: true,
      message: 'No unread alerts found',
    });
  }
  
  // Mark all as read
  const updatePromises = unreadAlerts.map(alert =>
    db.updateAlert(alert.id, {
      isRead: true,
      readAt: new Date(),
    })
  );
  
  await Promise.all(updatePromises);
  
  res.json({
    success: true,
    message: `${unreadAlerts.length} alerts marked as read`,
  });
}));

// Delete alert
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const alert = await db.getAlert(id);
  if (!alert) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found',
    });
  }
  
  // Check if user owns this alert
  if (alert.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
  
  await db.deleteAlert(id);
  
  res.json({
    success: true,
    message: 'Alert deleted successfully',
  });
}));

// Delete multiple alerts
router.delete('/delete-multiple', authMiddleware, asyncHandler(async (req, res) => {
  const { alertIds } = req.body;
  
  if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Alert IDs array is required',
    });
  }
  
  // Verify user owns all alerts
  for (const alertId of alertIds) {
    const alert = await db.getAlert(alertId);
    if (!alert || (alert.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: `Access denied to alert ${alertId}`,
      });
    }
  }
  
  // Delete all alerts
  const deletePromises = alertIds.map(alertId => db.deleteAlert(alertId));
  await Promise.all(deletePromises);
  
  res.json({
    success: true,
    message: `${alertIds.length} alerts deleted successfully`,
  });
}));

// Get alert statistics
router.get('/stats/overview', authMiddleware, asyncHandler(async (req, res) => {
  const { timeframe = '7d' } = req.query;
  
  const stats = await db.getAlertStats(req.user.id, timeframe as string);
  
  res.json({
    success: true,
    data: stats,
  });
}));

// Get alert trends
router.get('/stats/trends', authMiddleware, asyncHandler(async (req, res) => {
  const { timeframe = '30d', groupBy = 'day' } = req.query;
  
  const trends = await db.getAlertTrends(req.user.id, timeframe as string, groupBy as string);
  
  res.json({
    success: true,
    data: trends,
  });
}));

// Get alert distribution by type
router.get('/stats/distribution', authMiddleware, asyncHandler(async (req, res) => {
  const { timeframe = '30d' } = req.query;
  
  const distribution = await db.getAlertDistribution(req.user.id, timeframe as string);
  
  res.json({
    success: true,
    data: distribution,
  });
}));

// Get alert distribution by severity
router.get('/stats/severity', authMiddleware, asyncHandler(async (req, res) => {
  const { timeframe = '30d' } = req.query;
  
  const severityStats = await db.getAlertSeverityStats(req.user.id, timeframe as string);
  
  res.json({
    success: true,
    data: severityStats,
  });
}));

// Get alert distribution by network
router.get('/stats/networks', authMiddleware, asyncHandler(async (req, res) => {
  const { timeframe = '30d' } = req.query;
  
  const networkStats = await db.getAlertNetworkStats(req.user.id, timeframe as string);
  
  res.json({
    success: true,
    data: networkStats,
  });
}));

// Get unread alert count
router.get('/count/unread', authMiddleware, asyncHandler(async (req, res) => {
  const count = await db.getUnreadAlertCount(req.user.id);
  
  res.json({
    success: true,
    data: { count },
  });
}));

// Get alerts by contract
router.get('/contract/:address', authMiddleware, asyncHandler(async (req, res) => {
  const { address } = req.params;
  const { chainId, page = 1, limit = 20 } = req.query;
  
  if (!chainId) {
    return res.status(400).json({
      success: false,
      error: 'Chain ID is required',
    });
  }
  
  const alerts = await db.getAlertsByContract(address, parseInt(chainId as string), req.user.id, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: alerts,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: alerts.length,
    },
  });
}));

// Get alerts by trap deployment
router.get('/deployment/:deploymentId', authMiddleware, asyncHandler(async (req, res) => {
  const { deploymentId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const alerts = await db.getAlertsByDeployment(deploymentId, req.user.id, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: alerts,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: alerts.length,
    },
  });
}));

// Create custom alert (admin only)
router.post('/custom', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const {
    userId,
    type,
    severity,
    title,
    message,
    data,
    chainId,
    contractAddress,
  } = req.body;
  
  // Validate required fields
  if (!userId || !type || !severity || !title || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }
  
  // Validate severity
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(severity)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid severity level',
    });
  }
  
  const alert = await db.createAlert({
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    severity,
    title,
    message,
    data: data || {},
    chainId: chainId || null,
    contractAddress: contractAddress || null,
    createdAt: new Date(),
    isRead: false,
  });
  
  // Send notification
  await notification.sendNotification(userId, {
    type: severity === 'critical' ? 'error' : severity === 'high' ? 'warning' : 'info',
    title,
    message,
    data: alert,
  });
  
  res.status(201).json({
    success: true,
    data: alert,
    message: 'Custom alert created and notification sent',
  });
}));

// Get system alerts (admin only)
router.get('/system/all', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  
  const alerts = await db.getSystemAlerts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  
  res.json({
    success: true,
    data: alerts,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: alerts.length,
    },
  });
}));

// Get alert templates (admin only)
router.get('/templates', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const templates = await db.getAlertTemplates();
  
  res.json({
    success: true,
    data: templates,
  });
}));

// Create alert template (admin only)
router.post('/templates', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const {
    name,
    description,
    type,
    severity,
    title,
    message,
    data,
    conditions,
  } = req.body;
  
  // Validate required fields
  if (!name || !description || !type || !severity || !title || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }
  
  const template = await db.createAlertTemplate({
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    type,
    severity,
    title,
    message,
    data: data || {},
    conditions: conditions || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  res.status(201).json({
    success: true,
    data: template,
  });
}));

// Update alert template (admin only)
router.put('/templates/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const template = await db.getAlertTemplate(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  updateData.updatedAt = new Date();
  const updatedTemplate = await db.updateAlertTemplate(id, updateData);
  
  res.json({
    success: true,
    data: updatedTemplate,
  });
}));

// Delete alert template (admin only)
router.delete('/templates/:id', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const template = await db.getAlertTemplate(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  
  await db.deleteAlertTemplate(id);
  
  res.json({
    success: true,
    message: 'Template deleted successfully',
  });
}));

// Get notification preferences
router.get('/preferences', authMiddleware, asyncHandler(async (req, res) => {
  const preferences = await notification.getUserPreferences(req.user.id);
  
  res.json({
    success: true,
    data: preferences,
  });
}));

// Update notification preferences
router.put('/preferences', authMiddleware, asyncHandler(async (req, res) => {
  const updateData = req.body;
  
  await notification.updateUserPreferences(req.user.id, updateData);
  
  res.json({
    success: true,
    message: 'Notification preferences updated successfully',
  });
}));

// Test notification (admin only)
router.post('/test-notification', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const { userId, type, title, message } = req.body;
  
  if (!userId || !type || !title || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }
  
  try {
    await notification.sendNotification(userId, {
      type,
      title,
      message,
    });
    
    res.json({
      success: true,
      message: 'Test notification sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send test notification',
      details: error.message,
    });
  }
}));

// Get notification channel health (admin only)
router.get('/channels/health', authMiddleware, requireRole('admin'), asyncHandler(async (req, res) => {
  const health = await notification.checkChannelHealth();
  
  res.json({
    success: true,
    data: health,
  });
}));

export default router;