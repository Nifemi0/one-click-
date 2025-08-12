const { ethers } = require('ethers');

// Test Alchemy Hoodi RPC connection
async function testAlchemyHoodi() {
  console.log('🧪 Testing Alchemy Hoodi RPC Connection...\n');
  
  const rpcUrl = 'https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ';
  
  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    console.log('📡 Connecting to Alchemy Hoodi...');
    
    // Test basic connectivity
    const startTime = Date.now();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const responseTime = Date.now() - startTime;
    
    console.log('✅ Connection successful!');
    console.log(`🔗 Chain ID: ${network.chainId}`);
    console.log(`🌐 Network: ${network.name}`);
    console.log(`📦 Block Number: ${blockNumber}`);
    console.log(`⚡ Response Time: ${responseTime}ms`);
    
    // Test additional functionality
    console.log('\n🧪 Testing additional functionality...');
    
    const gasPrice = await provider.getFeeData();
    console.log(`⛽ Gas Price: ${ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei')} gwei`);
    
    const balance = await provider.getBalance('0x0000000000000000000000000000000000000000');
    console.log(`💰 Zero Address Balance: ${ethers.formatEther(balance)} ETH`);
    
    console.log('\n🎉 All tests passed! Alchemy Hoodi RPC is working perfectly.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Check if your Alchemy API key is correct');
    console.log('2. Verify Hoodi testnet is accessible');
    console.log('3. Check your internet connection');
    console.log('4. Try again in a few minutes');
  }
}

// Test Hoodi Etherscan API
async function testHoodiEtherscan() {
  console.log('\n🔍 Testing Hoodi Etherscan API...\n');
  
  const apiKey = 'P5PP81MEX8AV9FW5S74W96V5WRQQMQ15T4';
  const baseUrl = 'https://api-hoodi.etherscan.io/api';
  
  try {
    const response = await fetch(`${baseUrl}?module=proxy&action=eth_chainId&apikey=${apiKey}`);
    const data = await response.json();
    
    if (data.result) {
      console.log('✅ Etherscan API working!');
      console.log(`🔗 Chain ID: ${data.result}`);
    } else {
      console.log('⚠️ Etherscan API response:', data);
    }
    
  } catch (error) {
    console.error('❌ Etherscan API test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting RPC Connection Tests...\n');
  
  await testAlchemyHoodi();
  await testHoodiEtherscan();
  
  console.log('\n✨ Test completed!');
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAlchemyHoodi, testHoodiEtherscan };