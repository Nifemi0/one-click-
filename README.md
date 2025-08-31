# 🚀 Drosera One-Click Security Platform

A comprehensive Web3 security platform for DeFi protection, featuring AI-powered smart contract generation, honeypot detection, and advanced security monitoring.

## 🎯 Features

- **AI-Powered Contract Generation**: OpenAI, Anthropic Claude, and Google Gemini integration
- **Smart Contract Security**: Advanced honeypot detection and vulnerability analysis
- **Multi-Chain Support**: Ethereum, Hoodi Testnet, and other EVM-compatible chains
- **Real-time Monitoring**: Live security alerts and threat detection
- **User Dashboard**: Comprehensive security analytics and trap management
- **API-First Architecture**: RESTful APIs with WebSocket support

## 🏗️ Project Structure

```
drosera-one-click/
├── contracts/                 # Smart contracts (Solidity)
├── frontend/                  # Next.js React frontend
├── backend/                   # Express.js API server
├── scripts/                   # Deployment and utility scripts
├── test/                      # Test files
├── hardhat.config.ts         # Hardhat configuration
├── package.json              # Root dependencies
└── setup-project.sh          # Automated setup script
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm 9+**
- **Git** for version control
- **API Keys** for AI providers (OpenAI, Anthropic, Gemini)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd drosera-one-click

# Run the automated setup script
./setup-project.sh
```

### 2. Manual Setup (Alternative)

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Install smart contract dependencies
cd contracts && npm install && cd ..
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env
```

**Required Environment Variables:**
```env
# AI Provider API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

# Database
DATABASE_URL=your_supabase_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Blockchain
PRIVATE_KEY=your_private_key
HOODI_RPC_URL=https://rpc.hoodi.network
```

### 4. Build and Run

```bash
# Build all components
npm run build:all

# Start development servers
npm run dev

# Or start individually:
npm run frontend:dev    # Frontend on http://localhost:3000
npm run backend:dev     # Backend on http://localhost:3001
```

## 🔧 Development Commands

```bash
# Smart Contracts
npm run compile          # Compile Solidity contracts
npm run test            # Run Hardhat tests

# Frontend
npm run frontend:dev    # Start Next.js dev server
npm run frontend:build  # Build for production

# Backend
npm run backend:dev     # Start Express dev server
npm run backend:build   # Build TypeScript

# Quality Assurance
npm run lint            # Run ESLint on all code
npm run test:all        # Run all tests
npm run clean           # Clean all build artifacts
```

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Smart contract tests
npm run test

# Frontend tests
cd frontend && npm run test

# Backend tests
cd backend && npm run test
```

## 🚀 Deployment

### Frontend (Netlify)
```bash
cd frontend
npm run build
# Deploy to Netlify
```

### Backend (Render/VPS)
```bash
cd backend
npm run build
npm start
```

### Smart Contracts
```bash
# Deploy to Hoodi Testnet
npm run deploy:hoodi

# Deploy to local network
npm run deploy:local
```

## 🔍 Troubleshooting

### Common Issues

#### 1. AI Provider Integration Failing
- **Problem**: API calls succeeding but response parsing failing
- **Solution**: Check API keys and update endpoints in `.env`
- **Debug**: Check logs for specific error messages

#### 2. Smart Contract Compilation Errors
- **Problem**: Missing OpenZeppelin dependencies
- **Solution**: Run `npm install` in root and contracts directories
- **Debug**: Check Hardhat configuration and Solidity version

#### 3. Database Connection Issues
- **Problem**: Supabase connection errors
- **Solution**: Verify `DATABASE_URL` and Supabase project status
- **Debug**: Check network connectivity and credentials

#### 4. Build Failures
- **Problem**: TypeScript compilation errors
- **Solution**: Ensure all dependencies are installed
- **Debug**: Run `npm run lint` to identify issues

### Debug Commands

```bash
# Check dependency status
npm list --depth=0

# Verify TypeScript configuration
npx tsc --noEmit

# Check Hardhat configuration
npx hardhat --version

# Test database connection
node test-db-connection.js
```

## 📚 API Documentation

### AI Contract Generation
```http
POST /api/ai/generate-contract
Content-Type: application/json

{
  "userPrompt": "Create a honeypot detection contract",
  "complexity": "medium",
  "securityLevel": "high"
}
```

### Security Traps
```http
GET /api/traps
GET /api/traps/:id
POST /api/traps
PUT /api/traps/:id
DELETE /api/traps/:id
```

### Blockchain Operations
```http
POST /api/blockchain/deploy
POST /api/blockchain/verify
GET /api/blockchain/status
```

## 🔐 Security Features

- **Input Validation**: Comprehensive request sanitization
- **Rate Limiting**: API abuse prevention
- **Authentication**: JWT-based user management
- **Encryption**: Sensitive data encryption
- **Audit Logging**: Complete operation tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation for new features
- Run linting before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Discord**: [Community Server](https://discord.gg/your-server)

## 🗺️ Roadmap

- [ ] Multi-chain deployment automation
- [ ] Advanced AI contract auditing
- [ ] Real-time threat intelligence
- [ ] Mobile application
- [ ] Enterprise features
- [ ] Community governance

---

**Built with ❤️ by the Drosera Team**