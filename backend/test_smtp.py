#!/usr/bin/env python3
"""
Test script to verify SMTP email configuration
Run this to test if your email setup is working correctly
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_smtp_connection():
    """Test SMTP connection and credentials"""
    print("=" * 60)
    print("CoreInventory SMTP Configuration Test")
    print("=" * 60)
    
    # Get SMTP config from environment
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    sender_email = os.getenv('SENDER_EMAIL', '')
    sender_password = os.getenv('SENDER_PASSWORD', '')
    
    print("\n📋 Configuration Found:")
    print(f"  SMTP Server: {smtp_server}")
    print(f"  SMTP Port: {smtp_port}")
    print(f"  Sender Email: {sender_email if sender_email else '❌ NOT SET'}")
    print(f"  Sender Password: {'✅ SET' if sender_password else '❌ NOT SET'}")
    
    # Validate configuration
    print("\n🔍 Validation:")
    
    if not sender_email:
        print("  ❌ SENDER_EMAIL not configured")
        print("     → Set SENDER_EMAIL in .env file")
        return False
    
    if not sender_password:
        print("  ⚠️  SENDER_PASSWORD not configured")
        print("     → Email sending will be skipped in development mode")
        print("     → Set SENDER_PASSWORD in .env to enable email")
        return True  # Not a hard error for development
    
    print("  ✅ Email configuration is set")
    
    # Test SMTP connection
    print("\n🔗 Testing SMTP Connection...")
    
    try:
        import smtplib
        
        with smtplib.SMTP(smtp_server, smtp_port, timeout=10) as server:
            print(f"  ✅ Connected to {smtp_server}:{smtp_port}")
            
            # Start TLS
            server.starttls()
            print("  ✅ TLS encryption enabled")
            
            # Try login
            server.login(sender_email, sender_password)
            print(f"  ✅ Authentication successful as {sender_email}")
            
        print("\n✅ SMTP Connection Test PASSED!")
        print("   Your email configuration is working correctly.")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"  ❌ Authentication failed: {str(e)}")
        print("\n     Troubleshooting:")
        print("     1. Verify SENDER_EMAIL is correct")
        print("     2. Verify SENDER_PASSWORD is correct")
        print("     3. For Gmail: ensure 2FA is enabled and use App Password")
        print("     4. For other providers: verify credentials with their support")
        return False
        
    except smtplib.SMTPException as e:
        print(f"  ❌ SMTP error: {str(e)}")
        print("\n     Troubleshooting:")
        print("     1. Verify SMTP_SERVER is correct")
        print("     2. Verify SMTP_PORT is correct (usually 587 for TLS)")
        print("     3. Check firewall allows outgoing connections on port 587")
        print("     4. Try a different port (25, 465, 2525)")
        return False
        
    except Exception as e:
        print(f"  ❌ Unexpected error: {str(e)}")
        print("\n     Troubleshooting:")
        print("     1. Check internet connection")
        print("     2. Verify firewall settings")
        print("     3. Check SMTP provider's status page")
        return False

def test_email_sending():
    """Test sending a test email"""
    if not os.getenv('SENDER_PASSWORD'):
        print("\n⏭️  Skipping email send test (no password configured)")
        return True
    
    print("\n📧 Testing Email Send...")
    
    try:
        from app.utils.email import EmailUtils
        
        test_email = input("\nEnter test email address (or press Enter to skip): ").strip()
        
        if not test_email:
            print("  ⏭️  Skipped email send test")
            return True
        
        print(f"  📤 Sending test email to {test_email}...")
        
        success, message = EmailUtils.send_password_reset_email(
            user_email=test_email,
            user_name="Test User",
            reset_token="test-token-12345",
            otp_code="123456"
        )
        
        if success:
            print(f"  ✅ Email sent successfully!")
            print(f"     Check {test_email} inbox for test email")
            return True
        else:
            print(f"  ❌ Failed to send email: {message}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error during test: {str(e)}")
        return False

def main():
    """Run all tests"""
    print()
    
    # Test SMTP connection first
    connection_ok = test_smtp_connection()
    
    if not connection_ok:
        print("\n❌ SMTP configuration test failed!")
        print("\nPlease configure SMTP in .env file before password reset will work.")
        print("See SMTP_SETUP_GUIDE.md for detailed instructions.")
        sys.exit(1)
    
    # Ask to test email sending
    print("\n" + "=" * 60)
    choice = input("\nSend test email? (y/n): ").strip().lower()
    
    if choice == 'y':
        email_ok = test_email_sending()
        if not email_ok:
            print("\n⚠️  Email send test failed, but SMTP connection is working.")
            sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ All tests passed! Password reset email is ready.")
    print("=" * 60)
    sys.exit(0)

if __name__ == '__main__':
    main()
