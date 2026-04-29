import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for tokens with backend via GET (matching backend OAuth flow)
    const tokenResponse = await fetch(`${API_URL}/auth/github/callback?code=${code}&state=${state}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return NextResponse.json({ error: error.detail || 'OAuth failed' }, { status: 401 });
    }

    const data = await tokenResponse.json();

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json({ error: 'Invalid token response' }, { status: 401 });
    }

    // Set HTTP-only cookies
    const cookieStore = cookies();
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60, // 3 minutes
      path: '/',
    });

    cookieStore.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60, // 5 minutes
      path: '/',
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
