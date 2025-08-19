const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SecurityTrap contract to Hoodi testnet...");
  
  // Get the contract factory
  const SecurityTrap = await ethers.getContractFactory("SecurityTrap");
  
  // Deploy the contract
  const securityTrap = await SecurityTrap.deploy();
  
  // Wait for deployment to finish
  await securityTrap.deployed();
  
  console.log("✅ SecurityTrap deployed to:", securityTrap.address);
  console.log("📋 Contract deployed on network:", network.name);
  console.log("🔗 Block explorer URL:", `https://explorer.hoodi.network/address/${securityTrap.address}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "SecurityTrap",
    contractAddress: securityTrap.address,
    network: network.name,
    deployer: securityTrap.signer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await securityTrap.signer.provider.getBlockNumber()
  };
  
  console.log("📝 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
