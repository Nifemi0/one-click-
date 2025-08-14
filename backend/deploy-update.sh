#!/bin/bash

# 🚀 One-Click Backend Update Script
# Use this script to update your backend on VPS after making changes

set -e

echo "🚀 Updating One-Click Backend on VPS..."
echo "📍 VPS: 5.231.28.234"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Configuration
DEPLOY_DIR="/opt/drosera-one-click/one-click/backend"

# Step 1: Navigate to backend directory
print_step "1. Navigating to backend directory..."
cd $DEPLOY_DIR
print_status "Current directory: $(pwd)"

# Step 2: Pull latest changes
print_step "2. Pulling latest changes from GitHub..."
git pull origin main
print_status "Latest changes pulled successfully"

# Step 3: Install dependencies (if package.json changed)
print_step "3. Installing dependencies..."
npm install
print_status "Dependencies installed"

# Step 4: Build the application
print_step "4. Building the application..."
npm run build
print_status "Application built successfully"

# Step 5: Restart PM2
print_step "5. Restarting PM2 process..."
pm2 restart drosera-one-click-backend
print_status "PM2 process restarted"

# Step 6: Wait for startup
print_step "6. Waiting for application to start..."
sleep 5

# Step 7: Health check
print_step "7. Performing health check..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_status "✅ Health check passed!"
else
    print_warning "⚠️ Health check failed, checking logs..."
    pm2 logs drosera-one-click-backend --lines 20
fi

# Step 8: Show status
print_step "8. Final status..."
echo ""
echo "🎉 UPDATE COMPLETED SUCCESSFULLY!"
echo "=================================="
echo "📊 PM2 Status:"
pm2 status

echo ""
print_status "🚀 Your One-Click backend has been updated!"
print_status "📝 Useful commands:"
print_status "   - View logs: pm2 logs drosera-one-click-backend"
print_status "   - Restart: pm2 restart drosera-one-click-backend"
print_status "   - Stop: pm2 stop drosera-one-click-backend"
print_status "   - Monitor: pm2 monit"