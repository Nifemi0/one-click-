const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

console.log("🚀 Deploying Drosera Registry to Hoodi Testnet...\n");

async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy Drosera Registry
  console.log("📋 Deploying DroseraRegistry...");
  const DroseraRegistry = await ethers.getContractFactory("DroseraRegistry");
  const droseraRegistry = await DroseraRegistry.deploy();

  await droseraRegistry.waitForDeployment();
  const registryAddress = await droseraRegistry.getAddress();

  console.log("✅ DroseraRegistry deployed to:", registryAddress);
  console.log("🔗 Transaction hash:", droseraRegistry.deploymentTransaction().hash);

  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await droseraRegistry.deploymentTransaction().wait(3);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const totalTraps = await droseraRegistry.getTotalTraps();
  const totalDeployers = await droseraRegistry.getTotalDeployers();

  console.log("📊 Registry Stats:");
  console.log("   - Total Traps:", totalTraps.toString());
  console.log("   - Total Deployers:", totalDeployers.toString());
  console.log("   - Owner:", await droseraRegistry.owner());

  // Check deployer access
  const isAuthorized = await droseraRegistry.authorizedDeployers(deployer.address);
  console.log("🔑 Deployer authorized:", isAuthorized);

  // Save deployment info
  const deploymentInfo = {
    network: "Hoodi Testnet",
    chainId: 560048,
    contracts: {
      DroseraRegistry: {
        address: registryAddress,
        deployer: deployer.address,
        transactionHash: droseraRegistry.deploymentTransaction().hash,
        blockNumber: droseraRegistry.deploymentTransaction().blockNumber,
        timestamp: new Date().toISOString()
      }
    },
    verification: {
      totalTraps: totalTraps.toString(),
      totalDeployers: totalDeployers.toString(),
      owner: await droseraRegistry.owner(),
      deployerAuthorized: isAuthorized
    }
  };

  console.log("\n📄 Deployment Summary:");
  console.log("   Network: Hoodi Testnet (Chain ID: 560048)");
  console.log("   DroseraRegistry:", registryAddress);
  console.log("   Deployer:", deployer.address);
  console.log("   Transaction:", droseraRegistry.deploymentTransaction().hash);

  // Save to file
  const deploymentPath = path.join(__dirname, "..", "deployments", "drosera-registry.json");
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);

  // Environment variables to add
  console.log("\n🔧 Add these environment variables to your .env file:");
  console.log(`HOODI_DROSERA_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_HOODI_DROSERA_REGISTRY=${registryAddress}`);

  console.log("\n🎉 Drosera Registry deployment completed successfully!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
