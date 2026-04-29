import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  
  // Clear cookies
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return NextResponse.json({ success: true });
}
