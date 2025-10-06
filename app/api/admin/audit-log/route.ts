import { NextRequest, NextResponse } from 'next/server';
import { readAuditLog } from '@/lib/audit/logger';
import { authAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await authAdmin(req);
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const auditEntries = await readAuditLog(10); // Get last 10 entries
    return NextResponse.json(auditEntries, { status: 200 });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit log' }, { status: 500 });
  }
}
