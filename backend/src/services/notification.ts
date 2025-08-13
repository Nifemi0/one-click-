import axios from 'axios';
import { DatabaseService } from './database';

export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationService {
  private db: DatabaseService;
  private webhookUrl?: string;
  private pushVapidPublicKey?: string;
  private pushVapidPrivateKey?: string;

  constructor(db: DatabaseService) {
    this.db = db;
    this.webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
    this.pushVapidPublicKey = process.env.PUSH_VAPID_PUBLIC_KEY;
    this.pushVapidPrivateKey = process.env.PUSH_VAPID_PRIVATE_KEY;
  }

  async sendNotification(userId: string, notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> {
    try {
      // Create notification in database
      const notification = await this.db.createNotification({
        userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data || {},
        isRead: false
      });

      // Send push notification if user has subscription
      await this.sendPushNotification(userId, notification);

      // Send webhook if configured
      if (this.webhookUrl) {
        await this.sendWebhookNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new Error(`Notification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendPushNotification(userId: string, notification: Notification): Promise<void> {
    try {
      const subscription = await this.db.getPushSubscription(userId);
      if (!subscription) {
        return; // User has no push subscription
      }

      if (!this.pushVapidPublicKey || !this.pushVapidPrivateKey) {
        console.warn('Push notification keys not configured');
        return;
      }

      // Prepare push message
      const pushMessage = {
        title: notification.title,
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: notification.data || {},
        actions: [
          {
            action: 'view',
            title: 'View'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      };

      // Send push notification
      await this.sendPushMessage(subscription, pushMessage);
    } catch (error) {
      console.error('Failed to send push notification:', error);
      // Don't throw error as push notification failure shouldn't break the main flow
    }
  }

  private async sendPushMessage(subscription: any, message: any): Promise<void> {
    try {
      // This is a simplified implementation
      // In production, you'd use a proper push notification service
      console.log('Sending push notification:', { subscription: subscription.endpoint, message });
      
      // For now, just log the notification
      // In a real implementation, you'd use web-push or similar library
    } catch (error) {
      console.error('Failed to send push message:', error);
    }
  }

  async sendWebhookNotification(notification: Notification): Promise<void> {
    try {
      if (!this.webhookUrl) {
        return;
      }

      const webhookData = {
        notification: {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          createdAt: notification.createdAt
        },
        timestamp: new Date().toISOString(),
        source: 'drosera-backend'
      };

      await axios.post(this.webhookUrl, webhookData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Drosera-Notification-Service/1.0'
        },
        timeout: 5000
      });
    } catch (error) {
      console.error('Failed to send webhook notification:', error);
      // Don't throw error as webhook failure shouldn't break the main flow
    }
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    try {
      return await this.db.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return null;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await this.db.markAllNotificationsAsRead(userId);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.db.getUnreadNotificationCount(userId);
    } catch (error) {
      console.error('Failed to get unread notification count:', error);
      return 0;
    }
  }

  async getUserNotifications(userId: string, options: any = {}): Promise<Notification[]> {
    try {
      return await this.db.getNotificationsByUser(userId, {}, options);
    } catch (error) {
      console.error('Failed to get user notifications:', error);
      return [];
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await this.db.deleteNotification(notificationId);
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }

  async createPushSubscription(userId: string, subscriptionData: any): Promise<any> {
    try {
      return await this.db.createPushSubscription({
        userId,
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
        isActive: true
      });
    } catch (error) {
      console.error('Failed to create push subscription:', error);
      throw error;
    }
  }

  async updatePushSubscription(userId: string, updates: any): Promise<any> {
    try {
      return await this.db.updatePushSubscription(userId, updates);
    } catch (error) {
      console.error('Failed to update push subscription:', error);
      throw error;
    }
  }

  async deletePushSubscription(userId: string): Promise<void> {
    try {
      await this.db.deletePushSubscription(userId);
    } catch (error) {
      console.error('Failed to delete push subscription:', error);
      throw error;
    }
  }

  async sendBulkNotification(userIds: string[], notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'userId'>): Promise<void> {
    try {
      const notifications = await Promise.all(
        userIds.map(userId => 
          this.sendNotification(userId, {
            ...notificationData,
            userId
          })
        )
      );

      console.log(`Sent ${notifications.length} bulk notifications`);
    } catch (error) {
      console.error('Failed to send bulk notifications:', error);
      throw error;
    }
  }

  async sendSystemNotification(notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'userId'>): Promise<void> {
    try {
      // Get all active users
      const users = await this.db.query('SELECT id FROM users WHERE is_active = true');
      
      if (users.rows.length > 0) {
        const userIds = users.rows.map((row: any) => row.id);
        await this.sendBulkNotification(userIds, notificationData);
      }
    } catch (error) {
      console.error('Failed to send system notification:', error);
      throw error;
    }
  }

  async getNotificationStats(userId: string): Promise<any> {
    try {
      const totalNotifications = await this.db.query(
        'SELECT COUNT(*) FROM notifications WHERE user_id = $1',
        [userId]
      );

      const unreadNotifications = await this.db.query(
        'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
        [userId]
      );

      const notificationsByType = await this.db.query(
        'SELECT type, COUNT(*) FROM notifications WHERE user_id = $1 GROUP BY type',
        [userId]
      );

      return {
        total: parseInt(totalNotifications.rows[0].count),
        unread: parseInt(unreadNotifications.rows[0].count),
        byType: notificationsByType.rows.reduce((acc: any, row: any) => {
          acc[row.type] = parseInt(row.count);
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      return {
        total: 0,
        unread: 0,
        byType: {}
      };
    }
  }
}