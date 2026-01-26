# Scripts for Country-House

## Security

### security-check.sh
Checks project safety before deployment:
- React/Next.js versions
- .npmrc presence
- Suspicious scripts
- Malicious files
- npm audit

Usage:
```bash
npm run security:check
```

### monitor-cpu.sh
Monitors CPU usage to detect miners:
- Logs when CPU exceeds 80%
- Captures top processes
- Checks mining ports (3333/5555/7777)

Usage:
```bash
npm run security:monitor
# or via cron
```

## Install monitoring in cron

```bash
crontab -e

# Add:
*/5 * * * * /var/www/country-house/scripts/monitor-cpu.sh
```
