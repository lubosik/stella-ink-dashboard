import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const { status, error, headers } = await loginAdmin(password);

    if (status === 200) {
      return NextResponse.json({ success: true }, { status, headers });
    } else {
      return NextResponse.json({ error }, { status });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
