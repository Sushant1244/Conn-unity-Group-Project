# JWT Authentication Implementation Guide

## Overview
JWT (JSON Web Token) authentication has been implemented in Connunity to secure user sessions and persist authentication across page refreshes.

## How It Works (Simple Explanation)

### 1. **Login Flow**
- User enters email and password in login form
- Backend verifies credentials and generates a **JWT token** (a unique encrypted code)
- Token is stored in browser's `localStorage` as `connunity_token`
- User is redirected to dashboard

### 2. **Token Storage**
- Token is stored locally: `localStorage.setItem('connunity_token', token)`
- User data is also stored: `localStorage.setItem('connunity_current_user', JSON.stringify(data.user))`

### 3. **Dashboard Refresh Protection**
- When dashboard loads, it checks if token exists in `localStorage`
- Token is sent to backend: `Authorization: Bearer <token>`
- Backend validates token and returns user data
- If token is invalid/expired, user is redirected to login page

### 4. **Logout**
- Logout button clears the token and user data from localStorage
- User is redirected to login page

## Files Modified

### Backend
1. **`/backend/controllers/authController.js`**
   - Added `checkAuth()` function to verify token validity
   - Already had `generateToken()` and other auth functions

2. **`/backend/routes/auth.js`**
   - Added `/check-auth` route (protected by authMiddleware)

3. **`/backend/middleware/auth.js`**
   - Already has `authMiddleware` that verifies JWT tokens
   - Token is extracted from `Authorization: Bearer <token>` header

### Frontend
1. **`/frontend/src/main.jsx`**
   - Added check: if no token, redirect to login immediately

2. **`/frontend/src/Dashboard.jsx`**
   - Added `isAuthChecking` state and loading screen
   - Added `useEffect` hook to verify token on component mount
   - Updated logout button to clear token
   - Added token to API requests for loading posts

3. **`/frontend/src/authService.js`**
   - Added `authenticatedFetch()` helper function for making authenticated API calls
   - Updated login/verify functions to store token

## Key Code Snippets

### Backend - Token Verification
```javascript
// middleware/auth.js
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}
```

### Frontend - Token Check on Dashboard Load
```javascript
// Dashboard.jsx
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('connunity_token');
    
    if (!token) {
      setAuthError('No authentication token found');
      setTimeout(() => window.location.href = '/index.html', 1500);
      return;
    }

    const response = await fetch(`${API_URL}/check-auth`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      localStorage.removeItem('connunity_token');
      window.location.href = '/index.html';
    }
  };
  
  checkAuth();
}, []);
```

### Frontend - Logout
```javascript
// Clear token and redirect
onClick={() => {
  localStorage.removeItem('connunity_token');
  localStorage.removeItem('connunity_current_user');
  window.location.href = '/index.html';
}}
```

## Token Details

- **Duration**: 7 days (`expiresIn: '7d'`)
- **Storage**: Browser's `localStorage`
- **Header**: `Authorization: Bearer <token>`
- **Secret**: Configured in `.env` as `JWT_SECRET`

## Testing the Implementation

### Test Scenario 1: Login and Refresh
1. Login with valid credentials
2. Dashboard loads and shows user data
3. Press F5 to refresh page
4. **Expected**: Dashboard shows without re-entering credentials
5. **Why**: Token is verified from localStorage and validated with backend

### Test Scenario 2: Invalid Token
1. Manually delete `connunity_token` from localStorage (DevTools)
2. Refresh dashboard page
3. **Expected**: Redirected to login page with error message

### Test Scenario 3: Logout
1. Click "Logout" button
2. **Expected**: Token is cleared and user redirected to login page

## Environment Variables

Add to `.env` in backend folder:
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
```

## Security Notes

- Tokens are stored in `localStorage` (simple but less secure than httpOnly cookies)
- Token includes user ID, email, and username (no sensitive data)
- Token is validated on every protected API call
- Expired tokens automatically redirect to login

## Simple Workflow Diagram

```
User Login
    ↓
Backend generates JWT token
    ↓
Token stored in localStorage
    ↓
User on Dashboard (refresh)
    ↓
Dashboard checks localStorage for token
    ↓
Sends token to /check-auth endpoint
    ↓
Backend validates token
    ↓
If valid: Show dashboard
If invalid: Redirect to login
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "No token provided" | Token not stored in localStorage | Login again |
| "Invalid token" | Token is corrupted or expired | Login again |
| Redirects to login on refresh | Backend validation failed | Check `.env` JWT_SECRET |
| CORS error with token | Missing Authorization header | Check authService authenticatedFetch() |

---

**This is a simple, college-level JWT implementation suitable for learning authentication concepts.**
