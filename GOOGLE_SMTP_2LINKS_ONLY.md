# ⚡ Google SMTP Setup - 2 Links Only

## 🎯 You Need Exactly 2 Links

### Link #1: Enable 2-Factor Authentication
```
https://myaccount.google.com/security
```
- Open this URL
- Find "2-Step Verification"
- Enable it
- Verify with your phone

### Link #2: Get App Password
```
https://myaccount.google.com/apppasswords
```
- Open this URL (AFTER enabling 2FA)
- Select App: **Mail**
- Select Device: **Windows Computer**
- Click **Generate**
- Copy the 16-character password

---

## 🔧 Update CoreInventory

Edit `backend/.env`:
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=paste-16-char-password-here
```

**Remove spaces from the password!**

Example:
```
Password given by Google: abcd efgh ijkl mnop
Remove spaces:            abcdefghijklmnop
```

---

## ✅ Test It

```bash
cd backend
python3 test_smtp.py
```

If you see `✅ SMTP Connection Test PASSED!` - you're done! 🎉

---

## 📌 That's It!

Two links → Two steps → Done in 5 minutes! ⚡
