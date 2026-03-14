# Gmail SMTP Setup - Quick Reference

## ⚡ 5-Minute Gmail Setup

### Step 1: Enable 2-Factor Authentication (2 minutes)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the prompts to enable 2FA
4. Verify with your phone

### Step 2: Create App Password (1 minute)
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select: **Mail** → **Windows Computer** (or your device)
3. Click **Generate**
4. Copy the 16-character password
   - Example: `abcd efgh ijkl mnop` (has spaces)
   - Remove spaces: `abcdefghijklmnop`

### Step 3: Add to CoreInventory (1 minute)
```bash
# In backend/.env:

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=abcdefghijklmnop
```

### Step 4: Restart Backend (1 minute)
```bash
PORT=5001 python3 app.py
```

## ✅ Test It Works

```bash
cd backend
python3 test_smtp.py
```

Expected output:
```
✅ Connected to smtp.gmail.com:587
✅ TLS encryption enabled
✅ Authentication successful
✅ SMTP Connection Test PASSED!
```

## 🎯 Now Test Password Reset

1. Go to http://localhost:5173/forgot-password
2. Enter your email address
3. Check your inbox for the OTP code
4. Enter the code and create new password
5. ✅ Done!

## ⚠️ Troubleshooting

### Problem: "Authentication failed"
**Solution:** 
- ✅ Make sure 2FA is enabled on Google Account
- ✅ Make sure you used App Password (not your Google password)
- ✅ Make sure you removed spaces from the password
- ✅ Copy/paste is safer than typing

### Problem: "Connection timeout"
**Solution:**
- ✅ Check internet connection
- ✅ Verify SMTP_SERVER = smtp.gmail.com
- ✅ Verify SMTP_PORT = 587

### Problem: "Email not received"
**Solution:**
- ✅ Check spam/junk folder
- ✅ Check SENDER_EMAIL matches your Gmail address
- ✅ Wait a few seconds (might be delayed)
- ✅ Check email provider's status page

## 📋 Checklist

- [ ] Enabled 2-Factor Authentication on Google Account
- [ ] Created App Password (16 characters)
- [ ] Updated backend/.env with:
  - [ ] SMTP_SERVER=smtp.gmail.com
  - [ ] SMTP_PORT=587
  - [ ] SENDER_EMAIL=your-gmail@gmail.com
  - [ ] SENDER_PASSWORD=16-char-password-no-spaces
- [ ] Ran python3 test_smtp.py (passed)
- [ ] Restarted backend with PORT=5001 python3 app.py
- [ ] Tested password reset in UI (worked)

## 🔒 Security Tips

✅ Use **App Password**, not your Google password  
✅ Keep `.env` file **out of git** (add to .gitignore)  
✅ Only share `.env.example`, never `.env`  
✅ Create separate Gmail account for production  
✅ Rotate app password every 90 days  

## 📚 More Info

- [Google Account Security](https://myaccount.google.com/security)
- [App Passwords Help](https://support.google.com/accounts/answer/185833)
- [SMTP Setup Guide](SMTP_SETUP_GUIDE.md)
- [Password Reset Guide](PASSWORD_RESET_GUIDE.md)

---

**That's it! You're done.** 🎉

Password reset emails from CoreInventory should work now!
