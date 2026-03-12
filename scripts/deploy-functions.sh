#!/bin/bash
set -e

# Deploy script for Firebase Cloud Functions
# Handles workspace:* dependencies by copying shared packages as local file deps

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FUNCTIONS_DIR="$ROOT_DIR/functions"
PACKAGES_DIR="$ROOT_DIR/packages"

# Codebases to deploy (pass as args, or default to all configured)
CODEBASES="${@:-identity autograde levelup analytics}"

echo "=== LevelUp Cloud Functions Deploy ==="
echo "Root: $ROOT_DIR"
echo "Deploying: $CODEBASES"
echo ""

# Step 1: Build shared packages
echo ">>> Building shared packages..."
cd "$ROOT_DIR"
pnpm --filter @levelup/shared-types run build
pnpm --filter @levelup/shared-services run build
echo "✓ Shared packages built"
echo ""

# Step 2: For each function codebase, bundle workspace deps
for codebase in $CODEBASES; do
  FUNC_DIR="$FUNCTIONS_DIR/$codebase"
  if [ ! -d "$FUNC_DIR" ]; then
    echo "⚠ Skipping $codebase - directory not found"
    continue
  fi

  echo ">>> Preparing $codebase..."

  # Create .local-deps directory
  LOCAL_DEPS="$FUNC_DIR/.local-deps"
  rm -rf "$LOCAL_DEPS"
  mkdir -p "$LOCAL_DEPS"

  # Check if this codebase needs shared-types
  if grep -q '"@levelup/shared-types"' "$FUNC_DIR/package.json"; then
    echo "  Bundling shared-types..."
    TYPES_DEST="$LOCAL_DEPS/shared-types"
    mkdir -p "$TYPES_DEST"
    cp -r "$PACKAGES_DIR/shared-types/dist" "$TYPES_DEST/"
    cp "$PACKAGES_DIR/shared-types/package.json" "$TYPES_DEST/"
  fi

  # Check if this codebase needs shared-services
  if grep -q '"@levelup/shared-services"' "$FUNC_DIR/package.json"; then
    echo "  Bundling shared-services..."
    SERVICES_DEST="$LOCAL_DEPS/shared-services"
    mkdir -p "$SERVICES_DEST"
    cp -r "$PACKAGES_DIR/shared-services/dist" "$SERVICES_DEST/"
    cp "$PACKAGES_DIR/shared-services/package.json" "$SERVICES_DEST/"
    # shared-services depends on shared-types too
    if [ -d "$LOCAL_DEPS/shared-types" ]; then
      # Update shared-services package.json to point to sibling shared-types
      cd "$SERVICES_DEST"
      node -e "
        const pkg = require('./package.json');
        if (pkg.dependencies && pkg.dependencies['@levelup/shared-types']) {
          pkg.dependencies['@levelup/shared-types'] = 'file:../shared-types';
        }
        require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
      "
      cd "$ROOT_DIR"
    fi
  fi

  # Backup original package.json and replace workspace:* refs with file: refs
  cp "$FUNC_DIR/package.json" "$FUNC_DIR/package.json.bak"
  cd "$FUNC_DIR"
  node -e "
    const fs = require('fs');
    const pkg = require('./package.json');
    const sections = ['dependencies', 'devDependencies'];
    for (const section of sections) {
      if (!pkg[section]) continue;
      for (const [name, version] of Object.entries(pkg[section])) {
        if (version === 'workspace:*') {
          if (name === '@levelup/shared-types') {
            pkg[section][name] = 'file:.local-deps/shared-types';
          } else if (name === '@levelup/shared-services') {
            pkg[section][name] = 'file:.local-deps/shared-services';
          }
        }
      }
    }
    // Move shared packages from devDeps to deps (they're needed at runtime)
    if (pkg.devDependencies) {
      for (const [name, version] of Object.entries(pkg.devDependencies)) {
        if (name.startsWith('@levelup/') && String(version).startsWith('file:')) {
          if (!pkg.dependencies) pkg.dependencies = {};
          pkg.dependencies[name] = version;
          delete pkg.devDependencies[name];
        }
      }
    }
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
  "
  cd "$ROOT_DIR"
  echo "  ✓ $codebase prepared"
done

echo ""
echo ">>> Deploying functions..."

# Step 3: Deploy
DEPLOY_TARGETS=""
for codebase in $CODEBASES; do
  DEPLOY_TARGETS="$DEPLOY_TARGETS,functions:$codebase"
done
DEPLOY_TARGETS="${DEPLOY_TARGETS#,}"

npx firebase deploy --only "$DEPLOY_TARGETS"
DEPLOY_EXIT=$?

# Step 4: Cleanup - restore original package.json files
echo ""
echo ">>> Cleaning up..."
for codebase in $CODEBASES; do
  FUNC_DIR="$FUNCTIONS_DIR/$codebase"
  if [ -f "$FUNC_DIR/package.json.bak" ]; then
    mv "$FUNC_DIR/package.json.bak" "$FUNC_DIR/package.json"
    rm -rf "$FUNC_DIR/.local-deps"
    echo "  ✓ $codebase restored"
  fi
done

if [ $DEPLOY_EXIT -eq 0 ]; then
  echo ""
  echo "=== Deploy successful! ==="
else
  echo ""
  echo "=== Deploy failed (exit code: $DEPLOY_EXIT) ==="
  exit $DEPLOY_EXIT
fi
