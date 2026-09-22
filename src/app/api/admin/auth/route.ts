import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_ADMIN_PASS = 'Varmin@1234';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const validPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.trim() !== validPassword.trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid administrator password. Please try again.' },
        { status: 401 }
      );
    }

    // Generate a verification token for the session
    const timestamp = Date.now();
    const sessionToken = Buffer.from(`admin_session_${timestamp}_${validPassword.length}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token: sessionToken,
      authenticatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication processing failed' },
      { status: 500 }
    );
  }
}
