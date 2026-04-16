import { getSession } from '@/services/session';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

async function handleResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export async function getPosts({ page = 1, limit = 10 } = {}) {
  const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`);
  return handleResponse(response);
}

export async function getPostsByCity(cityName) {
  const response = await fetch(`${API_BASE_URL}/posts/city/${encodeURIComponent(cityName)}`);
  return handleResponse(response);
}

export async function getPostsByUser(uid) {
  const response = await fetch(`${API_BASE_URL}/posts/user/${encodeURIComponent(uid)}`);
  return handleResponse(response);
}

export async function createPost({ imageUri, description, latitude, longitude, city, userId, username }) {
  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: `upload-${Date.now()}.jpg`,
    type: 'image/jpeg',
  });

  formData.append('description', description || '');
  formData.append('latitude', String(latitude ?? 0));
  formData.append('longitude', String(longitude ?? 0));
  formData.append('city', city || 'Unknown Location');
  formData.append('userId', userId || 'anonymous_user');
  formData.append('username', username || 'Explorer');

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

function buildAuthHeaders(idToken) {
  const token = idToken || getSession().idToken;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function votePost(postId, voteType, idToken) {
  const headers = buildAuthHeaders(idToken);

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/vote`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ voteType }),
  });

  return handleResponse(response);
}

export async function registerUser({ email, password, username }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, username }),
  });

  return handleResponse(response);
}

export async function verifyAuthToken(idToken) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
    method: 'POST',
    headers: buildAuthHeaders(idToken),
    body: JSON.stringify({ idToken }),
  });

  return handleResponse(response);
}

export async function syncUserProfile({ uid, email, username, avatarUrl }) {
  const response = await fetch(`${API_BASE_URL}/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, email, username, avatarUrl }),
  });

  return handleResponse(response);
}

export async function oauthSignIn(provider, idToken) {
  const response = await fetch(`${API_BASE_URL}/oauth/${provider}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  return handleResponse(response);
}

export async function searchCitySuggestions(input, options = {}) {
  const params = new URLSearchParams({ input });

  if (options.country) {
    params.set('country', options.country);
  }

  if (options.types) {
    params.set('types', options.types);
  }

  const response = await fetch(`${API_BASE_URL}/places/autocomplete?${params.toString()}`);
  return handleResponse(response);
}

export async function getPlaceDetails(placeId) {
  const params = new URLSearchParams({ placeId });
  const response = await fetch(`${API_BASE_URL}/places/details?${params.toString()}`);
  return handleResponse(response);
}
