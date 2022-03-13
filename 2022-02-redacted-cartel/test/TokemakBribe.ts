import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber, Bytes } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BribeVault, BTRFLYMock, TokemakBribe } from '../typechain-types';
import { getBribeIdentifier, getRewardIdentifier } from '../lib/utils';

describe('TokemakBribe', () => {
  let admin: SignerWithAddress;
  let notAdmin: SignerWithAddress;
  let bribeVault: BribeVault;
  let tokemakBribe: TokemakBribe;
  let btrfly: BTRFLYMock;
  let simp: SignerWithAddress;
  let proposal: SignerWithAddress;
  let adminRole: string;
  let teamRole: string;
  let protocol: string;
  const bribeVaultFee = BigNumber.from(5000);
  const bribeVaultFeeRecipient = '0x086C98855dF3C78C6b481b6e1D47BeF42E9aC36B'; // Redacted Treasury
  const bribeVaultDistributor = '0x086C98855dF3C78C6b481b6e1D47BeF42E9aC36B'; //  TO DO: Use actual address
  const initialBtrflyBalanceForAdmin = BigNumber.from(`${10e18}`);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  before(async () => {
    [admin, notAdmin, simp, proposal] = await ethers.getSigners();

    bribeVault = await (
      await ethers.getContractFactory('BribeVault')
    ).deploy(bribeVaultFee, bribeVaultFeeRecipient, bribeVaultDistributor);

    tokemakBribe = await (
      await ethers.getContractFactory('TokemakBribe')
    ).deploy(bribeVault.address);

    btrfly = await (await ethers.getContractFactory('BTRFLYMock')).deploy();
    adminRole = await tokemakBribe.DEFAULT_ADMIN_ROLE();
    teamRole = await tokemakBribe.TEAM_ROLE();
    protocol = await tokemakBribe.protocol();

    await btrfly.mint(admin.address, initialBtrflyBalanceForAdmin);
    await bribeVault.grantDepositorRole(tokemakBribe.address);
  });

  describe('constructor', () => {
    it('Should set the contract variables', async () => {
      const bribeVaultAddress = await tokemakBribe.bribeVault();
      const adminHasRole = await tokemakBribe.hasRole(
        await tokemakBribe.DEFAULT_ADMIN_ROLE(),
        admin.address
      );

      expect(bribeVaultAddress).to.equal(bribeVault.address);
      expect(adminHasRole).to.equal(true);
    });
  });

  describe('grantTeamRole', () => {
    it('Should grant team role to an address', async () => {
      const hasRoleBeforeGrant = await tokemakBribe.hasRole(
        teamRole,
        simp.address
      );
      const { events }: any = await (
        await tokemakBribe.grantTeamRole(simp.address)
      ).wait();
      const grantTeamRoleEvent = events[events.length - 1];
      const hasRoleAfterGrant = await tokemakBribe.hasRole(
        teamRole,
        simp.address
      );

      expect(hasRoleBeforeGrant).to.equal(false);
      expect(hasRoleAfterGrant).to.equal(true);
      expect(grantTeamRoleEvent.eventSignature).to.equal(
        'GrantTeamRole(address)'
      );
      expect(grantTeamRoleEvent.args.teamMember).to.equal(simp.address);
    });

    it('Should revert if not admin', async () => {
      const caller = notAdmin;

      await expect(
        tokemakBribe.connect(notAdmin).grantTeamRole(simp.address)
      ).to.be.revertedWith(
        `AccessControl: account ${caller.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('revokeTeamRole', () => {
    it('Should revoke team role from an address', async () => {
      const hasRoleBeforeRevoke = await tokemakBribe.hasRole(
        teamRole,
        simp.address
      );
      const { events }: any = await (
        await tokemakBribe.revokeTeamRole(simp.address)
      ).wait();
      const revokeTeamRoleEvent = events[events.length - 1];
      const hasRoleAfterRevoke = await tokemakBribe.hasRole(
        teamRole,
        simp.address
      );

      expect(hasRoleBeforeRevoke).to.equal(true);
      expect(hasRoleAfterRevoke).to.equal(false);
      expect(revokeTeamRoleEvent.eventSignature).to.equal(
        'RevokeTeamRole(address)'
      );
      expect(revokeTeamRoleEvent.args.teamMember).to.equal(simp.address);
    });

    it('Should revert if the account is not a team member', async () => {
      await expect(
        tokemakBribe.revokeTeamRole(simp.address)
      ).to.be.revertedWith('Invalid teamMember');
    });

    it('Should revert if not admin', async () => {
      await tokemakBribe.grantTeamRole(simp.address);

      const caller = notAdmin;

      await expect(
        tokemakBribe.connect(caller).revokeTeamRole(simp.address)
      ).to.be.revertedWith(
        `AccessControl: account ${caller.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe('setRound', () => {
    it('Should set new round', async () => {
      const previousRound = await tokemakBribe.getRound();

      await tokemakBribe.setRound(BigNumber.from(1));

      const currentRound = await tokemakBribe.getRound();

      expect(previousRound.toNumber()).to.equal(0);
      expect(currentRound.toNumber()).to.equal(1);
    });

    it('Should set round if team', async () => {
      const hasTeamRole = await tokemakBribe.hasRole(teamRole, simp.address);
      const previousRound = await tokemakBribe.getRound();
      const newRound = previousRound.add(1);

      await tokemakBribe.connect(simp).setRound(newRound);

      const currentRound = await tokemakBribe.getRound();

      expect(hasTeamRole).to.equal(true);
      expect(currentRound.toNumber()).to.equal(newRound);
    });

    it('Should revert if not admin', async () => {
      await expect(tokemakBribe.connect(notAdmin).setRound(BigNumber.from(2)))
        .to.be.reverted;
    });

    it('Should revert if team role was removed', async () => {
      const hasTeamRoleBefore = await tokemakBribe.hasRole(
        teamRole,
        simp.address
      );

      await tokemakBribe.revokeTeamRole(simp.address);

      const hasTeamRoleAfter = await tokemakBribe.hasRole(
        teamRole,
        simp.address
      );
      const arbitraryRound = 1;

      expect(hasTeamRoleBefore).to.equal(true);
      expect(hasTeamRoleAfter).to.equal(false);
      await expect(
        tokemakBribe.connect(simp).setRound(arbitraryRound)
      ).to.be.revertedWith('Not authorized');
    });
  });

  describe('SetProposal', () => {
    it('Should set a proposal if admin', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      const round = await tokemakBribe.getRound();

      const { events }: any = await (
        await tokemakBribe.setProposal(proposal.address, deadline)
      ).wait();
      const setProposalEvent = events[events.length - 1];

      const contractProposal = await tokemakBribe.proposalDeadlines(
        proposal.address
      );

      expect(contractProposal).to.equal(deadline);
      expect(setProposalEvent.eventSignature).to.equal(
        'SetProposal(address,uint256,uint256)'
      );
      expect(setProposalEvent.args.proposal).to.equal(proposal.address);
      expect(setProposalEvent.args.deadline).to.equal(deadline);
      expect(setProposalEvent.args.round).to.equal(round);
    });

    it('Should set a proposal if team', async () => {
      await tokemakBribe.grantTeamRole(simp.address);

      const hasTeamRole = await tokemakBribe.hasRole(teamRole, simp.address);
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);

      await tokemakBribe.connect(simp).setProposal(proposal.address, deadline);

      const contractProposal = await tokemakBribe.proposalDeadlines(
        proposal.address
      );

      expect(hasTeamRole).to.equal(true);
      expect(contractProposal).to.equal(deadline);
    });

    it('Should revert if not admin or team', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);

      await expect(
        tokemakBribe.connect(notAdmin).setProposal(proposal.address, deadline)
      ).to.be.reverted;
    });

    it('Should revert if team member was removed', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      const teamRoleBefore = await tokemakBribe.hasRole(teamRole, simp.address);

      await tokemakBribe.revokeTeamRole(simp.address);

      const teamRoleAfter = await tokemakBribe.hasRole(teamRole, simp.address);

      expect(teamRoleBefore).to.equal(true);
      expect(teamRoleAfter).to.equal(false);
      await expect(
        tokemakBribe.connect(simp).setProposal(proposal.address, deadline)
      ).to.be.revertedWith('Not authorized');
    });
  });

  describe('SetProposals', () => {
    it('Should set proposals if admin', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      const round = await tokemakBribe.getRound();
      const { events }: any = await (
        await tokemakBribe.setProposals(
          [proposal.address, proposal.address],
          [deadline, deadline]
        )
      ).wait();
      const setProposalsEvent = events[events.length - 1];

      expect(setProposalsEvent.eventSignature).to.equal(
        'SetProposals(address[],uint256[],uint256)'
      );
      expect(setProposalsEvent.args.proposals.length).to.equal(2);
      expect(setProposalsEvent.args.proposals[0]).to.equal(proposal.address);
      expect(setProposalsEvent.args.proposals[1]).to.equal(proposal.address);
      expect(setProposalsEvent.args.deadlines.length).to.equal(2);
      expect(setProposalsEvent.args.deadlines[0]).to.equal(deadline);
      expect(setProposalsEvent.args.deadlines[1]).to.equal(deadline);
      expect(setProposalsEvent.args.round).to.equal(round);
    });

    it('Should set a proposals if team', async () => {
      await tokemakBribe.grantTeamRole(simp.address);

      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);

      await tokemakBribe
        .connect(simp)
        .setProposals(
          [proposal.address, proposal.address],
          [deadline, deadline]
        );
    });

    it('Should revert if not admin or team', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);

      await expect(
        tokemakBribe
          .connect(notAdmin)
          .setProposals(
            [proposal.address, proposal.address],
            [deadline, deadline]
          )
      ).to.be.reverted;
    });

    it('Should revert if team member was removed', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      const teamRoleBefore = await tokemakBribe.hasRole(teamRole, simp.address);

      await tokemakBribe.revokeTeamRole(simp.address);

      const teamRoleAfter = await tokemakBribe.hasRole(teamRole, simp.address);

      expect(teamRoleBefore).to.equal(true);
      expect(teamRoleAfter).to.equal(false);
      await expect(
        tokemakBribe
          .connect(simp)
          .setProposals(
            [proposal.address, proposal.address],
            [deadline, deadline]
          )
      ).to.be.revertedWith('Not authorized');
    });
  });

  describe('DepositBribeERC20', () => {
    it('Should deposit ERC20 bribe', async () => {
      const bribeAmount = ethers.BigNumber.from(`${1e18}`);
      const round = await tokemakBribe.getRound();

      // Get balance of *bribeVault* since that's where the funds are stored
      const balanceBeforeDeposit = await btrfly.balanceOf(bribeVault.address);

      await btrfly.approve(bribeVault.address, bribeAmount);

      const { events }: any = await (
        await tokemakBribe.depositBribeERC20(
          proposal.address,
          btrfly.address,
          bribeAmount
        )
      ).wait();
      const depositBribeEvent = events[events.length - 1];
      const balanceAfterDeposit = await btrfly.balanceOf(bribeVault.address);
      const bribe = await tokemakBribe.getBribe(
        proposal.address,
        round,
        btrfly.address
      );

      expect(bribe.bribeToken).to.equal(btrfly.address);
      expect(bribe.bribeAmount).to.equal(bribeAmount);
      expect(balanceBeforeDeposit.add(bribeAmount)).to.equal(
        balanceAfterDeposit
      );
      expect(depositBribeEvent.eventSignature).to.equal(
        'DepositBribe(address,uint256,address,uint256,bytes32,bytes32)'
      );
      expect(depositBribeEvent.args.proposal).to.equal(proposal.address);
      expect(depositBribeEvent.args.round).to.equal(round);
      expect(depositBribeEvent.args.token).to.equal(btrfly.address);
      expect(depositBribeEvent.args.amount).to.equal(bribeAmount);
      expect(depositBribeEvent.args.bribeIdentifier).to.equal(
        getBribeIdentifier(protocol, proposal.address, round, btrfly.address)
      );
      expect(depositBribeEvent.args.rewardIdentifier).to.equal(
        getRewardIdentifier(protocol, round, btrfly.address)
      );
    });

    it('Should revert if proposal deadline passed', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      await tokemakBribe.setProposal(proposal.address, deadline);

      await ethers.provider.send('evm_increaseTime', [360000]);

      const bribeAmount = ethers.BigNumber.from(`${1e18}`);

      await btrfly.approve(bribeVault.address, bribeAmount);

      await expect(
        tokemakBribe.depositBribeERC20(
          proposal.address,
          btrfly.address,
          bribeAmount
        )
      ).to.be.revertedWith('Proposal deadline has passed');
    });

    it('Should revert if token is zero address', async () => {
      // Re-set proposal to ensure deadline is not an issue
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);

      await tokemakBribe.setProposal(proposal.address, deadline);

      const bribeAmount = ethers.BigNumber.from(`${1e18}`);

      await btrfly.approve(bribeVault.address, bribeAmount);
      await expect(
        tokemakBribe.depositBribeERC20(
          proposal.address,
          zeroAddress,
          bribeAmount
        )
      ).to.be.revertedWith('Invalid token');
    });

    it('Should revert if bribe amount is zero', async () => {
      // Re-set proposal to ensure deadline is not an issue
      const deadline = ethers.BigNumber.from(Date.now());

      await tokemakBribe.setProposal(proposal.address, deadline);

      const bribeAmount = ethers.BigNumber.from(`${1e18}`);

      await btrfly.approve(bribeVault.address, bribeAmount);
      await expect(
        tokemakBribe.depositBribeERC20(proposal.address, btrfly.address, 0)
      ).to.be.revertedWith('Bribe amount must be greater than 0');
    });
  });

  describe('depositBribe', () => {
    it('Should deposit native token bribe', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      const round = await tokemakBribe.getRound();
      await tokemakBribe.setProposal(proposal.address, deadline);

      const balanceBeforeDeposit = await ethers.provider.getBalance(
        bribeVault.address
      );
      const bribeAmount = ethers.BigNumber.from(`${1e18}`);

      const { events }: any = await (
        await tokemakBribe.depositBribe(proposal.address, {
          value: bribeAmount,
        })
      ).wait();
      const depositBribeEvent = events[events.length - 1];
      const balanceAfterDeposit = await ethers.provider.getBalance(
        bribeVault.address
      );

      // NOTE: BribeVault sets token to its own address for native tokens (to prevent ERC20 override)
      const bribe = await tokemakBribe.getBribe(
        proposal.address,
        round,
        bribeVault.address
      );

      expect(bribe.bribeToken).to.equal(bribeVault.address);
      expect(bribe.bribeAmount).to.equal(bribeAmount);
      expect(balanceBeforeDeposit.add(bribeAmount)).to.equal(
        balanceAfterDeposit
      );
      expect(depositBribeEvent.eventSignature).to.equal(
        'DepositBribe(address,uint256,address,uint256,bytes32,bytes32)'
      );
      expect(depositBribeEvent.args.proposal).to.equal(proposal.address);
      expect(depositBribeEvent.args.token).to.equal(bribeVault.address);
      expect(depositBribeEvent.args.amount).to.equal(bribeAmount);
      expect(depositBribeEvent.args.round).to.equal(round);
      expect(depositBribeEvent.args.bribeIdentifier).to.equal(
        getBribeIdentifier(
          protocol,
          proposal.address,
          round,
          bribeVault.address
        )
      );
      expect(depositBribeEvent.args.rewardIdentifier).to.equal(
        getRewardIdentifier(protocol, round, bribeVault.address)
      );
    });

    it('Should revert if proposal deadline passed', async () => {
      await ethers.provider.send('evm_increaseTime', [360000]);

      const bribeAmount = ethers.BigNumber.from(`${1e18}`);

      await expect(
        tokemakBribe.depositBribe(proposal.address, {
          value: bribeAmount,
        })
      ).to.be.revertedWith('Proposal deadline has passed');
    });

    it('Should revert if bribe amount is zero', async () => {
      const { timestamp: blockTimestamp } = await ethers.provider.getBlock(
        'latest'
      );
      const deadline = ethers.BigNumber.from(blockTimestamp + 5000);
      await tokemakBribe.setProposal(proposal.address, deadline);

      await expect(
        tokemakBribe.depositBribe(proposal.address)
      ).to.be.revertedWith('Bribe amount must be greater than 0');
    });
  });

  describe('setRewardForwarding', () => {
    it('Should opt in to reward-forwarding', async () => {
      const rewardForwardingBefore = await tokemakBribe.rewardForwarding(
        admin.address
      );

      const { events }: any = await (
        await tokemakBribe.setRewardForwarding(simp.address)
      ).wait();
      const setRewardForwardingEvent = events[events.length - 1];

      const rewardForwardingAfter = await tokemakBribe.rewardForwarding(
        admin.address
      );

      expect(rewardForwardingBefore).to.equal(zeroAddress);
      expect(rewardForwardingAfter).to.equal(simp.address);
      expect(setRewardForwardingEvent.eventSignature).to.equal(
        'SetRewardForwarding(address,address)'
      );
      expect(setRewardForwardingEvent.args.from).to.equal(admin.address);
      expect(setRewardForwardingEvent.args.to).to.equal(simp.address);
    });

    it('Should opt out of reward-forwarding', async () => {
      const rewardForwardingBefore = await tokemakBribe.rewardForwarding(
        admin.address
      );

      const { events }: any = await (
        await tokemakBribe.setRewardForwarding(admin.address)
      ).wait();
      const setRewardForwardingEvent = events[events.length - 1];

      const rewardForwardingAfter = await tokemakBribe.rewardForwarding(
        admin.address
      );

      expect(rewardForwardingBefore).to.equal(simp.address);
      expect(rewardForwardingAfter).to.equal(admin.address);
      expect(setRewardForwardingEvent.eventSignature).to.equal(
        'SetRewardForwarding(address,address)'
      );
      expect(setRewardForwardingEvent.args.from).to.equal(admin.address);
      expect(setRewardForwardingEvent.args.to).to.equal(admin.address);
    });
  });
});
