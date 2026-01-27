const jwt = require('jsonwebtoken');
const db = require('../services/db.service');
const { generateOTP, sendOTP, sendPasswordResetOTP } = require('../services/email.service');

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  if (!user) return null;
  // Remove sensitive fields if present (e.g., password_hash)
  // eslint-disable-next-line no-unused-vars
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// Register new user with OTP
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Check if username is taken
    const existingUsername = await db.getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ success: false, message: 'Username already taken' });
    }

    // Create user (unverified)
    const user = await db.createUser(username, email, password);

    // Generate and send OTP (gracefully handle email errors)
    const otp = generateOTP();
    await db.createOTP(email, otp, parseInt(process.env.OTP_EXPIRY_MINUTES || 10));
    let emailSent = true;
    // Send email asynchronously to avoid blocking response time
    sendOTP(email, otp, username).catch((sendErr) => {
      emailSent = false;
      console.warn('sendOTP failed during register:', sendErr?.message || sendErr);
    });

    return res.status(201).json({
      success: true,
      message: emailSent
        ? 'Registration successful! Please check your email for verification code.'
        : 'Registration successful! We could not send the email right now. Please try "Resend Code" or check back later.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    // Verify OTP
    const isValid = await db.verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Update user as verified
    const user = await db.getUserByEmail(email);
    if (user) {
      await db.updateUser(user.id, { email_verified: true });
    }

    const verifiedUser = await db.getUserByEmail(email);
    if (!verifiedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = generateToken(verifiedUser);

    return res.json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: verifiedUser.id,
        username: verifiedUser.username,
        email: verifiedUser.email,
        avatar_url: verifiedUser.avatar_url,
        email_verified: true
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate and send new OTP
    const otp = generateOTP();
    await db.createOTP(email, otp, parseInt(process.env.OTP_EXPIRY_MINUTES || 10));
    let emailSent = true;
    // Send email asynchronously to avoid blocking response time
    sendOTP(email, otp, user.username).catch((sendErr) => {
      emailSent = false;
      console.warn('sendOTP failed during resend:', sendErr?.message || sendErr);
    });

    return res.json({
      success: true,
      message: emailSent
        ? 'OTP resent successfully! Please check your email.'
        : 'OTP generated, but we could not send the email right now. Try again later or check with support.'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ success: false, message: 'Server error while sending OTP' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Verify credentials
    const user = await db.verifyUserPassword(email, password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.email_verified) {
      // Send a fresh OTP on login attempt to match frontend UX
      try {
        const otp = generateOTP();
        await db.createOTP(email, otp, parseInt(process.env.OTP_EXPIRY_MINUTES || 10));
        // Don't await email to keep login fast
        sendOTP(email, otp, user.username).catch((err) => {
          console.warn('Failed to send OTP during login:', err?.message || err);
        });
      } catch (err) {
        console.warn('Failed to queue OTP during login:', err?.message || err);
      }

      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Forgot password - send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'If that email exists, a reset code has been sent'
      });
    }

    // Generate and send OTP
    const otp = generateOTP();
    await db.createOTP(email, otp, parseInt(process.env.OTP_EXPIRY_MINUTES || 10));
    // Send email asynchronously to avoid blocking response time
    sendPasswordResetOTP(email, otp, user.username).catch((err) => {
      console.warn('Failed to send password reset OTP:', err?.message || err);
    });

    return res.json({
      success: true,
      message: 'Password reset code sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset password with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Verify OTP
    const isValid = await db.verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Update password
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash new password and update
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user.id]);

    return res.json({
      success: true,
      message: 'Password reset successfully!'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
};

// Check token validity - used on dashboard refresh
exports.checkAuth = async (req, res) => {
  try {
    // Middleware already verified token and attached user
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Check auth error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
