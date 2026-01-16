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
# Запускаем сборку в фоне с таймаутом
timeout 600 npm run build:fast || {
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "ERROR: Build timed out! Trying minimal build..."
        timeout 300 npm run build:minimal || {
            echo "FATAL: Even minimal build failed!"
            exit 1
        }
    else
        echo "ERROR: Build failed with exit code $EXIT_CODE"
        exit $EXIT_CODE
    fi
}

echo "5. Restarting PM2..."
pm2 restart country-house

echo "=== Deployment completed successfully! ==="
