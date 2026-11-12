#!/usr/bin/env bash
# Deploy the site: builds with Astro, publishes via nsyte as the named site
# "relaykit" (kind 35128, d=relaykit). NEVER deploys the root site (kind 15128).
# Relays and blossom servers come from .nsite/config.json (override with -r/-s).
#
# Signing: you are prompted for the site key each run (nsec / nbunksec / fresh
# bunker:// URL from your signer) — hidden input, never stored.
# NSYTE_FORCE_ENCRYPTED_STORAGE keeps nsyte itself out of the macOS Keychain
# (its default saves every --sec key there, triggering password prompts).
#
# Extra nsyte args pass straight through, e.g. target a single server:
#   npm run nsite:publish -- -s https://blossom.relayk.it -r wss://relay.samt.st
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
ASTRO="${ROOT}/node_modules/.bin/astro"
NSYTE_VERSION="0.28.0"
NSYTE_DIR="${ROOT}/.tools/nsyte-${NSYTE_VERSION}"
NSYTE_BIN="${NSYTE_DIR}/nsyte"
NSYTE_BASE="https://github.com/sandwichfarm/nsyte/releases/download/v${NSYTE_VERSION}"

if [[ ! -x "$ASTRO" ]]; then
  echo "Run npm install first." >&2
  exit 1
fi
export NSYTE_FORCE_ENCRYPTED_STORAGE=true

echo -n "Site key (nsec…, nbunksec1… or bunker://…): "
read -rs SECRET
echo ""
case "$SECRET" in
  "")  echo "No secret entered — aborting." >&2; exit 1 ;;
  nsec1*|nbunksec1*|bunker://*) ;;
  *)   echo "That doesn't look like an nsec / nbunksec / bunker URL — aborting." >&2; exit 1 ;;
esac

ensure_nsyte() {
  if [[ -x "$NSYTE_BIN" ]]; then
    return 0
  fi
  mkdir -p "$NSYTE_DIR"
  local asset
  case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) asset="nsyte-macos-arm64" ;;
    Darwin-x86_64) asset="nsyte-macos-x64" ;;
    Linux-x86_64|Linux-amd64) asset="nsyte-linux" ;;
    Linux-aarch64|Linux-arm64) asset="nsyte-linux" ;;
    *)
      echo "Unsupported platform: $(uname -s) $(uname -m)" >&2
      exit 1
      ;;
  esac
  echo "Downloading nsyte ${NSYTE_VERSION} (${asset}) into .tools/ …" >&2
  curl -fsSL "${NSYTE_BASE}/${asset}" -o "$NSYTE_BIN"
  chmod +x "$NSYTE_BIN"
}

"$ASTRO" build > /dev/null 2>&1
echo "✓ Built $(find dist -name '*.html' | wc -l | tr -d ' ') pages"
ensure_nsyte

DEPLOY_ARGS=(deploy dist --name relaykit --sec "$SECRET" --fallback=/404.html --skip-secrets-scan --non-interactive --sync)

LOG="$(mktemp)"
DEPLOY_PID=""
trap 'rm -f "$LOG"; [[ -n "$DEPLOY_PID" ]] && kill "$DEPLOY_PID" 2>/dev/null || true' EXIT

echo -n "⏳ Deploying (dots = progress, errors print at the end; Ctrl-C to abort) "

"$NSYTE_BIN" "${DEPLOY_ARGS[@]}" "$@" >"$LOG" 2>&1 &
DEPLOY_PID=$!

while kill -0 "$DEPLOY_PID" 2>/dev/null; do
  sleep 5
  echo -n "."
done

if wait "$DEPLOY_PID"; then
  echo ""
  echo "✓ Deployed — https://relayk.it (gateway refreshes within ~10 min)"
  RELAYS=$(awk '/Relay Manifest Publish Results/{getline; print; exit}' "$LOG")
  SERVERS=$(awk '/Blossom Server Summary/{getline; print; exit}' "$LOG")
  [[ -n "$RELAYS" ]] && echo "Relays:  $RELAYS"
  [[ -n "$SERVERS" ]] && echo "Servers: $SERVERS"
  grep -E '^(Overall|Sync):' "$LOG" || true
  grep -E '^\[ERROR\]|✗' "$LOG" | head -10 || true
  WARNS=$(grep -c '^\[WARN\]' "$LOG" || true)
  [[ "$WARNS" -gt 0 ]] && echo "($WARNS warnings suppressed)"
else
  echo ""
  echo "✗ Deploy failed:"
  grep -E '^\[ERROR\]|✗' "$LOG" | head -20 || true
  echo "—— last 15 lines ——" >&2
  tail -15 "$LOG" >&2
  exit 1
fi
