import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const { TESTNET_PRIVATE_KEY, RPC_NODE, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  // defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: `${RPC_NODE}`,
      accounts: [`${TESTNET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`,
  },
};

export default config;
