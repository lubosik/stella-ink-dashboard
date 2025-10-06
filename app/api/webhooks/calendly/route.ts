import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhooks/verify';
import { fileStore } from '@/lib/state/store';
import { logAudit } from '@/lib/audit/logger';

export const dynamic = 'force-dynamic';

// Basic in-memory rate limiting
const requestCounts = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const BURST_LIMIT = 10; // 10 requests per second

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let entry = requestCounts.get(ip);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    entry = { count: 0, lastReset: now };
  }

  entry.count++;
  requestCounts.set(ip, entry);

  // Check burst limit (simplified: if count exceeds burst limit within a very short time)
  // A more robust burst limit would track requests per second
  if (entry.count > BURST_LIMIT && now - entry.lastReset < 1000) {
    return true;
  }

  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function isIpAllowed(ip: string | null): boolean {
  const allowedIps = process.env.ALLOWED_IPS?.split(',').map(s => s.trim()).filter(Boolean) || [];
  if (allowedIps.length === 0) {
    return true; // No IP whitelist configured
  }
  return ip ? allowedIps.includes(ip) : false;
}

export async function POST(req: NextRequest) {
  const clientIp = req.ip || req.headers.get('x-forwarded-for') || 'unknown';

  // IP Whitelist check
  if (!isIpAllowed(clientIp)) {
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'webhook',
      action: 'update',
      field: 'security',
      oldValue: 'N/A',
      newValue: `Blocked IP: ${clientIp}`,
    });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate Limiting
  if (isRateLimited(clientIp)) {
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'webhook',
      action: 'update',
      field: 'security',
      oldValue: 'N/A',
      newValue: `Rate limited IP: ${clientIp}`,
    });
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const calendlySignature = req.headers.get('X-Calendly-Signature');
  const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;

  const rawBody = await req.text(); // Read raw body for signature verification

          if (!verifyWebhookSignature(rawBody, calendlySignature, webhookSecret)) {
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'webhook',
      action: 'update',
      field: 'security',
      oldValue: 'N/A',
      newValue: 'Invalid Calendly signature',
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventType = payload.event;
    const store = fileStore;

    let auditAction: 'increment' | 'decrement' | 'update' = 'update';
    let auditField = 'bookedAppointments';
    let oldValue = (await store.read()).bookedAppointments;
    let newValue = oldValue;

    await store.lock(); // Acquire lock
    try {
      if (eventType === 'invitee.created') {
        const updatedState = await store.incrementBooked();
        newValue = updatedState.bookedAppointments;
        auditAction = 'increment';
        console.log('Calendly: invitee.created - Booked appointments incremented.');
      } else if (eventType === 'invitee.canceled') {
        // Optional: Decrement if needed. PRD says optional.
        // For now, let's implement it as a decrement.
        const updatedState = await store.decrementBooked();
        newValue = updatedState.bookedAppointments;
        auditAction = 'decrement';
        console.log('Calendly: invitee.canceled - Booked appointments decremented.');
      } else {
        console.log(`Calendly: Unhandled event type: ${eventType}`);
        // Log unhandled events but still return 200 to Calendly
        await logAudit({
          timestamp: new Date().toISOString(),
          user: 'webhook',
          action: 'update',
          field: 'unhandledEvent',
          oldValue: eventType,
          newValue: 'N/A',
        });
        return NextResponse.json({ received: true, message: `Unhandled event type: ${eventType}` }, { status: 200 });
      }

      await logAudit({
        timestamp: new Date().toISOString(),
        user: 'webhook',
        action: auditAction,
        field: auditField,
        oldValue: oldValue,
        newValue: newValue,
      });

    } finally {
      await store.unlock(); // Release lock
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Calendly webhook:', error);
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'webhook',
      action: 'update',
      field: 'error',
      oldValue: rawBody,
      newValue: (error as Error).message,
    });
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
