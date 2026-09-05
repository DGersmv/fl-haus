#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for the fl-haus (Country House) app.
# Safe to run repeatedly: it refreshes dependencies, the SQLite schema, and a
# local master-admin used for sign-in testing without clobbering existing edits.
set -euo pipefail

cd "$(dirname "$0")/.."

# SQLite is resolved relative to prisma/schema.prisma, so "file:prisma/production.db"
# lands at prisma/prisma/production.db for the Prisma CLI, the Next.js runtime, and
# the helper scripts alike. Avoid a leading "./" — the helper scripts mis-handle it
# on Linux and treat the path as absolute.
DB_URL="file:prisma/production.db"

# Prisma CLI reads .env; Next.js reads .env.local. Create both only if absent so
# developer overrides survive re-runs.
if [ ! -f .env ]; then
  cat > .env <<EOF
DATABASE_URL="${DB_URL}"
EOF
fi

if [ ! -f .env.local ]; then
  cat > .env.local <<EOF
# Local development environment (Cloud Agent). SQLite-backed, self-contained.
DATABASE_URL="${DB_URL}"

# Master admin: this email is treated as the master (matches the seeded admin user).
MASTER_ADMIN_EMAIL="admin@fl-haus.local"

# JWT signing secret (development only)
JWT_SECRET="dev-local-jwt-secret-change-me"

NODE_ENV="development"
PORT=3000
EOF
fi

# Install dependencies from the lockfile (postinstall runs "prisma generate").
npm ci

# Ensure the Prisma client is generated even if postinstall was skipped.
npx prisma generate

# Create/upgrade the SQLite schema.
npx prisma migrate deploy

# Seed a local master-admin for sign-in testing. The helper exits non-zero when the
# user already exists, so ignore that on re-runs.
node scripts/create-admin.js admin@fl-haus.local Admin12345 "Master Admin" || true

echo "fl-haus install complete."
