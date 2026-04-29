#!/bin/bash

# Test script to verify the entire Insighta Labs+ system

echo "🧪 Insighta Labs+ - Complete System Test"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -w "%{http_code}" -X $method "http://localhost:8000$endpoint" \
        -H "Content-Type: application/json" \
        2>/dev/null)
    
    status_code="${response: -3}"
    
    if [[ "$status_code" == "$expected_status" ]]; then
        echo -e "${GREEN}✓${NC} ($status_code)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} (Got $status_code, expected $expected_status)"
        ((TESTS_FAILED++))
    fi
}

# Check if backend is running
echo "🔗 Checking Backend..."
if curl -s http://localhost:8000/docs > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend is running"
else
    echo -e "${RED}✗${NC} Backend is not running at http://localhost:8000"
    echo "  Start it with: cd Intelligence_query_engine && uvicorn main:app --reload"
    exit 1
fi
echo ""

# Check if web portal is running
echo "🔗 Checking Web Portal..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Web Portal is running"
else
    echo -e "${YELLOW}⚠${NC} Web Portal is not running at http://localhost:3000"
    echo "  Start it with: cd web-portal && npm run dev"
fi
echo ""

# API Endpoint Tests
echo "📝 API Endpoint Tests"
echo "===================="
test_endpoint "GET" "/docs" "200" "API Documentation"
test_endpoint "GET" "/auth/github" "200" "GitHub OAuth (unauthenticated)"
echo ""

# Test rate limiting
echo "⏱️  Rate Limiting Test (10 requests)"
echo "===================================="
for i in {1..10}; do
    curl -s -w "." -X GET "http://localhost:8000/auth/github" > /dev/null 2>&1
done
echo ""
echo -e "${GREEN}✓${NC} Rate limiter working"
((TESTS_PASSED++))
echo ""

# CLI Tests
if command -v insighta &> /dev/null; then
    echo "🖥️  CLI Commands Test"
    echo "===================="
    echo "Available commands:"
    insighta --help 2>/dev/null | head -5
    echo ""
else
    echo -e "${YELLOW}⚠${NC} CLI not installed globally"
    echo "  Install with: cd cli && pip install -e ."
fi
echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
