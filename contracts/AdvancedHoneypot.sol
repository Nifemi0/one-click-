// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IDroseraTrap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AdvancedHoneypot - Drosera Trap Compatible
 * @dev Advanced honeypot trap that implements the Drosera trap interface
 */
contract AdvancedHoneypot is IDroseraTrap, Ownable, ReentrancyGuard {
    // Trap Configuration
    struct HoneypotTrap {
        uint256 trapId;
        address deployer;
        bool isActive;
        uint256 activationThreshold;
        uint256 responseDelay;
        uint256 balance;
        uint256 totalAttacks;
        uint256 blockedAttacks;
        mapping(address => bool) whitelist;
        mapping(address => bool) blacklist;
        mapping(address => uint256) attackCounts;
        uint256 lastAttackTime;
    }
    
    // State variables
    uint256 private _trapIds;
    mapping(uint256 => HoneypotTrap) public traps;
    
    uint256 public deploymentFee = 0.001 ether;
    uint256 public maxTrapBalance = 10 ether;
    
    // Modifiers
    modifier onlyTrapOwner(uint256 trapId) {
        require(traps[trapId].deployer == msg.sender, "Not trap owner");
        _;
    }
    
    modifier trapExists(uint256 trapId) {
        require(trapId > 0 && trapId <= _trapIds, "Trap does not exist");
        _;
    }
    
    modifier trapActive(uint256 trapId) {
        require(traps[trapId].isActive, "Trap is not active");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        _trapIds = 0;
    }
    
    /**
     * @dev Deploy a new honeypot trap (Drosera compatible)
     * @param trapType Type of trap (should be "Honeypot")
     * @param activationThreshold Threshold for trap activation
     * @param responseDelay Delay before executing response
     */
    function deployTrap(
        string memory trapType,
        uint256 activationThreshold,
        uint256 responseDelay
    ) external payable override nonReentrant {
        require(msg.value >= deploymentFee, "Insufficient payment");
        require(keccak256(bytes(trapType)) == keccak256(bytes("Honeypot")), "Invalid trap type");
        require(activationThreshold > 0, "Invalid threshold");
        require(responseDelay <= 3600, "Response delay too long"); // Max 1 hour
        
        _trapIds++;
        uint256 newTrapId = _trapIds;
        
        HoneypotTrap storage newTrap = traps[newTrapId];
        newTrap.trapId = newTrapId;
        newTrap.deployer = msg.sender;
        newTrap.isActive = true;
        newTrap.activationThreshold = activationThreshold;
        newTrap.responseDelay = responseDelay;
        newTrap.balance = 0;
        newTrap.totalAttacks = 0;
        newTrap.blockedAttacks = 0;
        newTrap.lastAttackTime = 0;
        
        emit TrapDeployed(newTrapId, msg.sender, trapType);
    }
    
    /**
     * @dev Drosera Trap Interface: Detect function for honeypot attacks
     * @param trapId The trap ID to check
     * @param target The target address to monitor
     * @param data Additional detection data
     */
    function detect(
        uint256 trapId,
        address target,
        bytes calldata data
    ) external view override trapExists(trapId) trapActive(trapId) returns (bool shouldRespond, string memory reason) {
        HoneypotTrap storage trap = traps[trapId];
        
        // Check if target is blacklisted
        if (trap.blacklist[target]) {
            return (true, "Target is blacklisted");
        }
        
        // Check if target is whitelisted (bypass)
        if (trap.whitelist[target]) {
            return (false, "Target is whitelisted");
        }
        
        // Check activation threshold
        if (trap.totalAttacks >= trap.activationThreshold) {
            return (true, "Activation threshold reached");
        }
        
        // Check time-based conditions
        uint256 timeSinceLastAttack = block.timestamp - trap.lastAttackTime;
        if (timeSinceLastAttack < trap.responseDelay) {
            return (false, "Response delay not met");
        }
        
        // Honeypot-specific detection logic
        if (data.length > 0) {
            // Check for suspicious function calls
            if (bytes4(data[:4]) == bytes4(keccak256("withdraw()"))) {
                return (true, "Honeypot withdrawal attempt");
            }
            if (bytes4(data[:4]) == bytes4(keccak256("transfer(address,uint256)"))) {
                return (true, "Honeypot transfer attempt");
            }
        }
        
        // Check for repeated attacks from same address
        if (trap.attackCounts[target] > 3) {
            return (true, "Repeated attack pattern detected");
        }
        
        return (false, "No honeypot threat");
    }
    
    /**
     * @dev Drosera Trap Interface: Respond function for honeypot attacks
     * @param trapId The trap ID to execute
     * @param target The target address
     * @param actionType Type of response action
     */
    function respond(
        uint256 trapId,
        address target,
        string memory actionType
    ) external override trapExists(trapId) trapActive(trapId) returns (bool success) {
        HoneypotTrap storage trap = traps[trapId];
        
        // Only trap owner or authorized operators can respond
        require(msg.sender == trap.deployer || msg.sender == owner(), "Not authorized");
        
        // Execute response action
        if (keccak256(bytes(actionType)) == keccak256(bytes("Blacklist"))) {
            success = _executeBlacklist(trapId, target);
        } else if (keccak256(bytes(actionType)) == keccak256(bytes("Honeypot"))) {
            success = _executeHoneypot(trapId, target);
        } else if (keccak256(bytes(actionType)) == keccak256(bytes("Block"))) {
            success = _executeBlock(trapId, target);
        }
        
        if (success) {
            trap.totalAttacks++;
            trap.lastAttackTime = block.timestamp;
            trap.attackCounts[target]++;
            
            emit TrapResponse(trapId, actionType, success);
        }
        
        return success;
    }
    
    /**
     * @dev Internal response execution functions
     */
    function _executeBlacklist(uint256 trapId, address target) internal returns (bool) {
        traps[trapId].blacklist[target] = true;
        emit TrapTriggered(trapId, target, "Target blacklisted");
        return true;
    }
    
    function _executeHoneypot(uint256 trapId, address target) internal returns (bool) {
        // Activate honeypot mode - this will always fail for attackers
        emit TrapTriggered(trapId, target, "Honeypot activated");
        return true;
    }
    
    function _executeBlock(uint256 trapId, address target) internal returns (bool) {
        // Block the target address
        traps[trapId].blacklist[target] = true;
        emit TrapTriggered(trapId, target, "Target blocked");
        return true;
    }
    
    /**
     * @dev Trap management functions
     */
    function toggleTrap(uint256 trapId) external override onlyTrapOwner(trapId) trapExists(trapId) {
        traps[trapId].isActive = !traps[trapId].isActive;
    }
    
    function updateTrapConfig(
        uint256 trapId,
        uint256 newThreshold,
        uint256 newDelay
    ) external override onlyTrapOwner(trapId) trapExists(trapId) {
        require(newThreshold > 0, "Invalid threshold");
        require(newDelay <= 3600, "Delay too long");
        
        HoneypotTrap storage trap = traps[trapId];
        trap.activationThreshold = newThreshold;
        trap.responseDelay = newDelay;
    }
    
    function addToWhitelist(uint256 trapId, address addr) external override onlyTrapOwner(trapId) trapExists(trapId) {
        traps[trapId].whitelist[addr] = true;
    }
    
    function removeFromWhitelist(uint256 trapId, address addr) external override onlyTrapOwner(trapId) trapExists(trapId) {
        traps[trapId].whitelist[addr] = false;
    }
    
    /**
     * @dev Honeypot-specific functions
     */
    function fundTrap(uint256 trapId) external payable onlyTrapOwner(trapId) trapExists(trapId) {
        require(msg.value > 0, "No funds to add");
        require(traps[trapId].balance + msg.value <= maxTrapBalance, "Exceeds max balance");
        
        traps[trapId].balance += msg.value;
    }
    
    function withdrawTrapFunds(uint256 trapId) external onlyTrapOwner(trapId) trapExists(trapId) nonReentrant {
        HoneypotTrap storage trap = traps[trapId];
        require(trap.balance > 0, "No funds to withdraw");
        
        uint256 amount = trap.balance;
        trap.balance = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Fallback function to catch ETH transfers (honeypot lure)
     */
    receive() external payable {
        // This function will always fail for attackers, making it a honeypot
        revert("Honeypot: Withdrawal failed");
    }
    
    /**
     * @dev Attempt to withdraw funds (this will always fail for attackers)
     */
    function withdraw() external {
        // This will always fail for attackers
        revert("Honeypot: Withdrawal failed");
    }
    
    /**
     * @dev View functions
     */
    function getTrapInfo(uint256 trapId) external view override trapExists(trapId) returns (
        uint256 trapId_,
        address deployer,
        string memory trapType,
        bool isActive,
        uint256 activationThreshold,
        uint256 responseDelay,
        uint256 totalTriggers,
        uint256 lastAttackTime
    ) {
        HoneypotTrap storage trap = traps[trapId];
        return (
            trap.trapId,
            trap.deployer,
            "Honeypot",
            trap.isActive,
            trap.activationThreshold,
            trap.responseDelay,
            trap.totalTriggers,
            trap.lastAttackTime
        );
    }
    
    function getUserTraps(address user) external view override returns (uint256[] memory) {
        uint256[] memory userTraps = new uint256[](_trapIds);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _trapIds; i++) {
            if (traps[i].deployer == user) {
                userTraps[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(userTraps, count)
        }
        
        return userTraps;
    }
    
    function getAvailableTrapTypes() external view override returns (string[] memory) {
        string[] memory types = new string[](1);
        types[0] = "Honeypot";
        return types;
    }
    
    function getTrapStats(uint256 trapId) external view trapExists(trapId) returns (
        uint256 trapId_,
        address deployer,
        uint256 balance,
        bool isActive,
        uint256 totalAttacks,
        uint256 blockedAttacks
    ) {
        HoneypotTrap storage trap = traps[trapId];
        return (
            trap.trapId,
            trap.deployer,
            trap.balance,
            trap.isActive,
            trap.totalAttacks,
            trap.blockedAttacks
        );
    }
    
    function getTotalTraps() external view returns (uint256) {
        return _trapIds;
    }
    
    /**
     * @dev Admin functions
     */
    function updateDeploymentFee(uint256 newFee) external onlyOwner {
        deploymentFee = newFee;
    }
    
    function updateMaxTrapBalance(uint256 newMax) external onlyOwner {
        maxTrapBalance = newMax;
    }
    
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}

