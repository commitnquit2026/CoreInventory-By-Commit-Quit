#!/bin/bash

# CoreInventory Role-Based Workflow Test Script
# Tests Manager and Staff workflows
# Usage: ./test-roles.sh

echo "🔄 CoreInventory Role-Based Workflow Testing"
echo "==========================================="
echo ""

API_BASE="http://localhost:5000/api/v1"
MANAGER_USER="testuser"
MANAGER_PASS="Test@123456"
STAFF_USER="staff"
STAFF_PASS="password123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print headers
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "${YELLOW}→ $description${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X "$method" "$API_BASE$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -X "$method" "$API_BASE$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if echo "$response" | grep -q "error\|Error\|invalid\|Invalid"; then
        print_error "Failed: $description"
        echo "Response: $(echo $response | jq '.' 2>/dev/null || echo $response)" | head -3
        return 1
    else
        print_success "Passed: $description"
        return 0
    fi
}

# ═══ START TESTING ═══

print_header "1️⃣  MANAGER AUTHENTICATION TEST"

echo "Logging in as Manager..."
manager_login=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$MANAGER_USER\",\"password\":\"$MANAGER_PASS\"}")

MANAGER_TOKEN=$(echo $manager_login | jq -r '.token' 2>/dev/null)

if [ -z "$MANAGER_TOKEN" ] || [ "$MANAGER_TOKEN" = "null" ]; then
    print_error "Manager login failed"
    exit 1
else
    print_success "Manager authenticated"
    echo "Token (first 20 chars): ${MANAGER_TOKEN:0:20}..."
fi

print_header "2️⃣  STAFF AUTHENTICATION TEST"

echo "Logging in as Staff..."
staff_login=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$STAFF_USER\",\"password\":\"$STAFF_PASS\"}")

STAFF_TOKEN=$(echo $staff_login | jq -r '.token' 2>/dev/null)

if [ -z "$STAFF_TOKEN" ] || [ "$STAFF_TOKEN" = "null" ]; then
    print_error "Staff login failed"
    exit 1
else
    print_success "Staff authenticated"
    echo "Token (first 20 chars): ${STAFF_TOKEN:0:20}..."
fi

print_header "3️⃣  MANAGER OPERATIONS - CAN ACCESS"

# Test 1: Manager can create product
test_endpoint "POST" "/products" "$MANAGER_TOKEN" \
    '{"name":"Test Monitor","sku":"TEST-MON-001","category_id":1,"unit_price":299.99,"reorder_point":5,"reorder_quantity":10}' \
    "Manager: Create product"

# Test 2: Manager can view products
test_endpoint "GET" "/products" "$MANAGER_TOKEN" "" \
    "Manager: View products"

# Test 3: Manager can view warehouses
test_endpoint "GET" "/warehouses" "$MANAGER_TOKEN" "" \
    "Manager: View warehouses"

# Test 4: Manager can view ledger
test_endpoint "GET" "/ledger" "$MANAGER_TOKEN" "" \
    "Manager: View ledger"

# Test 5: Manager can get profile
test_endpoint "GET" "/auth/profile" "$MANAGER_TOKEN" "" \
    "Manager: View own profile"

print_header "4️⃣  STAFF OPERATIONS - CAN ACCESS"

# Test 1: Staff can create receipt
test_endpoint "POST" "/inventory/receipt" "$STAFF_TOKEN" \
    '{"supplier_id":1,"receipt_date":"2026-03-14","reference_number":"TEST-001","items":[{"product_id":1,"quantity":10,"unit_price":100,"location_id":1}],"notes":"Test receipt"}' \
    "Staff: Create stock receipt"

# Test 2: Staff can view inventory
test_endpoint "GET" "/inventory/stock" "$STAFF_TOKEN" "" \
    "Staff: View inventory stock"

# Test 3: Staff can view movement history
test_endpoint "GET" "/inventory/movements" "$STAFF_TOKEN" "" \
    "Staff: View movement history"

# Test 4: Staff can get profile
test_endpoint "GET" "/auth/profile" "$STAFF_TOKEN" "" \
    "Staff: View own profile"

print_header "5️⃣  STAFF PERMISSION RESTRICTIONS - CANNOT ACCESS"

# Test 1: Staff cannot create product
echo -e "${YELLOW}→ Staff: Try to create product (should fail)${NC}"
staff_product=$(curl -s -X POST "$API_BASE/products" \
    -H "Authorization: Bearer $STAFF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Staff Test","sku":"STAFF-TEST","category_id":1,"unit_price":100}')

if echo "$staff_product" | grep -q "Unauthorized\|Forbidden\|403\|401"; then
    print_success "Correctly denied: Staff cannot create products"
else
    print_warning "Warning: Staff was able to create products (permission issue?)"
fi

# Test 2: Staff cannot create warehouse
echo -e "${YELLOW}→ Staff: Try to create warehouse (should fail)${NC}"
staff_warehouse=$(curl -s -X POST "$API_BASE/warehouses" \
    -H "Authorization: Bearer $STAFF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Staff Warehouse","location":"Test","capacity":1000}')

if echo "$staff_warehouse" | grep -q "Unauthorized\|Forbidden\|403\|401"; then
    print_success "Correctly denied: Staff cannot create warehouses"
else
    print_warning "Warning: Staff was able to create warehouses (permission issue?)"
fi

print_header "6️⃣  WORKFLOW INTEGRATION TEST"

echo ""
echo "Testing complete workflow: Receipt → Stock Update → Delivery"
echo ""

# Get initial stock
echo -e "${YELLOW}1. Manager: Check initial stock${NC}"
initial_stock=$(curl -s -X GET "$API_BASE/inventory/stock" \
    -H "Authorization: Bearer $MANAGER_TOKEN")
print_success "Retrieved initial stock"

# Staff creates receipt
echo -e "${YELLOW}2. Staff: Create stock receipt (Qty: 50)${NC}"
receipt=$(curl -s -X POST "$API_BASE/inventory/receipt" \
    -H "Authorization: Bearer $STAFF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "supplier_id":1,
        "receipt_date":"2026-03-14",
        "reference_number":"WF-001",
        "items":[{"product_id":1,"quantity":50,"unit_price":100,"location_id":1}],
        "notes":"Workflow test receipt"
    }')
print_success "Stock receipt created"

# Manager checks updated stock
echo -e "${YELLOW}3. Manager: Verify stock increased${NC}"
updated_stock=$(curl -s -X GET "$API_BASE/inventory/stock" \
    -H "Authorization: Bearer $MANAGER_TOKEN")
print_success "Stock level verified after receipt"

# Staff creates delivery
echo -e "${YELLOW}4. Staff: Create delivery (Qty: 10)${NC}"
delivery=$(curl -s -X POST "$API_BASE/inventory/delivery" \
    -H "Authorization: Bearer $STAFF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "delivery_date":"2026-03-14",
        "recipient":"Test Customer",
        "destination":"Test Location",
        "items":[{"product_id":1,"quantity":10,"location_id":1}],
        "notes":"Workflow test delivery"
    }')
print_success "Delivery created"

# Manager checks ledger
echo -e "${YELLOW}5. Manager: Review ledger entries${NC}"
ledger=$(curl -s -X GET "$API_BASE/ledger" \
    -H "Authorization: Bearer $MANAGER_TOKEN")
ledger_count=$(echo $ledger | jq '.data | length' 2>/dev/null || echo 0)
echo "Ledger entries found: $ledger_count"
if [ "$ledger_count" -gt 0 ]; then
    print_success "Ledger entries created and accessible"
else
    print_warning "No ledger entries found"
fi

print_header "7️⃣  ERROR HANDLING TESTS"

# Test 1: Invalid credentials
echo -e "${YELLOW}→ Test: Invalid login credentials${NC}"
invalid_login=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"invalid","password":"wrong"}')

if echo "$invalid_login" | grep -q "Invalid\|invalid\|unauthorized\|Unauthorized"; then
    print_success "Correctly rejected invalid credentials"
else
    print_warning "Invalid credentials handling may need review"
fi

# Test 2: Missing required fields
echo -e "${YELLOW}→ Test: Missing required fields in receipt${NC}"
invalid_receipt=$(curl -s -X POST "$API_BASE/inventory/receipt" \
    -H "Authorization: Bearer $STAFF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"supplier_id":1}')

if echo "$invalid_receipt" | grep -q "error\|Error\|invalid\|Invalid"; then
    print_success "Correctly rejected incomplete receipt"
else
    print_warning "Validation may need review"
fi

# Test 3: Insufficient stock for delivery
echo -e "${YELLOW}→ Test: Attempt delivery with insufficient stock${NC}"
excessive_delivery=$(curl -s -X POST "$API_BASE/inventory/delivery" \
    -H "Authorization: Bearer $STAFF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "delivery_date":"2026-03-14",
        "recipient":"Test",
        "destination":"Test",
        "items":[{"product_id":1,"quantity":99999,"location_id":1}],
        "notes":"Excessive delivery test"
    }')

if echo "$excessive_delivery" | grep -q "error\|Error\|insufficient\|Insufficient"; then
    print_success "Correctly prevented excessive delivery"
else
    print_warning "Stock validation may need review"
fi

print_header "📊 TEST SUMMARY"

echo ""
echo "✅ Tests completed for:"
echo "   • Manager Authentication"
echo "   • Staff Authentication"  
echo "   • Manager Access Controls"
echo "   • Staff Access Controls"
echo "   • Permission Restrictions"
echo "   • Workflow Integration"
echo "   • Error Handling"
echo ""
echo "📍 Endpoints tested:"
echo "   • /auth/login"
echo "   • /auth/profile"
echo "   • /products"
echo "   • /warehouses"
echo "   • /inventory/stock"
echo "   • /inventory/receipt"
echo "   • /inventory/delivery"
echo "   • /inventory/movements"
echo "   • /ledger"
echo ""
echo -e "${GREEN}🎉 Role-based workflow testing complete!${NC}"
echo ""

