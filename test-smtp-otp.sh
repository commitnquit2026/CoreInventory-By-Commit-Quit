#!/bin/bash

# ============================================================================
# CoreInventory - SMTP & OTP Testing Script
# ============================================================================
# Test SMTP email configuration and OTP/2FA functionality
# ============================================================================

echo "🔐 CoreInventory - SMTP & OTP Test Suite"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# PART 1: Test SMTP Configuration
# ============================================================================

echo -e "${YELLOW}PART 1: SMTP Email Configuration Test${NC}"
echo "----------------------------------------"
echo ""

# Run Python SMTP test
cd "$(dirname "$0")/backend" || exit
python3 test_smtp.py

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SMTP Test Passed${NC}"
else
    echo -e "${RED}❌ SMTP Test Failed${NC}"
    echo "   Run 'python3 backend/test_smtp.py' for details"
fi

echo ""

# ============================================================================
# PART 2: Test OTP/2FA Endpoints
# ============================================================================

echo -e "${YELLOW}PART 2: OTP & 2FA Endpoints Test${NC}"
echo "-----------------------------------"
echo ""

# 2.1 Get fresh login token
echo "Step 1: Getting authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test@123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✅ Login successful${NC}"
    echo "   User ID: $USER_ID"
    echo "   Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi

echo ""

# 2.2 Test Setup 2FA endpoint
echo "Step 2: Setting up 2FA..."
SETUP_2FA=$(curl -s -X POST http://localhost:5000/api/v1/auth/setup-2fa \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

SECRET=$(echo $SETUP_2FA | jq -r '.secret' 2>/dev/null)
QR_CODE=$(echo $SETUP_2FA | jq -r '.qr_code' 2>/dev/null | head -c 50)

if [ "$SECRET" != "null" ] && [ ! -z "$SECRET" ]; then
    echo -e "${GREEN}✅ 2FA Setup initiated${NC}"
    echo "   Secret: $SECRET"
    echo "   QR Code: ${QR_CODE}..."
else
    echo -e "${RED}❌ 2FA Setup failed${NC}"
    echo "   Response: $SETUP_2FA"
fi

echo ""

# 2.3 Test password reset OTP endpoint
echo "Step 3: Testing password reset OTP..."
RESET_OTP=$(curl -s -X POST http://localhost:5000/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

RESET_TOKEN=$(echo $RESET_OTP | jq -r '.reset_token' 2>/dev/null)
MESSAGE=$(echo $RESET_OTP | jq -r '.message' 2>/dev/null)

if [ "$RESET_TOKEN" != "null" ] && [ ! -z "$RESET_TOKEN" ]; then
    echo -e "${GREEN}✅ Password reset OTP sent${NC}"
    echo "   Reset Token: ${RESET_TOKEN:0:50}..."
    echo "   Message: $MESSAGE"
    echo "   (Check email for OTP code)"
else
    echo -e "${YELLOW}⚠️  Password reset endpoint response${NC}"
    echo "   Response: $RESET_OTP"
fi

echo ""

# ============================================================================
# PART 3: Configuration Status Summary
# ============================================================================

echo -e "${YELLOW}PART 3: Configuration Status${NC}"
echo "-----------------------------"
echo ""

# Check .env file
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
    
    # Check for SMTP settings
    if grep -q "SMTP_SERVER" .env; then
        SMTP_SERVER=$(grep "SMTP_SERVER" .env | cut -d '=' -f 2)
        echo "   • SMTP_SERVER: $SMTP_SERVER"
    fi
    
    if grep -q "SENDER_EMAIL" .env; then
        SENDER_EMAIL=$(grep "SENDER_EMAIL" .env | cut -d '=' -f 2)
        echo "   • SENDER_EMAIL: ${SENDER_EMAIL:0:10}..."
    fi
    
    # Check for OTP settings  
    if grep -q "OTP_ENABLED\|2FA" .env; then
        echo "   • OTP/2FA: Configured"
    else
        echo "   • OTP/2FA: Default settings"
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
    echo "   Create .env with SMTP and OTP settings"
fi

echo ""

# ============================================================================
# PART 4: Recommendations
# ============================================================================

echo -e "${YELLOW}PART 4: Next Steps${NC}"
echo "------------------"
echo ""
echo "✅ To enable SMTP email notifications:"
echo "   1. Set SMTP_SERVER in .env (default: smtp.gmail.com)"
echo "   2. Set SENDER_EMAIL in .env"
echo "   3. Set SENDER_PASSWORD in .env"
echo "   4. For Gmail: Create App Password (requires 2FA)"
echo "   5. Run: python3 backend/test_smtp.py"
echo ""
echo "✅ To test 2FA/OTP flow:"
echo "   1. User calls POST /auth/setup-2fa"
echo "   2. Scan QR code with Google Authenticator/Authy"
echo "   3. User calls POST /auth/verify-2fa with TOTP token"
echo "   4. 2FA is enabled on account"
echo ""
echo "✅ Password reset with OTP:"
echo "   1. User requests reset: POST /auth/request-password-reset"
echo "   2. OTP code sent to email (requires SMTP configured)"
echo "   3. User resets with: POST /auth/reset-password-otp"
echo ""

# ============================================================================
# Summary
# ============================================================================

echo "=========================================="
echo -e "${GREEN}✅ SMTP & OTP Test Complete${NC}"
echo "=========================================="
