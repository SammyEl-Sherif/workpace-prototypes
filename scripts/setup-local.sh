#!/bin/bash

# WorkPace Local Development Setup Script
# This script sets up the local development environment

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
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js v22 or higher."
        print_warning "Download from: https://nodejs.org/"
        exit 1
    fi
    
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 22 ]; then
        print_error "Node.js version 22 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    print_status "Node.js $(node --version) is installed"
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_status "npm $(npm --version) is installed"
    
    # Check Git
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
    print_status "Git $(git --version) is installed"
}

# Function to install dependencies
install_dependencies() {
    print_header "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        print_status "Installing dependencies with npm..."
        npm install
    elif [ -f "yarn.lock" ]; then
        if command_exists yarn; then
            print_status "Installing dependencies with yarn..."
            yarn install
        else
            print_warning "yarn.lock found but yarn is not installed. Installing with npm..."
            npm install
        fi
    else
        print_status "Installing dependencies with npm..."
        npm install
    fi
    
    print_status "Dependencies installed successfully"
}

# Function to setup environment file
setup_environment() {
    print_header "Setting up environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            print_status "Creating .env.local from .env.example..."
            cp .env.example .env.local
        else
            print_status "Creating .env.local with default values..."
            cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://workpace_user:password@localhost:5432/workpace_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32 2>/dev/null || echo 'your-secret-key-here')"

# Notion API
NOTION_API_KEY="your-notion-api-key"
NOTION_DATABASE_ID="your-database-id"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Environment
NODE_ENV="development"
EOF
        fi
        print_status ".env.local created successfully"
    else
        print_status ".env.local already exists"
    fi
    
    print_warning "Please update .env.local with your actual API keys and database configuration"
}

# Function to setup database (optional)
setup_database() {
    print_header "Database setup (optional)..."
    
    if command_exists docker; then
        print_status "Docker is available. You can use Docker for the database."
        print_warning "To start PostgreSQL with Docker:"
        print_warning "  docker run --name workpace-postgres -e POSTGRES_DB=workpace_dev -e POSTGRES_USER=workpace_user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15"
    else
        print_warning "Docker is not installed. Please install PostgreSQL manually or use a cloud database."
    fi
    
    print_warning "Make sure to update DATABASE_URL in .env.local with your database connection string"
}

# Function to run type checking
run_type_check() {
    print_header "Running type checking..."
    
    if npm run type-check >/dev/null 2>&1; then
        print_status "TypeScript type checking passed"
    else
        print_warning "TypeScript type checking failed. Please fix the issues."
        print_warning "Run 'npm run type-check' to see the details."
    fi
}

# Function to run linting
run_linting() {
    print_header "Running linting..."
    
    if npm run lint >/dev/null 2>&1; then
        print_status "Linting passed"
    else
        print_warning "Linting failed. Please fix the issues."
        print_warning "Run 'npm run lint' to see the details."
    fi
}

# Function to show next steps
show_next_steps() {
    print_header "Setup Complete! Next Steps:"
    echo ""
    echo "1. Update .env.local with your actual configuration:"
    echo "   - Database connection string"
    echo "   - Notion API key"
    echo "   - OpenAI API key"
    echo "   - Other required environment variables"
    echo ""
    echo "2. Start the development server:"
    echo "   npm run dev"
    echo ""
    echo "3. Open your browser and go to:"
    echo "   http://localhost:3000"
    echo ""
    echo "4. Useful development commands:"
    echo "   npm run dev          # Start development server"
    echo "   npm run build        # Build for production"
    echo "   npm run lint         # Run linting"
    echo "   npm run type-check   # Run type checking"
    echo "   npm run test         # Run tests"
    echo ""
    echo "5. For more information, see:"
    echo "   README-LOCAL-DEVELOPMENT.md"
    echo ""
    print_status "Happy coding! 🚀"
}

# Function to show help
show_help() {
    echo "WorkPace Local Development Setup Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --skip-deps          Skip dependency installation"
    echo "  --skip-env           Skip environment file setup"
    echo "  --skip-db            Skip database setup"
    echo "  --skip-checks        Skip type checking and linting"
    echo "  --help               Show this help message"
    echo ""
    echo "This script will:"
    echo "  1. Check prerequisites (Node.js, npm, Git)"
    echo "  2. Install dependencies"
    echo "  3. Setup environment configuration"
    echo "  4. Setup database (optional)"
    echo "  5. Run type checking and linting"
    echo "  6. Show next steps"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full setup"
    echo "  $0 --skip-deps        # Skip dependency installation"
    echo "  $0 --skip-checks      # Skip type checking and linting"
}

# Parse command line arguments
SKIP_DEPS=false
SKIP_ENV=false
SKIP_DB=false
SKIP_CHECKS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --skip-env)
            SKIP_ENV=true
            shift
            ;;
        --skip-db)
            SKIP_DB=true
            shift
            ;;
        --skip-checks)
            SKIP_CHECKS=true
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
    print_header "Starting WorkPace Local Development Setup"
    echo ""
    
    check_prerequisites
    
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies
    else
        print_warning "Skipping dependency installation"
    fi
    
    if [ "$SKIP_ENV" = false ]; then
        setup_environment
    else
        print_warning "Skipping environment setup"
    fi
    
    if [ "$SKIP_DB" = false ]; then
        setup_database
    else
        print_warning "Skipping database setup"
    fi
    
    if [ "$SKIP_CHECKS" = false ]; then
        run_type_check
        run_linting
    else
        print_warning "Skipping type checking and linting"
    fi
    
    show_next_steps
}

# Run main function
main
