import { NextRequest } from 'next/server';
import { POST } from '../app/api/webhooks/calendly/route';

// Mock the dependencies
jest.mock('../lib/state/store', () => ({
  fileStore: {
    read: jest.fn(),
    incrementBooked: jest.fn(),
    decrementBooked: jest.fn(),
    lock: jest.fn(),
    unlock: jest.fn(),
  },
}));

jest.mock('../lib/audit/logger', () => ({
  logAudit: jest.fn(),
}));

jest.mock('../lib/webhooks/verify', () => ({
  verifyWebhookSignature: jest.fn(),
}));

describe('Calendly Webhook', () => {
  const mockFileStore = require('../lib/state/store').fileStore;
  const mockLogAudit = require('../lib/audit/logger').logAudit;
  const mockVerifyWebhook = require('../lib/webhooks/verify').verifyWebhookSignature;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyWebhook.mockReturnValue(true);
    mockFileStore.read.mockResolvedValue({
      bookedAppointments: 5,
      valuePerBooking: 100,
      revenueAutopilot: 500,
      websiteClicks: 100,
      estimatedRevenueForClient: 200,
      bookingRate: 5,
      updatedAt: new Date().toISOString(),
    });
    mockFileStore.incrementBooked.mockResolvedValue({
      bookedAppointments: 6,
      valuePerBooking: 100,
      revenueAutopilot: 600,
      websiteClicks: 100,
      estimatedRevenueForClient: 200,
      bookingRate: 6,
      updatedAt: new Date().toISOString(),
    });
  });

  it('should handle invitee.created event', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
      method: 'POST',
      body: JSON.stringify({
        event: 'invitee.created',
        payload: {
          invitee: {
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      }),
      headers: {
        'content-type': 'application/json',
        'X-Calendly-Signature': 'test-signature',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(mockFileStore.incrementBooked).toHaveBeenCalled();
    expect(mockLogAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        user: 'webhook',
        action: 'increment',
        field: 'bookedAppointments',
      })
    );
  });

  it('should handle invitee.canceled event', async () => {
    mockFileStore.decrementBooked.mockResolvedValue({
      bookedAppointments: 4,
      valuePerBooking: 100,
      revenueAutopilot: 400,
      websiteClicks: 100,
      estimatedRevenueForClient: 200,
      bookingRate: 4,
      updatedAt: new Date().toISOString(),
    });

    const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
      method: 'POST',
      body: JSON.stringify({
        event: 'invitee.canceled',
        payload: {
          invitee: {
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      }),
      headers: {
        'content-type': 'application/json',
        'X-Calendly-Signature': 'test-signature',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(mockFileStore.decrementBooked).toHaveBeenCalled();
    expect(mockLogAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        user: 'webhook',
        action: 'decrement',
        field: 'bookedAppointments',
      })
    );
  });

  it('should reject invalid signature', async () => {
    mockVerifyWebhook.mockReturnValue(false);

    const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
      method: 'POST',
      body: JSON.stringify({
        event: 'invitee.created',
        payload: { invitee: { email: 'test@example.com' } },
      }),
      headers: {
        'content-type': 'application/json',
        'X-Calendly-Signature': 'invalid-signature',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid signature');
  });

  it('should handle unhandled event types', async () => {
    const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
      method: 'POST',
      body: JSON.stringify({
        event: 'unhandled.event',
        payload: { some: 'data' },
      }),
      headers: {
        'content-type': 'application/json',
        'X-Calendly-Signature': 'test-signature',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(data.message).toContain('Unhandled event type');
  });
});
