import { NextRequest } from 'next/server';
import { getEventBus, fileStore, DashboardState } from '@/lib/state/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const eventBus = getEventBus();
  const store = fileStore;

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      // Send initial state
      const initialState = await store.read();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'state:update', state: initialState })}\n\n`));

      // Listener for state updates
      const onStateUpdate = (state: DashboardState) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'state:update', state })}\n\n`));
      };
      eventBus.on('state:update', onStateUpdate);

      // Keep-alive ping
      const pingInterval = setInterval(() => {
        controller.enqueue(encoder.encode('data: {"type":"ping"}\n\n'));
      }, 30000); // 30 seconds

      req.signal.onabort = () => {
        eventBus.off('state:update', onStateUpdate);
        clearInterval(pingInterval);
        controller.close();
        console.log('SSE client disconnected.');
      };
    },
    cancel() {
      console.log('SSE stream cancelled.');
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for Nginx
    },
  });
}
