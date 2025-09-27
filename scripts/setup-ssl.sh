#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="boardyet.com"
SSL_DIR="ssl"
CERT_FILE="$SSL_DIR/certs/$DOMAIN.cert.pem"
KEY_FILE="$SSL_DIR/private/$DOMAIN.key.pem"


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

create_directories() {
    log_info "Creating SSL directories..."
    mkdir -p "$SSL_DIR/certs" "$SSL_DIR/private"
    log_success "SSL directories created"
}

check_existing_certs() {
    if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
        log_warning "SSL certificates already exist:"
        log_warning "  Certificate: $CERT_FILE"
        log_warning "  Private Key: $KEY_FILE"
        
        if openssl x509 -in "$CERT_FILE" -text -noout > /dev/null 2>&1; then
            EXPIRY=$(openssl x509 -in "$CERT_FILE" -noout -dates | grep "notAfter" | cut -d= -f2)
            log_info "Certificate expires: $EXPIRY"
            
            read -p "Do you want to replace existing certificates? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Keeping existing certificates"
                exit 0
            fi
        else
            log_error "Existing certificate is invalid"
            exit 1
        fi
    fi
}

setup_letsencrypt() {
    log_info "Setting up Let's Encrypt SSL certificate..."
    
    if ! command -v certbot &> /dev/null; then
        log_error "Certbot is not installed. Please install it first:"
        log_error "  Ubuntu/Debian: sudo apt-get install certbot"
        log_error "  CentOS/RHEL: sudo yum install certbot"
        log_error "  macOS: brew install certbot"
        exit 1
    fi
    
    log_info "Checking if $DOMAIN points to this server..."
    SERVER_IP=$(curl -s ifconfig.me)
    DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
    
    if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
        log_warning "Domain $DOMAIN does not point to this server ($SERVER_IP)"
        log_warning "Domain currently points to: $DOMAIN_IP"
        log_warning "Please update your DNS settings first"
        exit 1
    fi
    
    log_info "Obtaining SSL certificate from Let's Encrypt..."
    sudo certbot certonly --standalone -d $DOMAIN -d "*.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
    
    log_info "Copying certificates to ssl directory..."
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERT_FILE"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$KEY_FILE"
    
    sudo chown $USER:$USER "$CERT_FILE" "$KEY_FILE"
    chmod 644 "$CERT_FILE"
    chmod 600 "$KEY_FILE"
    
    log_success "Let's Encrypt certificate installed"
}

setup_existing() {
    log_info "Setting up existing SSL certificates..."
    
    echo "Please provide the paths to your SSL certificate files:"
    read -p "Certificate file path: " CERT_PATH
    read -p "Private key file path: " KEY_PATH
    
    if [ ! -f "$CERT_PATH" ]; then
        log_error "Certificate file not found: $CERT_PATH"
        exit 1
    fi
    
    if [ ! -f "$KEY_PATH" ]; then
        log_error "Private key file not found: $KEY_PATH"
        exit 1
    fi
    
    log_info "Copying certificate files..."
    cp "$CERT_PATH" "$CERT_FILE"
    cp "$KEY_PATH" "$KEY_FILE"
    
    chmod 644 "$CERT_FILE"
    chmod 600 "$KEY_FILE"
    
    log_success "Existing certificates installed"
}

setup_selfsigned() {
    log_warning "Creating self-signed certificate (for development only)..."
    
    openssl genrsa -out "$KEY_FILE" 2048
    
    openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 \
        -subj "/C=US/ST=State/L=City/O=Board Yet/CN=$DOMAIN"
    
    chmod 644 "$CERT_FILE"
    chmod 600 "$KEY_FILE"
    
    log_success "Self-signed certificate created"
    log_warning "WARNING: Self-signed certificates are not trusted by browsers"
    log_warning "This should only be used for development/testing"
}

verify_certificates() {
    log_info "Verifying SSL certificates..."
    
    if openssl x509 -in "$CERT_FILE" -text -noout > /dev/null 2>&1; then
        log_success "Certificate is valid"
        
        SUBJECT=$(openssl x509 -in "$CERT_FILE" -noout -subject | cut -d= -f2-)
        ISSUER=$(openssl x509 -in "$CERT_FILE" -noout -issuer | cut -d= -f2-)
        EXPIRY=$(openssl x509 -in "$CERT_FILE" -noout -dates | grep "notAfter" | cut -d= -f2)
        
        log_info "Subject: $SUBJECT"
        log_info "Issuer: $ISSUER"
        log_info "Expires: $EXPIRY"
    else
        log_error "Certificate is invalid"
        exit 1
    fi
    
    if openssl rsa -in "$KEY_FILE" -check > /dev/null 2>&1; then
        log_success "Private key is valid"
    else
        log_error "Private key is invalid"
        exit 1
    fi
    
    CERT_MD5=$(openssl x509 -noout -modulus -in "$CERT_FILE" | openssl md5)
    KEY_MD5=$(openssl rsa -noout -modulus -in "$KEY_FILE" | openssl md5)
    
    if [ "$CERT_MD5" = "$KEY_MD5" ]; then
        log_success "Certificate and private key match"
    else
        log_error "Certificate and private key do not match"
        exit 1
    fi
}

test_nginx() {
    log_info "Testing nginx configuration..."
    
    if docker-compose exec nginx nginx -t > /dev/null 2>&1; then
        log_success "Nginx configuration is valid"
    else
        log_error "Nginx configuration is invalid"
        log_error "Check nginx logs: docker-compose logs nginx"
        exit 1
    fi
}

show_menu() {
    echo "SSL Certificate Setup for $DOMAIN"
    echo "=================================="
    echo ""
    echo "Choose an option:"
    echo "1) Use Let's Encrypt (free, automatic renewal)"
    echo "2) Use existing certificates from Porkbun"
    echo "3) Create self-signed certificate (development only)"
    echo "4) Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            setup_letsencrypt
            ;;
        2)
            setup_existing
            ;;
        3)
            setup_selfsigned
            ;;
        4)
            log_info "Exiting..."
            exit 0
            ;;
        *)
            log_error "Invalid choice"
            exit 1
            ;;
    esac
}

main() {
    check_root
    create_directories
    check_existing_certs
    show_menu
    verify_certificates
    test_nginx
    
    log_success "SSL setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with the correct domain"
    echo "2. Deploy the application: ./scripts/deploy.sh"
    echo "3. Test HTTPS: https://$DOMAIN"
    echo ""
}

main "$@"
