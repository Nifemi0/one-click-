#!/bin/bash

echo "🚀 Starting One-Click Backend Deployment on VPS..."

# Check current status
echo "📊 Checking current status..."
ps aux | grep node | grep -v grep || echo "No Node.js processes running"
pm2 status || echo "PM2 not running"

# Navigate to one-click directory
echo "📁 Navigating to one-click directory..."
cd one-click- || { echo "❌ one-click- directory not found"; exit 1; }

# Check if backend exists
if [ -d "backend" ]; then
    echo "✅ Backend directory found"
    cd backend
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm install
    
    # Build the project
    echo "🔨 Building backend..."
    npm run build
    
    # Start with PM2
    echo "🚀 Starting with PM2..."
    pm2 delete one-click-backend 2>/dev/null || true
    pm2 start dist/index.js --name "one-click-backend"
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    echo "✅ Backend deployed successfully!"
    pm2 status
    
    # Check if it's running
    echo "🌐 Checking if backend is accessible..."
    sleep 5
    curl -s http://localhost:3000/health || echo "Health check failed"
    
else
    echo "❌ Backend directory not found in one-click-"
    echo "Available directories:"
    ls -la
fi
