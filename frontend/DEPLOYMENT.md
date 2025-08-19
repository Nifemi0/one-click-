# 🚀 Smart Contract Deployment Guide

## Prerequisites

1. **MetaMask Wallet** with Hoodi testnet ETH
2. **Private Key** for deployment (DO NOT SHARE)
3. **Hoodi Testnet RPC**: `https://rpc.hoodi.network`
4. **Chain ID**: `560048`

## Step 1: Environment Setup

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Edit `.env.local` and add your private key:
```bash
PRIVATE_KEY=your_private_key_here
```

3. Get Hoodi testnet ETH from faucet (if needed)

## Step 2: Compile Contracts

```bash
npm run compile
```

## Step 3: Deploy to Hoodi Testnet

```bash
npm run deploy:hoodi
```

## Step 4: Update Frontend

After successful deployment, copy the contract address and update:

1. **Frontend Environment**: Add to `.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_here
```

2. **Backend Environment**: Update backend with contract address

## Step 5: Verify Contract (Optional)

```bash
npm run verify:hoodi
```

## Step 6: Test Deployment

1. Build and deploy frontend
2. Test wallet connection
3. Test trap deployment with real ETH
4. Verify transaction on Hoodi explorer

## Troubleshooting

- **Gas Issues**: Ensure sufficient Hoodi testnet ETH
- **Network Issues**: Verify MetaMask is on Hoodi testnet
- **Contract Issues**: Check Hardhat configuration
- **Frontend Issues**: Verify contract address is set

## Security Notes

- Never commit private keys
- Use testnet for development
- Verify contract code before mainnet
- Test thoroughly before production use
