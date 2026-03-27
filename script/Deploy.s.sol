// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/RageQuitSaving.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        RageQuitSaving rageQuit = new RageQuitSaving();
        vm.stopBroadcast();

        console.log("RageQuitSaving deployed to:", address(rageQuit));
    }
}
