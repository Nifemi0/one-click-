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
    event TrapRegistered(
        uint256 indexed trapId,
        address indexed contractAddress,
        address indexed deployer,
        string trapType,
        string trapName,
        uint256 deploymentTimestamp
    );
    
    event TrapUpdated(
        uint256 indexed trapId,
        string newStatus,
        uint256 updateTimestamp
    );
    
    event RegistryAccessGranted(address indexed user, uint256 timestamp);
    event RegistryAccessRevoked(address indexed user, uint256 timestamp);
    
    // Structs
    struct TrapInfo {
        uint256 trapId;
        address contractAddress;
        address deployer;
        string trapType;
        string trapName;
        string description;
        uint256 deploymentTimestamp;
        string status;
        bool isActive;
        uint256 lastActivity;
        string metadata; // JSON string for additional data
    }
    
    struct TrapStats {
        uint256 totalTraps;
        uint256 activeTraps;
        uint256 totalDeployers;
        mapping(address => uint256) trapsPerDeployer;
        mapping(string => uint256) trapsPerType;
    }
    
    // State Variables
    uint256 private _trapIdCounter;
    
    mapping(uint256 => TrapInfo) public traps;
    mapping(address => uint256[]) public deployerTraps;
    mapping(address => bool) public authorizedDeployers;
    mapping(string => uint256[]) public trapsByType;
    
    TrapStats public stats;
    
    // Constants
    uint256 public constant MAX_TRAP_NAME_LENGTH = 100;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 500;
    uint256 public constant MAX_METADATA_LENGTH = 1000;
    
    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedDeployers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    modifier trapExists(uint256 trapId) {
        require(traps[trapId].contractAddress != address(0), "Trap does not exist");
        _;
    }
    
    modifier validTrapData(
        address contractAddress,
        string memory trapType,
        string memory trapName
    ) {
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(trapType).length > 0, "Trap type cannot be empty");
        require(bytes(trapName).length > 0, "Trap name cannot be empty");
        require(bytes(trapName).length <= MAX_TRAP_NAME_LENGTH, "Trap name too long");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        _trapIdCounter = 1; // Start from 1
        authorizedDeployers[msg.sender] = true;
        emit RegistryAccessGranted(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Register a new security trap
     * @param contractAddress The deployed contract address
     * @param trapType The type of security trap
     * @param trapName The name of the trap
     * @param description Description of the trap
     * @param metadata Additional metadata as JSON string
     * @return trapId The unique ID assigned to the trap
     */
    function registerTrap(
        address contractAddress,
        string memory trapType,
        string memory trapName,
        string memory description,
        string memory metadata
    ) 
        external 
        onlyAuthorized 
        nonReentrant
        validTrapData(contractAddress, trapType, trapName)
        returns (uint256 trapId)
    {
        // Validate description length
        require(bytes(description).length <= MAX_DESCRIPTION_LENGTH, "Description too long");
        require(bytes(metadata).length <= MAX_METADATA_LENGTH, "Metadata too long");
        
        // Check if contract is already registered
        require(!isContractRegistered(contractAddress), "Contract already registered");
        
        // Generate new trap ID
        trapId = _trapIdCounter;
        _trapIdCounter++;
        
        // Create trap info
        TrapInfo memory newTrap = TrapInfo({
            trapId: trapId,
            contractAddress: contractAddress,
            deployer: msg.sender,
            trapType: trapType,
            trapName: trapName,
            description: description,
            deploymentTimestamp: block.timestamp,
            status: "Active",
            isActive: true,
            lastActivity: block.timestamp,
            metadata: metadata
        });
        
        // Store trap info
        traps[trapId] = newTrap;
        
        // Update mappings
        deployerTraps[msg.sender].push(trapId);
        trapsByType[trapType].push(trapId);
        
        // Update stats
        stats.totalTraps++;
        stats.activeTraps++;
        stats.trapsPerDeployer[msg.sender]++;
        stats.trapsPerType[trapType]++;
        
        // Update total deployers if this is a new deployer
        if (stats.trapsPerDeployer[msg.sender] == 1) {
            stats.totalDeployers++;
        }
        
        emit TrapRegistered(
            trapId,
            contractAddress,
            msg.sender,
            trapType,
            trapName,
            block.timestamp
        );
        
        return trapId;
    }
    
    /**
     * @dev Update trap status and metadata
     * @param trapId The ID of the trap to update
     * @param newStatus New status string
     * @param newMetadata Updated metadata
     */
    function updateTrap(
        uint256 trapId,
        string memory newStatus,
        string memory newMetadata
    ) 
        external 
        onlyAuthorized 
        trapExists(trapId)
    {
        TrapInfo storage trap = traps[trapId];
        
        // Only deployer or owner can update
        require(
            msg.sender == trap.deployer || msg.sender == owner(),
            "Not authorized to update this trap"
        );
        
        // Update trap info
        trap.status = newStatus;
        trap.metadata = newMetadata;
        trap.lastActivity = block.timestamp;
        
        // Update active status based on new status
        if (keccak256(bytes(newStatus)) == keccak256(bytes("Inactive")) ||
            keccak256(bytes(newStatus)) == keccak256(bytes("Disabled"))) {
            if (trap.isActive) {
                trap.isActive = false;
                stats.activeTraps--;
            }
        } else if (keccak256(bytes(newStatus)) == keccak256(bytes("Active"))) {
            if (!trap.isActive) {
                trap.isActive = true;
                stats.activeTraps++;
            }
        }
        
        emit TrapUpdated(trapId, newStatus, block.timestamp);
    }
    
    /**
     * @dev Get trap information by ID
     * @param trapId The ID of the trap
     * @return trapInfo The complete trap information
     */
    function getTrapInfo(uint256 trapId) 
        external 
        view 
        trapExists(trapId)
        returns (TrapInfo memory trapInfo)
    {
        return traps[trapId];
    }
    
    /**
     * @dev Get all traps deployed by a specific address
     * @param deployer The deployer address
     * @return trapIds Array of trap IDs
     */
    function getDeployerTraps(address deployer) 
        external 
        view 
        returns (uint256[] memory trapIds)
    {
        return deployerTraps[deployer];
    }
    
    /**
     * @dev Get all traps of a specific type
     * @param trapType The type of trap
     * @return trapIds Array of trap IDs
     */
    function getTrapsByType(string memory trapType) 
        external 
        view 
        returns (uint256[] memory trapIds)
    {
        return trapsByType[trapType];
    }
    
    /**
     * @dev Check if a contract address is already registered
     * @param contractAddress The contract address to check
     * @return bool True if already registered
     */
    function isContractRegistered(address contractAddress) 
        public 
        view 
        returns (bool)
    {
        for (uint256 i = 1; i < _trapIdCounter; i++) {
            if (traps[i].contractAddress == contractAddress) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get total number of traps
     * @return uint256 Total trap count
     */
    function getTotalTraps() external view returns (uint256) {
        return stats.totalTraps;
    }
    
    /**
     * @dev Get total number of active traps
     * @return uint256 Active trap count
     */
    function getActiveTraps() external view returns (uint256) {
        return stats.activeTraps;
    }
    
    /**
     * @dev Get total number of deployers
     * @return uint256 Total deployer count
     */
    function getTotalDeployers() external view returns (uint256) {
        return stats.totalDeployers;
    }
    
    /**
     * @dev Get number of traps deployed by a specific address
     * @param deployer The deployer address
     * @return uint256 Number of traps
     */
    function getDeployerTrapCount(address deployer) external view returns (uint256) {
        return stats.trapsPerDeployer[deployer];
    }
    
    /**
     * @dev Get number of traps of a specific type
     * @param trapType The trap type
     * @return uint256 Number of traps
     */
    function getTrapTypeCount(string memory trapType) external view returns (uint256) {
        return stats.trapsPerType[trapType];
    }
    
    /**
     * @dev Grant registry access to a user
     * @param user The user address to grant access to
     */
    function grantAccess(address user) external onlyOwner {
        require(user != address(0), "Invalid user address");
        authorizedDeployers[user] = true;
        emit RegistryAccessGranted(user, block.timestamp);
    }
    
    /**
     * @dev Revoke registry access from a user
     * @param user The user address to revoke access from
     */
    function revokeAccess(address user) external onlyOwner {
        require(user != address(0), "Invalid user address");
        authorizedDeployers[user] = false;
        emit RegistryAccessRevoked(user, block.timestamp);
    }
    
    /**
     * @dev Emergency function to disable a trap (owner only)
     * @param trapId The ID of the trap to disable
     */
    function emergencyDisableTrap(uint256 trapId) external onlyOwner trapExists(trapId) {
        TrapInfo storage trap = traps[trapId];
        trap.status = "Emergency Disabled";
        trap.isActive = false;
        trap.lastActivity = block.timestamp;
        
        if (trap.isActive) {
            stats.activeTraps--;
        }
        
        emit TrapUpdated(trapId, "Emergency Disabled", block.timestamp);
    }
    
    /**
     * @dev Get paginated traps for frontend display
     * @param page The page number (0-based)
     * @param pageSize The number of traps per page
     * @return trapInfos Array of trap information
     * @return totalPages Total number of pages
     */
    function getTrapsPaginated(uint256 page, uint256 pageSize) 
        external 
        view 
        returns (TrapInfo[] memory trapInfos, uint256 totalPages)
    {
        require(pageSize > 0 && pageSize <= 100, "Invalid page size");
        
        uint256 totalTraps = stats.totalTraps;
        totalPages = (totalTraps + pageSize - 1) / pageSize;
        
        uint256 startIndex = page * pageSize;
        uint256 endIndex = startIndex + pageSize;
        
        if (startIndex >= totalTraps) {
            return (new TrapInfo[](0), totalPages);
        }
        
        if (endIndex > totalTraps) {
            endIndex = totalTraps;
        }
        
        uint256 resultSize = endIndex - startIndex;
        trapInfos = new TrapInfo[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            trapInfos[i] = traps[startIndex + i + 1]; // +1 because trap IDs start from 1
        }
        
        return (trapInfos, totalPages);
    }
}
