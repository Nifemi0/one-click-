# Render CLI Deployment Script for One-Click Backend (Windows PowerShell)
Write-Host "🚀 Starting Render deployment for One-Click Backend..." -ForegroundColor Green

# Check if render-cli is installed
try {
    $renderVersion = render --version
    Write-Host "✅ Render CLI found: $renderVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Render CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g render-cli
}

# Check if user is logged in to Render
try {
    $user = render whoami
    Write-Host "✅ Logged in as: $user" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Render first:" -ForegroundColor Yellow
    render login
}

# Build the application
Write-Host "🔨 Building the application..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Render
Write-Host "🚀 Deploying to Render..." -ForegroundColor Blue
render deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host "🌐 Your backend should be available at the URL provided by Render" -ForegroundColor Cyan
    Write-Host "📊 Check the deployment status in your Render dashboard" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
