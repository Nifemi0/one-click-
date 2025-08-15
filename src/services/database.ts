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

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Database initialization (create tables if they don't exist)
  async initializeDatabase(): Promise<void> {
    try {
      await this.createTables();
      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database tables:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        preferences JSONB DEFAULT '{}',
        chain_id INTEGER DEFAULT 1,
        is_connected BOOLEAN DEFAULT FALSE
      );
    `;

    const createTrapTemplatesTable = `
      CREATE TABLE IF NOT EXISTS trap_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        complexity VARCHAR(20) NOT NULL,
        creator_address VARCHAR(42) NOT NULL,
        code_ipfs_hash VARCHAR(100),
        abi JSONB NOT NULL,
        bytecode TEXT NOT NULL,
        is_audited BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 0.0,
        deployment_count INTEGER DEFAULT 0,
        price DECIMAL(20,18) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createBasicTrapsTable = `
      CREATE TABLE IF NOT EXISTS basic_traps (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        trap_type VARCHAR(50) NOT NULL,
        trap_name VARCHAR(255) NOT NULL,
        description TEXT,
        contract_address VARCHAR(42),
        deployment_tx_hash VARCHAR(66),
        network INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'deploying',
        estimated_cost VARCHAR(50),
        actual_cost VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        deployed_at TIMESTAMP,
        metadata JSONB
      );
    `;

    const createAlertsTable = `
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        trap_id VARCHAR(255) REFERENCES basic_traps(id),
        alert_type VARCHAR(50) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        is_acknowledged BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createContractAnalysisTable = `
      CREATE TABLE IF NOT EXISTS contract_analysis (
        contract_address VARCHAR(42) PRIMARY KEY,
        chain_id INTEGER NOT NULL,
        analysis_result JSONB NOT NULL,
        risk_score INTEGER NOT NULL,
        analyzed_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_traps_user_id ON basic_traps(user_id);
      CREATE INDEX IF NOT EXISTS idx_traps_contract_address ON basic_traps(contract_address);
      CREATE INDEX IF NOT EXISTS idx_traps_network ON basic_traps(network);
      CREATE INDEX IF NOT EXISTS idx_alerts_trap_id ON alerts(trap_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
      CREATE INDEX IF NOT EXISTS idx_templates_category ON trap_templates(category);
      CREATE INDEX IF NOT EXISTS idx_templates_complexity ON trap_templates(complexity);
      CREATE INDEX IF NOT EXISTS idx_analysis_contract_address ON contract_analysis(contract_address);
      CREATE INDEX IF NOT EXISTS idx_analysis_expires_at ON contract_analysis(expires_at);
    `;

    try {
      await this.query(createUsersTable);
      await this.query(createTrapTemplatesTable);
      await this.query(createBasicTrapsTable);
      await this.query(createAlertsTable);
      await this.query(createContractAnalysisTable);
      await this.query(createIndexes);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  // Row Level Security (RLS) policies for Supabase
  async setupRLS(): Promise<void> {
    try {
      // Enable RLS on all tables
      const enableRLS = `
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE basic_traps ENABLE ROW LEVEL SECURITY;
        ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE trap_templates ENABLE ROW LEVEL SECURITY;
        ALTER TABLE contract_analysis ENABLE ROW LEVEL SECURITY;
      `;

      // Create policies
      const createPolicies = `
        -- Users can only read/write their own data
        CREATE POLICY "Users can read own data" ON users 
          FOR SELECT USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');
        
        CREATE POLICY "Users can update own data" ON users 
          FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');
        
        -- Users can only access their own traps
        CREATE POLICY "Users can read own traps" ON basic_traps
          FOR SELECT USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');
        
        CREATE POLICY "Users can insert own traps" ON basic_traps
          FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'user_id');
        
        CREATE POLICY "Users can update own traps" ON basic_traps
          FOR UPDATE USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');
        
        -- Users can only access alerts for their traps
        CREATE POLICY "Users can read own alerts" ON alerts
          FOR SELECT USING (
            trap_id IN (
              SELECT id FROM basic_traps 
              WHERE user_id = current_setting('request.jwt.claims')::json->>'user_id'
            )
          );
        
        -- Trap templates are public for reading
        CREATE POLICY "Anyone can read templates" ON trap_templates
          FOR SELECT USING (true);
        
        -- Only creators can update their templates
        CREATE POLICY "Creators can update templates" ON trap_templates
          FOR UPDATE USING (creator_address = current_setting('request.jwt.claims')::json->>'wallet_address');
        
        -- Contract analysis is public for reading
        CREATE POLICY "Anyone can read analysis" ON contract_analysis
          FOR SELECT USING (true);
      `;

      await this.query(enableRLS);
      await this.query(createPolicies);
      
      console.log('Row Level Security policies configured successfully');
    } catch (error) {
      console.error('Error setting up RLS:', error);
      // Don't throw error as RLS is optional for development
    }
  }

  // ===== MISSING METHODS FOR OTHER SERVICES =====

  // Alert management
  async createAlert(alertData: any): Promise<any> {
    const { trap_id, user_id, alert_type, severity, title, message, metadata } = alertData;
    const query = `
      INSERT INTO alerts (trap_id, user_id, alert_type, severity, title, message, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await this.query(query, [trap_id, user_id, alert_type, severity, title, message, metadata]);
    return result.rows[0];
  }

  async updateAlert(alertId: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE alerts SET ${fields} WHERE id = $1 RETURNING *`;
    const values = [alertId, ...Object.values(updates)];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async deleteAlert(alertId: string): Promise<void> {
    await this.query('DELETE FROM alerts WHERE id = $1', [alertId]);
  }

  async getAlertsByUser(userId: string, filters: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM alerts WHERE user_id = $1';
    const values = [userId];
    
    if (filters.isRead !== undefined) {
      query += ' AND is_read = $2';
      values.push(filters.isRead);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await this.query(query, values);
    return result.rows;
  }

  // Contract analysis management
  async createContractAnalysis(analysisData: any): Promise<any> {
    const { contract_address, chain_id, analysis_result, risk_score } = analysisData;
    const query = `
      INSERT INTO contract_analysis (contract_address, chain_id, analysis_result, risk_score, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '24 hours')
      ON CONFLICT (contract_address) 
      DO UPDATE SET 
        analysis_result = $3, 
        risk_score = $4, 
        analyzed_at = NOW(),
        expires_at = NOW() + INTERVAL '24 hours'
      RETURNING *
    `;
    const result = await this.query(query, [contract_address, chain_id, analysis_result, risk_score]);
    return result.rows[0];
  }

  async getContractAnalysis(address: string, chainId: number): Promise<any> {
    const query = `
      SELECT * FROM contract_analysis 
      WHERE contract_address = $1 AND chain_id = $2 AND expires_at > NOW()
    `;
    const result = await this.query(query, [address, chainId]);
    return result.rows[0];
  }

  async getContractAnalysisHistory(address: string, chainId: number): Promise<any[]> {
    const query = `
      SELECT * FROM contract_analysis 
      WHERE contract_address = $1 AND chain_id = $2
      ORDER BY analyzed_at DESC
    `;
    const result = await this.query(query, [address, chainId]);
    return result.rows;
  }

  // User management
  async getUser(userId: string): Promise<any> {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`;
    const values = [userId, ...Object.values(updates)];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getAllUsers(): Promise<any[]> {
    const result = await this.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  // Push subscription management
  async getPushSubscription(userId: string): Promise<any> {
    const result = await this.query('SELECT * FROM push_subscriptions WHERE user_id = $1', [userId]);
    return result.rows[0];
  }

  // Revenue and transaction management
  async createRevenueTransaction(transactionData: any): Promise<any> {
    const { user_id, transaction_type, amount, currency, network_id, tx_hash, description, metadata } = transactionData;
    const query = `
      INSERT INTO revenue_transactions (user_id, transaction_type, amount, currency, network_id, tx_hash, description, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await this.query(query, [user_id, transaction_type, amount, currency, network_id, tx_hash, description, metadata]);
    return result.rows[0];
  }

  async getRevenueTransactions(userId: string, filters: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM revenue_transactions WHERE user_id = $1';
    const values = [userId];
    
    if (filters.transaction_type) {
      query += ' AND transaction_type = $2';
      values.push(filters.transaction_type);
    }
    
    if (filters.status) {
      query += ' AND status = $' + (values.length + 1);
      values.push(filters.status);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await this.query(query, values);
    return result.rows;
  }

  async updateRevenueTransaction(transactionId: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE revenue_transactions SET ${fields} WHERE id = $1 RETURNING *`;
    const values = [transactionId, ...Object.values(updates)];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  // Security trap management
  async createSecurityTrap(trapData: any): Promise<any> {
    const { user_id, network_id, trap_name, trap_description, trap_type, contract_code } = trapData;
    const query = `
      INSERT INTO security_traps (user_id, network_id, trap_name, trap_description, trap_type, contract_code)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await this.query(query, [user_id, network_id, trap_name, trap_description, trap_type, contract_code]);
    return result.rows[0];
  }

  async updateSecurityTrap(trapId: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE security_traps SET ${fields} WHERE id = $1 RETURNING *`;
    const values = [trapId, ...Object.values(updates)];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getSecurityTrap(trapId: string): Promise<any> {
    const result = await this.query('SELECT * FROM security_traps WHERE id = $1', [trapId]);
    return result.rows[0];
  }

  async getSecurityTrapsByUser(userId: string): Promise<any[]> {
    const result = await this.query('SELECT * FROM security_traps WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  // AI analysis management
  async createAIAnalysis(analysisData: any): Promise<any> {
    const { trap_id, user_id, ai_provider, analysis_type, prompt, response, risk_score, vulnerabilities_detected, recommendations } = analysisData;
    const query = `
      INSERT INTO ai_analyses (trap_id, user_id, ai_provider, analysis_type, prompt, response, risk_score, vulnerabilities_detected, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await this.query(query, [trap_id, user_id, ai_provider, analysis_type, prompt, response, risk_score, vulnerabilities_detected, recommendations]);
    return result.rows[0];
  }

  async getAIAnalysis(analysisId: string): Promise<any> {
    const result = await this.query('SELECT * FROM ai_analyses WHERE id = $1', [analysisId]);
    return result.rows[0];
  }

  async getAIAnalysesByTrap(trapId: string): Promise<any[]> {
    const result = await this.query('SELECT * FROM ai_analyses WHERE trap_id = $1 ORDER BY created_at DESC', [trapId]);
    return result.rows;
  }

  // ===== TRAP TEMPLATE MANAGEMENT =====
  async createTrapTemplate(templateData: any): Promise<any> {
    const { name, description, category, complexity, code, tags, creator_address, is_public } = templateData;
    const query = `
      INSERT INTO trap_templates (name, description, category, complexity, code, tags, creator_address, is_public)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await this.query(query, [name, description, category, complexity, code, tags, creator_address, is_public]);
    return result.rows[0];
  }

  async getTrapTemplate(templateId: string): Promise<any> {
    const result = await this.query('SELECT * FROM trap_templates WHERE id = $1', [templateId]);
    return result.rows[0];
  }

  async getTrapTemplates(filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM trap_templates WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND category = $${paramIndex++}`;
      values.push(filters.category);
    }

    if (filters.complexity) {
      query += ` AND complexity = $${paramIndex++}`;
      values.push(filters.complexity);
    }

    if (filters.creator_address) {
      query += ` AND creator_address = $${paramIndex++}`;
      values.push(filters.creator_address);
    }

    if (filters.is_public !== undefined) {
      query += ` AND is_public = $${paramIndex++}`;
      values.push(filters.is_public);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async updateTrapTemplate(templateId: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE trap_templates SET ${fields} WHERE id = $1 RETURNING *`;
    const values = [templateId, ...Object.values(updates)];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async deleteTrapTemplate(templateId: string): Promise<void> {
    await this.query('DELETE FROM trap_templates WHERE id = $1', [templateId]);
  }

  async getTrapTemplateCategories(): Promise<any[]> {
    const result = await this.query('SELECT DISTINCT category FROM trap_templates WHERE is_public = true ORDER BY category');
    return result.rows.map(row => row.category);
  }

  async getTrapTemplateComplexities(): Promise<any[]> {
    const result = await this.query('SELECT DISTINCT complexity FROM trap_templates WHERE is_public = true ORDER BY complexity');
    return result.rows.map(row => row.complexity);
  }

  async getPopularTrapTemplates(limit: number = 10, timeframe: string = '30d'): Promise<any[]> {
    const query = `
      SELECT t.*, COUNT(r.id) as rating_count, AVG(r.rating) as avg_rating
      FROM trap_templates t
      LEFT JOIN template_ratings r ON t.id = r.template_id
      WHERE t.is_public = true
      GROUP BY t.id
      ORDER BY rating_count DESC, avg_rating DESC
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  async getFeaturedTrapTemplates(limit: number = 10): Promise<any[]> {
    const query = `
      SELECT * FROM trap_templates 
      WHERE is_public = true AND featured = true 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  async getNewTrapTemplates(limit: number = 10, days: number = 7): Promise<any[]> {
    const query = `
      SELECT * FROM trap_templates 
      WHERE is_public = true AND created_at >= NOW() - INTERVAL '${days} days'
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  async getTrendingTrapTemplates(limit: number = 10, timeframe: string = '7d'): Promise<any[]> {
    const query = `
      SELECT t.*, COUNT(d.id) as deployment_count
      FROM trap_templates t
      LEFT JOIN basic_traps d ON t.category = d.trap_type
      WHERE t.is_public = true AND d.created_at >= NOW() - INTERVAL '${timeframe}'
      GROUP BY t.id
      ORDER BY deployment_count DESC
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  async searchTrapTemplates(filters: any, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM trap_templates WHERE is_public = true';
    const values = [];
    let paramIndex = 1;

    if (filters.query) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      values.push(`%${filters.query}%`);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND category = $${paramIndex++}`;
      values.push(filters.category);
    }

    if (filters.complexity) {
      query += ` AND complexity = $${paramIndex++}`;
      values.push(filters.complexity);
    }

    if (filters.tags && filters.tags.length > 0) {
      query += ` AND tags && $${paramIndex++}`;
      values.push(filters.tags);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async getTrapTemplatesByCreator(creatorId: string, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM trap_templates WHERE creator_address = $1';
    const values = [creatorId];
    let paramIndex = 2;

    if (options.is_public !== undefined) {
      query += ` AND is_public = $${paramIndex++}`;
      values.push(options.is_public);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async getCreatorStats(creatorId: string): Promise<any> {
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
    const result = await this.query(query, [creatorId]);
    return result.rows[0];
  }

  // ===== BASIC TRAP MANAGEMENT =====
  async createBasicTrap(trapData: any): Promise<any> {
    const { user_id, trap_type, trap_name, contract_address, network, deployment_tx_hash, estimated_cost } = trapData;
    const query = `
      INSERT INTO basic_traps (user_id, trap_type, trap_name, contract_address, network, deployment_tx_hash, estimated_cost, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'deployed')
      RETURNING *
    `;
          const result = await this.query(query, [user_id, trap_type, trap_name, contract_address, network, deployment_tx_hash, estimated_cost]);
    return result.rows[0];
  }

  async getBasicTrap(trapId: string): Promise<any> {
    const result = await this.query('SELECT * FROM basic_traps WHERE id = $1', [trapId]);
    return result.rows[0];
  }

  async getBasicTraps(filters: any = {}, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM basic_traps WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.user_id) {
      query += ` AND user_id = $${paramIndex++}`;
      values.push(filters.user_id);
    }

    if (filters.network) {
      query += ` AND network = $${paramIndex++}`;
      values.push(filters.network);
    }

    if (filters.status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  async updateBasicTrap(trapId: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE basic_traps SET ${fields} WHERE id = $1 RETURNING *`;
    const values = [trapId, ...Object.values(updates)];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async deleteBasicTrap(trapId: string): Promise<void> {
    await this.query('DELETE FROM basic_traps WHERE id = $1', [trapId]);
  }

  // ===== TEMPLATE RATING MANAGEMENT =====
  async createTemplateRating(ratingData: any): Promise<any> {
    const { template_id, user_id, rating, comment } = ratingData;
    const query = `
      INSERT INTO template_ratings (template_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (template_id, user_id) 
      DO UPDATE SET rating = $3, comment = $4, updated_at = NOW()
      RETURNING *
    `;
    const result = await this.query(query, [template_id, user_id, rating, comment]);
    return result.rows[0];
  }

  async getTemplateRating(templateId: string, userId: string): Promise<any> {
    const result = await this.query('SELECT * FROM template_ratings WHERE template_id = $1 AND user_id = $2', [templateId, userId]);
    return result.rows[0];
  }

  async getTemplateRatings(templateId: string, options: any = {}): Promise<any[]> {
    let query = 'SELECT * FROM template_ratings WHERE template_id = $1';
    const values = [templateId];
    let paramIndex = 2;

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(options.offset);
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  // ===== TRAP STATISTICS =====
  async getTrapStats(userId: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_traps,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_traps,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_traps,
        COUNT(CASE WHEN status = 'compromised' THEN 1 END) as compromised_traps,
        SUM(deployment_cost) as total_deployment_cost,
        AVG(deployment_cost) as avg_deployment_cost
      FROM basic_traps
      WHERE user_id = $1
    `;
    const result = await this.query(query, [userId]);
    return result.rows[0];
  }

  // ===== PUSH SUBSCRIPTION MANAGEMENT =====
  async getPushSubscription(userId: string): Promise<any> {
    const result = await this.query('SELECT * FROM push_subscriptions WHERE user_id = $1', [userId]);
    return result.rows[0];
  }

  async createPushSubscription(subscriptionData: any): Promise<any> {
    const { user_id, endpoint, p256dh, auth } = subscriptionData;
    const query = `
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET endpoint = $2, p256dh = $3, auth = $4, updated_at = NOW()
      RETURNING *
    `;
    const result = await this.query(query, [user_id, endpoint, p256dh, auth]);
    return result.rows[0];
  }
}