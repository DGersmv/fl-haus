# Country House

Minimal deployment instructions and S3 backup/restore.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full steps and deploy.sh.

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
