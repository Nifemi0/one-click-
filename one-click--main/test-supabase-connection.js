const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔌 Testing Supabase connection...');

const supabaseUrl = 'https://lctrrotjiwwekquwcpbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdHJyb3RqaXd3ZWtxdXdjcGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTY3MDQsImV4cCI6MjA3MDU5MjcwNH0.1Z2iP9g2f7oWeYiDkPo0WwPr9TLtDCxgnWkg6YFVZXg';

console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('\n🧪 Testing Supabase client connection...');
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .rpc('version');
    
    if (error) {
      // If RPC fails, try a simple select
      console.log('⚠️ RPC version failed, trying simple query...');
      const { data: data2, error: error2 } = await supabase
        .from('_dummy_table_')
        .select('*')
        .limit(1);
      
      if (error2 && error2.code === 'PGRST116') {
        console.log('✅ Supabase connection successful! (Project is active)');
        console.log('📊 Project is ready for database setup');
        return;
      }
      throw error2;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Version data:', data);
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if Supabase project is active');
    console.log('2. Verify the project URL and API key');
    console.log('3. Check if the project is paused or suspended');
    console.log('4. Try accessing the project dashboard');
  }
}

testSupabaseConnection();