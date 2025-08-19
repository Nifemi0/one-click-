// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiSigVault {
    // Events
    event VaultCreated(uint256 indexed vaultId, address indexed creator, uint256 minSignatures);
    event TransactionProposed(uint256 indexed vaultId, uint256 indexed txId, address indexed proposer, address to, uint256 value);
    event TransactionSigned(uint256 indexed vaultId, uint256 indexed txId, address indexed signer);
    event TransactionRejected(uint256 indexed vaultId, uint256 indexed txId, address indexed rejector);
    event TransactionExecuted(uint256 indexed vaultId, uint256 indexed txId, address indexed executor);
    event MemberAdded(uint256 indexed vaultId, address indexed member);
    event MemberRemoved(uint256 indexed vaultId, address indexed member);
    
    // Structs
    struct Vault {
        uint256 vaultId;
        address creator;
        address[] members;
        uint256 minSignatures;
        bool isActive;
        uint256 balance;
        uint256 totalTransactions;
        mapping(address => bool) isMember;
        mapping(address => uint256) memberIndex;
    }
    
    struct Transaction {
        uint256 txId;
        uint256 vaultId;
        address proposer;
        address to;
        uint256 value;
        bytes data;
        uint256 timestamp;
        bool executed;
        bool rejected;
        address[] signers;
        address[] rejectors;
        mapping(address => bool) hasSigned;
        mapping(address => bool) hasRejected;
    }
    
    // State variables
    uint256 private _vaultIds;
    uint256 private _transactionIds;
    mapping(uint256 => Vault) public vaults;
    mapping(uint256 => Transaction) public transactions;
    
    uint256 public deploymentFee = 0.01 ether;
    uint256 public maxMembers = 10;
    uint256 public maxMinSignatures = 5;
    
    // Modifiers
    modifier onlyVaultMember(uint256 vaultId) {
        require(vaults[vaultId].isMember[msg.sender], "Not vault member");
        _;
    }
    
    modifier vaultExists(uint256 vaultId) {
        require(vaultId > 0 && vaultId <= _vaultIds, "Vault does not exist");
        _;
    }
    
    modifier vaultActive(uint256 vaultId) {
        require(vaults[vaultId].isActive, "Vault is not active");
        _;
    }
    
    constructor() {
        _vaultIds = 0;
        _transactionIds = 0;
    }
    
    /**
     * @dev Create a new multi-signature vault
     * @param members Array of member addresses
     * @param minSignatures Minimum signatures required for transactions
     */
    function createVault(address[] memory members, uint256 minSignatures) external payable {
        require(msg.value >= deploymentFee, "Insufficient payment");
        require(members.length > 0 && members.length <= maxMembers, "Invalid member count");
        require(minSignatures > 0 && minSignatures <= members.length, "Invalid signature threshold");
        require(minSignatures <= maxMinSignatures, "Signature threshold too high");
        
        _vaultIds++;
        uint256 newVaultId = _vaultIds;
        
        Vault storage newVault = vaults[newVaultId];
        newVault.vaultId = newVaultId;
        newVault.creator = msg.sender;
        newVault.minSignatures = minSignatures;
        newVault.isActive = true;
        newVault.balance = 0;
        newVault.totalTransactions = 0;
        
        // Add members
        for (uint256 i = 0; i < members.length; i++) {
            require(members[i] != address(0), "Invalid member address");
            require(!newVault.isMember[members[i]], "Duplicate member");
            
            newVault.members.push(members[i]);
            newVault.isMember[members[i]] = true;
            newVault.memberIndex[members[i]] = i;
        }
        
        // Add creator as member if not already included
        if (!newVault.isMember[msg.sender]) {
            newVault.members.push(msg.sender);
            newVault.isMember[msg.sender] = true;
            newVault.memberIndex[msg.sender] = newVault.members.length - 1;
        }
        
        emit VaultCreated(newVaultId, msg.sender, minSignatures);
    }
    
    /**
     * @dev Propose a new transaction
     * @param vaultId The vault ID
     * @param to Recipient address
     * @param value Amount to send
     * @param data Transaction data
     */
    function proposeTransaction(uint256 vaultId, address to, uint256 value, bytes memory data) 
        external 
        onlyVaultMember(vaultId) 
        vaultExists(vaultId) 
        vaultActive(vaultId) 
    {
        require(to != address(0), "Invalid recipient");
        require(value <= vaults[vaultId].balance, "Insufficient vault balance");
        
        _transactionIds++;
        uint256 newTxId = _transactionIds;
        
        Transaction storage newTx = transactions[newTxId];
        newTx.txId = newTxId;
        newTx.vaultId = vaultId;
        newTx.proposer = msg.sender;
        newTx.to = to;
        newTx.value = value;
        newTx.data = data;
        newTx.timestamp = block.timestamp;
        newTx.executed = false;
        newTx.rejected = false;
        
        vaults[vaultId].totalTransactions++;
        
        emit TransactionProposed(vaultId, newTxId, msg.sender, to, value);
    }
    
    /**
     * @dev Sign a transaction
     * @param txId The transaction ID
     */
    function signTransaction(uint256 txId) external {
        require(txId > 0 && txId <= _transactionIds, "Transaction does not exist");
        
        Transaction storage tx = transactions[txId];
        require(!tx.executed, "Transaction already executed");
        require(!tx.rejected, "Transaction already rejected");
        require(!tx.hasSigned[msg.sender], "Already signed");
        
        Vault storage vault = vaults[tx.vaultId];
        require(vault.isMember[msg.sender], "Not vault member");
        require(vault.isActive, "Vault is not active");
        
        tx.hasSigned[msg.sender] = true;
        tx.signers.push(msg.sender);
        
        emit TransactionSigned(tx.vaultId, txId, msg.sender);
        
        // Check if enough signatures to execute
        if (tx.signers.length >= vault.minSignatures) {
            _executeTransaction(txId);
        }
    }
    
    /**
     * @dev Reject a transaction
     * @param txId The transaction ID
     */
    function rejectTransaction(uint256 txId) external {
        require(txId > 0 && txId <= _transactionIds, "Transaction does not exist");
        
        Transaction storage tx = transactions[txId];
        require(!tx.executed, "Transaction already executed");
        require(!tx.rejected, "Transaction already rejected");
        require(!tx.hasRejected[msg.sender], "Already rejected");
        
        Vault storage vault = vaults[tx.vaultId];
        require(vault.isMember[msg.sender], "Not vault member");
        require(vault.isActive, "Vault is not active");
        
        tx.hasRejected[msg.sender] = true;
        tx.rejectors.push(msg.sender);
        
        emit TransactionRejected(tx.vaultId, txId, msg.sender);
        
        // If majority rejects, mark as rejected
        if (tx.rejectors.length > vault.members.length / 2) {
            tx.rejected = true;
        }
    }
    
    /**
     * @dev Internal function to execute a transaction
     */
    function _executeTransaction(uint256 txId) internal {
        Transaction storage tx = transactions[txId];
        Vault storage vault = vaults[tx.vaultId];
        
        require(tx.signers.length >= vault.minSignatures, "Insufficient signatures");
        require(!tx.executed, "Transaction already executed");
        require(!tx.rejected, "Transaction already rejected");
        
        tx.executed = true;
        
        // Update vault balance
        vault.balance -= tx.value;
        
        // Execute the transaction
        (bool success, ) = payable(tx.to).call{value: tx.value}(tx.data);
        require(success, "Transaction execution failed");
        
        emit TransactionExecuted(tx.vaultId, txId, msg.sender);
    }
    
    /**
     * @dev Add a new member to a vault
     */
    function addMember(uint256 vaultId, address newMember) external onlyVaultMember(vaultId) vaultExists(vaultId) vaultActive(vaultId) {
        Vault storage vault = vaults[vaultId];
        require(newMember != address(0), "Invalid member address");
        require(!vault.isMember[newMember], "Already a member");
        require(vault.members.length < maxMembers, "Max members reached");
        
        vault.members.push(newMember);
        vault.isMember[newMember] = true;
        vault.memberIndex[newMember] = vault.members.length - 1;
        
        emit MemberAdded(vaultId, newMember);
    }
    
    /**
     * @dev Remove a member from a vault
     */
    function removeMember(uint256 vaultId, address member) external onlyVaultMember(vaultId) vaultExists(vaultId) vaultActive(vaultId) {
        Vault storage vault = vaults[vaultId];
        require(vault.isMember[member], "Not a member");
        require(member != vault.creator, "Cannot remove creator");
        require(vault.members.length > vault.minSignatures, "Too few members remaining");
        
        // Remove member
        uint256 memberIndex = vault.memberIndex[member];
        vault.members[memberIndex] = vault.members[vault.members.length - 1];
        vault.memberIndex[vault.members[memberIndex]] = memberIndex;
        vault.members.pop();
        
        delete vault.isMember[member];
        delete vault.memberIndex[member];
        
        emit MemberRemoved(vaultId, member);
    }
    
    /**
     * @dev Deposit funds to a vault
     */
    function depositToVault(uint256 vaultId) external payable onlyVaultMember(vaultId) vaultExists(vaultId) vaultActive(vaultId) {
        require(msg.value > 0, "No funds to deposit");
        vaults[vaultId].balance += msg.value;
    }
    
    /**
     * @dev Get vault information
     */
    function getVaultInfo(uint256 vaultId) external view vaultExists(vaultId) returns (
        uint256 vaultId_,
        address creator,
        address[] memory members,
        uint256 minSignatures,
        bool isActive,
        uint256 balance,
        uint256 totalTransactions
    ) {
        Vault storage vault = vaults[vaultId];
        return (
            vault.vaultId,
            vault.creator,
            vault.members,
            vault.minSignatures,
            vault.isActive,
            vault.balance,
            vault.totalTransactions
        );
    }
    
    /**
     * @dev Get transaction information
     */
    function getTransactionInfo(uint256 txId) external view returns (
        uint256 txId_,
        uint256 vaultId,
        address proposer,
        address to,
        uint256 value,
        uint256 timestamp,
        bool executed,
        bool rejected,
        address[] memory signers,
        address[] memory rejectors
    ) {
        require(txId > 0 && txId <= _transactionIds, "Transaction does not exist");
        
        Transaction storage tx = transactions[txId];
        return (
            tx.txId,
            tx.vaultId,
            tx.proposer,
            tx.to,
            tx.value,
            tx.timestamp,
            tx.executed,
            tx.rejected,
            tx.signers,
            tx.rejectors
        );
    }
    
    /**
     * @dev Get member information
     */
    function getMemberInfo(uint256 vaultId, address member) external view vaultExists(vaultId) returns (bool isMember, uint256 memberIndex) {
        Vault storage vault = vaults[vaultId];
        return (vault.isMember[member], vault.memberIndex[member]);
    }
    
    /**
     * @dev Get user's vaults
     */
    function getUserVaults(address user) external view returns (uint256[] memory) {
        uint256[] memory userVaults = new uint256[](_vaultIds);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _vaultIds; i++) {
            if (vaults[i].isMember[user]) {
                userVaults[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(userVaults, count)
        }
        
        return userVaults;
    }
    
    /**
     * @dev Toggle vault status
     */
    function toggleVaultStatus(uint256 vaultId) external onlyVaultMember(vaultId) vaultExists(vaultId) {
        vaults[vaultId].isActive = !vaults[vaultId].isActive;
    }
    
    /**
     * @dev Update minimum signatures required
     */
    function updateMinSignatures(uint256 vaultId, uint256 newMinSignatures) external onlyVaultMember(vaultId) vaultExists(vaultId) vaultActive(vaultId) {
        Vault storage vault = vaults[vaultId];
        require(newMinSignatures > 0 && newMinSignatures <= vault.members.length, "Invalid signature threshold");
        require(newMinSignatures <= maxMinSignatures, "Signature threshold too high");
        
        vault.minSignatures = newMinSignatures;
    }
}
