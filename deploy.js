const hre = require("hardhat");

async function main() {
  const Ericap = await hre.ethers.getContractFactory("Ericap");
  const Ecp = await Ericap.deploy(100000000, 50);

  await Ecp.waitForDeployment();

  console.log("ECP deployed: ", await Ecp.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
