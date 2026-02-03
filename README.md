# Country House

Minimal deployment instructions and S3 backup/restore.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full steps and deploy.sh.

## Первый вход (мастер-админ)

После деплоя или первой миграции в БД нет пользователей. Создать мастер-админа и войти:

```bash
# 1. Создать пользователя с ролью MASTER (email + пароль на твой выбор)
node scripts/create-admin.js твой@email.ru Пароль123

# 2. На сайте нажать «Вход» и войти этим email и паролем
```

Список пользователей: `node scripts/list-users.js`. Сброс пароля: `node scripts/reset-password.js <email> <новый_пароль>`.

## Quick deploy

```bash
git clone https://github.com/DGersmv/country-house.git /var/www/country-house
cd /var/www/country-house

cat > .npmrc << 'EOF'
ignore-scripts=true
registry=https://registry.npmjs.org/
package-lock=true
strict-ssl=true
save-exact=true
EOF

npm install --ignore-scripts
npx prisma generate

cp .env.local.example .env.local
nano .env.local

npm run build
pm2 start ecosystem.config.js
```

## Backup and restore (S3)

```bash
# Create backup and upload to S3
bash scripts/backup-to-s3.sh

# List available backups and restore
bash scripts/restore-from-s3.sh
bash scripts/restore-from-s3.sh db-YYYYMMDD_HHMMSS.sqlite
```
