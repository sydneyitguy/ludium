const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('MintableToken', function () {
  async function deployMintableTokenFixture() {
    const MintableToken = await ethers.getContractFactory('MintableToken');
    const token = await MintableToken.deploy('Test Token', 'TEST');

    return token;
  }

  let token;
  let owner, alice;

  beforeEach(async function () {
    token = await loadFixture(deployMintableTokenFixture);
    [owner, alice] = await ethers.getSigners();
  });

  describe('Deployment', function () {
    it('should set the right owner', async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it('should have 0 total supply initially', async function () {
      expect(await token.totalSupply()).to.equal(0);
    });
  });

  describe('Mintable', function() {
    it('should mint to the receiver', async function() {
      await token.mint(alice.address, 100);
      expect(await token.balanceOf(alice.address)).to.equal(100);
    });

    it('should revert minting if not owner', async function() {
      await expect(token.connect(alice).mint(alice.address, 123)).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
