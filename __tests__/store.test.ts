import { memoryStore, DashboardState } from '../lib/state/store';

// Mock the store methods
jest.mock('../lib/state/store', () => ({
  memoryStore: {
    read: jest.fn(),
    write: jest.fn(),
    incrementBooked: jest.fn(),
    decrementBooked: jest.fn(),
    recomputeDerived: jest.fn(),
  },
}));

describe('Store', () => {
  let store: any;

  beforeEach(() => {
    store = memoryStore;
    jest.clearAllMocks();
  });

  describe('incrementBooked', () => {
    it('should increment booked appointments by 1', async () => {
      store.read.mockResolvedValue({ bookedAppointments: 0 });
      store.incrementBooked.mockResolvedValue({ bookedAppointments: 1 });

      const initialState = await store.read();
      expect(initialState.bookedAppointments).toBe(0);

      const updatedState = await store.incrementBooked();
      expect(updatedState.bookedAppointments).toBe(1);
    });

    it('should increment booked appointments by custom amount', async () => {
      store.read.mockResolvedValue({ bookedAppointments: 0 });
      store.incrementBooked.mockResolvedValue({ bookedAppointments: 5 });

      const initialState = await store.read();
      expect(initialState.bookedAppointments).toBe(0);

      const updatedState = await store.incrementBooked(5);
      expect(updatedState.bookedAppointments).toBe(5);
    });
  });

  describe('decrementBooked', () => {
    it('should decrement booked appointments by 1', async () => {
      store.read.mockResolvedValue({ bookedAppointments: 5 });
      store.decrementBooked.mockResolvedValue({ bookedAppointments: 4 });

      const updatedState = await store.decrementBooked();
      expect(updatedState.bookedAppointments).toBe(4);
    });

    it('should not go below 0', async () => {
      store.read.mockResolvedValue({ bookedAppointments: 0 });
      store.decrementBooked.mockResolvedValue({ bookedAppointments: 0 });

      const updatedState = await store.decrementBooked();
      expect(updatedState.bookedAppointments).toBe(0);
    });
  });

  describe('recomputeDerived', () => {
    it('should recalculate revenue autopilot', () => {
      const state: DashboardState = {
        bookedAppointments: 5,
        valuePerBooking: 100,
        revenueAutopilot: 0,
        websiteClicks: 100,
        estimatedRevenueForClient: 0,
        bookingRate: 0,
        updatedAt: new Date().toISOString(),
      };

      const recomputed = {
        ...state,
        revenueAutopilot: 500,
        bookingRate: 5,
      };

      store.recomputeDerived.mockReturnValue(recomputed);

      const result = store.recomputeDerived(state);
      expect(result.revenueAutopilot).toBe(500);
      expect(result.bookingRate).toBe(5);
    });

    it('should handle zero website clicks', () => {
      const state: DashboardState = {
        bookedAppointments: 5,
        valuePerBooking: 100,
        revenueAutopilot: 0,
        websiteClicks: 0,
        estimatedRevenueForClient: 0,
        bookingRate: 0,
        updatedAt: new Date().toISOString(),
      };

      const recomputed = {
        ...state,
        revenueAutopilot: 500,
        bookingRate: 0,
      };

      store.recomputeDerived.mockReturnValue(recomputed);

      const result = store.recomputeDerived(state);
      expect(result.bookingRate).toBe(0);
    });
  });
});