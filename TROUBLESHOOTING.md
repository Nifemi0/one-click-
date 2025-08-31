# 🔧 Troubleshooting Guide

This guide covers common issues and their solutions for the Drosera One-Click Security Platform.

## 🚨 Critical Issues (Production Blocking)

### 1. AI Provider Integration Failures

#### Problem: OpenAI API calls succeeding but failing during response parsing
**Symptoms:**
- API calls return 200 status
- Response parsing throws errors
- Contract generation fails

**Solutions:**
```bash
# Check API key validity
curl -H "Authorization: Bearer YOUR_OPENAI_KEY" \
     https://api.openai.com/v1/models

# Verify response format
# Check if response.data.choices[0].message.content exists
```

**Debug Steps:**
1. Check API key in `.env` file
2. Verify OpenAI account has credits
3. Check response structure in logs
4. Test with simple prompt first

#### Problem: Gemini 404 errors
**Symptoms:**
- 404 errors on Gemini API calls
- Endpoint not found errors

**Solutions:**
```bash
# Update to latest Gemini endpoints
# Use gemini-1.5-flash or gemini-1.5-pro
# Check API key permissions
```

**Debug Steps:**
1. Verify Gemini API key is valid
2. Check if API is enabled in Google Cloud Console
3. Test with different model endpoints
4. Check rate limits

### 2. Smart Contract Compilation Issues

#### Problem: Missing OpenZeppelin contract dependencies
**Symptoms:**
- `ParserError: Source "@openzeppelin/contracts/access/Ownable.sol" not found`
- Hardhat compilation fails

**Solutions:**
```bash
# Install OpenZeppelin contracts
npm install @openzeppelin/contracts

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Verify Hardhat configuration
npx hardhat compile
```

**Debug Steps:**
1. Check `package.json` for OpenZeppelin dependency
2. Verify `node_modules/@openzeppelin` exists
3. Check Hardhat configuration paths
4. Ensure Solidity version compatibility

#### Problem: Hardhat compilation replaced with mock results
**Symptoms:**
- Contracts not actually compiling
- Mock results in production
- No artifacts generated

**Solutions:**
```bash
# Force real compilation
npx hardhat clean
npx hardhat compile --force

# Check Hardhat configuration
cat hardhat.config.ts

# Verify Solidity compiler
npx hardhat --version
```

### 3. Database Connection Failures

#### Problem: Supabase connection errors
**Symptoms:**
- Database connection timeouts
- Authentication failures
- Schema not initialized

**Solutions:**
```bash
# Test database connection
node test-db-connection.js

# Check environment variables
echo $DATABASE_URL

# Verify Supabase project status
# Check if project is paused or deleted
```

**Debug Steps:**
1. Verify `DATABASE_URL` format
2. Check Supabase project status
3. Test network connectivity
4. Verify database credentials

## 🔧 Dependency & Build Issues

### 4. Root Package Dependencies

#### Problem: Missing @openzeppelin/contracts
**Solution:**
```bash
# Move to dependencies (not devDependencies)
npm install @openzeppelin/contracts --save

# Update package.json
{
  "dependencies": {
    "@openzeppelin/contracts": "^5.4.0"
  }
}
```

#### Problem: Outdated Hardhat version
**Solution:**
```bash
# Update to latest stable version
npm install hardhat@latest

# Check compatibility
npx hardhat --version
```

### 5. Frontend Dependencies

#### Problem: Next.js version outdated
**Solution:**
```bash
cd frontend
npm install next@latest react@latest react-dom@latest
```

#### Problem: Missing Hardhat dependencies
**Solution:**
```bash
cd frontend
npm install hardhat @nomicfoundation/hardhat-toolbox
```

### 6. Backend Dependencies

#### Problem: Missing contract validation dependencies
**Solution:**
```bash
cd backend
npm install @openzeppelin/contracts hardhat
```

## 🏗️ Architecture & Structure Issues

### 7. Project Structure Inconsistencies

#### Problem: Duplicate directories
**Solution:**
```bash
# Consolidate smart contract directories
rm -rf smart-contracts/
mv contracts/ smart-contracts/
ln -s smart-contracts contracts

# Clean up artifacts
rm -rf artifacts/ cache/
```

#### Problem: Mixed configurations
**Solution:**
```bash
# Standardize Hardhat config
cp hardhat.config.ts contracts/
cp hardhat.config.ts backend/

# Update paths in each config
```

### 8. Configuration Files

#### Problem: Outdated network configurations
**Solution:**
```bash
# Update Hardhat config with latest RPC URLs
# Add fallback RPC providers
# Update chain IDs
```

## 🧪 Testing & Quality Assurance

### 9. Testing Infrastructure

#### Problem: Missing test coverage
**Solution:**
```bash
# Install testing frameworks
npm install --save-dev jest @types/jest

# Create test configuration
# Add test scripts to package.json
```

### 10. Code Quality

#### Problem: Missing ESLint configuration
**Solution:**
```bash
# Install ESLint
npm install --save-dev eslint @typescript-eslint/eslint-plugin

# Create .eslintrc.js
# Add lint scripts
```

## 📚 Documentation & Deployment

### 11. Documentation Gaps

#### Problem: Outdated project structure
**Solution:**
```bash
# Update README.md
# Add API documentation
# Create deployment guides
```

### 12. Deployment Issues

#### Problem: Environment variable management
**Solution:**
```bash
# Create .env.example
# Document required variables
# Add validation scripts
```

## 🔐 Security & Compliance

### 13. Security Issues

#### Problem: Exposed API keys
**Solution:**
```bash
# Move to environment variables
# Add .env to .gitignore
# Use secret management services
```

### 14. Smart Contract Security

#### Problem: Missing contract auditing
**Solution:**
```bash
# Install security tools
npm install --save-dev slither-analyzer mythril

# Add security testing to CI/CD
# Implement formal verification
```

## 📱 Frontend Specific Issues

### 17. UI/UX Issues

#### Problem: Responsive design problems
**Solution:**
```bash
# Test on multiple devices
# Use browser dev tools
# Implement mobile-first design
```

### 18. State Management

#### Problem: Missing error boundaries
**Solution:**
```bash
# Implement React Error Boundaries
# Add loading states
# Handle offline scenarios
```

## 🌐 Blockchain Integration

### 19. Web3 Issues

#### Problem: Multi-chain wallet support
**Solution:**
```bash
# Implement wallet connection
# Add network switching
# Handle different chain IDs
```

### 20. Contract Deployment

#### Problem: Missing deployment scripts
**Solution:**
```bash
# Create deployment scripts
# Add verification scripts
# Implement upgrade mechanisms
```

## 📊 Monitoring & Observability

### 21. Monitoring Gaps

#### Problem: Missing APM
**Solution:**
```bash
# Integrate monitoring tools
# Add error tracking
# Implement logging
```

### 22. Logging & Debugging

#### Problem: Missing structured logging
**Solution:**
```bash
# Implement Winston or Pino
# Add log aggregation
# Create debug tools
```

## 🚀 Quick Fix Commands

### Emergency Fixes
```bash
# Complete project reset
./setup-project.sh

# Quick dependency fix
npm run install:all

# Build everything
npm run build:all

# Clean and rebuild
npm run clean && npm run setup
```

### Health Checks
```bash
# Check all services
npm run health:check

# Verify dependencies
npm run verify:deps

# Test compilation
npm run test:compile
```

## 📞 Getting Help

### When to Ask for Help
- After trying all solutions in this guide
- When error messages are unclear
- For architecture decisions
- Performance optimization

### How to Ask for Help
1. **Describe the problem clearly**
2. **Include error messages**
3. **Share your environment details**
4. **Show what you've already tried**
5. **Provide relevant code snippets**

### Useful Resources
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/your-server)
- [Documentation Wiki](https://github.com/your-repo/wiki)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/drosera)

---

**Remember: Most issues can be resolved by following this guide step by step! 🚀**