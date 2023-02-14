// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IMintableToken.sol";

/** @dev
 * This is a practice exercise for a simple staking contract.
 * Users can lock up MungToken for 10 minutes to receive FarmTokens.
 * When the lock-up is unlocked, 10% of the MungToken lock-up amount
 * will be minted as FarmTokens and sent to the staker.
 */

contract MungStaker {
  error MungStaker__InvalidAmount();
  error MungStaker__LockUpAlreadyExists();
  error MungStaker__LockUpDoesNotExists();
  error MungStaker__LockUpHasNotMatured();

  IMintableToken public mungToken; // Token to be staked
  IMintableToken public farmToken; // Token to be farmed

  uint256 public constant LOCK_UP_DURATION = 600; // 10 minutes
  uint256 public constant FARMING_RATIO = 1000; // 1,000bp = 10% of lockUp amount

  // Gas saving
  // REF: https://medium.com/@novablitz/774da988895e
  struct LockUp {
    uint40 lockedAt;
    uint216 amount;
  }
  // To make it simple, a wallet can only have one lockUp at the same time
  mapping (address => LockUp) public userLockUp;
  uint256 public activeLockUpCount;

  event LockedUp(address indexed user, uint216 amount);
  event Unlocked(address indexed user, uint216 amount);

  constructor(address mungToken_, address farmToken_) {
    mungToken = IMintableToken(mungToken_);
    farmToken = IMintableToken(farmToken_); // must have the ownership
  }

  function lockUp(uint216 amount) external {
    if (amount == 0) revert MungStaker__InvalidAmount();

    LockUp storage ul = userLockUp[msg.sender];
    if (ul.lockedAt > 0) revert MungStaker__LockUpAlreadyExists();

    mungToken.transferFrom(msg.sender, address(this), amount);

    ul.lockedAt = uint40(block.timestamp);
    ul.amount = amount;
    activeLockUpCount += 1;

    emit LockedUp(msg.sender, amount);
  }

  function unlock() external {
    LockUp storage ul = userLockUp[msg.sender];

    if (ul.lockedAt == 0) revert MungStaker__LockUpDoesNotExists();
    if (ul.lockedAt + LOCK_UP_DURATION >= block.timestamp) revert MungStaker__LockUpHasNotMatured();

    uint256 amountToSend = ul.amount;
    ul.lockedAt = 0;
    ul.amount = 0;
    activeLockUpCount -= 1;

    mungToken.transfer(msg.sender, amountToSend);
    // Distribute farming tokens to the staker, 10% of the MUNG token lock-up amount
    farmToken.mint(msg.sender, amountToSend * FARMING_RATIO / 10000);

    emit Unlocked(msg.sender, uint216(amountToSend));
  }

  function lockUpExists(address user) external view returns(bool) {
    return userLockUp[user].lockedAt > 0;
  }
}
