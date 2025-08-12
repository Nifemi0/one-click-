const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupDatabase() {
  console.log('🚀 Setting up Drosera Security Trap System Database...\n');
  
  const pool = new Pool(dbConfig);
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!\n');
    
    // Read schema file
    console.log('📖 Reading database schema...');
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded successfully!\n');
    
    // Execute schema
    console.log('🔧 Creating database schema...');
    await client.query(schema);
    console.log('✅ Database schema created successfully!\n');
    
    // Verify tables
    console.log('🔍 Verifying database setup...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);
    
    console.log('📊 Created tables:');
    tables.forEach(table => console.log(`  - ${table}`));
    
    // Check network setup
    console.log('\n🌐 Checking network configuration...');
    const networkQuery = 'SELECT chain_id, name, rpc_url FROM networks WHERE chain_id = 560048;';
    const networkResult = await client.query(networkQuery);
    
    if (networkResult.rows.length > 0) {
      const network = networkResult.rows[0];
      console.log(`✅ Hoodi Testnet configured:`);
      console.log(`   Chain ID: ${network.chain_id}`);
      console.log(`   Name: ${network.name}`);
      console.log(`   RPC: ${network.rpc_url}`);
    }
    
    // Check RPC providers
    console.log('\n🔌 Checking RPC providers...');
    const rpcQuery = `
      SELECT rp.name, rp.rpc_url, rp.priority, rp.is_active 
      FROM rpc_providers rp 
      JOIN networks n ON rp.network_id = n.id 
      WHERE n.chain_id = 560048 
      ORDER BY rp.priority;
    `;
    const rpcResult = await client.query(rpcQuery);
    
    console.log('✅ RPC providers configured:');
    rpcResult.rows.forEach(provider => {
      console.log(`   ${provider.priority}. ${provider.name} - ${provider.rpc_url} (${provider.is_active ? 'Active' : 'Inactive'})`);
    });
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('✨ Your Drosera system is ready for the next step.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Verify Supabase project is running');
    console.log('3. Check if you have the correct permissions');
    console.log('4. Try running the schema manually in Supabase SQL Editor');
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found in environment variables');
    console.log('📝 Please update your .env file with the correct database connection string');
    console.log('💡 Example: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
    process.exit(1);
  }
  
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };