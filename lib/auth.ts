import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-session-secret-change-in-production';

export interface AuthResult {
  status: number;
  error?: string;
  user?: string;
}

export async function authAdmin(req: NextRequest): Promise<AuthResult> {
  try {
    // Check for session cookie first
    const sessionCookie = req.cookies.get('admin-session');
    if (sessionCookie) {
      const sessionData = verifySession(sessionCookie.value);
      if (sessionData) {
        return { status: 200, user: sessionData.user };
      }
    }

    // Check for Basic Auth header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      
      if (username === 'admin' && password === ADMIN_PASSWORD) {
        // Create session cookie
        const sessionToken = createSession('admin');
        return { status: 200, user: 'admin' };
      }
    }

    return { status: 401, error: 'Authentication required' };
  } catch (error) {
    console.error('Auth error:', error);
    return { status: 500, error: 'Authentication failed' };
  }
}

export async function createAdminSession(password: string): Promise<AuthResult> {
  if (password === ADMIN_PASSWORD) {
    const sessionToken = createSession('admin');
    return { status: 200, user: 'admin' };
  }
  return { status: 401, error: 'Invalid password' };
}

export async function loginAdmin(password: string): Promise<{ status: number; error?: string; headers?: Headers }> {
  if (password === ADMIN_PASSWORD) {
    const sessionToken = createSession('admin');
    const headers = new Headers();
    headers.set('Set-Cookie', `admin-session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
    return { status: 200, headers };
  } else {
    return { status: 401, error: 'Invalid password' };
  }
}

function createSession(user: string): string {
  const sessionData = {
    user,
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
  
  const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(token)
    .digest('hex');
  
  return `${token}.${signature}`;
}

function verifySession(sessionToken: string): { user: string } | null {
  try {
    const [token, signature] = sessionToken.split('.');
    if (!token || !signature) return null;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(token)
      .digest('hex');
    
    if (signature !== expectedSignature) return null;

    // Parse session data
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    // Check expiration
    if (Date.now() > sessionData.expires) return null;
    
    return { user: sessionData.user };
  } catch (error) {
    return null;
  }
}

export function setSessionCookie(sessionToken: string): void {
  const cookieStore = cookies();
  cookieStore.set('admin-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}
