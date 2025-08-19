// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AdvancedHoneypot {
    // Events
    event HoneypotDeployed(address indexed deployer, uint256 indexed trapId);
    event AttackDetected(address indexed attacker, uint256 indexed trapId, string attackType);
    
    // Structs
    struct HoneypotTrap {
        uint256 trapId;
        address deployer;
        uint256 balance;
        bool isActive;
        uint256 totalAttacks;
    }
    
    // State variables
    uint256 private _trapIds;
    mapping(uint256 => HoneypotTrap) public traps;
    
    uint256 public deploymentFee = 0.001 ether;
    
    // Modifiers
    modifier onlyTrapOwner(uint256 trapId) {
        require(traps[trapId].deployer == msg.sender, "Not trap owner");
        _;
    }
    
    constructor() {
        _trapIds = 0;
    }
    
    /**
     * @dev Deploy a new honeypot trap
     * @param initialBalance Initial ETH balance to lure attackers
     */
    function deployHoneypot(uint256 initialBalance) external payable {
        require(msg.value >= deploymentFee + initialBalance, "Insufficient payment");
        require(initialBalance > 0, "Initial balance must be positive");
        
        _trapIds++;
        uint256 newTrapId = _trapIds;
        
        traps[newTrapId] = HoneypotTrap({
            trapId: newTrapId,
            deployer: msg.sender,
            balance: initialBalance,
            isActive: true,
            totalAttacks: 0
        });
        
        emit HoneypotDeployed(msg.sender, newTrapId);
    }
    
    /**
     * @dev Fallback function to catch ETH transfers (honeypot lure)
     */
    receive() external payable {
        _detectAttack(msg.sender, msg.value, "ETH Transfer Attack");
    }
    
    /**
     * @dev Attempt to withdraw funds (this will always fail for attackers)
     */
    function withdraw() external {
        _detectAttack(msg.sender, 0, "Withdrawal Attempt");
        
        // This will always fail for attackers
        require(false, "Withdrawal failed - this is a honeypot");
    }
    
    /**
     * @dev Internal function to detect and record attacks
     */
    function _detectAttack(address attacker, uint256 amount, string memory attackType) internal {
        for (uint256 i = 1; i <= _trapIds; i++) {
            if (traps[i].isActive && traps[i].balance > 0) {
                traps[i].totalAttacks++;
                emit AttackDetected(attacker, i, attackType);
                break;
            }
        }
    }
    
    /**
     * @dev Get trap statistics
     */
    function getTrapStats(uint256 trapId) external view returns (
        uint256 trapId_,
        address deployer,
        uint256 balance,
        bool isActive,
        uint256 totalAttacks
    ) {
        require(trapId > 0 && trapId <= _trapIds, "Trap does not exist");
        HoneypotTrap memory trap = traps[trapId];
        return (
            trap.trapId,
            trap.deployer,
            trap.balance,
            trap.isActive,
            trap.totalAttacks
        );
    }
    
    /**
     * @dev Get total number of traps
     */
    function getTotalTraps() external view returns (uint256) {
        return _trapIds;
    }
}
