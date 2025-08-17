#!/bin/bash

echo "🧪 Testing One Click Backend Endpoints"
echo "======================================"
echo ""

BASE_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -n "Testing $method $endpoint: "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint")
        http_code="${response: -3}"
        body="${response%???}"
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
        http_code="${response: -3}"
        body="${response%???}"
    fi
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ SUCCESS (HTTP $http_code)${NC}"
        echo "   Response: $body" | head -c 100
        echo "..."
    else
        echo -e "${RED}❌ FAILED (HTTP $http_code)${NC}"
        echo "   Response: $body"
    fi
    echo ""
}

echo "🔍 Testing Health and Status Endpoints"
echo "--------------------------------------"
test_endpoint "GET" "/health" "Health check"
test_endpoint "GET" "/api/rpc-test/health" "RPC test health"
test_endpoint "GET" "/api/rpc-test/status" "RPC test status"

echo "🏪 Testing Marketplace Endpoints"
echo "--------------------------------"
test_endpoint "GET" "/api/marketplace/overview" "Marketplace overview"
test_endpoint "GET" "/api/marketplace/templates" "Get templates"
test_endpoint "GET" "/api/marketplace/categories" "Get categories"
test_endpoint "GET" "/api/marketplace/complexities" "Get complexities"
test_endpoint "GET" "/api/marketplace/stats" "Get marketplace stats"

echo "🔒 Testing Basic Traps Endpoints"
echo "--------------------------------"
test_endpoint "GET" "/api/basic-traps/templates" "Get basic trap templates"

echo "🚀 Testing RPC Test Endpoints"
echo "-----------------------------"
test_endpoint "GET" "/api/rpc-test/test" "Test Hoodi connection"
test_endpoint "POST" "/api/rpc-test/test-fallback" "Test fallback" '{"test": "data"}'

echo "📊 Testing Analysis Endpoints"
echo "-----------------------------"
test_endpoint "GET" "/api/analysis/stats" "Get analysis stats"
test_endpoint "GET" "/api/analysis/networks" "Get analysis networks"
test_endpoint "GET" "/api/analysis/features" "Get analysis features"
test_endpoint "GET" "/api/analysis/health" "Analysis health"

echo "🔔 Testing Alerts Endpoints"
echo "---------------------------"
test_endpoint "GET" "/api/alerts/preferences" "Get alert preferences"

echo "🎯 Testing Enhanced AI Trap Endpoints"
echo "------------------------------------"
test_endpoint "GET" "/api/enhanced-ai-trap/status" "Get enhanced AI trap status"

echo "📈 Testing Traps Endpoints"
echo "--------------------------"
test_endpoint "GET" "/api/traps" "Get all traps"
test_endpoint "GET" "/api/traps/templates/popular" "Get popular templates"
test_endpoint "GET" "/api/traps/templates/categories" "Get template categories"
test_endpoint "GET" "/api/traps/templates/complexities" "Get template complexities"

echo "✅ Endpoint testing completed!"
echo "======================================"
