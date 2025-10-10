#!/usr/bin/env bash
set -euo pipefail

# Publish all packages with a version bump.
# Usage:
#   ./publish.sh [patch|minor|major] [--tag beta]
#
# Notes:
# - Ensure you are logged in: `npm login` (npm whoami must succeed)
# - Ensure you own the package names (scoped or unscoped)

BUMP="${1:-patch}"
shift || true
TAG_ARG="${1:-}"

echo "Checking npm auth..."
if ! npm whoami >/dev/null 2>&1; then
  echo "Error: not logged into npm. Run 'npm login' and retry." >&2
  exit 1
fi

echo "Installing deps..."
pnpm i

echo "Building workspace..."
pnpm -w build

CORE_DIR="packages/core"
echo "\n--- Publishing $CORE_DIR (bump $BUMP) ---"
pushd "$CORE_DIR" >/dev/null
npm version "$BUMP" --no-git-tag-version
CORE_VERSION=$(node -p "require('./package.json').version")
if [ -n "$TAG_ARG" ]; then
  npm publish --access public --tag "${TAG_ARG#--tag }"
else
  npm publish --access public
fi
popd >/dev/null

echo "Core published at version: $CORE_VERSION"

publish_with_core_pin() {
  local pkg_dir="$1"
  echo "\n--- Publishing $pkg_dir (bump $BUMP) ---"
  pushd "$pkg_dir" >/dev/null

  npm version "$BUMP" --no-git-tag-version

  # Temporarily replace workspace:* to pinned core version for npm publish
  if command -v jq >/dev/null 2>&1; then
    cp package.json package.json.bak
    jq ".dependencies |= ( . // {} ) | .dependencies[\"@transactbd/core\"] = (\"^$CORE_VERSION\")" package.json > package.tmp.json || true
    mv package.tmp.json package.json || true
  else
    # Fallback sed replacement (best-effort)
    cp package.json package.json.bak
    sed -E "s/\"@transactbd\\/core\": \"workspace:\*\"/\"@transactbd\\/core\": \"^$CORE_VERSION\"/" package.json > package.tmp.json || true
    mv package.tmp.json package.json || true
  fi

  if [ -n "$TAG_ARG" ]; then
    npm publish --access public --tag "${TAG_ARG#--tag }"
  else
    npm publish --access public
  fi

  # Restore original package.json
  if [ -f package.json.bak ]; then mv -f package.json.bak package.json; fi
  popd >/dev/null
}

publish_with_core_pin "packages/sslcommerz"
publish_with_core_pin "packages/bkash"
publish_with_core_pin "packages/nagad"
publish_with_core_pin "packages/express"

echo "\nAll done."


