/**
 * Type definitions matching backend (Intelligence_query_engine) response format
 * Ensures web-portal follows same contract as CLI and backend
 */

// ===========================
// API Response Wrapper
// ===========================
export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T = any> {
  status: ApiStatus;
  data?: T;
  message?: string;
  detail?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links?: {
    self: string;
    next?: string;
    prev?: string;
  };
}

// ===========================
// User Type (matches backend)
// ===========================
export interface User {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  role: 'admin' | 'analyst';
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

// ===========================
// Profile Type (matches backend)
// ===========================
export interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  gender_probability: number;
  age: number;
  age_group: 'child' | 'teenager' | 'adult' | 'senior';
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at?: string;
  updated_at?: string;
}

// ===========================
// Token Response
// ===========================
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// ===========================
// Error Response
// ===========================
export interface ErrorResponse extends ApiResponse<null> {
  status: 'error';
  message: string;
}

// ===========================
// Request Options
// ===========================
export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

// ===========================
// Session Info
// ===========================
export interface SessionInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
