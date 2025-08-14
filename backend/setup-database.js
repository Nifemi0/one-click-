#!/usr/bin/env node

// Database setup script for One Click Backend
// This will create the necessary tables in Supabase

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupDatabase() {
  console.log('🚀 Setting up One Click Backend database...\n');

  try {
    // Create basic_traps table
    console.log('📋 Creating basic_traps table...');
    const { error: basicTrapsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (basicTrapsError) {
      console.log('⚠️  basic_traps table creation failed (might already exist):', basicTrapsError.message);
    } else {
      console.log('✅ basic_traps table created successfully');
    }

    // Create trap_templates table
    console.log('\n📋 Creating trap_templates table...');
    const { error: templatesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS trap_templates (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          complexity VARCHAR(50),
          creator_address VARCHAR(42),
          bytecode TEXT,
          abi JSONB,
          constructor_args JSONB,
          estimated_cost VARCHAR(50),
          tags TEXT[],
          is_public BOOLEAN DEFAULT true,
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (templatesError) {
      console.log('⚠️  trap_templates table creation failed (might already exist):', templatesError.message);
    } else {
      console.log('✅ trap_templates table created successfully');
    }

    // Insert basic trap templates
    console.log('\n📋 Inserting basic trap templates...');
    const { error: insertError } = await supabase
      .from('trap_templates')
      .upsert([
        {
          id: 'honeypot_basic',
          name: 'Basic Honeypot',
          description: 'Simple honeypot that looks like a legitimate contract',
          category: 'honeypot',
          complexity: 'simple',
          estimated_cost: '0.008 ETH',
          tags: ['honeypot', 'basic', 'security'],
          is_public: true
        },
        {
          id: 'honeypot_advanced',
          name: 'Advanced Honeypot',
          description: 'Sophisticated honeypot with realistic DeFi interface',
          category: 'honeypot',
          complexity: 'medium',
          estimated_cost: '0.012 ETH',
          tags: ['honeypot', 'advanced', 'defi'],
          is_public: true
        },
        {
          id: 'sandbox_basic',
          name: 'Security Sandbox',
          description: 'Isolated environment for testing security concepts',
          category: 'sandbox',
          complexity: 'simple',
          estimated_cost: '0.006 ETH',
          tags: ['sandbox', 'testing', 'security'],
          is_public: true
        },
        {
          id: 'monitoring_basic',
          name: 'Basic Monitor',
          description: 'Simple monitoring contract for basic security tracking',
          category: 'monitoring',
          complexity: 'simple',
          estimated_cost: '0.005 ETH',
          tags: ['monitoring', 'tracking', 'security'],
          is_public: true
        },
        {
          id: 'monitoring_advanced',
          name: 'Advanced Monitor',
          description: 'Comprehensive monitoring with advanced analytics',
          category: 'monitoring',
          complexity: 'medium',
          estimated_cost: '0.010 ETH',
          tags: ['monitoring', 'analytics', 'advanced'],
          is_public: true
        },
        {
          id: 'basic_trap',
          name: 'Basic Security Trap',
          description: 'Simple security trap for basic protection',
          category: 'basic',
          complexity: 'simple',
          estimated_cost: '0.004 ETH',
          tags: ['basic', 'security', 'protection'],
          is_public: true
        }
      ], { onConflict: 'id' });

    if (insertError) {
      console.log('⚠️  Template insertion failed:', insertError.message);
    } else {
      console.log('✅ Basic trap templates inserted successfully');
    }

    // Create indexes
    console.log('\n📋 Creating database indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_basic_traps_user_id ON basic_traps(user_id);
        CREATE INDEX IF NOT EXISTS idx_basic_traps_status ON basic_traps(status);
        CREATE INDEX IF NOT EXISTS idx_trap_templates_category ON trap_templates(category);
        CREATE INDEX IF NOT EXISTS idx_trap_templates_complexity ON trap_templates(complexity);
      `
    });

    if (indexError) {
      console.log('⚠️  Index creation failed (might already exist):', indexError.message);
    } else {
      console.log('✅ Database indexes created successfully');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Next steps:');
    console.log('1. Test the marketplace endpoint: GET /api/marketplace/overview');
    console.log('2. Test basic traps: GET /api/basic-traps/templates');
    console.log('3. Deploy a real trap: POST /api/basic-traps/deploy');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();