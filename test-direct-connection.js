const { Pool } = require('pg');

console.log('🔌 Testing direct Supabase connection...');

// Your password contains special characters that need encoding
const password = 'zAW@#7Z@9FzVb5F';
const encodedPassword = encodeURIComponent(password);

console.log('🔑 Original password:', password);
console.log('🔐 Encoded password:', encodedPassword);

const connectionString = `postgresql://postgres:${encodedPassword}@db.lctrrotjiwwekquwcpbn.supabase.co:5432/postgres`;

console.log('🔗 Connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testDirectConnection() {
  try {
    console.log('\n🧪 Testing direct database connection...');
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    
    console.log('✅ Direct connection successful!');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('📊 Database version:', result.rows[0].db_version.split(' ')[0]);
    
    client.release();
    console.log('\n🎉 Database connection test passed!');
    
  } catch (error) {
    console.error('❌ Direct connection failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if the password contains special characters');
    console.log('2. Verify the project is accessible from your network');
    console.log('3. Check if there are firewall restrictions');
  } finally {
    await pool.end();
  }
}

testDirectConnection();