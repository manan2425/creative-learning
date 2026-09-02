import { NextResponse } from 'next/server';
import crypto from 'crypto';

const DEFAULT_PASS_HASH = crypto.createHash('sha256').update('admin123').digest('hex');
const DEFAULT_RECOVERY_HASH = crypto.createHash('sha256').update('CREATIVE-LEARNING-RESET').digest('hex');

// Stored in memory / simple config
let currentPassHash = DEFAULT_PASS_HASH;
let currentRecoveryHash = DEFAULT_RECOVERY_HASH;

export async function POST(request: Request) {
  try {
    const { action, password, recoveryCode, newPassword } = await request.json();

    if (action === 'login') {
      const inputHash = crypto.createHash('sha256').update(password || '').digest('hex');
      if (inputHash === currentPassHash) {
        return NextResponse.json({ success: true, token: 'session_' + Date.now() });
      } else {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
      }
    }

    if (action === 'reset') {
      const inputRecoveryHash = crypto.createHash('sha256').update(recoveryCode || '').digest('hex');
      if (inputRecoveryHash === currentRecoveryHash) {
        if (!newPassword || newPassword.length < 4) {
          return NextResponse.json({ error: 'New password must be at least 4 characters long' }, { status: 400 });
        }
        currentPassHash = crypto.createHash('sha256').update(newPassword).digest('hex');
        return NextResponse.json({ success: true, message: 'Password updated successfully' });
      } else {
        return NextResponse.json({ error: 'Invalid recovery code' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
