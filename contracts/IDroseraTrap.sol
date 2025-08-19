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
    event TrapTriggered(uint256 indexed trapId, address indexed attacker, string reason);
    event TrapResponse(uint256 indexed trapId, string responseType, bool success);
    
    // Core Trap Functions
    function detect(
        uint256 trapId,
        address target,
        bytes calldata data
    ) external view returns (bool shouldRespond, string memory reason);
    
    function respond(
        uint256 trapId,
        address target,
        string memory actionType
    ) external returns (bool success);
    
    // Trap Management
    function deployTrap(
        string memory trapType,
        uint256 activationThreshold,
        uint256 responseDelay
    ) external payable;
    
    function toggleTrap(uint256 trapId) external;
    
    function updateTrapConfig(
        uint256 trapId,
        uint256 newThreshold,
        uint256 newDelay
    ) external;
    
    // Access Control
    function addToWhitelist(uint256 trapId, address addr) external;
    
    function removeFromWhitelist(uint256 trapId, address addr) external;
    
    // View Functions
    function getTrapInfo(uint256 trapId) external view returns (
        uint256 trapId_,
        address deployer,
        string memory trapType,
        bool isActive,
        uint256 activationThreshold,
        uint256 responseDelay,
        uint256 totalTriggers,
        uint256 lastTriggerTime
    );
    
    function getUserTraps(address user) external view returns (uint256[] memory);
    
    function getAvailableTrapTypes() external view returns (string[] memory);
}
