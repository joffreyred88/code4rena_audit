pragma solidity 0.8.4;
library SafeCast {
    function modUint32(uint256 x) internal pure returns (uint32 y) {
        y = uint32(x % 0x100000000);
    }
    
    function toUint112(uint256 x) internal pure returns (uint112 y) {
        require((y = uint112(x)) == x);
    }

    function toUint128(uint256 x) internal pure returns (uint128 y) {
        require((y = uint128(x)) == x);
    }

    function truncateUint112(uint256 x) internal pure returns (uint112 y) {
        if (x > type(uint112).max) return y = type(uint112).max;
        y = uint112(x);
    }
}
