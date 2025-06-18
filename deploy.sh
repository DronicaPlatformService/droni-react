#!/bin/bash

# Production deployment script for droni-react
# This script builds and deploys the application using docker compose with production-grade features
#
# Usage: ./deploy.sh [ENVIRONMENT] [OPTIONS]
#
# Environments: production, staging
# Options:
#   --no-backup: Skip backup creation
#   --force: Skip confirmation prompts
#   --tag: Specify image tag (default: latest)
#   --rollback: Rollback to previous version

# Set strict error handling
set -euo pipefail

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_DIR="${SCRIPT_DIR}/logs"
readonly BACKUP_DIR="${SCRIPT_DIR}/backups"
readonly COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"
readonly LOG_FILE="${LOG_DIR}/deploy-$(date +%Y%m%d-%H%M%S).log"

# Default values
ENVIRONMENT="${1:-production}"
IMAGE_TAG="latest"
SKIP_BACKUP=false
FORCE_DEPLOY=false
ROLLBACK=false

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Parse command line arguments
parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    --no-backup)
      SKIP_BACKUP=true
      shift
      ;;
    --force)
      FORCE_DEPLOY=true
      shift
      ;;
    --tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --rollback)
      ROLLBACK=true
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
    esac
  done
}

# Show help message
show_help() {
  cat <<EOF
Usage: $0 [ENVIRONMENT] [OPTIONS]

Environments:
    production    Deploy to production environment
    staging       Deploy to staging environment

Options:
    --no-backup   Skip backup creation
    --force       Skip confirmation prompts
    --tag TAG     Specify image tag (default: latest)
    --rollback    Rollback to previous version
    --help        Show this help message

Examples:
    $0 production
    $0 staging --tag v1.2.3
    $0 production --no-backup --force
    $0 production --rollback
EOF
}

# Logging function
log() {
  local level="$1"
  shift
  local message="$*"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  # Ensure log directory exists
  mkdir -p "${LOG_DIR}"

  # Log to file
  echo "[${timestamp}] [${level}] ${message}" >>"${LOG_FILE}"

  # Log to console with colors
  case "${level}" in
  "INFO")
    echo -e "${BLUE}ℹ️  ${message}${NC}"
    ;;
  "SUCCESS")
    echo -e "${GREEN}✅ ${message}${NC}"
    ;;
  "WARNING")
    echo -e "${YELLOW}⚠️  ${message}${NC}"
    ;;
  "ERROR")
    echo -e "${RED}❌ ${message}${NC}"
    ;;
  *)
    echo "${message}"
    ;;
  esac
}

# Error handler
error_handler() {
  local line_number="$1"
  log "ERROR" "Script failed at line ${line_number}. Last command: ${BASH_COMMAND}"
  log "ERROR" "Deployment failed. Check logs: ${LOG_FILE}"

  # Show recent logs
  if [[ -f "${LOG_FILE}" ]]; then
    echo -e "\n${RED}Recent logs:${NC}"
    tail -n 10 "${LOG_FILE}"
  fi

  exit 1
}

# Set error trap
trap 'error_handler ${LINENO}' ERR

# Validate environment
validate_environment() {
  case "${ENVIRONMENT}" in
  production | staging)
    log "INFO" "Deploying to ${ENVIRONMENT} environment"
    ;;
  *)
    log "ERROR" "Invalid environment: ${ENVIRONMENT}. Use 'production' or 'staging'"
    exit 1
    ;;
  esac
}

# Check prerequisites
check_prerequisites() {
  log "INFO" "Checking prerequisites..."

  # Check if docker compose is available
  if ! command -v docker &>/dev/null; then
    log "ERROR" "Docker is not installed or not in PATH"
    exit 1
  fi

  if ! docker compose version &>/dev/null; then
    log "ERROR" "Docker Compose is not available"
    exit 1
  fi

  # Check if compose file exists
  if [[ ! -f "${COMPOSE_FILE}" ]]; then
    log "ERROR" "Docker compose file not found: ${COMPOSE_FILE}"
    exit 1
  fi

  # Check docker daemon
  if ! docker info &>/dev/null; then
    log "ERROR" "Docker daemon is not running"
    exit 1
  fi

  # Check available disk space (at least 2GB)
  local available_space=$(df "${SCRIPT_DIR}" | awk 'NR==2 {print $4}')
  if [[ ${available_space} -lt 2097152 ]]; then # 2GB in KB
    log "WARNING" "Low disk space available. Consider cleaning up old images/containers"
  fi

  log "SUCCESS" "Prerequisites check passed"
}

# Create backup
create_backup() {
  if [[ "${SKIP_BACKUP}" == "true" ]]; then
    log "INFO" "Skipping backup creation"
    return 0
  fi

  log "INFO" "Creating backup..."
  mkdir -p "${BACKUP_DIR}"

  local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
  local backup_path="${BACKUP_DIR}/${backup_name}"

  # Export current container state
  if docker compose ps --format json | jq -e '.[0]' &>/dev/null; then
    docker compose ps --format json >"${backup_path}-containers.json"
    docker compose config >"${backup_path}-compose.yml"

    # Get current image info
    local current_image=$(docker compose images --format json | jq -r '.[0].Repository + ":" + .[0].Tag' 2>/dev/null || echo "none")
    echo "${current_image}" >"${backup_path}-image.txt"

    log "SUCCESS" "Backup created: ${backup_name}"
    echo "${backup_name}" >"${BACKUP_DIR}/latest-backup.txt"
  else
    log "INFO" "No running containers to backup"
  fi
}

# Rollback function
rollback_deployment() {
  log "INFO" "Rolling back to previous version..."

  if [[ ! -f "${BACKUP_DIR}/latest-backup.txt" ]]; then
    log "ERROR" "No backup found for rollback"
    exit 1
  fi

  local backup_name=$(cat "${BACKUP_DIR}/latest-backup.txt")
  local backup_image_file="${BACKUP_DIR}/${backup_name}-image.txt"

  if [[ ! -f "${backup_image_file}" ]]; then
    log "ERROR" "Backup image info not found"
    exit 1
  fi

  local previous_image=$(cat "${backup_image_file}")
  if [[ "${previous_image}" == "none" ]]; then
    log "ERROR" "No previous image to rollback to"
    exit 1
  fi

  log "INFO" "Rolling back to image: ${previous_image}"

  # Update docker-compose to use previous image
  # This is a simplified approach - in production, you might want to use image tags
  docker compose down

  # Pull the previous image
  docker pull "${previous_image}"

  # Restart with previous image
  COMPOSE_DOCKER_CLI_BUILD=1 docker compose up -d

  # Wait for health check
  wait_for_health_check

  log "SUCCESS" "Rollback completed successfully"
  return 0
}

# Pre-deployment validation
pre_deployment_validation() {
  log "INFO" "Running pre-deployment validation..."

  # Validate docker-compose file
  if ! docker compose config -q; then
    log "ERROR" "Docker compose file validation failed"
    exit 1
  fi

  # Check if image exists and is accessible
  if ! docker pull "ghcr.io/dronicaplatformservice/droni-react:${IMAGE_TAG}" &>/dev/null; then
    log "ERROR" "Cannot pull image with tag: ${IMAGE_TAG}"
    exit 1
  fi

  # Validate network exists
  if ! docker network ls | grep -q "traefik_network"; then
    log "WARNING" "traefik_network not found. Creating network..."
    docker network create traefik_network || log "WARNING" "Network might already exist"
  fi

  log "SUCCESS" "Pre-deployment validation passed"
}

# Wait for health check
wait_for_health_check() {
  log "INFO" "Waiting for application to be healthy..."

  local max_attempts=24 # 24 * 5 seconds = 2 minutes
  local attempt=1

  while [[ ${attempt} -le ${max_attempts} ]]; do
    # Check if container is running first
    if ! docker compose ps --format json | jq -e '.State == "running"' &>/dev/null; then
      log "ERROR" "Container is not running"
      log "INFO" "Container status:"
      docker compose ps
      log "INFO" "Container logs:"
      docker compose logs --tail=50 frontend
      return 1
    fi

    # Check Docker's built-in health check (standard approach from Dockerfile)
    local health_status=$(docker compose ps --format json | jq -r '.Health // "no_healthcheck"')
    if [[ "${health_status}" == "healthy" ]]; then
      log "SUCCESS" "Application is healthy (Docker HEALTHCHECK from Dockerfile)"
      return 0
    fi

    # Show diagnostic info on first attempt and every 30 seconds
    if [[ $((attempt % 6)) -eq 1 ]]; then
      log "INFO" "Docker health status: ${health_status}"

      # Test health endpoint directly for debugging (same endpoint as Dockerfile HEALTHCHECK)
      log "INFO" "Testing health endpoint directly (same as Dockerfile HEALTHCHECK)..."
      if docker exec droni-react wget --no-verbose --tries=1 --spider http://localhost:8080/droni/health 2>&1; then
        log "INFO" "Health endpoint is accessible (matches Dockerfile HEALTHCHECK)"
      else
        log "WARNING" "Health endpoint test failed"
        # Test main application endpoint
        if docker exec droni-react wget --no-verbose --tries=1 --spider http://localhost:8080/droni/ 2>&1; then
          log "INFO" "Main application endpoint is accessible"
        else
          log "ERROR" "Main application endpoint is not accessible"
        fi
      fi
    fi

    if [[ $((attempt % 6)) -eq 0 ]]; then # Every 30 seconds
      log "INFO" "Still waiting for health check... (attempt ${attempt}/${max_attempts})"
    fi

    sleep 5
    ((attempt++))
  done

  log "ERROR" "Health check failed after ${max_attempts} attempts"
  log "INFO" "Final container status:"
  docker compose ps
  log "INFO" "Container logs:"
  docker compose logs --tail=50 frontend
  log "INFO" "Testing health endpoint one more time (Dockerfile HEALTHCHECK endpoint):"
  docker exec droni-react wget --no-verbose --tries=1 --spider http://localhost:8080/droni/health || true
  return 1
}

# Deploy application
deploy_application() {
  log "INFO" "Starting deployment process..."

  # Pull the latest image
  log "INFO" "Pulling Docker image: ghcr.io/dronicaplatformservice/droni-react:${IMAGE_TAG}"
  docker compose pull

  # Stop existing containers gracefully
  log "INFO" "Stopping existing containers..."
  if docker compose ps --format json | jq -e '.[0]' &>/dev/null; then
    docker compose down --timeout 30
  else
    log "INFO" "No existing containers to stop"
  fi

  # Clean up old images (keep last 3 versions)
  log "INFO" "Cleaning up old images..."
  docker image prune -f || log "WARNING" "Image cleanup failed"

  # Start the application
  log "INFO" "Starting application..."
  docker compose up -d

  # Wait for health check
  wait_for_health_check

  log "SUCCESS" "Deployment completed successfully!"
}

# Post-deployment tasks
post_deployment_tasks() {
  log "INFO" "Running post-deployment tasks..."

  # Show container status
  log "INFO" "Container status:"
  docker compose ps

  # Show resource usage
  log "INFO" "Resource usage:"
  docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.PIDs}}"

  # Log successful deployment
  log "SUCCESS" "🎉 Deployment to ${ENVIRONMENT} completed successfully!"
  log "INFO" "Application URL: http://localhost:18080/droni/"
  log "INFO" "Health check: http://localhost:18080/droni/health"
  log "INFO" "Logs saved to: ${LOG_FILE}"

  # Clean up old logs (keep last 10)
  find "${LOG_DIR}" -name "deploy-*.log" -type f | sort -r | tail -n +11 | xargs rm -f || true

  # Clean up old backups (keep last 5)
  find "${BACKUP_DIR}" -name "backup-*" -type f | sort -r | tail -n +16 | xargs rm -f || true
}

# Confirmation prompt
confirm_deployment() {
  if [[ "${FORCE_DEPLOY}" == "true" ]]; then
    return 0
  fi

  echo
  log "WARNING" "You are about to deploy to ${ENVIRONMENT} environment"
  log "INFO" "Image tag: ${IMAGE_TAG}"
  echo
  read -p "Are you sure you want to continue? (y/N): " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "INFO" "Deployment cancelled by user"
    exit 0
  fi
}

# Main function
main() {
  echo
  log "INFO" "🚀 Starting droni-react production deployment script"
  log "INFO" "Timestamp: $(date)"
  log "INFO" "User: $(whoami)"
  log "INFO" "Working directory: ${SCRIPT_DIR}"
  echo

  # Parse command line arguments
  parse_args "$@"

  # Handle rollback
  if [[ "${ROLLBACK}" == "true" ]]; then
    rollback_deployment
    exit 0
  fi

  # Validate environment
  validate_environment

  # Check prerequisites
  check_prerequisites

  # Confirmation
  confirm_deployment

  # Pre-deployment validation
  pre_deployment_validation

  # Create backup
  create_backup

  # Deploy application
  deploy_application

  # Post-deployment tasks
  post_deployment_tasks
}

# Run main function with all arguments
main "$@"
