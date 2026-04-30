const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest(
  method: string,
  endpoint: string,
  options: any = {}
) {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function getToken() {
  // For client-side usage, we don't need to expose the token
  // The API proxy routes handle token extraction from cookies
  return null;
}

export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}
