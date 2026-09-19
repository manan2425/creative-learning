import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_PASS_HASH = crypto.createHash('sha256').update('admin123').digest('hex');
const DEFAULT_RECOVERY_HASH = crypto.createHash('sha256').update('CREATIVE-LEARNING-RESET').digest('hex');
let cachedAuthConfig: { passHash: string; recoveryHash: string } | null = null;
let cachedAuthAt = 0;
const AUTH_CACHE_TTL = 60_000;

async function getAuthConfig() {
  if (cachedAuthConfig && Date.now() - cachedAuthAt < AUTH_CACHE_TTL) {
    return cachedAuthConfig;
  }

  let config: { passHash: string; recoveryHash: string } | null = null;
  try {
    const db = await getDb();
    if (db) {
      const authCol = db.collection('auth');
      const doc = await authCol.findOne({ _id: 'admin_credentials' as any });
      if (doc && doc.passHash) {
        config = {
          passHash: doc.passHash,
          recoveryHash: doc.recoveryHash || DEFAULT_RECOVERY_HASH,
        };
      }
      // Seed default credentials into MongoDB
      await authCol.updateOne(
        { _id: 'admin_credentials' as any },
        {
          $set: {
            _id: 'admin_credentials',
            passHash: DEFAULT_PASS_HASH,
            recoveryHash: DEFAULT_RECOVERY_HASH,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error('Error reading auth from MongoDB, using fallback:', err);
  }
  cachedAuthConfig = config || {
    passHash: DEFAULT_PASS_HASH,
    recoveryHash: DEFAULT_RECOVERY_HASH,
  };
  cachedAuthAt = Date.now();
  return cachedAuthConfig;
}

async function saveAuthPassword(newPasswordHash: string) {
  try {
    const db = await getDb();
    if (db) {
      const authCol = db.collection('auth');
      await authCol.updateOne(
        { _id: 'admin_credentials' as any },
        {
          $set: {
            passHash: newPasswordHash,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
      cachedAuthConfig = null;
      cachedAuthAt = 0;
      return true;
    }
  } catch (err) {
    console.error('Error saving auth to MongoDB:', err);
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const { action, password, recoveryCode, newPassword } = await request.json();
    const config = await getAuthConfig();

    if (action === 'login') {
      const inputHash = crypto.createHash('sha256').update(password || '').digest('hex');
      if (inputHash === config.passHash) {
        return NextResponse.json({ success: true, token: 'session_' + Date.now() });
      } else {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
      }
    }

    if (action === 'reset') {
      const inputRecoveryHash = crypto.createHash('sha256').update(recoveryCode || '').digest('hex');
      if (inputRecoveryHash === config.recoveryHash) {
        if (!newPassword || newPassword.length < 4) {
          return NextResponse.json({ error: 'New password must be at least 4 characters long' }, { status: 400 });
        }
        const newPassHash = crypto.createHash('sha256').update(newPassword).digest('hex');
        await saveAuthPassword(newPassHash);
        return NextResponse.json({ success: true, message: 'Password updated and saved to MongoDB successfully' });
      } else {
        return NextResponse.json({ error: 'Invalid recovery code' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Auth route error:', err);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
