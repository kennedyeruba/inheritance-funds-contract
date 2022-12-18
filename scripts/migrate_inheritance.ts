import { ethers } from "hardhat";

async function main() {
  const funds = ethers.utils.parseEther("1");

  const InheritanceFunds = await ethers.getContractFactory("InheritanceFunds");
  const inheritanceFunds = await InheritanceFunds.deploy({ value: funds });

  await inheritanceFunds.deployed();

  console.log(`Inheritance Funds deployed with 1 ETH to ${inheritanceFunds.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
