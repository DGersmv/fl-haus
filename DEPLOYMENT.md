# Deployment Guide for Country-House

> IMPORTANT: This project was updated after CVE-2025-55182.

## Prerequisites

- Node.js 18+
- PM2
- Git
- Ubuntu 20.04+

## Secure deployment

### Option 1: Automated (recommended)

```bash
# Download the secure deploy script from tashi-ani
curl -O https://raw.githubusercontent.com/DGersmv/tashi-ani/master/deploy-country-house-secure.sh

# Make it executable
chmod +x deploy-country-house-secure.sh

# Run it
sudo ./deploy-country-house-secure.sh
```

### Option 2: Manual

```bash
# 1. Clone
git clone https://github.com/DGersmv/country-house.git /var/www/country-house
cd /var/www/country-house

# 2. Security check
npm run security:check

# 3. Create .npmrc (CRITICAL)
cat > .npmrc << 'EOF'
ignore-scripts=true
registry=https://registry.npmjs.org/
package-lock=true
strict-ssl=true
EOF

# 4. Install dependencies without scripts
npm install --ignore-scripts

# 5. Manually run only safe scripts
npx prisma generate

# 6. Configure .env.local
cp .env.local.example .env.local
nano .env.local

# 7. Build
npm run build

# 8. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Monitoring

Add to crontab:

```bash
# CPU check every 5 minutes
*/5 * * * * /var/www/country-house/scripts/monitor-cpu.sh

# Daily security check at 03:00
0 3 * * * cd /var/www/country-house && npm run security:check >> /var/log/country-house-security.log 2>&1
```

Status checks:

```bash
# PM2 status
pm2 status

# CPU usage
top -bn1 | grep "Cpu(s)"

# Logs
pm2 logs country-house --lines 50

# Network connections (no 3333/5555/7777)
netstat -tupln | grep node
```

## Signs of compromise

Investigate immediately if:
- CPU stays above 80%
- PM2 keeps restarting
- Connections on ports 3333/5555/7777
- *.x86_64 files appear
- node_modules > 500MB

## Additional documentation

- [Security deployment guide](../tashi-ani/COUNTRY_HOUSE_SECURITY_DEPLOY.md)
- [Security checklist](../tashi-ani/COUNTRY_HOUSE_CHECKLIST.md)
- [Emergency fix for CVE-2025-55182](../tashi-ani/CVE-2025-55182_URGENT_FIX.md)
