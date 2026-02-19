#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT_DIR/.env"
  set +a
fi

if [[ -f "$ROOT_DIR/.env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT_DIR/.env.local"
  set +a
fi

export SANITY_STUDIO_PROJECT_ID="${SANITY_STUDIO_PROJECT_ID:-${SANITY_PROJECT_ID:-}}"
export SANITY_STUDIO_DATASET="${SANITY_STUDIO_DATASET:-${SANITY_DATASET:-}}"

cd "$ROOT_DIR/sanity"
sanity "$@"
