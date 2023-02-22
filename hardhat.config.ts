import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import '@openzeppelin/hardhat-upgrades';

const dotenv = require('dotenv');

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    glmr: {
      url: `https://moonnode.raindrop.link`,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.OTHER_KEY || ""] : [],
      timeout: 3600000
    },
  }
};

export default config;
