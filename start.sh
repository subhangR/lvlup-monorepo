#!/usr/bin/env bash
# =============================================================================
# LevelUp Platform — Start All Apps
# =============================================================================
# Starts all frontend apps in the background and prints a summary of URLs
# and default credentials for testing.
#
# Usage:
#   ./start.sh          — start all apps
#   ./start.sh stop     — stop all running apps started by this script
#   ./start.sh status   — show running status
# =============================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT/.start-pids"
LOG_DIR="$ROOT/.start-logs"

# ── Port / App registry ──────────────────────────────────────────────────────
# Format: "label|dir|port|description"
APPS=(
  "Super Admin (LevelUp)|$ROOT/apps/super-admin|4567|System-wide platform admin"
  "School Admin           |$ROOT/apps/admin-web|4568|Tenant / school admin portal"
  "Teacher Portal         |$ROOT/apps/teacher-web|4569|Teacher dashboard"
  "Student Portal         |$ROOT/apps/student-web|4570|Student learning portal"
  "Parent Portal          |$ROOT/apps/parent-web|4571|Parent tracking portal"
  "Autograde Super Admin  |$ROOT/autograde/apps/super-admin|4572|Autograde platform admin"
  "Autograde Client Admin |$ROOT/autograde/apps/client-admin|4573|Autograde school admin"
  "Autograde Scanner      |$ROOT/autograde/apps/scanner-app|4574|Answer-sheet scanner app"
)

# ── Helpers ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; RESET='\033[0m'

banner() {
  echo ""
  echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${BOLD}${CYAN}║              LevelUp Platform — App Launcher                 ║${RESET}"
  echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════╝${RESET}"
  echo ""
}

print_app_table() {
  echo -e "${BOLD}  Apps & URLs${RESET}"
  echo -e "  ${DIM}──────────────────────────────────────────────────────────────${RESET}"
  printf "  %-28s %-6s  %s\n" "App" "Port" "URL"
  echo -e "  ${DIM}──────────────────────────────────────────────────────────────${RESET}"
  for entry in "${APPS[@]}"; do
    IFS='|' read -r label _dir port _desc <<< "$entry"
    printf "  ${GREEN}%-28s${RESET} ${YELLOW}%-6s${RESET}  ${CYAN}http://localhost:%s${RESET}\n" \
      "$label" "$port" "$port"
  done
  echo ""
}

print_credentials() {
  echo -e "${BOLD}  Default Credentials${RESET}"
  echo -e "  ${DIM}──────────────────────────────────────────────────────────────${RESET}"
  echo ""
  echo -e "  ${BOLD}Super Admin${RESET}"
  echo -e "    Email    : ${CYAN}superadmin@levelup.test${RESET}"
  echo -e "    Password : ${YELLOW}SuperAdmin123!${RESET}"
  echo -e "    Portal   : ${CYAN}http://localhost:4567${RESET}"
  echo ""
  echo -e "  ${BOLD}School Admin — Springfield Academy (SPR001)${RESET}"
  echo -e "    Email    : ${CYAN}admin@springfield.test${RESET}"
  echo -e "    Password : ${YELLOW}TenantAdmin123!${RESET}"
  echo -e "    Portal   : ${CYAN}http://localhost:4568${RESET}"
  echo ""
  echo -e "  ${BOLD}Teacher — Springfield Academy${RESET}"
  echo -e "    Email    : ${CYAN}teacher1@springfield.test${RESET}"
  echo -e "    Password : ${YELLOW}Teacher123!${RESET}"
  echo -e "    Portal   : ${CYAN}http://localhost:4569${RESET}"
  echo ""
  echo -e "  ${BOLD}Student — Springfield Academy${RESET}"
  echo -e "    Email    : ${CYAN}student1@springfield.test${RESET}"
  echo -e "    Password : ${YELLOW}Student123!${RESET}"
  echo -e "    Portal   : ${CYAN}http://localhost:4570${RESET}"
  echo ""
  echo -e "  ${BOLD}Parent — Springfield Academy${RESET}"
  echo -e "    Email    : ${CYAN}parent1@springfield.test${RESET}"
  echo -e "    Password : ${YELLOW}Parent123!${RESET}"
  echo -e "    Portal   : ${CYAN}http://localhost:4571${RESET}"
  echo ""
  echo -e "  ${DIM}  Note: Using production Firebase services (Firestore, RTDB, Auth).${RESET}"
  echo ""
}

# ── Stop command ─────────────────────────────────────────────────────────────
cmd_stop() {
  if [[ ! -f "$PID_FILE" ]]; then
    echo -e "${YELLOW}No running apps found (no PID file at $PID_FILE).${RESET}"
    exit 0
  fi
  echo -e "${BOLD}Stopping all LevelUp apps...${RESET}"
  while IFS= read -r pid; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" && echo -e "  ${GREEN}Stopped PID $pid${RESET}"
    fi
  done < "$PID_FILE"
  rm -f "$PID_FILE"
  echo -e "${GREEN}All apps stopped.${RESET}"
  exit 0
}

# ── Status command ────────────────────────────────────────────────────────────
cmd_status() {
  banner
  print_app_table
  if [[ ! -f "$PID_FILE" ]]; then
    echo -e "  ${YELLOW}No apps appear to be running (no PID file found).${RESET}"
    exit 0
  fi
  echo -e "${BOLD}  Process Status${RESET}"
  echo -e "  ${DIM}──────────────────────────────────────────────────────────────${RESET}"
  i=0
  while IFS= read -r pid; do
    label=$(echo "${APPS[$i]}" | cut -d'|' -f1)
    port=$(echo "${APPS[$i]}" | cut -d'|' -f3)
    if kill -0 "$pid" 2>/dev/null; then
      echo -e "  ${GREEN}●${RESET} $label  ${DIM}(PID $pid, port $port)${RESET}"
    else
      echo -e "  ${RED}●${RESET} $label  ${DIM}(PID $pid — not running)${RESET}"
    fi
    ((i++)) || true
  done < "$PID_FILE"
  echo ""
  exit 0
}

# ── Start command ─────────────────────────────────────────────────────────────
cmd_start() {
  banner
  print_app_table
  print_credentials

  # Check for existing PID file
  if [[ -f "$PID_FILE" ]]; then
    echo -e "${YELLOW}Warning: A PID file already exists. Apps may already be running.${RESET}"
    echo -e "  Run ${BOLD}./start.sh stop${RESET} first, or remove ${DIM}$PID_FILE${RESET} manually."
    echo ""
    read -r -p "Continue anyway? [y/N] " confirm
    [[ "$confirm" =~ ^[Yy]$ ]] || exit 1
    rm -f "$PID_FILE"
  fi

  mkdir -p "$LOG_DIR"
  > "$PID_FILE"  # clear / create

  echo -e "${BOLD}  Starting apps...${RESET}"
  echo -e "  ${DIM}(Logs are in .start-logs/)${RESET}"
  echo ""

  for entry in "${APPS[@]}"; do
    IFS='|' read -r label dir port desc <<< "$entry"
    log_name="$(echo "$label" | tr -s ' ' '_' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_]//g').log"
    log_file="$LOG_DIR/$log_name"

    # Determine package manager and dev command
    if [[ -f "$dir/../../../autograde/package.json" || "$dir" == *"/autograde/"* ]]; then
      # Autograde apps use npm
      PKG_MGR="npm"
    else
      PKG_MGR="pnpm"
    fi

    if [[ ! -d "$dir" ]]; then
      echo -e "  ${RED}✗${RESET} $label — directory not found: $dir"
      continue
    fi

    (cd "$dir" && $PKG_MGR run dev > "$log_file" 2>&1) &
    pid=$!
    echo "$pid" >> "$PID_FILE"
    echo -e "  ${GREEN}✓${RESET} ${BOLD}$label${RESET}  ${CYAN}http://localhost:$port${RESET}  ${DIM}(PID $pid)${RESET}"
  done

  echo ""
  echo -e "${BOLD}  All apps started!${RESET}"
  echo -e "  ${DIM}──────────────────────────────────────────────────────────────${RESET}"
  echo -e "  To stop all apps : ${BOLD}./start.sh stop${RESET}"
  echo -e "  To check status  : ${BOLD}./start.sh status${RESET}"
  echo -e "  To view logs     : ${DIM}tail -f .start-logs/<app>.log${RESET}"
  echo ""
  echo -e "  ${YELLOW}Note: Apps may take a few seconds to become available.${RESET}"
  echo -e "  ${YELLOW}      Connected to production Firebase (data visible in Firebase Console).${RESET}"
  echo ""

  # Wait for all background jobs so Ctrl-C kills them cleanly
  trap 'echo ""; echo "Shutting down..."; kill $(cat "$PID_FILE" 2>/dev/null) 2>/dev/null; rm -f "$PID_FILE"; exit 0' INT TERM
  wait
}

# ── Entry point ───────────────────────────────────────────────────────────────
case "${1:-start}" in
  stop)   cmd_stop ;;
  status) cmd_status ;;
  start|"") cmd_start ;;
  *)
    echo "Usage: $0 [start|stop|status]"
    exit 1
    ;;
esac
