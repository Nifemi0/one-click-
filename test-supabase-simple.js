const { createClient } = require('@supabase/supabase-js');

console.log('🔌 Testing Supabase client connection...');

const supabaseUrl = 'https://lctrrotjiwwekquwcpbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdHJyb3RqaXd3ZWtxdXdjcGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTY3MDQsImV4cCI6MjA3MDU5MjcwNH0.1Z2iP9g2f7oWeYiDkPo0WwPr9TLtDCxgnWkg6YFVZXg';

console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimpleConnection() {
  try {
    console.log('\n🧪 Testing simple Supabase connection...');
    
    // Try to get project info
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('⚠️ Auth check failed, trying different approach...');
      
      // Try a simple health check
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (response.ok) {
        console.log('✅ Supabase REST API accessible!');
        console.log('📊 Status:', response.status);
        return;
      } else {
        console.log('⚠️ REST API status:', response.status);
      }
    } else {
      console.log('✅ Supabase client connection successful!');
      console.log('📊 Session data:', data);
      return;
    }
    
    console.log('\n🎯 Project appears to be accessible via Supabase client');
    
  } catch (error) {
    console.error('❌ Supabase client test failed:', error.message);
    console.log('\n🔍 This suggests:');
    console.log('1. The project might be paused/suspended');
    console.log('2. There might be network restrictions');
    console.log('3. The project reference might have changed');
  }
}

testSimpleConnection();