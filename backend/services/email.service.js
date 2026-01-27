const nodemailer = require('nodemailer');
const path = require('path');
// Ensure .env is loaded from backend directory regardless of CWD
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
let sgMail = null;
let etherealTransporter = null;
let etherealReady = false;

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add conservative timeouts to prevent long hangs
  connectionTimeout: parseInt(process.env.SMTP_CONN_TIMEOUT || '7000'),
  socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || '10000'),
  tls: {
    // Allow overriding TLS minimums in dev environments if needed
    rejectUnauthorized: false,
  },
});

// Email mode & readiness flags
const EMAIL_MODE = (process.env.EMAIL_MODE || 'smtp').toLowerCase(); // 'smtp' | 'mock' | 'sendgrid' | 'ethereal'
let emailTransportReady = false;

function isMockMode() {
  return EMAIL_MODE === 'mock';
}

function isSmtpMode() {
  return EMAIL_MODE === 'smtp';
}

function isSendgridMode() {
  return EMAIL_MODE === 'sendgrid';
}

function isEtherealMode() {
  return EMAIL_MODE === 'ethereal';
}

function parseFromAddress(raw) {
  const val = String(raw || '').trim();
  if (!val) return { email: '', name: '' };
  const lt = val.indexOf('<');
  const gt = val.indexOf('>');
  if (lt !== -1 && gt !== -1 && gt > lt) {
    const name = val.slice(0, lt).trim().replace(/^"|"$/g, '');
    const email = val.slice(lt + 1, gt).trim();
    return { email, name };
  }
  return { email: val, name: '' };
}

// Initialize provider readiness
if (isSmtpMode()) {
  transporter.verify(function (error, success) {
    if (error) {
      emailTransportReady = false;
      console.error('❌ Email service error:', error);
    } else {
      emailTransportReady = true;
      console.log('✅ Email service is ready to send messages');
    }
  });
} else if (isSendgridMode()) {
  try {
    sgMail = require('@sendgrid/mail');
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️ SENDGRID_API_KEY missing. Set it and restart to send real emails via SendGrid.');
    } else {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid email service configured');
    }
  } catch (err) {
    console.error('❌ Failed to initialize SendGrid:', err?.message || err);
  }
} else if (isEtherealMode()) {
    // Prefer static Ethereal credentials from env; else create a test account
    const ethUser = process.env.ETHEREAL_USER;
    const ethPass = process.env.ETHEREAL_PASS;
    const ethHost = process.env.ETHEREAL_HOST || 'smtp.ethereal.email';
    const ethPort = parseInt(process.env.ETHEREAL_PORT || '587');

    if (ethUser && ethPass) {
      etherealTransporter = nodemailer.createTransport({
        host: ethHost,
        port: ethPort,
        secure: ethPort === 465,
        auth: { user: ethUser, pass: ethPass },
      });
      etherealReady = true;
      console.log('✅ Ethereal email service configured (static credentials)');
      console.log('   Ethereal user:', ethUser);
    } else {
      nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error('❌ Failed to create Ethereal test account:', err?.message || err);
          return;
        }
        etherealTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: account.user, pass: account.pass },
        });
        etherealReady = true;
        console.log('✅ Ethereal email service configured (test account)');
        console.log('   Ethereal user:', account.user);
        console.log('   Ethereal pass:', account.pass);
        console.log('   Note: Use the preview URL logged per email to view messages.');
      });
    }
} else {
  console.log('✉️ Email mock mode enabled (EMAIL_MODE=mock). No real emails will be sent.');
}

/**
 * Generate a 6-digit OTP code
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP email
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @param {string} username - User's username (optional)
 */
async function sendOTP(email, otp, username = 'User') {
  const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Verify Your Email - Connunity',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #5b2fff;
            margin-bottom: 10px;
          }
          .otp-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #5b2fff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Connunity</div>
            <p>Welcome to the Community!</p>
          </div>
          
          <h2>Email Verification</h2>
          <p>Hi ${username},</p>
          <p>Thank you for registering with Connunity! To complete your registration, please verify your email address using the OTP code below:</p>
          
          <div class="otp-box">
            <p style="margin: 0; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 12px;">Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</p>
          </div>
          
          <p><strong>Important:</strong> This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes. If you didn't request this code, please ignore this email.</p>
          
          <p>Once verified, you'll be able to:</p>
          <ul>
            <li>✨ Create and join communities</li>
            <li>💬 Post and engage with others</li>
            <li>🎯 Discover trending content</li>
            <li>🎉 Connect with like-minded people</li>
          </ul>
          
          <div class="footer">
            <p>© 2025 Connunity. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
Hi ${username},

Welcome to Connunity!

Your email verification code is: ${otp}

This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.

If you didn't request this code, please ignore this email.

© 2025 Connunity
    `,
    };
    // Mock mode → log OTP and pretend success
    if (isMockMode()) {
      console.warn('✉️ [MOCK EMAIL] OTP for', email, 'is', otp);
      return { success: true, mocked: true };
    }

    // Ethereal mode
    if (isEtherealMode()) {
      if (!etherealReady || !etherealTransporter) {
        if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
          console.warn('✉️ Ethereal not ready. Falling back to mock. OTP for', email, 'is', otp);
          return { success: true, mocked: true };
        }
        throw new Error('Ethereal transporter not ready');
      }
      try {
        const info = await etherealTransporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('✅ Ethereal email sent. Preview URL:', previewUrl);
        return { success: true, provider: 'ethereal', previewUrl };
      } catch (error) {
        if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
          console.warn('✉️ Falling back to mock email due to Ethereal error. OTP for', email, 'is', otp);
          return { success: true, mocked: true };
        }
        console.error('❌ Ethereal send error:', error?.message || error);
        throw error;
      }
    }

    // SendGrid mode
    if (isSendgridMode()) {
        const fromRaw = process.env.SENDGRID_FROM || process.env.SMTP_FROM;
        const { email: fromEmail, name: fromName } = parseFromAddress(fromRaw);
        const msg = {
          to: email,
          from: fromName ? { email: fromEmail, name: fromName } : { email: fromEmail },
        subject: mailOptions.subject,
        html: mailOptions.html,
        text: mailOptions.text,
      };
      try {
        const [response] = await sgMail.send(msg);
        console.log('✅ SendGrid email sent:', response?.headers?.['x-message-id'] || response?.statusCode);
        return { success: true, provider: 'sendgrid' };
      } catch (error) {
        if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
          console.warn('✉️ Falling back to mock email due to SendGrid error. OTP for', email, 'is', otp);
          return { success: true, mocked: true };
        }
          console.error('❌ SendGrid send error:', error?.response?.body || error?.message || error);
        throw error;
      }
    }

    // SMTP mode
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
        console.warn('✉️ Falling back to mock email due to SMTP error. OTP for', email, 'is', otp);
        return { success: true, mocked: true };
      }
      console.error('❌ SMTP send error:', error);
      throw error;
    }
}

/**
 * Send password reset email
 */
async function sendPasswordResetOTP(email, otp, username = 'User') {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset Your Password - Connunity',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #5b2fff; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Connunity</div>
          </div>
          <h2>Password Reset Request</h2>
          <p>Hi ${username},</p>
          <p>We received a request to reset your password. Use the code below to proceed:</p>
          <div class="otp-box">
            <p style="margin: 0; font-size: 14px;">Your Reset Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 12px;">Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</p>
          </div>
          <p><strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.</p>
          <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">© 2025 Connunity</p>
        </div>
      </body>
      </html>
    `,
    };

    // Mock mode → log OTP and pretend success
    if (isMockMode()) {
      console.warn('✉️ [MOCK EMAIL] Password reset OTP for', email, 'is', otp);
      return { success: true, mocked: true };
    }

    if (isEtherealMode()) {
      if (!etherealReady || !etherealTransporter) {
        if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
          console.warn('✉️ Ethereal not ready. Falling back to mock. Password reset OTP for', email, 'is', otp);
          return { success: true, mocked: true };
        }
        throw new Error('Ethereal transporter not ready');
      }
      try {
        const info = await etherealTransporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('✅ Ethereal password reset email sent. Preview URL:', previewUrl);
        return { success: true, provider: 'ethereal', previewUrl };
      } catch (error) {
        if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
          console.warn('✉️ Falling back to mock password reset email due to Ethereal error. OTP for', email, 'is', otp);
          return { success: true, mocked: true };
        }
        console.error('❌ Ethereal password reset send error:', error?.message || error);
        throw error;
      }
    }

    if (isSendgridMode()) {
        const fromRaw = process.env.SENDGRID_FROM || process.env.SMTP_FROM;
        const { email: fromEmail, name: fromName } = parseFromAddress(fromRaw);
        const msg = {
          to: email,
          from: fromName ? { email: fromEmail, name: fromName } : { email: fromEmail },
        subject: mailOptions.subject,
        html: mailOptions.html,
      };
      try {
        const [response] = await sgMail.send(msg);
        console.log('✅ SendGrid password reset email sent:', response?.headers?.['x-message-id'] || response?.statusCode);
        return { success: true, provider: 'sendgrid' };
      } catch (error) {
        if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
          console.warn('✉️ Falling back to mock password reset email due to SendGrid error. OTP for', email, 'is', otp);
          return { success: true, mocked: true };
        }
          console.error('❌ SendGrid password reset send error:', error?.response?.body || error?.message || error);
        throw error;
      }
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      if ((process.env.EMAIL_FALLBACK || '').toLowerCase() === 'mock') {
        console.warn('✉️ Falling back to mock password reset email due to SMTP error. OTP for', email, 'is', otp);
        return { success: true, mocked: true };
      }
      console.error('❌ SMTP password reset send error:', error);
      throw error;
    }
}

module.exports = {
    generateOTP,
    sendOTP,
    sendPasswordResetOTP,
  transporter,
};
