#!/bin/bash
# Скрипт восстановления базы данных из S3 (Reg.ru)
# Проект: country-house

set -e

# === НАСТРОЙКИ ===
PROJECT_NAME="country-house"
DB_PATH="/var/www/country-house/prisma/dev.db"
LOCAL_BACKUP_DIR="/var/backups/country-house"

# S3 настройки (Reg.ru)
S3_ENDPOINT="https://s3.regru.cloud"
S3_BUCKET="copybases"
S3_PREFIX="${S3_PREFIX:-copybases/}"
S3_INSECURE="${S3_INSECURE:-false}"
S3_CA_BUNDLE="${S3_CA_BUNDLE:-}"

# Загружаем переменные окружения для S3 ключей
if [ -f "/var/www/country-house/.env.local" ]; then
    export $(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY)' /var/www/country-house/.env.local | xargs)
fi

# === ФУНКЦИИ ===
list_backups() {
    echo "=== Доступные бэкапы в S3 ==="
    AWS_ARGS=(--endpoint-url "${S3_ENDPOINT}" --region ru-1)
    if [ "${S3_INSECURE}" = "true" ]; then
        AWS_ARGS+=(--no-verify-ssl)
    fi
    if [ -n "${S3_CA_BUNDLE}" ]; then
        AWS_ARGS+=(--ca-bundle "${S3_CA_BUNDLE}")
    fi
    aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}" "${AWS_ARGS[@]}" | sort -r | head -20
    echo ""
    echo "Для восстановления укажите имя файла:"
    echo "  $0 db-20251219_120000.sqlite"
}

restore_backup() {
    BACKUP_NAME=$1
    
    echo "=== Восстановление базы данных ==="
    echo "Файл: ${BACKUP_NAME}"
    echo ""
    
    # Скачиваем бэкап
    TEMP_FILE="/tmp/${BACKUP_NAME}"
    echo "Скачиваю из S3..."
    AWS_ARGS=(--endpoint-url "${S3_ENDPOINT}" --region ru-1)
    if [ "${S3_INSECURE}" = "true" ]; then
        AWS_ARGS+=(--no-verify-ssl)
    fi
    if [ -n "${S3_CA_BUNDLE}" ]; then
        AWS_ARGS+=(--ca-bundle "${S3_CA_BUNDLE}")
    fi
    aws s3 cp "s3://${S3_BUCKET}/${S3_PREFIX}${BACKUP_NAME}" "${TEMP_FILE}" "${AWS_ARGS[@]}"
    
    if [ ! -f "${TEMP_FILE}" ]; then
        echo "ОШИБКА: Не удалось скачать бэкап!"
        exit 1
    fi
    
    # Распаковка если архив .gz
    if [[ "${BACKUP_NAME}" == *.gz ]]; then
        TEMP_UNPACKED="/tmp/${BACKUP_NAME%.gz}"
        echo "Распаковываю архив..."
        gunzip -c "${TEMP_FILE}" > "${TEMP_UNPACKED}"
        TEMP_FILE="${TEMP_UNPACKED}"
    fi

    # Проверяем целостность
    echo "Проверяю целостность базы..."
    sqlite3 "${TEMP_FILE}" "PRAGMA integrity_check;" > /dev/null
    
    # Создаем резервную копию текущей БД
    if [ -f "${DB_PATH}" ]; then
        CURRENT_BACKUP="${DB_PATH}.before-restore.$(date +%Y%m%d_%H%M%S)"
        echo "Создаю резервную копию текущей БД: ${CURRENT_BACKUP}"
        cp "${DB_PATH}" "${CURRENT_BACKUP}"
    fi
    
    # Останавливаем приложение
    echo "Останавливаю приложение..."
    pm2 stop country-house 2>/dev/null || true
    
    # Восстанавливаем
    echo "Восстанавливаю базу данных..."
    cp "${TEMP_FILE}" "${DB_PATH}"
    
    # Запускаем приложение
    echo "Запускаю приложение..."
    pm2 start country-house 2>/dev/null || true
    
    # Очистка
    rm -f "${TEMP_FILE}"
    
    echo ""
    echo "=== Восстановление завершено ==="
    echo "База данных восстановлена из: ${BACKUP_NAME}"
}

# === MAIN ===
if [ -z "${AWS_ACCESS_KEY_ID}" ] || [ -z "${AWS_SECRET_ACCESS_KEY}" ]; then
    echo "ОШИБКА: S3 ключи не настроены!"
    echo "Добавьте в .env.local:"
    echo "  AWS_ACCESS_KEY_ID=ваш_access_key"
    echo "  AWS_SECRET_ACCESS_KEY=ваш_secret_key"
    exit 1
fi

if [ -z "$1" ]; then
    list_backups
else
    if [ "${RESTORE_YES:-false}" = "true" ]; then
        confirm="yes"
    else
        read -p "Вы уверены, что хотите восстановить базу из $1? (yes/no): " confirm
    fi

    confirm="$(printf '%s' "$confirm" | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')"
    if [ "$confirm" = "yes" ] || [ "$confirm" = "y" ] || [ "$confirm" = "da" ] || [ "$confirm" = "да" ] || [ "$confirm" = "д" ]; then
        restore_backup "$1"
    else
        echo "Отменено."
    fi
fi
