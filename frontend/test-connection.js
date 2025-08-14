#!/usr/bin/env node

// Simple connection test script
const API_BASE = 'http://localhost:3001';

const endpoints = [
  { name: 'Server Health', path: '/health' },
  { name: 'Auth Health', path: '/api/auth/health' },
  { name: 'Marketplace Categories', path: '/api/marketplace/categories' },
  { name: 'Marketplace Complexities', path: '/api/marketplace/complexities' },
  { name: 'Marketplace Stats', path: '/api/marketplace/stats' },
  { name: 'Basic Traps Templates', path: '/api/basic-traps/templates' },
  { name: 'RPC Status', path: '/api/rpc-test/status' },
];

async function testEndpoint(name, path) {
  try {
    const response = await fetch(`${API_BASE}${path}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);
      return { success: true, data };
    } else {
      console.log(`❌ ${name}: FAILED (${response.status})`);
      return { success: false, error: data.message || 'Unknown error' };
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🔗 Testing Frontend-Backend Connection...\n');
  console.log(`📡 Backend URL: ${API_BASE}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.path);
    results.push({ ...endpoint, ...result });
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
  }
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }
  
  if (successful === results.length) {
    console.log('\n🎉 All tests passed! Frontend-Backend connection is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend server and configuration.');
  }
}

// Run the tests
runAllTests().catch(console.error);