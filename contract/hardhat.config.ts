import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        mumbai: {
            url: "https://polygon-mumbai-bor.publicnode.com",
            accounts: [`${process.env.DEPLOYER_PRIV_KEY}`],
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: `${process.env.POLYGONSCAN_API_KEY}`,
        },
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
