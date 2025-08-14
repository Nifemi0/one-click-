#!/usr/bin/env node

// Simple Database setup script for One Click Backend
// This will create the necessary tables in Supabase using the client

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupDatabase() {
  console.log('🚀 Setting up One Click Backend database...\n');

  try {
    // First, let's check what tables exist
    console.log('📋 Checking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('⚠️  Could not check existing tables:', tablesError.message);
    } else {
      console.log('📊 Existing tables:', tables.map(t => t.table_name).join(', '));
    }

    // Try to create basic_traps table using a simple approach
    console.log('\n📋 Attempting to create basic_traps table...');
    
    // We'll try to insert a test record to see if the table exists
    const testRecord = {
      id: 'test_' + Date.now(),
      user_id: '0x0000000000000000000000000000000000000000',
      trap_type: 'test',
      trap_name: 'Test Trap',
      description: 'Test description',
      network: 560048,
      status: 'deploying',
      estimated_cost: '0.001 ETH'
    };

    try {
      const { error: insertError } = await supabase
        .from('basic_traps')
        .insert(testRecord);

      if (insertError && insertError.code === 'PGRST204') {
        console.log('❌ basic_traps table does not exist. You need to create it manually in Supabase dashboard.');
        console.log('📋 SQL to run in Supabase SQL Editor:');
        console.log(`
          CREATE TABLE basic_traps (
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
        `);
      } else if (insertError) {
        console.log('⚠️  Error inserting test record:', insertError.message);
      } else {
        console.log('✅ basic_traps table exists and is working');
        // Clean up test record
        await supabase.from('basic_traps').delete().eq('id', testRecord.id);
      }
    } catch (error) {
      console.log('❌ basic_traps table does not exist');
    }

    // Try to create trap_templates table
    console.log('\n📋 Attempting to create trap_templates table...');
    
    const testTemplate = {
      id: 'test_template_' + Date.now(),
      name: 'Test Template',
      description: 'Test template description',
      category: 'test',
      complexity: 'simple',
      estimated_cost: '0.001 ETH',
      tags: ['test'],
      is_public: true
    };

    try {
      const { error: templateError } = await supabase
        .from('trap_templates')
        .insert(testTemplate);

      if (templateError && templateError.code === 'PGRST204') {
        console.log('❌ trap_templates table does not exist. You need to create it manually in Supabase dashboard.');
        console.log('📋 SQL to run in Supabase SQL Editor:');
        console.log(`
          CREATE TABLE trap_templates (
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
        `);
      } else if (templateError) {
        console.log('⚠️  Error inserting test template:', templateError.message);
      } else {
        console.log('✅ trap_templates table exists and is working');
        // Clean up test record
        await supabase.from('trap_templates').delete().eq('id', testTemplate.id);
      }
    } catch (error) {
      console.log('❌ trap_templates table does not exist');
    }

    console.log('\n📋 Checking if we can read from existing tables...');
    
    // Try to get user count
    try {
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (userError) {
        console.log('⚠️  users table error:', userError.message);
      } else {
        console.log(`✅ users table working - count: ${userCount || 0}`);
      }
    } catch (error) {
      console.log('❌ users table not accessible');
    }

    // Try to get deployed traps count
    try {
      const { count: trapCount, error: trapError } = await supabase
        .from('deployed_traps')
        .select('*', { count: 'exact', head: true });
      
      if (trapError) {
        console.log('⚠️  deployed_traps table error:', trapError.message);
      } else {
        console.log(`✅ deployed_traps table working - count: ${trapCount || 0}`);
      }
    } catch (error) {
      console.log('❌ deployed_traps table not accessible');
    }

    console.log('\n🎉 Database setup check completed!');
    console.log('\n📊 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the CREATE TABLE statements shown above');
    console.log('4. Then test the endpoints again');

  } catch (error) {
    console.error('❌ Database setup check failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();