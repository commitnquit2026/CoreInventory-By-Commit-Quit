# 👆 Google SMTP Setup - Click by Click Guide

## Step 1️⃣: Enable 2-Factor Authentication

### Open This URL:
```
https://myaccount.google.com/security
```

### What You'll See:
```
┌─────────────────────────────────────────┐
│  Google Account Security                │
│                                         │
│  LEFT SIDEBAR:                          │
│  ├─ Personal info                       │
│  ├─ Security  ← YOU ARE HERE            │
│  ├─ Privacy & personalization           │
│  └─ ...                                 │
│                                         │
│  MAIN AREA:                             │
│  ├─ How you sign in to Google          │
│  ├─ Your devices                        │
│  ├─ Your security events               │
│  └─ ...                                 │
│                                         │
│  SCROLL DOWN, FIND:                     │
│  ┌─────────────────────────────────────┐│
│  │ 2-Step Verification       [ENABLE]   ││
│  │ Add a recovery email                 ││
│  │ Add a recovery phone number          ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Click:
1. Find **"2-Step Verification"** section
2. Click the **[ENABLE]** or **[Start Setup]** button
3. Follow Google's verification steps (confirm with your phone)

---

## Step 2️⃣: Get App Password

### Open This URL:
```
https://myaccount.google.com/apppasswords
```

### What You'll See:
```
┌─────────────────────────────────────────┐
│  App passwords                          │
│                                         │
│  "Select the app and device you're     │
│   using"                                │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Select app:      [Dropdown ▼]    │  │
│  │                  ↓                │  │
│  │  • Mail       ← CLICK THIS        │  │
│  │  • Calendar                       │  │
│  │  • Contacts                       │  │
│  │  • Gmail                          │  │
│  │  • Drive                          │  │
│  │  • YouTube                        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Select device: [Dropdown ▼]      │  │
│  │                ↓                  │  │
│  │  • Windows Computer ← CLICK THIS  │  │
│  │  • iPhone                         │  │
│  │  • Android phone                  │  │
│  │  • Mac                            │  │
│  │  • Linux                          │  │
│  └──────────────────────────────────┘  │
│                                         │
│          [GENERATE BUTTON]              │
└─────────────────────────────────────────┘
```

### Click These (in order):
1. Click the **"Select app"** dropdown
2. Choose **"Mail"**
3. Click the **"Select device"** dropdown
4. Choose **"Windows Computer"** (or your device)
5. Click **[GENERATE]** button

### You'll See:
```
┌─────────────────────────────────────────┐
│  Your app password:                     │
│                                         │
│  abcd efgh ijkl mnop                    │
│                                         │
│  [COPY TO CLIPBOARD]                    │
│                                         │
│  ⚠️ This is the only time you'll       │
│     see this password                   │
└─────────────────────────────────────────┘
```

### Copy the Password:
1. Click **[COPY TO CLIPBOARD]** button (or select & copy manually)
2. The password is: `abcd efgh ijkl mnop`
3. **REMOVE SPACES:** `abcdefghijklmnop`

---

## Step 3️⃣: Update CoreInventory

### File to Edit:
```
backend/.env
```

### Add These Lines:
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=abcdefghijklmnop
```

**Example (if your Gmail is john@gmail.com):**
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=john@gmail.com
SENDER_PASSWORD=wncdqmtwxyzabcde
```

---

## Step 4️⃣: Test It

### Run This Command:
```bash
cd backend
python3 test_smtp.py
```

### Expected Output:
```
✅ Configuration Found
✅ SMTP Server: smtp.gmail.com
✅ SMTP Port: 587
✅ Sender Email: john@gmail.com
✅ Sender Password: SET
✅ Connected to smtp.gmail.com:587
✅ TLS encryption enabled
✅ Authentication successful
✅ SMTP Connection Test PASSED!
```

If you see this, you're done! 🎉

---

## 🔗 The Two URLs You Need

**Save These:**
```
Step 1: https://myaccount.google.com/security
Step 2: https://myaccount.google.com/apppasswords
```

---

## 💬 Quick Summary

| # | What | Where | Action |
|---|------|-------|--------|
| 1 | Enable 2FA | myaccount.google.com/security | Enable 2-Step Verification |
| 2 | Get Password | myaccount.google.com/apppasswords | Mail + Windows Computer → Generate |
| 3 | Update CoreInventory | backend/.env | Paste password (no spaces) |
| 4 | Test | Terminal | python3 backend/test_smtp.py |

---

**That's literally all you need to do!** ⚡

The hardest part is remembering to:
1. ✅ Remove spaces from password
2. ✅ Restart backend after updating .env
3. ✅ Put the password in the right file

**Everything else is automated.** 🤖
