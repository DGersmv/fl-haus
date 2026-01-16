#!/bin/bash
# Безопасный скрипт деплоя с защитой от зависаний

set -e

echo "=== Starting safe deployment ==="

cd /var/www/country-house

echo "1. Fetching latest code..."
git fetch origin

echo "2. Resetting to latest version..."
git reset --hard origin/platform227info

echo "3. Installing dependencies..."
npm ci --no-audit --no-fund

echo "4. Building (with timeout protection)..."
# Запускаем сборку с таймаутом и убиваем процесс если зависает
BUILD_PID=""
timeout 300 npm run build:fast &
BUILD_PID=$!

# Ждём завершения или таймаута
wait $BUILD_PID 2>/dev/null
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 124 ] || [ $BUILD_EXIT -ne 0 ]; then
    echo "WARNING: Build timed out or failed (exit: $BUILD_EXIT). Killing any stuck processes..."
    pkill -f "next build" || true
    sleep 2
    
    echo "Trying minimal build with shorter timeout..."
    timeout 180 npm run build:minimal || {
        echo "FATAL: Even minimal build failed! Killing processes..."
        pkill -f "next build" || true
        echo "You may need to manually run: npm run build:minimal"
        exit 1
    }
fi

echo "5. Restarting PM2..."
pm2 restart country-house

echo "=== Deployment completed successfully! ==="
