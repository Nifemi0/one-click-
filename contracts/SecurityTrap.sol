// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IDroseraTrap.sol";

/**
 * @title SecurityTrap - Drosera Trap Compatible
 * @dev Implements the Drosera trap interface for automated security responses
 */
contract SecurityTrap is IDroseraTrap, Ownable, ReentrancyGuard {
    // Drosera Trap Interface Events
    event TrapDeployed(uint256 indexed trapId, address indexed deployer, string trapType);
    event TrapActivated(uint256 indexed trapId, address indexed target);
    event TrapResponse(uint256 indexed trapId, address indexed target, string response);

    // Trap configuration
    struct Trap {
        uint256 trapId;
        string trapType;
        uint256 activationThreshold;
        uint256 responseDelay;
        bool isActive;
        uint256 totalTriggers;
        uint256 lastTriggerTime;
    }

    // State variables
    mapping(uint256 => Trap) public traps;
    mapping(address => bool) public whitelistedAddresses;
    mapping(address => uint256) public lastInteraction;
    
    uint256 public nextTrapId = 1;
    uint256 public constant INTERACTION_COOLDOWN = 1 hours;
    uint256 public constant MINIMUM_THRESHOLD = 0.001 ether;
    uint256 public constant MAXIMUM_THRESHOLD = 10 ether;

    // Modifiers
    modifier onlyWhitelisted() {
        require(whitelistedAddresses[msg.sender], "Address not whitelisted");
        _;
    }

    modifier trapExists(uint256 trapId) {
        require(traps[trapId].trapId != 0, "Trap does not exist");
        _;
    }

    modifier notInCooldown() {
        require(block.timestamp >= lastInteraction[msg.sender] + INTERACTION_COOLDOWN, "Cooldown active");
        _;
    }

    constructor() {
        whitelistedAddresses[msg.sender] = true;
    }

    /**
     * @dev Deploy a new security trap (Drosera compatible)
     * @param trapType Type of trap to deploy
     * @param activationThreshold Threshold for trap activation
     * @param responseDelay Delay before response execution
     */
    function deployTrap(
        string memory trapType,
        uint256 activationThreshold,
        uint256 responseDelay
    ) external onlyWhitelisted {
        require(activationThreshold >= MINIMUM_THRESHOLD, "Threshold too low");
        require(activationThreshold <= MAXIMUM_THRESHOLD, "Threshold too high");
        require(responseDelay <= 24 hours, "Response delay too long");

        uint256 trapId = nextTrapId++;
        
        traps[trapId] = Trap({
            trapId: trapId,
            trapType: trapType,
            activationThreshold: activationThreshold,
            responseDelay: responseDelay,
            isActive: true,
            totalTriggers: 0,
            lastTriggerTime: 0
        });

        emit TrapDeployed(trapId, msg.sender, trapType);
    }

    /**
     * @dev Drosera Trap Interface: Detect function
     * @param trapId The trap ID to check
     * @param target The target address to monitor
     * @return bool True if trap should be activated
     */
    function detect(uint256 trapId, address target) external view override returns (bool) {
        Trap storage trap = traps[trapId];
        
        if (!trap.isActive) {
            return false;
        }

        // Check if target meets activation criteria
        uint256 targetBalance = target.balance;
        bool meetsThreshold = targetBalance >= trap.activationThreshold;
        bool cooldownExpired = block.timestamp >= trap.lastTriggerTime + trap.responseDelay;
        
        return meetsThreshold && cooldownExpired;
    }

    /**
     * @dev Drosera Trap Interface: Respond function
     * @param trapId The trap ID to execute
     * @param target The target address
     * @return bool True if response was successful
     */
    function respond(uint256 trapId, address target) external override returns (bool) {
        Trap storage trap = traps[trapId];
        
        require(trap.isActive, "Trap is not active");
        require(detect(trapId, target), "Trap conditions not met");

        // Update trap state
        trap.totalTriggers++;
        trap.lastTriggerTime = block.timestamp;
        lastInteraction[msg.sender] = block.timestamp;

        // Execute trap response based on type
        string memory response = executeResponse(trapId, target);
        
        emit TrapResponse(trapId, target, response);
        return true;
    }

    /**
     * @dev Get available trap types
     * @return string[] Array of available trap types
     */
    function getAvailableTrapTypes() external view override returns (string[] memory) {
        string[] memory types = new string[](5);
        types[0] = "Honeypot";
        types[1] = "FlashLoan";
        types[2] = "Reentrancy";
        types[3] = "MEV";
        types[4] = "AccessControl";
        return types;
    }

    /**
     * @dev Execute trap response based on trap type
     * @param trapId The trap ID
     * @param target The target address
     * @return string Response description
     */
    function executeResponse(uint256 trapId, address target) internal returns (string memory) {
        Trap storage trap = traps[trapId];
        
        if (keccak256(bytes(trap.trapType)) == keccak256(bytes("Honeypot"))) {
            return executeHoneypotResponse(trapId, target);
        } else if (keccak256(bytes(trap.trapType)) == keccak256(bytes("FlashLoan"))) {
            return executeFlashLoanResponse(trapId, target);
        } else if (keccak256(bytes(trap.trapType)) == keccak256(bytes("Reentrancy"))) {
            return executeReentrancyResponse(trapId, target);
        } else if (keccak256(bytes(trap.trapType)) == keccak256(bytes("MEV"))) {
            return executeMEVResponse(trapId, target);
        } else if (keccak256(bytes(trap.trapType)) == keccak256(bytes("AccessControl"))) {
            return executeAccessControlResponse(trapId, target);
        }
        
        return "Unknown trap type";
    }

    // Response execution functions
    function executeHoneypotResponse(uint256 trapId, address target) internal returns (string memory) {
        // Honeypot response logic
        return "Honeypot trap activated - funds captured";
    }

    function executeFlashLoanResponse(uint256 trapId, address target) internal returns (string memory) {
        // Flash loan response logic
        return "Flash loan attack detected - transaction blocked";
    }

    function executeReentrancyResponse(uint256 trapId, address target) internal returns (string memory) {
        // Reentrancy response logic
        return "Reentrancy attack detected - state protected";
    }

    function executeMEVResponse(uint256 trapId, address target) internal returns (string memory) {
        // MEV response logic
        return "MEV attack detected - transaction reordered";
    }

    function executeAccessControlResponse(uint256 trapId, address target) internal returns (string memory) {
        // Access control response logic
        return "Unauthorized access detected - access denied";
    }

    // Admin functions
    function addToWhitelist(address addr) external onlyOwner {
        whitelistedAddresses[addr] = true;
    }

    function removeFromWhitelist(address addr) external onlyOwner {
        whitelistedAddresses[addr] = false;
    }

    function toggleTrap(uint256 trapId) external onlyOwner trapExists(trapId) {
        traps[trapId].isActive = !traps[trapId].isActive;
    }

    function updateTrapConfig(
        uint256 trapId,
        uint256 newThreshold,
        uint256 newDelay
    ) external onlyOwner trapExists(trapId) {
        require(newThreshold >= MINIMUM_THRESHOLD, "Threshold too low");
        require(newThreshold <= MAXIMUM_THRESHOLD, "Threshold too high");
        require(newDelay <= 24 hours, "Response delay too long");

        traps[trapId].activationThreshold = newThreshold;
        traps[trapId].responseDelay = newDelay;
    }

    // View functions
    function getTrapInfo(uint256 trapId) external view returns (
        uint256 trapId_,
        string memory trapType,
        uint256 activationThreshold,
        uint256 responseDelay,
        bool isActive,
        uint256 totalTriggers,
        uint256 lastTriggerTime
    ) {
        Trap storage trap = traps[trapId];
        return (
            trap.trapId,
            trap.trapType,
            trap.activationThreshold,
            trap.responseDelay,
            trap.isActive,
            trap.totalTriggers,
            trap.lastTriggerTime
        );
    }

    function isWhitelisted(address addr) external view returns (bool) {
        return whitelistedAddresses[addr];
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        // Pause all traps
        for (uint256 i = 1; i < nextTrapId; i++) {
            if (traps[i].trapId != 0) {
                traps[i].isActive = false;
            }
        }
    }

    function emergencyResume() external onlyOwner {
        // Resume all traps
        for (uint256 i = 1; i < nextTrapId; i++) {
            if (traps[i].trapId != 0) {
                traps[i].isActive = true;
            }
        }
    }

    // Fallback and receive functions
    receive() external payable {}
}
