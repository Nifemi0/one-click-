const { Pool } = require('pg');
require('dotenv').config();

console.log('🔌 Testing Supabase connection...');
console.log('📡 Environment loaded:', !!process.env.DATABASE_URL);

// Encode the password to handle special characters
const password = encodeURIComponent('zAW@#7Z@9FzVb5F');
const connectionString = `postgresql://postgres:${password}@db.lctrrotjiwwekquwcpbn.supabase.co:5432/postgres`;

console.log('🔗 Using connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    
    console.log('✅ Connection successful!');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('📊 Database version:', result.rows[0].db_version.split(' ')[0]);
    
    client.release();
    console.log('\n🎉 Database connection test passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if Supabase project is active');
    console.log('2. Verify network connectivity');
    console.log('3. Check if database is accessible');
  } finally {
    await pool.end();
  }
}

testConnection();