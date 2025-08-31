#!/bin/bash

echo "🚀 Setting up Drosera One-Click Project..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Clean existing installations
echo "🧹 Cleaning existing installations..."
rm -rf node_modules frontend/node_modules backend/node_modules
rm -rf package-lock.json frontend/package-lock.json backend/package-lock.json

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install smart contract dependencies
echo "📦 Installing smart contract dependencies..."
cd contracts
npm install
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p artifacts cache dist frontend/.next backend/dist

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your actual API keys and configuration"
fi

# Test smart contract compilation
echo "🔧 Testing smart contract compilation..."
npx hardhat compile

# Test backend build
echo "🔧 Testing backend build..."
cd backend
npm run build
cd ..

# Test frontend build
echo "🔧 Testing frontend build..."
cd frontend
npm run build
cd ..

echo ""
echo "🎉 Project setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your API keys and configuration"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Run 'npm run test:all' to run all tests"
echo "4. Run 'npm run lint' to check code quality"
echo ""
echo "🚀 Happy coding!"