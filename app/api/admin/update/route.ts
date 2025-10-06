import { NextRequest, NextResponse } from 'next/server';
import { fileStore, DashboardState } from '@/lib/state/store';
import { logAudit } from '@/lib/audit/logger';
import { authAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function validateUpdate(field: string, value: number): string | null {
  if (value < 0) return 'Value must be non-negative';
  if (!Number.isInteger(value)) return 'Value must be a whole number';
  if (value > 1_000_000_000) return 'Value seems unreasonably high';
  return null;
}

export async function PATCH(req: NextRequest) {
  // Authenticate admin
  const authResult = await authAdmin(req);
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const store = fileStore;
  await store.lock();
  try {
    const { field, value } = await req.json();

    if (!field || value === undefined) {
      return NextResponse.json({ error: 'Missing field or value' }, { status: 400 });
    }

    const validationError = validateUpdate(field, value);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const currentState = await store.read();
    const oldValue = currentState[field as keyof DashboardState];

    if (oldValue === undefined) {
      return NextResponse.json({ error: `Field '${field}' not found or not editable` }, { status: 400 });
    }

    const updatedState = { ...currentState, [field]: value };
    await store.write(updatedState);

    // Log audit entry
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'admin',
      action: 'update',
      field: field,
      oldValue: oldValue as number,
      newValue: value,
    });

    return NextResponse.json({ success: true, state: updatedState }, { status: 200 });
  } catch (error) {
    console.error('Error updating dashboard metrics:', error);
    return NextResponse.json({ error: 'Failed to update metrics' }, { status: 500 });
  } finally {
    await store.unlock();
  }
}
