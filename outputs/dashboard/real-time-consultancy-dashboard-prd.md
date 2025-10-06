# Real-Time Consultations Dashboard - PRD & Architecture

**Project:** Stella's Ink Chamber - Live Consultations Tracker  
**Date:** October 5, 2025  
**Status:** Specification Complete - Ready for Build

## 1. Mini-PRD

### User Stories

**As the Business Owner (Stella)**
- I want to see booked appointments increment in real-time when someone books via Calendly
- I want to see automatic revenue calculations based on bookings
- I want a simple dashboard I can pull up on my phone during the day
- I want to quickly see my booking rate (appointments ÷ website traffic)

**As an Admin**
- I want to manually adjust website clicks as they come from Google Analytics
- I want to set/update the value per booking (default $100)
- I want to manually input my estimated monthly revenue target
- I want to correct the booking count if needed (cancellations, no-shows)
- I want a password-protected area so only I can make changes

**As a Viewer (Staff/Team)**
- I want to see the live dashboard without needing a password
- I want smooth, animated updates that feel alive
- I want the page to work on mobile without horizontal scroll

**As a Webhook (Calendly)**
- I want to POST booking events to /api/webhooks/calendly
- I want my signature verified so spoof requests are rejected
- I want a quick 200 response so I don't retry

### Non-Goals (Phase 1)
- ❌ No historical charts/graphs (just current state)
- ❌ No multi-tenant/multi-client support
- ❌ No Stripe/payment integration
- ❌ No email notifications (just dashboard updates)
- ❌ No user roles beyond Admin vs. Viewer
- ❌ No mobile app (responsive web only)

### Dependencies

| Dependency | Purpose | Required |
|------------|---------|----------|
| Calendly Webhook | Trigger booking events | ✅ Yes |
| CALENDLY_WEBHOOK_SECRET | HMAC signature verification | ✅ Yes |
| ADMIN_PASSWORD | Protect admin panel | ✅ Yes |
| VALUE_PER_BOOKING | Override default $100 | ⚠️ Optional |
| ALLOWED_IPS | IP whitelist for webhooks | ⚠️ Optional |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Multi-instance SSE | State desync across server instances | Use single instance or Redis pub/sub |
| Webhook spoofing | Fake bookings inflate metrics | HMAC verification + IP whitelist |
| File persistence race | Concurrent writes corrupt JSON | File locking or atomic writes |
| SSE connection drops | Dashboard doesn't update | 10s polling fallback |
| Admin brute force | Unauthorized access | Rate limit + session timeout |

## 2. Information Architecture & Routes

```
/
├── /dashboard                          GET   Public view (live metrics)
├── /admin                              GET   Password-gated admin panel
│
├── /api/webhooks/calendly              POST  Calendly webhook receiver
├── /api/state                          GET   Current dashboard state (SSR/hydration)
├── /api/stream                         GET   SSE stream (real-time push)
│
└── /api/admin/update                   PATCH Protected (update metrics)
```

### Route Details

**GET /dashboard**
- Purpose: Public-facing live dashboard
- Auth: None (read-only)
- SSR: Yes (hydrate with /api/state)
- Features: FlipNumber counters, MoneyTicker, live SSE updates

**GET /admin**
- Purpose: Admin control panel
- Auth: HTTP Basic or session cookie
- Features: Edit clicks, value per booking, estimated revenue, manual booking adjustment
- Audit: Logs all changes to /outputs/dashboard/audit.log

**POST /api/webhooks/calendly**
- Purpose: Receive Calendly booking events
- Auth: HMAC signature (X-Calendly-Signature)
- Rate Limit: 100 req/min per IP
- Events Accepted: invitee.created, invitee.canceled
- Response: 200 OK (async processing)

**GET /api/state**
- Purpose: Get current dashboard state (JSON)
- Auth: None (read-only)
- Cache: 5s max-age
- Format: DashboardState object

**GET /api/stream**
- Purpose: Server-Sent Events stream
- Auth: None (read-only)
- Format: data: {"type":"state:update","state":{...}}\n\n
- Keepalive: 30s ping

**PATCH /api/admin/update**
- Purpose: Update dashboard metrics
- Auth: Session required
- Body: { field: "websiteClicks", value: 1500 }
- Validation: Non-negative numbers only

## 3. Data Model (Storage-Agnostic)

### Core State

```typescript
type DashboardState = {
  // Core metrics
  bookedAppointments: number;           // Auto-increment on webhook
  valuePerBooking: number;              // Default 100 (CAD)
  revenueAutopilot: number;             // Computed: bookedAppointments * valuePerBooking
  
  // Admin-editable
  websiteClicks: number;                // Manual input from GA
  estimatedRevenueForClient: number;    // Stella's target revenue
  
  // Computed
  bookingRate: number;                  // bookedAppointments / websiteClicks (%)
  
  // Metadata
  updatedAt: string;                    // ISO timestamp
};
```

### Persistence Adapters

**FileStore (Local/Dev)**
```typescript
interface Store {
  read(): Promise<DashboardState>;
  write(state: DashboardState): Promise<void>;
  lock(): Promise<void>;
  unlock(): Promise<void>;
}

// Implementation
class FileStore implements Store {
  private path = '/outputs/dashboard/state.json';
  private lockPath = '/outputs/dashboard/.lock';
  
  async read() { /* atomic read */ }
  async write(state) { /* atomic write with flock */ }
}
```

**RedisStore (Future - Production)**
```typescript
class RedisStore implements Store {
  async read() { return JSON.parse(await redis.get('dashboard:state')); }
  async write(state) { await redis.set('dashboard:state', JSON.stringify(state)); }
}
```

### Audit Log

```typescript
type AuditEntry = {
  timestamp: string;
  user: 'admin' | 'webhook';
  action: 'update' | 'increment' | 'decrement';
  field: keyof DashboardState;
  oldValue: number;
  newValue: number;
};

// Append-only file: /outputs/dashboard/audit.log
```

## 4. Brand System Contract

### Token Schema

**/tokens/stella-brand.json**
```json
{
  "color": {
    "primary": "#293919",
    "primaryLight": "#3d5226",
    "accent": "#f59e0b",
    "success": "#10b981",
    "neutral": {
      "50": "#f9fafb",
      "100": "#f3f4f6",
      "600": "#4b5563",
      "900": "#111827"
    }
  },
  "font": {
    "family": {
      "heading": "'Libre Baskerville', Georgia, serif",
      "body": "'Source Sans Pro', -apple-system, sans-serif"
    },
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    }
  },
  "radius": {
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem"
  },
  "shadow": {
    "card": "0 4px 12px rgba(41, 57, 25, 0.15)",
    "elevated": "0 8px 24px rgba(41, 57, 25, 0.2)"
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "0.75rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  }
}
```

### Required Components

**BrandCard**
```tsx
<BrandCard variant="elevated | flat" className="">
  {children}
</BrandCard>
```

**MetricTile**
```tsx
<MetricTile
  label="Booked Appointments"
  value={42}
  trend="+5"
  icon={<CalendarIcon />}
/>
```

**FlipNumber**
```tsx
<FlipNumber value={42} duration={600} />
```

**MoneyTicker**
```tsx
<MoneyTicker value={4200} currency="CAD" duration={1000} />
```

**BrandButton**
```tsx
<BrandButton variant="primary | secondary" size="sm | md | lg">
  Save Changes
</BrandButton>
```

**BrandGuard Linter**
```javascript
// /scripts/brandguard.mjs
// Blocks: hardcoded hex, inline styles, font names outside tokens

const forbidden = [
  /style="[^"]*"/,                    // Inline styles
  /#[0-9a-f]{3,6}/i,                  // Hex colors
  /font-family:\s*['"][^'"]*['"]/,    // Direct font names
  /box-shadow:\s*\d+px/               // Hardcoded shadows
];

// Exits 1 if violations found
```

## 5. Calendly Integration Spec

### Environment Variables

```bash
# .env.sample
CALENDLY_WEBHOOK_SECRET=your_webhook_signing_secret_here
ADMIN_PASSWORD=secure_password_here
VALUE_PER_BOOKING=100
ALLOWED_IPS=203.0.113.0/24,198.51.100.42  # Optional CSV
NODE_ENV=development
```

### Webhook Signature Verification

**Header:** X-Calendly-Signature  
**Algorithm:** HMAC-SHA256  
**Payload:** Raw request body

```typescript
function verifyWebhook(req: Request): boolean {
  const signature = req.headers.get('X-Calendly-Signature');
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(req.body);
  const computed = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computed)
  );
}
```

### Event Types

**Accept:**
- invitee.created → Increment bookedAppointments by 1
- invitee.canceled → Decrement bookedAppointments by 1 (optional)

**Reject:**
- invitee.rescheduled (no-op, net zero change)
- Any other event type

### Webhook Payload Example

```json
{
  "event": "invitee.created",
  "time": "2025-10-05T15:00:00Z",
  "payload": {
    "email": "client@example.com",
    "name": "Jane Doe",
    "event_type_name": "Free SMP Consultation",
    "invitee_uri": "https://calendly.com/..."
  }
}
```

### Rate Limiting

- 100 requests/minute per IP
- 10 requests/second burst
- Return 429 Too Many Requests if exceeded

### IP Whitelist (Optional)

```typescript
if (ALLOWED_IPS set):
const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
if (allowedIPs.length && !allowedIPs.includes(clientIP)) {
  return new Response('Forbidden', { status: 403 });
}
```

## 6. Real-Time Transport (SSE)

### Server-Sent Events Stream

**Endpoint:** GET /api/stream  
**Headers:**
- Content-Type: text/event-stream
- Cache-Control: no-cache
- Connection: keep-alive
- X-Accel-Buffering: no

**Event Format:**
```
data: {"type":"state:update","state":{"bookedAppointments":42,...}}

data: {"type":"ping"}
```

**Client Implementation:**
```typescript
const eventSource = new EventSource('/api/stream');

eventSource.addEventListener('message', (e) => {
  const { type, state } = JSON.parse(e.data);
  
  if (type === 'state:update') {
    updateDashboard(state);
  }
});

eventSource.onerror = () => {
  // Fallback to polling
  setInterval(() => fetch('/api/state'), 10000);
};
```

### Keepalive

Send `data: {"type":"ping"}\n\n` every 30 seconds to prevent connection timeout.

### Broadcasting

```typescript
// In-memory client list
const clients: Set<Response> = new Set();

function broadcast(state: DashboardState) {
  const message = `data: ${JSON.stringify({ type: 'state:update', state })}\n\n`;
  
  for (const client of clients) {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  }
}
```

### Fallback Polling

If SSE fails (network issues, old browser):
```typescript
// Fallback: Poll /api/state every 10s
let pollInterval: NodeJS.Timeout;

if (!window.EventSource) {
  pollInterval = setInterval(async () => {
    const state = await fetch('/api/state').then(r => r.json());
    updateDashboard(state);
  }, 10000);
}
```

## 7. Animations & UX

### FlipNumber Component

**Purpose:** Odometer-style animated counter for bookedAppointments  
**Behavior:**
- Digit flip animation (0→1→2→...→9 smooth transition)
- Duration: 600ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

**Accessibility:**
```tsx
<div 
  className="flip-number" 
  aria-live="polite" 
  aria-atomic="true"
  role="status"
>
  <span className="sr-only">Booked appointments: {value}</span>
  {/* Visual flip animation */}
</div>
```

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .flip-number {
    transition: none !important;
  }
}
```

### MoneyTicker Component

**Purpose:** Smooth $ increment animation for revenueAutopilot  
**Behavior:**
- Increments from old value to new value over 1000ms
- Uses requestAnimationFrame for smooth 60fps
- Formats with commas: $4,200

**Implementation:**
```typescript
function MoneyTicker({ value, duration = 1000 }) {
  const [displayed, setDisplayed] = useState(0);
  
  useEffect(() => {
    const start = displayed;
    const delta = value - start;
    const startTime = performance.now();
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setDisplayed(Math.round(start + delta * progress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <span>${displayed.toLocaleString()}</span>;
}
```

### MetricTile Layout

```tsx
<BrandCard variant="elevated">
  <div className="metric-tile">
    <div className="metric-tile__header">
      <span className="metric-tile__icon">{icon}</span>
      <span className="metric-tile__label">{label}</span>
    </div>
    
    <div className="metric-tile__value">
      <FlipNumber value={value} />
      {trend && <span className="metric-tile__trend">+{trend}</span>}
    </div>
  </div>
</BrandCard>
```

### Responsive Grid

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

### High Contrast & WCAG AA

- Minimum contrast: 4.5:1 for text, 3:1 for UI
- Primary on white: #293919 on #ffffff = 12.3:1 ✅
- Labels: Visible, not relying on color alone
- Focus indicators: 3px solid border

## 8. Admin Panel UX

### Login Flow

**Option A: HTTP Basic Auth (Simplest)**
```typescript
// Middleware
const authHeader = req.headers.get('Authorization');
const [type, credentials] = authHeader?.split(' ') ?? [];

if (type !== 'Basic') {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
  });
}

const [username, password] = atob(credentials).split(':');
if (password !== process.env.ADMIN_PASSWORD) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Option B: Session Cookie (Better UX)**
```typescript
// /api/admin/login POST
const { password } = await req.json();

if (password === process.env.ADMIN_PASSWORD) {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { expires: Date.now() + 3600000 });
  
  return new Response('OK', {
    headers: {
      'Set-Cookie': `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
    }
  });
}
```

### Admin Interface

**Sections:**

**Metrics Editor**
```tsx
<form onSubmit={handleUpdate}>
  <label>
    Website Clicks
    <input type="number" name="websiteClicks" value={state.websiteClicks} />
  </label>
  
  <label>
    Value Per Booking (CAD)
    <input type="number" name="valuePerBooking" value={state.valuePerBooking} />
  </label>
  
  <label>
    Estimated Revenue for Stella (CAD)
    <input type="number" name="estimatedRevenueForClient" value={state.estimatedRevenueForClient} />
  </label>
  
  <label>
    Booked Appointments (Manual Adjust)
    <input type="number" name="bookedAppointments" value={state.bookedAppointments} />
  </label>
  
  <BrandButton type="submit">Save Changes</BrandButton>
</form>
```

**Quick Actions**
```tsx
<div className="admin-actions">
  <BrandButton onClick={recalculate}>Recalculate All</BrandButton>
  <BrandButton onClick={testWebhook} variant="secondary">Test Webhook</BrandButton>
  <BrandButton onClick={resetState} variant="danger">Reset to Zero</BrandButton>
</div>
```

**Audit Trail**
```tsx
<BrandCard>
  <h3>Recent Changes</h3>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>User</th>
        <th>Field</th>
        <th>Old → New</th>
      </tr>
    </thead>
    <tbody>
      {auditLog.slice(-10).map(entry => (
        <tr key={entry.timestamp}>
          <td>{formatTime(entry.timestamp)}</td>
          <td>{entry.user}</td>
          <td>{entry.field}</td>
          <td>{entry.oldValue} → {entry.newValue}</td>
        </tr>
      ))}
    </tbody>
  </table>
</BrandCard>
```

### Validation

```typescript
function validateUpdate(field: string, value: number): string | null {
  if (value < 0) return 'Value must be non-negative';
  if (!Number.isInteger(value)) return 'Value must be a whole number';
  if (value > 1_000_000) return 'Value seems unreasonably high';
  return null;
}
```

### Audit Logging

```typescript
async function logChange(entry: AuditEntry) {
  const line = JSON.stringify(entry) + '\n';
  await fs.appendFile('/outputs/dashboard/audit.log', line);
}

// Usage
await logChange({
  timestamp: new Date().toISOString(),
  user: 'admin',
  action: 'update',
  field: 'websiteClicks',
  oldValue: 1000,
  newValue: 1500
});
```

## 9. Acceptance Tests (Binary Pass/Fail)

### Test Suite

```typescript
describe('Dashboard System', () => {
  
  test('Webhook increments booking count', async () => {
    const before = await getState();
    
    await fetch('/api/webhooks/calendly', {
      method: 'POST',
      headers: { 'X-Calendly-Signature': validSignature },
      body: JSON.stringify({ event: 'invitee.created' })
    });
    
    await sleep(100); // Allow async processing
    const after = await getState();
    
    expect(after.bookedAppointments).toBe(before.bookedAppointments + 1);
  });
  
  test('SSE pushes update within 1s', async () => {
    const eventSource = new EventSource('/api/stream');
    const received = new Promise(resolve => {
      eventSource.addEventListener('message', (e) => {
        const { type } = JSON.parse(e.data);
        if (type === 'state:update') resolve(true);
      });
    });
    
    await fetch('/api/webhooks/calendly', { /* trigger update */ });
    
    const updated = await Promise.race([
      received,
      sleep(1000).then(() => false)
    ]);
    
    expect(updated).toBe(true);
  });
  
  test('Revenue autopilot computes correctly', async () => {
    const state = await getState();
    const expected = state.bookedAppointments * state.valuePerBooking;
    expect(state.revenueAutopilot).toBe(expected);
  });
  
  test('Booking rate calculates correctly', async () => {
    await updateState({ websiteClicks: 1000, bookedAppointments: 50 });
    const state = await getState();
    expect(state.bookingRate).toBe(5); // 50/1000 = 5%
  });
  
  test('Admin requires password', async () => {
    const res = await fetch('/admin');
    expect(res.status).toBe(401);
    
    const authed = await fetch('/admin', {
      headers: { 'Authorization': 'Basic ' + btoa(':wrong') }
    });
    expect(authed.status).toBe(401);
  });
  
  test('No inline styles in output', async () => {
    const html = await fetch('/dashboard').then(r => r.text());
    expect(html).not.toMatch(/style="[^"]*"/);
    expect(html).not.toMatch(/#[0-9a-f]{6}/i);
  });
  
  test('WCAG AA contrast ratios', () => {
    const primary = '#293919';
    const white = '#ffffff';
    const contrast = getContrastRatio(primary, white);
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
  
  test('Animations respect reduced motion', () => {
    const css = fs.readFileSync('/styles/dashboard.css', 'utf-8');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });
  
  test('Lighthouse scores meet targets', async () => {
    const report = await lighthouse('/dashboard', { formFactor: 'mobile' });
    expect(report.performance).toBeGreaterThanOrEqual(90);
    expect(report.seo).toBeGreaterThanOrEqual(90);
    expect(report.accessibility).toBeGreaterThanOrEqual(95);
  });
});
```

## 10. Handoff Kit for Cursor

### File Tree

```
/
├── app/
│   ├── dashboard/
│   │   └── page.tsx                  # Public dashboard view
│   ├── admin/
│   │   └── page.tsx                  # Admin panel (password-gated)
│   └── api/
│       ├── webhooks/
│       │   └── calendly/
│       │       └── route.ts          # POST webhook receiver
│       ├── state/
│       │   └── route.ts              # GET current state
│       ├── stream/
│       │   └── route.ts              # GET SSE stream
│       └── admin/
│           ├── login/
│           │   └── route.ts          # POST login
│           └── update/
│               └── route.ts          # PATCH update metrics
│
├── components/
│   ├── brand/
│   │   ├── BrandCard.tsx
│   │   ├── BrandButton.tsx
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── MetricTile.tsx
│   │   ├── FlipNumber.tsx
│   │   ├── MoneyTicker.tsx
│   │   └── DashboardGrid.tsx
│   └── admin/
│       ├── MetricsEditor.tsx
│       ├── AuditLog.tsx
│       └── QuickActions.tsx
│
├── lib/
│   ├── store/
│   │   ├── FileStore.ts              # JSON file persistence
│   │   ├── RedisStore.ts             # Future: Redis adapter
│   │   └── index.ts                  # Store interface
│   ├── webhooks/
│   │   ├── verify.ts                 # HMAC signature verification
│   │   └── handlers.ts               # Event handlers
│   ├── sse/
│   │   └── broadcast.ts              # SSE client management
│   └── audit/
│       └── logger.ts                 # Audit log writer
│
├── tokens/
│   └── stella-brand.json             # Brand design tokens
│
├── styles/
│   └── dashboard.css                 # Dashboard-specific styles
│
├── scripts/
│   ├── brandguard.mjs                # Linter for hardcoded styles
│   └── seed.mjs                      # Seed test data
│
├── outputs/
│   └── dashboard/
│       ├── state.json                # Persistent state
│       ├── audit.log                 # Change log
│       └── .lock                     # File lock
│
├── .env.sample
├── .env.local                        # Gitignored
└── README.md
```

### Component List

| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| BrandCard | /components/brand/BrandCard.tsx | Wrapper card with shadow | variant, children |
| BrandButton | /components/brand/BrandButton.tsx | Styled button | variant, size, onClick |
| MetricTile | /components/dashboard/MetricTile.tsx | Metric display card | label, value, trend, icon |
| FlipNumber | /components/dashboard/FlipNumber.tsx | Animated counter | value, duration |
| MoneyTicker | /components/dashboard/MoneyTicker.tsx | $ increment animation | value, currency, duration |
| DashboardGrid | /components/dashboard/DashboardGrid.tsx | Responsive grid layout | children |
| MetricsEditor | /components/admin/MetricsEditor.tsx | Admin edit form | state, onUpdate |
| AuditLog | /components/admin/AuditLog.tsx | Recent changes table | entries |
| QuickActions | /components/admin/QuickActions.tsx | Admin action buttons | onRecalculate, onTest, onReset |

### API Contracts

**GET /api/state**
```json
// Response 200
{
  "bookedAppointments": 42,
  "valuePerBooking": 100,
  "revenueAutopilot": 4200,
  "websiteClicks": 1500,
  "bookingRate": 2.8,
  "estimatedRevenueForClient": 10000,
  "updatedAt": "2025-10-05T15:30:00Z"
}
```

**POST /api/webhooks/calendly**
```json
// Request
{
  "event": "invitee.created",
  "payload": { /* Calendly payload */ }
}

// Response 200
{ "received": true }

// Response 401 (Invalid signature)
{ "error": "Invalid signature" }

// Response 429 (Rate limit)
{ "error": "Too many requests" }
```

**GET /api/stream**
```
data: {"type":"state:update","state":{...}}

data: {"type":"ping"}
```

**PATCH /api/admin/update**
```json
// Request (requires auth)
{
  "field": "websiteClicks",
  "value": 2000
}

// Response 200
{ "success": true, "state": {...} }

// Response 400 (Validation error)
{ "error": "Value must be non-negative" }

// Response 401 (Unauthorized)
{ "error": "Authentication required" }
```

### Environment Variables

**.env.sample**
```bash
# Calendly Webhook
CALENDLY_WEBHOOK_SECRET=your_webhook_secret_here

# Admin Access
ADMIN_PASSWORD=secure_password_here

# Optional Overrides
VALUE_PER_BOOKING=100
ALLOWED_IPS=  # CSV of allowed IPs (optional)

# Environment
NODE_ENV=development
PORT=3000
```

### Seed Script

**scripts/seed.mjs**
```javascript
#!/usr/bin/env node

import fs from 'fs/promises';

const initialState = {
  bookedAppointments: 0,
  valuePerBooking: 100,
  revenueAutopilot: 0,
  websiteClicks: 0,
  bookingRate: 0,
  estimatedRevenueForClient: 0,
  updatedAt: new Date().toISOString()
};

await fs.mkdir('./outputs/dashboard', { recursive: true });
await fs.writeFile(
  './outputs/dashboard/state.json',
  JSON.stringify(initialState, null, 2)
);

console.log('✅ Seeded initial state');
```

## Build Plan (Step-by-Step)

### Phase 1: Foundation (1-2 hours)
1. Create file structure
2. Set up brand tokens (/tokens/stella-brand.json)
3. Create BrandCard, BrandButton components
4. Implement FileStore persistence
5. Create initial state.json with seed script

### Phase 2: API Routes (2-3 hours)
6. Implement GET /api/state (read from FileStore)
7. Implement POST /api/webhooks/calendly (HMAC verification + increment)
8. Implement GET /api/stream (SSE broadcast setup)
9. Implement PATCH /api/admin/update (auth + validation)
10. Add rate limiting middleware

### Phase 3: Dashboard UI (2-3 hours)
11. Create FlipNumber component with animations
12. Create MoneyTicker component
13. Create MetricTile component
14. Build /dashboard page with SSE subscription
15. Add responsive grid layout

### Phase 4: Admin Panel (1-2 hours)
16. Implement session-based auth
17. Create MetricsEditor form component
18. Create AuditLog table component
19. Build /admin page
20. Add quick action buttons (test webhook, reset, recalculate)

### Phase 5: Testing & Polish (2-3 hours)
21. Run BrandGuard linter
22. Add WCAG AA focus indicators
23. Test reduced motion support
24. Run Lighthouse audit
25. Write acceptance tests
26. Test webhook flow end-to-end

**Total Estimate: 8-13 hours**

## Review Rubric for Cursor

### Brand Compliance (Pass/Fail)
- [ ] No inline styles (style="...") anywhere in JSX/HTML
- [ ] No hardcoded colors (hex codes, rgb(), named colors except in tokens file)
- [ ] No hardcoded fonts (font-family declarations outside tokens)
- [ ] No hardcoded shadows (box-shadow values outside tokens)
- [ ] All components use var(--*) CSS custom properties or Tailwind theme
- [ ] BrandGuard script runs clean (node scripts/brandguard.mjs)

### Accessibility (Pass/Fail)
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus indicators visible (3px ring, high contrast)
- [ ] ARIA labels on all icons and counters (aria-label, aria-live)
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI (WCAG AA)
- [ ] Reduced motion support (@media (prefers-reduced-motion: reduce))
- [ ] Screen reader announcements for dynamic updates (aria-live="polite")
- [ ] Semantic HTML (proper headings, landmarks, forms)

### Performance (Pass/Fail)
- [ ] Lighthouse mobile scores: Perf ≥ 90, SEO ≥ 90, A11y ≥ 95
- [ ] No layout shift (CLS < 0.1)
- [ ] Fast initial load (LCP < 2.5s)
- [ ] SSE connection established within 500ms
- [ ] Dashboard updates within 1s of webhook POST
- [ ] Animations run at 60fps (use transform, not top/left)

### Security (Pass/Fail)
- [ ] Webhook signature verified (HMAC SHA256)
- [ ] Admin password required (401 if missing/wrong)
- [ ] No secrets rendered to client (check View Source)
- [ ] Rate limiting active (100 req/min per IP)
- [ ] IP whitelist enforced (if ALLOWED_IPS set)
- [ ] Session timeout (1 hour max)
- [ ] HTTPS only cookies (Secure, HttpOnly, SameSite=Strict)

### Functionality (Pass/Fail)
- [ ] Webhook increments booking count correctly
- [ ] Revenue autopilot computes as bookings * valuePerBooking
- [ ] Booking rate computes as bookings / clicks * 100
- [ ] SSE broadcast pushes updates to all connected clients
- [ ] Polling fallback works if SSE unavailable
- [ ] Admin edits persist and recalculate derived metrics
- [ ] Audit log records all changes with timestamp/user/field
- [ ] File locking prevents concurrent write corruption

### Code Quality (Pass/Fail)
- [ ] TypeScript strict mode enabled
- [ ] No any types (use proper types or unknown)
- [ ] Error handling on all async operations (try/catch)
- [ ] Validation on all user inputs (non-negative, integers)
- [ ] Audit trail appends to log file (not console.log)
- [ ] Comments on complex logic only (self-documenting code preferred)
- [ ] Consistent naming (camelCase vars, PascalCase components)

## Checklist for Cursor

### Before You Start
- [ ] Read /tokens/stella-brand.json to understand brand tokens
- [ ] Review /outputs/calculator/HANDOFF-TO-CURSOR.md for import patterns
- [ ] Run node scripts/seed.mjs to create initial state file
- [ ] Copy .env.sample to .env.local and fill in secrets

### During Build
- [ ] Use BrandCard, BrandButton from /components/brand/
- [ ] Import colors/fonts from tokens only (no hardcoded values)
- [ ] Add aria-live="polite" to counters for screen readers
- [ ] Test SSE connection in browser DevTools (Network → EventStream)
- [ ] Verify webhook signature before processing events
- [ ] Log all admin changes to /outputs/dashboard/audit.log

### Before Submitting
- [ ] Run node scripts/brandguard.mjs (must pass)
- [ ] Run acceptance tests (all must pass)
- [ ] Test on mobile viewport (responsive grid, no horizontal scroll)
- [ ] Test with reduced motion enabled (animations disabled)
- [ ] Test admin login with wrong password (should deny)
- [ ] Test webhook with invalid signature (should reject)
- [ ] Run Lighthouse audit (Perf/SEO/A11y ≥ 90/90/95)

### Final Review
- [ ] All API routes return proper status codes (200/400/401/429)
- [ ] Dashboard updates in real-time when webhook fires
- [ ] Animations are smooth and respect accessibility settings
- [ ] No console errors in browser or server logs
- [ ] State persists correctly after restart
- [ ] Audit log contains all changes with timestamps

---

**PRD Complete. Architecture locked. Ready for Cursor implementation.**  
**Estimated build time: 8-13 hours**  
**Complexity: Medium**  
**Risk: Low (well-defined scope, proven patterns)**
