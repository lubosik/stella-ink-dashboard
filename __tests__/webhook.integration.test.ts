import { NextRequest } from 'next/server';
import { POST } from '../app/api/webhooks/calendly/route';
import { memoryStore } from '../lib/state/store';

// Mock the store
jest.mock('../lib/state/store', () => ({
  memoryStore: {
    read: jest.fn(),
    write: jest.fn(),
    incrementBooked: jest.fn(),
    decrementBooked: jest.fn(),
    lock: jest.fn(),
    unlock: jest.fn(),
  },
}));

// Mock the audit logger
jest.mock('../lib/audit/logger', () => ({
  logAudit: jest.fn(),
}));

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  AnalyticsEvents: {
    webhookReceived: jest.fn(),
  },
}));

describe('Calendly Webhook Integration', () => {
  let mockStore: any;

  beforeEach(() => {
    mockStore = memoryStore;
    jest.clearAllMocks();
    
    // Set up default mock implementations
    mockStore.read.mockResolvedValue({
      bookedAppointments: 0,
      valuePerBooking: 100,
      revenueAutopilot: 0,
      websiteClicks: 100,
      estimatedRevenueForClient: 0,
      bookingRate: 0,
      updatedAt: new Date().toISOString(),
    });
    
    mockStore.incrementBooked.mockResolvedValue({
      bookedAppointments: 1,
      valuePerBooking: 100,
      revenueAutopilot: 100,
      websiteClicks: 100,
      estimatedRevenueForClient: 0,
      bookingRate: 1,
      updatedAt: new Date().toISOString(),
    });
  });

  describe('invitee.created event', () => {
    it('should increment booked appointments', async () => {
      const payload = {
        event: 'invitee.created',
        time: '2024-01-15T10:30:00.000Z',
        payload: {
          event_type: { uuid: 'test-uuid' },
          event: { uuid: 'test-event-uuid' },
          invitee: { uuid: 'test-invitee-uuid' },
        },
      };

      const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Calendly-Signature': 'mock-signature',
        },
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.received).toBe(true);
      expect(mockStore.incrementBooked).toHaveBeenCalledWith(1);
    });
  });

  describe('invitee.canceled event', () => {
    it('should decrement booked appointments', async () => {
      const payload = {
        event: 'invitee.canceled',
        time: '2024-01-15T10:30:00.000Z',
        payload: {
          event_type: { uuid: 'test-uuid' },
          event: { uuid: 'test-event-uuid' },
          invitee: { uuid: 'test-invitee-uuid' },
        },
      };

      const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Calendly-Signature': 'mock-signature',
        },
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.received).toBe(true);
      expect(mockStore.decrementBooked).toHaveBeenCalledWith(1);
    });
  });

  describe('invalid signature', () => {
    it('should return 401 for invalid signature', async () => {
      const payload = {
        event: 'invitee.created',
        time: '2024-01-15T10:30:00.000Z',
        payload: {
          event_type: { uuid: 'test-uuid' },
          event: { uuid: 'test-event-uuid' },
          invitee: { uuid: 'test-invitee-uuid' },
        },
      };

      const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Calendly-Signature': 'invalid-signature',
        },
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.error).toBe('Invalid signature');
    });
  });

  describe('unhandled event type', () => {
    it('should return 200 for unhandled events', async () => {
      const payload = {
        event: 'unhandled.event',
        time: '2024-01-15T10:30:00.000Z',
        payload: {
          event_type: { uuid: 'test-uuid' },
          event: { uuid: 'test-event-uuid' },
          invitee: { uuid: 'test-invitee-uuid' },
        },
      };

      const request = new NextRequest('http://localhost:3000/api/webhooks/calendly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Calendly-Signature': 'mock-signature',
        },
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.received).toBe(true);
      expect(result.message).toContain('Unhandled event type');
    });
  });
});
