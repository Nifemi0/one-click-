#!/bin/bash

# Render CLI Deployment Script for One-Click Backend
echo "🚀 Starting Render deployment for One-Click Backend..."

# Check if render-cli is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    npm install -g render-cli
fi

# Check if user is logged in to Render
if ! render whoami &> /dev/null; then
    echo "🔐 Please login to Render first:"
    render login
fi

# Build the application
echo "🔨 Building the application..."
npm run build

# Deploy to Render
echo "🚀 Deploying to Render..."
render deploy

echo "✅ Deployment completed!"
echo "🌐 Your backend should be available at the URL provided by Render"
echo "📊 Check the deployment status in your Render dashboard"
