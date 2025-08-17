const https = require('https');
const http = require('http');

console.log('🔌 Testing Supabase project accessibility...');

const supabaseUrl = 'https://lctrrotjiwwekquwcpbn.supabase.co';

function testHttpConnection() {
  return new Promise((resolve, reject) => {
    const req = https.get(supabaseUrl, (res) => {
      console.log('📡 HTTP Status:', res.statusCode);
      console.log('📊 Headers:', res.headers);
      
      if (res.statusCode === 200) {
        console.log('✅ Supabase project is accessible via HTTP');
        resolve(true);
      } else {
        console.log('⚠️ Supabase project returned status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.error('❌ HTTP connection failed:', error.message);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      console.error('❌ HTTP connection timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function runTest() {
  try {
    await testHttpConnection();
    console.log('\n🎯 Next steps:');
    console.log('1. Check if your Supabase project is active in the dashboard');
    console.log('2. Verify the project hasn\'t been paused or suspended');
    console.log('3. Try accessing the project dashboard directly');
    console.log('4. Check if there are any billing issues');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTest();