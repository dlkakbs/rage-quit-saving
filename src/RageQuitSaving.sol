// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title  RageQuitSaving
/// @notice Proportional savings pool on Arc Network.
///
///  Flow:
///    Anyone  → deposit(poolId)  + USDC (native)
///    Early?  → rageQuit(poolId) → %20 ceza kesilir, kalanlar paylaşır
///    Süre?   → claim(poolId)    → stake + orantılı bonus geri alınır
///
///  Arc'ta native token USDC. msg.value = USDC.

contract RageQuitSaving {

    // ──────────────────────────────────────────────── Types ──

    struct Pool {
        address creator;
        uint256 lockEnd;        // unix timestamp
        uint256 penaltyBps;     // basis points, örn. 2000 = %20
        uint256 minDeposit;     // minimum deposit miktarı (wei)
        uint256 totalStake;     // aktif katılımcıların toplam stake'i
        uint256 bonusPool;      // biriken cezalar
    }

    // ──────────────────────────────────────────────── State ──

    uint256 public poolCount;

    mapping(uint256 => Pool)                      public pools;
    mapping(uint256 => mapping(address => uint256)) public stakes;   // poolId → user → stake
    mapping(uint256 => mapping(address => bool))    public claimed;  // poolId → user → claimed?

    // ──────────────────────────────────────────────── Events ──

    event PoolCreated(uint256 indexed poolId, address creator, uint256 lockEnd, uint256 penaltyBps);
    event Deposited(uint256 indexed poolId, address indexed user, uint256 amount);
    event RageQuit(uint256 indexed poolId, address indexed user, uint256 returned, uint256 penalty);
    event Claimed(uint256 indexed poolId, address indexed user, uint256 amount);

    // ──────────────────────────────────────────────── Errors ──

    error PoolNotFound();
    error PoolAlreadyMatured();
    error PoolNotMatured();
    error NoStake();
    error AlreadyClaimed();
    error ZeroDeposit();
    error BelowMinDeposit();
    error InvalidPenalty();
    error InvalidLockDuration();

    // ──────────────────────────────────────────────── Functions ──

    /// @notice Yeni bir savings pool oluştur
    /// @param lockDuration Saniye cinsinden kilit süresi (örn. 30 gün = 2592000)
    /// @param penaltyBps   Erken çıkış cezası basis point (örn. 2000 = %20)
    /// @param minDeposit_  Minimum deposit miktarı (wei)
    function createPool(uint256 lockDuration, uint256 penaltyBps, uint256 minDeposit_) external returns (uint256 poolId) {
        if (lockDuration == 0) revert InvalidLockDuration();
        if (penaltyBps == 0 || penaltyBps >= 10000) revert InvalidPenalty();

        poolId = poolCount++;

        pools[poolId] = Pool({
            creator:    msg.sender,
            lockEnd:    block.timestamp + lockDuration,
            penaltyBps: penaltyBps,
            minDeposit: minDeposit_,
            totalStake: 0,
            bonusPool:  0
        });

        emit PoolCreated(poolId, msg.sender, block.timestamp + lockDuration, penaltyBps);
    }

    /// @notice Pool'a USDC yatır
    function deposit(uint256 poolId) external payable {
        Pool storage pool = _getActivePool(poolId);
        if (msg.value == 0) revert ZeroDeposit();
        if (pool.minDeposit > 0 && msg.value < pool.minDeposit) revert BelowMinDeposit();

        stakes[poolId][msg.sender] += msg.value;
        pool.totalStake            += msg.value;

        emit Deposited(poolId, msg.sender, msg.value);
    }

    /// @notice Erken çık — ceza öde, kalan para anında iade
    function rageQuit(uint256 poolId) external {
        Pool storage pool = _getActivePool(poolId);

        uint256 stake = stakes[poolId][msg.sender];
        if (stake == 0) revert NoStake();

        uint256 penalty  = (stake * pool.penaltyBps) / 10000;
        uint256 returned = stake - penalty;

        pool.bonusPool  += penalty;
        pool.totalStake -= stake;
        stakes[poolId][msg.sender] = 0;

        (bool ok,) = msg.sender.call{value: returned}("");
        require(ok, "transfer failed");

        emit RageQuit(poolId, msg.sender, returned, penalty);
    }

    /// @notice Süre dolduktan sonra stake + orantılı bonus al
    function claim(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        if (pool.creator == address(0)) revert PoolNotFound();
        if (block.timestamp < pool.lockEnd) revert PoolNotMatured();

        uint256 stake = stakes[poolId][msg.sender];
        if (stake == 0) revert NoStake();
        if (claimed[poolId][msg.sender]) revert AlreadyClaimed();

        claimed[poolId][msg.sender] = true;

        // Orantılı bonus: stake / totalStake × bonusPool
        uint256 bonus  = pool.totalStake > 0
            ? (stake * pool.bonusPool) / pool.totalStake
            : 0;
        uint256 payout = stake + bonus;

        (bool ok,) = msg.sender.call{value: payout}("");
        require(ok, "transfer failed");

        emit Claimed(poolId, msg.sender, payout);
    }

    // ──────────────────────────────────────────────── Views ──

    function getPool(uint256 poolId) external view returns (Pool memory) {
        return pools[poolId];
    }

    function getStake(uint256 poolId, address user) external view returns (uint256) {
        return stakes[poolId][user];
    }

    // ──────────────────────────────────────────────── Internal ──

    function _getActivePool(uint256 poolId) internal view returns (Pool storage pool) {
        pool = pools[poolId];
        if (pool.creator == address(0)) revert PoolNotFound();
        if (block.timestamp >= pool.lockEnd) revert PoolAlreadyMatured();
    }
}
