import { NextRequest, NextResponse } from 'next/server';
import { fileStore } from '@/lib/state/store';
import { logAudit } from '@/lib/audit/logger';
import { AnalyticsEvents } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

// Define the booking data schema
export interface BookingData {
  event: 'booking_created' | 'booking_canceled';
  bookingId: string;
  clientName: string;
  clientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType?: string;
  value?: number; // Optional custom value for this booking
  notes?: string;
}

// Simple API key authentication (you can change this)
const API_KEY = process.env.DASHBOARD_API_KEY || 'dashboard-api-key-2024';

function validateBookingData(data: any): BookingData | null {
  try {
    // Required fields
    if (!data.event || !data.bookingId || !data.clientName || !data.clientEmail || !data.appointmentDate || !data.appointmentTime) {
      return null;
    }

    // Validate event type
    if (!['booking_created', 'booking_canceled'].includes(data.event)) {
      return null;
    }

    return {
      event: data.event,
      bookingId: String(data.bookingId),
      clientName: String(data.clientName),
      clientEmail: String(data.clientEmail),
      appointmentDate: String(data.appointmentDate),
      appointmentTime: String(data.appointmentTime),
      serviceType: data.serviceType ? String(data.serviceType) : undefined,
      value: data.value ? Number(data.value) : undefined,
      notes: data.notes ? String(data.notes) : undefined,
    };
  } catch (error) {
    return null;
  }
}

function authenticateRequest(req: NextRequest): boolean {
  // Check API key in header
  const apiKey = req.headers.get('X-API-Key');
  if (apiKey === API_KEY) {
    return true;
  }

  // Check API key in query parameter (for simple integrations)
  const url = new URL(req.url);
  const queryApiKey = url.searchParams.get('api_key');
  if (queryApiKey === API_KEY) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    if (!authenticateRequest(req)) {
      await logAudit({
        timestamp: new Date().toISOString(),
        user: 'webhook',
        action: 'update',
        field: 'security',
        oldValue: 'N/A',
        newValue: 'Invalid API key',
        details: 'Unauthorized booking API access attempt'
      });
      
      AnalyticsEvents.webhookReceived('unauthorized', 'failure');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the booking data
    const rawData = await req.json();
    const bookingData = validateBookingData(rawData);

    if (!bookingData) {
      await logAudit({
        timestamp: new Date().toISOString(),
        user: 'webhook',
        action: 'update',
        field: 'validation',
        oldValue: 'N/A',
        newValue: 'Invalid booking data',
        details: 'Failed to validate booking data structure'
      });

      AnalyticsEvents.webhookReceived('invalid_data', 'failure');
      return NextResponse.json({ 
        error: 'Invalid booking data. Required fields: event, bookingId, clientName, clientEmail, appointmentDate, appointmentTime' 
      }, { status: 400 });
    }

    // Get current state
    const currentState = await fileStore.read();
    const oldBookedAppointments = currentState.bookedAppointments;

    // Update the dashboard based on the event
    if (bookingData.event === 'booking_created') {
      await fileStore.incrementBooked(1);
    } else if (bookingData.event === 'booking_canceled') {
      await fileStore.decrementBooked(1);
    }

    // Get updated state
    const updatedState = await fileStore.read();

    // Log the audit entry
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'webhook',
      action: bookingData.event === 'booking_created' ? 'increment' : 'decrement',
      field: 'bookedAppointments',
      oldValue: oldBookedAppointments,
      newValue: updatedState.bookedAppointments,
      details: `${bookingData.event}: ${bookingData.clientName} (${bookingData.clientEmail}) - ${bookingData.appointmentDate} ${bookingData.appointmentTime}`
    });

    // Track analytics
    AnalyticsEvents.webhookReceived(bookingData.event, 'success');

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Booking ${bookingData.event} processed successfully`,
      bookingId: bookingData.bookingId,
      clientName: bookingData.clientName,
      updatedState: {
        bookedAppointments: updatedState.bookedAppointments,
        revenueAutopilot: updatedState.revenueAutopilot,
        bookingRate: updatedState.bookingRate
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Booking API error:', error);
    
    await logAudit({
      timestamp: new Date().toISOString(),
      user: 'webhook',
      action: 'update',
      field: 'error',
      oldValue: 'N/A',
      newValue: 'Internal server error',
      details: `Booking API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });

    AnalyticsEvents.webhookReceived('error', 'failure');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint for testing and documentation
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const test = url.searchParams.get('test');

  if (test === 'true') {
    // Test endpoint - simulate a booking
    const testBookingData: BookingData = {
      event: 'booking_created',
      bookingId: `test-${Date.now()}`,
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00',
      serviceType: 'Consultation',
      notes: 'Test booking via API'
    };

    return NextResponse.json({
      message: 'Test booking data structure',
      example: testBookingData,
      usage: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'dashboard-api-key-2024'
        },
        body: testBookingData
      }
    });
  }

  return NextResponse.json({
    message: 'Stella\'s Ink Chamber Dashboard Booking API',
    version: '1.0.0',
    endpoints: {
      'POST /api/bookings': 'Create or cancel a booking',
      'GET /api/bookings?test=true': 'Get test data structure'
    },
    authentication: {
      method: 'API Key',
      header: 'X-API-Key',
      query: 'api_key',
      value: 'dashboard-api-key-2024'
    },
    schema: {
      event: 'booking_created | booking_canceled',
      bookingId: 'string (required)',
      clientName: 'string (required)',
      clientEmail: 'string (required)',
      appointmentDate: 'string (required)',
      appointmentTime: 'string (required)',
      serviceType: 'string (optional)',
      value: 'number (optional)',
      notes: 'string (optional)'
    }
  });
}
