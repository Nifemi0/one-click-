const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Drosera Security Trap System Database via Supabase Client...\n');

const supabaseUrl = 'https://lctrrotjiwwekquwcpbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdHJyb3RqaXd3ZWtxdXdjcGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTY3MDQsImV4cCI6MjA3MDU5MjcwNH0.1Z2iP9g2f7oWeYiDkPo0WwPr9TLtDCxgnWkg6YFVZXg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    
    console.log('✅ Supabase connection successful!\n');
    
    // Read schema file
    console.log('📖 Reading database schema...');
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded successfully!\n');
    
    // Note: We can't execute raw SQL via Supabase client
    // We need to use the Supabase dashboard or create tables via API
    console.log('⚠️  Note: Raw SQL execution not available via Supabase client');
    console.log('📋 You need to run the schema manually in Supabase dashboard\n');
    
    console.log('🎯 Next Steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the database-schema.sql content');
    console.log('4. Execute the schema to create all tables');
    
    console.log('\n📊 Schema Summary:');
    console.log('- Users and authentication tables');
    console.log('- Security trap templates and deployments');
    console.log('- AI analysis and monitoring tables');
    console.log('- Revenue and subscription management');
    console.log('- RPC provider configuration');
    
    console.log('\n✨ Once you run the schema in Supabase dashboard, your system will be ready!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if your Supabase project is active');
    console.log('2. Verify the API key is correct');
    console.log('3. Try accessing the project dashboard directly');
  }
}

setupDatabase();