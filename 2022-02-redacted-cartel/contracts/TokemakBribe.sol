// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

interface IBribeVault {
    function depositBribeERC20(
        bytes32 bribeIdentifier,
        bytes32 rewardIdentifier,
        address token,
        uint256 amount,
        address briber
    ) external;

    function getBribe(bytes32 bribeIdentifier)
        external
        view
        returns (address token, uint256 amount);

    function depositBribe(
        bytes32 bribeIdentifier,
        bytes32 rewardIdentifier,
        address briber
    ) external payable;
}

contract TokemakBribe is AccessControl {
    address public bribeVault;

    // Used for generating the bribe and reward identifiers
    string public constant protocol = "TOKEMAK";
    uint256 private _round;

    // Proposal addresses mapped to deadlines by which bribers can deposit
    mapping(address => uint256) public proposalDeadlines;

    // Voter addresses mapped to addresses which will claim rewards on their behalf
    mapping(address => address) public rewardForwarding;

    bytes32 public constant TEAM_ROLE = keccak256("TEAM_ROLE");

    event GrantTeamRole(address teamMember);
    event RevokeTeamRole(address teamMember);
    event SetProposal(
        address indexed proposal,
        uint256 deadline,
        uint256 indexed round
    );
    event SetProposals(address[] proposals, uint256[] deadlines, uint256 round);
    event DepositBribe(
        address indexed proposal,
        uint256 indexed round,
        address indexed token,
        uint256 amount,
        bytes32 bribeIdentifier,
        bytes32 rewardIdentifier
    );
    event SetRewardForwarding(address from, address to);

    constructor(address _bribeVault) {
        require(_bribeVault != address(0), "Invalid bribeVault");
        bribeVault = _bribeVault;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyAuthorized() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(TEAM_ROLE, msg.sender),
            "Not authorized"
        );
        _;
    }

    /**
        @notice Grant the team role to an address
        @param  teamMember  address  Address to grant the teamMember role
     */
    function grantTeamRole(address teamMember)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(teamMember != address(0), "Invalid teamMember");
        _grantRole(TEAM_ROLE, teamMember);

        emit GrantTeamRole(teamMember);
    }

    /**
        @notice Revoke the team role from an address
        @param  teamMember  address  Address to revoke the teamMember role
     */
    function revokeTeamRole(address teamMember)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(hasRole(TEAM_ROLE, teamMember), "Invalid teamMember");
        _revokeRole(TEAM_ROLE, teamMember);

        emit RevokeTeamRole(teamMember);
    }

    /**
        @notice Set a new voting round
        @param  _newRound uint256 The new round number
     */
    function setRound(uint256 _newRound) external onlyAuthorized {
        _round = _newRound;
    }

    /**
        @notice Set a new voting round
        @return round uint256 The current round number
     */
    function getRound() external view returns (uint256) {
        return _round;
    }

    /**
        @notice Set a single proposal
        @param  proposal  addresss Proposal address
        @param  deadline  uint256  Proposal deadline
     */
    function setProposal(address proposal, uint256 deadline)
        public
        onlyAuthorized
    {
        require(proposal != address(0), "Invalid proposal");
        require(deadline >= block.timestamp, "Deadline must be in the future");

        proposalDeadlines[proposal] = deadline;

        emit SetProposal(proposal, deadline, _round);
    }

    /**
        @notice Set multiple proposals
        @param  proposals  address[]  Proposal addresses
        @param  deadlines  uint256[]  Proposal deadlines
     */
    function setProposals(
        address[] calldata proposals,
        uint256[] calldata deadlines
    ) external onlyAuthorized {
        require(proposals.length > 0, "Need at least 1 proposal");
        require(
            proposals.length == deadlines.length,
            "Must be equal # of proposals and deadlines"
        );

        for (uint256 i = 0; i < proposals.length; i += 1) {
            setProposal(proposals[i], deadlines[i]);
        }

        emit SetProposals(proposals, deadlines, _round);
    }

    /**
        @notice Generate the BribeVault identifier based on a scheme
        @param  proposal    address  Proposal
        @param  round       uint256  Voting round
        @param  token       address  Token
        @return identifier  bytes32  BribeVault identifier
     */
    function generateBribeVaultIdentifier(
        address proposal,
        uint256 round,
        address token
    ) internal pure returns (bytes32 identifier) {
        return keccak256(abi.encodePacked(protocol, proposal, round, token));
    }

    /**
        @notice Generate the reward identifier based on a scheme
        @param  round       uint256  Round
        @param  token       address  Token
        @return identifier  bytes32  Reward identifier
     */
    function generateRewardIdentifier(uint256 round, address token)
        internal
        pure
        returns (bytes32 identifier)
    {
        return keccak256(abi.encodePacked(protocol, round, token));
    }

    /**
        @notice Get bribe from BribeVault
        @param  proposal            address  Proposal
        @param  token               address  Token
        @return bribeToken          address  Token address
        @return bribeAmount         address  Token address
     */
    function getBribe(
        address proposal,
        uint256 round,
        address token
    ) external view returns (address bribeToken, uint256 bribeAmount) {
        return
            IBribeVault(bribeVault).getBribe(
                generateBribeVaultIdentifier(proposal, round, token)
            );
    }

    /**
        @notice Deposit bribe for a proposal (ERC20 tokens only)
        @param  proposal  address  Proposal
        @param  token     address  Token
        @param  amount    uint256  Token amount
     */
    function depositBribeERC20(
        address proposal,
        address token,
        uint256 amount
    ) external {
        uint256 currentRound = _round;
        require(
            proposalDeadlines[proposal] > block.timestamp,
            "Proposal deadline has passed"
        );
        require(token != address(0), "Invalid token");
        require(amount > 0, "Bribe amount must be greater than 0");

        bytes32 bribeIdentifier = generateBribeVaultIdentifier(
            proposal,
            currentRound,
            token
        );
        bytes32 rewardIdentifier = generateRewardIdentifier(
            currentRound,
            token
        );

        IBribeVault(bribeVault).depositBribeERC20(
            bribeIdentifier,
            rewardIdentifier,
            token,
            amount,
            msg.sender
        );

        emit DepositBribe(
            proposal,
            currentRound,
            token,
            amount,
            bribeIdentifier,
            rewardIdentifier
        );
    }

    /**
        @notice Deposit bribe for a proposal (native token only)
        @param  proposal  address  Proposal
     */
    function depositBribe(address proposal) external payable {
        uint256 currentRound = _round;
        require(
            proposalDeadlines[proposal] > block.timestamp,
            "Proposal deadline has passed"
        );
        require(msg.value > 0, "Bribe amount must be greater than 0");

        bytes32 bribeIdentifier = generateBribeVaultIdentifier(
            proposal,
            currentRound,
            bribeVault
        );
        bytes32 rewardIdentifier = generateRewardIdentifier(
            currentRound,
            bribeVault
        );

        IBribeVault(bribeVault).depositBribe{value: msg.value}(
            // NOTE: Native token bribes have bribeVault set as the address
            bribeIdentifier,
            rewardIdentifier,
            msg.sender
        );

        emit DepositBribe(
            proposal,
            currentRound,
            bribeVault,
            msg.value,
            bribeIdentifier,
            rewardIdentifier
        );
    }

    /**
        @notice Voters can opt in or out of reward-forwarding
        @notice Opt-in: A voter sets another address to forward rewards to
        @notice Opt-out: A voter sets their own address or the zero address
        @param  to  address  Account that rewards will be sent to
     */
    function setRewardForwarding(address to) public {
        rewardForwarding[msg.sender] = to;

        emit SetRewardForwarding(msg.sender, to);
    }
}
