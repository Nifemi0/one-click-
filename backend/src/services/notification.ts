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
  readAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  telegram: boolean;
  discord: boolean;
  push: boolean;
  telegramChatId?: string;
  discordWebhook?: string;
  emailAddress?: string;
}

export interface NotificationChannel {
  type: 'email' | 'telegram' | 'discord' | 'push';
  enabled: boolean;
  config?: any;
}

export class NotificationService {
  private db: DatabaseService;
  private channels: Map<string, NotificationChannel> = new Map();

  constructor(db: DatabaseService) {
    this.db = db;
    this.initializeChannels();
  }

  private initializeChannels() {
    // Initialize notification channels
    this.channels.set('email', {
      type: 'email',
      enabled: !!process.env.SMTP_HOST,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    });

    this.channels.set('telegram', {
      type: 'telegram',
      enabled: !!process.env.TELEGRAM_BOT_TOKEN,
      config: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        apiUrl: 'https://api.telegram.org/bot',
      },
    });

    this.channels.set('discord', {
      type: 'discord',
      enabled: !!process.env.DISCORD_WEBHOOK_URL,
      config: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      },
    });

    this.channels.set('push', {
      type: 'push',
      enabled: !!process.env.VAPID_PUBLIC_KEY,
      config: {
        vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
        vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
      },
    });
  }

  async sendNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>
  ): Promise<Notification> {
    try {
      // Create notification record
      const newNotification: Notification = {
        ...notification,
        id: this.generateId(),
        isRead: false,
        createdAt: new Date(),
      };

      // Save to database
      await this.db.createAlert(newNotification);

      // Get user preferences
      const preferences = await this.getUserPreferences(userId);

      // Send through enabled channels
      const promises: Promise<any>[] = [];

      if (preferences.email && preferences.emailAddress && this.channels.get('email')?.enabled) {
        promises.push(this.sendEmailNotification(preferences.emailAddress, newNotification));
      }

      if (preferences.telegram && preferences.telegramChatId && this.channels.get('telegram')?.enabled) {
        promises.push(this.sendTelegramNotification(preferences.telegramChatId, newNotification));
      }

      if (preferences.discord && preferences.discordWebhook && this.channels.get('discord')?.enabled) {
        promises.push(this.sendDiscordNotification(preferences.discordWebhook, newNotification));
      }

      if (preferences.push && this.channels.get('push')?.enabled) {
        promises.push(this.sendPushNotification(userId, newNotification));
      }

      // Wait for all notifications to be sent
      await Promise.allSettled(promises);

      return newNotification;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new Error(`Notification failed: ${error.message}`);
    }
  }

  private async sendEmailNotification(email: string, notification: Notification): Promise<void> {
    try {
      const channel = this.channels.get('email');
      if (!channel?.enabled || !channel.config) {
        throw new Error('Email channel not configured');
      }

      // For now, use a simple HTTP email service
      // In production, you'd use a proper SMTP library like nodemailer
      const emailData = {
        to: email,
        subject: notification.title,
        text: notification.message,
        html: this.generateEmailHTML(notification),
      };

      // Send via external email service (e.g., SendGrid, Mailgun)
      if (process.env.EMAIL_SERVICE_URL) {
        await axios.post(process.env.EMAIL_SERVICE_URL, emailData, {
          headers: {
            'Authorization': `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
      }

      console.log(`Email notification sent to ${email}`);
    } catch (error) {
      console.error('Email notification failed:', error);
      throw error;
    }
  }

  private async sendTelegramNotification(chatId: string, notification: Notification): Promise<void> {
    try {
      const channel = this.channels.get('telegram');
      if (!channel?.enabled || !channel.config) {
        throw new Error('Telegram channel not configured');
      }

      const { botToken, apiUrl } = channel.config;
      const message = this.formatTelegramMessage(notification);

      await axios.post(`${apiUrl}${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      });

      console.log(`Telegram notification sent to chat ${chatId}`);
    } catch (error) {
      console.error('Telegram notification failed:', error);
      throw error;
    }
  }

  private async sendDiscordNotification(webhookUrl: string, notification: Notification): Promise<void> {
    try {
      const channel = this.channels.get('discord');
      if (!channel?.enabled) {
        throw new Error('Discord channel not configured');
      }

      const embed = this.formatDiscordEmbed(notification);

      await axios.post(webhookUrl, {
        embeds: [embed],
      });

      console.log('Discord notification sent');
    } catch (error) {
      console.error('Discord notification failed:', error);
      throw error;
    }
  }

  private async sendPushNotification(userId: string, notification: Notification): Promise<void> {
    try {
      const channel = this.channels.get('push');
      if (!channel?.enabled) {
        throw new Error('Push notification channel not configured');
      }

      // Get user's push subscription
      const subscription = await this.db.getPushSubscription(userId);
      if (!subscription) {
        console.log(`No push subscription found for user ${userId}`);
        return;
      }

      // Send push notification
      // This would use a library like web-push
      console.log(`Push notification prepared for user ${userId}`);
    } catch (error) {
      console.error('Push notification failed:', error);
      throw error;
    }
  }

  private generateEmailHTML(notification: Notification): string {
    const colorMap = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    };

    const color = colorMap[notification.type] || colorMap.info;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${notification.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${color}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">${notification.title}</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 20px 0; font-size: 16px;">${notification.message}</p>
              ${notification.data ? `<pre style="background: #fff; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(notification.data, null, 2)}</pre>` : ''}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p>This notification was sent by Drosera Security Traps</p>
                <p>Sent at: ${notification.createdAt.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private formatTelegramMessage(notification: Notification): string {
    const emojiMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    const emoji = emojiMap[notification.type] || emojiMap.info;
    
    let message = `${emoji} <b>${notification.title}</b>\n\n`;
    message += `${notification.message}\n\n`;
    
    if (notification.data) {
      message += `<code>${JSON.stringify(notification.data, null, 2)}</code>\n\n`;
    }
    
    message += `📅 ${notification.createdAt.toLocaleString()}`;
    
    return message;
  }

  private formatDiscordEmbed(notification: Notification): any {
    const colorMap = {
      success: 0x10B981,
      error: 0xEF4444,
      warning: 0xF59E0B,
      info: 0x3B82F6,
    };

    const color = colorMap[notification.type] || colorMap.info;

    return {
      title: notification.title,
      description: notification.message,
      color: color,
      timestamp: notification.createdAt.toISOString(),
      footer: {
        text: 'Drosera Security Traps',
      },
      ...(notification.data && {
        fields: [
          {
            name: 'Additional Data',
            value: `\`\`\`json\n${JSON.stringify(notification.data, null, 2)}\n\`\`\``,
            inline: false,
          },
        ],
      }),
    };
  }

  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      // Get user preferences from database
      const user = await this.db.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        userId,
        email: user.preferences?.notifications?.email || false,
        telegram: user.preferences?.notifications?.telegram || false,
        discord: user.preferences?.notifications?.discord || false,
        push: user.preferences?.notifications?.push || true,
        telegramChatId: user.preferences?.telegramChatId,
        discordWebhook: user.preferences?.discordWebhook,
        emailAddress: user.preferences?.emailAddress,
      };
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      // Return default preferences
      return {
        userId,
        email: false,
        telegram: false,
        discord: false,
        push: true,
      };
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      await this.db.updateUser(userId, {
        preferences: preferences,
      });
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.db.updateAlert(notificationId, {
        isRead: true,
        readAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      return await this.db.getAlertsByUser(userId, { isRead: false });
    } catch (error) {
      console.error('Failed to get unread notifications:', error);
      return [];
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.db.deleteAlert(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  async sendBulkNotification(
    userIds: string[],
    notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>
  ): Promise<void> {
    try {
      const promises = userIds.map(userId =>
        this.sendNotification(userId, notification)
      );

      await Promise.allSettled(promises);
      console.log(`Bulk notification sent to ${userIds.length} users`);
    } catch (error) {
      console.error('Bulk notification failed:', error);
      throw error;
    }
  }

  async sendSystemNotification(
    notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>
  ): Promise<void> {
    try {
      // Get all active users
      const users = await this.db.getAllUsers();
      const userIds = users.map(user => user.id);

      await this.sendBulkNotification(userIds, notification);
    } catch (error) {
      console.error('System notification failed:', error);
      throw error;
    }
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Health check for notification channels
  async checkChannelHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    for (const [name, channel] of this.channels) {
      try {
        if (channel.enabled) {
          // Test each channel
          switch (name) {
            case 'email':
              health[name] = !!process.env.SMTP_HOST;
              break;
            case 'telegram':
              health[name] = !!process.env.TELEGRAM_BOT_TOKEN;
              break;
            case 'discord':
              health[name] = !!process.env.DISCORD_WEBHOOK_URL;
              break;
            case 'push':
              health[name] = !!process.env.VAPID_PUBLIC_KEY;
              break;
            default:
              health[name] = false;
          }
        } else {
          health[name] = false;
        }
      } catch (error) {
        health[name] = false;
      }
    }

    return health;
  }
}