const { ethers } = require("hardhat");

async function main() {
  const Todolist = await ethers.getContractFactory("Todolist");
  const todolist = await Todolist.deploy();

  await todolist.deployed();

  console.log("Todolist deployed to:", todolist.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
