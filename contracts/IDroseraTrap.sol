// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IDroseraTrap - Standard Drosera Trap Interface
 * @dev All Drosera-compatible trap contracts must implement this interface
 */
interface IDroseraTrap {
    // Events
    event TrapDeployed(uint256 indexed trapId, address indexed deployer, string trapType);
    event TrapActivated(uint256 indexed trapId, address indexed target);
    event TrapResponse(uint256 indexed trapId, address indexed target, string response);

    // Core functions
    function detect(uint256 trapId, address target) external view returns (bool);
    function respond(uint256 trapId, address target) external returns (bool);
    function getAvailableTrapTypes() external view returns (string[] memory);
}
