#!/usr/bin/env bash
set -euo pipefail
PI_HOST="192.168.1.80"
PI_USER="user"
PI_DIR="/home/${PI_USER}/mirror-mirror/dist"

echo "▶ Building…"
npm run build

echo "▶ Syncing dist/ to ${PI_USER}@${PI_HOST}:${PI_DIR}"
ssh "${PI_USER}@${PI_HOST}" "mkdir -p '${PI_DIR}'"
rsync -av --delete ./dist/ "${PI_USER}@${PI_HOST}:${PI_DIR}/"

echo "▶ Reloading nginx (optional)"
ssh "${PI_USER}@${PI_HOST}" "sudo nginx -t && sudo systemctl reload nginx || true"

echo "✅ Deployed: http://${PI_HOST}/charlottes-magic-mirror/"