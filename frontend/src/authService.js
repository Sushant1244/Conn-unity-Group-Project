// Simple in-memory / localStorage demo auth service
const USERS_KEY = 'connunity_demo_users';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function register({ username, email, password }) {
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  const user = { id: Date.now(), username, email, password };
  users.push(user);
  saveUsers(users);
  // also set current session
  localStorage.setItem('connunity_current_user', JSON.stringify({ id: user.id, username: user.username, email: user.email }));
  return { success: true, user };
}

export async function login({ email, password }) {
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Invalid credentials' };
  localStorage.setItem('connunity_current_user', JSON.stringify({ id: user.id, username: user.username, email: user.email }));
  return { success: true, user };
}

export function logout() {
  localStorage.removeItem('connunity_current_user');
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem('connunity_current_user')) || null;
  } catch (e) {
    return null;
  }
}
