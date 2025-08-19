'use client';

import { ethers } from 'ethers';
import { blockchainService } from './blockchain';
// Import Hardhat artifact (ABI + bytecode)
// Path based on hardhat compile output inside frontend/artifacts
// If this path changes, update accordingly.
import artifact from '../../artifacts/contracts/SecurityTrap.sol/SecurityTrap.json';

export interface DeployResult {
	ok: boolean;
	contractAddress?: string;
	transactionHash?: string;
	error?: string;
}

export async function deploySecurityTrapContract(): Promise<DeployResult> {
	try {
		if (typeof window === 'undefined' || !window.ethereum) {
			throw new Error('Wallet provider not found');
		}

		// Ensure Hoodi testnet
		await blockchainService.switchToHoodiTestnet();

		// Get signer from the browser provider
		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();

		const abi = artifact.abi;
		const bytecode: string = artifact.bytecode;
		if (!bytecode || bytecode === '0x') {
			throw new Error('Bytecode missing in artifact');
		}

		const factory = new ethers.ContractFactory(abi, bytecode, signer);
		const contract = await factory.deploy();
		const deployTx = contract.deploymentTransaction();
		const txHash = deployTx?.hash;

		await contract.waitForDeployment();
		const address = await contract.getAddress();

		// Persist for later use
		try {
			localStorage.setItem('userContractAddress', address);
		} catch {}

		return { ok: true, contractAddress: address, transactionHash: txHash };
	} catch (error: any) {
		console.error('Contract deployment failed:', error);
		return { ok: false, error: error?.message || 'Deployment failed' };
	}
}
