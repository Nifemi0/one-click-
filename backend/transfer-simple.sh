#!/bin/bash

echo "🚀 Simple Backend Transfer to VPS..."

# Create a tar archive of the working backend
echo "📦 Creating backend archive..."
tar -czf backend-working.tar.gz \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=*.log \
    --exclude=*.sh \
    --exclude=*.md \
    --exclude=Dockerfile \
    --exclude=render.yaml \
    src/ package.json tsconfig.json .env.example healthcheck.js ecosystem.config.js

echo "✅ Archive created: backend-working.tar.gz"

# Transfer to VPS
echo "📡 Transferring to VPS..."
scp backend-working.tar.gz root@5.231.28.234:/root/

echo "✅ Transfer complete!"
echo ""
echo "🌐 Now SSH to your VPS and run:"
echo "   cd /root"
echo "   tar -xzf backend-working.tar.gz"
echo "   cd backend-working"
echo "   npm install"
echo "   npm run build"
echo "   pm2 delete one-click-backend"
echo "   pm2 start dist/index.js --name 'one-click-backend'"
echo "   pm2 save"
