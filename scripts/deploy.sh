#!/bin/bash

# WorkPace Kubernetes Deployment Script
# This script helps deploy the WorkPace application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="workpace"
APP_NAME="workpace-app"
DOCKER_REGISTRY="registry.digitalocean.com/workpace"

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

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    print_status "kubectl is available"
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        print_warning "Make sure your kubeconfig is properly configured"
        exit 1
    fi
    print_status "Connected to Kubernetes cluster"
}

# Function to create namespace
create_namespace() {
    print_status "Creating namespace: $NAMESPACE"
    kubectl apply -f k8s/namespace.yaml
}

# Function to create secrets
create_secrets() {
    print_status "Creating secrets..."
    if [ ! -f "k8s/secret-template.yaml" ]; then
        print_error "Secret template not found. Please create k8s/secret-template.yaml first"
        exit 1
    fi
    
    print_warning "Please update k8s/secret-template.yaml with your actual secret values before running this script"
    print_warning "Then rename it to k8s/secret.yaml and run this script again"
    
    if [ -f "k8s/secret.yaml" ]; then
        kubectl apply -f k8s/secret.yaml
        print_status "Secrets applied successfully"
    else
        print_warning "Skipping secrets creation - k8s/secret.yaml not found"
    fi
}

# Function to deploy application
deploy_app() {
    print_status "Deploying application..."
    
    # Apply all Kubernetes manifests
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml
    
    print_status "Application deployed successfully"
}

# Function to check deployment status
check_deployment() {
    print_status "Checking deployment status..."
    
    # Wait for deployment to be ready
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=300s
    
    # Get pod status
    print_status "Pod status:"
    kubectl get pods -n $NAMESPACE -l app=$APP_NAME
    
    # Get service status
    print_status "Service status:"
    kubectl get svc -n $NAMESPACE
    
    # Get ingress status
    print_status "Ingress status:"
    kubectl get ingress -n $NAMESPACE
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    kubectl logs -n $NAMESPACE -l app=$APP_NAME --tail=50
}

# Function to scale deployment
scale_deployment() {
    local replicas=$1
    if [ -z "$replicas" ]; then
        print_error "Please specify number of replicas"
        exit 1
    fi
    
    print_status "Scaling deployment to $replicas replicas..."
    kubectl scale deployment $APP_NAME -n $NAMESPACE --replicas=$replicas
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE
}

# Function to deploy monitoring
deploy_monitoring() {
    print_status "Deploying monitoring stack..."
    if [ -f "scripts/deploy-monitoring.sh" ]; then
        ./scripts/deploy-monitoring.sh deploy
    else
        print_error "Monitoring deployment script not found"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "WorkPace Kubernetes Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy the application to Kubernetes"
    echo "  status     Check deployment status"
    echo "  logs       Show application logs"
    echo "  scale N    Scale deployment to N replicas"
    echo "  monitoring Deploy monitoring stack (Prometheus + Grafana)"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 status"
    echo "  $0 logs"
    echo "  $0 scale 3"
    echo "  $0 monitoring"
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            check_kubectl
            check_cluster
            create_namespace
            create_secrets
            deploy_app
            check_deployment
            ;;
        "status")
            check_kubectl
            check_cluster
            check_deployment
            ;;
        "logs")
            check_kubectl
            check_cluster
            show_logs
            ;;
        "scale")
            check_kubectl
            check_cluster
            scale_deployment $2
            ;;
        "monitoring")
            check_kubectl
            check_cluster
            deploy_monitoring
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
