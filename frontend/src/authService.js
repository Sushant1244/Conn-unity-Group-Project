const API_URL = 'http://localhost:4000/api';

export async function register({ username, email, password }) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await response.json();
  return data;
}

export async function verifyOTP({ email, otp }) {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await response.json();
  if (data.success && data.token) {
    localStorage.setItem('connunity_token', data.token);
    if (data.user) {
      localStorage.setItem('connunity_current_user', JSON.stringify(data.user));
    }
  }
  return data;
}

export async function resendOTP(email) {
  const response = await fetch(`${API_URL}/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
}

export async function login({ email, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.success && data.token) {
    localStorage.setItem('connunity_token', data.token);
    localStorage.setItem('connunity_current_user', JSON.stringify(data.user));
  }
  return data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
}

export async function resetPassword({ email, otp, newPassword }) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  const data = await response.json();
  return data;
}

export function logout() {
  localStorage.removeItem('connunity_current_user');
  localStorage.removeItem('connunity_token');
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem('connunity_current_user')) || null;
  } catch (e) {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem('connunity_token');
}
