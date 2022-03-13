# Aave Lens Protocol contest details
- $95,000 USDC main award pot
- $5,000 USDC gas optimization award pot
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-02-aave-lens-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts February 3, 2022 00:00 UTC
- Ends February 9, 2022 23:59 UTC

## Things to Look Out For

Documentation, including an overview, setup guide, specification and walthrough can be found [here.](https://docs.lens.dev/docs) The readme is copied over in this readme as well for convenience!

The full repository is located [here.](https://github.com/aave/lens-protocol)

The protocol's core `LensHub` contract is deployed with OpenZeppelin's `TransparentUpgradeableProxy`, and the `Clones` library is used extensively. Care should be taken to ensure proper use of these proxying mechanisms (e.g. Potential issues down the line/etc).

Furthermore, the `FollowNFT` has built-in governance, which is only "enabled" for a wallet upon its first delegation. The governance mechanism is inspired by the [Aave token.](https://github.com/aave/aave-token-v2/blob/master/contracts/token/base/GovernancePowerDelegationERC20.sol) There is also extensive use of `unchecked {}` blocks, including some expected underflows. Care should be taken to ensure that voting power is properly accounted for in all cases.

The highest financial risk lies in the system's modules, as those are the contracts that are expected to handle fund transfers. It's important to make sure that all modules are secure and all edge cases are accounted for appropriately, including cases where follow/collect NFTs are burned, transferred, etc. It is also worth noting that, since the `LensHub` is upgradeable, modules should be built assuming that re-initialization is always a possibility (it already is for follow modules, but not for collect & reference modules).

## Lines of Code

Total : 39 files,  3432 lines of code, 2189 lines of comment, 691 blank lines, all in all 6312 lines

### Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| contracts/core/CollectNFT.sol | Solidity | 49 | 16 | 12 | 77 |
| contracts/core/FollowNFT.sol | Solidity | 233 | 43 | 41 | 317 |
| contracts/core/LensHub.sol | Solidity | 766 | 106 | 89 | 961 |
| contracts/core/base/IERC721Time.sol | Solidity | 10 | 33 | 6 | 49 |
| contracts/core/base/ERC721Enumerable.sol | Solidity | 86 | 71 | 25 | 182 |
| contracts/core/base/ERC721Time.sol | Solidity | 242 | 192 | 56 | 490 |
| contracts/core/base/LensMultiState.sol | Solidity | 33 | 10 | 10 | 53 |
| contracts/core/base/LensNFTBase.sol | Solidity | 136 | 30 | 20 | 186 |
| contracts/core/modules/FeeModuleBase.sol | Solidity | 28 | 8 | 9 | 45 |
| contracts/core/modules/FollowValidationModuleBase.sol | Solidity | 19 | 12 | 4 | 35 |
| contracts/core/modules/ModuleBase.sol | Solidity | 15 | 8 | 6 | 29 |
| contracts/core/modules/ModuleGlobals.sol | Solidity | 80 | 27 | 20 | 127 |
| contracts/core/modules/collect/EmptyCollectModule.sol | Solidity | 23 | 16 | 6 | 45 |
| contracts/core/modules/collect/FeeCollectModule.sol | Solidity | 108 | 48 | 23 | 179 |
| contracts/core/modules/collect/LimitedFeeCollectModule.sol | Solidity | 123 | 50 | 24 | 197 |
| contracts/core/modules/collect/LimitedTimedFeeCollectModule.sol | Solidity | 129 | 53 | 26 | 208 |
| contracts/core/modules/collect/RevertCollectModule.sol | Solidity | 21 | 16 | 5 | 42 |
| contracts/core/modules/collect/TimedFeeCollectModule.sol | Solidity | 116 | 51 | 26 | 193 |
| contracts/core/modules/follow/ApprovalFollowModule.sol | Solidity | 74 | 46 | 14 | 134 |
| contracts/core/modules/follow/FeeFollowModule.sol | Solidity | 61 | 40 | 14 | 115 |
| contracts/core/modules/follow/FollowValidatorFollowModuleBase.sol | Solidity | 22 | 14 | 4 | 40 |
| contracts/core/modules/reference/FollowerOnlyReferenceModule.sol | Solidity | 31 | 21 | 7 | 59 |
| contracts/core/storage/LensHubStorage.sol/cor | Solidity | 35 | 31 | 7 | 73 |
| contracts/interfaces/ICollectModule.sol | Solidity | 15 | 26 | 4 | 45 |
| contracts/interfaces/ICollectNFT.sol | Solidity | 11 | 28 | 5 | 44 |
| contracts/interfaces/IFollowModule.sol | Solidity | 22 | 53 | 6 | 81 |
| contracts/interfaces/IFollowNFT.sol | Solidity | 18 | 45 | 10 | 73 |
| contracts/interfaces/ILensHub.sol | Solidity | 83 | 343 | 53 | 479 |
| contracts/interfaces/ILensNFTBase.sol | Solidity | 18 | 45 | 8 | 71 |
| contracts/interfaces/IModuleGlobals.sol | Solidity | 12 | 59 | 12 | 83 |
| contracts/interfaces/IReferenceModule.sol | Solidity | 18 | 30 | 5 | 53 |
| contracts/libraries/Constants.sol | Solidity | 8 | 1 | 3 | 12 |
| contracts/libraries/DataTypes.sol | Solidity | 131 | 180 | 20 | 331 |
| contracts/libraries/Errors.sol | Solidity | 38 | 3 | 5 | 46 |
| contracts/libraries/Events.sol | Solidity | 170 | 271 | 37 | 478 |
| contracts/libraries/Helpers.sol | Solidity | 31 | 20 | 7 | 58 |
| contracts/libraries/InteractionLogic.sol | Solidity | 106 | 31 | 21 | 158 |
| contracts/libraries/PublishingLogic.sol | Solidity | 294 | 84 | 34 | 412 |
| contracts/upgradeability/VersionedInitializable.sol | Solidity | 17 | 28 | 7 | 52 |

## Readme

The following is a copy of the Lens Protocol's readme file:

# Lens Protocol

The Lens Protocol is a decentralized, non-custodial social graph. Lens implements unique, on-chain social interaction mechanisms analogous to commonly understood Web2 social media interactions, but significantly expanded with unique functionality that empower communities to form and participants to own their own social graph.

## Setup

The environment is built using Docker Compose, note that your `.env` file must have an `ALCHEMY_KEY` or an `INFURA_KEY` variable, and an optional `MNEMONIC` and `ETHERSCAN_KEY`, defined like so:

```
MNEMONIC="MNEMONIC YOU WANT TO DERIVE WALLETS FROM HERE"
ALCHEMY_KEY="YOUR ALCHEMY KEY HERE"
INFURA_KEY="OR YOUR INFURA KEY HERE"
ETHERSCAN_KEY="YOUR ETHERSCAN API KEY HERE"
```

With the environment file set up, you can move on to using Docker:

```
$ sudo docker-compose up
```

And in another terminal:

```
$ sudo docker-compose exec contracts-env bash
```

From there, have fun!

Here are a few self-explanatory scripts:

```
$ npm run test
$ npm run coverage
$ npm run compile
```

## Protocol Overview

The Lens Protocol transfers ownership of social graphs to the participants of that graph themselves. This is achieved by creating direct links between `profiles` and their `followers`, while allowing fine-grained control of additional logic, including monetization, to be executed during those interactions on a profile-by-profile basis.

Here's how it works...

### Profiles

Any address can create a profile and receive an ERC-721 `Lens Profile` NFT. Profiles are represented by a `ProfileStruct`:

```
/**
 * @notice A struct containing profile data.
 *
 * @param pubCount The number of publications made to this profile.
 * @param followNFT The address of the followNFT associated with this profile, can be empty..
 * @param followModule The address of the current follow module in use by this profile, can be empty.
 * @param handle The profile's associated handle.
 * @param uri The URI to be displayed for the profile NFT.
 */
struct ProfileStruct {
    uint256 pubCount;
    address followNFT;
    address followModule;
    string handle;
    string uri;
}
```

Profiles have a specific URI associated with them, which is meant to include metadata, such as a link to a profile picture or a display name for instance, the JSON standard for this URI is not yet determined. Profile owners can always change their follow module or profile URI.

#### Publications

Profile owners can `publish` to any profile they own. There are three `publication` types: `Post`, `Comment` and `Mirror`. Profile owners can also set and initialize the `Follow Module` associated with their profile.

Publications are on-chain content created and published via profiles. Profile owners can create (publish) three publication types, outlined below. They are represented by a `PublicationStruct`:

```
/**
 * @notice A struct containing data associated with each new publication.
 *
 * @param profileIdPointed The profile token ID this publication points to, for mirrors and comments.
 * @param pubIdPointed The publication ID this publication points to, for mirrors and comments.
 * @param contentURI The URI associated with this publication.
 * @param referenceModule The address of the current reference module in use by this profile, can be empty.
 * @param collectModule The address of the collect module associated with this publication, this exists for all publication.
 * @param collectNFT The address of the collectNFT associated with this publication, if any.
 */
struct PublicationStruct {
    uint256 profileIdPointed;
    uint256 pubIdPointed;
    string contentURI;
    address referenceModule;
    address collectModule;
    address collectNFT;
}
```

#### Publication Types

##### Post

This is the standard publication type, akin to a regular post on traditional social media platforms. Posts contain:

1. A URI, pointing to the actual publication body's metadata JSON, including any images or text.
2. An uninitialized pointer, since pointers are only needed in mirrors and comments.

##### Comment

This is a publication type that points back to another publication, whether it be a post, comment or mirror, akin to a regular comment on traditional social media. Comments contain:

1. A URI, just like posts, pointing to the publication body's metadata JSON.
2. An initialized pointer, containing the profile ID and the publication ID of the publication commented on.

##### Mirror

This is a publication type that points to another publication, note that mirrors cannot, themselves, be mirrored (doing so instead mirrors the pointed content). Mirrors have no original content of its own. Akin to a "share" on traditional social media. Mirrors contain:

1. An empty URI, since they cannot have content associated with them.
2. An initialized pointer, contianing the profile ID and the publication ID of the mirrored publication.

### Profile Interaction

There are two types of profile interactions: follows and collects.

#### Follows

Wallets can follow profiles, executing modular follow processing logic (in that profile's selected follow module) and receiving a `Follow NFT`. Each profile has a connected, unique `FollowNFT` contract, which is first deployed upon successful follow. Follow NFTs are NFTs with integrated voting and delegation capability.

The inclusion of voting and delegation right off the bat means that follow NFTs have the built-in capability to create a spontaneous DAO around any profile. Furthermore, holding follow NFTs allows followers to `collect` publications from the profile they are following (except mirrors, which are equivalent to shares in Web2 social media, and require following the original publishing profile to collect).

#### Collects

Collecting works in a modular fashion as well, every publication (except mirrors) requires a `Collect Module` to be selected and initialized. This module, similarly to follow modules, can contain any arbitrary logic to be executed upon collects. Successful collects result in a new, unique NFT being minted, essentially as a saved copy of the original publication. There is one deployed collect NFT contract per publication, and it's deployed upon the first successful collect.

When a mirror is collected, what happens behind the scenes is the original, mirrored publication is collected, and the mirror publisher's profile ID is passed as a "referrer." This allows neat functionality where collect modules that incur a fee can, for instance, reward referrals. Note that the `Collected` event, which is emitted upon collection, indexes the profile and publication directly being passed, which, in case of a mirror, is different than the actual original publication getting collected (which is emitted unindexed).

Alright, that was a mouthful! Let's move on to more specific details about Lens's core principle: Modularity.

## Lens Modularity

Stepping back for a moment, the core concept behind modules is to allow as much freedom as possible to the community to come up with new, innovative interaction mechanisms between social graph participants. For security purposes, this is achieved by including a whitelisted list of modules controlled by governance.

To recap, the Lens Protocol has three types of modules:

1. `Follow Modules` contain custom logic to be executed upon follow.
2. `Collect Modules` contain custom logic to be executed upon collect. Typically, these modules include at least a check that the collector is a follower.
3. `Reference Modules` contain custom logic to be executed upon comment and mirror. These modules can be used to limit who is able to comment and interact with a profile.

Note that collect and reference modules should _not_ assume that a publication cannot be re-initialized, and thus should include front-running protection as a security measure if needed, as if the publication data was not static. This is even more prominent in follow modules, where it can absolutely be changed for a given profile.

Lastly, there is also a `ModuleGlobals` contract which acts as a central data provider for modules. It is controlled by a specific governance address which can be set to a different executor compared to the Hub's governance. It's expected that modules will fetch dynamically changing data, such as the module globals governance address, the treasury address, the treasury fee as well as a list of whitelisted currencies.

### Upgradeability

This iteration of the Lens Protocol implements a transparent upgradeable proxy for the central hub to be controlled by governance. There are no other aspects of the protocol that are upgradeable. In an ideal world, the hub will not require upgrades due to the system's inherent modularity and openness, upgradeability is there only to implement new, breaking changes that would be impossible, or unreasonable to implement otherwise.

This does come with a few caveats, for instance, the `ModuleGlobals` contract implements a currency whitelist, but it is not upgradeable, so the "removal" of a currency whitelist in a module would require a specific new module that does not query the `ModuleGlobals` contract for whitelisted currencies.
