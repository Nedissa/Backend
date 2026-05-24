#!/bin/bash
# Deployment script for Medusa backend on VPS
# Run this after git pull or when restarting the server

set -e

echo "🚀 Deploying Medusa backend..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Navigate to backend
cd apps/backend

# Check if admin user exists, create if not
echo "👤 Ensuring admin user exists..."
if ! npx medusa user admin@techpilots.se > /dev/null 2>&1; then
    echo "Creating admin user..."
    npx medusa user -e admin@techpilots.se -p Admin123!
    echo "✅ Admin user created"
else
    echo "✅ Admin user already exists"
fi

# Restart PM2
echo "🔄 Restarting PM2..."
cd ../..
pm2 restart medusa --update-env || pm2 start ecosystem.config.js --update-env
pm2 save

echo "✅ Deployment complete!"
echo "📍 Admin panel: http://194.14.207.94:9000/app"
echo "👤 Login: admin@techpilots.se / Admin123!"
