# SMTP Email Setup Guide for CoreInventory

## Overview
CoreInventory now has email support for password reset notifications. This guide will help you configure SMTP to send OTP emails.

## Email Features
- 🔐 **Password Reset**: User receives OTP code via email
- 📧 **Professional Templates**: HTML and plain-text email formats
- ⚠️ **Security**: Never reveals if email exists in system
- 🔒 **Protected OTP**: 6-digit code valid for 1 hour

## Quick Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already done

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Click "Generate"
4. Copy the 16-character password (remove spaces)

### Step 3: Update .env File
1. Copy `.env.example` to `.env`
2. Update these values:
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=xxxxxxxxxxxx  # Paste the 16-char app password
```

### Step 4: Restart Backend
```bash
PORT=5001 python3 app.py
```

### Step 5: Test Password Reset
1. Go to http://localhost:5173/forgot-password
2. Enter an email address (e.g., testuser@coreinventory.local)
3. Check your email for OTP code
4. Use the OTP to reset your password

---

## Alternative Email Providers

### Microsoft 365 / Outlook
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SENDER_EMAIL=your-email@outlook.com
SENDER_PASSWORD=your-outlook-password
```

### SendGrid
1. Create account at [SendGrid](https://sendgrid.com)
2. Generate API key
3. Configure:
```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SENDER_EMAIL=apikey
SENDER_PASSWORD=SG.your-api-key-here
```

### AWS SES (Simple Email Service)
1. Verify email in AWS SES console
2. Generate SMTP credentials
3. Configure:
```env
SMTP_SERVER=email-smtp.us-east-1.amazonaws.com  # Replace region
SMTP_PORT=587
SENDER_EMAIL=your-verified-email@example.com
SENDER_PASSWORD=your-ses-password
```

### Mailgun
1. Create account at [Mailgun](https://www.mailgun.com)
2. Get SMTP credentials from dashboard
3. Configure:
```env
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SENDER_EMAIL=postmaster@your-domain.mailgun.org
SENDER_PASSWORD=your-mailgun-password
```

---

## Password Reset Flow

### User Perspective
1. Click "Forgot Password?" on login page
2. Enter email address
3. Receive email with 6-digit OTP code
4. Return to page and enter OTP
5. Create new password
6. Log in with new password

### Backend Flow
```
POST /api/v1/auth/request-password-reset
├── Validate email exists
├── Generate reset_token (UUID)
├── Generate otp_code (6-digit)
├── Save to PasswordResetToken table (expires 1 hour)
└── Send email with OTP ✅ (NEW)

POST /api/v1/auth/reset-password
├── Validate reset_token exists and not expired
├── Verify otp_code matches
├── Validate new password strength
├── Hash new password
├── Mark token as used
└── Return success
```

---

## Email Template Features

### Password Reset Email Includes:
✅ User's name in greeting  
✅ Bold, easy-to-read OTP code  
✅ Clear expiration time (1 hour)  
✅ Security warning about sharing OTP  
✅ Step-by-step reset instructions  
✅ Plain-text fallback for old email clients  
✅ Professional HTML design  
✅ Company branding with footer  

### Example Email
```
To: testuser@coreinventory.local
Subject: CoreInventory - Password Reset Request

Your OTP: 123456
(Valid for 1 hour)

Steps to reset:
1. Go to password reset page
2. Enter your email
3. Enter the OTP: 123456
4. Create new password
5. Log in with new password
```

---

## Troubleshooting

### Email Not Being Sent

**Problem**: "Email service not configured"
- **Solution**: Make sure `.env` file has SMTP_PASSWORD filled in

**Problem**: "Email service authentication failed"
- **Solution**: 
  - Gmail: Check app password is correct and 2FA is enabled
  - Other: Verify credentials are correct

**Problem**: SMTP connection timeout
- **Solution**: 
  - Check SMTP_SERVER and SMTP_PORT are correct
  - Ensure firewall allows outgoing connections on port 587

### Email Received But...

**OTP code is wrong**
- The code is generated fresh for each request and stored in database
- Valid for 1 hour only

**User not receiving emails**
- Check spam/junk folder
- Verify email address is correct in system
- Check SENDER_EMAIL matches your email provider account

---

## Security Considerations

⚠️ **DO NOT HARDCODE** SMTP credentials in code  
⚠️ **ALWAYS USE .env** file with proper file permissions  
⚠️ **DO NOT COMMIT** .env to version control  
✅ **USE APP PASSWORDS** for Gmail, not your main password  
✅ **ENABLE 2FA** on your email account  
✅ **ROTATE CREDENTIALS** periodically  
✅ **USE HTTPS** in production  

---

## Disabling Email (Development Only)

If you want to test password reset without email:
1. Leave SENDER_PASSWORD empty in .env
2. System will generate OTP and display in response for testing

**Note**: In production, always configure email for user experience.

---

## Backend Code Changes

### New File: `/backend/app/utils/email.py`
- `EmailUtils.send_password_reset_email()` - Sends OTP to user
- `EmailUtils.send_welcome_email()` - Optional welcome email to new users

### Updated: `/backend/app/routes/auth.py`
- Added email import
- Updated `/request-password-reset` to send OTP via email
- Email errors logged but don't block the request

### Configuration: `/backend/.env.example`
- Added SMTP configuration template
- Added instructions for Gmail, Outlook, SendGrid, AWS SES

---

## Testing

### Test Password Reset Email Flow

```bash
# 1. Start backend with SMTP configured
PORT=5001 python3 app.py

# 2. Request password reset for testuser
curl -X POST http://localhost:5001/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@coreinventory.local"}'

# 3. Check email inbox for OTP

# 4. Reset password with OTP
curl -X POST http://localhost:5001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "reset_token":"token-from-request",
    "otp_code":"123456",
    "new_password":"NewPass@123"
  }'

# 5. Log in with new password
```

---

## Production Deployment

For production use:
1. Use environment variables in your hosting platform (AWS, Heroku, DigitalOcean, etc.)
2. Use a transactional email service (SendGrid, AWS SES, Mailgun)
3. Enable HTTPS for all connections
4. Monitor email delivery rates
5. Set up email bounce handling
6. Configure email authentication (SPF, DKIM, DMARC)

---

## Support & Questions

For issues with SMTP:
1. Check the backend logs for error messages
2. Verify .env configuration matches your email provider
3. Test credentials using a simple SMTP test script
4. Check email provider's documentation for port/server details

---

**Last Updated**: 2026  
**CoreInventory Version**: 1.0
