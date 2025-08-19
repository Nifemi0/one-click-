// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FlashLoanDefender {
    // Events
    event ProtectionEnabled(address indexed user, uint256 indexed protectionId);
    event AttackDetected(address indexed attacker, uint256 indexed protectionId, string attackType);
    event ProtectionDisabled(address indexed user, uint256 indexed protectionId);
    
    // Structs
    struct Protection {
        uint256 protectionId;
        address user;
        bool isActive;
        uint256 threshold;
        uint256 totalTransactions;
        uint256 suspiciousTransactions;
        uint256 lastTransactionTime;
        mapping(address => uint256) transactionCounts;
    }
    
    struct AttackPattern {
        uint256 protectionId;
        address attacker;
        string patternType;
        uint256 timestamp;
        uint256 gasUsed;
        uint256 value;
    }
    
    // State variables
    uint256 private _protectionIds;
    mapping(uint256 => Protection) public protections;
    mapping(uint256 => AttackPattern[]) public attackPatterns;
    
    uint256 public deploymentFee = 0.001 ether;
    uint256 public defaultThreshold = 3; // Max transactions per block
    
    // Modifiers
    modifier onlyProtectionOwner(uint256 protectionId) {
        require(protections[protectionId].user == msg.sender, "Not protection owner");
        _;
    }
    
    modifier protectionExists(uint256 protectionId) {
        require(protectionId > 0 && protectionId <= _protectionIds, "Protection does not exist");
        _;
    }
    
    constructor() {
        _protectionIds = 0;
    }
    
    /**
     * @dev Enable flash loan protection for a user
     * @param threshold Maximum transactions allowed per block
     */
    function enableProtection(uint256 threshold) external payable {
        require(msg.value >= deploymentFee, "Insufficient payment");
        require(threshold > 0, "Threshold must be positive");
        
        _protectionIds++;
        uint256 newProtectionId = _protectionIds;
        
        Protection storage newProtection = protections[newProtectionId];
        newProtection.protectionId = newProtectionId;
        newProtection.user = msg.sender;
        newProtection.isActive = true;
        newProtection.threshold = threshold;
        newProtection.totalTransactions = 0;
        newProtection.suspiciousTransactions = 0;
        newProtection.lastTransactionTime = 0;
        
        emit ProtectionEnabled(msg.sender, newProtectionId);
    }
    
    /**
     * @dev Disable protection for a user
     */
    function disableProtection(uint256 protectionId) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        protections[protectionId].isActive = false;
        emit ProtectionDisabled(msg.sender, protectionId);
    }
    
    /**
     * @dev Check if a transaction is protected against flash loan attacks
     * @param protectionId The protection ID to check
     * @param sender The address making the transaction
     */
    function checkProtection(uint256 protectionId, address sender) external view protectionExists(protectionId) returns (bool) {
        Protection storage protection = protections[protectionId];
        
        if (!protection.isActive) {
            return false;
        }
        
        // Check transaction frequency
        uint256 currentBlock = block.number;
        uint256 lastBlock = protection.lastTransactionTime;
        
        if (currentBlock == lastBlock) {
            uint256 txCount = protection.transactionCounts[sender];
            if (txCount >= protection.threshold) {
                return false; // Blocked - too many transactions in this block
            }
        }
        
        return true;
    }
    
    /**
     * @dev Record a transaction for protection analysis
     * @param protectionId The protection ID
     * @param sender The address making the transaction
     * @param value The transaction value
     */
    function recordTransaction(uint256 protectionId, address sender, uint256 value) external protectionExists(protectionId) {
        Protection storage protection = protections[protectionId];
        
        if (!protection.isActive) {
            return;
        }
        
        uint256 currentBlock = block.number;
        uint256 lastBlock = protection.lastTransactionTime;
        
        if (currentBlock == lastBlock) {
            // Same block - increment counter
            protection.transactionCounts[sender]++;
            
            // Check if threshold exceeded
            if (protection.transactionCounts[sender] > protection.threshold) {
                _detectFlashLoanAttack(protectionId, sender, "High Frequency Trading", value);
            }
        } else {
            // New block - reset counters
            protection.transactionCounts[sender] = 1;
            protection.lastTransactionTime = currentBlock;
        }
        
        protection.totalTransactions++;
        protection.lastTransactionTime = block.timestamp;
    }
    
    /**
     * @dev Detect and record flash loan attack patterns
     */
    function _detectFlashLoanAttack(uint256 protectionId, address attacker, string memory patternType, uint256 value) internal {
        Protection storage protection = protections[protectionId];
        protection.suspiciousTransactions++;
        
        // Record attack pattern
        AttackPattern memory newPattern = AttackPattern({
            protectionId: protectionId,
            attacker: attacker,
            patternType: patternType,
            timestamp: block.timestamp,
            gasUsed: gasleft(),
            value: value
        });
        
        attackPatterns[protectionId].push(newPattern);
        
        emit AttackDetected(attacker, protectionId, patternType);
    }
    
    /**
     * @dev Get user protection details
     */
    function getUserProtection(uint256 protectionId) external view protectionExists(protectionId) returns (
        uint256 protectionId_,
        address user,
        bool isActive,
        uint256 threshold,
        uint256 totalTransactions,
        uint256 suspiciousTransactions,
        uint256 lastTransactionTime
    ) {
        Protection storage protection = protections[protectionId];
        return (
            protection.protectionId,
            protection.user,
            protection.isActive,
            protection.threshold,
            protection.totalTransactions,
            protection.suspiciousTransactions,
            protection.lastTransactionTime
        );
    }
    
    /**
     * @dev Get attack details for a protection
     */
    function getAttackDetails(uint256 protectionId) external view protectionExists(protectionId) returns (AttackPattern[] memory) {
        return attackPatterns[protectionId];
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalProtections,
        uint256 activeProtections,
        uint256 totalTransactions,
        uint256 totalSuspiciousTransactions
    ) {
        uint256 total = 0;
        uint256 active = 0;
        uint256 txs = 0;
        uint256 suspicious = 0;
        
        for (uint256 i = 1; i <= _protectionIds; i++) {
            Protection storage protection = protections[i];
            if (protection.isActive) {
                active++;
            }
            total++;
            txs += protection.totalTransactions;
            suspicious += protection.suspiciousTransactions;
        }
        
        return (total, active, txs, suspicious);
    }
    
    /**
     * @dev Update protection thresholds
     */
    function updateThresholds(uint256 protectionId, uint256 newThreshold) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        require(newThreshold > 0, "Threshold must be positive");
        protections[protectionId].threshold = newThreshold;
    }
    
    /**
     * @dev Reset user protection (for testing purposes)
     */
    function resetUserProtection(uint256 protectionId) external onlyProtectionOwner(protectionId) protectionExists(protectionId) {
        Protection storage protection = protections[protectionId];
        protection.totalTransactions = 0;
        protection.suspiciousTransactions = 0;
        protection.lastTransactionTime = 0;
        
        // Clear transaction counts
        for (uint256 i = 1; i <= _protectionIds; i++) {
            if (protections[i].user == msg.sender) {
                delete protections[i].transactionCounts[msg.sender];
            }
        }
    }
}
