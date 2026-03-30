// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/RageQuitSaving.sol";

contract RageQuitSavingTest is Test {
    RageQuitSaving pool;

    address alice = makeAddr("alice");   // 100 USDC
    address bob   = makeAddr("bob");     // 200 USDC
    address carol = makeAddr("carol");   // 700 USDC

    uint256 constant LOCK_30_DAYS = 30 days;
    uint256 constant PENALTY_20   = 2000; // %20

    function setUp() public {
        pool = new RageQuitSaving();

        vm.deal(alice, 100 ether);
        vm.deal(bob,   200 ether);
        vm.deal(carol, 700 ether);
    }

    // ─────────────────────────────────────── Helpers ──

    function _createAndDeposit() internal returns (uint256 poolId) {
        poolId = pool.createPool(LOCK_30_DAYS, PENALTY_20, 0);

        vm.prank(alice); pool.deposit{value: 100 ether}(poolId);
        vm.prank(bob);   pool.deposit{value: 200 ether}(poolId);
        vm.prank(carol); pool.deposit{value: 700 ether}(poolId);
    }

    // ─────────────────────────────────────── Tests ──

    function test_CreatePool() public {
        uint256 poolId = pool.createPool(LOCK_30_DAYS, PENALTY_20, 50 ether);
        RageQuitSaving.Pool memory p = pool.getPool(poolId);

        assertEq(p.penaltyBps,  PENALTY_20);
        assertEq(p.minDeposit,  50 ether);
        assertEq(p.totalStake,  0);
        assertEq(p.bonusPool,   0);
    }

    function test_BelowMinDeposit_Reverts() public {
        uint256 poolId = pool.createPool(LOCK_30_DAYS, PENALTY_20, 50 ether);

        vm.prank(alice);
        vm.expectRevert(RageQuitSaving.BelowMinDeposit.selector);
        pool.deposit{value: 10 ether}(poolId);
    }

    function test_ExactMinDeposit_Succeeds() public {
        uint256 poolId = pool.createPool(LOCK_30_DAYS, PENALTY_20, 50 ether);

        vm.prank(alice);
        pool.deposit{value: 50 ether}(poolId);
        assertEq(pool.getStake(poolId, alice), 50 ether);
    }

    function test_Deposit() public {
        uint256 poolId = _createAndDeposit();
        RageQuitSaving.Pool memory p = pool.getPool(poolId);

        assertEq(p.totalStake, 1000 ether);
        assertEq(pool.getStake(poolId, alice), 100 ether);
        assertEq(pool.getStake(poolId, bob),   200 ether);
        assertEq(pool.getStake(poolId, carol),  700 ether);
    }

    /// @notice Bob erken çıkıyor, %20 ceza ödemeli
    function test_RageQuit() public {
        uint256 poolId = _createAndDeposit();

        uint256 bobBefore = bob.balance;

        vm.prank(bob);
        pool.rageQuit(poolId);

        // Bob 200'den %20 ceza = 40 kesildi, 160 almalı
        assertEq(bob.balance - bobBefore, 160 ether);

        RageQuitSaving.Pool memory p = pool.getPool(poolId);
        assertEq(p.bonusPool,  40 ether);
        assertEq(p.totalStake, 800 ether); // 1000 - 200
    }

    /// @notice Tam senaryo: B çıkıyor, A ve C orantılı bonus alıyor
    function test_FullScenario() public {
        uint256 poolId = _createAndDeposit();

        // Bob rage-quit
        vm.prank(bob);
        pool.rageQuit(poolId);

        // Süre doldu
        vm.warp(block.timestamp + 31 days);

        uint256 aliceBefore = alice.balance;
        uint256 carolBefore = carol.balance;

        vm.prank(alice); pool.claim(poolId);
        vm.prank(carol); pool.claim(poolId);

        // Alice: 100 + (100/800 × 40) = 105
        assertEq(alice.balance - aliceBefore, 105 ether);
        // Carol: 700 + (700/800 × 40) = 735
        assertEq(carol.balance - carolBefore, 735 ether);
    }

    function test_ClaimBeforeLock_Reverts() public {
        uint256 poolId = _createAndDeposit();

        vm.prank(alice);
        vm.expectRevert(RageQuitSaving.PoolNotMatured.selector);
        pool.claim(poolId);
    }

    function test_RageQuitAfterLock_Reverts() public {
        uint256 poolId = _createAndDeposit();
        vm.warp(block.timestamp + 31 days);

        vm.prank(bob);
        vm.expectRevert(RageQuitSaving.PoolAlreadyMatured.selector);
        pool.rageQuit(poolId);
    }

    function test_DoubleClaimReverts() public {
        uint256 poolId = _createAndDeposit();
        vm.warp(block.timestamp + 31 days);

        vm.prank(alice);
        pool.claim(poolId);

        vm.prank(alice);
        vm.expectRevert(RageQuitSaving.AlreadyClaimed.selector);
        pool.claim(poolId);
    }

    function test_NoRageQuit_EveryoneGetsExactStakeBack() public {
        uint256 poolId = _createAndDeposit();
        vm.warp(block.timestamp + 31 days);

        uint256 aliceBefore = alice.balance;
        uint256 carolBefore = carol.balance;
        uint256 bobBefore   = bob.balance;

        vm.prank(alice); pool.claim(poolId);
        vm.prank(bob);   pool.claim(poolId);
        vm.prank(carol); pool.claim(poolId);

        // Hiç rage-quit yok, bonus yok, herkes parasını geri alır
        assertEq(alice.balance - aliceBefore, 100 ether);
        assertEq(bob.balance   - bobBefore,   200 ether);
        assertEq(carol.balance - carolBefore,  700 ether);
    }
}
