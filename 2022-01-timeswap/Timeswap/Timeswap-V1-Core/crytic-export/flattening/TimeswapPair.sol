pragma solidity 0.8.4;
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
interface IFactory {
    /* ===== EVENT ===== */

    /// @dev Emits when a new Timeswap Pair contract is created.
    /// @param asset The address of the ERC20 being lent and borrowed.
    /// @param collateral The address of the ERC20 used as collateral.
    /// @param pair The address of the Timeswap Pair contract created.
    event CreatePair(IERC20 indexed asset, IERC20 indexed collateral, IPair pair);

    /// @dev Emits when a new pending owner is set.
    /// @param pendingOwner The address of the new pending owner.
    event SetOwner(address indexed pendingOwner);

    /// @dev Emits when the pending owner has accepted being the new owner.
    /// @param owner The address of the new owner.
    event AcceptOwner(address indexed owner);

    /* ===== VIEW ===== */

    /// @dev Return the address that receives the protocol fee.
    /// @return The address of the owner.
    function owner() external view returns (address);

    /// @dev Return the new pending address to replace the owner.
    /// @return The address of the pending owner.
    function pendingOwner() external view returns (address);

    /// @dev Return the fee earned by liquidity providers.
    /// @return The fee following UQ0.16 format.
    function fee() external view returns (uint16);

    /// @dev Return the protocol fee per second earned by the owner.
    /// @return The protocol fee per seconde following UQ0.40 format.
    function protocolFee() external view returns (uint16);

    /// @dev Returns the address of a deployed pair.
    /// @param asset The address of the ERC20 being lent and borrowed.
    /// @param collateral The address of the ERC20 used as collateral.
    /// @return pair The address of the Timeswap Pair contract.
    function getPair(IERC20 asset, IERC20 collateral) external view returns (IPair pair);

    /* ===== UPDATE ===== */

    /// @dev Creates a Timeswap Pool based on ERC20 pair parameters.
    /// @dev Cannot create a Timeswap Pool with the same pair parameters.
    /// @param asset The address of the ERC20 being lent and borrowed.
    /// @param collateral The address of the ERC20 as the collateral.
    /// @return pair The address of the Timeswap Pair contract.
    function createPair(IERC20 asset, IERC20 collateral) external returns (IPair pair);

    /// @dev Set the pending owner of the factory.
    /// @dev Can only be called by the current owner.
    /// @param _pendingOwner the chosen pending owner.
    function setOwner(address _pendingOwner) external;

    /// @dev Set the pending owner as the owner of the factory.
    /// @dev Can only be called by the pending owner.
    function acceptOwner() external;
}
interface IPair {
    /* ===== STRUCT ===== */

    struct Tokens {
        uint128 asset;
        uint128 collateral;
    }

    struct Claims {
        uint128 bond;
        uint128 insurance;
    }

    struct Due {
        uint112 debt;
        uint112 collateral;
        uint32 startBlock;
    }

    struct State {
        Tokens reserves;
        uint256 totalLiquidity;
        Claims totalClaims;
        uint120 totalDebtCreated;
        uint112 x;
        uint112 y;
        uint112 z;
    }

    struct Pool {
        State state;
        mapping(address => uint256) liquidities;
        mapping(address => Claims) claims;
        mapping(address => Due[]) dues;
    }

    /* ===== EVENT ===== */

    /// @dev Emits when the state gets updated.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param x The new x state of the pool.
    /// @param y The new y state of the pool.
    /// @param z The new z state of the pool.
    event Sync(uint256 indexed maturity, uint112 x, uint112 y, uint112 z);

    /// @dev Emits when mint function is called.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param sender The address of the caller.
    /// @param liquidityTo The address of the receiver of liquidity balance.
    /// @param dueTo The address of the receiver of collateralized debt balance.
    /// @param xIncrease The increase in the X state.
    /// @param liquidityOut The amount of liquidity balance received by liquidityTo.
    /// @param id The array index of the collateralized debt received by dueTo.
    /// @param dueOut The collateralized debt received by dueTo.
    event Mint(
        uint256 maturity,
        address indexed sender,
        address indexed liquidityTo,
        address indexed dueTo,
        uint112 xIncrease,
        uint256 liquidityOut,
        uint256 id,
        Due dueOut
    );

    /// @dev Emits when burn function is called.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param sender The address of the caller.
    /// @param assetTo The address of the receiver of asset ERC20.
    /// @param collateralTo The addres of the receiver of collateral ERC20.
    /// @param liquidityIn The amount of liquidity balance burnt by the sender.
    /// @param tokensOut The amount of asset ERC20 and collateral ERC20 received.
    event Burn(
        uint256 maturity,
        address indexed sender,
        address indexed assetTo,
        address indexed collateralTo,
        uint256 liquidityIn,
        Tokens tokensOut
    );

    /// @dev Emits when lend function is called.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param sender The address of the caller.
    /// @param bondTo The address of the receiver of bond balance.
    /// @param insuranceTo The addres of the receiver of insurance balance.
    /// @param xIncrease The increase in X state.
    /// @param claimsOut The amount of bond balance and insurance balance received.
    event Lend(
        uint256 maturity,
        address indexed sender,
        address indexed bondTo,
        address indexed insuranceTo,
        uint112 xIncrease,
        Claims claimsOut
    );

    /// @dev Emits when withdraw function is called.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param sender The address of the caller.
    /// @param assetTo The address of the receiver of asset ERC20.
    /// @param collateralTo The address of the receiver of collateral ERC20.
    /// @param claimsIn The amount of bond balance and insurance balance burnt by the sender.
    /// @param tokensOut The amount of asset ERC20 and collateral ERC20 received.
    event Withdraw(
        uint256 maturity,
        address indexed sender,
        address indexed assetTo,
        address indexed collateralTo,
        Claims claimsIn,
        Tokens tokensOut
    );

    /// @dev Emits when borrow function is called.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param sender The address of the caller.
    /// @param assetTo The address of the receiver of asset ERC20.
    /// @param dueTo The address of the receiver of collateralized debt.
    /// @param xDecrease The amount of asset ERC20 received by assetTo.
    /// @param id The array index of the collateralized debt received by dueTo.
    /// @param dueOut The collateralized debt received by dueTo.
    event Borrow(
        uint256 maturity,
        address indexed sender,
        address indexed assetTo,
        address indexed dueTo,
        uint112 xDecrease,
        uint256 id,
        Due dueOut
    );

    /// @dev Emits when pay function is called.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param sender The address of the caller.
    /// @param to The address of the receiver of collateral ERC20.
    /// @param owner The address of the owner of collateralized debt.
    /// @param ids The array indexes of collateralized debts.
    /// @param assetsIn The amount of asset ERC20 paid per collateralized debts.
    /// @param collateralsOut The amount of collateral ERC20 withdrawn per collaterelized debts.
    /// @param assetIn The total amount of asset ERC20 paid.
    /// @param collateralOut The total amount of collateral ERC20 received.
    event Pay(
        uint256 maturity,
        address indexed sender,
        address indexed to,
        address indexed owner,
        uint256[] ids,
        uint112[] assetsIn,
        uint112[] collateralsOut,
        uint128 assetIn,
        uint128 collateralOut
    );

    /* ===== VIEW ===== */

    /// @dev Return the address of the factory contract that deployed this contract.
    /// @return The address of the factory contract.
    function factory() external view returns (IFactory);

    /// @dev Return the address of the ERC20 being lent and borrowed.
    /// @return The address of the asset ERC20.
    function asset() external view returns (IERC20);

    /// @dev Return the address of the ERC20 as collateral.
    /// @return The address of the collateral ERC20.
    function collateral() external view returns (IERC20);

    //// @dev Return the fee earned by liquidity providers.
    //// @return The transaction fee following the UQ0.16 format.
    function fee() external view returns (uint16);

    /// @dev Return the protocol fee per second earned by the owner.
    /// @return The protocol fee per second following the UQ0.40 format.
    function protocolFee() external view returns (uint16);

    /// @dev Returns the Constant Product state of a Pool.
    /// @dev The Y state follows the UQ80.32 format.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @return x The x state.
    /// @return y The y state.
    /// @return z The z state.
    function constantProduct(uint256 maturity)
        external
        view
        returns (
            uint112 x,
            uint112 y,
            uint112 z
        );

    /// @dev Returns the asset ERC20 and collateral ERC20 balances of a Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @return The asset ERC20 and collateral ERC20 locked.
    function totalReserves(uint256 maturity) external view returns (Tokens memory);

    /// @dev Returns the total liquidity supply of a Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @return The total liquidity supply.
    function totalLiquidity(uint256 maturity) external view returns (uint256);

    /// @dev Returns the liquidity balance of a user in a Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param owner The address of the user.
    /// @return The liquidity balance.
    function liquidityOf(uint256 maturity, address owner) external view returns (uint256);

    /// @dev Returns the total claims of a Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @return The total claims.
    function totalClaims(uint256 maturity) external view returns (Claims memory);

    /// @dev Returms the claims of a user in a Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param owner The address of the user.
    /// @return The claims balance.
    function claimsOf(uint256 maturity, address owner) external view returns (Claims memory);

    /// @dev Returns the total debt created.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @return The total asset ERC20 debt created.
    function totalDebtCreated(uint256 maturity) external view returns (uint120);

    /// @dev Returns a collateralized debt of a user in a Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param owner The address of the user.
    /// @param id The index of the collateralized debt
    /// @return The collateralized debt balance.
    function dueOf(uint256 maturity, address owner, uint256 id) external view returns (Due memory);

    /* ===== UPDATE ===== */

    /// @dev Add liquidity into a Pool by a liquidity provider.
    /// @dev Liquidity providers can be thought as making both lending and borrowing positions.
    /// @dev Must be called by a contract implementing the ITimeswapMintCallback interface.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param liquidityTo The address of the receiver of liquidity balance.
    /// @param dueTo The addres of the receiver of collateralized debt balance.
    /// @param xIncrease The increase in the X state.
    /// @param yIncrease The increase in the Y state.
    /// @param zIncrease The increase in the Z state.
    /// @param data The data for callback.
    /// @return liquidityOut The amount of liquidity balance received by liquidityTo.
    /// @return id The array index of the collateralized debt received by dueTo.
    /// @return dueOut The collateralized debt received by dueTo.
    function mint(
        uint256 maturity,
        address liquidityTo,
        address dueTo,
        uint112 xIncrease,
        uint112 yIncrease,
        uint112 zIncrease,
        bytes calldata data
    )
        external
        returns (
            uint256 liquidityOut,
            uint256 id,
            Due memory dueOut
        );

    /// @dev Remove liquidity from a Pool by a liquidity provider.
    /// @dev Can only be called after the maturity of the Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param assetTo The address of the receiver of asset ERC20.
    /// @param collateralTo The addres of the receiver of collateral ERC20.
    /// @param liquidityIn The amount of liquidity balance burnt by the msg.sender.
    /// @return tokensOut The amount of asset ERC20 and collateral ERC20 received.
    function burn(
        uint256 maturity,
        address assetTo,
        address collateralTo,
        uint256 liquidityIn
    ) external returns (Tokens memory tokensOut);

    /// @dev Lend asset ERC20 into the Pool.
    /// @dev Must be called by a contract implementing the ITimeswapLendCallback interface.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param bondTo The address of the receiver of bond balance.
    /// @param insuranceTo The addres of the receiver of insurance balance.
    /// @param xIncrease The increase in x state and the amount of asset ERC20 sent.
    /// @param yDecrease The decrease in y state.
    /// @param zDecrease The decrease in z state.
    /// @param data The data for callback.
    /// @return claimsOut The amount of bond balance and insurance balance received.
    function lend(
        uint256 maturity,
        address bondTo,
        address insuranceTo,
        uint112 xIncrease,
        uint112 yDecrease,
        uint112 zDecrease,
        bytes calldata data
    ) external returns (Claims memory claimsOut);

    /// @dev Withdraw asset ERC20 and/or collateral ERC20 for lenders.
    /// @dev Can only be called after the maturity of the Pool.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param assetTo The address of the receiver of asset ERC20.
    /// @param collateralTo The addres of the receiver of collateral ERC20.
    /// @param claimsIn The amount of bond balance and insurance balance burnt by the msg.sender.
    /// @return tokensOut The amount of asset ERC20 and collateral ERC20 received.
    function withdraw(
        uint256 maturity,
        address assetTo,
        address collateralTo,
        Claims memory claimsIn
    ) external returns (Tokens memory tokensOut);

    /// @dev Borrow asset ERC20 from the Pool.
    /// @dev Must be called by a contract implementing the ITimeswapBorrowCallback interface.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param assetTo The address of the receiver of asset ERC20.
    /// @param dueTo The addres of the receiver of collateralized debt.
    /// @param xDecrease The dcrease in x state and amount of asset ERC20 received by assetTo.
    /// @param yIncrease The increase in y state.
    /// @param zIncrease The increase in z state.
    /// @param data The data for callback.
    /// @return id The array index of the collateralized debt received by dueTo.
    /// @return dueOut The collateralized debt received by dueTo.
    function borrow(
        uint256 maturity,
        address assetTo,
        address dueTo,
        uint112 xDecrease,
        uint112 yIncrease,
        uint112 zIncrease,
        bytes calldata data
    ) external returns (uint256 id, Due memory dueOut);

    /// @dev Pay asset ERC20 into the Pool to repay debt for borrowers.
    /// @dev If there are asset paid, must be called by a contract implementing the ITimeswapPayCallback interface.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param to The address of the receiver of collateral ERC20.
    /// @param owner The addres of the owner of collateralized debt.
    /// @param ids The array indexes of collateralized debts.
    /// @param assetsIn The amount of asset ERC20 paid per collateralized debts.
    /// @param collateralsOut The amount of collateral ERC20 withdrawn per collaterlaized debts.
    /// @param data The data for callback.
    /// @return assetIn The total amount of asset ERC20 paid.
    /// @return collateralOut The total amount of collateral ERC20 received.
    function pay(
        uint256 maturity,
        address to,
        address owner,
        uint256[] memory ids,
        uint112[] memory assetsIn,
        uint112[] memory collateralsOut,
        bytes calldata data
    ) external returns (uint128 assetIn, uint128 collateralOut);
}
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}
library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}
library SafeTransfer {
    using SafeERC20 for IERC20;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        token.safeTransfer(address(to), amount);
    }
}
library FullMath {
    function mul512(uint256 a, uint256 b) internal pure returns (uint256 prod0, uint256 prod1) {
        // 512-bit multiply [prod1 prod0] = a * b
        // Compute the product mod 2**256 and mod 2**256 - 1
        // then use the Chinese Remainder Theorem to reconstruct
        // the 512 bit result. The result is stored in two 256
        // variables such that product = prod1 * 2**256 + prod0
        assembly {
            let mm := mulmod(a, b, not(0))
            prod0 := mul(a, b)
            prod1 := sub(sub(mm, prod0), lt(mm, prod0))
        }
    }
    
    /// @notice Calculates floor(a×b÷denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
    /// @param a The multiplicand
    /// @param b The multiplier
    /// @param denominator The divisor
    /// @return result The 256-bit result
    /// @dev Credit to Remco Bloemen under MIT license https://xn--2-umb.com/21/muldiv
    function mulDiv(
        uint256 a,
        uint256 b,
        uint256 denominator
    ) internal pure returns (uint256 result) {
        unchecked {
            (uint256 prod0, uint256 prod1) = mul512(a, b);

            // Handle non-overflow cases, 256 by 256 division
            if (prod1 == 0) {
                require(denominator > 0);
                assembly {
                    result := div(prod0, denominator)
                }
                return result;
            }

            // Make sure the result is less than 2**256.
            // Also prevents denominator == 0
            require(denominator > prod1);

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0]
            // Compute remainder using mulmod
            uint256 remainder;
            assembly {
                remainder := mulmod(a, b, denominator)
            }
            // Subtract 256 bit number from 512 bit number
            assembly {
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator
            // Compute largest power of two divisor of denominator.
            // Always >= 1.
            uint256 twos;
            twos = (0 - denominator) & denominator;
            // Divide denominator by power of two
            assembly {
                denominator := div(denominator, twos)
            }

            // Divide [prod1 prod0] by the factors of two
            assembly {
                prod0 := div(prod0, twos)
            }
            // Shift in bits from prod1 into prod0. For this we need
            // to flip `twos` such that it is 2**256 / twos.
            // If twos is zero, then it becomes one
            assembly {
                twos := add(div(sub(0, twos), twos), 1)
            }
            prod0 |= prod1 * twos;    

            // Invert denominator mod 2**256
            // Now that denominator is an odd number, it has an inverse
            // modulo 2**256 such that denominator * inv = 1 mod 2**256.
            // Compute the inverse by starting with a seed that is correct
            // correct for four bits. That is, denominator * inv = 1 mod 2**4
            uint256 inv;
            inv = (3 * denominator) ^ 2;

            // Now use Newton-Raphson iteration to improve the precision.
            // Thanks to Hensel's lifting lemma, this also works in modular
            // arithmetic, doubling the correct bits in each step.
            inv *= 2 - denominator * inv; // inverse mod 2**8
            inv *= 2 - denominator * inv; // inverse mod 2**16
            inv *= 2 - denominator * inv; // inverse mod 2**32
            inv *= 2 - denominator * inv; // inverse mod 2**64
            inv *= 2 - denominator * inv; // inverse mod 2**128
            inv *= 2 - denominator * inv; // inverse mod 2**256

            // Because the division is now exact we can divide by multiplying
            // with the modular inverse of denominator. This will give us the
            // correct result modulo 2**256. Since the precoditions guarantee
            // that the outcome is less than 2**256, this is the final result.
            // We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inv;

            return result;
        }
    }

    /// @notice Calculates ceil(a×b÷denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
    /// @param a The multiplicand
    /// @param b The multiplier
    /// @param denominator The divisor
    /// @return result The 256-bit result
    function mulDivUp(
        uint256 a,
        uint256 b,
        uint256 denominator
    ) internal pure returns (uint256 result) {
        result = mulDiv(a, b, denominator);
        if (mulmod(a, b, denominator) > 0) result++;
    }
}
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
library Math {
    function divUp(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x / y;
        if (x % y > 0) z++;
    }

    function shiftRightUp(uint256 x, uint8 y) internal pure returns (uint256 z) {
        z = x >> y;
        if (x != z << y) z++;
    }

}
library BurnMath {
    using FullMath for uint256;
    using Math for uint256;
    using SafeCast for uint256;

    /// @dev Get the asset for the liquidity burned.
    /// @param state The pool state.
    /// @param liquidityIn The amount of liquidity balance burnt by the msg.sender.
    function getAsset(IPair.State memory state, uint256 liquidityIn) internal pure returns (uint128 assetOut) {
        if (state.reserves.asset <= state.totalClaims.bond) return assetOut;
        uint256 _assetOut = state.reserves.asset;
        _assetOut -= state.totalClaims.bond;
        _assetOut = _assetOut.mulDiv(liquidityIn, state.totalLiquidity);
        assetOut = _assetOut.toUint128();
    }

    /// @dev Get the collateral for the liquidity burned.
    /// @param state The pool state.
    /// @param liquidityIn The amount of liquidity balance burnt by the msg.sender.
    function getCollateral(IPair.State memory state, uint256 liquidityIn)
        internal
        pure
        returns (uint128 collateralOut)
    {
        uint256 _collateralOut = state.reserves.collateral;
        if (state.reserves.asset >= state.totalClaims.bond) {
            _collateralOut = _collateralOut.mulDiv(liquidityIn, state.totalLiquidity);
            return collateralOut = _collateralOut.toUint128();
        }
        uint256 deficit = state.totalClaims.bond;
        deficit -= state.reserves.asset;
        if (uint256(state.reserves.collateral) * state.totalClaims.bond <= deficit * state.totalClaims.insurance) return collateralOut;
        uint256 subtrahend = deficit;
        subtrahend *= state.totalClaims.insurance;
        subtrahend = subtrahend.divUp(state.totalClaims.bond);
        _collateralOut -= subtrahend;
        _collateralOut = _collateralOut.mulDiv(liquidityIn, state.totalLiquidity);
        collateralOut = _collateralOut.toUint128();
    }
}
interface ITimeswapBorrowCallback {
    /// @notice Called to `msg.sender` after initiating a borrow from ITimeswapPair#borrow.
    /// @dev In the implementation you must pay the collateral token owed for the borrow transaction.
    /// The caller of this method must be checked to be a TimeswapPair deployed by the canonical TimeswapFactory.
    /// @param collateralIn The amount of asset tokens owed due to the pool for the borrow transaction
    /// @param data Any data passed through by the caller via the ITimeswapPair#borrow call
    function timeswapBorrowCallback(
        uint112 collateralIn,
        bytes calldata data
    ) external;
}
library ConstantProduct {
    using FullMath for uint256;

    function checkConstantProduct(
        IPair.State memory state,
        uint112 xReserve,
        uint128 yAdjusted,
        uint128 zAdjusted
    ) internal pure {
        (uint256 prod0, uint256 prod1) = (uint256(yAdjusted) * zAdjusted).mul512(xReserve);
        (uint256 _prod0, uint256 _prod1) = ((uint256(state.y) * state.z) << 32).mul512(state.x);

        require(prod1 >= _prod1, 'E301');
        if (prod1 == _prod1) require(prod0 >= _prod0, 'E301');
    }
}
interface ITimeswapLendCallback {
    /// @notice Called to `msg.sender` after initiating a lend from ITimeswapPair#lend.
    /// @dev In the implementation you must pay the asset token owed for the lend transaction.
    /// The caller of this method must be checked to be a TimeswapPair deployed by the canonical TimeswapFactory.
    /// @param assetIn The amount of asset tokens owed due to the pool for the lend transaction
    /// @param data Any data passed through by the caller via the ITimeswapPair#lend call
    function timeswapLendCallback(
        uint112 assetIn,
        bytes calldata data
    ) external;
}
library WithdrawMath {
    using SafeCast for uint256;

    /// @dev Get the asset for the liquidity burned.
    /// @param state The pool state.
    /// @param bondIn The amount of bond balance balance burnt by the msg.sender.
    function getAsset(IPair.State memory state, uint128 bondIn) internal pure returns (uint128 assetOut) {
        if (state.reserves.asset >= state.totalClaims.bond) return assetOut = bondIn;
        uint256 _assetOut = bondIn;
        _assetOut *= state.reserves.asset;
        _assetOut /= state.totalClaims.bond;
        assetOut = _assetOut.toUint128();
    }

    /// @dev Get the collateral for the liquidity burned.
    /// @param state The pool state.
    /// @param insuranceIn The amount of insurance balance burnt by the msg.sender.
    function getCollateral(IPair.State memory state, uint128 insuranceIn)
        internal
        pure
        returns (uint128 collateralOut)
    {
        if (state.reserves.asset >= state.totalClaims.bond) return collateralOut;
        uint256 deficit = state.totalClaims.bond;
        deficit -= state.reserves.asset;
        if (uint256(state.reserves.collateral) * state.totalClaims.bond >= deficit * state.totalClaims.insurance) {
            uint256 _collateralOut = deficit;
            _collateralOut *= insuranceIn;
            _collateralOut /= state.totalClaims.bond;
            return collateralOut = _collateralOut.toUint128();
        }
        uint256 __collateralOut = state.reserves.collateral;
        __collateralOut *= insuranceIn;
        __collateralOut /= state.totalClaims.insurance;
        collateralOut = __collateralOut.toUint128();
    }
}
interface ITimeswapMintCallback {
    /// @notice Called to `msg.sender` after initiating a mint from ITimeswapPair#mint.
    /// @dev In the implementation you must pay the asset token and collateral token owed for the mint transaction.
    /// The caller of this method must be checked to be a TimeswapPair deployed by the canonical TimeswapFactory.
    /// @param assetIn The amount of asset tokens owed due to the pool for the mint transaction.
    /// @param collateralIn The amount of collateral tokens owed due to the pool for the min transaction.
    /// @param data Any data passed through by the caller via the ITimeswapPair#mint call
    function timeswapMintCallback(
        uint112 assetIn,
        uint112 collateralIn,
        bytes calldata data
    ) external;
}
interface ITimeswapPayCallback {
    /// @notice Called to `msg.sender` after initiating a pay from ITimeswapPair#pay.
    /// @dev In the implementation you must pay the asset token owed for the pay transaction.
    /// The caller of this method must be checked to be a TimeswapPair deployed by the canonical TimeswapFactory.
    /// @param assetIn The amount of asset tokens owed due to the pool for the pay transaction
    /// @param data Any data passed through by the caller via the ITimeswapPair#pay call
    function timeswapPayCallback(
        uint128 assetIn,
        bytes calldata data
    ) external;
}
library Array {
    function insert(IPair.Due[] storage dues, IPair.Due memory dueOut) internal returns (uint256 id) {
        id = dues.length;   
        
        dues.push(dueOut);
        
    }
}
library MintMath {
    using Math for uint256;
    using FullMath for uint256;
    using SafeCast for uint256;

    /// @dev Get the total liquidity.
    /// @dev Use this if the total liquidity in the pool is 0.
    /// @param xIncrease The increase in the X state.
    function getLiquidityTotal(uint112 xIncrease) internal pure returns (uint256 liquidityTotal) {
        liquidityTotal = xIncrease;
        liquidityTotal <<= 16;
    }

    /// @dev Get the total liquidity.
    /// @param xIncrease The increase in the X state.
    /// @param yIncrease The increase in the Y state.
    /// @param zIncrease The increase in the Z state.
    function getLiquidityTotal(
        IPair.State memory state,
        uint112 xIncrease,
        uint112 yIncrease,
        uint112 zIncrease
    ) internal pure returns (uint256 liquidityTotal) {
        liquidityTotal = min(
            state.totalLiquidity.mulDiv(xIncrease, state.x),
            state.totalLiquidity.mulDiv(yIncrease, state.y),
            state.totalLiquidity.mulDiv(zIncrease, state.z)
        );
    }

    /// @dev Get the total liquidity factoring in the protocolFee.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param liquidityTotal The total liquidity without the protocolFee.
    /// @param protocolFee The chosen protocol fee rate.
    function getLiquidity(
        uint256 maturity,
        uint256 liquidityTotal,
        uint16 protocolFee
    ) internal view returns (uint256 liquidityOut) {
        uint256 denominator = maturity;
        denominator -= block.timestamp;
        denominator *= protocolFee;
        denominator += 0x10000000000;
        liquidityOut = liquidityTotal.mulDiv(0x10000000000, denominator);
    }

    /// @dev Get the minimum of 3 numbers
    function min(
        uint256 x,
        uint256 y,
        uint256 z
    ) private pure returns (uint256 w) {
        if (x <= y && x <= z) {
            w = x;
        } else if (y <= x && y <= z) {
            w = y;
        } else {
            w = z;
        }
    }

    /// @dev Get the debt that the lp has to pay back.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param xIncrease The increase in the X state.
    /// @param yIncrease The increase in the Y state.
    function getDebt(
        uint256 maturity,
        uint112 xIncrease,
        uint112 yIncrease
    ) internal view returns (uint112 debtIn) {
        uint256 _debtIn = maturity;
        _debtIn -= block.timestamp;
        _debtIn *= yIncrease;
        _debtIn = _debtIn.shiftRightUp(32);
        _debtIn += xIncrease;
        debtIn = _debtIn.toUint112();
    }

    /// @dev Get the collateral that the lp has locked.
    /// @param maturity The unix timestamp maturity of the Pool.
    /// @param zIncrease The increase in the Z state.
    function getCollateral(
        uint256 maturity,
        uint112 zIncrease
    ) internal view returns (uint112 collateralIn) {
        uint256 _collateralIn = maturity;
        _collateralIn -= block.timestamp; 
        _collateralIn *= zIncrease;
        _collateralIn = _collateralIn.shiftRightUp(25); 
        _collateralIn += zIncrease; 
        collateralIn = _collateralIn.toUint112();
    }
}
library LendMath {
    using FullMath for uint256;
    using ConstantProduct for IPair.State;
    using SafeCast for uint256;

    function check(
        IPair.State memory state,
        uint112 xIncrease,
        uint112 yDecrease,
        uint112 zDecrease,
        uint16 fee
    ) internal pure {
        uint128 feeBase = 0x10000 + fee;
        uint112 xReserve = state.x + xIncrease;
        uint128 yAdjusted = adjust(state.y, yDecrease, feeBase);
        uint128 zAdjusted = adjust(state.z, zDecrease, feeBase);
        state.checkConstantProduct(xReserve, yAdjusted, zAdjusted);

        uint256 minimum = xIncrease;
        minimum *= state.y;
        minimum <<= 12;
        uint256 denominator = xReserve;
        denominator *= feeBase;
        minimum /= denominator;
        require(yDecrease >= minimum, 'E302');
    }

    function adjust(
        uint112 reserve,
        uint112 decrease,
        uint128 feeBase
    ) private pure returns (uint128 adjusted) {
        adjusted = reserve;
        adjusted <<= 16;
        adjusted -= feeBase * decrease;
    }

    function getBond(
        uint256 maturity,
        uint112 xIncrease,
        uint112 yDecrease
    ) internal view returns (uint128 bondOut) {
        uint256 _bondOut = maturity;
        _bondOut -= block.timestamp;
        _bondOut *= yDecrease;
        _bondOut >>= 32;
        _bondOut += xIncrease;
        bondOut = _bondOut.toUint128();
    }

    function getInsurance(
        uint256 maturity,
        IPair.State memory state,
        uint112 xIncrease,
        uint112 zDecrease
    ) internal view returns (uint128 insuranceOut) {
        uint256 _insuranceOut = maturity;
        _insuranceOut -= block.timestamp;
        _insuranceOut *= zDecrease;
        _insuranceOut >>= 25;
        uint256 minimum = state.z;
        minimum *= xIncrease;
        uint256 denominator = state.x;
        denominator += xIncrease;
        minimum /= denominator;
        _insuranceOut += minimum;
        insuranceOut = _insuranceOut.toUint128();
    }
}
library BorrowMath {
    using Math for uint256;
    using FullMath for uint256;
    using ConstantProduct for IPair.State;
    using SafeCast for uint256;

    function check(
        IPair.State memory state,
        uint112 xDecrease,
        uint112 yIncrease,
        uint112 zIncrease,
        uint16 fee
    ) internal pure {
        uint128 feeBase = 0x10000 - fee;
        uint112 xReserve = state.x - xDecrease;
        uint128 yAdjusted = adjust(state.y, yIncrease, feeBase);
        uint128 zAdjusted = adjust(state.z, zIncrease, feeBase);
        state.checkConstantProduct(xReserve, yAdjusted, zAdjusted);

        uint256 minimum = xDecrease;
        minimum *= state.y;
        minimum <<= 12;
        uint256 denominator = xReserve;
        denominator *= feeBase;
        minimum = minimum.divUp(denominator);
        require(yIncrease >= minimum, 'E302');
    }

    function adjust(
        uint112 reserve,
        uint112 increase,
        uint128 feeBase
    ) private pure returns (uint128 adjusted) {
        adjusted = reserve;
        adjusted <<= 16;
        adjusted += feeBase * increase;
    }

    function getDebt(
        uint256 maturity,
        uint112 xDecrease,
        uint112 yIncrease
    ) internal view returns (uint112 debtIn) {
        uint256 _debtIn = maturity;
        _debtIn -= block.timestamp;
        _debtIn *= yIncrease;
        _debtIn = _debtIn.shiftRightUp(32);
        _debtIn += xDecrease;
        debtIn = _debtIn.toUint112();
    }

    function getCollateral(
        uint256 maturity,
        IPair.State memory state,
        uint112 xDecrease,
        uint112 zIncrease
    ) internal view returns (uint112 collateralIn) {
        uint256 _collateralIn = maturity;
        _collateralIn -= block.timestamp;
        _collateralIn *= zIncrease;
        _collateralIn = _collateralIn.shiftRightUp(25);
        uint256 minimum = state.z;
        minimum *= xDecrease;
        uint256 denominator = state.x;
        denominator -= xDecrease;
        minimum = minimum.divUp(denominator);
        _collateralIn += minimum;
        collateralIn = _collateralIn.toUint112();
    }
}
library BlockNumber {
    using SafeCast for uint256;

    function get() internal view returns (uint32 blockNumber) {
        blockNumber = block.number.modUint32();
    }
}
library SafeBalance {
    using Address for address;

    function safeBalance(
        IERC20 token
    ) internal view returns (uint256) {
        bytes memory data =
            address(token).functionStaticCall(
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(this)),
                "balanceOf Call to IERC20 token not successful"
            );
        return abi.decode(data, (uint256));
    }
}
library Callback {
    using SafeBalance for IERC20;
    using SafeCast for uint256;

    function mint(
        IERC20 asset,
        IERC20 collateral,
        uint112 assetIn,
        uint112 collateralIn,
        bytes calldata data
    ) internal {
        uint256 assetReserve = asset.safeBalance();
        uint256 collateralReserve = collateral.safeBalance();
        ITimeswapMintCallback(msg.sender).timeswapMintCallback(assetIn, collateralIn, data);
        uint256 _assetReserve = asset.safeBalance();
        uint256 _collateralReserve = collateral.safeBalance();
        require(_assetReserve >= assetReserve + assetIn, 'E304');
        require(_collateralReserve >= collateralReserve + collateralIn, 'E305');
    }

    function lend(
        IERC20 asset,
        uint112 assetIn,
        bytes calldata data
    ) internal {
        uint256 assetReserve = asset.safeBalance();
        ITimeswapLendCallback(msg.sender).timeswapLendCallback(assetIn, data);
        uint256 _assetReserve = asset.safeBalance();
        require(_assetReserve >= assetReserve + assetIn, 'E304');
    }

    function borrow(
        IERC20 collateral,
        uint112 collateralIn,
        bytes calldata data
    ) internal {
        uint256 collateralReserve = collateral.safeBalance();
        ITimeswapBorrowCallback(msg.sender).timeswapBorrowCallback(collateralIn, data);
        uint256 _collateralReserve = collateral.safeBalance();
        require(_collateralReserve >= collateralReserve + collateralIn, 'E305');
    }
    
    function pay(
        IERC20 asset,
        uint128 assetIn,
        bytes calldata data
    ) internal {
        uint256 assetReserve = asset.safeBalance();
        ITimeswapPayCallback(msg.sender).timeswapPayCallback(assetIn, data);
        uint256 _assetReserve = asset.safeBalance();
        require(_assetReserve >= assetReserve + assetIn, 'E304');
    }
}
library PayMath {
    function checkProportional(
        uint112 assetIn,
        uint112 collateralOut,
        IPair.Due memory due
    ) internal pure {
        require(uint256(assetIn) * due.collateral >= uint256(collateralOut) * due.debt, 'E303');
    }
}
contract TimeswapPair is IPair {
    using SafeTransfer for IERC20;
    using Array for Due[];

    /* ===== MODEL ===== */

    /// @inheritdoc IPair
    IFactory public immutable override factory;
    /// @inheritdoc IPair
    IERC20 public immutable override asset;
    /// @inheritdoc IPair
    IERC20 public immutable override collateral;
    /// @inheritdoc IPair
    uint16 public immutable override fee;
    /// @inheritdoc IPair
    uint16 public immutable override protocolFee;

    /// @dev Stores the individual states of each Pool.
    mapping(uint256 => Pool) private pools;

    /// @dev Stores the access state for reentrancy guard.
    uint256 private locked;

    /* ===== VIEW =====*/

    /// @inheritdoc IPair
    function constantProduct(uint256 maturity)
        external
        view
        override
        returns (
            uint112 x,
            uint112 y,
            uint112 z
        )
    {
        State memory state = pools[maturity].state;
        return (state.x, state.y, state.z);
    }

    /// @inheritdoc IPair
    function totalReserves(uint256 maturity) external view override returns (Tokens memory) {
        return pools[maturity].state.reserves;
    }

    /// @inheritdoc IPair
    function totalLiquidity(uint256 maturity) external view override returns (uint256) {
        return pools[maturity].state.totalLiquidity;
    }

    /// @inheritdoc IPair
    function liquidityOf(uint256 maturity, address owner) external view override returns (uint256) {
        return pools[maturity].liquidities[owner];
    }

    /// @inheritdoc IPair
    function totalClaims(uint256 maturity) external view override returns (Claims memory) {
        return pools[maturity].state.totalClaims;
    }

    /// @inheritdoc IPair
    function claimsOf(uint256 maturity, address owner) external view override returns (Claims memory) {
        return pools[maturity].claims[owner];
    }

    /// @inheritdoc IPair
    function totalDebtCreated(uint256 maturity) external view override returns (uint120) {
        return pools[maturity].state.totalDebtCreated;
    }

    /// @inheritdoc IPair
    function dueOf(uint256 maturity, address owner, uint256 id) external view override returns (Due memory) {
        return pools[maturity].dues[owner][id];
    }

    /* ===== INIT ===== */

    /// @dev Initializes the Pair contract.
    /// @dev Called by the Timeswap factory contract.
    /// @param _asset The address of the ERC20 being lent and borrowed.
    /// @param _collateral The address of the ERC20 as the collateral.
    /// @param _fee The chosen fee rate.
    /// @param _protocolFee The chosen protocol fee rate.
    constructor(
        IERC20 _asset,
        IERC20 _collateral,
        uint16 _fee,
        uint16 _protocolFee
    ) {
        factory = IFactory(msg.sender);
        asset = _asset;
        collateral = _collateral;
        fee = _fee;
        protocolFee = _protocolFee;
    }

    /* ===== MODIFIER ===== */

    /// @dev The modifier for reentrancy guard.
    modifier lock() {
        require(locked == 0, 'E211');
        locked = 1;
        _;
        locked = 0;
    }

    /* ===== UPDATE ===== */

    /// @inheritdoc IPair
    function mint(
        uint256 maturity,
        address liquidityTo,
        address dueTo,
        uint112 xIncrease,
        uint112 yIncrease,
        uint112 zIncrease,
        bytes calldata data
    )
        external
        override
        lock
        returns (
            uint256 liquidityOut,
            uint256 id,
            Due memory dueOut
        )
    {
        require(block.timestamp < maturity, 'E202');
        require(maturity - block.timestamp < 0x100000000, 'E208');
        require(liquidityTo != address(0) && dueTo != address(0), 'E201');
        require(liquidityTo != address(this) && dueTo != address(this), 'E204');
        require(xIncrease > 0 && yIncrease > 0 && zIncrease > 0, 'E205');
        
        Pool storage pool = pools[maturity];

        if (pool.state.totalLiquidity == 0) {
            uint256 liquidityTotal = MintMath.getLiquidityTotal(xIncrease);
            liquidityOut = MintMath.getLiquidity(maturity, liquidityTotal, protocolFee);

            pool.state.totalLiquidity += liquidityTotal;
            pool.liquidities[factory.owner()] += liquidityTotal - liquidityOut;
        } else {
            uint256 liquidityTotal = MintMath.getLiquidityTotal(pool.state, xIncrease, yIncrease, zIncrease);
            liquidityOut = MintMath.getLiquidity(maturity, liquidityTotal, protocolFee);

            pool.state.totalLiquidity += liquidityTotal;
            pool.liquidities[factory.owner()] += liquidityTotal - liquidityOut;
        }
        require(liquidityOut > 0, 'E212');
        pool.liquidities[liquidityTo] += liquidityOut;

        dueOut.debt = MintMath.getDebt(maturity, xIncrease, yIncrease);
        dueOut.collateral = MintMath.getCollateral(maturity, zIncrease);
        dueOut.startBlock = BlockNumber.get();

        Callback.mint(asset, collateral, xIncrease, dueOut.collateral, data);

        id = pool.dues[dueTo].insert(dueOut);

        pool.state.reserves.asset += xIncrease;
        pool.state.reserves.collateral += dueOut.collateral;
        pool.state.totalDebtCreated += dueOut.debt;

        pool.state.x += xIncrease;
        pool.state.y += yIncrease;
        pool.state.z += zIncrease;

        emit Sync(maturity, pool.state.x, pool.state.y, pool.state.z);
        emit Mint(maturity, msg.sender, liquidityTo, dueTo, xIncrease, liquidityOut, id, dueOut);
    }

    /// @inheritdoc IPair
    function burn(
        uint256 maturity,
        address assetTo,
        address collateralTo,
        uint256 liquidityIn
    ) external override lock returns (Tokens memory tokensOut) {
        require(block.timestamp >= maturity, 'E203');
        require(assetTo != address(0) && collateralTo != address(0), 'E201');
        require(assetTo != address(this) && collateralTo != address(this), 'E204');
        require(liquidityIn > 0, 'E205');

        Pool storage pool = pools[maturity];

        tokensOut.asset = BurnMath.getAsset(pool.state, liquidityIn);
        tokensOut.collateral = BurnMath.getCollateral(pool.state, liquidityIn);

        pool.state.totalLiquidity -= liquidityIn;

        pool.liquidities[msg.sender] -= liquidityIn;

        pool.state.reserves.asset -= tokensOut.asset;
        pool.state.reserves.collateral -= tokensOut.collateral;

        if (tokensOut.asset > 0) asset.safeTransfer(assetTo, tokensOut.asset);
        if (tokensOut.collateral > 0) collateral.safeTransfer(collateralTo, tokensOut.collateral);

        emit Burn(maturity, msg.sender, assetTo, collateralTo, liquidityIn, tokensOut);
    }

    /// @inheritdoc IPair
    function lend(
        uint256 maturity,
        address bondTo,
        address insuranceTo,
        uint112 xIncrease,
        uint112 yDecrease,
        uint112 zDecrease,
        bytes calldata data
    ) external override lock returns (Claims memory claimsOut) {
        require(block.timestamp < maturity, 'E202');
        require(bondTo != address(0) && insuranceTo != address(0), 'E201');
        require(bondTo != address(this) && insuranceTo != address(this), 'E204');
        require(xIncrease > 0, 'E205');

        Pool storage pool = pools[maturity];
        require(pool.state.totalLiquidity > 0, 'E206');

        LendMath.check(pool.state, xIncrease, yDecrease, zDecrease, fee);

        claimsOut.bond = LendMath.getBond(maturity, xIncrease, yDecrease);
        claimsOut.insurance = LendMath.getInsurance(maturity, pool.state, xIncrease, zDecrease);

        Callback.lend(asset, xIncrease, data);

        pool.state.totalClaims.bond += claimsOut.bond;
        pool.state.totalClaims.insurance += claimsOut.insurance;

        pool.claims[bondTo].bond += claimsOut.bond;
        pool.claims[insuranceTo].insurance += claimsOut.insurance;

        pool.state.reserves.asset += xIncrease;

        pool.state.x += xIncrease;
        pool.state.y -= yDecrease;
        pool.state.z -= zDecrease;

        emit Sync(maturity, pool.state.x, pool.state.y, pool.state.z);
        emit Lend(maturity, msg.sender, bondTo, insuranceTo, xIncrease, claimsOut);
    }

    /// @inheritdoc IPair
    function withdraw(
        uint256 maturity,
        address assetTo,
        address collateralTo,
        Claims memory claimsIn
    ) external override lock returns (Tokens memory tokensOut) {
        require(block.timestamp >= maturity, 'E203');
        require(assetTo != address(0) && collateralTo != address(0), 'E201');
        require(assetTo != address(this) && collateralTo != address(this), 'E204');
        require(claimsIn.bond > 0 || claimsIn.insurance > 0, 'E205');

        Pool storage pool = pools[maturity];

        tokensOut.asset = WithdrawMath.getAsset(pool.state, claimsIn.bond);
        tokensOut.collateral = WithdrawMath.getCollateral(pool.state, claimsIn.insurance);

        pool.state.totalClaims.bond -= claimsIn.bond;
        pool.state.totalClaims.insurance -= claimsIn.insurance;

        Claims storage sender = pool.claims[msg.sender];

        sender.bond -= claimsIn.bond;
        sender.insurance -= claimsIn.insurance;

        pool.state.reserves.asset -= tokensOut.asset;
        pool.state.reserves.collateral -= tokensOut.collateral;

        if (tokensOut.asset > 0) asset.safeTransfer(assetTo, tokensOut.asset);
        if (tokensOut.collateral > 0) collateral.safeTransfer(collateralTo, tokensOut.collateral);

        emit Withdraw(maturity, msg.sender, assetTo, collateralTo, claimsIn, tokensOut);
    }

    /// @inheritdoc IPair
    function borrow(
        uint256 maturity,
        address assetTo,
        address dueTo,
        uint112 xDecrease,
        uint112 yIncrease,
        uint112 zIncrease,
        bytes calldata data
    ) external override lock returns (uint256 id, Due memory dueOut) {
        require(block.timestamp < maturity, 'E202');
        require(assetTo != address(0) && dueTo != address(0), 'E201');
        require(assetTo != address(this) && dueTo != address(this), 'E204');
        require(xDecrease > 0, 'E205');

        Pool storage pool = pools[maturity];
        require(pool.state.totalLiquidity > 0, 'E206');

        BorrowMath.check(pool.state, xDecrease, yIncrease, zIncrease, fee);

        dueOut.debt = BorrowMath.getDebt(maturity, xDecrease, yIncrease);
        dueOut.collateral = BorrowMath.getCollateral(maturity, pool.state, xDecrease, zIncrease);
        dueOut.startBlock = BlockNumber.get();

        Callback.borrow(collateral, dueOut.collateral, data);

        id = pool.dues[dueTo].insert(dueOut);

        pool.state.reserves.asset -= xDecrease;
        pool.state.reserves.collateral += dueOut.collateral;
        pool.state.totalDebtCreated += dueOut.debt;

        pool.state.x -= xDecrease;
        pool.state.y += yIncrease;
        pool.state.z += zIncrease;

        asset.safeTransfer(assetTo, xDecrease);

        emit Sync(maturity, pool.state.x, pool.state.y, pool.state.z);
        emit Borrow(maturity, msg.sender, assetTo, dueTo, xDecrease, id, dueOut);
    }

    /// @inheritdoc IPair
    function pay(
        uint256 maturity,
        address to,
        address owner,
        uint256[] memory ids,
        uint112[] memory assetsIn,
        uint112[] memory collateralsOut,
        bytes calldata data
    ) external override lock returns (uint128 assetIn, uint128 collateralOut) {
        require(block.timestamp < maturity, 'E202');
        require(ids.length == assetsIn.length && ids.length == collateralsOut.length, 'E205');
        require(to != address(0), 'E201');
        require(to != address(this), 'E204');

        Pool storage pool = pools[maturity];

        Due[] storage dues = pool.dues[owner];

        for (uint256 i; i < ids.length; i++) {
            Due storage due = dues[ids[i]];
            require(due.startBlock != BlockNumber.get(), 'E207');
            if (owner != msg.sender) require(collateralsOut[i] == 0, 'E213');
            PayMath.checkProportional(assetsIn[i], collateralsOut[i], due);
            due.debt -= assetsIn[i];
            due.collateral -= collateralsOut[i];
            assetIn += assetsIn[i];
            collateralOut += collateralsOut[i];
        }
        if (assetIn > 0) Callback.pay(asset, assetIn, data);

        pool.state.reserves.asset += assetIn;
        pool.state.reserves.collateral -= collateralOut;

        if (collateralOut > 0) collateral.safeTransfer(to, collateralOut);

        emit Pay(maturity, msg.sender, to, owner, ids, assetsIn, collateralsOut, assetIn, collateralOut);
    }
}
