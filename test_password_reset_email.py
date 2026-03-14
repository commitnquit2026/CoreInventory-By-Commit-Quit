#!/usr/bin/env python3
"""
Test password reset email functionality
"""
import requests
import json

BASE_URL = "http://localhost:5000"

# Test email address - use a valid one to receive the email
TEST_EMAIL = input("Enter email address to receive password reset OTP: ").strip()

if not TEST_EMAIL:
    print("❌ Email address required")
    exit(1)

print(f"\n🧪 Testing password reset email to: {TEST_EMAIL}")
print("=" * 60)

# Step 1: Request password reset
try:
    resp = requests.post(
        f"{BASE_URL}/api/v1/auth/request-password-reset",
        json={"email": TEST_EMAIL}
    )
    data = resp.json()
    
    if resp.status_code == 200:
        print(f"✅ Password reset requested")
        print(f"   Message: {data.get('message')}")
        print(f"   Reset Token: {data.get('reset_token')[:20]}...")
        print(f"\n📧 Check your email ({TEST_EMAIL}) for OTP code")
        print(f"   Email sent by: commit.and.quit2026@gmail.com")
        print(f"   Subject: CoreInventory - Password Reset Request")
        print(f"\n⏰ OTP expires in: 1 hour")
        
        # Offer to accept the reset token for testing
        reset_token = data.get('reset_token')
        if reset_token:
            print(f"\n💾 Reset Token for testing:")
            print(f"   {reset_token}")
    else:
        print(f"❌ Error: {data.get('message')}")
        print(f"   Status: {resp.status_code}")
        
except Exception as e:
    print(f"❌ Connection error: {e}")
    print(f"   Make sure backend is running on port 5000")

print("\n" + "=" * 60)
