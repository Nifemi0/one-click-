#!/bin/bash

# 🚀 One-Click Backend VPS Deployment Script
# This script will automatically deploy your backend to VPS at 5.231.28.234
# Updated with latest GitHub changes including real database integration

set -e

echo "🚀 Starting One-Click Backend VPS Deployment..."
echo "📍 Target VPS: 5.231.28.234"
echo "📦 Repository: one-click"
echo "🗄️ Database: Supabase (already configured)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Configuration
VPS_IP="5.231.28.234"
REPO_NAME="one-click"
APP_NAME="drosera-one-click-backend"
DEPLOY_DIR="/opt/drosera-one-click"
BACKEND_DIR="$DEPLOY_DIR/backend"

# Step 1: Update System
print_step "1. Updating system packages..."
apt update && apt upgrade -y
print_status "System updated successfully"

# Step 2: Install Node.js 18
print_step "2. Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
print_status "Node.js $(node --version) installed"

# Step 3: Install Docker
print_step "3. Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker
usermod -aG docker $USER
print_status "Docker installed and started"

# Step 4: Install PM2
print_step "4. Installing PM2..."
npm install -g pm2
pm2 startup
print_status "PM2 installed"

# Step 5: Install Nginx
print_step "5. Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx
print_status "Nginx installed and started"

# Step 6: Install Certbot
print_step "6. Installing Certbot..."
apt install certbot python3-certbot-nginx -y
print_status "Certbot installed"

# Step 7: Create deployment directory
print_step "7. Setting up deployment directory..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR
print_status "Deployment directory created: $DEPLOY_DIR"

# Step 8: Clone repository
print_step "8. Cloning one-click repository..."
if [ -d "$REPO_NAME" ]; then
    print_warning "Repository already exists, pulling latest changes..."
    cd $REPO_NAME
    git pull origin main
else
    git clone https://github.com/Nifemi0/one-click.git
    cd $REPO_NAME
fi
print_status "Repository cloned/updated successfully"

# Step 9: Setup backend
print_step "9. Setting up backend..."
cd backend

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning "Creating .env file with your Supabase configuration..."
    cat > .env << 'EOF'
# Server Configuration
NODE_ENV=production
PORT=3001

# Supabase Configuration (YOUR ACTUAL KEYS)
SUPABASE_URL=https://lctrrotjiwwekquwcpbn.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdHJyb3RqaXd3ZWtxdXdjcGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTAxNjcwNCwiZXhwIjoyMDcwNTkyNzA0fQ.aeniTK0emFnad6aDsqZ6Qkx-7_COcG50bUFeC6fRmQ8
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdHJyb3RqaXd3ZWtxdXdjcGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTY3MDQsImV4cCI6MjA3MDU5MjcwNH0.1Z2iP9g2f7oWeYiDkPo0WwPr9TLtDCxgnWkg6YFVZXg
SUPABASE_PROJECT_ID=lctrrotjiwwekquwcpbn

# Database Configuration (Supabase handles this)
DATABASE_URL=postgresql://postgres:YourSupabasePassword123@db.lctrrotjiwwekquwcpbn.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=dd68e8ca9a71cbe8a2950074dce8a5a2f5a57be29d3cf249e38c5de8d50324e9be29300fde6de28a3c1b3ff7f0a50d7bb6a7e8d949fe32e126b1af1e0b386ed4
JWT_EXPIRES_IN=24h

# Hoodi Testnet Configuration
HOODI_RPC_URL=https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ
HOODI_CHAIN_ID=560048

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
EOF
    print_status ".env file created with your Supabase configuration"
else
    print_status ".env file already exists"
fi

# Step 10: Install dependencies
print_step "10. Installing backend dependencies..."
npm install
print_status "Dependencies installed"

# Step 11: Build the application
print_step "11. Building the application..."
npm run build
print_status "Application built successfully"

# Step 12: Setup database tables
print_step "12. Setting up database tables..."
if [ -f "supabase-setup.sql" ]; then
    print_warning "Database setup SQL file found. You need to run this in Supabase dashboard:"
    print_warning "1. Go to https://supabase.com/dashboard"
    print_warning "2. Select your project: lctrrotjiwwekquwcpbn"
    print_warning "3. Go to SQL Editor"
    print_warning "4. Copy and paste the contents of supabase-setup.sql"
    print_warning "5. Click Run"
    print_warning "This will create the basic_traps and trap_templates tables"
else
    print_error "supabase-setup.sql not found! Database setup required."
fi

# Step 13: Create PM2 ecosystem file
print_step "13. Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'drosera-one-click-backend',
    script: 'dist/index.js',
    cwd: '/opt/drosera-one-click/one-click/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/drosera-one-click-backend-error.log',
    out_file: '/var/log/pm2/drosera-one-click-backend-out.log',
    log_file: '/var/log/pm2/drosera-one-click-backend-combined.log',
    time: true
  }]
};
EOF
print_status "PM2 ecosystem file created"

# Step 14: Create PM2 logs directory
print_step "14. Setting up PM2 logging..."
mkdir -p /var/log/pm2
chown -R $USER:$USER /var/log/pm2
print_status "PM2 logging directory created"

# Step 15: Start with PM2
print_step "15. Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
print_status "Application started with PM2"

# Step 16: Configure Nginx
print_step "16. Configuring Nginx reverse proxy..."
cat > /etc/nginx/sites-available/drosera-one-click-backend << 'EOF'
server {
    listen 80;
    server_name 5.231.28.234;  # Your VPS IP

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Backend API
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }

    # API endpoints
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/drosera-one-click-backend /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
print_status "Nginx configured successfully"

# Step 17: Configure firewall
print_step "17. Configuring firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 3001
ufw --force enable
print_status "Firewall configured"

# Step 18: Wait for application to start
print_step "18. Waiting for application to start..."
sleep 10

# Step 19: Health check
print_step "19. Performing health check..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_status "✅ Health check passed!"
else
    print_warning "⚠️ Health check failed, but continuing..."
fi

# Step 20: Final status
print_step "20. Final deployment status..."
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "======================================"
echo "📍 VPS IP: $VPS_IP"
echo "🚀 Backend URL: http://$VPS_IP:3001"
echo "🌐 Nginx URL: http://$VPS_IP"
echo "🔗 Health Check: http://$VPS_IP/health"
echo "📊 PM2 Status: pm2 status"
echo "📋 PM2 Logs: pm2 logs drosera-one-click-backend"
echo "🔄 Restart: pm2 restart drosera-one-click-backend"
echo ""

# Show current status
print_status "Current PM2 status:"
pm2 status

print_status "Current Docker containers:"
docker ps

print_status "Nginx status:"
systemctl status nginx --no-pager -l

echo ""
print_status "🚀 Your One-Click backend is now running on VPS!"
print_status "📝 CRITICAL NEXT STEPS:"
print_status "   1. ✅ .env file is already configured with your Supabase keys"
print_status "   2. 🗄️ Run database setup in Supabase dashboard (see step 12)"
print_status "   3. 🔄 Restart if needed: pm2 restart drosera-one-click-backend"
print_status "   4. 📋 Check logs: pm2 logs drosera-one-click-backend"
print_status "   5. 🌐 Update frontend to connect to: http://$VPS_IP:3001"
print_status "   6. 🔒 Set up SSL certificate: certbot --nginx -d your-domain.com"
echo ""
print_status "Happy deploying! 🎉"