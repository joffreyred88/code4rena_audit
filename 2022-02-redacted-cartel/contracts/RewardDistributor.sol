// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Common} from "./libraries/Common.sol";

contract RewardDistributor is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Reward {
        address token;
        bytes32 merkleRoot;
        bytes32 proof;
        uint256 updateCount;
    }

    struct Claim {
        bytes32 identifier;
        address account;
        uint256 index;
        uint256 amount;
        bytes32[] merkleProof;
    }

    address public bribeVault;
    mapping(bytes32 => Reward) public rewards; // Maps each of the reward identifier to its metadata
    mapping(bytes32 => mapping(uint256 => mapping(uint256 => uint256)))
        private claimed; // Tracks whether a specific reward claim has been done

    event SetBribeVault(address _bribeVault);
    event RewardClaimed(
        bytes32 indexed identifier,
        address indexed tokenAddress,
        address indexed account,
        uint256 updateCount,
        uint256 index,
        uint256 amount
    );
    event RewardMetadataUpdated(
        bytes32 indexed identifier,
        address indexed token,
        bytes32 merkleRoot,
        bytes32 proof,
        uint256 indexed updateCount
    );

    constructor(address _bribeVault) {
        require(_bribeVault != address(0), "Invalid bribeVault");
        bribeVault = _bribeVault;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Enables BribeVault to transfer native tokens
    receive() external payable {}

    /**
        @notice Set bribe vault
        @param  _bribeVault address New address of the bribe vault
     */
    function setBribeVault(address _bribeVault)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_bribeVault != address(0), "Invalid bribeVault");
        bribeVault = _bribeVault;

        emit SetBribeVault(bribeVault);
    }

    /**
        @notice Claim rewards based on the specified metadata
        @param  _claims   Claim[] List of claim metadata
     */
    function claim(Claim[] calldata _claims) external nonReentrant {
        require(_claims.length > 0, "Invalid _claims");

        for (uint256 i = 0; i < _claims.length; i++) {
            _claim(
                _claims[i].identifier,
                _claims[i].index,
                _claims[i].account,
                _claims[i].amount,
                _claims[i].merkleProof
            );
        }
    }

    /**
        @notice Update the overall metadata of the specified reward identifiers
        @param  _distributions    Distribution[] List of reward distribution details
     */
    function updateRewardsMetadata(
        Common.Distribution[] calldata _distributions
    ) external {
        require(msg.sender == bribeVault, "Invalid access");
        require(_distributions.length > 0, "Invalid _distributions");

        for (uint256 i = 0; i < _distributions.length; i++) {
            // Update the metadata and also increment the update to reset the claimed tracker
            Reward storage reward = rewards[_distributions[i].rewardIdentifier];
            reward.token = _distributions[i].token;
            reward.merkleRoot = _distributions[i].merkleRoot;
            reward.proof = _distributions[i].proof;
            reward.updateCount += 1;

            emit RewardMetadataUpdated(
                _distributions[i].rewardIdentifier,
                _distributions[i].token,
                _distributions[i].merkleRoot,
                _distributions[i].proof,
                reward.updateCount
            );
        }
    }

    /**
        @notice Check if the reward on the specified identifier and index has been claimed
        @param  _identifier    bytes32 The specified identifier
        @param  _index         bytes32 The specified index
        @return  claimed       bool    Whether reward has been claimed
     */
    function isRewardClaimed(bytes32 _identifier, uint256 _index)
        public
        view
        returns (bool)
    {
        // Get the group index for the specified index along with the bit index
        // and check if the corresponding bit index is flipped
        Reward memory reward = rewards[_identifier];
        uint256 claimedGroup = _index / 256;
        uint256 claimedIndex = _index % 256;
        uint256 claimedGroupState = claimed[_identifier][reward.updateCount][
            claimedGroup
        ];
        uint256 mask = (1 << claimedIndex);
        return claimedGroupState & mask == mask;
    }

    /**
        @notice Claim a reward
        @param  _rewardIdentifier  bytes32    Reward identifier
        @param  _index             uint256    Node index
        @param  _account           address    Eligible user account
        @param  _amount            bytes32    Reward amount
        @param  _merkleProof       bytes32[]  Merkle proof
     */
    function _claim(
        bytes32 _rewardIdentifier,
        uint256 _index,
        address _account,
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) internal {
        Reward memory reward = rewards[_rewardIdentifier];
        require(reward.merkleRoot != 0, "Distribution not enabled");
        require(
            !isRewardClaimed(_rewardIdentifier, _index),
            "Reward already claimed"
        );

        // Verify the merkle proof
        bytes32 node = keccak256(abi.encodePacked(_index, _account, _amount));
        require(
            MerkleProof.verify(_merkleProof, reward.merkleRoot, node),
            "Invalid proof"
        );

        _setClaimed(_rewardIdentifier, _index);

        // Check whether the reward is in the form of native tokens or ERC20
        // by checking if the token address is set to the bribe vault or not
        address token = reward.token;
        if (token != bribeVault) {
            IERC20(token).safeTransfer(_account, _amount);
        } else {
            payable(_account).transfer(_amount);
        }

        emit RewardClaimed(
            _rewardIdentifier,
            token,
            _account,
            reward.updateCount,
            _index,
            _amount
        );
    }

    /**
        @notice Set a reward as claimed
        @param  _identifier  bytes32    Reward identifier
        @param  _index       uint256    Node index
     */
    function _setClaimed(bytes32 _identifier, uint256 _index) internal {
        Reward memory reward = rewards[_identifier];
        uint256 claimedGroup = _index / 256;
        uint256 claimedIndex = _index % 256;

        // Flip the bit state to mark the corresponding index as claimed
        claimed[_identifier][reward.updateCount][claimedGroup] =
            claimed[_identifier][reward.updateCount][claimedGroup] |
            (1 << claimedIndex);
    }
}
