#!/usr/bin/env bash
# ============================================================
# Deploy script — equivalent of .github/workflows/deploy.yml
# Run on the dev server (Contabo) directly. Usage:
#
#   DEV_GIT=<github_pat> bash scripts/deploy.sh
#
# Or via SSH from your machine:
#   ssh user@host 'DEV_GIT=<token> bash -s' < scripts/deploy.sh
#
# Optional env overrides:
#   APP_DIR     directory where the repo lives (default: project-node/umkm-ds-fe)
#   BRANCH      git branch to deploy            (default: demo)
#   PM2_NAME    pm2 process name                (default: umkm-ds-fe)
#   PORT        port for `next start`           (default: 3099)
#   NODE_VER    nvm node version to use         (default: 22.7)
#   REPO_URL    git remote (used on fresh clone) (default: github.com/katadatacoid/umkm-ds-fe.git)
# ============================================================

set -euo pipefail

APP_DIR="${APP_DIR:-project-node/umkm-ds-fe}"
BRANCH="${BRANCH:-demo}"
PM2_NAME="${PM2_NAME:-umkm-ds-fe}"
PORT="${PORT:-3099}"
NODE_VER="${NODE_VER:-22.7}"
REPO_URL="${REPO_URL:-github.com/katadatacoid/umkm-ds-fe.git}"

if [ -z "${DEV_GIT:-}" ]; then
  echo "ERROR: DEV_GIT (GitHub PAT) is required." >&2
  exit 1
fi

cd "$APP_DIR"

# Set up GitHub authentication using the token
git config --global credential.helper store
echo "https://:${DEV_GIT}@github.com" > ~/.git-credentials

# Fresh clone if .git missing
if [ ! -d ".git" ]; then
  git clone "https://${DEV_GIT}@${REPO_URL}" .
fi

# Source nvm to set up Node.js environment
export NVM_DIR="${NVM_DIR:-/home/katadata/.nvm}"
# shellcheck disable=SC1091
source "$NVM_DIR/nvm.sh"

# Pull the latest changes from the target branch
git checkout "$BRANCH"
git pull origin "$BRANCH"

which npm
which pm2

# Install dependencies
npm install

# Build the Next.js app
npm run build

nvm use "$NODE_VER"

# Stop and delete any existing pm2 process before starting a new one
pm2 stop "$PM2_NAME"   || true
pm2 delete "$PM2_NAME" || true

# Start the app with PM2
pm2 start npm --name "$PM2_NAME" -- start -- --port "$PORT"
pm2 save

echo "===== SUCCESS ====="
