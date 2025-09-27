#!/bin/bash

# WorkPace Development Script
# This script helps with local development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo -e "${BLUE}[DEV]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to start database
start_database() {
    print_header "Starting database services..."
    
    check_docker
    
    # Start only database services
    docker-compose -f docker-compose.dev.yml up -d postgres redis
    
    print_status "Waiting for database to be ready..."
    sleep 5
    
    # Check if database is ready
    if docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U workpace_user -d workpace_dev >/dev/null 2>&1; then
        print_status "Database is ready!"
    else
        print_warning "Database might not be ready yet. Please wait a moment."
    fi
}

# Function to stop database
stop_database() {
    print_header "Stopping database services..."
    
    docker-compose -f docker-compose.dev.yml down
    
    print_status "Database services stopped"
}

# Function to restart database
restart_database() {
    print_header "Restarting database services..."
    
    stop_database
    start_database
}

# Function to show database status
show_database_status() {
    print_header "Database status:"
    
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.dev.yml ps
    else
        print_warning "No database services are running"
    fi
}

# Function to show database logs
show_database_logs() {
    print_header "Database logs:"
    
    docker-compose -f docker-compose.dev.yml logs postgres redis
}

# Function to reset database
reset_database() {
    print_header "Resetting database..."
    
    print_warning "This will delete all data in the database. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.dev.yml up -d postgres redis
        
        print_status "Database reset complete"
    else
        print_status "Database reset cancelled"
    fi
}

# Function to start development server
start_dev_server() {
    print_header "Starting development server..."
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Please run ./scripts/setup-local.sh first"
        exit 1
    fi
    
    # Start the development server
    npm run dev
}

# Function to run tests
run_tests() {
    print_header "Running tests..."
    
    npm run test
}

# Function to run linting
run_lint() {
    print_header "Running linting..."
    
    npm run lint
}

# Function to run type checking
run_type_check() {
    print_header "Running type checking..."
    
    npm run type-check
}

# Function to build application
build_app() {
    print_header "Building application..."
    
    npm run build
}

# Function to show help
show_help() {
    echo "WorkPace Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  db:start      Start database services (PostgreSQL + Redis)"
    echo "  db:stop       Stop database services"
    echo "  db:restart    Restart database services"
    echo "  db:status     Show database status"
    echo "  db:logs       Show database logs"
    echo "  db:reset      Reset database (WARNING: deletes all data)"
    echo "  dev           Start development server"
    echo "  test          Run tests"
    echo "  lint          Run linting"
    echo "  type-check    Run type checking"
    echo "  build         Build application"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 db:start   # Start database"
    echo "  $0 dev        # Start development server"
    echo "  $0 test       # Run tests"
    echo ""
    echo "Quick start:"
    echo "  1. $0 db:start    # Start database"
    echo "  2. $0 dev         # Start development server"
    echo "  3. Open http://localhost:3000"
}

# Main script logic
main() {
    case "${1:-help}" in
        "db:start")
            start_database
            ;;
        "db:stop")
            stop_database
            ;;
        "db:restart")
            restart_database
            ;;
        "db:status")
            show_database_status
            ;;
        "db:logs")
            show_database_logs
            ;;
        "db:reset")
            reset_database
            ;;
        "dev")
            start_dev_server
            ;;
        "test")
            run_tests
            ;;
        "lint")
            run_lint
            ;;
        "type-check")
            run_type_check
            ;;
        "build")
            build_app
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
