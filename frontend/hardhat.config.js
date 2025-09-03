require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hoodi: {
      url: process.env.HOODI_RPC_URL || "https://rpc.hoodi.network",
      chainId: 560048,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 5000000
    },
    hardhat: {
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: {
      hoodi: process.env.HOODI_ETHERSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "hoodi",
        chainId: 560048,
        urls: {
          apiURL: "https://explorer.hoodi.network/api",
          browserURL: "https://explorer.hoodi.network"
        }
      }
    ]
  }
};
