# Redacted Cartel contest details
- $28,500 USDC main award pot
- $1,500 USDC gas optimization award pot
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-02-redacted-cartel-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts February 15, 2022 00:00 UTC
- Ends February 17, 2022 23:59 UTC

## Contracts

Please review our README first to get an understanding of architecture, user roles, and action flow. Thank you.

**BribeVault.sol**
- Source lines of code: 357
- Sourcel line of code without comments or blank lines: 238
- External contract calls
    - Line 187: IERC20(token).safeTransferFrom(briber, address(this), amount);
    - Lines 283-285: (bool sentFeeRecipient, ) = feeRecipient.call{value: feeAmount}(
                    ""
                );
    - Lines 291-293: (bool sentDistributor, ) = distributor.call{
                    value: distributorAmount
                }("");
    - Line 296: IERC20(token).transfer(feeRecipient, feeAmount);
    - Line 297: IERC20(token).transfer(distributor, distributorAmount);
    - Line 310: IRewardDistributor(distributor).updateRewardsMetadata(distributions);
    - Line 322: IRewardDistributor(distributor).updateRewardsMetadata(distributions);
    - Line 337: IERC20(token).transfer(msg.sender, amount);
    - Line 352: (bool sentAdmin, ) = msg.sender.call{value: amount}("");
- Libraries
    - SafeERC20
    - Common

**RewardDistributor.sol**
- Source lines of code: 209
- Sourcel line of code without comments or blank lines: 145
- External contract calls
    - Line 179: IERC20(token).safeTransfer(_account, _amount);
    - Line 181: payable(_account).transfer(_amount);
- Libraries
    - SafeERC20
    - MerkleProof
    - Common

**TokemakBribe.sol**
- Source lines of code: 303
- Sourcel line of code without comments or blank lines: 198
- External contract calls
    - Lines 201-203: IBribeVault(bribeVault).getBribe(
                generateBribeVaultIdentifier(proposal, round, token)
            );
    - Lines 235-241: IBribeVault(bribeVault).depositBribeERC20(
            bribeIdentifier,
            rewardIdentifier,
            token,
            amount,
            msg.sender
        );
    - Lines 275-280: IBribeVault(bribeVault).depositBribe{value: msg.value}(
            // NOTE: Native token bribes have bribeVault set as the address
            bribeIdentifier,
            rewardIdentifier,
            msg.sender
        );
- Libraries
    - None

**ThecosomataETH.sol**
- Source lines of code: 166
- Source lines of code without comments or blank lines: 118
- External contract calls
    - Line 68: IERC20(_BTRFLY).approve(_CURVEPOOL, 2**256 - 1);
    - Line 69: IERC20(_WETH).approve(_CURVEPOOL, 2**256 - 1);
    - Line 71: _btrflyDecimals = IBTRFLY(_BTRFLY).decimals();
    - Line 72: _ethDecimals = IBTRFLY(_WETH).decimals();
    - Line 88: if (IBTRFLY(BTRFLY).balanceOf(address(this)) > 0) {
    - Line 100: uint256 priceOracle = ICurveCryptoPool(CURVEPOOL).price_oracle();
    - Lines 115-117: uint256 expectedAmount = ICurveCryptoPool(CURVEPOOL).calc_token_amount(
            amounts
        );
    - Line 120: ICurveCryptoPool(CURVEPOOL).add_liquidity(amounts, minAmount);
    - Line 127: uint256 btrfly = IBTRFLY(BTRFLY).balanceOf(address(this));
    - Line 129: uint256 ethCap = IERC20(WETH).balanceOf(TREASURY);
    - Line 137: IRedactedTreasury(TREASURY).manage(WETH, ethLiquidity);
    - Line 144: address token = ICurveCryptoPool(CURVEPOOL).token();
    - Line 145: uint256 tokenBalance = IERC20(token).balanceOf(address(this));
    - Line 146: IERC20(token).transfer(TREASURY, tokenBalance);
    - Line 148: uint256 unusedBTRFLY = IBTRFLY(BTRFLY).balanceOf(address(this));
    - Line 151: IBTRFLY(BTRFLY).burn(unusedBTRFLY);
    - Line 164: IERC20(token).transfer(recipient, amount);
- Libraries
    - None

> Describe any novel or unique curve logic or mathematical models implemented in the contracts

N/A

> Does the token conform to the ERC-20 standard? In what specific ways does it differ?

Hidden Hand does not have its own token.

# Hidden Hand

The goal of Hidden Hand is to facilitate voter incentivization for any protocol - flexibility and customizability is its core differentiation from other popular platforms, such as Votium and Votemak, which generally cater to one protocol. You will find that our architecture and methods of accessing, storing, and segregating data and funds adheres to that goal.


### Setup

IDE: VSCode 1.64.2 (Universal)

Node: 16.13.1

NPM: 8.1.2

1. Install global and local dependencies
`npm i -g typescript && npm i`
2. Create a `.env` file with the same variables as `.env.example` and set them
3. Compile contracts and run tests to ensure the project is set up correctly
`npx hardhat compile && npx hardhat test`

### Contract Overview

**BribeVault.sol**
- Custodies all bribe tokens until they are ready to be distributed
- Stores data related to bribe tokens and amounts, and proofs for verifying correctness of the arbitrary data related to computing bribe token distributions
- Retrieves protocol fees before transferring funds to the RewardDistributor, and sets the data necessary for ensuring only eligible users can claim rewards

**RewardDistributor.sol**
- Custodies only the amount of bribe tokens that can be claimed by users
- Verifies claim data to ensure only eligible users can claim rewards
- Provides an interface for BribeVault to set and update the claim-verification data

**TokemakBribe.sol**
- Stores Tokemak-specific data used by the client (i.e. frontend app) to display info that directs users to take the right actions that make them eligible for rewards (e.g. vote for proposal X to get Y reward)
- Contains the logic for generating identifiers that are used for storing and accessing relevant BribeVault data
- Transfers all bribe tokens to the BribeVault as they are received and creates or updates the relevant records locally and on BribeVault

**ThecosomataETH.sol**
- Withdraws ETH from the Redacted treasury (such as the ETH from Hidden Hand bribe fees) and pairs it with BTRFLY to add Curve liquidity

### User Roles

**Explicit (defined in-contract)**
- Admins: Owner-level accounts (e.g. multisig, founder account, etc.) with the ability to call any permissioned method. Their primary responsibilities are role management and funds disbursement (e.g. transferring funds from BribeVault to RewardDistributor along with the required proofs)
- Team Members: Team member accounts with the ability to call permissioned methods pertaining to the maintainenance and continued operation of the protocol (e.g. setting the proposals or updating the round in TokemakBribe)

**Implicit**
- Briber: Accounts that submit actions to be taken along with rewards for doing so (e.g. calling a deposit method on TokemakBribe to specify a proposal to vote for and the incentives for voting on it)
- Bribee: Accounts that take action and claim the associated rewards (e.g. voting on a proposal specified in TokemakBribe and claiming their share of the reward after the voting round is over)
- Auditor: Entities that verify data and claim proofs (i.e. comparing data against their hashes and merkle roots) to confirm that the rewards were distributed correctly (e.g. verifying that the voting activity on a bribed proposal aligns with the reward distribution).

![Contract Diagram](https://i.imgur.com/B7Kr2aD.png)

_<p align="center">General interaction between the contracts and users</p>_

### Action-chain: Tokemak CoRE Round

A sequential series of actions taken by different users from the beginning of a Tokemak CoRE round (assume the round has started) to the reward claims
1. On the TokemakBribe contract, team members set the round, and set the proposals and the deadlines by which bribers can deposit rewards
2. On the TokemakBribe contract, bribers specify the proposals and include the incentives for voting on them. The TokemakBribe contract transfers all funds to the BribeVault contract as they are received (i.e. it does not custody funds beyond the deposit method calls) and updates the relevant data on the BribeVault contract
3. Outside of the Hidden Hand contract scope, voters place their votes on the proposals 
4. Outside of the Hidden Hand contract scope, after the Tokemak CoRE round ends, proposal data is compiled and these two things happen:
- The following is derived from the data: its hash (KECCAK-256) and merkle roots (one for each bribe token in the round and contains the accounts and amounts each should receive)
- The data file is uploaded to a publicly-accessible location and can be used to verify the hash and merkle roots by an auditor

_NOTE: The data contains everything necessary to generate the merkle roots for reward distribution and also any relevant contextual information (e.g. if a voter is forwarding their rewards to another account, we will include both addresses in the data - only the reward-forwarded account is necessary to generate the merkle roots but knowing the origin/voter account may be useful in an audit)._

5. On the BribeVault contract, an admin calls the transfer bribe method (the data's hash and merkle roots are used here), which results in funds being transferred from the BribeVault to the RewardDistributor
6. On the RewardDistributor contract, eligible accounts (voters or accounts that are forwarded rewards) call the claim method and are transferred their rewards
