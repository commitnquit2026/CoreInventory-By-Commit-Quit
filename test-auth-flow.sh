#!/bin/bash

echo "🔐 Testing Authentication Flow"
echo "=============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test URLs
API_URL="http://localhost:5000/api/v1"
TEST_USER="testuser_$(date +%s)"
TEST_EMAIL="test_$(date +%s)@test.com"
TEST_PASSWORD="TestPass123!"

echo -e "${YELLOW}1. Testing Signup${NC}"
echo "   User: $TEST_USER"
echo "   Email: $TEST_EMAIL"

SIGNUP_RESPONSE=$(curl -s -X POST $API_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USER\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"first_name\": \"Test\",
    \"last_name\": \"User\",
    \"role\": \"Warehouse Staff\"
  }")

echo "Response: $SIGNUP_RESPONSE"

if echo "$SIGNUP_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Signup successful${NC}\n"
else
  echo -e "${RED}✗ Signup failed${NC}\n"
  exit 1
fi

echo -e "${YELLOW}2. Testing Login${NC}"
echo "   Username: $TEST_USER"
echo "   Password: $TEST_PASSWORD"

LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USER\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Login successful${NC}\n"
  
  # Extract token
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "Token: $TOKEN"
  
  echo -e "\n${YELLOW}3. Testing Profile (Protected Route)${NC}"
  
  PROFILE_RESPONSE=$(curl -s -X GET $API_URL/auth/profile \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Response: $PROFILE_RESPONSE"
  
  if echo "$PROFILE_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Profile fetch successful${NC}\n"
  else
    echo -e "${RED}✗ Profile fetch failed${NC}\n"
  fi
else
  echo -e "${RED}✗ Login failed${NC}\n"
  exit 1
fi

echo -e "${YELLOW}4. Testing with Known Credentials (Admin)${NC}"

ADMIN_LOGIN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }')

echo "Response: $ADMIN_LOGIN"

if echo "$ADMIN_LOGIN" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Admin login successful${NC}\n"
  ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "Admin Token: $ADMIN_TOKEN"
else
  echo -e "${RED}✗ Admin login failed${NC}\n"
fi

echo -e "\n${GREEN}✨ All Auth Flow Tests Completed!${NC}"
