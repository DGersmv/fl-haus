# Deployment Guide for Country-House

This guide covers the minimal steps to deploy the site and manage S3 backups.

## Prerequisites

- Node.js 20+
- PM2
- Git
- Ubuntu 20.04+

## 1) Deploy

### Option A: Single deploy script (recommended)

```bash
git clone https://github.com/DGersmv/country-house.git /var/www/country-house
cd /var/www/country-house
chmod +x deploy.sh
sudo ./deploy.sh
```

### Option B: Manual steps

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
pm2 save
pm2 startup
```

## 2) Restore existing DB from S3

The app uses SQLite at:
`/var/www/country-house/prisma/dev.db`

```bash
cd /var/www/country-house

# List available backups
bash scripts/restore-from-s3.sh

# Restore a specific backup
bash scripts/restore-from-s3.sh db-YYYYMMDD_HHMMSS.sqlite
```

## 3) Create a new backup

```bash
cd /var/www/country-house
bash scripts/backup-to-s3.sh
```

## Required environment variables

Add these to `.env.local`:

```
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```
