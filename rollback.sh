#!/bin/bash

# Quick rollback script for droni-react
# This script provides a simple interface for rolling back deployments

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKUP_DIR="${SCRIPT_DIR}/backups"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

echo -e "${YELLOW}🔄 Droni React Rollback Utility${NC}\n"

# Check if backup exists
if [[ ! -d "${BACKUP_DIR}" ]] || [[ ! -f "${BACKUP_DIR}/latest-backup.txt" ]]; then
  echo -e "${RED}❌ No backups found. Cannot rollback.${NC}"
  echo "Backup directory: ${BACKUP_DIR}"
  exit 1
fi

# Show available backups
echo -e "${GREEN}Available backups:${NC}"
ls -la "${BACKUP_DIR}"/backup-* 2>/dev/null | head -10 || {
  echo -e "${RED}No backup files found${NC}"
  exit 1
}

echo
latest_backup=$(cat "${BACKUP_DIR}/latest-backup.txt" 2>/dev/null || echo "")
if [[ -n "${latest_backup}" ]]; then
  echo -e "${GREEN}Latest backup: ${latest_backup}${NC}"
else
  echo -e "${RED}No latest backup information found${NC}"
  exit 1
fi

echo
read -p "Do you want to rollback to the latest backup? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Starting rollback...${NC}"
  "${SCRIPT_DIR}/deploy.sh" production --rollback
else
  echo -e "${YELLOW}Rollback cancelled${NC}"
  exit 0
fi
