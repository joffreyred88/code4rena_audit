// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BTRFLYMock is ERC20("Redacted Cartel", "BTRFLY") {
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
