// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DroseraRegistry - Central Registry for All Security Traps
 * @dev This contract maintains a registry of all deployed security traps
 * @dev Each trap gets a unique ID and is tracked with metadata
 * @dev Only authorized deployers can register traps
 */
contract DroseraRegistry is Ownable, ReentrancyGuard {
    
    // Events
    event TrapRegistered(uint256 indexed trapId, address indexed deployer, string trapType);
    event TrapUpdated(uint256 indexed trapId, string newStatus);
    event DeployerAuthorized(address indexed deployer);
    event DeployerRevoked(address indexed deployer);

    // Trap metadata
    struct TrapInfo {
        uint256 trapId;
        address deployer;
        string trapType;
        string status;
        uint256 deploymentTime;
        uint256 lastUpdateTime;
        bool isActive;
    }

    // State variables
    mapping(uint256 => TrapInfo) public traps;
    mapping(address => bool) public authorizedDeployers;
    mapping(address => uint256[]) public deployerTraps;
    
    uint256 public nextTrapId = 1;
    uint256 public totalTraps = 0;
    uint256 public totalDeployers = 0;

    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedDeployers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    modifier trapExists(uint256 trapId) {
        require(traps[trapId].deployer != address(0), "Trap does not exist");
        _;
    }

    constructor() {
        authorizedDeployers[msg.sender] = true;
        totalDeployers = 1;
    }

    /**
     * @dev Register a new security trap
     * @param trapType Type of trap being deployed
     * @param trapAddress Address of the deployed trap contract
     */
    function registerTrap(string memory trapType, address trapAddress) external onlyAuthorized {
        uint256 trapId = nextTrapId++;
        
        traps[trapId] = TrapInfo({
            trapId: trapId,
            deployer: msg.sender,
            trapType: trapType,
            status: "Active",
            deploymentTime: block.timestamp,
            lastUpdateTime: block.timestamp,
            isActive: true
        });

        deployerTraps[msg.sender].push(trapId);
        totalTraps++;

        emit TrapRegistered(trapId, msg.sender, trapType);
    }

    /**
     * @dev Update trap status
     * @param trapId ID of the trap to update
     * @param newStatus New status for the trap
     */
    function updateTrapStatus(uint256 trapId, string memory newStatus) external onlyAuthorized trapExists(trapId) {
        require(
            traps[trapId].deployer == msg.sender || msg.sender == owner(),
            "Only trap deployer or owner can update"
        );

        traps[trapId].status = newStatus;
        traps[trapId].lastUpdateTime = block.timestamp;
        traps[trapId].isActive = keccak256(abi.encodePacked(newStatus)) == keccak256(abi.encodePacked("Active"));

        emit TrapUpdated(trapId, newStatus);
    }

    /**
     * @dev Authorize a new deployer
     * @param deployer Address to authorize
     */
    function authorizeDeployer(address deployer) external onlyOwner {
        require(!authorizedDeployers[deployer], "Already authorized");
        
        authorizedDeployers[deployer] = true;
        totalDeployers++;

        emit DeployerAuthorized(deployer);
    }

    /**
     * @dev Revoke deployer authorization
     * @param deployer Address to revoke
     */
    function revokeDeployer(address deployer) external onlyOwner {
        require(authorizedDeployers[deployer], "Not authorized");
        require(deployer != owner(), "Cannot revoke owner");
        
        authorizedDeployers[deployer] = false;
        totalDeployers--;

        emit DeployerRevoked(deployer);
    }

    /**
     * @dev Get all traps for a specific deployer
     * @param deployer Address of the deployer
     * @return Array of trap IDs
     */
    function getDeployerTraps(address deployer) external view returns (uint256[] memory) {
        return deployerTraps[deployer];
    }

    /**
     * @dev Get total number of traps
     * @return Total number of registered traps
     */
    function getTotalTraps() external view returns (uint256) {
        return totalTraps;
    }

    /**
     * @dev Get total number of deployers
     * @return Total number of authorized deployers
     */
    function getTotalDeployers() external view returns (uint256) {
        return totalDeployers;
    }

    /**
     * @dev Check if an address is authorized to deploy traps
     * @param deployer Address to check
     * @return True if authorized
     */
    function isAuthorizedDeployer(address deployer) external view returns (bool) {
        return authorizedDeployers[deployer];
    }
}
