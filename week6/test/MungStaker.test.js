const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('MungStaker', function () {
  async function deployMungTokenFixture() {
    const MungToken = await ethers.getContractFactory('MintableToken');
    const mungToken = await MungToken.deploy('MungToken', 'MUNG');

    const FarmToken = await ethers.getContractFactory('MintableToken');
    const farmToken = await MungToken.deploy('FarmToken', 'FARM');

    const MungStaker = await ethers.getContractFactory('MungStaker');
    const mungStaker = await MungStaker.deploy(mungToken.address, farmToken.address);

    // Transfer ownership of FARM Token to the staker contract so it can mint tokens
    await farmToken.transferOwnership(mungStaker.address);

    return [mungToken, farmToken, mungStaker];
  }

  let mungToken, farmToken, mungStaker;
  let owner, alice;

  beforeEach(async function () {
    [mungToken, farmToken, mungStaker] = await loadFixture(deployMungTokenFixture);
    [owner, alice] = await ethers.getSigners();
  });

  describe('Deployment', function () {
    it('should transferred the token owner to the airdrop contract', async function () {
      expect(await farmToken.owner()).to.equal(mungStaker.address);
    });

    it('should set the right Mung Token address', async function() {
      expect(await mungStaker.mungToken()).to.equal(mungToken.address);
    });

    it('should set the right Mung Token address', async function() {
      expect(await mungStaker.farmToken()).to.equal(farmToken.address);
    });

    it('should have 0 claimedCount', async function() {
      expect(await mungStaker.activeLockUpCount()).to.equal(0);
    })
  });

  describe('Lock-up', function() {
    describe('Normal flow', function() {
      beforeEach(async function() {
        await mungToken.mint(alice.address, 1000);
        await mungToken.connect(alice).approve(mungStaker.address, 1000);
      });

      it('should deduct the lock-up amount from alice', async function() {
        await mungStaker.connect(alice).lockUp(100);
        expect(await mungToken.balanceOf(alice.address)).to.equal(900);
      });

      it('should stored the lock-up correctly', async function() {
        await mungStaker.connect(alice).lockUp(1000);
        const [lockedAt, amount] = await mungStaker.userLockUp(alice.address);
        expect(lockedAt).to.equal(await time.latest());
        expect(amount).to.equal(1000);
      });

      // TODO: more test cases

      it('should emit lock-up event', async function () {
        await expect(mungStaker.connect(alice).lockUp(300))
          .emit(mungStaker, 'LockedUp')
          .withArgs(alice.address, 300);
      });
    });

    describe('Edge cases', function() {
      it('should revert if the mungToken is not approved', async function() {
        await mungToken.mint(alice.address, 1000);
        await expect(mungStaker.connect(alice).lockUp(100)).to.be.revertedWith('ERC20: insufficient allowance');
      });

      it('should revert if locked-up already exists', async function() {
        await mungToken.mint(alice.address, 1000);
        await mungToken.connect(alice).approve(mungStaker.address, 1000);
        await mungStaker.connect(alice).lockUp(100);
        await expect(mungStaker.connect(alice).lockUp(200)).to.be.revertedWithCustomError(
          mungStaker,
          'MungStaker__LockUpAlreadyExists'
        );
      });

      // TODO: more edge cases
    });
  });

  describe('Unlock', function() {
    describe('Normal flow', function() {
      beforeEach(async function() {
        await mungToken.mint(alice.address, 1000);
        await mungToken.connect(alice).approve(mungStaker.address, 1000);
        await mungStaker.connect(alice).lockUp(200);
        await time.increaseTo(await time.latest() + 600);
      });

      it('should return the lock-up amount to alice', async function() {
        await mungStaker.connect(alice).unlock();
        expect(await mungToken.balanceOf(alice.address)).to.equal(1000);
      });

      it('should remove the lock-up', async function() {
        expect(await mungStaker.lockUpExists(alice.address)).to.equal(true);
        await mungStaker.connect(alice).unlock();
        expect(await mungStaker.lockUpExists(alice.address)).to.equal(false);
      });

      // TODO: more test cases

      it('should emit unlocked event', async function () {
        await expect(mungStaker.connect(alice).unlock())
          .emit(mungStaker, 'Unlocked')
          .withArgs(alice.address, 200);
      });
    });

    describe('Edge cases', function() {
      it('should revert if the user does not have lock-up', async function() {
        await expect(mungStaker.connect(alice).unlock()).to.be.revertedWithCustomError(
          mungStaker,
          'MungStaker__LockUpDoesNotExists'
        );
      });

      it('should revert if the lock-up has not matured', async function() {
        await mungToken.mint(alice.address, 1000);
        await mungToken.connect(alice).approve(mungStaker.address, 1000);
        await mungStaker.connect(alice).lockUp(200);
        await time.increaseTo(await time.latest() + 500); // 500 sec later
        await expect(mungStaker.connect(alice).unlock()).to.be.revertedWithCustomError(
          mungStaker,
          'MungStaker__LockUpHasNotMatured'
        );
      });

      // TODO: more edge cases
    });
  });
});
