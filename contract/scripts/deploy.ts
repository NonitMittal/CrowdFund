import hre from "hardhat";

async function main() {
    const tokenAddress = "0x1Ab9Ee714166d3F80464cf40f171FA0AD5aBD030";
    const contract = await hre.viem.deployContract("CrowdFund", [tokenAddress]);

    console.log(`CrowdFund contract deployed to ${contract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
