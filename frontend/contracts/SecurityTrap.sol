// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SecurityTrap {
    struct Trap {
        uint256 id;
        string name;
        string description;
        uint256 rewardPercentage;
        uint256 maxAttackers;
        uint256 deploymentCost;
        address deployer;
        bool isActive;
        uint256 createdAt;
    }
    
    mapping(uint256 => Trap) public traps;
    uint256 private trapCounter;
    
    event TrapDeployed(uint256 indexed trapId, string name, address indexed deployer, uint256 cost);
    
    function deployTrap(
        string memory name,
        string memory description,
        uint256 rewardPercentage,
        uint256 maxAttackers
    ) external payable {
        require(msg.value >= 0.01 ether, "Minimum cost is 0.01 ETH");
        require(rewardPercentage > 0 && rewardPercentage <= 100, "Invalid reward percentage");
        
        trapCounter++;
        
        traps[trapCounter] = Trap({
            id: trapCounter,
            name: name,
            description: description,
            rewardPercentage: rewardPercentage,
            maxAttackers: maxAttackers,
            deploymentCost: msg.value,
            deployer: msg.sender,
            isActive: true,
            createdAt: block.timestamp
        });
        
        emit TrapDeployed(trapCounter, name, msg.sender, msg.value);
    }
    
    function getTrap(uint256 trapId) external view returns (Trap memory) {
        return traps[trapId];
    }
    
    function getTotalTraps() external view returns (uint256) {
        return trapCounter;
    }
}
