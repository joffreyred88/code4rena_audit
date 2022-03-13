import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BribeVault, RewardDistributor, BTRFLYMock } from '../typechain-types';

describe('BribeVault', () => {
  let admin: SignerWithAddress;
  let notAdmin: SignerWithAddress;
  let simp: SignerWithAddress;
  let bribeVault: BribeVault;
  let rewardDistributor: RewardDistributor;
  let btrfly: BTRFLYMock;
  let adminRole: string;
  let depositorRole: string;
  const bribeVaultFee = BigNumber.from(5000);
  const bribeVaultFeeRecipient = '0x086C98855dF3C78C6b481b6e1D47BeF42E9aC36B'; // Redacted Treasury
  const initialBtrflyBalanceForAdmin = BigNumber.from(`${10e18}`);
  const bribeIdentifier1 = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('REDACTED_TEST_BRIBE_1')
  );
  const bribeIdentifier2 = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('REDACTED_TEST_BRIBE_2')
  );
  const rewardIdentifier1 = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('REWARD_IDENTIFIER_1')
  );
  const rewardIdentifier2 = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('REWARD_IDENTIFIER_2')
  );
  const arbitraryProof = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('ARBITRARY_PROOF')
  );
  const arbitraryMerkleTree = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('ARBITRARY_MERKLE_TREE')
  );
  const defaultBribeAmount = ethers.BigNumber.from(`${1e18}`);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  before(async () => {
    [admin, notAdmin, simp] = await ethers.getSigners();

    bribeVault = await (
      await ethers.getContractFactory('BribeVault')
    ).deploy(bribeVaultFee, bribeVaultFeeRecipient, admin.address);

    rewardDistributor = await (
      await ethers.getContractFactory('RewardDistributor')
    ).deploy(bribeVault.address);

    btrfly = await (await ethers.getContractFactory('BTRFLYMock')).deploy();
    adminRole = await bribeVault.DEFAULT_ADMIN_ROLE();
    depositorRole = await bribeVault.DEPOSITOR_ROLE();

    await btrfly.mint(admin.address, initialBtrflyBalanceForAdmin);
    await bribeVault.grantDepositorRole(admin.address);
  });

  describe('constructor', () => {
    it('Should set the contract variables', async () => {
      const fee = await bribeVault.fee();
      const feeRecipient = await bribeVault.feeRecipient();
      const distributor = await bribeVault.distributor();
      const adminHasRole = await bribeVault.hasRole(adminRole, admin.address);

      expect(fee.eq(bribeVaultFee)).to.equal(true);
      expect(feeRecipient).to.equal(bribeVaultFeeRecipient);
      expect(distributor).to.equal(admin.address);
      expect(adminHasRole).to.equal(true);
    });
  });

  describe('grantDepositorRole', () => {
    it('Should grant the depositor role to an address', async () => {
      const beforeGrantingRole = await bribeVault.hasRole(
        depositorRole,
        simp.address
      );
      const { events }: any = await (
        await bribeVault.grantDepositorRole(simp.address)
      ).wait();
      const grantDepositorRoleEvent = events[events.length - 1];
      const afterGrantingRole = await bribeVault.hasRole(
        depositorRole,
        simp.address
      );

      expect(beforeGrantingRole).to.equal(false);
      expect(afterGrantingRole).to.equal(true);
      expect(grantDepositorRoleEvent.eventSignature).to.equal(
        'GrantDepositorRole(address)'
      );
      expect(grantDepositorRoleEvent.args.depositor).to.equal(simp.address);
    });

    it('Should revert if called by non-admin', async () => {
      await expect(
        bribeVault.connect(notAdmin).grantDepositorRole(simp.address)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('revokeDepositorRole', () => {
    it('Should revoke the depositor role from an address', async () => {
      const beforeRevokingRole = await bribeVault.hasRole(
        depositorRole,
        simp.address
      );
      const { events }: any = await (
        await bribeVault.revokeDepositorRole(simp.address)
      ).wait();
      const revokeDepositorRoleEvent = events[events.length - 1];
      const afterRevokingRole = await bribeVault.hasRole(
        depositorRole,
        simp.address
      );

      expect(beforeRevokingRole).to.equal(true);
      expect(afterRevokingRole).to.equal(false);
      expect(revokeDepositorRoleEvent.eventSignature).to.equal(
        'RevokeDepositorRole(address)'
      );
      expect(revokeDepositorRoleEvent.args.depositor).to.equal(simp.address);
    });

    it('Should revert if address is not a depositor', async () => {
      const hasRole = await bribeVault.hasRole(depositorRole, simp.address);

      expect(hasRole).to.equal(false);
      await expect(
        bribeVault.revokeDepositorRole(simp.address)
      ).to.be.revertedWith('Invalid depositor');
    });

    it('Should revert if called by non-admin', async () => {
      await expect(
        bribeVault.connect(notAdmin).revokeDepositorRole(simp.address)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('setFee', () => {
    it('Should set the fee', async () => {
      const feeBefore = await bribeVault.fee();
      const desiredFee = BigNumber.from(2500);

      await bribeVault.setFee(desiredFee);

      const feeAfter = await bribeVault.fee();

      expect(feeBefore.eq(feeAfter)).to.equal(false);
      expect(feeAfter.eq(desiredFee)).to.equal(true);
    });

    it('Should emit an event', async () => {
      const [setFeeEvent]: any = (
        await (await bribeVault.setFee(bribeVaultFee)).wait()
      ).events;

      expect(setFeeEvent.eventSignature).to.equal('SetFee(uint256)');
      expect(setFeeEvent.args._fee).to.equal(bribeVaultFee);
    });

    it('Should revert if not owner', async () => {
      await expect(
        bribeVault.connect(notAdmin).setFee(bribeVaultFee)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });

    it('Should revert if fee is greater than feeDivisor', async () => {
      const greaterThanFeeDivisor = (await bribeVault.feeDivisor()).add(1);

      await expect(bribeVault.setFee(greaterThanFeeDivisor)).to.be.revertedWith(
        'Invalid _fee'
      );
    });
  });

  describe('setFeeRecipient', () => {
    it('Should set the fee recipient', async () => {
      const feeRecipientBefore = await bribeVault.feeRecipient();
      const desiredFeeRecipient = admin.address;

      await bribeVault.setFeeRecipient(desiredFeeRecipient);

      const feeRecipientAfter = await bribeVault.feeRecipient();

      expect(feeRecipientBefore).to.not.equal(feeRecipientAfter);
      expect(feeRecipientAfter).to.equal(desiredFeeRecipient);
    });

    it('Should emit an event', async () => {
      const [setFeeRecipientEvent]: any = (
        await (await bribeVault.setFeeRecipient(bribeVaultFeeRecipient)).wait()
      ).events;

      expect(setFeeRecipientEvent.eventSignature).to.equal(
        'SetFeeRecipient(address)'
      );
      expect(setFeeRecipientEvent.args._feeRecipient).to.equal(
        bribeVaultFeeRecipient
      );
    });

    it('Should revert if not owner', async () => {
      await expect(
        bribeVault.connect(notAdmin).setFeeRecipient(bribeVaultFeeRecipient)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('setDistributor', () => {
    it('Should set the distributor', async () => {
      const distributorBefore = await bribeVault.distributor();
      const desiredDistributor = rewardDistributor.address;

      await bribeVault.setDistributor(rewardDistributor.address);

      const distributorAfter = await bribeVault.distributor();

      expect(distributorBefore).to.not.equal(distributorAfter);
      expect(distributorAfter).to.equal(desiredDistributor);
    });

    it('Should emit an event', async () => {
      const [setDistributorEvent]: any = (
        await (
          await bribeVault.setDistributor(rewardDistributor.address)
        ).wait()
      ).events;

      expect(setDistributorEvent.eventSignature).to.equal(
        'SetDistributor(address)'
      );
      expect(setDistributorEvent.args._distributor).to.equal(
        rewardDistributor.address
      );
    });

    it('Should revert if not owner', async () => {
      await expect(
        bribeVault.connect(notAdmin).setDistributor(rewardDistributor.address)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('depositBribeERC20', () => {
    it('Should deposit 1 BTRFLY as bribe', async () => {
      const bribeBeforeDeposit = await bribeVault.bribes(bribeIdentifier1);

      await btrfly.approve(bribeVault.address, defaultBribeAmount);

      const { events }: any = await (
        await bribeVault.depositBribeERC20(
          bribeIdentifier1,
          rewardIdentifier1,
          btrfly.address,
          defaultBribeAmount,
          admin.address
        )
      ).wait();
      const depositBribeEvent = events[events.length - 1];
      const rewardToBribe = await bribeVault.rewardToBribes(
        rewardIdentifier1,
        0
      );

      expect(rewardToBribe).to.equal(bribeIdentifier1);
      expect(depositBribeEvent.eventSignature).to.equal(
        'DepositBribe(bytes32,bytes32,address,uint256,uint256,address)'
      );
      expect(depositBribeEvent.args.bribeIdentifier).to.equal(bribeIdentifier1);
      expect(depositBribeEvent.args.rewardIdentifier).to.equal(
        rewardIdentifier1
      );
      expect(depositBribeEvent.args.token).to.equal(btrfly.address);
      expect(depositBribeEvent.args.amount).to.equal(defaultBribeAmount);
      expect(depositBribeEvent.args.totalAmount).to.equal(
        defaultBribeAmount.add(bribeBeforeDeposit.amount)
      );
      expect(depositBribeEvent.args.briber).to.equal(admin.address);
    });

    it('Should deposit 1 BTRFLY to an existing bribe', async () => {
      const bribeBeforeDeposit = await bribeVault.bribes(bribeIdentifier1);

      await btrfly.approve(bribeVault.address, defaultBribeAmount);

      const { events }: any = await (
        await bribeVault.depositBribeERC20(
          bribeIdentifier1,
          rewardIdentifier1,
          btrfly.address,
          defaultBribeAmount,
          admin.address
        )
      ).wait();
      const depositBribeEvent = events[events.length - 1];

      expect(depositBribeEvent.eventSignature).to.equal(
        'DepositBribe(bytes32,bytes32,address,uint256,uint256,address)'
      );
      expect(depositBribeEvent.args.bribeIdentifier).to.equal(bribeIdentifier1);
      expect(depositBribeEvent.args.rewardIdentifier).to.equal(
        rewardIdentifier1
      );
      expect(depositBribeEvent.args.token).to.equal(btrfly.address);
      expect(depositBribeEvent.args.amount).to.equal(defaultBribeAmount);
      expect(
        depositBribeEvent.args.amount.lt(depositBribeEvent.args.totalAmount)
      ).to.equal(true);
      expect(depositBribeEvent.args.totalAmount).to.equal(
        defaultBribeAmount.add(bribeBeforeDeposit.amount)
      );
      expect(depositBribeEvent.args.briber).to.equal(admin.address);
    });

    it('Should revert if token is invalid', async () => {
      const invalidToken = zeroAddress;

      await expect(
        bribeVault.depositBribeERC20(
          bribeIdentifier1,
          rewardIdentifier1,
          invalidToken,
          defaultBribeAmount,
          admin.address
        )
      ).to.be.revertedWith('Invalid token');
    });

    it('Should revert if bribe amount is 0', async () => {
      const invalidBribeAmount = 0;

      await expect(
        bribeVault.depositBribeERC20(
          bribeIdentifier1,
          rewardIdentifier1,
          btrfly.address,
          invalidBribeAmount,
          admin.address
        )
      ).to.be.revertedWith('Amount must be greater than 0');
    });

    it('Should revert if token changed', async () => {
      const changedToken = admin.address;

      await expect(
        bribeVault.depositBribeERC20(
          bribeIdentifier1,
          rewardIdentifier1,
          changedToken,
          defaultBribeAmount,
          admin.address
        )
      ).to.be.revertedWith('Cannot change token');
    });
  });

  describe('depositBribe', () => {
    it('Should deposit 1 ETH as bribe', async () => {
      const bribeBeforeDeposit = await bribeVault.bribes(bribeIdentifier2);
      const ethBalanceBefore = await ethers.provider.getBalance(
        bribeVault.address
      );
      const { events }: any = await (
        await bribeVault.depositBribe(
          bribeIdentifier2,
          rewardIdentifier2,
          admin.address,
          {
            value: defaultBribeAmount,
          }
        )
      ).wait();
      const depositBribeEvent = events[events.length - 1];
      const ethBalanceAfter = await ethers.provider.getBalance(
        bribeVault.address
      );
      const rewardToBribe = await bribeVault.rewardToBribes(
        rewardIdentifier2,
        0
      );

      expect(
        ethBalanceBefore.add(defaultBribeAmount).eq(ethBalanceAfter)
      ).to.equal(true);
      expect(rewardToBribe).to.equal(bribeIdentifier2);
      expect(depositBribeEvent.eventSignature).to.equal(
        'DepositBribe(bytes32,bytes32,address,uint256,uint256,address)'
      );
      expect(depositBribeEvent.args.bribeIdentifier).to.equal(bribeIdentifier2);
      expect(depositBribeEvent.args.rewardIdentifier).to.equal(
        rewardIdentifier2
      );
      expect(depositBribeEvent.args.token).to.equal(bribeVault.address);
      expect(depositBribeEvent.args.amount).to.equal(defaultBribeAmount);
      expect(depositBribeEvent.args.totalAmount).to.equal(
        defaultBribeAmount.add(bribeBeforeDeposit.amount)
      );
      expect(depositBribeEvent.args.briber).to.equal(admin.address);
    });

    it('Should add 1 ETH to existing bribe', async () => {
      const bribeBefore = await bribeVault.bribes(bribeIdentifier2);
      const { events }: any = await (
        await bribeVault.depositBribe(
          bribeIdentifier2,
          rewardIdentifier2,
          admin.address,
          {
            value: defaultBribeAmount,
          }
        )
      ).wait();
      const depositBribeEvent = events[events.length - 1];

      expect(depositBribeEvent.eventSignature).to.equal(
        'DepositBribe(bytes32,bytes32,address,uint256,uint256,address)'
      );
      expect(depositBribeEvent.args.bribeIdentifier).to.equal(bribeIdentifier2);
      expect(depositBribeEvent.args.rewardIdentifier).to.equal(
        rewardIdentifier2
      );
      expect(depositBribeEvent.args.token).to.equal(bribeVault.address);
      expect(depositBribeEvent.args.amount).to.equal(defaultBribeAmount);
      expect(depositBribeEvent.args.totalAmount).to.equal(
        defaultBribeAmount.add(bribeBefore.amount)
      );
      expect(depositBribeEvent.args.briber).to.equal(admin.address);
    });

    it('Should revert if bribe amount is 0', async () => {
      const invalidValue = 0;

      await expect(
        bribeVault.depositBribe(
          bribeIdentifier2,
          rewardIdentifier2,
          admin.address,
          {
            value: invalidValue,
          }
        )
      ).to.be.revertedWith('Value must be greater than 0');
    });

    it('Should revert if token changed (depositing bribe for ERC20 after ETH)', async () => {
      await expect(
        bribeVault.depositBribeERC20(
          bribeIdentifier2,
          rewardIdentifier1,
          btrfly.address,
          defaultBribeAmount,
          admin.address
        )
      ).to.be.revertedWith('Cannot change token');
    });
  });

  describe('transferBribe (ERC20)', () => {
    it('Should transfer the fee and bribe amounts', async () => {
      const desiredFee = 5000;

      // Re-set contract variables (previous tests changed them)
      await bribeVault.setFee(desiredFee);
      await bribeVault.setFeeRecipient(bribeVaultFeeRecipient);
      await bribeVault.setDistributor(rewardDistributor.address);

      const feeRecipientBalanceBefore = await btrfly.balanceOf(
        bribeVaultFeeRecipient
      );
      const distributorBalanceBefore = await btrfly.balanceOf(
        rewardDistributor.address
      );
      const bribe = await bribeVault.bribes(bribeIdentifier1);
      const expectedBribeFee = bribe.amount.mul(desiredFee).div(1000000);
      const expectedDistributorAmount = bribe.amount.sub(expectedBribeFee);

      const { events }: any = await (
        await bribeVault.transferBribes(
          [
            {
              rewardIdentifier: rewardIdentifier1,
              token: btrfly.address,
              merkleRoot: arbitraryMerkleTree,
              proof: arbitraryProof,
            },
          ],
          [expectedDistributorAmount],
          [expectedBribeFee]
        )
      ).wait();
      const transferBribeEvent = events[events.length - 2];

      const feeRecipientBalanceAfter = await btrfly.balanceOf(
        bribeVaultFeeRecipient
      );
      const distributorBalanceAfter = await btrfly.balanceOf(
        rewardDistributor.address
      );

      expect(feeRecipientBalanceBefore.eq(feeRecipientBalanceAfter)).to.equal(
        false
      );
      expect(distributorBalanceBefore.eq(distributorBalanceAfter)).to.equal(
        false
      );
      expect(feeRecipientBalanceAfter.eq(expectedBribeFee)).to.equal(true);
      expect(distributorBalanceAfter.eq(expectedDistributorAmount)).to.equal(
        true
      );
      expect(transferBribeEvent.eventSignature).to.equal(
        'TransferBribe(bytes32,address,bytes32,uint256,uint256)'
      );
      expect(transferBribeEvent.args.rewardIdentifier).to.equal(
        rewardIdentifier1
      );
      expect(transferBribeEvent.args.token).to.equal(btrfly.address);
      expect(transferBribeEvent.args.proof).to.equal(arbitraryProof);
      expect(transferBribeEvent.args.feeAmount).to.equal(expectedBribeFee);
      expect(transferBribeEvent.args.distributorAmount).to.equal(
        expectedDistributorAmount
      );
    });

    it('Should revert if invalid reward identifier is specified', async () => {
      await expect(
        bribeVault.transferBribes(
          [
            {
              rewardIdentifier: ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes('INVALID_IDENTIFIER')
              ),
              token: btrfly.address,
              merkleRoot: arbitraryMerkleTree,
              proof: arbitraryProof,
            },
          ],
          [BigNumber.from(1)],
          [BigNumber.from(1)]
        )
      ).to.be.revertedWith(`Invalid reward identifier`);
    });

    it('Should revert if not owner', async () => {
      await expect(
        bribeVault.connect(notAdmin).transferBribes(
          [
            {
              rewardIdentifier: rewardIdentifier1,
              token: btrfly.address,
              merkleRoot: arbitraryMerkleTree,
              proof: arbitraryProof,
            },
          ],
          [BigNumber.from(1)],
          [BigNumber.from(1)]
        )
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('transferBribe', () => {
    it('Should transfer the fee and bribe amounts', async () => {
      // TEMPORARY: Redacted Treasury cannot receive ETH due to no payable method
      const temporaryBribeVaultFeeRecipient = simp.address;
      await bribeVault.setFeeRecipient(temporaryBribeVaultFeeRecipient);

      const feeRecipientBalanceBefore = await ethers.provider.getBalance(
        temporaryBribeVaultFeeRecipient
      );
      const distributorBalanceBefore = await ethers.provider.getBalance(
        rewardDistributor.address
      );
      const bribe = await bribeVault.bribes(bribeIdentifier2);
      const expectedBribeFee = bribe.amount
        .mul(await bribeVault.fee())
        .div(1000000);
      const expectedDistributorAmount = bribe.amount.sub(expectedBribeFee);

      const { events }: any = await (
        await bribeVault.transferBribes(
          [
            {
              rewardIdentifier: rewardIdentifier2,
              token: bribeVault.address,
              merkleRoot: arbitraryMerkleTree,
              proof: arbitraryProof,
            },
          ],
          [expectedDistributorAmount],
          [expectedBribeFee]
        )
      ).wait();
      const transferBribeEvent = events[events.length - 2];

      const feeRecipientBalanceAfter = await ethers.provider.getBalance(
        temporaryBribeVaultFeeRecipient
      );
      const distributorBalanceAfter = await ethers.provider.getBalance(
        rewardDistributor.address
      );

      expect(feeRecipientBalanceBefore.eq(feeRecipientBalanceAfter)).to.equal(
        false
      );
      expect(distributorBalanceBefore.eq(distributorBalanceAfter)).to.equal(
        false
      );
      expect(
        feeRecipientBalanceAfter.eq(
          feeRecipientBalanceBefore.add(expectedBribeFee)
        )
      ).to.equal(true);
      expect(
        distributorBalanceAfter.eq(
          distributorBalanceBefore.add(expectedDistributorAmount)
        )
      ).to.equal(true);
      expect(transferBribeEvent.eventSignature).to.equal(
        'TransferBribe(bytes32,address,bytes32,uint256,uint256)'
      );
      expect(transferBribeEvent.args.rewardIdentifier).to.equal(
        rewardIdentifier2
      );
      expect(transferBribeEvent.args.token).to.equal(bribeVault.address);
      expect(transferBribeEvent.args.proof).to.equal(arbitraryProof);
      expect(transferBribeEvent.args.feeAmount).to.equal(expectedBribeFee);
      expect(transferBribeEvent.args.distributorAmount).to.equal(
        expectedDistributorAmount
      );
    });
  });

  describe('getBribe', () => {
    it('Should get bribe details', async () => {
      const expectedAmount = BigNumber.from(`${2e18}`);
      const bribe = await bribeVault.getBribe(bribeIdentifier1);

      expect(bribe.token).to.equal(btrfly.address);
      expect(bribe.amount).to.equal(expectedAmount);
    });
  });

  describe('emergencyWithdrawERC20', () => {
    it('Should allow the admin to withdraw ERC20 tokens in an emergency', async () => {
      const withdrawAmount = defaultBribeAmount;

      await btrfly.mint(bribeVault.address, withdrawAmount);

      const btrflyBalanceBeforeWithdraw = await btrfly.balanceOf(
        bribeVault.address
      );
      const adminBtrflyBalanceBeforeWithdraw = await btrfly.balanceOf(
        admin.address
      );
      const { events }: any = await (
        await bribeVault.emergencyWithdrawERC20(btrfly.address, withdrawAmount)
      ).wait();
      const emergencyWithdrawEvent = events[events.length - 1];
      const btrflyBalanceAfterWithdraw = await btrfly.balanceOf(
        bribeVault.address
      );
      const adminBtrflyBalanceAfterWithdraw = await btrfly.balanceOf(
        admin.address
      );

      expect(emergencyWithdrawEvent.eventSignature).to.equal(
        'EmergencyWithdrawal(address,uint256,address)'
      );
      expect(emergencyWithdrawEvent.args.token).to.equal(btrfly.address);
      expect(emergencyWithdrawEvent.args.amount).to.equal(withdrawAmount);
      expect(btrflyBalanceAfterWithdraw).to.equal(
        btrflyBalanceBeforeWithdraw.sub(withdrawAmount)
      );
      expect(adminBtrflyBalanceAfterWithdraw).to.equal(
        adminBtrflyBalanceBeforeWithdraw.add(withdrawAmount)
      );
    });

    it('Should revert if not admin', async () => {
      // Set up for successful test
      const withdrawAmount = defaultBribeAmount;

      await btrfly.mint(bribeVault.address, withdrawAmount);
      await expect(
        bribeVault
          .connect(notAdmin)
          .emergencyWithdrawERC20(btrfly.address, withdrawAmount)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });

    it('Should revert if invalid token', async () => {
      // Set up for successful test
      const withdrawAmount = defaultBribeAmount;

      await expect(
        bribeVault.emergencyWithdrawERC20(zeroAddress, withdrawAmount)
      ).to.be.revertedWith('Invalid token');
    });

    it('Should revert if amount is 0', async () => {
      // Set up for successful test
      const invalidWithdrawalAmount = 0;

      await expect(
        bribeVault.emergencyWithdrawERC20(
          btrfly.address,
          invalidWithdrawalAmount
        )
      ).to.be.revertedWith('Invalid amount');
    });

    it('Should revert if amount is greater than balance', async () => {
      // Set up for successful test
      const invalidWithdrawalAmount = (
        await btrfly.balanceOf(bribeVault.address)
      ).add(1);

      await expect(
        bribeVault.emergencyWithdrawERC20(
          btrfly.address,
          invalidWithdrawalAmount
        )
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });
  });

  describe('emergencyWithdraw', () => {
    it('Should allow the admin to withdraw native tokens in an emergency', async () => {
      const withdrawAmount = defaultBribeAmount;

      // Send ETH via deposit since no fallback/receive method
      await bribeVault.depositBribe(
        bribeIdentifier2,
        rewardIdentifier2,
        admin.address,
        {
          value: defaultBribeAmount,
        }
      );

      const bribeVaultEthBeforeWithdrawal = await ethers.provider.getBalance(
        bribeVault.address
      );
      const adminEthBeforeWithdrawal = await ethers.provider.getBalance(
        admin.address
      );
      const { events, gasUsed, effectiveGasPrice }: any = await (
        await bribeVault.emergencyWithdraw(withdrawAmount)
      ).wait();
      const emergencyWithdrawEvent = events[events.length - 1];
      const bribeVaultEthAfterWithdrawal = await ethers.provider.getBalance(
        bribeVault.address
      );
      const adminEthAfterWithdrawal = await ethers.provider.getBalance(
        admin.address
      );

      // Need to factor in gas expense when comparing before/after
      const gasExpense = gasUsed.mul(effectiveGasPrice);

      expect(emergencyWithdrawEvent.eventSignature).to.equal(
        'EmergencyWithdrawal(address,uint256,address)'
      );
      expect(emergencyWithdrawEvent.args.token).to.equal(bribeVault.address);
      expect(emergencyWithdrawEvent.args.amount).to.equal(withdrawAmount);
      expect(bribeVaultEthAfterWithdrawal).to.equal(
        bribeVaultEthBeforeWithdrawal.sub(withdrawAmount)
      );
      expect(adminEthAfterWithdrawal.add(gasExpense)).to.equal(
        adminEthBeforeWithdrawal.add(withdrawAmount)
      );
    });

    it('Should revert if not admin', async () => {
      // Set up for successful test
      const withdrawAmount = defaultBribeAmount;

      await bribeVault.depositBribe(
        bribeIdentifier2,
        rewardIdentifier2,
        admin.address,
        {
          value: defaultBribeAmount,
        }
      );

      await expect(
        bribeVault.connect(notAdmin).emergencyWithdraw(withdrawAmount)
      ).to.be.revertedWith(
        `AccessControl: account ${notAdmin.address.toLowerCase()} is missing role ${adminRole}`
      );
    });

    it('Should revert if amount is 0', async () => {
      // Set up for successful test
      const invalidWithdrawalAmount = 0;

      await expect(
        bribeVault.emergencyWithdraw(invalidWithdrawalAmount)
      ).to.be.revertedWith('Invalid amount');
    });

    it('Should revert if amount is greater than balance', async () => {
      // Set up for successful test
      const invalidWithdrawalAmount = (
        await ethers.provider.getBalance(bribeVault.address)
      ).add(1);

      await expect(
        bribeVault.emergencyWithdraw(invalidWithdrawalAmount)
      ).to.be.revertedWith('Failed to withdraw');
    });
  });
});
