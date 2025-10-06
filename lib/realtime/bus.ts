import { EventEmitter } from 'events';
import { DashboardState } from '../state/store';

// In-memory client list for SSE
const clients: Set<Response> = new Set();

export class RealtimeBus extends EventEmitter {
  private keepaliveInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startKeepalive();
  }

  addClient(response: Response): void {
    clients.add(response);
    console.log(`SSE client connected. Total clients: ${clients.size}`);
  }

  removeClient(response: Response): void {
    clients.delete(response);
    console.log(`SSE client disconnected. Total clients: ${clients.size}`);
  }

  broadcast(state: DashboardState): void {
    const message = `data: ${JSON.stringify({ type: 'state:update', state })}\n\n`;
    
    for (const client of Array.from(clients)) {
      try {
        // @ts-ignore - Response.write is available in Node.js
        client.write(message);
      } catch (error) {
        console.warn('Failed to write to SSE client:', error);
        clients.delete(client);
      }
    }
  }

  private startKeepalive(): void {
    this.keepaliveInterval = setInterval(() => {
      const ping = `data: ${JSON.stringify({ type: 'ping' })}\n\n`;
      
      for (const client of Array.from(clients)) {
        try {
          // @ts-ignore - Response.write is available in Node.js
          client.write(ping);
        } catch (error) {
          clients.delete(client);
        }
      }
    }, 30000); // 30 seconds
  }

  stop(): void {
    if (this.keepaliveInterval) {
      clearInterval(this.keepaliveInterval);
      this.keepaliveInterval = null;
    }
  }
}

// Default instance
export const realtimeBus = new RealtimeBus();
