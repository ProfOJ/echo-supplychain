import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying SupplyChainFinancing with the account:", deployer.address);

    const SupplyChainFinancing = await ethers.deployContract("SupplyChainFinancing");


    console.log("Transactions address:", await SupplyChainFinancing.getAddress());

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
