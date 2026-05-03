import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/auth/token
 * Returns current access token if valid
 */
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ token });
}

/**
 * POST /api/auth/token
 * Refresh access token using refresh token (matches backend /auth/refresh)
 * This is called by the API client on 401 to refresh session
 */
export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'No refresh token available' },
      { status: 401 }
    );
  }

  try {
    // Call backend /auth/refresh endpoint
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed, clear cookies
      const newCookieStore = cookies();
      newCookieStore.delete('access_token');
      newCookieStore.delete('refresh_token');
      return NextResponse.json(
        { error: 'Token refresh failed' },
        { status: 401 }
      );
    }

    const data = await response.json();

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { error: 'Invalid token response' },
        { status: 401 }
      );
    }

    // Update cookies with new tokens
    const updatedCookieStore = cookies();
    updatedCookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60, // 3 minutes
      path: '/',
    });

    updatedCookieStore.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60, // 5 minutes
      path: '/',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Token refreshed',
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
