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
  try {
    const response = await fetch('/api/auth/token');
    if (!response.ok) return null;
    const data = await response.json();
    return data.token;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/user');
    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}
