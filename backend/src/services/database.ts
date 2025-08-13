// Database service for PostgreSQL connection and management

import { Pool, PoolClient } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class DatabaseService {
  private pool: Pool;
  private supabase: SupabaseClient;
  private isConnected: boolean = false;

  constructor() {
    // Initialize PostgreSQL connection pool
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    try {
      // Test PostgreSQL connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      // Test Supabase connection
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      if (error) {
        throw error;
      }

      this.isConnected = true;
      console.log('Database connections established successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      this.isConnected = false;
      console.log('Database connections closed');
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }

  getPool(): Pool {
    return this.pool;
  }

  getSupabase(): SupabaseClient {
    return this.supabase;
  }

  isDatabaseConnected(): boolean {
    return this.isConnected;
  }

  // Helper method to get a client from the pool
  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  // Helper method to execute a query with automatic client management
  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  // Helper method to execute a transaction
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // =====================================================
  // USER MANAGEMENT
  // =====================================================

  async createUser(userData: any): Promise<any> {
    const { walletAddress, chainId, preferences = {} } = userData;
    
    const query = `
      INSERT INTO users (wallet_address, chain_id, preferences, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await this.query(query, [walletAddress, chainId, JSON.stringify(preferences)]);
    return result.rows[0];
  }

  async getUser(walletAddress: string): Promise<any> {
    const query = 'SELECT * FROM users WHERE wallet_address = $1';
    const result = await this.query(query, [walletAddress]);
    return result.rows[0] || null;
  }

  async updateUser(walletAddress: string, updates: any): Promise<any> {
    const { chainId, preferences, lastActive } = updates;
    
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    if (chainId !== undefined) {
      updateFields.push(`chain_id = $${paramCount}`);
      updateValues.push(chainId);
      paramCount++;
    }

    if (preferences !== undefined) {
      updateFields.push(`preferences = $${paramCount}`);
      updateValues.push(JSON.stringify(preferences));
      paramCount++;
    }

    if (lastActive !== undefined) {
      updateFields.push(`last_active = $${paramCount}`);
      updateValues.push(lastActive);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return null;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(walletAddress);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE wallet_address = $${paramCount}
      RETURNING *
    `;

    const result = await this.query(query, updateValues);
    return result.rows[0] || null;
  }

  async deleteUser(walletAddress: string): Promise<void> {
    const query = 'DELETE FROM users WHERE wallet_address = $1';
    await this.query(query, [walletAddress]);
  }

  // =====================================================
  // TRAP TEMPLATE MANAGEMENT
  // =====================================================

  async createTrapTemplate(templateData: any): Promise<any> {
    const {
      name,
      description,
      category,
      complexity,
      creatorAddress,
      bytecode,
      abi,
      constructorArgs,
      estimatedCost,
      tags = [],
      isPublic = true
    } = templateData;

    const query = `
      INSERT INTO trap_templates (
        name, description, category, complexity, creator_address, 
        bytecode, abi, constructor_args, estimated_cost, tags, 
        is_public, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `;

    const result = await this.query(query, [
      name, description, category, complexity, creatorAddress,
      bytecode, abi, JSON.stringify(constructorArgs), estimatedCost,
      tags, isPublic
    ]);

    return result.rows[0];
  }

  async getTrapTemplate(id: string): Promise<any> {
    const query = 'SELECT * FROM trap_templates WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateTrapTemplate(templateId: string, updates: any): Promise<any> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return null;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(templateId);

    const query = `
      UPDATE trap_templates 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.query(query, updateValues);
    return result.rows[0] || null;
  }

  async deleteTrapTemplate(templateId: string): Promise<void> {
    const query = 'DELETE FROM trap_templates WHERE id = $1';
    await this.query(query, [templateId]);
  }

  async getTrapTemplates(filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM trap_templates WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.complexity) {
      query += ` AND complexity = $${paramCount}`;
      values.push(filters.complexity);
      paramCount++;
    }

    if (filters.creator_address) {
      query += ` AND creator_address = $${paramCount}`;
      values.push(filters.creator_address);
      paramCount++;
    }

    if (filters.is_public !== undefined) {
      query += ` AND is_public = $${paramCount}`;
      values.push(filters.is_public);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
      paramCount++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async searchTrapTemplates(filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM trap_templates WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters.query) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${filters.query}%`);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.complexity) {
      query += ` AND complexity = $${paramCount}`;
      values.push(filters.complexity);
      paramCount++;
    }

    if (filters.tags && filters.tags.length > 0) {
      query += ` AND tags && $${paramCount}`;
      values.push(filters.tags);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
      paramCount++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  // =====================================================
  // DEPLOYED TRAP MANAGEMENT
  // =====================================================

  async createDeployedTrap(deploymentData: any): Promise<any> {
    const {
      userId,
      templateId,
      network,
      contractAddress,
      deploymentTxHash,
      status,
      estimatedCost,
      actualCost
    } = deploymentData;

    const query = `
      INSERT INTO deployed_traps (
        user_id, template_id, network, contract_address, 
        deployment_tx_hash, status, estimated_cost, actual_cost,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const result = await this.query(query, [
      userId, templateId, network, contractAddress,
      deploymentTxHash, status, estimatedCost, actualCost
    ]);

    return result.rows[0];
  }

  async getDeployedTrap(id: string): Promise<any> {
    const query = 'SELECT * FROM deployed_traps WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateDeployedTrap(id: string, updates: any): Promise<any> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return null;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `
      UPDATE deployed_traps 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.query(query, updateValues);
    return result.rows[0] || null;
  }

  async getDeployedTrapsByUser(userId: string, filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM deployed_traps WHERE user_id = $1';
    const values: any[] = [userId];
    let paramCount = 2;

    if (filters.user_address) {
      query += ` AND user_address = $${paramCount}`;
      values.push(filters.user_address);
      paramCount++;
    }

    if (filters.chain_id) {
      query += ` AND chain_id = $${paramCount}`;
      values.push(filters.chain_id);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
      paramCount++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  // =====================================================
  // ALERT MANAGEMENT
  // =====================================================

  async createAlert(alertData: any): Promise<any> {
    const {
      userId,
      type,
      severity,
      title,
      message,
      data,
      isRead = false
    } = alertData;

    const query = `
      INSERT INTO alerts (
        user_id, type, severity, title, message, data, is_read, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const result = await this.query(query, [
      userId, type, severity, title, message, JSON.stringify(data), isRead
    ]);

    return result.rows[0];
  }

  async getAlert(id: string): Promise<any> {
    const query = 'SELECT * FROM alerts WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateAlert(id: string, updates: any): Promise<any> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return null;
    }

    updateValues.push(id);

    const query = `
      UPDATE alerts 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.query(query, updateValues);
    return result.rows[0] || null;
  }

  async deleteAlert(id: string): Promise<void> {
    const query = 'DELETE FROM alerts WHERE id = $1';
    await this.query(query, [id]);
  }

  async getAlertsByUser(userId: string, filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM alerts WHERE user_id = $1';
    const values: any[] = [userId];
    let paramCount = 2;

    if (filters.type) {
      query += ` AND type = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    if (filters.severity) {
      query += ` AND severity = $${paramCount}`;
      values.push(filters.severity);
      paramCount++;
    }

    if (filters.isRead !== undefined) {
      query += ` AND is_read = $${paramCount}`;
      values.push(filters.isRead);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
      paramCount++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async markAlertAsRead(id: string): Promise<any> {
    const query = `
      UPDATE alerts 
      SET is_read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async markAllAlertsAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE alerts 
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
    `;
    
    await this.query(query, [userId]);
  }

  async getUnreadAlertCount(userId: string): Promise<number> {
    const query = 'SELECT COUNT(*) FROM alerts WHERE user_id = $1 AND is_read = false';
    const result = await this.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  // =====================================================
  // NOTIFICATION MANAGEMENT
  // =====================================================

  async createNotification(notificationData: any): Promise<any> {
    const {
      userId,
      type,
      title,
      message,
      data,
      isRead = false
    } = notificationData;

    const query = `
      INSERT INTO notifications (
        user_id, type, title, message, data, is_read, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const result = await this.query(query, [
      userId, type, title, message, JSON.stringify(data), isRead
    ]);

    return result.rows[0];
  }

  async getNotification(id: string): Promise<any> {
    const query = 'SELECT * FROM notifications WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateNotification(id: string, updates: any): Promise<any> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return null;
    }

    updateValues.push(id);

    const query = `
      UPDATE notifications 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.query(query, updateValues);
    return result.rows[0] || null;
  }

  async deleteNotification(id: string): Promise<void> {
    const query = 'DELETE FROM notifications WHERE id = $1';
    await this.query(query, [id]);
  }

  async getNotificationsByUser(userId: string, filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM notifications WHERE user_id = $1';
    const values: any[] = [userId];
    let paramCount = 2;

    if (filters.type) {
      query += ` AND type = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    if (filters.isRead !== undefined) {
      query += ` AND is_read = $${paramCount}`;
      values.push(filters.isRead);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
      paramCount++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async markNotificationAsRead(id: string): Promise<any> {
    const query = `
      UPDATE notifications 
      SET is_read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
    `;
    
    await this.query(query, [userId]);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false';
    const result = await this.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  // =====================================================
  // PUSH SUBSCRIPTION MANAGEMENT
  // =====================================================

  async createPushSubscription(subscriptionData: any): Promise<any> {
    const {
      userId,
      endpoint,
      p256dh,
      auth,
      isActive = true
    } = subscriptionData;

    const query = `
      INSERT INTO push_subscriptions (
        user_id, endpoint, p256dh, auth, is_active, created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const result = await this.query(query, [userId, endpoint, p256dh, auth, isActive]);
    return result.rows[0];
  }

  async getPushSubscription(userId: string): Promise<any> {
    const query = 'SELECT * FROM push_subscriptions WHERE user_id = $1 AND is_active = true';
    const result = await this.query(query, [userId]);
    return result.rows[0] || null;
  }

  async updatePushSubscription(userId: string, updates: any): Promise<any> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return null;
    }

    updateValues.push(userId);

    const query = `
      UPDATE push_subscriptions 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await this.query(query, updateValues);
    return result.rows[0] || null;
  }

  async deletePushSubscription(userId: string): Promise<void> {
    const query = 'DELETE FROM push_subscriptions WHERE user_id = $1';
    await this.query(query, [userId]);
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  async getCategories(): Promise<string[]> {
    const query = 'SELECT DISTINCT category FROM trap_templates WHERE category IS NOT NULL';
    const result = await this.query(query);
    return result.rows.map((row: any) => row.category);
  }

  async getComplexities(): Promise<string[]> {
    const query = 'SELECT DISTINCT complexity FROM trap_templates WHERE complexity IS NOT NULL';
    const result = await this.query(query);
    return result.rows.map((row: any) => row.complexity);
  }

  async getStats(): Promise<any> {
    const stats = {
      totalUsers: 0,
      totalTemplates: 0,
      totalDeployments: 0,
      totalAlerts: 0
    };

    try {
      const userCount = await this.query('SELECT COUNT(*) FROM users');
      stats.totalUsers = parseInt(userCount.rows[0].count);

      const templateCount = await this.query('SELECT COUNT(*) FROM trap_templates');
      stats.totalTemplates = parseInt(templateCount.rows[0].count);

      const deploymentCount = await this.query('SELECT COUNT(*) FROM deployed_traps');
      stats.totalDeployments = parseInt(deploymentCount.rows[0].count);

      const alertCount = await this.query('SELECT COUNT(*) FROM alerts');
      stats.totalAlerts = parseInt(alertCount.rows[0].count);
    } catch (error) {
      console.error('Error getting stats:', error);
    }

    return stats;
  }
}