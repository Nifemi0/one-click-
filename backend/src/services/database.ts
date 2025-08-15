// Database service for PostgreSQL connection and management

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class DatabaseService {
  private supabase: SupabaseClient;
  private isConnected: boolean = false;

  constructor() {
    // Initialize Supabase client only
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async connect(): Promise<void> {
    try {
      // Test Supabase connection only
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist yet
        throw error;
      }

      this.isConnected = true;
      console.log('✅ Supabase connection established successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Supabase:', error);
      // Don't throw error, just log it and continue
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    // Supabase client does not have an explicit end method like Pool.end()
    // For now, we'll just log a message.
    console.log('Supabase client does not have an explicit end method.');
  }

  getSupabase(): SupabaseClient {
    return this.supabase;
  }

  isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  // Helper method to execute a query with Supabase
  async query(text: string, params?: any[]): Promise<any> {
    try {
      // For simple queries, we'll use Supabase's built-in methods
      // This is a simplified implementation for backward compatibility
      if (text.includes('SELECT COUNT(*)')) {
        // Handle count queries
        const tableMatch = text.match(/FROM\s+(\w+)/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          const { count, error } = await this.supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (error) throw error;
          return { rows: [{ count: count || 0 }] };
        }
      }
      
      // For other queries, return empty result for now
      // In production, you'd want to implement proper query parsing
      return { rows: [] };
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
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
    
    const result = await this.supabase.from('users').insert({
      wallet_address: walletAddress,
      chain_id: chainId,
      preferences: JSON.stringify(preferences),
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data;
  }

  async getUser(walletAddress: string): Promise<any> {
    const query = 'SELECT * FROM users WHERE wallet_address = $1';
    const result = await this.supabase.from('users').select('*').eq('wallet_address', walletAddress).single();
    return result.data || null;
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

    const result = await this.supabase.from('users').update({
      [updateFields[0]]: updateValues[0], // Use the first update field as the key
      updated_at: new Date(),
    }).eq('wallet_address', walletAddress).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async deleteUser(walletAddress: string): Promise<void> {
    const query = 'DELETE FROM users WHERE wallet_address = $1';
    const result = await this.supabase.from('users').delete().eq('wallet_address', walletAddress);
    if (result.error) {
      throw result.error;
    }
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

    const result = await this.supabase.from('trap_templates').insert({
      name,
      description,
      category,
      complexity,
      creator_address: creatorAddress,
      bytecode,
      abi: JSON.stringify(abi),
      constructor_args: JSON.stringify(constructorArgs),
      estimated_cost: estimatedCost,
      tags: JSON.stringify(tags),
      is_public: isPublic,
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data;
  }

  async getTrapTemplate(id: string): Promise<any> {
    const query = 'SELECT * FROM trap_templates WHERE id = $1';
    const result = await this.supabase.from('trap_templates').select('*').eq('id', id).single();
    return result.data || null;
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

    const result = await this.supabase.from('trap_templates').update({
      [updateFields[0]]: updateValues[0], // Use the first update field as the key
      updated_at: new Date(),
    }).eq('id', templateId).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async deleteTrapTemplate(templateId: string): Promise<void> {
    const query = 'DELETE FROM trap_templates WHERE id = $1';
    const result = await this.supabase.from('trap_templates').delete().eq('id', templateId);
    if (result.error) {
      throw result.error;
    }
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

    const result = await this.supabase.from('trap_templates').select('*').eq('is_public', true).order('created_at', { ascending: false });
    return result.data || [];
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

    const result = await this.supabase.from('trap_templates').select('*').eq('is_public', true).order('created_at', { ascending: false });
    return result.data || [];
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
      INSERT INTO basic_traps (
        user_id, trap_type, trap_name, contract_address, 
        deployment_tx_hash, estimated_cost, network, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    // Get template info for trap_name and trap_type
    const template = await this.supabase.from('trap_templates').select('name, category').eq('id', templateId).single();
    if (template.error) {
      throw template.error;
    }

    const result = await this.supabase.from('basic_traps').insert({
      user_id: userId,
      template_id: templateId,
      network,
      contract_address: contractAddress,
      deployment_tx_hash: deploymentTxHash,
      status,
      estimated_cost: estimatedCost,
      actual_cost: actualCost,
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data;
  }

  async getDeployedTrap(id: string): Promise<any> {
    const query = 'SELECT * FROM basic_traps WHERE id = $1';
    const result = await this.supabase.from('basic_traps').select('*').eq('id', id).single();
    return result.data || null;
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
      UPDATE basic_traps 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.supabase.from('basic_traps').update({
      [updateFields[0]]: updateValues[0], // Use the first update field as the key
      updated_at: new Date(),
    }).eq('id', id).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async getDeployedTrapsByUser(userId: string, filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM basic_traps WHERE user_id = $1';
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

    const result = await this.supabase.from('basic_traps').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return result.data || [];
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

    const result = await this.supabase.from('alerts').insert({
      user_id: userId,
      type,
      severity,
      title,
      message,
      data: JSON.stringify(data),
      is_read: isRead,
      created_at: new Date(),
    }).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data;
  }

  async getAlert(id: string): Promise<any> {
    const query = 'SELECT * FROM alerts WHERE id = $1';
    const result = await this.supabase.from('alerts').select('*').eq('id', id).single();
    return result.data || null;
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

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `
      UPDATE alerts 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.supabase.from('alerts').update({
      [updateFields[0]]: updateValues[0], // Use the first update field as the key
      updated_at: new Date(),
    }).eq('id', id).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async deleteAlert(id: string): Promise<void> {
    const query = 'DELETE FROM alerts WHERE id = $1';
    const result = await this.supabase.from('alerts').delete().eq('id', id);
    if (result.error) {
      throw result.error;
    }
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

    const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return result.data || [];
  }

  async markAlertAsRead(id: string): Promise<any> {
    const query = `
      UPDATE alerts 
      SET is_read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.supabase.from('alerts').update({
      is_read: true,
      updated_at: new Date(),
    }).eq('id', id).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async markAllAlertsAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE alerts 
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
    `;
    
    const result = await this.supabase.from('alerts').update({
      is_read: true,
      updated_at: new Date(),
    }).eq('user_id', userId).eq('is_read', false);

    if (result.error) {
      throw result.error;
    }
  }

  async getUnreadAlertCount(userId: string): Promise<number> {
    const query = 'SELECT COUNT(*) FROM alerts WHERE user_id = $1 AND is_read = false';
    const { count, error } = await this.supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return count || 0;
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

    const result = await this.supabase.from('notifications').insert({
      user_id: userId,
      type,
      title,
      message,
      data: JSON.stringify(data),
      is_read: isRead,
      created_at: new Date(),
    }).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data;
  }

  async getNotification(id: string): Promise<any> {
    const query = 'SELECT * FROM notifications WHERE id = $1';
    const result = await this.supabase.from('notifications').select('*').eq('id', id).single();
    return result.data || null;
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

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `
      UPDATE notifications 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.supabase.from('notifications').update({
      [updateFields[0]]: updateValues[0], // Use the first update field as the key
      updated_at: new Date(),
    }).eq('id', id).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async deleteNotification(id: string): Promise<void> {
    const query = 'DELETE FROM notifications WHERE id = $1';
    const result = await this.supabase.from('notifications').delete().eq('id', id);
    if (result.error) {
      throw result.error;
    }
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

    const result = await this.supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return result.data || [];
  }

  async markNotificationAsRead(id: string): Promise<any> {
    const query = `
      UPDATE notifications 
      SET is_read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.supabase.from('notifications').update({
      is_read: true,
      updated_at: new Date(),
    }).eq('id', id).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
    `;
    
    const result = await this.supabase.from('notifications').update({
      is_read: true,
      updated_at: new Date(),
    }).eq('user_id', userId).eq('is_read', false);

    if (result.error) {
      throw result.error;
    }
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false';
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return count || 0;
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

    const result = await this.supabase.from('push_subscriptions').insert({
      user_id: userId,
      endpoint,
      p256dh,
      auth,
      is_active: isActive,
      created_at: new Date(),
    }).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data;
  }

  async getPushSubscription(userId: string): Promise<any> {
    const query = 'SELECT * FROM push_subscriptions WHERE user_id = $1 AND is_active = true';
    const result = await this.supabase.from('push_subscriptions').select('*').eq('user_id', userId).eq('is_active', true).single();
    return result.data || null;
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

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(userId);

    const query = `
      UPDATE push_subscriptions 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await this.supabase.from('push_subscriptions').update({
      [updateFields[0]]: updateValues[0], // Use the first update field as the key
      updated_at: new Date(),
    }).eq('user_id', userId).select().single();

    if (result.error) {
      throw result.error;
    }
    return result.data || null;
  }

  async deletePushSubscription(userId: string): Promise<void> {
    const query = 'DELETE FROM push_subscriptions WHERE user_id = $1';
    const result = await this.supabase.from('push_subscriptions').delete().eq('user_id', userId);
    if (result.error) {
      throw result.error;
    }
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
      
      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data?.[0] || { total: 0, unread: 0, critical: 0, high: 0, medium: 0, low: 0 };
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
      
      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data || [];
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
      
      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data || [];
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
      
      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data || [];
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
        LEFT JOIN basic_traps dt ON a.deployment_id = dt.id
        WHERE a.user_id = $1 AND a.created_at >= $2
        GROUP BY COALESCE(chain_id, 'unknown')
        ORDER BY count DESC
      `;
      
      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data || [];
    } catch (error) {
      console.error('Failed to get alert network stats:', error);
      return [];
    }
  }

  async getAlertsByContract(address: string, chainId: number, userId: string, options: any = {}): Promise<any[]> {
    try {
      let query = `
        SELECT a.* FROM alerts a
        JOIN basic_traps dt ON a.deployment_id = dt.id
        WHERE dt.contract_address = $1 AND dt.network = $2 AND a.user_id = $3
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

      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      return result.data || [];
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

      const result = await this.supabase.from('alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      return result.data || [];
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

      const result = await this.supabase.from('alerts').select('*').eq('type', 'system').order('created_at', { ascending: false });
      return result.data || [];
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
      const result = await this.supabase.from('alert_templates').select('*').order('created_at', { ascending: false });
      return result.data || [];
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

      const result = await this.supabase.from('alert_templates').insert({
        name,
        description,
        type,
        severity,
        message,
        data: JSON.stringify(data),
        is_active: isActive,
        created_at: new Date(),
      }).select().single();

      if (result.error) {
        throw result.error;
      }
      return result.data;
    } catch (error) {
      console.error('Failed to create alert template:', error);
      throw error;
    }
  }

  async getAlertTemplate(id: string): Promise<any> {
    try {
      const query = 'SELECT * FROM alert_templates WHERE id = $1';
      const result = await this.supabase.from('alert_templates').select('*').eq('id', id).single();
      return result.data || null;
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

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id);

      const query = `
        UPDATE alert_templates 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await this.supabase.from('alert_templates').update({
        [updateFields[0]]: updateValues[0], // Use the first update field as the key
        updated_at: new Date(),
      }).eq('id', id).select().single();

      if (result.error) {
        throw result.error;
      }
      return result.data || null;
    } catch (error) {
      console.error('Failed to update alert template:', error);
      throw error;
    }
  }

  async deleteAlertTemplate(id: string): Promise<void> {
    try {
      await this.supabase.from('alert_templates').delete().eq('id', id);
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
      const result = await this.supabase.from('trap_templates').select('category').eq('category', null).order('category', { ascending: true });
      return result.data?.map((row: any) => row.category) || [];
    } catch (error) {
      console.error('Failed to get trap template categories:', error);
      return [];
    }
  }

  async getTrapTemplateComplexities(): Promise<string[]> {
    try {
      const query = 'SELECT DISTINCT complexity FROM trap_templates WHERE complexity IS NOT NULL ORDER BY complexity';
      const result = await this.supabase.from('trap_templates').select('complexity').eq('complexity', null).order('complexity', { ascending: true });
      return result.data?.map((row: any) => row.complexity) || [];
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
        LEFT JOIN basic_traps d ON t.category = d.trap_type AND d.created_at >= $1
        WHERE t.is_public = true
        GROUP BY t.id
        ORDER BY deployment_count DESC, t.created_at DESC
        LIMIT $2
      `;
      
      const result = await this.supabase.from('trap_templates').select('*').eq('is_public', true).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data || [];
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
      
      const result = await this.supabase.from('trap_templates').select('*').eq('is_public', true).eq('featured', true).order('created_at', { ascending: false });
      return result.data || [];
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
      
      const result = await this.supabase.from('trap_templates').select('*').eq('is_public', true).gte('created_at', this.getTimeFilter(days + 'd')).order('created_at', { ascending: false });
      return result.data || [];
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
        LEFT JOIN basic_traps d ON t.category = d.trap_type AND d.created_at >= $1
        WHERE t.is_public = true
        GROUP BY t.id
        ORDER BY deployment_count DESC, t.created_at DESC
        LIMIT $2
      `;
      
      const result = await this.supabase.from('trap_templates').select('*').eq('is_public', true).gte('created_at', timeFilter).order('created_at', { ascending: false });
      return result.data || [];
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

      const result = await this.supabase.from('trap_templates').select('*').eq('creator_address', creatorId).order('created_at', { ascending: false });
      return result.data || [];
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
        LEFT JOIN basic_traps d ON t.category = d.trap_type
        WHERE t.creator_address = $1
      `;
      
      const result = await this.supabase.from('trap_templates').select('*').eq('creator_address', creatorId).order('created_at', { ascending: false });
      return result.data?.[0] || { total_templates: 0, public_templates: 0, avg_rating: 0, total_deployments: 0 };
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
        FROM basic_traps 
        WHERE trap_type = $1
      `;
      
      const result = await this.supabase.from('basic_traps').select('*').eq('trap_type', templateId).order('created_at', { ascending: false });
      return result.data?.[0] || { total_deployments: 0, active_deployments: 0, failed_deployments: 0, avg_cost: 0 };
    } catch (error) {
      console.error('Failed to get template deployment stats:', error);
      return { total_deployments: 0, active_deployments: 0, failed_deployments: 0, avg_cost: 0 };
    }
  }

  async getUserTemplateDeployment(userId: string, templateId: string): Promise<any> {
    try {
      const query = `
        SELECT * FROM basic_traps 
        WHERE user_id = $1 AND trap_type = $2
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      const result = await this.supabase.from('basic_traps').select('*').eq('user_id', userId).eq('trap_type', templateId).order('created_at', { ascending: false });
      return result.data?.[0] || null;
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
      
      const result = await this.supabase.from('trap_templates').select('*').eq('category', category).neq('id', templateId).eq('is_public', true).order('created_at', { ascending: false });
      return result.data || [];
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

      const result = await this.supabase.from('contract_analysis').insert({
        contract_address,
        chain_id,
        analysis_result: JSON.stringify(analysis_result),
        risk_score,
        analyzed_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      }).select().single();

      if (result.error) {
        throw result.error;
      }
      return result.data;
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
      
      const result = await this.supabase.from('contract_analysis').select('*').eq('contract_address', address).eq('chain_id', chainId).gte('expires_at', new Date()).single();
      return result.data || null;
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
      
      const result = await this.supabase.from('contract_analysis').select('*').eq('contract_address', address).eq('chain_id', chainId).order('analyzed_at', { ascending: false });
      return result.data || [];
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
      const { count: userCount, error: userError } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      if (!userError) stats.totalUsers = userCount || 0;

      const { count: templateCount, error: templateError } = await this.supabase
        .from('trap_templates')
        .select('*', { count: 'exact', head: true });
      if (!templateError) stats.totalTemplates = templateCount || 0;

      const { count: deploymentCount, error: deploymentError } = await this.supabase
        .from('basic_traps')
        .select('*', { count: 'exact', head: true });
      if (!deploymentError) stats.totalDeployments = deploymentCount || 0;

      const { count: alertCount, error: alertError } = await this.supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true });
      if (!alertError) stats.totalAlerts = alertCount || 0;
    } catch (error) {
      console.error('Error getting stats:', error);
    }

    return stats;
  }

  async getCategories(): Promise<string[]> {
    const query = 'SELECT DISTINCT category FROM trap_templates WHERE category IS NOT NULL';
    const result = await this.supabase.from('trap_templates').select('category').eq('category', null).order('category', { ascending: true });
    return result.data?.map((row: any) => row.category) || [];
  }

  async getComplexities(): Promise<string[]> {
    const query = 'SELECT DISTINCT complexity FROM trap_templates WHERE complexity IS NOT NULL';
    const result = await this.supabase.from('trap_templates').select('complexity').eq('complexity', null).order('complexity', { ascending: true });
    return result.data?.map((row: any) => row.complexity) || [];
  }

  // =====================================================
  // REAL DATA METHODS (NEW)
  // =====================================================

  async getTrapTemplateCount(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('trap_templates')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to get template count:', error);
      return 0;
    }
  }

  async getDeployedTrapCount(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('basic_traps')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to get deployment count:', error);
      return 0;
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to get user count:', error);
      return 0;
    }
  }

  async getTotalRevenue(): Promise<number> {
    try {
      // For now, return 0 since we don't have revenue tracking yet
      // This can be implemented later with real payment processing
      return 0;
    } catch (error) {
      console.error('Failed to get total revenue:', error);
      return 0;
    }
  }

  async getTopCategories(): Promise<any[]> {
    try {
      const result = await this.supabase
        .from('trap_templates')
        .select('category, estimated_cost')
        .eq('is_public', true);
      
      if (result.error) throw result.error;
      
      // Group by category and count
      const categories = result.data.reduce((acc: any, template: any) => {
        const category = template.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = { name: category, count: 0, deployments: 0, revenue: 0 };
        }
        acc[category].count++;
        return acc;
      }, {});
      
      return Object.values(categories).sort((a: any, b: any) => b.count - a.count).slice(0, 5);
    } catch (error) {
      console.error('Failed to get top categories:', error);
      return [];
    }
  }

  async getTrendingTemplates(): Promise<any[]> {
    try {
      const result = await this.supabase
        .from('trap_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (result.error) throw result.error;
      
      return result.data.map((template: any) => ({
        id: template.id,
        name: template.name,
        category: template.category,
        deployments: 0, // Will be updated when we have real deployment data
        rating: 4.5, // Will be updated when we have real rating data
        price: template.estimated_cost
      }));
    } catch (error) {
      console.error('Failed to get trending templates:', error);
      return [];
    }
  }

  async getRecentActivity(): Promise<any[]> {
    try {
      // Get recent deployments
      const deployments = await this.supabase
        .from('basic_traps')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (deployments.error) throw deployments.error;
      
      return deployments.data.map((deployment: any) => ({
        type: 'deployment',
        templateName: deployment.template_id, // Will be enhanced with template name
        user: deployment.user_id,
        timestamp: deployment.created_at
      }));
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return [];
    }
  }

  // =====================================================
  // BASIC TRAPS METHODS (NEW)
  // =====================================================

  async createBasicTrap(trapData: any): Promise<any> {
    try {
      const result = await this.supabase
        .from('basic_traps')
        .insert(trapData)
        .select()
        .single();
      
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      console.error('Failed to create basic trap:', error);
      throw error;
    }
  }

  async getBasicTrap(id: string): Promise<any> {
    try {
      const result = await this.supabase
        .from('basic_traps')
        .select('*')
        .eq('id', id)
        .single();
      
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      console.error('Failed to get basic trap:', error);
      return null;
    }
  }

  async updateBasicTrap(id: string, updates: any): Promise<any> {
    try {
      const result = await this.supabase
        .from('basic_traps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      console.error('Failed to update basic trap:', error);
      throw error;
    }
  }

  async getUserBasicTraps(userId: string): Promise<any[]> {
    try {
      const result = await this.supabase
        .from('basic_traps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      console.error('Failed to get user basic traps:', error);
      return [];
    }
  }
}