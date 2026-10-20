/**
 * api.js - Centralized API Service for SmartBook Client
 * Communicates with the Flask REST backend endpoints.
 */

const API_BASE_URL = 'http://localhost:5000/api';

/** Helper to handle JSON fetch requests with error handling */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ----------------------------------------------------
// Public Catalog & Recommendation APIs
// ----------------------------------------------------

export async function getBooks(filters = {}) {
  const query = new URLSearchParams();
  if (filters.genre && filters.genre !== 'All') query.append('genre', filters.genre);
  if (filters.language && filters.language !== 'All') query.append('language', filters.language);
  if (filters.difficulty && filters.difficulty !== 'All') query.append('difficulty', filters.difficulty);
  if (filters.search) query.append('search', filters.search);

  const qs = query.toString();
  return request(`/books${qs ? `?${qs}` : ''}`);
}

export async function getBookById(id) {
  return request(`/books/${id}`);
}

export async function getRecommendations(preferences) {
  return request('/recommend', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });
}

export async function getRules() {
  return request('/rules');
}

export async function getStats() {
  return request('/stats');
}

// ----------------------------------------------------
// Admin APIs
// ----------------------------------------------------

export async function adminLogin(username, password) {
  const res = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (res.token) {
    localStorage.setItem('smartbook_admin_token', res.token);
    localStorage.setItem('smartbook_admin_user', res.username || username);
  }
  return res;
}

export function getAdminToken() {
  return localStorage.getItem('smartbook_admin_token');
}

export function clearAdminToken() {
  localStorage.removeItem('smartbook_admin_token');
  localStorage.removeItem('smartbook_admin_user');
}

export async function adminAddBook(bookData) {
  const token = getAdminToken();
  return request('/admin/books', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
}

export async function adminUpdateBook(id, bookData) {
  const token = getAdminToken();
  return request(`/admin/books/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
}

export async function adminDeleteBook(id) {
  const token = getAdminToken();
  return request(`/admin/books/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
