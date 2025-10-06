import { promises as fs } from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

export type DashboardState = {
  bookedAppointments: number;
  valuePerBooking: number;
  revenueAutopilot: number;
  websiteClicks: number;
  estimatedRevenueForClient: number;
  bookingRate: number;
  updatedAt: string;
};

export interface Store {
  read(): Promise<DashboardState>;
  write(state: DashboardState): Promise<void>;
  incrementBooked(by?: number): Promise<DashboardState>;
  decrementBooked(by?: number): Promise<DashboardState>;
  recomputeDerived(state: DashboardState): DashboardState;
  lock(): Promise<void>;
  unlock(): Promise<void>;
}

const DEFAULT_STATE: DashboardState = {
  bookedAppointments: 0,
  valuePerBooking: 100, // CAD
  revenueAutopilot: 0,
  websiteClicks: 0,
  estimatedRevenueForClient: 0,
  bookingRate: 0,
  updatedAt: new Date().toISOString(),
};

class FileStore implements Store {
  private path: string;
  private lockPath: string;
  private lockFd: fs.FileHandle | null = null;
  private eventBus: EventEmitter;

  constructor(eventBus: EventEmitter) {
    this.path = path.join(process.cwd(), 'outputs', 'dashboard', 'state.json');
    this.lockPath = path.join(process.cwd(), 'outputs', 'dashboard', '.lock');
    this.eventBus = eventBus;
  }

  recomputeDerived(state: DashboardState): DashboardState {
    const newBookedAppointments = Math.max(0, state.bookedAppointments);
    const newWebsiteClicks = Math.max(0, state.websiteClicks);

    return {
      ...state,
      bookedAppointments: newBookedAppointments,
      websiteClicks: newWebsiteClicks,
      revenueAutopilot: newBookedAppointments * state.valuePerBooking,
      bookingRate: newWebsiteClicks > 0 ? (newBookedAppointments / newWebsiteClicks) * 100 : 0,
      updatedAt: new Date().toISOString(),
    };
  }

  async read(): Promise<DashboardState> {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const state = JSON.parse(content);
      return this.recomputeDerived(state);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.warn('State file not found, initializing with default state.');
        await this.write(DEFAULT_STATE);
        return DEFAULT_STATE;
      }
      console.error('Error reading state file:', error);
      throw error;
    }
  }

  async write(state: DashboardState): Promise<void> {
    const newState = this.recomputeDerived(state);
    await fs.writeFile(this.path, JSON.stringify(newState, null, 2), 'utf-8');
    this.eventBus.emit('state:update', newState);
  }

  async incrementBooked(by: number = 1): Promise<DashboardState> {
    await this.lock();
    try {
      const currentState = await this.read();
      currentState.bookedAppointments += by;
      await this.write(currentState);
      return currentState;
    } finally {
      await this.unlock();
    }
  }

  async decrementBooked(by: number = 1): Promise<DashboardState> {
    await this.lock();
    try {
      const currentState = await this.read();
      currentState.bookedAppointments = Math.max(0, currentState.bookedAppointments - by);
      await this.write(currentState);
      return currentState;
    } finally {
      await this.unlock();
    }
  }

  async lock(): Promise<void> {
    // Simple file lock for local development
    // In production, consider a more robust solution like Redis locks
    while (true) {
      try {
        this.lockFd = await fs.open(this.lockPath, 'wx'); // 'wx' creates file exclusively
        return;
      } catch (error: any) {
        if (error.code === 'EEXIST') {
          await new Promise(resolve => setTimeout(resolve, 50)); // Wait and retry
        } else {
          console.error('Error acquiring lock:', error);
          throw error;
        }
      }
    }
  }

  async unlock(): Promise<void> {
    if (this.lockFd) {
      await this.lockFd.close();
      await fs.unlink(this.lockPath);
      this.lockFd = null;
    }
  }
}

// MemoryStore for testing or environments where persistence isn't needed
class MemoryStore implements Store {
  private state: DashboardState = DEFAULT_STATE;
  private eventBus: EventEmitter;

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;
  }

  recomputeDerived(state: DashboardState): DashboardState {
    const newBookedAppointments = Math.max(0, state.bookedAppointments);
    const newWebsiteClicks = Math.max(0, state.websiteClicks);

    return {
      ...state,
      bookedAppointments: newBookedAppointments,
      websiteClicks: newWebsiteClicks,
      revenueAutopilot: newBookedAppointments * state.valuePerBooking,
      bookingRate: newWebsiteClicks > 0 ? (newBookedAppointments / newWebsiteClicks) * 100 : 0,
      updatedAt: new Date().toISOString(),
    };
  }

  async read(): Promise<DashboardState> {
    return this.recomputeDerived(this.state);
  }

  async write(state: DashboardState): Promise<void> {
    this.state = this.recomputeDerived(state);
    this.eventBus.emit('state:update', this.state);
  }

  async incrementBooked(by: number = 1): Promise<DashboardState> {
    this.state.bookedAppointments += by;
    await this.write(this.state);
    return this.state;
  }

  async decrementBooked(by: number = 1): Promise<DashboardState> {
    this.state.bookedAppointments = Math.max(0, this.state.bookedAppointments - by);
    await this.write(this.state);
    return this.state;
  }

  async lock(): Promise<void> { /* no-op */ }
  async unlock(): Promise<void> { /* no-op */ }
}

// Global event bus instance
const eventBus = new EventEmitter();

// Export a singleton instance of FileStore
export const fileStore = new FileStore(eventBus);
export const memoryStore = new MemoryStore(eventBus); // For testing

export const getStore = (): Store => {
  // Use MemoryStore in production (Vercel) since filesystem is read-only
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return memoryStore;
  }
  return fileStore;
};

export const getEventBus = () => eventBus;