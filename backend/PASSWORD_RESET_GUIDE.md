# CoreInventory Password Reset & Email Setup

## 🎯 Overview

CoreInventory now supports **secure password reset with OTP (One-Time Password)** delivered via email. Users can recover their accounts by providing their email address and verifying a 6-digit code.

## ✨ Features

✅ **Email-Based Password Recovery** - Secure OTP delivery via SMTP  
✅ **Time-Limited OTP** - Codes expire after 1 hour  
✅ **No Password Tokens** - Uses random token + OTP for maximum security  
✅ **Multiple Email Providers** - Gmail, Outlook, SendGrid, AWS SES, etc.  
✅ **HTML & Plain-Text** - Professional email templates  
✅ **Error Handling** - Graceful fallback if email unavailable  

## 🚀 Quick Start

### 1. Configure SMTP

Copy the example environment file and add your email provider credentials:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your SMTP settings:

```bash
# Gmail Example
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-16-char-app-password
```

**For Gmail Users:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Create [App Password](https://myaccount.google.com/apppasswords)
4. Use the 16-character password in `.env`

### 2. Test SMTP Configuration

```bash
cd backend
python3 test_smtp.py
```

This will:
- ✅ Verify SMTP server connection
- ✅ Test authentication
- ✅ Optionally send a test email

### 3. Restart Backend

```bash
PORT=5001 python3 app.py
```

### 4. Test Password Reset Flow

1. Open http://localhost:5173/forgot-password
2. Enter your email address
3. Check your inbox for the OTP code
4. Enter the code and create a new password
5. Log in with your new credentials

## 📧 Email Providers

### Gmail (Recommended for Testing)
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password
```

### Microsoft 365 / Outlook
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SENDER_EMAIL=your-email@outlook.com
SENDER_PASSWORD=your-password
```

### SendGrid
```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SENDER_EMAIL=apikey
SENDER_PASSWORD=SG.your-api-key
```

### AWS SES
```env
SMTP_SERVER=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SENDER_EMAIL=verified-email@example.com
SENDER_PASSWORD=your-ses-password
```

See **SMTP_SETUP_GUIDE.md** for detailed instructions for each provider.

## 🔄 Password Reset Flow

### User Journey
```
1. Click "Forgot Password?" on login page
   ↓
2. Enter email address and click "Send OTP"
   ↓
3. System generates 6-digit OTP and sends via email
   ↓
4. User receives email with OTP code
   ↓
5. User enters OTP and new password
   ↓
6. System validates OTP and updates password
   ↓
7. User logs in with new password
```

### API Endpoints

**Request Password Reset:**
```bash
POST /api/v1/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Password reset OTP sent to email",
  "reset_token": "uuid-string-here"
}
```

**Reset Password with OTP:**
```bash
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "reset_token": "uuid-from-above",
  "otp_code": "123456",
  "new_password": "SecurePass@123"
}

Response:
{
  "success": true,
  "message": "Password reset successfully"
}
```

## 🔐 Security Features

✅ **6-Digit OTP** - Random numeric code  
✅ **1-Hour Expiration** - Codes expire after 1 hour  
✅ **One-Time Use** - Each code can only be used once  
✅ **Secure Token** - UUID reset token in database  
✅ **No Email Disclosure** - Doesn't reveal if email exists  
✅ **Password Validation** - New passwords must be strong:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 digit
  - At least 1 special character

## 📁 New Files Added

```
backend/
├── app/utils/email.py              # Email sending utility
├── SMTP_SETUP_GUIDE.md             # Detailed SMTP setup guide
├── test_smtp.py                    # SMTP configuration tester
├── .env.example                    # Updated with SMTP config
└── requirements.txt                # Updated with Pillow for QR codes
```

## 🔧 Implementation Details

### `email.py` - Email Utility Module

**Class: `EmailUtils`**

```python
# Send password reset email with OTP
success, message = EmailUtils.send_password_reset_email(
    user_email="user@example.com",
    user_name="John Doe",
    reset_token="uuid-string",
    otp_code="123456"
)

# Send welcome email to new user
success, message = EmailUtils.send_welcome_email(
    user_email="user@example.com",
    user_name="John Doe"
)
```

**Features:**
- SMTP configuration from environment variables
- HTML and plain-text email templates
- Professional styling with company branding
- Error handling with descriptive messages
- Graceful degradation if email unavailable

### Updated `auth.py`

**Changes in `/request-password-reset` endpoint:**
- ✅ Generates OTP code
- ✅ Creates reset token
- ✅ Stores in database
- ✅ **Sends email with OTP code** (NEW)
- ✅ Returns reset_token to client

**No changes to `/reset-password` endpoint:**
- Still validates token and OTP
- Still updates password
- Still marks token as used

## 🧪 Testing

### Test SMTP Connection
```bash
cd backend
python3 test_smtp.py
```

### Test via API
```bash
# Request reset
curl -X POST http://localhost:5001/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@coreinventory.local"}'

# Check email for OTP code

# Reset password
curl -X POST http://localhost:5001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "reset_token":"token-from-above",
    "otp_code":"123456",
    "new_password":"NewPass@123"
  }'
```

### Test via UI
1. Go to http://localhost:5173/forgot-password
2. Enter your email
3. Check email for OTP
4. Complete the reset form
5. Log in with new password

## ⚠️ Troubleshooting

### Email Not Sending
- ❌ **SENDER_PASSWORD not set**: Configure in `.env`
- ❌ **Authentication failed**: Verify email credentials
- ❌ **Timeout/Connection error**: Check SMTP server and port

### OTP Not Received
- ❌ **Check spam folder**: Add sender to whitelist
- ❌ **Verify email address**: Must be registered in system
- ❌ **Try again**: Each request generates new OTP

### Password Reset Fails
- ❌ **Invalid OTP**: Check code matches email
- ❌ **Expired OTP**: Request new one (1-hour limit)
- ❌ **Weak password**: Must meet security requirements

## 📝 Configuration Checklist

- [ ] Create `.env` file from `.env.example`
- [ ] Add SMTP_SERVER and SMTP_PORT
- [ ] Add SENDER_EMAIL
- [ ] Add SENDER_PASSWORD (app password for Gmail)
- [ ] Run `python3 test_smtp.py` to verify
- [ ] Restart backend: `PORT=5001 python3 app.py`
- [ ] Test reset flow in UI
- [ ] Verify email delivery

## 🎓 Email Provider Setup Guides

See **SMTP_SETUP_GUIDE.md** for detailed instructions:
- Gmail (recommended)
- Microsoft 365 / Outlook
- SendGrid
- AWS SES
- Mailgun
- Custom SMTP servers

## 🚀 Production Deployment

For production:
1. Use a transactional email service (SendGrid, AWS SES)
2. Set environment variables in your hosting platform
3. Enable HTTPS for all connections
4. Configure SPF/DKIM/DMARC records
5. Monitor email delivery
6. Set up bounce handling

## 📚 Related Features

This password reset system works alongside:
- ✅ Two-Factor Authentication (2FA) with TOTP
- ✅ Login page with email/username support
- ✅ Account settings with profile management
- ✅ JWT-based authentication

## 📞 Support

For issues:
1. Check backend logs: `PORT=5001 python3 app.py`
2. Run SMTP test: `python3 test_smtp.py`
3. Review **SMTP_SETUP_GUIDE.md**
4. Check email provider's documentation

---

**Last Updated:** 2026  
**CoreInventory Version:** 1.0  
**Status:** ✅ Production Ready
