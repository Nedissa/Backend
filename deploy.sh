#!/bin/bash
# Deployment script for Medusa backend on VPS
# Run this after git pull or when restarting the server

set -e

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "❌ ADMIN_EMAIL och ADMIN_PASSWORD måste vara satta som miljövariabler."
  echo "   Exempel: ADMIN_EMAIL=admin@techpilots.se ADMIN_PASSWORD='...' ./deploy.sh"
  exit 1
fi

echo "🚀 Deploying Medusa backend..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Navigate to backend
cd apps/backend

echo "🗄️  Running database migrations..."
# --execute-safe-links krävs för att köra icke-interaktivt - utan flaggan
# frågar medusa db:migrate interaktivt om att bekräfta link-synk och hänger
# för evigt i ett skript utan terminal (verifierat lokalt).
npx medusa db:migrate --execute-safe-links

echo "🏗️  Building backend..."
npx medusa build

# Check if admin user exists, create if not
echo "👤 Ensuring admin user exists..."
# medusa user avslutar med exitkod 1 och "already exists" i output om kontot
# redan finns - det är förväntat på deploy nummer två och framåt, inte ett fel.
set +e
MEDUSA_USER_OUTPUT=$(npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" 2>&1)
MEDUSA_USER_EXIT=$?
set -e
echo "$MEDUSA_USER_OUTPUT"
if [ "$MEDUSA_USER_EXIT" -eq 0 ]; then
    echo "✅ Admin user created"
elif echo "$MEDUSA_USER_OUTPUT" | grep -q "already exists"; then
    echo "✅ Admin user already exists"
else
    echo "❌ Failed to create admin user (see output above)"
    exit 1
fi

# Restart PM2
echo "🔄 Restarting PM2..."
cd ../..
pm2 restart medusa --update-env || pm2 start ecosystem.config.js --update-env
pm2 save

echo "✅ Deployment complete!"
echo "📍 Admin panel: http://194.14.207.94:9000/app"
echo "👤 Login: $ADMIN_EMAIL"
