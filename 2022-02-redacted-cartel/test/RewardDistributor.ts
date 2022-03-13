import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  BribeVault,
  RewardDistributor,
  BTRFLYMock,
  TokemakBribe,
} from '../typechain-types';
import { getBribeIdentifier, getRewardIdentifier } from '../lib/utils';
import { BalanceTree } from '../lib/merkle';

describe('RewardDistributor', () => {
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let rewardDistributor: RewardDistributor;
  let token1: BTRFLYMock;
  let token2: BTRFLYMock;
  let bribeVault: BribeVault;
  let tokemakBribe: TokemakBribe;
  let tree1: BalanceTree;
  let tree2: BalanceTree;
  let tree3: BalanceTree;
  let bribeIdentifier1: string;
  let bribeIdentifier2: string;
  let bribeIdentifier3: string;
  let rewardIdentifier1: string;
  let rewardIdentifier2: string;
  let rewardIdentifier3: string;
  const rewardAmount1 = BigNumber.from(5000);
  const rewardAmount2 = BigNumber.from(5000);
  const rewardAmount3 = BigNumber.from(5000);
  let proposal: SignerWithAddress;
  let bribeVaultFeeRecipient: SignerWithAddress;
  const protocol = 'TOKEMAK';
  const round = BigNumber.from(1);
  const bribeAmount = BigNumber.from(10000);
  const bribeVaultFee = BigNumber.from(5000);
  const arbitraryProof = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('ARBITRARY_PROOF')
  );

  before(async () => {
    [admin, user1, user2, proposal, bribeVaultFeeRecipient] =
      await ethers.getSigners();

    bribeVault = await (
      await ethers.getContractFactory('BribeVault')
    ).deploy(bribeVaultFee, bribeVaultFeeRecipient.address, admin.address);

    tokemakBribe = await (
      await ethers.getContractFactory('TokemakBribe')
    ).deploy(bribeVault.address);

    rewardDistributor = await (
      await ethers.getContractFactory('RewardDistributor')
    ).deploy(bribeVault.address);

    await bribeVault.setDistributor(rewardDistributor.address);
    await bribeVault.grantDepositorRole(admin.address);

    token1 = await (await ethers.getContractFactory('BTRFLYMock')).deploy();
    token2 = await (await ethers.getContractFactory('BTRFLYMock')).deploy();

    bribeIdentifier1 = getBribeIdentifier(
      protocol,
      proposal.address,
      round,
      token1.address
    );
    rewardIdentifier1 = getRewardIdentifier(protocol, round, token1.address);
    tree1 = new BalanceTree([
      { account: user1.address, amount: BigNumber.from(1000) },
      { account: user2.address, amount: BigNumber.from(2000) },
    ]);

    bribeIdentifier2 = getBribeIdentifier(
      protocol,
      proposal.address,
      round,
      token2.address
    );
    rewardIdentifier2 = getRewardIdentifier(protocol, round, token2.address);
    tree2 = new BalanceTree([
      { account: user1.address, amount: BigNumber.from(100) },
      { account: user2.address, amount: BigNumber.from(200) },
    ]);

    // Third token is using native token
    bribeIdentifier3 = getBribeIdentifier(
      protocol,
      proposal.address,
      round,
      bribeVault.address
    );
    rewardIdentifier3 = getRewardIdentifier(
      protocol,
      round,
      bribeVault.address
    );
    tree3 = new BalanceTree([
      { account: user2.address, amount: BigNumber.from(500) },
    ]);

    // Mint and deposit bribes for testing purposes
    await token1.mint(admin.address, BigNumber.from(1000000));
    await token2.mint(admin.address, BigNumber.from(1000000));

    await token1.approve(bribeVault.address, bribeAmount);
    await token2.approve(bribeVault.address, bribeAmount);
    await bribeVault.depositBribeERC20(
      bribeIdentifier1,
      rewardIdentifier1,
      token1.address,
      bribeAmount,
      admin.address
    );
    await bribeVault.depositBribeERC20(
      bribeIdentifier2,
      rewardIdentifier2,
      token2.address,
      bribeAmount,
      admin.address
    );
    await bribeVault.depositBribe(
      bribeIdentifier3,
      rewardIdentifier3,
      admin.address,
      {
        value: bribeAmount,
      }
    );
  });

  describe('initial', () => {
    it('Should not have any merkle roots set initially', async () => {
      expect(
        (await rewardDistributor.rewards(rewardIdentifier1)).merkleRoot
      ).to.eq(ethers.constants.HashZero);
      expect(
        (await rewardDistributor.rewards(rewardIdentifier2)).merkleRoot
      ).to.eq(ethers.constants.HashZero);
    });

    it('Should not allow claiming when merkle root has not been set', async () => {
      await expect(
        rewardDistributor.connect(user1).claim([
          {
            identifier: rewardIdentifier1,
            account: user1.address,
            index: BigNumber.from(0),
            amount: BigNumber.from(1000),
            merkleProof: [],
          },
        ])
      ).to.revertedWith('Distribution not enabled');
    });
  });

  describe('updateRewardMetadata', () => {
    it('Should allow admin to set the merkle root for reward identifier via bribeVault', async () => {
      const fee = await bribeVault.fee();
      const fee1 = rewardAmount1.mul(fee).div(1000000);
      const amount1 = rewardAmount1.sub(fee1);
      const fee2 = rewardAmount2.mul(fee).div(1000000);
      const amount2 = rewardAmount2.sub(fee1);
      const fee3 = rewardAmount3.mul(fee).div(1000000);
      const amount3 = rewardAmount3.sub(fee1);

      // Transfer out bribes to trigger the reward metadata update
      await bribeVault.transferBribes(
        [
          {
            rewardIdentifier: rewardIdentifier1,
            token: token1.address,
            merkleRoot: tree1.getHexRoot(),
            proof: arbitraryProof,
          },
          {
            rewardIdentifier: rewardIdentifier2,
            token: token2.address,
            merkleRoot: tree2.getHexRoot(),
            proof: arbitraryProof,
          },
          {
            rewardIdentifier: rewardIdentifier3,
            token: bribeVault.address,
            merkleRoot: tree3.getHexRoot(),
            proof: arbitraryProof,
          },
        ],
        [amount1, amount2, amount3],
        [fee1, fee2, fee3]
      );

      expect(
        (await rewardDistributor.rewards(rewardIdentifier1)).merkleRoot
      ).to.eq(tree1.getHexRoot());

      expect(
        (await rewardDistributor.rewards(rewardIdentifier2)).merkleRoot
      ).to.eq(tree2.getHexRoot());

      expect(
        (await rewardDistributor.rewards(rewardIdentifier3)).merkleRoot
      ).to.eq(tree3.getHexRoot());
    });

    it('Should allow bribeVault to update existing reward metadata', async () => {
      const updateCount = (await rewardDistributor.rewards(rewardIdentifier1))
        .updateCount;

      await expect(
        bribeVault.updateRewardsMetadata([
          {
            rewardIdentifier: rewardIdentifier1,
            token: token1.address,
            merkleRoot: tree1.getHexRoot(),
            proof: arbitraryProof,
          },
        ])
      )
        .to.emit(rewardDistributor, 'RewardMetadataUpdated')
        .withArgs(
          rewardIdentifier1,
          token1.address,
          tree1.getHexRoot(),
          arbitraryProof,
          updateCount.add(1)
        );
    });

    it('Should revert if called by non-admin', async () => {
      await expect(
        bribeVault.connect(user1).updateRewardsMetadata([
          {
            rewardIdentifier: rewardIdentifier1,
            token: token1.address,
            merkleRoot: tree1.getHexRoot(),
            proof: arbitraryProof,
          },
        ])
      ).to.revertedWith(
        `AccessControl: account ${user1.address.toLowerCase()} is missing role 0x0000000000000000000000000000000000000000000000000000000000000000`
      );
    });

    it('Should only allow bribeVault to directly call updateRewardsMetadata', async () => {
      await expect(
        rewardDistributor.updateRewardsMetadata([
          {
            rewardIdentifier: rewardIdentifier1,
            token: token1.address,
            merkleRoot: tree1.getHexRoot(),
            proof: arbitraryProof,
          },
        ])
      ).to.revertedWith('Invalid access');
    });
  });

  describe('claim', () => {
    it('Should allow eligible users to claim rewards', async () => {
      const claimAmount = BigNumber.from(1000);
      const claimIndex = BigNumber.from(0);
      const updateCount = (await rewardDistributor.rewards(rewardIdentifier1))
        .updateCount;
      const proof = tree1.getProof(claimIndex, user1.address, claimAmount);

      const previousDistributorBalance = await token1.balanceOf(
        rewardDistributor.address
      );
      const previousUserBalance = await token1.balanceOf(user1.address);

      await expect(
        rewardDistributor.connect(user1).claim([
          {
            identifier: rewardIdentifier1,
            account: user1.address,
            index: claimIndex,
            amount: claimAmount,
            merkleProof: proof,
          },
        ])
      )
        .to.emit(rewardDistributor, 'RewardClaimed')
        .withArgs(
          rewardIdentifier1,
          token1.address,
          user1.address,
          updateCount,
          claimIndex,
          claimAmount
        );

      const currentDistributorBalance = await token1.balanceOf(
        rewardDistributor.address
      );
      const currentUserBalance = await token1.balanceOf(user1.address);

      expect(
        currentDistributorBalance.eq(
          previousDistributorBalance.sub(claimAmount)
        )
      ).to.equal(true);
      expect(
        currentUserBalance.eq(previousUserBalance.add(claimAmount))
      ).to.equal(true);

      expect(
        await rewardDistributor.isRewardClaimed(rewardIdentifier1, claimIndex)
      ).to.eq(true);
    });

    it('Should not allow eligible users to double claim', async () => {
      const claimAmount = BigNumber.from(1000);
      const claimIndex = BigNumber.from(0);

      await expect(
        rewardDistributor.connect(user1).claim([
          {
            identifier: rewardIdentifier1,
            account: user1.address,
            index: claimIndex,
            amount: claimAmount,
            merkleProof: tree1.getProof(claimIndex, user1.address, claimAmount),
          },
        ])
      ).to.revertedWith('Reward already claimed');
    });

    it('Should not allow eligible users to claim more than allocated amount', async () => {
      const claimAmount = BigNumber.from(2000);
      const claimIndex = BigNumber.from(1);

      await expect(
        rewardDistributor.connect(user2).claim([
          {
            identifier: rewardIdentifier1,
            account: user2.address,
            index: claimIndex,
            amount: BigNumber.from(5000),
            merkleProof: tree1.getProof(claimIndex, user2.address, claimAmount),
          },
        ])
      ).to.revertedWith('Invalid proof');
    });

    it('Should not allow eligible users to claim with invalid proof', async () => {
      const claimAmount = BigNumber.from(2000);
      const claimIndex = BigNumber.from(1);

      await expect(
        rewardDistributor.connect(user2).claim([
          {
            identifier: rewardIdentifier1,
            account: user2.address,
            index: claimIndex,
            amount: claimAmount,
            merkleProof: [],
          },
        ])
      ).to.revertedWith('Invalid proof');
    });

    it('Should allow eligible users to claim multiple rewards', async () => {
      const claimAmount1 = BigNumber.from(2000);
      const claimAmount2 = BigNumber.from(200);
      const claimAmount3 = BigNumber.from(500);
      const claimIndex1 = BigNumber.from(1);
      const claimIndex2 = BigNumber.from(1);
      const claimIndex3 = BigNumber.from(0);
      const updateCount = (await rewardDistributor.rewards(rewardIdentifier1))
        .updateCount;
      const proof1 = tree1.getProof(claimIndex1, user2.address, claimAmount1);
      const proof2 = tree2.getProof(claimIndex2, user2.address, claimAmount2);
      const proof3 = tree3.getProof(claimIndex3, user2.address, claimAmount3);

      const previousDistributorBalance1 = await token1.balanceOf(
        rewardDistributor.address
      );
      const previousDistributorBalance2 = await token2.balanceOf(
        rewardDistributor.address
      );
      const previousDistributorBalance3 = await ethers.provider.getBalance(
        rewardDistributor.address
      );
      const previousUserBalance1 = await token1.balanceOf(user2.address);
      const previousUserBalance2 = await token1.balanceOf(user2.address);
      const previousUserBalance3 = await ethers.provider.getBalance(
        user2.address
      );

      // Use user1 to claim so we don't incur gas fee to the actual redeemer for easier native balance check
      await expect(
        rewardDistributor.connect(user1).claim([
          {
            identifier: rewardIdentifier1,
            account: user2.address,
            index: claimIndex1,
            amount: claimAmount1,
            merkleProof: proof1,
          },
          {
            identifier: rewardIdentifier2,
            account: user2.address,
            index: claimIndex2,
            amount: claimAmount2,
            merkleProof: proof2,
          },
          {
            identifier: rewardIdentifier3,
            account: user2.address,
            index: claimIndex3,
            amount: claimAmount3,
            merkleProof: proof3,
          },
        ])
      )
        .to.emit(rewardDistributor, 'RewardClaimed')
        .withArgs(
          rewardIdentifier1,
          token1.address,
          user2.address,
          updateCount,
          claimIndex1,
          claimAmount1
        );

      const currentDistributorBalance1 = await token1.balanceOf(
        rewardDistributor.address
      );
      const currentDistributorBalance2 = await token2.balanceOf(
        rewardDistributor.address
      );
      const currentDistributorBalance3 = await ethers.provider.getBalance(
        rewardDistributor.address
      );
      const currentUserBalance1 = await token1.balanceOf(user2.address);
      const currentUserBalance2 = await token2.balanceOf(user2.address);
      const currentUserBalance3 = await ethers.provider.getBalance(
        user2.address
      );

      expect(
        currentDistributorBalance1.eq(
          previousDistributorBalance1.sub(claimAmount1)
        )
      ).to.equal(true);
      expect(
        currentDistributorBalance2.eq(
          previousDistributorBalance2.sub(claimAmount2)
        )
      ).to.equal(true);
      expect(
        currentDistributorBalance3.eq(
          previousDistributorBalance3.sub(claimAmount3)
        )
      ).to.equal(true);
      expect(
        currentUserBalance1.eq(previousUserBalance1.add(claimAmount1))
      ).to.equal(true);
      expect(
        currentUserBalance2.eq(previousUserBalance2.add(claimAmount2))
      ).to.equal(true);
      expect(
        currentUserBalance3.eq(previousUserBalance3.add(claimAmount3))
      ).to.equal(true);

      expect(
        await rewardDistributor.isRewardClaimed(rewardIdentifier1, claimIndex1)
      ).to.eq(true);
      expect(
        await rewardDistributor.isRewardClaimed(rewardIdentifier2, claimIndex2)
      ).to.eq(true);
      expect(
        await rewardDistributor.isRewardClaimed(rewardIdentifier3, claimIndex3)
      ).to.eq(true);
    });

    it('Should allow eligible users to forward their rewards', async () => {
      // Deposit bribe
      await token1.mint(admin.address, BigNumber.from(bribeAmount));
      await token1.approve(bribeVault.address, bribeAmount);
      await bribeVault.depositBribeERC20(
        bribeIdentifier1,
        rewardIdentifier1,
        token1.address,
        bribeAmount,
        admin.address
      );

      // User1 forwards rewards to user2
      await tokemakBribe.connect(user1).setRewardForwarding(user2.address);

      const user1RewardRecipient = await tokemakBribe.rewardForwarding(
        user1.address
      );
      const fee = await bribeVault.fee();
      const calculatedFees = rewardAmount1.mul(fee).div(bribeAmount);
      const calculatedRewardAmount = bribeAmount.sub(calculatedFees);
      const tree = new BalanceTree([
        { account: user1RewardRecipient, amount: calculatedRewardAmount },
      ]);
      const claimIndex = BigNumber.from(0);
      const proof = tree.getProof(
        claimIndex,
        user1RewardRecipient,
        calculatedRewardAmount
      );
      const user1RewardRecipientBalanceBefore = await token1.balanceOf(
        user1RewardRecipient
      );

      // Transfer out bribes to trigger the reward metadata update
      await bribeVault.transferBribes(
        [
          {
            rewardIdentifier: rewardIdentifier1,
            token: token1.address,
            merkleRoot: tree.getHexRoot(),
            proof: arbitraryProof,
          },
        ],
        [calculatedRewardAmount],
        [calculatedFees]
      );

      // Claim bribes as the account that user1 forwarded rewards to
      const { events }: any = await (
        await rewardDistributor.connect(user2).claim([
          {
            identifier: rewardIdentifier1,
            account: user1RewardRecipient,
            index: claimIndex,
            amount: calculatedRewardAmount,
            merkleProof: proof,
          },
        ])
      ).wait();
      const claimEvent = events[events.length - 1];
      const user1RewardRecipientBalanceAfter = await token1.balanceOf(
        user1RewardRecipient
      );

      expect(claimEvent.args.account).to.equal(user1RewardRecipient);
      expect(user1RewardRecipientBalanceAfter).to.equal(
        user1RewardRecipientBalanceBefore.add(calculatedRewardAmount)
      );
    });
  });
});
