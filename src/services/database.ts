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

    const createDeployedTrapsTable = `
      CREATE TABLE IF NOT EXISTS deployed_traps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_address VARCHAR(42) NOT NULL,
        contract_address VARCHAR(42) NOT NULL,
        template_id UUID REFERENCES trap_templates(id),
        chain_id INTEGER NOT NULL,
        deployment_tx VARCHAR(66),
        configuration JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        deployed_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createAlertsTable = `
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        trap_id UUID REFERENCES deployed_traps(id),
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
      CREATE INDEX IF NOT EXISTS idx_traps_user_address ON deployed_traps(user_address);
      CREATE INDEX IF NOT EXISTS idx_traps_contract_address ON deployed_traps(contract_address);
      CREATE INDEX IF NOT EXISTS idx_traps_chain_id ON deployed_traps(chain_id);
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
      await this.query(createDeployedTrapsTable);
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
        ALTER TABLE deployed_traps ENABLE ROW LEVEL SECURITY;
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
        CREATE POLICY "Users can read own traps" ON deployed_traps
          FOR SELECT USING (user_address = current_setting('request.jwt.claims')::json->>'wallet_address');
        
        CREATE POLICY "Users can insert own traps" ON deployed_traps
          FOR INSERT WITH CHECK (user_address = current_setting('request.jwt.claims')::json->>'wallet_address');
        
        CREATE POLICY "Users can update own traps" ON deployed_traps
          FOR UPDATE USING (user_address = current_setting('request.jwt.claims')::json->>'wallet_address');
        
        -- Users can only access alerts for their traps
        CREATE POLICY "Users can read own alerts" ON alerts
          FOR SELECT USING (
            trap_id IN (
              SELECT id FROM deployed_traps 
              WHERE user_address = current_setting('request.jwt.claims')::json->>'wallet_address'
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
}