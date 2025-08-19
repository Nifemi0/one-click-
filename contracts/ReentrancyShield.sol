// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ReentrancyShield {
    // Events
    event ShieldDeployed(uint256 indexed shieldId, address indexed deployer, uint256 maxDepth);
    event ReentrancyDetected(uint256 indexed shieldId, address indexed attacker, uint256 depth, string attackType);
    event ProtectionEnabled(uint256 indexed shieldId, bool enabled);
    event ShieldStatusUpdated(uint256 indexed shieldId, bool active);
    event AttackBlocked(uint256 indexed shieldId, address indexed attacker, string reason);
    
    // Structs
    struct Shield {
        uint256 shieldId;
        address deployer;
        bool isActive;
        bool protectionEnabled;
        uint256 maxDepth;
        uint256 currentDepth;
        uint256 totalAttacks;
        uint256 blockedAttacks;
        uint256 lastAttackTime;
        mapping(address => uint256) attackerDepths;
        mapping(address => uint256) attackCounts;
        string[] detectedPatterns;
    }
    
    struct AttackRecord {
        uint256 shieldId;
        address attacker;
        uint256 depth;
        string attackType;
        uint256 timestamp;
        uint256 gasUsed;
        bool blocked;
        string reason;
    }
    
    // State variables
    uint256 private _shieldIds;
    mapping(uint256 => Shield) public shields;
    mapping(uint256 => AttackRecord[]) public attackRecords;
    
    uint256 public deploymentFee = 0.005 ether;
    uint256 public maxShieldDepth = 10;
    uint256 public defaultMaxDepth = 3;
    
    // Modifiers
    modifier onlyShieldOwner(uint256 shieldId) {
        require(shields[shieldId].deployer == msg.sender, "Not shield owner");
        _;
    }
    
    modifier shieldExists(uint256 shieldId) {
        require(shieldId > 0 && shieldId <= _shieldIds, "Shield does not exist");
        _;
    }
    
    modifier shieldActive(uint256 shieldId) {
        require(shields[shieldId].isActive, "Shield is not active");
        _;
    }
    
    constructor() {
        _shieldIds = 0;
    }
    
    /**
     * @dev Deploy a new reentrancy shield
     * @param maxDepth Maximum allowed call depth
     */
    function deployShield(uint256 maxDepth) external payable {
        require(msg.value >= deploymentFee, "Insufficient payment");
        require(maxDepth > 0 && maxDepth <= maxShieldDepth, "Invalid depth");
        
        _shieldIds++;
        uint256 newShieldId = _shieldIds;
        
        Shield storage newShield = shields[newShieldId];
        newShield.shieldId = newShieldId;
        newShield.deployer = msg.sender;
        newShield.isActive = true;
        newShield.protectionEnabled = true;
        newShield.maxDepth = maxDepth;
        newShield.currentDepth = 0;
        newShield.totalAttacks = 0;
        newShield.blockedAttacks = 0;
        newShield.lastAttackTime = 0;
        
        emit ShieldDeployed(newShieldId, msg.sender, maxDepth);
        emit ProtectionEnabled(newShieldId, true);
    }
    
    /**
     * @dev Check if a call is protected against reentrancy
     * @param shieldId The shield ID to check
     * @param caller The address making the call
     */
    function checkReentrancy(uint256 shieldId, address caller) external view shieldExists(shieldId) returns (bool) {
        Shield storage shield = shields[shieldId];
        
        if (!shield.isActive || !shield.protectionEnabled) {
            return false;
        }
        
        // Check current call depth
        if (shield.currentDepth >= shield.maxDepth) {
            return false; // Blocked - max depth exceeded
        }
        
        // Check if caller has exceeded their depth limit
        if (shield.attackerDepths[caller] >= shield.maxDepth) {
            return false; // Blocked - caller depth exceeded
        }
        
        return true;
    }
    
    /**
     * @dev Record a call attempt for reentrancy detection
     * @param shieldId The shield ID
     * @param caller The address making the call
     */
    function recordCall(uint256 shieldId, address caller) external shieldExists(shieldId) shieldActive(shieldId) {
        Shield storage shield = shields[shieldId];
        
        if (!shield.protectionEnabled) {
            return;
        }
        
        uint256 currentDepth = shield.attackerDepths[caller];
        uint256 newDepth = currentDepth + 1;
        
        // Check if this exceeds max depth
        if (newDepth > shield.maxDepth) {
            _detectReentrancyAttack(shieldId, caller, newDepth, "Depth Exceeded");
            return;
        }
        
        // Update depth
        shield.attackerDepths[caller] = newDepth;
        shield.currentDepth = newDepth;
        shield.lastAttackTime = block.timestamp;
        
        // Check for rapid successive calls (potential reentrancy)
        uint256 lastAttack = shield.lastAttackTime;
        uint256 currentTime = block.timestamp;
        
        if (currentTime - lastAttack < 1) { // Less than 1 second
            shield.attackCounts[caller]++;
            
            if (shield.attackCounts[caller] > 5) { // More than 5 calls in 1 second
                _detectReentrancyAttack(shieldId, caller, newDepth, "Rapid Successive Calls");
            }
        }
    }
    
    /**
     * @dev Internal function to detect and record reentrancy attacks
     */
    function _detectReentrancyAttack(uint256 shieldId, address attacker, uint256 depth, string memory attackType) internal {
        Shield storage shield = shields[shieldId];
        shield.totalAttacks++;
        
        // Record attack
        AttackRecord memory newAttack = AttackRecord({
            shieldId: shieldId,
            attacker: attacker,
            depth: depth,
            attackType: attackType,
            timestamp: block.timestamp,
            gasUsed: gasleft(),
            blocked: true,
            reason: "Reentrancy detected"
        });
        
        attackRecords[shieldId].push(newAttack);
        
        emit ReentrancyDetected(shieldId, attacker, depth, attackType);
        emit AttackBlocked(shieldId, attacker, "Reentrancy detected");
        
        // Block the attack
        shield.blockedAttacks++;
        shield.attackerDepths[attacker] = 0; // Reset depth
        shield.attackCounts[attacker] = 0; // Reset count
    }
    
    /**
     * @dev Toggle shield protection status
     */
    function toggleProtection(uint256 shieldId) external onlyShieldOwner(shieldId) shieldExists(shieldId) {
        Shield storage shield = shields[shieldId];
        shield.protectionEnabled = !shield.protectionEnabled;
        emit ProtectionEnabled(shieldId, shield.protectionEnabled);
    }
    
    /**
     * @dev Toggle shield active status
     */
    function toggleShield(uint256 shieldId) external onlyShieldOwner(shieldId) shieldExists(shieldId) {
        Shield storage shield = shields[shieldId];
        shield.isActive = !shield.isActive;
        emit ShieldStatusUpdated(shieldId, shield.isActive);
    }
    
    /**
     * @dev Update shield parameters
     */
    function updateShieldParams(uint256 shieldId, uint256 newMaxDepth) external onlyShieldOwner(shieldId) shieldExists(shieldId) {
        require(newMaxDepth > 0 && newMaxDepth <= maxShieldDepth, "Invalid depth");
        shields[shieldId].maxDepth = newMaxDepth;
    }
    
    /**
     * @dev Get shield information
     */
    function getShieldInfo(uint256 shieldId) external view shieldExists(shieldId) returns (
        uint256 shieldId_,
        address deployer,
        bool isActive,
        bool protectionEnabled,
        uint256 maxDepth,
        uint256 currentDepth,
        uint256 totalAttacks,
        uint256 blockedAttacks,
        uint256 lastAttackTime
    ) {
        Shield storage shield = shields[shieldId];
        return (
            shield.shieldId,
            shield.deployer,
            shield.isActive,
            shield.protectionEnabled,
            shield.maxDepth,
            shield.currentDepth,
            shield.totalAttacks,
            shield.blockedAttacks,
            shield.lastAttackTime
        );
    }
    
    /**
     * @dev Get attack records for a shield
     */
    function getAttackRecords(uint256 shieldId) external view shieldExists(shieldId) returns (AttackRecord[] memory) {
        return attackRecords[shieldId];
    }
    
    /**
     * @dev Get attacker information
     */
    function getAttackerInfo(uint256 shieldId, address attacker) external view shieldExists(shieldId) returns (
        uint256 depth,
        uint256 attackCount,
        uint256 lastAttackTime
    ) {
        Shield storage shield = shields[shieldId];
        return (
            shield.attackerDepths[attacker],
            shield.attackCounts[attacker],
            shield.lastAttackTime
        );
    }
    
    /**
     * @dev Get user shields
     */
    function getUserShields(address user) external view returns (uint256[] memory) {
        uint256[] memory userShields = new uint256[](_shieldIds);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _shieldIds; i++) {
            if (shields[i].deployer == user) {
                userShields[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(userShields, count)
        }
        
        return userShields;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalShields,
        uint256 activeShields,
        uint256 totalAttacks,
        uint256 totalBlockedAttacks
    ) {
        uint256 total = 0;
        uint256 active = 0;
        uint256 attacks = 0;
        uint256 blocked = 0;
        
        for (uint256 i = 1; i <= _shieldIds; i++) {
            Shield storage shield = shields[i];
            if (shield.isActive) {
                active++;
            }
            total++;
            attacks += shield.totalAttacks;
            blocked += shield.blockedAttacks;
        }
        
        return (total, active, attacks, blocked);
    }
    
    /**
     * @dev Reset shield for testing purposes
     */
    function resetShield(uint256 shieldId) external onlyShieldOwner(shieldId) shieldExists(shieldId) {
        Shield storage shield = shields[shieldId];
        shield.currentDepth = 0;
        shield.totalAttacks = 0;
        shield.blockedAttacks = 0;
        shield.lastAttackTime = 0;
        
        // Clear attacker data
        for (uint256 i = 1; i <= _shieldIds; i++) {
            if (shields[i].deployer == msg.sender) {
                delete shields[i].attackerDepths[msg.sender];
                delete shields[i].attackCounts[msg.sender];
            }
        }
    }
    
    /**
     * @dev Get total number of shields
     */
    function getTotalShields() external view returns (uint256) {
        return _shieldIds;
    }
}
