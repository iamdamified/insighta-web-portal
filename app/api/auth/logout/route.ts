import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // Call backend logout endpoint if we have a refresh token
  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '1',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
    } catch (error) {
      // Log error but continue with local cleanup
      console.error('Backend logout failed:', error);
    }
  }

  // Clear cookies
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return NextResponse.json({ success: true });
}
