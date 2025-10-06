import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { status, error } = await authAdmin(req);

  if (status === 200) {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } else {
    return NextResponse.json({ authenticated: false, error }, { status });
  }
}
