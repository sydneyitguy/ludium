const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('MungToken', function () {
  async function deployMungTokenFixture() {
    const MungToken = await ethers.getContractFactory('MungToken');
    const mungToken = await MungToken.deploy();

    return mungToken;
  }

  let mungToken;
  let owner, alice;

  beforeEach(async function () {
    mungToken = await loadFixture(deployMungTokenFixture);
    [owner, alice] = await ethers.getSigners();
  });

  describe('Deployment', function () {
    it('should set the right owner', async function () {
      expect(await mungToken.owner()).to.equal(owner.address);
    });

    it('should have 0 total supply initially', async function () {
      expect(await mungToken.totalSupply()).to.equal(0);
    });
  });
});
