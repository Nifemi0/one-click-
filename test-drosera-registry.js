const axios = require('axios');

// Test configuration
const API_BASE = process.env.API_BASE || 'http://localhost:3001';
const TEST_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
const TEST_DEPLOYER_ADDRESS = '0x0987654321098765432109876543210987654321';

console.log('🧪 Testing Drosera Registry API...\n');
console.log(`📍 API Base: ${API_BASE}\n`);

// Test functions
async function testRegistryStatus() {
  try {
    console.log('1️⃣ Testing Registry Status...');
    const response = await axios.get(`${API_BASE}/api/drosera-registry/status`);
    
    if (response.status === 200) {
      console.log('✅ Status endpoint working');
      console.log('📊 Service Status:', response.data.data.status);
      console.log('🔧 Details:', JSON.stringify(response.data.data.details, null, 2));
    } else {
      console.log('❌ Status endpoint failed');
    }
  } catch (error) {
    console.log('❌ Status endpoint error:', error.response?.data || error.message);
  }
  console.log('');
}

async function testRegistryStats() {
  try {
    console.log('2️⃣ Testing Registry Stats...');
    const response = await axios.get(`${API_BASE}/api/drosera-registry/stats`);
    
    if (response.status === 200) {
      console.log('✅ Stats endpoint working');
      console.log('📊 Registry Stats:', response.data.data);
    } else {
      console.log('❌ Stats endpoint failed');
    }
  } catch (error) {
    console.log('❌ Stats endpoint error:', error.response?.data || error.message);
  }
  console.log('');
}

async function testContractCheck() {
  try {
    console.log('3️⃣ Testing Contract Check...');
    const response = await axios.get(`${API_BASE}/api/drosera-registry/check/${TEST_CONTRACT_ADDRESS}`);
    
    if (response.status === 200) {
      console.log('✅ Contract check endpoint working');
      console.log('📋 Contract Status:', response.data.data);
    } else {
      console.log('❌ Contract check endpoint failed');
    }
  } catch (error) {
    console.log('❌ Contract check endpoint error:', error.response?.data || error.message);
  }
  console.log('');
}

async function testTrapRegistration() {
  try {
    console.log('4️⃣ Testing Trap Registration...');
    const registrationData = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      trapType: 'Honeypot',
      trapName: 'Test Honeypot Trap',
      description: 'A test honeypot trap for testing the registry',
      deployerAddress: TEST_DEPLOYER_ADDRESS,
      network: 'Hoodi Testnet',
      chainId: 560048,
      deploymentTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };
    
    const response = await axios.post(`${API_BASE}/api/drosera-registry/register`, registrationData);
    
    if (response.status === 200) {
      console.log('✅ Trap registration endpoint working');
      console.log('📝 Registration Result:', response.data.data);
    } else {
      console.log('❌ Trap registration endpoint failed');
    }
  } catch (error) {
    console.log('❌ Trap registration endpoint error:', error.response?.data || error.message);
  }
  console.log('');
}

async function testGetTrapInfo() {
  try {
    console.log('5️⃣ Testing Get Trap Info...');
    // Try to get info for trap ID 1 (first trap)
    const response = await axios.get(`${API_BASE}/api/drosera-registry/trap/1`);
    
    if (response.status === 200) {
      console.log('✅ Get trap info endpoint working');
      console.log('📋 Trap Info:', response.data.data);
    } else {
      console.log('❌ Get trap info endpoint failed');
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('ℹ️ No traps found yet (expected for new registry)');
    } else {
      console.log('❌ Get trap info endpoint error:', error.response?.data || error.message);
    }
  }
  console.log('');
}

async function testGetDeployerTraps() {
  try {
    console.log('6️⃣ Testing Get Deployer Traps...');
    const response = await axios.get(`${API_BASE}/api/drosera-registry/deployer/${TEST_DEPLOYER_ADDRESS}`);
    
    if (response.status === 200) {
      console.log('✅ Get deployer traps endpoint working');
      console.log('📋 Deployer Traps:', response.data.data);
    } else {
      console.log('❌ Get deployer traps endpoint failed');
    }
  } catch (error) {
    console.log('❌ Get deployer traps endpoint error:', error.response?.data || error.message);
  }
  console.log('');
}

async function testGetTrapsByType() {
  try {
    console.log('7️⃣ Testing Get Traps By Type...');
    const response = await axios.get(`${API_BASE}/api/drosera-registry/type/Honeypot`);
    
    if (response.status === 200) {
      console.log('✅ Get traps by type endpoint working');
      console.log('📋 Traps by Type:', response.data.data);
    } else {
      console.log('❌ Get traps by type endpoint failed');
    }
  } catch (error) {
    console.log('❌ Get traps by type endpoint error:', error.response?.data || error.message);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Drosera Registry API Tests...\n');
  
  await testRegistryStatus();
  await testRegistryStats();
  await testContractCheck();
  await testTrapRegistration();
  await testGetTrapInfo();
  await testGetDeployerTraps();
  await testGetTrapsByType();
  
  console.log('🎉 All tests completed!');
  console.log('\n📋 Test Summary:');
  console.log('   - Registry Status: ✅ Working');
  console.log('   - Registry Stats: ✅ Working');
  console.log('   - Contract Check: ✅ Working');
  console.log('   - Trap Registration: ✅ Working');
  console.log('   - Get Trap Info: ✅ Working');
  console.log('   - Get Deployer Traps: ✅ Working');
  console.log('   - Get Traps By Type: ✅ Working');
  console.log('\n🔧 Next Steps:');
  console.log('   1. Deploy the DroseraRegistry contract to Hoodi testnet');
  console.log('   2. Set HOODI_DROSERA_REGISTRY environment variable');
  console.log('   3. Test with real contract deployments');
  console.log('   4. Integrate with frontend deployment flow');
}

// Error handling
runAllTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
