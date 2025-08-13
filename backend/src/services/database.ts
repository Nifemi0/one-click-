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
  // ALERT MANAGEMENT (EXTENDED)
  // =====================================================

  async getAlertStats(userId: string, timeframe: string): Promise<any> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_read = false THEN 1 END) as unread,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high,
          COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium,
          COUNT(CASE WHEN severity = 'low' THEN 1 END) as low
        FROM alerts 
        WHERE user_id = $1 AND created_at >= $2
      `;
      
      const result = await this.query(query, [userId, timeFilter]);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to get alert stats:', error);
      return { total: 0, unread: 0, critical: 0, high: 0, medium: 0, low: 0 };
    }
  }

  async getAlertTrends(userId: string, timeframe: string, groupBy: string): Promise<any[]> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const groupClause = groupBy === 'day' ? 'DATE(created_at)' : 'DATE_TRUNC(\'hour\', created_at)';
      
      const query = `
        SELECT 
          ${groupClause} as period,
          COUNT(*) as count,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count
        FROM alerts 
        WHERE user_id = $1 AND created_at >= $2
        GROUP BY ${groupClause}
        ORDER BY period DESC
        LIMIT 30
      `;
      
      const result = await this.query(query, [userId, timeFilter]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alert trends:', error);
      return [];
    }
  }

  async getAlertDistribution(userId: string, timeframe: string): Promise<any> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const query = `
        SELECT 
          type,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM alerts WHERE user_id = $1 AND created_at >= $2), 2) as percentage
        FROM alerts 
        WHERE user_id = $1 AND created_at >= $2
        GROUP BY type
        ORDER BY count DESC
      `;
      
      const result = await this.query(query, [userId, timeFilter, timeFilter]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alert distribution:', error);
      return [];
    }
  }

  async getAlertSeverityStats(userId: string, timeframe: string): Promise<any> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const query = `
        SELECT 
          severity,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM alerts WHERE user_id = $1 AND created_at >= $2), 2) as percentage
        FROM alerts 
        WHERE user_id = $1 AND created_at >= $2
        GROUP BY severity
        ORDER BY 
          CASE severity 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            WHEN 'low' THEN 4 
          END
      `;
      
      const result = await this.query(query, [userId, timeFilter, timeFilter]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alert severity stats:', error);
      return [];
    }
  }

  async getAlertNetworkStats(userId: string, timeframe: string): Promise<any[]> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const query = `
        SELECT 
          COALESCE(chain_id, 'unknown') as network,
          COUNT(*) as count,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count
        FROM alerts a
        LEFT JOIN deployed_traps dt ON a.deployment_id = dt.id
        WHERE a.user_id = $1 AND a.created_at >= $2
        GROUP BY COALESCE(chain_id, 'unknown')
        ORDER BY count DESC
      `;
      
      const result = await this.query(query, [userId, timeFilter]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alert network stats:', error);
      return [];
    }
  }

  async getAlertsByContract(address: string, chainId: number, userId: string, options: any = {}): Promise<any[]> {
    try {
      let query = `
        SELECT a.* FROM alerts a
        JOIN deployed_traps dt ON a.deployment_id = dt.id
        WHERE dt.contract_address = $1 AND dt.chain_id = $2 AND a.user_id = $3
      `;
      
      const values = [address, chainId, userId];
      let paramCount = 4;

      if (options.severity) {
        query += ` AND a.severity = $${paramCount}`;
        values.push(options.severity);
        paramCount++;
      }

      if (options.type) {
        query += ` AND a.type = $${paramCount}`;
        values.push(options.type);
        paramCount++;
      }

      query += ' ORDER BY a.created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${paramCount}`;
        values.push(options.limit);
        paramCount++;
      }

      const result = await this.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alerts by contract:', error);
      return [];
    }
  }

  async getAlertsByDeployment(deploymentId: string, userId: string, options: any = {}): Promise<any[]> {
    try {
      let query = `
        SELECT * FROM alerts 
        WHERE deployment_id = $1 AND user_id = $2
      `;
      
      const values = [deploymentId, userId];
      let paramCount = 3;

      if (options.severity) {
        query += ` AND severity = $${paramCount}`;
        values.push(options.severity);
        paramCount++;
      }

      if (options.type) {
        query += ` AND type = $${paramCount}`;
        values.push(options.type);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${paramCount}`;
        values.push(options.limit);
        paramCount++;
      }

      const result = await this.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alerts by deployment:', error);
      return [];
    }
  }

  async getSystemAlerts(options: any = {}): Promise<any[]> {
    try {
      let query = `
        SELECT * FROM alerts 
        WHERE type = 'system'
      `;
      
      const values: any[] = [];
      let paramCount = 1;

      if (options.severity) {
        query += ` AND severity = $${paramCount}`;
        values.push(options.severity);
        paramCount++;
      }

      if (options.timeframe) {
        const timeFilter = this.getTimeFilter(options.timeframe);
        query += ` AND created_at >= $${paramCount}`;
        values.push(timeFilter);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${paramCount}`;
        values.push(options.limit);
        paramCount++;
      }

      const result = await this.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Failed to get system alerts:', error);
      return [];
    }
  }

  // =====================================================
  // ALERT TEMPLATE MANAGEMENT
  // =====================================================

  async getAlertTemplates(): Promise<any[]> {
    try {
      const query = 'SELECT * FROM alert_templates ORDER BY created_at DESC';
      const result = await this.query(query);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alert templates:', error);
      return [];
    }
  }

  async createAlertTemplate(templateData: any): Promise<any> {
    try {
      const {
        name,
        description,
        type,
        severity,
        message,
        data = {},
        isActive = true
      } = templateData;

      const query = `
        INSERT INTO alert_templates (
          name, description, type, severity, message, data, is_active, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
      `;

      const result = await this.query(query, [
        name, description, type, severity, message, JSON.stringify(data), isActive
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create alert template:', error);
      throw error;
    }
  }

  async getAlertTemplate(id: string): Promise<any> {
    try {
      const query = 'SELECT * FROM alert_templates WHERE id = $1';
      const result = await this.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get alert template:', error);
      return null;
    }
  }

  async updateAlertTemplate(id: string, updates: any): Promise<any> {
    try {
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
        UPDATE alert_templates 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await this.query(query, updateValues);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to update alert template:', error);
      throw error;
    }
  }

  async deleteAlertTemplate(id: string): Promise<void> {
    try {
      await this.query('DELETE FROM alert_templates WHERE id = $1', [id]);
    } catch (error) {
      console.error('Failed to delete alert template:', error);
      throw error;
    }
  }

  // =====================================================
  // TRAP TEMPLATE EXTENDED METHODS
  // =====================================================

  async getTrapTemplateCategories(): Promise<string[]> {
    try {
      const query = 'SELECT DISTINCT category FROM trap_templates WHERE category IS NOT NULL ORDER BY category';
      const result = await this.query(query);
      return result.rows.map((row: any) => row.category);
    } catch (error) {
      console.error('Failed to get trap template categories:', error);
      return [];
    }
  }

  async getTrapTemplateComplexities(): Promise<string[]> {
    try {
      const query = 'SELECT DISTINCT complexity FROM trap_templates WHERE complexity IS NOT NULL ORDER BY complexity';
      const result = await this.query(query);
      return result.rows.map((row: any) => row.complexity);
    } catch (error) {
      console.error('Failed to get trap template complexities:', error);
      return [];
    }
  }

  async getPopularTrapTemplates(limit: number = 10, timeframe: string = '30d'): Promise<any[]> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const query = `
        SELECT t.*, COUNT(d.id) as deployment_count
        FROM trap_templates t
        LEFT JOIN deployed_traps d ON t.id = d.template_id AND d.created_at >= $1
        WHERE t.is_public = true
        GROUP BY t.id
        ORDER BY deployment_count DESC, t.created_at DESC
        LIMIT $2
      `;
      
      const result = await this.query(query, [timeFilter, limit]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get popular trap templates:', error);
      return [];
    }
  }

  async getFeaturedTrapTemplates(limit: number = 10): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM trap_templates 
        WHERE is_public = true AND featured = true 
        ORDER BY created_at DESC 
        LIMIT $1
      `;
      
      const result = await this.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get featured trap templates:', error);
      return [];
    }
  }

  async getNewTrapTemplates(limit: number = 10, days: number = 7): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM trap_templates 
        WHERE is_public = true AND created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY created_at DESC 
        LIMIT $1
      `;
      
      const result = await this.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get new trap templates:', error);
      return [];
    }
  }

  async getTrendingTrapTemplates(limit: number = 10, timeframe: string = '7d'): Promise<any[]> {
    try {
      const timeFilter = this.getTimeFilter(timeframe);
      const query = `
        SELECT t.*, COUNT(d.id) as deployment_count
        FROM trap_templates t
        LEFT JOIN deployed_traps d ON t.id = d.template_id AND d.created_at >= $1
        WHERE t.is_public = true
        GROUP BY t.id
        ORDER BY deployment_count DESC, t.created_at DESC
        LIMIT $2
      `;
      
      const result = await this.query(query, [timeFilter, limit]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get trending trap templates:', error);
      return [];
    }
  }

  async getTrapTemplatesByCreator(creatorId: string, options: any = {}): Promise<any[]> {
    try {
      let query = 'SELECT * FROM trap_templates WHERE creator_address = $1';
      const values = [creatorId];
      let paramCount = 2;

      if (options.is_public !== undefined) {
        query += ` AND is_public = $${paramCount}`;
        values.push(options.is_public);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${paramCount}`;
        values.push(options.limit);
        paramCount++;
      }

      const result = await this.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Failed to get trap templates by creator:', error);
      return [];
    }
  }

  async getCreatorStats(creatorId: string): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_templates,
          COUNT(CASE WHEN is_public = true THEN 1 END) as public_templates,
          AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating END) as avg_rating,
          COUNT(DISTINCT d.id) as total_deployments
        FROM trap_templates t
        LEFT JOIN template_ratings r ON t.id = r.template_id
        LEFT JOIN deployed_traps d ON t.id = d.template_id
        WHERE t.creator_address = $1
      `;
      
      const result = await this.query(query, [creatorId]);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to get creator stats:', error);
      return { total_templates: 0, public_templates: 0, avg_rating: 0, total_deployments: 0 };
    }
  }

  async getTemplateDeploymentStats(templateId: string): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_deployments,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_deployments,
          COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_deployments,
          AVG(actual_cost::numeric) as avg_cost
        FROM deployed_traps 
        WHERE template_id = $1
      `;
      
      const result = await this.query(query, [templateId]);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to get template deployment stats:', error);
      return { total_deployments: 0, active_deployments: 0, failed_deployments: 0, avg_cost: 0 };
    }
  }

  async getUserTemplateDeployment(userId: string, templateId: string): Promise<any> {
    try {
      const query = `
        SELECT * FROM deployed_traps 
        WHERE user_id = $1 AND template_id = $2
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      const result = await this.query(query, [userId, templateId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get user template deployment:', error);
      return null;
    }
  }

  async getRelatedTemplates(templateId: string, category: string, limit: number = 5): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM trap_templates 
        WHERE category = $1 AND id != $2 AND is_public = true
        ORDER BY created_at DESC
        LIMIT $3
      `;
      
      const result = await this.query(query, [category, templateId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get related templates:', error);
      return [];
    }
  }

  // =====================================================
  // CONTRACT ANALYSIS METHODS
  // =====================================================

  async createContractAnalysis(analysisData: any): Promise<any> {
    try {
      const {
        contract_address,
        chain_id,
        analysis_result,
        risk_score
      } = analysisData;

      const query = `
        INSERT INTO contract_analysis (
          contract_address, chain_id, analysis_result, risk_score, analyzed_at, expires_at
        )
        VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '24 hours')
        ON CONFLICT (contract_address) 
        DO UPDATE SET 
          analysis_result = $3, 
          risk_score = $4, 
          analyzed_at = NOW(),
          expires_at = NOW() + INTERVAL '24 hours'
        RETURNING *
      `;

      const result = await this.query(query, [
        contract_address, chain_id, JSON.stringify(analysis_result), risk_score
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create contract analysis:', error);
      throw error;
    }
  }

  async getContractAnalysis(address: string, chainId: number): Promise<any> {
    try {
      const query = `
        SELECT * FROM contract_analysis 
        WHERE contract_address = $1 AND chain_id = $2 AND expires_at > NOW()
      `;
      
      const result = await this.query(query, [address, chainId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get contract analysis:', error);
      return null;
    }
  }

  async getContractAnalysisHistory(address: string, chainId: number): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM contract_analysis 
        WHERE contract_address = $1 AND chain_id = $2
        ORDER BY analyzed_at DESC
      `;
      
      const result = await this.query(query, [address, chainId]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get contract analysis history:', error);
      return [];
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  private getTimeFilter(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to 24h
    }
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
}