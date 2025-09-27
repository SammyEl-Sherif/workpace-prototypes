#!/bin/bash

# WorkPace Monitoring Deployment Script
# This script deploys Prometheus and Grafana for monitoring

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="workpace"

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

# Function to deploy Prometheus
deploy_prometheus() {
    print_status "Deploying Prometheus..."
    
    kubectl apply -f k8s/monitoring/prometheus-config.yaml
    kubectl apply -f k8s/monitoring/prometheus-deployment.yaml
    kubectl apply -f k8s/monitoring/prometheus-service.yaml
    
    print_status "Prometheus deployed successfully"
}

# Function to deploy Grafana
deploy_grafana() {
    print_status "Deploying Grafana..."
    
    # Create Grafana secrets if they don't exist
    if ! kubectl get secret grafana-secrets -n $NAMESPACE &> /dev/null; then
        print_status "Creating Grafana secrets..."
        kubectl apply -f k8s/monitoring/grafana-secret-template.yaml
    fi
    
    kubectl apply -f k8s/monitoring/grafana-deployment.yaml
    kubectl apply -f k8s/monitoring/grafana-service.yaml
    kubectl apply -f k8s/monitoring/grafana-ingress.yaml
    
    print_status "Grafana deployed successfully"
}

# Function to check monitoring status
check_monitoring() {
    print_status "Checking monitoring status..."
    
    # Check Prometheus
    print_status "Prometheus status:"
    kubectl get pods -n $NAMESPACE -l app=prometheus
    kubectl get svc -n $NAMESPACE -l app=prometheus
    
    # Check Grafana
    print_status "Grafana status:"
    kubectl get pods -n $NAMESPACE -l app=grafana
    kubectl get svc -n $NAMESPACE -l app=grafana
    kubectl get ingress -n $NAMESPACE -l app=grafana
}

# Function to show monitoring access info
show_access_info() {
    print_status "Monitoring Access Information:"
    echo ""
    echo "Prometheus:"
    echo "  - Internal: http://prometheus-service.workpace.svc.cluster.local:9090"
    echo "  - Port-forward: kubectl port-forward svc/prometheus-service 9090:9090 -n workpace"
    echo ""
    echo "Grafana:"
    echo "  - Internal: http://grafana-service.workpace.svc.cluster.local:3000"
    echo "  - External: https://grafana.workpace.io (after DNS setup)"
    echo "  - Port-forward: kubectl port-forward svc/grafana-service 3000:3000 -n workpace"
    echo ""
    echo "Default Grafana credentials:"
    echo "  - Username: admin"
    echo "  - Password: admin"
    echo ""
    print_warning "Please change the default Grafana password in production!"
}

# Function to show help
show_help() {
    echo "WorkPace Monitoring Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy monitoring stack (Prometheus + Grafana)"
    echo "  status     Check monitoring status"
    echo "  access     Show access information"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 status"
    echo "  $0 access"
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            check_kubectl
            check_cluster
            deploy_prometheus
            deploy_grafana
            check_monitoring
            show_access_info
            ;;
        "status")
            check_kubectl
            check_cluster
            check_monitoring
            ;;
        "access")
            show_access_info
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
