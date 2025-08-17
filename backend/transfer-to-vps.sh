#!/bin/bash

echo "🚀 Transferring Working Backend to VPS..."

# VPS connection details
VPS_IP="5.231.28.234"
VPS_USER="root"
VPS_PASS="SIB8zXjqvNd0zlicatEg"

# Create a clean backup of the working backend
echo "📦 Creating clean backend package..."
rm -rf backend-clean
mkdir -p backend-clean

# Copy only the essential working files
cp -r src/ backend-clean/
cp package.json backend-clean/
cp tsconfig.json backend-clean/
cp .env.example backend-clean/
cp healthcheck.js backend-clean/
cp ecosystem.config.js backend-clean/

# Remove any broken files
rm -f backend-clean/src/routes/rpcTest.ts
rm -f backend-clean/src/routes/marketplace.ts

echo "✅ Clean backend package created"

# Transfer to VPS using scp
echo "📡 Transferring to VPS..."
sshpass -p "$VPS_PASS" scp -r backend-clean/ $VPS_USER@$VPS_IP:/root/backend-working

echo "✅ Transfer complete!"
echo "🌐 Now SSH to your VPS and run:"
echo "   cd /root/backend-working"
echo "   npm install"
echo "   npm run build"
echo "   pm2 start dist/index.js --name 'one-click-backend-new'"
