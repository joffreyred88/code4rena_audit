<div align="center"><img width="600" src="https://user-images.githubusercontent.com/22816913/140889449-5c5afc92-0d4d-43c8-9d02-b3489eab093f.png"></div>
<br/>
<div align="center"><a href="https://nested.fi" > https://nested.fi </a></div>

# Nested Finance contest details
- $27,000 USDC main award pot
- $3,000 USDC gas optimization award pot
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-02-nested-finance-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts February 10, 2022 00:00 UTC
- Ends February 12, 2022 23:59 UTC

## Scope

All the Solidity files are included in the audit scope, **expect the ones in the `contracts/mocks` folder**.

## Previous Audits

The preview version has been audited 3 times (at the end of 2021):
- [CodeArena 2021-11](https://code4rena.com/reports/2021-11-nested)
- [Peckshield Audit Report v1.0](audits/PeckShield-Audit-Report-Nested-v1.0.pdf)
- [Red4Sec Audit Report v1.0](audits/Red4Sec_Nested_Finance_Security_Audit_Report_v3.pdf)

## New version

This new version includes:
- Audit fixes.
- `NestedFactory` refactoring (interface simplication + expanding the possibilities).
- Operators mechanism simplification.
- Add proxy.

## Known issues/topics

### Copy my portfolio (fees trick)

A user can copy his own portfolio to reduce the fees, however a require statement won't fix this issue...

This problem cannot be corrected but only mitigated, since the user can use two different wallets.
Currently the front-end doesn't allow to duplicate a portfolio with the same address.

### Deflationary/Rebase Tokens

The protocol is no fully compatible with deflationary/rebase tokens. In fact, you can add a deflationary/rebase token to your portfolio but it can lead to unpredictable behaviors (positive or negative).

We have chosen to manage the tokens with a fixed amount (the input) after considering several solutions.

**So, how can we mitigate that ?**

We're maintaining a list of all rebase tokens (source coingecko, which is well maintained) and prevent users from adding them to their portfolio on the platform.

## Coverage

`npx hardhat coverage`

![image](https://user-images.githubusercontent.com/22816913/153220720-41ef117e-276a-4248-b259-9860c7525188.png)
![image](https://user-images.githubusercontent.com/22816913/153220602-3b6f3531-cf32-42e9-8a71-1ea60d569ba6.png)


## Links

- **Website** : https://nested.fi
- **Documentation** : https://docs.nested.finance/
- **Medium** : https://nestedfinance.medium.com/
- **Twitter** : https://twitter.com/NestedFinance
- **Telegram** : https://t.me/NestedFinanceChannel
- **Discord** : https://discord.gg/VW8ZZsACzd

## Contact us ????

Wardens! If you have any questions, please contact us!

#### Axxe (Smart contract engineer)
- **Telegram** : @axxedev
- **Discord** : axxe#8561
- **Schedule a call** : [Calendly](https://calendly.com/maxime-brugel/lets-talk)

#### Adrien (CTO)

- **Telegram** : @adrienspt
- **Discord** : Adrien | Nested Finance#6564
- **Schedule a call** : [Calendly](https://calendly.com/adrien-supizet/30min)

## Beta access ??

If you want to access the beta version of Nested Finance, go to : https://app.nested.fi/.

It can help to better understand the protocol context.


---

# Introduction

Nested Finance is a decentralized protocol providing customizable financial products in the form of NFTs. 
The platform allows users to put several digital assets, i.e. ERC20 tokens, inside an NFT (abbreviated as `NestedNFT`).
<br/>

Each NestedNFT is backed by underlying assets:
- Purchased or sold on a decentralized exchange (AMM).
- Collected/earned after adding liquidity or staking.
- Exchanged/Minted on a protocol that is not a decentralized exchange.
- (...)

The main idea is to allow adding modules (**operators**) to interact with new protocols 
and enable new assets, without re-deploying.

> The tokens are stored on a self-custodian smart contract.

At the end of the creation process, the user receives the NFT which allows to control all underlying assets of the portfolio.
Furthermore, we allow users to copy other users NestedNFTs. The creator of the initial NestedNFT earns royalties.

### _Further documentation and details can be found here: https://docs.nested.finance/_

# Architecture

![image](https://user-images.githubusercontent.com/22816913/152804262-e8879475-8873-43a9-9a53-18da1517b3fd.png)

## Core contracts

| Name             |  LOC | Purpose  |
|------------------|------|----------|
| **NestedFactory**    | 404 | Entry point to the protocol. Holds the business logic. Responsible for interactions with operators (submit orders). |
| **NestedAsset**      | 66 | Collection of ERC721 tokens. Called NestedNFT across the codebase. |
| **NestedReserve**    | 17 | Holds funds for the user. Transferred from the NestedFactory. |
| **NestedRecords**    | 110 | Tracks underlying assets of NestedNFTs. (Amount, NestedReserve). |
| **FeeSplitter**      | 188 | Receives payments in ERC20 tokens from the factory when fees are sent. Allows each party to claim the amount they are due. |

## Upgradability

The contracts `NestedAsset`, `NestedReserve`, and `NestedRecords` are whitelisting multiple factories (to create NFTs, update records, withdraw from reserve,...).

However, we are also using the [TransparentUpgradeableProxy](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/TransparentUpgradeableProxy.sol) for `NestedFactory`. Then, the users doesn't have to approve multiple times.

We have kept both mechanisms to get the best flexibility.

## Lock

The users can lock their NFTs until a certain date (timestamp) by calling `updateLockTimestamp`. This feature allows the "hold by design".

## Operators (modularization)

### What is an operator?

`NestedFactory` is the main smart contract, but it can't work without the Operators.

As mentioned in the introduction, we designed the protocol to be **modular**.
We want to be able to interact with any protocol in exchange for an ERC20 token.

So, we had to deal with two issues :
- How to interact with 5, 10, or 20 protocols without blowing up the bytecode size and having too much logic?
- How to add new interactions without redeploying the `NestedFactory` contract?

Our solution is called the "**Operator**"... A new interaction is a new operator and can be added on the fly.
They kind of work like [libraries](https://docs.soliditylang.org/en/v0.8.9/contracts.html#libraries), but since we don't want to redeploy the factory, 
they are contracts that are called via `delegatecall` and referenced by the `OperatorResolver`.

### Operator Resolver

An operator allows performing a precise action, like _"swap my token A for a token B"_ with a specific function, but the operator/interface will change depending on the action/context. To interact with new operators on the fly, we must expose new interfaces to the Factory.
The `OperatorResolver` will whitelist all the Operator (`address`) with the selectors (`bytes4`) since we can't trust the caller to provide these informations.

```javascript
struct Operator {
    address implementation;
    bytes4 selector;
}
```

The caller will send the (imported) `bytes32` name of the Operator/Function, for example "ZeroEx::performSwap".

The `OperatorResolver` will return the `address` + `selector` if the call is whitelisted and revert if not.

### Storage

Since the operators are called via `delegatecall`: _how can we store/retrieve useful data?_
<br>In fact, we cannot trust the Factory to provide all the data, like the address of the protocol. It must be stored and managed by the owner.

When deploying an operator, it will also deploy the storage contract and transfer the ownership to `msgSender()`.

### Diagram

![image](https://user-images.githubusercontent.com/22816913/152804758-98de74eb-e09c-44ac-8504-32b40c3624ae.png)

### Contracts

| Name                  |  LOC | Purpose  |
|-----------------------|------|----------|
| **OperatorResolver**     | 59 | Allows the factory to identify which operator to interact with. |
| **MixinOperatorResolver**| 67 | Abstract contract to load authorized operators in cache (instead of calling `OperatorResolver`). |
| **ZeroExOperator**       | 33 | Performs token swaps through 0x ([read more](contracts/operators/ZeroEx/README.md)). |
| **ZeroExStorage**        | 11 | ZeroExOperator storage contract. Must store the 0x `swapTarget`. |
| **FlatOperator**         | 19 | Handles deposits and withdraws. No interaction with any third parties ([read more](contracts/operators/Flat/README.md)). |

_More operators will be added. e.g. CurveOperator or SynthetixOperator_

### Orders

The `NestedFactory` is using the operators to interact with other protocols. The call from the Factory to an Operator is an "Order".

An Order has several information:
- The operator/selector to use
- The token processed (swapped, stacked,...) by the operator (from the portfolio or wallet).
- The calldatas (without the selector).

```javascript
struct Order {
    bytes32 operator;
    address token;
    bytes callData;
}
```

It help us to make **one** interaction, but we want to make multiple interactions. For example, to create a portfolio with multiple tokens, we need to "batch" these orders. 

**There are two types of "Batched Orders" processed by the Factory to create or edit Portfolios :**

#### Batched Input Orders

<div align="center"><img width="650" src="https://user-images.githubusercontent.com/22816913/152816454-467afbf1-62a1-4d81-9cc3-e86403ab2e8f.png"></div>

- One same input for every orders but multiple outputs.
- 1% Fee on the input.
- The input (*source*) is from a wallet **or** a porfolio owned by the transactions signer.
- The ouput (*destination*) is the portfolio owned by the transactions signer (**only**). 

```javascript
struct BatchedInputOrders {
    IERC20 inputToken;
    uint256 amount;
    Order[] orders;
    bool fromReserve;
}
```

#### Batched Output Orders

<div align="center"><img width="650" src="https://user-images.githubusercontent.com/22816913/152816552-f48f1a68-e8c2-44d3-b709-5f2ef17e9fb1.png"></div>

- Multiple inputs for every orders but one output.
- 1% Fee on the output.
- The input (*source*) is the portfolio owned by the transactions signer (**only**). 
- The ouput (*destination*) is from a wallet **or** a portfolio owned by the transactions signer.

```javascript
struct BatchedOutputOrders {
    IERC20 outputToken;
    uint256[] amounts;
    Order[] orders;
    bool toReserve;
}
```

# Ownership & Governance

Some functions of the protocol require admin rights (`onlyOwner`).

The contracts are owned by the [TimelockController](https://docs.openzeppelin.com/contracts/4.x/api/governance#TimelockController) contract from OpenZeppelin, set with a **7-days** delay.
This ensures the community has time to review any changes made to the protocol.

The owner of the TimelockController is a three-party multisignature wallet.
> During the next phase of the protocol, the ownership will be transferred to a fully decentralized DAO.

# Development & Testing

## Setup
- Install Node > 12
- Install Yarn
- `yarn install`
- Copy `.env.example` to a new file `.env` and insert a dummy mnemonic and a mainnet api key

## Commands

- Start a local blockchain
`yarn run`

- Start a hardhat console
`yarn console`

- Compile
`yarn compile`

- Generate typechain files
`yarn typechain`

- Run tests
`yarn test`

# License
[GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.html)
