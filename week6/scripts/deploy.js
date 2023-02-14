const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;
  console.log(`Deploy from account: ${deployer}`);

  const MungToken = await hre.ethers.getContractFactory('MintableToken');
  const mungToken = await MungToken.deploy('MungToken', 'MUNG');
  await mungToken.deployed();
  console.log(` -> MungToken contract deployed at ${mungToken.address}`);

  const FarmToken = await hre.ethers.getContractFactory('MintableToken');
  const farmToken = await FarmToken.deploy('FarmToken', 'FARM');
  await farmToken.deployed();
  console.log(` -> FarmToken contract deployed at ${farmToken.address}`);

  const MungStaker = await hre.ethers.getContractFactory('MungStaker');
  const mungStaker = await MungStaker.deploy(mungToken.address, farmToken.address);
  await mungStaker.deployed();
  console.log(` -> MungStaker contract deployed at ${mungStaker.address}`);

  console.log(`\n\nNetwork: ${hre.network.name}`);
  console.log('```');
  console.log(`- MungToken: ${mungToken.address}`);
  console.log(`- FarmToken: ${farmToken.address}`);
  console.log(`- MungStaker: ${mungStaker.address}`);
  console.log('```');

  console.log(`
    npx hardhat verify --network ${hre.network.name} ${mungToken.address} 'MungToken' 'MUNG'
    npx hardhat verify --network ${hre.network.name} ${farmToken.address} 'FarmToken' 'FARM'
    npx hardhat verify --network ${hre.network.name} ${mungStaker.address} '${mungToken.address}' '${farmToken.address}'
  `);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


/* Deploy script

npx hardhat compile && npx hardhat run --network goerli scripts/deploy.js

*/
