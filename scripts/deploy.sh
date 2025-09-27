#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="board-yet"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        log_warning ".env file not found. Creating from env.example..."
        if [ -f "env.example" ]; then
            cp env.example .env
            log_warning "Please update .env file with your production values before continuing."
            log_warning "Press Enter when ready to continue..."
            read
        else
            log_error "env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    log_success "Prerequisites check completed"
}

backup_current() {
    log_info "Creating backup of current deployment..."
    
    if [ -d "backups" ]; then
        BACKUP_DIR="backups/backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        if [ -d "build" ]; then
            cp -r build "$BACKUP_DIR/"
            log_info "Backed up current build"
        fi
        
        if [ -f ".env" ]; then
            cp .env "$BACKUP_DIR/"
            log_info "Backed up current .env"
        fi
        
        log_success "Backup created at $BACKUP_DIR"
    fi
}

pull_changes() {
    log_info "Pulling latest changes from Git..."
    
    if [ -d ".git" ]; then
        git fetch origin
        git pull origin main
        log_success "Latest changes pulled"
    else
        log_warning "Not a Git repository, skipping Git pull"
    fi
}

deploy() {
    log_info "Building and deploying application..."
    
    log_info "Stopping existing containers..."
    docker-compose down
    
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    
    log_info "Building and starting new containers..."
    docker-compose up --build -d
    
    log_info "Waiting for services to be healthy..."
    sleep 30

    if docker-compose ps | grep -q "Up"; then
        log_success "Services are running"
    else
        log_error "Some services failed to start"
        docker-compose logs
        exit 1
    fi
}

health_check() {
    log_info "Performing health check..."
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Application is healthy"
    else
        log_warning "Health check failed, but deployment may still be successful"
        log_warning "Check logs with: docker-compose logs"
    fi
}

show_info() {
    log_success "Deployment completed successfully!"
    echo ""
    echo "Application URLs:"
    echo "  - Main application: http://localhost"
    echo "  - Health check: http://localhost/health"
    echo ""
    echo "Useful commands:"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Stop services: docker-compose down"
    echo "  - Restart services: docker-compose restart"
    echo "  - View container status: docker-compose ps"
    echo ""
}

main() {
    echo "🚀 Board Yet Production Deployment"
    echo "=================================="
    echo ""
    
    check_root
    check_prerequisites
    backup_current
    pull_changes
    deploy
    health_check
    show_info
}

main "$@"
