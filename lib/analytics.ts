// Analytics utility for tracking dashboard events
export interface AnalyticsEvent {
  event: string;
  [key: string]: any;
}

// Track events to window.dataLayer if available (Google Analytics)
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(event);
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
}

// Predefined event types for consistency
export const AnalyticsEvents = {
  dashboardView: () => trackEvent({
    event: 'dashboard_view',
    timestamp: new Date().toISOString(),
  }),
  
  adminLogin: (status: 'success' | 'failure', error?: string) => trackEvent({
    event: 'admin_login',
    status,
    error,
    timestamp: new Date().toISOString(),
  }),
  
  adminSave: (field: string, newValue: any) => trackEvent({
    event: 'admin_save',
    field,
    newValue,
    timestamp: new Date().toISOString(),
  }),
  
  webhookReceived: (eventType: string, status: 'success' | 'failure') => trackEvent({
    event: 'webhook_received',
    eventType,
    status,
    timestamp: new Date().toISOString(),
  }),
  
  stateUpdate: (field: string, oldValue: any, newValue: any) => trackEvent({
    event: 'state_update',
    field,
    oldValue,
    newValue,
    timestamp: new Date().toISOString(),
  }),
  
  adminTestWebhook: (status: 'success' | 'failure', error?: string) => trackEvent({
    event: 'admin_test_webhook',
    status,
    error,
    timestamp: new Date().toISOString(),
  }),
  
  adminReset: (status: 'success' | 'failure', error?: string) => trackEvent({
    event: 'admin_reset',
    status,
    error,
    timestamp: new Date().toISOString(),
  }),
} as const;
