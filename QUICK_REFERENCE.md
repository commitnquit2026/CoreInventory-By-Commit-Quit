# 📌 Quick Reference Card - SMTP Email Setup

## 🚀 TL;DR (Too Long; Didn't Read)

```bash
# 1. Copy .env template
cp backend/.env.example backend/.env

# 2. Edit .env with your SMTP credentials
# SMTP_SERVER=smtp.gmail.com
# SMTP_PORT=587
# SENDER_EMAIL=your-email@gmail.com
# SENDER_PASSWORD=your-app-password

# 3. Test SMTP
cd backend
python3 test_smtp.py

# 4. Restart backend
PORT=5001 python3 app.py

# 5. Test at http://localhost:5173/forgot-password
```

**Total time: 10-20 minutes**

---

## 📚 Documentation Quick Links

| Need | Read | Time |
|------|------|------|
| **Visual start** | START_HERE_SMTP.md | 5 min |
| **Gmail user** | GMAIL_QUICK_SETUP.md | 5 min |
| **Other email** | SMTP_SETUP_GUIDE.md | 10-15 min |
| **Full details** | PASSWORD_RESET_GUIDE.md | 10 min |
| **Tech details** | SMTP_IMPLEMENTATION_SUMMARY.md | 10 min |
| **Verify setup** | SMTP_COMPLETE_STATUS.md | 5 min |
| **Find file** | SMTP_DOCUMENTATION_INDEX.md | 5 min |

---

## 🔧 Email Provider Quick Config

### Gmail (5 minutes)
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=xxxx-xxxx-xxxx-xxxx
```
1. Enable 2FA: myaccount.google.com/security
2. Create App Password: myaccount.google.com/apppasswords
3. Copy 16-char password to SENDER_PASSWORD
4. Done!

### Outlook
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

---

## ✅ Verification Checklist

- [ ] .env file created from .env.example
- [ ] SMTP credentials added
- [ ] test_smtp.py runs successfully
- [ ] Backend restarted on port 5001
- [ ] Password reset page loads at /forgot-password
- [ ] Email received after requesting reset
- [ ] OTP code is 6 digits
- [ ] Password reset succeeds
- [ ] New password works for login

---

## 🆘 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| SMTP test fails | Wrong credentials | Verify SMTP_PASSWORD is correct |
| Auth error | Wrong password | For Gmail, use App Password (not Google password) |
| Email not arrive | SENDER_EMAIL wrong | Verify it matches your email provider account |
| Timeout | Wrong server/port | Check SMTP_SERVER and SMTP_PORT |
| Module not found | Missing Pillow | run: pip install Pillow |
| env not found | Wrong path | Use: cp backend/.env.example backend/.env |

---

## 📁 Key Files

```
SETUP & CONFIG:
├─ backend/.env.example      ← Copy this, rename to .env
├─ backend/test_smtp.py      ← Run this to test
└─ backend/app/utils/email.py ← The email service

DOCUMENTATION:
├─ START_HERE_SMTP.md        ← Visual guide
├─ GMAIL_QUICK_SETUP.md      ← 5-min Gmail
├─ SMTP_SETUP_GUIDE.md       ← All providers
└─ PASSWORD_RESET_GUIDE.md   ← Full details
```

---

## 🎯 3-Step Quick Path

### Path 1: Gmail (5 min)
1. Read: GMAIL_QUICK_SETUP.md
2. Run: python3 backend/test_smtp.py
3. Test: /forgot-password

### Path 2: Other Provider (15 min)
1. Read: SMTP_SETUP_GUIDE.md
2. Configure .env
3. Run: python3 backend/test_smtp.py
4. Test: /forgot-password

### Path 3: Full Understanding (20 min)
1. Read: PASSWORD_RESET_GUIDE.md
2. Read: SMTP_SETUP_GUIDE.md
3. Run: python3 backend/test_smtp.py
4. Test: /forgot-password

---

## 💡 Pro Tips

✅ Use App Password for Gmail (not regular password)  
✅ Keep .env file out of git (add to .gitignore)  
✅ Test SMTP before restarting backend  
✅ Check spam folder if email doesn't arrive  
✅ Restart backend AFTER changing .env  

---

## 📞 Need Help?

```
Don't know where to start?
  → READ: START_HERE_SMTP.md

Gmail user?
  → READ: GMAIL_QUICK_SETUP.md

Other provider?
  → READ: SMTP_SETUP_GUIDE.md

SMTP test fails?
  → RUN: python3 backend/test_smtp.py

Email not arriving?
  → CHECK: PASSWORD_RESET_GUIDE.md → Troubleshooting

Lost in docs?
  → READ: SMTP_DOCUMENTATION_INDEX.md
```

---

## 🎉 Success = When This Works

1. ✅ SMTP test passes: `✅ SMTP Connection Test PASSED!`
2. ✅ Backend restarts without errors
3. ✅ Click "Forgot Password?" works
4. ✅ Email arrives in inbox within 5 seconds
5. ✅ OTP code is visible in email
6. ✅ Password reset form accepts OTP
7. ✅ New password works for login

---

**That's it! You've got everything you need!** 🚀
