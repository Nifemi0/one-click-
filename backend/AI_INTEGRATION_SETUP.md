# AI Integration Setup Guide

## Overview
The Enhanced AI feature integrates with multiple AI companies' APIs to automatically generate, compile, and deploy smart contracts based on user specifications.

## Supported AI Providers

### 1. OpenAI GPT-4
- **Service**: Advanced language model for contract generation
- **API Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-4`
- **Setup**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 2. Anthropic Claude
- **Service**: AI assistant specialized in code generation
- **API Endpoint**: `https://api.anthropic.com/v1/messages`
- **Model**: `claude-3-sonnet-20240229`
- **Setup**: Get API key from [Anthropic Console](https://console.anthropic.com/)

### 3. Google Gemini
- **Service**: Google's AI model for code generation
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Model**: `gemini-pro`
- **Setup**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Environment Variables

Add these to your `.env` file:

```bash
# AI Integration API Keys
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Backend Configuration
PORT=3001
HOST=0.0.0.0
FRONTEND_URL=https://oneclick1.netlify.app

# Database Configuration
DATABASE_URL=your-database-url-here

# Blockchain Configuration
PRIVATE_KEY=your-private-key-here
RPC_URL=https://rpc.hoodi.network
CHAIN_ID=560048
```

## API Endpoints

### Generate Contract
```
POST /api/ai-contracts/generate
```
Generates smart contract code using AI based on user specifications.

### Compile Contract
```
POST /api/ai-contracts/compile
```
Compiles the AI-generated Solidity contract.

### Deploy Contract
```
POST /api/ai-contracts/deploy
```
Deploys the compiled contract to Hoodi testnet.

### Full Workflow
```
POST /api/ai-contracts/generate-and-deploy
```
Complete workflow: generate, compile, and deploy in one request.

### Service Status
```
GET /api/ai-contracts/status
```
Check the status of all AI services and dependencies.

## How It Works

1. **User Input**: User describes their security contract requirements
2. **AI Generation**: Multiple AI providers attempt to generate the contract
3. **Fallback**: If all AI providers fail, a template-based fallback is used
4. **Compilation**: Generated Solidity code is compiled using Hardhat
5. **Deployment**: Compiled contract is deployed to Hoodi testnet
6. **Result**: User receives contract address and transaction details

## Features

- **Multi-Provider Fallback**: If one AI service fails, others are tried
- **Automatic Compilation**: Uses existing Hardhat compilation service
- **Blockchain Deployment**: Integrates with existing deployment service
- **Risk Assessment**: AI provides security risk analysis
- **Gas Estimation**: Automatic gas cost calculation
- **Real-time Progress**: Step-by-step workflow updates

## Security Considerations

- API keys are stored securely in environment variables
- All generated contracts are validated before compilation
- Deployment requires proper wallet authentication
- Risk assessment is provided for all generated contracts

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all required API keys are set in environment
2. **Compilation Failures**: Check Solidity version compatibility
3. **Deployment Failures**: Verify wallet connection and testnet ETH balance
4. **Rate Limiting**: AI services may have rate limits

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=ai-integration:*
```

## Cost Considerations

- **OpenAI**: ~$0.03 per 1K tokens
- **Anthropic**: ~$0.015 per 1K tokens  
- **Gemini**: ~$0.0005 per 1K tokens
- **Blockchain**: Gas costs for deployment (varies by network)

## Future Enhancements

- [ ] Support for more AI providers (Cohere, AI21, etc.)
- [ ] Custom prompt templates
- [ ] Contract optimization suggestions
- [ ] Security audit integration
- [ ] Multi-network deployment support
