#!/bin/bash

# WorkPace Local Setup Test Script
# This script tests if the local development environment is properly set up

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_header "Testing: $test_name"
    
    if eval "$test_command" >/dev/null 2>&1; then
        print_status "$test_name"
        ((TESTS_PASSED++))
    else
        print_error "$test_name"
        ((TESTS_FAILED++))
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if file exists
file_exists() {
    [ -f "$1" ]
}

# Function to check if directory exists
dir_exists() {
    [ -d "$1" ]
}

# Main test function
main() {
    print_header "WorkPace Local Setup Test"
    echo ""
    
    # Test Node.js
    run_test "Node.js is installed" "command_exists node"
    run_test "Node.js version >= 18" "[ \$(node --version | cut -d'v' -f2 | cut -d'.' -f1) -ge 18 ]"
    
    # Test npm
    run_test "npm is installed" "command_exists npm"
    
    # Test Git
    run_test "Git is installed" "command_exists git"
    
    # Test Docker (optional)
    if command_exists docker; then
        run_test "Docker is installed" "command_exists docker"
        run_test "Docker is running" "docker info >/dev/null 2>&1"
    else
        print_warning "Docker is not installed (optional for local development)"
    fi
    
    # Test project files
    run_test "package.json exists" "file_exists package.json"
    run_test "next.config.js exists" "file_exists src/next.config.js"
    run_test "Dockerfile exists" "file_exists Dockerfile"
    run_test "docker-compose.dev.yml exists" "file_exists docker-compose.dev.yml"
    
    # Test environment file
    if file_exists ".env.local"; then
        run_test ".env.local exists" "file_exists .env.local"
    else
        print_warning ".env.local not found (run ./scripts/setup-local.sh to create it)"
    fi
    
    # Test if .env.example exists
    run_test ".env.example exists" "file_exists .env.example"
    
    # Test scripts
    run_test "setup-local.sh exists and is executable" "[ -x scripts/setup-local.sh ]"
    run_test "dev.sh exists and is executable" "[ -x scripts/dev.sh ]"
    run_test "setup-k8s.sh exists and is executable" "[ -x scripts/setup-k8s.sh ]"
    run_test "deploy.sh exists and is executable" "[ -x scripts/deploy.sh ]"
    
    # Test if dependencies are installed
    if dir_exists "node_modules"; then
        run_test "Dependencies are installed" "dir_exists node_modules"
    else
        print_warning "Dependencies not installed (run npm install)"
    fi
    
    # Test TypeScript configuration
    run_test "TypeScript config exists" "file_exists tsconfig.json"
    
    # Test if the app can build (if dependencies are installed)
    if dir_exists "node_modules"; then
        run_test "TypeScript compilation works" "npm run type-check >/dev/null 2>&1"
    else
        print_warning "Skipping TypeScript test (dependencies not installed)"
    fi
    
    echo ""
    print_header "Test Results Summary"
    echo "Tests passed: $TESTS_PASSED"
    echo "Tests failed: $TESTS_FAILED"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_status "All tests passed! Your local development environment is ready."
        echo ""
        echo "Next steps:"
        echo "1. Update .env.local with your API keys"
        echo "2. Run: ./scripts/dev.sh db:start"
        echo "3. Run: ./scripts/dev.sh dev"
        echo "4. Open: http://localhost:3000"
    else
        print_error "Some tests failed. Please fix the issues above."
        echo ""
        echo "Common fixes:"
        echo "- Install missing dependencies: npm install"
        echo "- Run setup script: ./scripts/setup-local.sh"
        echo "- Check file permissions: chmod +x scripts/*.sh"
    fi
    
    exit $TESTS_FAILED
}

# Run main function
main
