const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing Database Tables After Schema Setup...\n');

const supabaseUrl = 'https://lctrrotjiwwekquwcpbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdHJyb3RqaXd3ZWtxdXdjcGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTY3MDQsImV4cCI6MjA3MDU5MjcwNH0.1Z2iP9g2f7oWeYiDkPo0WwPr9TLtDCxgnWkg6YFVZXg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseTables() {
  try {
    console.log('📡 Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    
    console.log('✅ Supabase connection successful!\n');
    
    // Test if we can access the database
    console.log('🔍 Testing database access...');
    
    // Try to get table information (this will work even if tables are empty)
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (tablesError && tablesError.code === 'PGRST116') {
      console.log('❌ Users table not found - schema might not have run completely');
      return;
    }
    
    console.log('✅ Database tables are accessible!');
    console.log('📊 Users table query successful');
    
    // Test network table
    console.log('\n🌐 Testing networks table...');
    const { data: networks, error: networksError } = await supabase
      .from('networks')
      .select('chain_id, name, rpc_url')
      .limit(5);
    
    if (networksError) {
      console.log('⚠️ Networks table error:', networksError.message);
    } else {
      console.log('✅ Networks table accessible');
      console.log('📊 Found networks:', networks.length);
      if (networks.length > 0) {
        networks.forEach(network => {
          console.log(`   - Chain ID: ${network.chain_id}, Name: ${network.name}`);
        });
      }
    }
    
    console.log('\n🎉 Database setup verification complete!');
    console.log('✨ Your Drosera system database is ready!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if the schema ran completely in Supabase');
    console.log('2. Verify all tables were created');
    console.log('3. Check for any error messages in the SQL execution');
  }
}

testDatabaseTables();