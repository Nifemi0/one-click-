// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MEVProtectionSuite {
    // Events
    event ProtectionDeployed(uint256 indexed protectionId, address indexed deployer, uint256 maxGasPrice);
    event MEVAttackDetected(uint256 indexed protectionId, address indexed attacker, string attackType, uint256 gasPrice);
    event ProtectionEnabled(uint256 indexed protectionId, bool enabled);
    event ProtectionStatusUpdated(uint256 indexed protectionId, bool active);
    event AttackBlocked(uint256 indexed protectionId, address indexed attacker, string reason);
    
    // Structs
    struct Protection {
        uint256 protectionId;
        address deployer;
        bool isActive;
        bool protectionEnabled;
        uint256 maxGasPrice;
        uint256 maxSlippage;
        uint256 totalAttacks;
        uint256 blockedAttacks;
        uint256 lastAttackTime;
        mapping(address => uint256) attackerCounts;
        mapping(address => uint256) totalGasUsed;
        string[] detectedPatterns;
    }
    
    struct MEVAttack {
        uint256 protectionId;
        address attacker;
        string attackType;
        uint256 timestamp;
        uint256 gasPrice;
        uint256 gasUsed;
        uint256 value;
        bool blocked;
        string reason;
    }
    
    // State variables
    uint256 private _protectionIds;
    mapping(uint256 => Protection) public protections;
    mapping(uint256 => MEVAttack[]) public mevAttacks;
    
    uint256 public deploymentFee = 0.015 ether;
    uint256 public maxGasPriceLimit = 1000 gwei;
    uint256 public defaultMaxGasPrice = 100 gwei;
    uint256 public defaultMaxSlippage = 5; // 5%
    
    // Modifiers
    modifier onlyProtectionOwner(uint256 protectionId) {
        require(protections[protectionId].deployer == msg.sender, "Not protection owner");
        _;
    }
    
    modifier protectionExists(uint256 protectionId) {
        require(protectionId > 0 && protectionId <= _protectionIds, "Protection does not exist");
        _;
    }
    
    modifier protectionActive(uint256 protectionId) {
        require(protections[protectionId].isActive, "Protection is not active");
        _;
    }
    
    constructor() {
        _protectionIds = 0;
    }
    
    /**
     * @dev Deploy a new MEV protection
     * @param maxGasPrice Maximum allowed gas price
     * @param maxSlippage Maximum allowed slippage percentage
     */
    function deployProtection(uint256 maxGasPrice, uint256 maxSlippage) external payable {
        require(msg.value >= deploymentFee, "Insufficient payment");
        require(maxGasPrice > 0 && maxGasPrice <= maxGasPriceLimit, "Invalid gas price");
        require(maxSlippage > 0 && maxSlippage <= 50, "Invalid slippage"); // Max 50%
        
        _protectionIds++;
        uint256 newProtectionId = _protectionIds;
        
        Protection storage newProtection = protections[newProtectionId];
        newProtection.protectionId = newProtectionId;
        newProtection.deployer = msg.sender;
        newProtection.isActive = true;
        newProtection.protectionEnabled = true;
        newProtection.maxGasPrice = maxGasPrice;
        newProtection.maxSlippage = maxSlippage;
        newProtection.totalAttacks = 0;
        newProtection.blockedAttacks = 0;
        newProtection.lastAttackTime = 0;
        
        emit ProtectionDeployed(newProtectionId, msg.sender, maxGasPrice);
        emit ProtectionEnabled(newProtectionId, true);
    }
    
    /**
     * @dev Check if a transaction is protected against MEV attacks
     * @param protectionId The protection ID to check
     * @param gasPrice The gas price of the transaction
     * @param slippage The slippage percentage
     */
    function checkMEVProtection(uint256 protectionId, uint256 gasPrice, uint256 slippage) external view protectionExists(protectionId) returns (bool) {
        Protection storage protection = protections[protectionId];
        
        if (!protection.isActive || !protection.protectionEnabled) {
            return false;
        }
        
        // Check gas price
        if (gasPrice > protection.maxGasPrice) {
            return false;
        }
        
        // Check slippage
        if (slippage > protection.maxSlippage) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Record a transaction for MEV analysis
     * @param protectionId The protection ID
     * @param sender The address making the transaction
     * @param gasPrice The gas price used
     * @param value The transaction value
     */
    function recordTransaction(uint256 protectionId, address sender, uint256 gasPrice, uint256 value) external protectionExists(protectionId) protectionActive(protectionId) {
        Protection storage protection = protections[protectionId];
        
        if (!protection.protectionEnabled) {
            return;
        }
        
        uint256 currentTime = block.timestamp;
        uint256 lastAttack = protection.lastAttackTime;
        
        // Check for rapid successive transactions (potential MEV)
        if (currentTime - lastAttack < 1) { // Less than 1 second
            protection.attackerCounts[sender]++;
            
            if (protection.attackerCounts[sender] > 3) { // More than 3 transactions in 1 second
                _detectMEVAttack(protectionId, sender, "High Frequency Trading", gasPrice, value);
                return;
            }
        }
        
        // Check gas price manipulation
        if (gasPrice > protection.maxGasPrice) {
            _detectMEVAttack(protectionId, sender, "Gas Price Manipulation", gasPrice, value);
            return;
        }
        
        // Update protection stats
        protection.totalAttacks++;
        protection.lastAttackTime = currentTime;
        protection.totalGasUsed[sender] += gasPrice;
    }
    
    /**
     * @dev Internal function to detect and record MEV attacks
     */
    function _detectMEVAttack(uint256 protectionId, address attacker, string memory attackType, uint256 gasPrice, uint256 value) internal {
        Protection storage protection = protections[protectionId];
        protection.totalAttacks++;
        
        // Record attack
        MEVAttack memory newAttack = MEVAttack({
            protectionId: protectionId,
            attacker: attacker,
            attackType: attackType,
            timestamp: block.timestamp,
            gasPrice: gasPrice,
            gasUsed: gasleft(),
            value: value,
            blocked: true,
            reason: "MEV attack detected"
        });
        
        mevAttacks[protectionId].push(newAttack);
        
        emit MEVAttackDetected(protectionId, attacker, attackType, gasPrice);
        emit AttackBlocked(protectionId, attacker, "MEV attack detected");
        
        // Block the attack
        protection.blockedAttacks++;
        protection.attackerCounts[attacker] = 0; // Reset count
    }
    
    /**
     * @dev Toggle protection status
     */
    function toggleProtection(uint256 protectionId) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        Protection storage protection = protections[protectionId];
        protection.protectionEnabled = !protection.protectionEnabled;
        emit ProtectionEnabled(protectionId, protection.protectionEnabled);
    }
    
    /**
     * @dev Toggle protection active status
     */
    function toggleProtectionStatus(uint256 protectionId) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        Protection storage protection = protections[protectionId];
        protection.isActive = !protection.isActive;
        emit ProtectionStatusUpdated(protectionId, protection.isActive);
    }
    
    /**
     * @dev Update protection parameters
     */
    function updateProtectionParams(uint256 protectionId, uint256 newMaxGasPrice, uint256 newMaxSlippage) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        require(newMaxGasPrice > 0 && newMaxGasPrice <= maxGasPriceLimit, "Invalid gas price");
        require(newMaxSlippage > 0 && newMaxSlippage <= 50, "Invalid slippage");
        
        Protection storage protection = protections[protectionId];
        protection.maxGasPrice = newMaxGasPrice;
        protection.maxSlippage = newMaxSlippage;
    }
    
    /**
     * @dev Get protection information
     */
    function getProtectionInfo(uint256 protectionId) external view protectionExists(protectionId) returns (
        uint256 protectionId_,
        address deployer,
        bool isActive,
        bool protectionEnabled,
        uint256 maxGasPrice,
        uint256 maxSlippage,
        uint256 totalAttacks,
        uint256 blockedAttacks,
        uint256 lastAttackTime
    ) {
        Protection storage protection = protections[protectionId];
        return (
            protection.protectionId,
            protection.deployer,
            protection.isActive,
            protection.protectionEnabled,
            protection.maxGasPrice,
            protection.maxSlippage,
            protection.totalAttacks,
            protection.blockedAttacks,
            protection.lastAttackTime
        );
    }
    
    /**
     * @dev Get MEV attacks for a protection
     */
    function getMEVAttacks(uint256 protectionId) external view protectionExists(protectionId) returns (MEVAttack[] memory) {
        return mevAttacks[protectionId];
    }
    
    /**
     * @dev Get attacker information
     */
    function getAttackerInfo(uint256 protectionId, address attacker) external view protectionExists(protectionId) returns (
        uint256 attackCount,
        uint256 totalGasUsed
    ) {
        Protection storage protection = protections[protectionId];
        return (
            protection.attackerCounts[attacker],
            protection.totalGasUsed[attacker]
        );
    }
    
    /**
     * @dev Get user protections
     */
    function getUserProtections(address user) external view returns (uint256[] memory) {
        uint256[] memory userProtections = new uint256[](_protectionIds);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _protectionIds; i++) {
            if (protections[i].deployer == user) {
                userProtections[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(userProtections, count)
        }
        
        return userProtections;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalProtections,
        uint256 activeProtections,
        uint256 totalAttacks,
        uint256 totalBlockedAttacks
    ) {
        uint256 total = 0;
        uint256 active = 0;
        uint256 attacks = 0;
        uint256 blocked = 0;
        
        for (uint256 i = 1; i <= _protectionIds; i++) {
            Protection storage protection = protections[i];
            if (protection.isActive) {
                active++;
            }
            total++;
            attacks += protection.totalAttacks;
            blocked += protection.blockedAttacks;
        }
        
        return (total, active, attacks, blocked);
    }
    
    /**
     * @dev Reset protection for testing purposes
     */
    function resetProtection(uint256 protectionId) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        Protection storage protection = protections[protectionId];
        protection.totalAttacks = 0;
        protection.blockedAttacks = 0;
        protection.lastAttackTime = 0;
        
        // Clear attacker data
        for (uint256 i = 1; i <= _protectionIds; i++) {
            if (protections[i].deployer == msg.sender) {
                delete protections[i].attackerCounts[msg.sender];
                delete protections[i].totalGasUsed[msg.sender];
            }
        }
    }
    
    /**
     * @dev Get total number of protections
     */
    function getTotalProtections() external view returns (uint256) {
        return _protectionIds;
    }
    
    /**
     * @dev Check if address is blacklisted (for MEV bots)
     */
    function isBlacklisted(address addr) external view returns (bool) {
        // This would typically check against a blacklist of known MEV bot addresses
        // For now, return false as this is a simplified implementation
        return false;
    }
    
    /**
     * @dev Get gas price recommendations
     */
    function getGasPriceRecommendations() external view returns (uint256 low, uint256 medium, uint256 high) {
        // Return recommended gas prices based on current network conditions
        // These would typically be fetched from an oracle or calculated dynamically
        low = 20 gwei;
        medium = 50 gwei;
        high = 100 gwei;
    }
}
