import { NextRequest, NextResponse } from 'next/server';
import { fileStore, DashboardState } from '@/lib/state/store';
import { logAudit } from '@/lib/audit/logger';
import { authAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_STATE: DashboardState = {
  bookedAppointments: 0,
  valuePerBooking: 100,
  revenueAutopilot: 0,
  websiteClicks: 0,
  estimatedRevenueForClient: 0,
  bookingRate: 0,
  updatedAt: new Date().toISOString(),
};

export async function POST(req: NextRequest) {
  const authResult = await authAdmin(req);
  if (authResult.status !== 200) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const store = fileStore;
  await store.lock();

  try {
    const currentState = await store.read();
    const oldBookedAppointments = currentState.bookedAppointments;
    const oldWebsiteClicks = currentState.websiteClicks;
    const oldEstimatedRevenue = currentState.estimatedRevenueForClient;

    await store.write(DEFAULT_STATE);

    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'admin',
      action: 'reset',
      field: 'all',
      oldValue: `Booked: ${oldBookedAppointments}, Clicks: ${oldWebsiteClicks}, Est. Revenue: ${oldEstimatedRevenue}`,
      newValue: `Booked: 0, Clicks: 0, Est. Revenue: 0`,
      details: 'Dashboard state reset to default values.',
    });

    return NextResponse.json({ success: true, state: DEFAULT_STATE }, { status: 200 });
  } catch (error) {
    console.error('Error resetting dashboard state:', error);
    return NextResponse.json({ error: 'Failed to reset state' }, { status: 500 });
  } finally {
    await store.unlock();
  }
}
