# 🔧 Google SMTP Setup - Complete Visual Guide

## 📍 Where to Go in Google

### Step 1: Enable 2-Factor Authentication
**URL:** https://myaccount.google.com/security

1. Open the link above in your browser
2. Look for **"2-Step Verification"** section
3. Click it
4. Follow Google's prompts (you'll verify with your phone)

```
https://myaccount.google.com/security
                              ↓
                    2-Step Verification
                              ↓
                      Enable it (if not already done)
```

---

## 🔑 Step 2: Create App Password

**URL:** https://myaccount.google.com/apppasswords

1. Open the link above in your browser
2. You'll see a dropdown that says **"Select the app and device you're using"**
3. Choose:
   - **App:** Mail
   - **Device:** Windows Computer (or your device type)
4. Click **"Generate"**
5. Google will show you a **16-character password** (looks like: `abcd efgh ijkl mnop`)

```
https://myaccount.google.com/apppasswords
                              ↓
                   Select App: Mail
                   Select Device: Windows Computer
                              ↓
                           Generate
                              ↓
                     See 16-char password
```

---

## 📋 Step 3: Copy the Password

**Important:** The password has spaces in it!
```
Example: abcd efgh ijkl mnop
         ↑    ↑    ↑    ↑
         These are spaces - REMOVE THEM!
```

**Copy this:** `abcdefghijklmnop` (no spaces)

---

## 🎯 Step 4: Update CoreInventory .env File

Now update your CoreInventory `.backend/.env` file:

```bash
# Open: backend/.env

# Add or update these lines:
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=abcdefghijklmnop
```

**Example:**
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=john.doe@gmail.com
SENDER_PASSWORD=wncdqmtwxyzabcde
```

---

## ✅ Step 5: Test It

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

---

## 📍 Quick Link Reference

| Step | URL |
|------|-----|
| **1. Enable 2FA** | https://myaccount.google.com/security |
| **2. Create App Password** | https://myaccount.google.com/apppasswords |
| **3. Google Account Home** | https://myaccount.google.com |

---

## 🔍 If You Can't Find These Pages

### Alternative Method:
1. Go to https://myaccount.google.com
2. Click **"Security"** on the left sidebar
3. Scroll down to find **"2-Step Verification"** and **"App passwords"**

```
https://myaccount.google.com
         ↓
    [Security] ← Click this
         ↓
   Scroll down
         ↓
  2-Step Verification
  App passwords
```

---

## ⚠️ Common Issues & Fixes

### "I can't find App passwords option"
**Solution:** Make sure 2-Factor Authentication is ENABLED first
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Wait 5 minutes
4. Then go to https://myaccount.google.com/apppasswords

### "I see 'App passwords' but it's greyed out"
**Solution:** 2FA is not properly enabled
1. Go to https://myaccount.google.com/security
2. Click 2-Step Verification
3. Verify with your phone
4. Wait a minute
5. Try App passwords again

### "The password doesn't work"
**Solution:** Make sure you:
- ✅ Removed ALL spaces from the password
- ✅ Used EXACTLY as shown (uppercase/lowercase)
- ✅ Restarted the backend after updating .env
- ✅ Your Gmail account isn't using a third-party app restriction

---

## 🎯 Quick Checklist

- [ ] Open https://myaccount.google.com/security
- [ ] Enable "2-Step Verification"
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select App: **Mail**
- [ ] Select Device: **Windows Computer** (or your device)
- [ ] Click **Generate**
- [ ] Copy the 16-character password (remove spaces)
- [ ] Update `backend/.env` with:
  - [ ] SMTP_SERVER=smtp.gmail.com
  - [ ] SMTP_PORT=587
  - [ ] SENDER_EMAIL=your-email@gmail.com
  - [ ] SENDER_PASSWORD=paste-password-here
- [ ] Run `python3 backend/test_smtp.py`
- [ ] Verify output shows ✅ PASSED

---

## 📸 Visual Map of Google Account Pages

```
                    https://myaccount.google.com
                              ↓
                    ┌─────────────────────┐
                    │   Google Account    │
                    │      Home Page      │
                    └─────────────────────┘
                              ↓
                    Left Sidebar: "Security"
                              ↓
           ┌──────────────────────────────────┐
           │   https://myaccount.google.com   │
           │          /security               │
           └──────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  2-Step Verification│ ← ENABLE THIS FIRST
                    │  App passwords      │ ← THEN USE THIS
                    │  Security keys      │
                    │  ...                │
                    └─────────────────────┘
                              ↓
                    Direct links:
                    https://myaccount.google.com/security
                    https://myaccount.google.com/apppasswords
```

---

## 🚀 Next Steps

1. ✅ Complete Google setup above
2. ✅ Update your `backend/.env` file
3. ✅ Run: `python3 backend/test_smtp.py`
4. ✅ Restart backend: `PORT=5001 python3 app.py`
5. ✅ Test password reset at http://localhost:5173/forgot-password

---

## 💡 Pro Tips

✅ **Bookmark the links:** Save these URLs for future reference
✅ **Use copy-paste:** Don't type the 16-char password manually
✅ **Remove spaces:** The password has spaces - remove them all
✅ **Restart backend:** Must restart after updating .env
✅ **Check spam:** Email might go to spam folder initially

---

## 📞 Still Stuck?

If something isn't working:

1. **Can't find 2FA option?**
   → Make sure you're on https://myaccount.google.com/security

2. **Can't find App passwords?**
   → Enable 2FA first, then wait 5 minutes

3. **Password doesn't work?**
   → Remove all spaces and try again

4. **SMTP test fails?**
   → Run: `python3 backend/test_smtp.py` for detailed errors

5. **Still issues?**
   → Read: `GMAIL_QUICK_SETUP.md` in the root directory

---

**That's it! You now have everything you need to set up Gmail SMTP.** 🎉

The two links you need:
- **Enable 2FA:** https://myaccount.google.com/security
- **Get App Password:** https://myaccount.google.com/apppasswords
