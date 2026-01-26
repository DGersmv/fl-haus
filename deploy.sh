#!/bin/bash
set -euo pipefail

APP_DIR="/var/www/country-house"
REPO_URL="https://github.com/DGersmv/country-house.git"
BRANCH="master"
NODE_MAJOR="18"

require_root() {
  if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: Run as root (use sudo)."
    exit 1
  fi
}

APT_UPDATED=0
apt_install() {
  if [ "$APT_UPDATED" -eq 0 ]; then
    apt-get update
    APT_UPDATED=1
  fi
  apt-get install -y "$@"
}

ensure_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Installing missing package for: $1"
    apt_install "$2"
  fi
}

install_node() {
  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "Installing Node.js ${NODE_MAJOR}..."
    ensure_cmd curl curl
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
    apt_install nodejs
  fi
}

install_pm2() {
  if ! command -v pm2 >/dev/null 2>&1; then
    echo "Installing PM2..."
    npm install -g pm2
  fi
}

clone_or_update_repo() {
  mkdir -p /var/www
  if [ -d "${APP_DIR}" ] && [ ! -d "${APP_DIR}/.git" ]; then
    echo "ERROR: ${APP_DIR} exists but is not a git repo."
    echo "Move it aside or remove it, then rerun deploy.sh."
    exit 1
  fi

  if [ -d "${APP_DIR}/.git" ]; then
    echo "Updating repository..."
    git -C "${APP_DIR}" fetch origin "${BRANCH}"
    git -C "${APP_DIR}" checkout "${BRANCH}"
    git -C "${APP_DIR}" pull origin "${BRANCH}"
  else
    echo "Cloning repository..."
    git clone -b "${BRANCH}" "${REPO_URL}" "${APP_DIR}"
  fi
}

setup_npmrc() {
  cat > "${APP_DIR}/.npmrc" << 'EOF'
ignore-scripts=true
registry=https://registry.npmjs.org/
package-lock=true
strict-ssl=true
save-exact=true
EOF
}

setup_env() {
  if [ ! -f "${APP_DIR}/.env.local" ]; then
    cp "${APP_DIR}/.env.local.example" "${APP_DIR}/.env.local"
    echo ""
    echo "Created .env.local from example."
    echo "Edit it now and add AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY."
    read -r -p "Press Enter to open nano..." _
    nano "${APP_DIR}/.env.local"
  fi
}

install_and_build() {
  cd "${APP_DIR}"
  npm install --ignore-scripts
  npx prisma generate
  npm run build
}

restore_db_if_needed() {
  cd "${APP_DIR}"
  echo ""
  echo "S3 restore (optional):"
  bash scripts/restore-from-s3.sh || true
  read -r -p "Enter backup file name to restore (or leave empty to skip): " BACKUP_NAME
  if [ -n "${BACKUP_NAME}" ]; then
    bash scripts/restore-from-s3.sh "${BACKUP_NAME}"
  else
    echo "Skipping restore."
  fi
}

start_app() {
  cd "${APP_DIR}"
  if pm2 describe country-house >/dev/null 2>&1; then
    pm2 restart country-house
  else
    pm2 start ecosystem.config.js
  fi
  pm2 save
  pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
}

main() {
  require_root
  ensure_cmd git git
  ensure_cmd sqlite3 sqlite3
  ensure_cmd aws awscli
  install_node
  install_pm2
  clone_or_update_repo
  setup_npmrc
  setup_env
  install_and_build
  restore_db_if_needed
  start_app

  echo ""
  echo "Done."
  echo "App directory: ${APP_DIR}"
  echo "PM2 status: pm2 status"
}

main "$@"
