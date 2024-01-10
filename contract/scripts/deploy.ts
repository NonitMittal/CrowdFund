import hre from "hardhat";

async function main() {
    const contract = await hre.viem.deployContract("CrowdFund");
    console.log(`CrowdFund contract deployed to ${contract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
 