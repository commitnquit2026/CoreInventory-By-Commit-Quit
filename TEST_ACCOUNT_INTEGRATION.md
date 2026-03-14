# Account Tab Integration Test Guide

## Test Environment
- **Backend**: Flask (localhost:5000)
- **Frontend**: Vite/React (localhost:5173)
- **Test Date**: 14 March 2026

---

## Test Scenarios

### Scenario 1: Login & Load Profile
**Objective**: Verify user can login and profile is loaded in Settings > Account tab

**Steps**:
1. Navigate to `http://localhost:5173/login`
2. Login with demo credentials:
   - Username: `testuser`
   - Password: `Test@123456`
3. After redirect to `/dashboard`, navigate to `/settings`
4. Click the **Account** tab
5. Verify the **Profile** form displays:
   - First name field populated (if available)
   - Last name field populated (if available)
   - Email field populated

**Expected Result**:
- ✓ Login succeeds, JWT token stored in localStorage under `jwt_token`
- ✓ Settings page loads without errors
- ✓ Account tab is selectable and displays profile form
- ✓ Profile fields show current user data

**Test Status**: _[ ] Pass_ _[ ] Fail_

---

### Scenario 2: Update Profile
**Objective**: Verify users can update their profile information

**Steps**:
1. From Scenario 1, ensure you're in the Account tab with profile form visible
2. Edit the **First name** field (e.g., change to "TestFirstUpdated")
3. Edit the **Last name** field (e.g., change to "UserUpdated")
4. Click **Save profile** button
5. Wait for success message
6. Refresh the page (F5) and navigate back to Settings > Account
7. Verify the changes persisted

**Expected Result**:
- ✓ "Profile updated" success message appears
- ✓ API call to `PUT /auth/profile` succeeds
- ✓ After page refresh, new values are displayed
- ✓ No error messages

**Test Status**: _[ ] Pass_ _[ ] Fail_

---

### Scenario 3: Change Password
**Objective**: Verify users can change their password

**Steps**:
1. From Scenario 1, ensure you're in the Account tab
2. Scroll to the **Change password** form
3. Enter:
   - **Current password**: `Test@123456` (current password)
   - **New password**: `NewPass@123456` (new password)
   - **Confirm new password**: `NewPass@123456` (same new password)
4. Click **Change password** button
5. Wait for success message
6. Log out (click Navbar logout button)
7. Try to login with the new password:
   - Username: `testuser`
   - Password: `NewPass@123456`
8. Verify login succeeds

**Expected Result**:
- ✓ "Password changed successfully" message appears
- ✓ API call to `POST /auth/change-password` succeeds
- ✓ Can log in with the new password
- ✓ Cannot log in with the old password (optional second test)
- ✓ Form is cleared after successful submission

**Test Status**: _[ ] Pass_ _[ ] Fail_

**Note**: After this test, reset the password back to `Test@123456` for other tests, or use the new password going forward.

---

### Scenario 4: 2FA Setup Flow
**Objective**: Verify 2FA setup UI and QR code generation

**Steps**:
1. From Scenario 1, ensure you're in the Account tab
2. Scroll to the **Two-factor authentication (2FA)** section
3. Click **Start 2FA setup** button
4. Verify the UI displays:
   - QR code image OR placeholder
   - Manual secret entry (backup manual key)
   - 6-digit code input field
5. **Option A (skip verification for now)**:
   - Click **Cancel** button
   - Verify UI returns to "Start 2FA setup" state
6. **Option B (complete 2FA)**:
   - Install an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
   - Scan the QR code with the app
   - Copy the 6-digit code displayed by the app
   - Paste/enter the code in the input field
   - Click **Verify & Enable**
   - Verify success message: "2FA enabled successfully!"
   - Verify UI shows: "✓ Two-factor authentication is enabled"

**Expected Result**:
- ✓ Clicking "Start 2FA setup" calls `POST /auth/setup-2fa`
- ✓ Backend returns `qr_code` (data URI) and `secret` (manual key)
- ✓ QR code displays correctly in the UI
- ✓ Manual secret is visible as fallback
- ✓ Code input accepts only digits (0-9), max 6 chars
- ✓ Cancel returns to initial state without errors
- ✓ (If completed) Verify 2FA succeeds with correct code
- ✓ Success banner shows after verification

**Test Status**: _[ ] Pass_ _[ ] Fail_

---

### Scenario 5: Validation & Error Handling
**Objective**: Verify form validations and error messages

**Steps**:

**5a. Profile form with no changes**:
1. Click **Save profile** without making changes
2. Should either save without error or show "No changes" message
3. Expected: No error

**5b. Change password - mismatched passwords**:
1. Enter password form fields:
   - Current password: `Test@123456`
   - New password: `NewPass@123456`
   - Confirm: `Different@123456` (different)
2. Click **Change password**
3. Expected: Error message "Passwords do not match"

**5c. Change password - wrong current password**:
1. Enter password form fields:
   - Current password: `WrongPassword123`
   - New password: `NewPass@123456`
   - Confirm: `NewPass@123456`
2. Click **Change password**
3. Expected: Backend error "Current password is incorrect" or similar

**5d. 2FA - cancel setup**:
1. Click "Start 2FA setup"
2. Click "Cancel"
3. Expected: UI clears, no errors, back to initial state

**Expected Result**:
- ✓ Form validations work as expected
- ✓ Error messages are clear and helpful
- ✓ Invalid submissions are rejected
- ✓ No silent failures or console errors

**Test Status**: _[ ] Pass_ _[ ] Fail_

---

## Bugs Encountered

### Bug Template
```
**Title**: [Brief description]
**Steps to Reproduce**: 
1. 
2. 
3. 
**Expected**: 
**Actual**: 
**Error Message**: (if any)
**Status**: Open / Fixed
```

---

## Test Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Login & Load Profile | | |
| 2. Update Profile | | |
| 3. Change Password | | |
| 4. 2FA Setup Flow | | |
| 5. Validation & Error Handling | | |

**Overall Result**: _[ ] All Pass_ _[ ] Some Failures_ _[ ] Blockers_

---

## Notes for Backend Verification

### Endpoints to Verify
- [ ] `GET /auth/profile` — returns user profile (first_name, last_name, email)
- [ ] `PUT /auth/profile` — updates user profile
- [ ] `POST /auth/change-password` — changes password (validates old password)
- [ ] `POST /auth/setup-2fa` — returns `qr_code` (data URI) and `secret`
- [ ] `POST /auth/verify-2fa` — verifies 2FA code and enables 2FA

### Expected Response Formats

**GET /auth/profile**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "role": "user"
  }
}
```

**PUT /auth/profile**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

**POST /auth/change-password**
```json
{
  "message": "Password changed successfully"
}
```

**POST /auth/setup-2fa**
```json
{
  "secret": "JBSWY3DPEBLW64TMMQ...",
  "qr_code": "data:image/png;base64,iVBORw0KGgo..."
}
```

**POST /auth/verify-2fa**
```json
{
  "message": "2FA enabled successfully",
  "two_factor_enabled": true
}
```

---

## Continuation

After completing these tests, next priorities:
1. **Operations UI** — Add Pick/Pack/Transfer workflows
2. **Advanced Filters** — Dashboard query builder
3. **Batch Import** — CSV upload for products/inventory
4. **Reports** — Generate PDF/CSV reports
5. **Global Search** — Search across all entities

