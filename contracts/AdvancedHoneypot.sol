// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IDroseraTrap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AdvancedHoneypot - Drosera Trap Compatible
 * @dev Advanced honeypot trap that implements the Drosera trap interface
 */
contract AdvancedHoneypot is IDroseraTrap, Ownable, ReentrancyGuard {
    // Trap Configuration
    struct HoneypotTrap {
        uint256 trapId;
        string trapType;
        uint256 activationThreshold;
        uint256 responseDelay;
        bool isActive;
        uint256 totalTriggers;
        uint256 lastTriggerTime;
        uint256 capturedFunds;
        mapping(address => bool) whitelist;
        mapping(address => bool) blacklist;
    }

    // State variables
    mapping(uint256 => HoneypotTrap) public traps;
    mapping(address => bool) public authorizedDeployers;
    
    uint256 public nextTrapId = 1;
    uint256 public totalCapturedFunds = 0;
    uint256 public constant MINIMUM_THRESHOLD = 0.001 ether;
    uint256 public constant MAXIMUM_THRESHOLD = 10 ether;

    // Events
    event HoneypotDeployed(uint256 indexed trapId, address indexed deployer);
    event FundsCaptured(uint256 indexed trapId, address indexed attacker, uint256 amount);
    event AttackerBlacklisted(uint256 indexed trapId, address indexed attacker);

    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedDeployers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    modifier trapExists(uint256 trapId) {
        require(traps[trapId].trapId != 0, "Trap does not exist");
        _;
    }

    modifier trapActive(uint256 trapId) {
        require(traps[trapId].isActive, "Trap is not active");
        _;
    }

    constructor() {
        authorizedDeployers[msg.sender] = true;
    }

    /**
     * @dev Deploy a new honeypot trap (Drosera compatible)
     * @param trapType Type of trap (should be "Honeypot")
     * @param activationThreshold Threshold for trap activation
     * @param responseDelay Delay before response execution
     */
    function deployTrap(
        string memory trapType,
        uint256 activationThreshold,
        uint256 responseDelay
    ) external onlyAuthorized {
        require(keccak256(bytes(trapType)) == keccak256(bytes("Honeypot")), "Must be Honeypot type");
        require(activationThreshold >= MINIMUM_THRESHOLD, "Threshold too low");
        require(activationThreshold <= MAXIMUM_THRESHOLD, "Threshold too high");
        require(responseDelay <= 24 hours, "Response delay too long");

        uint256 trapId = nextTrapId++;
        
        HoneypotTrap storage newTrap = traps[trapId];
        newTrap.trapId = trapId;
        newTrap.trapType = trapType;
        newTrap.activationThreshold = activationThreshold;
        newTrap.responseDelay = responseDelay;
        newTrap.isActive = true;
        newTrap.totalTriggers = 0;
        newTrap.lastTriggerTime = 0;
        newTrap.capturedFunds = 0;

        emit HoneypotDeployed(trapId, msg.sender);
    }

    /**
     * @dev Drosera Trap Interface: Detect function for honeypot attacks
     * @param trapId The trap ID to check
     * @param target The target address to monitor
     * @return bool True if trap should be activated
     */
    function detect(uint256 trapId, address target) external view override returns (bool) {
        HoneypotTrap storage trap = traps[trapId];
        
        if (!trap.isActive) {
            return false;
        }

        // Check if target is whitelisted (bypass)
        if (trap.whitelist[target]) {
            return false;
        }

        // Check if target is blacklisted (always trigger)
        if (trap.blacklist[target]) {
            return true;
        }

        // Check activation conditions
        uint256 targetBalance = target.balance;
        bool meetsThreshold = targetBalance >= trap.activationThreshold;
        bool cooldownExpired = block.timestamp >= trap.lastTriggerTime + trap.responseDelay;
        
        return meetsThreshold && cooldownExpired;
    }

    /**
     * @dev Drosera Trap Interface: Respond function for honeypot attacks
     * @param trapId The trap ID to execute
     * @param target The target address
     * @return bool True if response was successful
     */
    function respond(uint256 trapId, address target) external override returns (bool) {
        HoneypotTrap storage trap = traps[trapId];
        
        require(trap.isActive, "Trap is not active");
        require(detect(trapId, target), "Trap conditions not met");

        // Update trap state
        trap.totalTriggers++;
        trap.lastTriggerTime = block.timestamp;

        // Execute honeypot response
        uint256 capturedAmount = executeHoneypotResponse(trapId, target);
        
        if (capturedAmount > 0) {
            trap.capturedFunds += capturedAmount;
            totalCapturedFunds += capturedAmount;
            
            // Blacklist the attacker
            trap.blacklist[target] = true;
            
            emit FundsCaptured(trapId, target, capturedAmount);
            emit AttackerBlacklisted(trapId, target);
        }

        return true;
    }

    /**
     * @dev Get available trap types
     * @return string[] Array of available trap types
     */
    function getAvailableTrapTypes() external view override returns (string[] memory) {
        string[] memory types = new string[](1);
        types[0] = "Honeypot";
        return types;
    }

    /**
     * @dev Execute honeypot response and capture funds
     * @param trapId The trap ID
     * @param target The target address
     * @return uint256 Amount of funds captured
     */
    function executeHoneypotResponse(uint256 trapId, address target) internal returns (uint256) {
        // Simulate fund capture (in a real implementation, this would interact with the target)
        uint256 targetBalance = target.balance;
        
        if (targetBalance > 0) {
            // In a real implementation, this would transfer funds from the target
            // For now, we'll just return a simulated amount
            return targetBalance > 0.1 ether ? 0.1 ether : targetBalance;
        }
        
        return 0;
    }

    // Admin functions
    function addToWhitelist(uint256 trapId, address addr) external onlyAuthorized trapExists(trapId) {
        traps[trapId].whitelist[addr] = true;
    }

    function removeFromWhitelist(uint256 trapId, address addr) external onlyAuthorized trapExists(trapId) {
        traps[trapId].whitelist[addr] = false;
    }

    function addToBlacklist(uint256 trapId, address addr) external onlyAuthorized trapExists(trapId) {
        traps[trapId].blacklist[addr] = true;
    }

    function removeFromBlacklist(uint256 trapId, address addr) external onlyAuthorized trapExists(trapId) {
        traps[trapId].blacklist[addr] = false;
    }

    function toggleTrap(uint256 trapId) external onlyAuthorized trapExists(trapId) {
        traps[trapId].isActive = !traps[trapId].isActive;
    }

    function updateTrapConfig(
        uint256 trapId,
        uint256 newThreshold,
        uint256 newDelay
    ) external onlyAuthorized trapExists(trapId) {
        require(newThreshold >= MINIMUM_THRESHOLD, "Threshold too low");
        require(newThreshold <= MAXIMUM_THRESHOLD, "Threshold too high");
        require(newDelay <= 24 hours, "Response delay too long");

        traps[trapId].activationThreshold = newThreshold;
        traps[trapId].responseDelay = newDelay;
    }

    function authorizeDeployer(address deployer) external onlyOwner {
        authorizedDeployers[deployer] = true;
    }

    function revokeDeployer(address deployer) external onlyOwner {
        authorizedDeployers[deployer] = false;
    }

    // View functions
    function getTrapInfo(uint256 trapId) external view returns (
        uint256 trapId_,
        string memory trapType,
        uint256 activationThreshold,
        uint256 responseDelay,
        bool isActive,
        uint256 totalTriggers,
        uint256 lastTriggerTime,
        uint256 capturedFunds
    ) {
        HoneypotTrap storage trap = traps[trapId];
        return (
            trap.trapId,
            trap.trapType,
            trap.activationThreshold,
            trap.responseDelay,
            trap.isActive,
            trap.totalTriggers,
            trap.lastTriggerTime,
            trap.capturedFunds
        );
    }

    function isWhitelisted(uint256 trapId, address addr) external view returns (bool) {
        return traps[trapId].whitelist[addr];
    }

    function isBlacklisted(uint256 trapId, address addr) external view returns (bool) {
        return traps[trapId].blacklist[addr];
    }

    function getTotalCapturedFunds() external view returns (uint256) {
        return totalCapturedFunds;
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Receive function for ETH deposits
    receive() external payable {}
}

