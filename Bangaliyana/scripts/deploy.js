const hre = require("hardhat");

async function main() {
  const Bangaliyana = await hre.ethers.getContractFactory("Bangaliyana");
  const bangaliyana = await Bangaliyana.deploy(100000000, 50);

  // Wait for deployment to finish
  await bangaliyana.waitForDeployment();

  console.log("Bangaliyana Token deployed at:", await bangaliyana.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});