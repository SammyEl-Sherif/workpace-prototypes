#!/bin/bash

# WorkPace Kubernetes Complete Setup Script
# This script sets up the entire WorkPace application on Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="workpace"
APP_NAME="workpace-app"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    print_status "kubectl is available"
    
    # Check cluster connection
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        print_warning "Make sure your kubeconfig is properly configured"
        exit 1
    fi
    print_status "Connected to Kubernetes cluster"
    
    # Check if required files exist
    local required_files=(
        "k8s/namespace.yaml"
        "k8s/deployment.yaml"
        "k8s/service.yaml"
        "k8s/ingress.yaml"
        "k8s/cert-manager-issuer.yaml"
        "Dockerfile"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    print_status "All required files found"
}

# Function to setup cert-manager
setup_cert_manager() {
    print_header "Setting up cert-manager..."
    
    # Check if cert-manager is already installed
    if kubectl get namespace cert-manager &> /dev/null; then
        print_status "cert-manager namespace already exists"
    else
        print_status "Installing cert-manager..."
        kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
        
        # Wait for cert-manager to be ready
        print_status "Waiting for cert-manager to be ready..."
        kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=cert-manager -n cert-manager --timeout=300s
    fi
    
    # Apply cert-manager issuer
    print_status "Applying cert-manager issuer..."
    kubectl apply -f k8s/cert-manager-issuer.yaml
}

# Function to setup nginx ingress
setup_nginx_ingress() {
    print_header "Setting up NGINX Ingress Controller..."
    
    # Check if nginx ingress is already installed
    if kubectl get namespace ingress-nginx &> /dev/null; then
        print_status "NGINX Ingress Controller already installed"
    else
        print_status "Installing NGINX Ingress Controller..."
        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/do/deploy.yaml
        
        # Wait for ingress controller to be ready
        print_status "Waiting for NGINX Ingress Controller to be ready..."
        kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx --timeout=300s
    fi
}

# Function to create secrets
create_secrets() {
    print_header "Setting up secrets..."
    
    if [ -f "k8s/secret.yaml" ]; then
        print_status "Applying application secrets..."
        kubectl apply -f k8s/secret.yaml
    else
        print_warning "k8s/secret.yaml not found"
        print_warning "Please create k8s/secret.yaml based on k8s/secret-template.yaml"
        print_warning "You can continue without secrets, but the application may not work properly"
    fi
}

# Function to deploy application
deploy_application() {
    print_header "Deploying WorkPace application..."
    
    # Create namespace
    print_status "Creating namespace..."
    kubectl apply -f k8s/namespace.yaml
    
    # Deploy application
    print_status "Deploying application components..."
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml
    
    # Wait for deployment to be ready
    print_status "Waiting for application to be ready..."
    kubectl wait --for=condition=ready pod -l app=$APP_NAME -n $NAMESPACE --timeout=300s
}

# Function to deploy monitoring
deploy_monitoring() {
    print_header "Setting up monitoring..."
    
    if [ -f "scripts/deploy-monitoring.sh" ]; then
        ./scripts/deploy-monitoring.sh deploy
    else
        print_warning "Monitoring deployment script not found, skipping monitoring setup"
    fi
}

# Function to verify deployment
verify_deployment() {
    print_header "Verifying deployment..."
    
    # Check pods
    print_status "Checking application pods..."
    kubectl get pods -n $NAMESPACE -l app=$APP_NAME
    
    # Check services
    print_status "Checking services..."
    kubectl get svc -n $NAMESPACE
    
    # Check ingress
    print_status "Checking ingress..."
    kubectl get ingress -n $NAMESPACE
    
    # Get load balancer IP
    print_status "Getting load balancer IP..."
    local lb_ip=$(kubectl get ingress workpace-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Not available yet")
    
    if [ "$lb_ip" != "Not available yet" ] && [ -n "$lb_ip" ]; then
        print_status "Load Balancer IP: $lb_ip"
        print_warning "Update your DNS records to point to this IP:"
        print_warning "  A Record: workpace.io → $lb_ip"
        print_warning "  A Record: www.workpace.io → $lb_ip"
    else
        print_warning "Load balancer IP not available yet. Check again in a few minutes."
    fi
}

# Function to show next steps
show_next_steps() {
    print_header "Setup Complete! Next Steps:"
    echo ""
    echo "1. DNS Configuration:"
    echo "   - Get the load balancer IP: kubectl get ingress workpace-ingress -n workpace"
    echo "   - Update DNS records to point to the load balancer IP"
    echo ""
    echo "2. SSL Certificate:"
    echo "   - SSL certificates will be automatically provisioned by cert-manager"
    echo "   - Check certificate status: kubectl get certificates -n workpace"
    echo ""
    echo "3. Monitoring:"
    echo "   - Prometheus: kubectl port-forward svc/prometheus-service 9090:9090 -n workpace"
    echo "   - Grafana: kubectl port-forward svc/grafana-service 3000:3000 -n workpace"
    echo ""
    echo "4. Application Access:"
    echo "   - Once DNS is configured: https://workpace.io"
    echo "   - Port-forward for testing: kubectl port-forward svc/workpace-service 3000:80 -n workpace"
    echo ""
    echo "5. Useful Commands:"
    echo "   - Check status: ./scripts/deploy.sh status"
    echo "   - View logs: ./scripts/deploy.sh logs"
    echo "   - Scale app: ./scripts/deploy.sh scale 3"
    echo ""
    print_status "Deployment completed successfully!"
}

# Function to show help
show_help() {
    echo "WorkPace Kubernetes Complete Setup Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --skip-monitoring    Skip monitoring setup"
    echo "  --skip-cert-manager  Skip cert-manager setup"
    echo "  --skip-ingress       Skip NGINX ingress setup"
    echo "  --help               Show this help message"
    echo ""
    echo "This script will:"
    echo "  1. Check prerequisites"
    echo "  2. Setup cert-manager (unless skipped)"
    echo "  3. Setup NGINX Ingress Controller (unless skipped)"
    echo "  4. Create secrets"
    echo "  5. Deploy the application"
    echo "  6. Setup monitoring (unless skipped)"
    echo "  7. Verify deployment"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full setup"
    echo "  $0 --skip-monitoring  # Skip monitoring"
}

# Parse command line arguments
SKIP_MONITORING=false
SKIP_CERT_MANAGER=false
SKIP_INGRESS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-monitoring)
            SKIP_MONITORING=true
            shift
            ;;
        --skip-cert-manager)
            SKIP_CERT_MANAGER=true
            shift
            ;;
        --skip-ingress)
            SKIP_INGRESS=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main setup process
main() {
    print_header "Starting WorkPace Kubernetes Setup"
    echo ""
    
    check_prerequisites
    
    if [ "$SKIP_CERT_MANAGER" = false ]; then
        setup_cert_manager
    else
        print_warning "Skipping cert-manager setup"
    fi
    
    if [ "$SKIP_INGRESS" = false ]; then
        setup_nginx_ingress
    else
        print_warning "Skipping NGINX ingress setup"
    fi
    
    create_secrets
    deploy_application
    
    if [ "$SKIP_MONITORING" = false ]; then
        deploy_monitoring
    else
        print_warning "Skipping monitoring setup"
    fi
    
    verify_deployment
    show_next_steps
}

# Run main function
main
