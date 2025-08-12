require("dotenv").config(); // MUST be first
require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_SEPOLIA_ENDPOINT = process.env.INFURA_SEPOLIA_ENDPOINT;

if (!PRIVATE_KEY || !INFURA_SEPOLIA_ENDPOINT) {
  console.error("❌ Missing .env variables. Check PRIVATE_KEY and INFURA_SEPOLIA_ENDPOINT");
  process.exit(1);
}

module.exports = {
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: INFURA_SEPOLIA_ENDPOINT,
      accounts: [PRIVATE_KEY]
    }
  }
};

