/**
 * Centralized API client matching CLI's safe_request pattern
 * Handles authentication, token refresh, and standardized error handling
 * 
 * Pattern:
 * - Attaches authentication headers (Authorization, X-API-Version)
 * - Auto-refreshes tokens on 401
 * - Returns typed responses matching backend format
 * - Throws on fatal errors
 */

import { ApiResponse, PaginatedResponse, ApiRequestOptions, TokenResponse, User, Profile } from './types';

// Re-export types for convenience
export type { User, Profile, ApiResponse, PaginatedResponse, TokenResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = '1';

// ===========================
// Token Management (client-side helpers)
// ===========================

/**
 * Get access token from cookie
 * Mirrors CLI's approach but uses HTTP-only cookies
 * Note: Since backend now sets HTTP-only cookies, we don't need to fetch tokens manually
 */
async function getAccessToken(): Promise<string | null> {
  // Cookies are HTTP-only, so we can't access them directly
  // The backend will validate the cookie automatically
  return 'cookie_present'; // Placeholder - actual validation happens server-side
}

/**
 * Refresh access token using refresh token
 * Single responsibility: hit refresh endpoint
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies with request
      body: JSON.stringify({}), // Empty body as per backend expectation
    });

    if (!response.ok) {
      // Refresh failed - need to login again
      return false;
    }

    // Success - cookies updated by server
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// ===========================
// Auth Header Builder
// ===========================

/**
 * Build authentication headers with Bearer token
 * Matches CLI's auth_headers() function
 * Note: For cross-origin requests, we need to include the token in the Authorization header
 */
function buildAuthHeaders(options?: ApiRequestOptions, token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Version': API_VERSION,
    ...options?.headers,
  };

  // Add Authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ===========================
// Core Request Function
// ===========================

/**
 * Safe request with auto-refresh
 * Matches CLI's safe_request() pattern exactly
 * 
 * Features:
 * - Automatic token refresh on 401
 * - Consistent error handling
 * - Type-safe responses
 * - Follows backend response format
 */
export async function apiRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> {
  const url = new URL(endpoint, API_URL);

  // Add query parameters if provided
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const skipRefresh = options?.skipRefresh || false;

  try {
    // Get access token from our frontend auth endpoint (server-side cookie access)
    let token: string | null = null;
    // Since cookies are HTTP-only, we rely on credentials: 'include' to send them
    // The backend will validate the cookie automatically

    const headers = buildAuthHeaders(options, token);

    // First attempt - send cookies automatically
    const response = await fetch(url.toString(), {
      method,
      headers,
      credentials: 'include', // Send HTTP-only cookies
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    // Handle 401 - attempt refresh and retry
    if (response.status === 401 && !skipRefresh) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Retry with refreshed cookies
        const retryResponse = await fetch(url.toString(), {
          method,
          headers,
          credentials: 'include', // Send refreshed cookies
          body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status}`);
        }

        return retryResponse.json() as Promise<T>;
      }

      // Refresh failed - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || errorData.detail || 'API Error',
        data: errorData,
      };
    }

    return response.json() as Promise<T>;
  } catch (error: any) {
    // Log error for debugging
    console.error(`API ${method} ${endpoint}:`, error);

    // Re-throw with context
    if (error instanceof TypeError) {
      throw new Error(`Network error: ${error.message}`);
    }

    throw error;
  }
}

// ===========================
// Convenience Methods (matching CLI)
// ===========================

/**
 * GET request with auto-refresh
 */
export async function get<T = any>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>('GET', endpoint, options);
}

/**
 * POST request with auto-refresh
 */
export async function post<T = any>(
  endpoint: string,
  body?: any,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>('POST', endpoint, {
    ...options,
    body,
  });
}

/**
 * PUT request with auto-refresh
 */
export async function put<T = any>(
  endpoint: string,
  body?: any,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>('PUT', endpoint, {
    ...options,
    body,
  });
}

/**
 * DELETE request with auto-refresh
 */
export async function deleteRequest<T = any>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>('DELETE', endpoint, options);
}

// ===========================
// Profile Commands (matching CLI)
// ===========================

export const profiles = {
  /**
   * List profiles with optional filters
   * Matches: insighta profiles list
   */
  async list(
    options?: {
      gender?: string;
      country?: string;
      age_group?: string;
      min_age?: number;
      max_age?: number;
      sort_by?: string;
      order?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<any>> {
    return get<PaginatedResponse<any>>('/api/profiles', { params: options });
  },

  /**
   * Get single profile by ID
   * Matches: insighta profiles get <id>
   */
  async get(profileId: string): Promise<ApiResponse<any>> {
    return get<ApiResponse<any>>(`/api/profiles/${profileId}`);
  },

  /**
   * Search profiles with natural language
   * Matches: insighta profiles search "query"
   */
  async search(
    query: string,
    options?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<any>> {
    return get<PaginatedResponse<any>>('/api/profiles/search', {
      params: { q: query, ...options },
    });
  },

  /**
   * Create profile (admin only)
   * Matches: insighta profiles create --name "Name"
   */
  async create(name: string): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>('/api/profiles', { name });
  },

  /**
   * Delete profile (admin only)
   * Matches: insighta profiles delete <id>
   */
  async delete(profileId: string): Promise<ApiResponse<any>> {
    return deleteRequest<ApiResponse<any>>(`/api/profiles/${profileId}`);
  },

  /**
   * Export profiles (CSV)
   * Matches: insighta profiles export
   */
  async export(format: 'csv' = 'csv', filters?: any): Promise<any> {
    return get('/api/profiles/export', {
      params: { format, ...filters },
    });
  },
};

// ===========================
// Auth Commands (matching CLI)
// ===========================

export const auth = {
  /**
   * Get current authenticated user
   * Matches: insighta whoami
   */
  async me(): Promise<ApiResponse<any>> {
    return get<ApiResponse<any>>('/auth/me');
  },

  /**
   * Logout and clear session
   * Matches: insighta logout
   */
  async logout(refreshToken?: string): Promise<ApiResponse<any>> {
    return post<ApiResponse<any>>('/auth/logout', {
      refresh_token: refreshToken,
    });
  },
};

export default {
  get,
  post,
  put,
  deleteRequest,
  profiles,
  auth,
  apiRequest,
};
