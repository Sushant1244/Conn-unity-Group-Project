# JWT Authentication Setup - Quick Start

## What's Changed

Your Connunity website now uses **JWT (JSON Web Token)** for authentication. Users can log in with email/password and stay logged in even after refreshing the page.

## How to Use (From User Perspective)

### Login
1. Go to login page (`/index.html`)
2. Enter your registered email and password
3. Click "Login"
4. You'll be redirected to dashboard

### Stay Logged In
- Even if you **refresh the page** (F5 or Ctrl+R), you'll stay logged in
- The token is saved in your browser's memory

### Logout
- Click the **"Logout"** button on dashboard
- You'll be taken back to login page
- Token will be cleared

## Backend Setup

Make sure your `.env` file has:
```
JWT_SECRET=your-secret-key-change-this
```

The backend already has `jsonwebtoken` package installed in `package.json`.

## Testing

### Test 1: Login → Refresh → Should Still Be Logged In
1. Login with your account
2. You'll see the dashboard
3. Press **F5** to refresh page
4. **Expected**: Dashboard loads normally (you're still logged in)

### Test 2: Delete Token → Refresh → Should Go to Login
1. Open **DevTools** (F12 or Right-click → Inspect)
2. Go to **Application → Storage → Local Storage**
3. Find `connunity_token` and delete it
4. Refresh the page
5. **Expected**: Redirected to login page automatically

### Test 3: Logout Button
1. Click the **"Logout"** button
2. **Expected**: Redirected to login page
3. Refresh the page - still on login page (not dashboard)

## How JWT Works (Simple Version)

```
1. User logs in with email + password
            ↓
2. Backend checks credentials and creates a JWT token
   (Token = Encrypted user info + signature)
            ↓
3. Token is stored in browser's localStorage
            ↓
4. Every time you make a request, token is sent to backend
            ↓
5. Backend verifies token signature
   - If valid: Process request
   - If invalid: Redirect to login
            ↓
6. When page refreshes:
   - Token is still in localStorage
   - Dashboard checks if token exists
   - Sends to backend for verification
   - If valid: Show dashboard
   - If invalid: Redirect to login
```

## API Endpoints Added/Modified

### New Endpoint
- **GET** `/api/check-auth`
  - Required: `Authorization: Bearer <token>` header
  - Returns: User data if token is valid
  - Returns: 401 if token is invalid

### Existing Endpoints (Updated)
- **POST** `/api/login`
  - Returns: `token` in response (new field)
  - Token is stored automatically in frontend

- **POST** `/api/verify-otp`
  - Returns: `token` in response (new field)

## Frontend Functions

### In `authService.js`
```javascript
getToken()                    // Get token from storage
authenticatedFetch(endpoint)  // Make API call with token in header
logout()                      // Clear token and user data
currentUser()                 // Get stored user data
```

### In `Dashboard.jsx`
- Automatically checks token on page load
- Shows loading screen while checking
- Redirects to login if token is invalid
- Sends token with posts API request

### In `main.jsx`
- Quick check before loading dashboard
- Redirects to login if no token

## Storage Keys

Your browser stores:
- `connunity_token` - The JWT token
- `connunity_current_user` - User info (name, email, etc.)

These are in **localStorage** (visible in DevTools → Application tab)

## Common Scenarios

### Scenario 1: User Opens Browser, Goes to Dashboard
✅ Will be redirected to login (no token)

### Scenario 2: User Logs In Successfully
✅ Token saved → Redirected to dashboard

### Scenario 3: User on Dashboard, Presses F5
✅ Dashboard checks token → Still logged in

### Scenario 4: Token Expires (after 7 days)
✅ Next API call fails → Redirected to login

### Scenario 5: User Clicks Logout
✅ Token deleted → Redirected to login

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No token provided" error | Login again |
| Keeps redirecting to login | Check `.env` JWT_SECRET is set |
| Token not saving | Check browser localStorage is enabled |
| Logout not working | Clear browser cache and try again |

## Files Modified

1. ✅ `backend/controllers/authController.js` - Added checkAuth function
2. ✅ `backend/routes/auth.js` - Added /check-auth route
3. ✅ `frontend/src/Dashboard.jsx` - Added token verification
4. ✅ `frontend/src/authService.js` - Added authenticatedFetch helper
5. ✅ `frontend/src/main.jsx` - Added initial token check

---

**Your JWT authentication is ready to use!** 🚀
