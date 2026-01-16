#!/bin/bash
# Скрипт для сборки с таймаутом

set -e

echo "Starting build with 10 minute timeout..."

# Запускаем сборку с таймаутом 10 минут
timeout 600 npm run build || {
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "ERROR: Build timed out after 10 minutes!"
        exit 1
    else
        echo "ERROR: Build failed with exit code $EXIT_CODE"
        exit $EXIT_CODE
    fi
}

echo "Build completed successfully!"
