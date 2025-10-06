'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsEvents } from '@/lib/analytics';
import { DashboardState } from '@/lib/state/store';
import { BrandCard } from '@/components/brand/BrandCard';
import { MetricsEditor } from '@/components/admin/MetricsEditor';
import { AuditLog } from '@/components/admin/AuditLog';
import { AuditEntry } from '@/lib/audit/logger';
import { BrandButton } from '@/components/brand/BrandButton';
import { Section } from '@/components/brand/Section';
import Link from 'next/link';

const AdminPage: React.FC = () => {
  const [dashboardState, setDashboardState] = useState<DashboardState | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session or prompt for password
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth-check');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        AnalyticsEvents.adminLogin('success');
      } else {
        const errorData = await res.json();
        setAuthError(errorData.error || 'Authentication failed.');
        AnalyticsEvents.adminLogin('failure', errorData.error || 'Authentication failed.');
      }
    } catch (error) {
      setAuthError('Network error during login.');
      AnalyticsEvents.adminLogin('failure', 'Network error');
    }
  };

  const refreshState = async () => {
    try {
      const [stateRes, auditRes] = await Promise.all([
        fetch('/api/state'),
        fetch('/api/admin/audit-log')
      ]);
      
      if (stateRes.ok) {
        setDashboardState(await stateRes.json());
      }
      
      if (auditRes.ok) {
        setAuditLog((await auditRes.json()).slice(-10));
      }
    } catch (error) {
      console.error('Failed to refresh state:', error);
    }
  };

  const handleUpdateMetric = async (field: keyof DashboardState, value: number) => {
    try {
      const res = await fetch('/api/admin/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardState(data.state);
        // Re-fetch audit log to get the latest entry
        const auditRes = await fetch('/api/admin/audit-log');
        if (auditRes.ok) {
          const newAuditLog = await auditRes.json();
          setAuditLog(newAuditLog.slice(-10)); // Keep last 10
        }
        // Analytics event for admin save
        AnalyticsEvents.adminSave(field, value);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update metric.');
      }
    } catch (error: any) {
      console.error('Error updating metric:', error);
      throw error;
    }
  };

  const handleTestWebhook = async () => {
    try {
      // Use the new booking API instead of Calendly webhook
      const testBookingData = {
        event: 'booking_created',
        bookingId: `test-${Date.now()}`,
        clientName: 'Test Client',
        clientEmail: 'test@example.com',
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: '10:00',
        serviceType: 'Consultation',
        notes: 'Test booking from admin panel'
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'QjLA4c46CL879xQ5WhUrgli3e2ZphQVA'
        },
        body: JSON.stringify(testBookingData),
      });
      
      if (res.ok) {
        const result = await res.json();
        alert(`Test booking created successfully!\nClient: ${result.clientName}\nBooking ID: ${result.bookingId}`);
        
        // Re-fetch state and audit log
        await refreshState();
        AnalyticsEvents.adminTestWebhook('success');
      } else {
        const errorData = await res.json();
        alert(`Failed to send test booking: ${errorData.error || res.statusText}`);
        AnalyticsEvents.adminTestWebhook('failure', errorData.error || res.statusText);
      }
    } catch (error) {
      alert('Network error during test booking.');
      AnalyticsEvents.adminTestWebhook('failure', 'Network error');
    }
  };

  const handleRecalculate = async () => {
    try {
      const res = await fetch('/api/admin/recalculate', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardState(data.state);
        alert('Metrics recalculated successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to recalculate: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      alert('Network error during recalculation.');
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all dashboard metrics to zero? This cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
      });
      if (res.ok) {
        await refreshState();
        alert('Dashboard state reset to zero!');
        AnalyticsEvents.adminReset('success');
      } else {
        const errorData = await res.json();
        alert(`Failed to reset state: ${errorData.error || res.statusText}`);
        AnalyticsEvents.adminReset('failure', errorData.error || res.statusText);
      }
    } catch (error) {
      alert('Network error during reset state.');
      AnalyticsEvents.adminReset('failure', 'Network error');
    }
  };

  const handleResetState = async () => {
    if (!confirm('Are you sure you want to reset all dashboard metrics to zero? This cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
      });
      if (res.ok) {
        await refreshState();
        alert('Dashboard state reset to zero!');
        AnalyticsEvents.adminReset('success');
      } else {
        const errorData = await res.json();
        alert(`Failed to reset state: ${errorData.error || res.statusText}`);
        AnalyticsEvents.adminReset('failure', errorData.error || res.statusText);
      }
    } catch (error) {
      alert('Network error during reset state.');
      AnalyticsEvents.adminReset('failure', 'Network error');
    }
  };

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshState();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Section variant="centered" className="max-w-md">
          <BrandCard variant="elevated" className="w-full text-center">
            <h2 className="text-2xl font-heading text-neutral-900 mb-lg">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-md">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
              {authError && <p className="text-error text-sm">{authError}</p>}
              <BrandButton type="submit" size="lg">
                Login
              </BrandButton>
            </form>
          </BrandCard>
        </Section>
      </div>
    );
  }

  if (!dashboardState) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-body text-neutral-900">
      <Section className="py-xl">
        <div className="flex items-center justify-between mb-xl">
          <h1 className="text-4xl font-heading text-neutral-900">Admin Panel</h1>
          <Link href="/dashboard">
            <BrandButton variant="secondary" size="md">
              ← Back to Dashboard
            </BrandButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <BrandCard variant="elevated">
            <MetricsEditor state={dashboardState} onUpdate={handleUpdateMetric} onRecalculate={handleRecalculate} onTestWebhook={handleTestWebhook} onReset={handleReset} />
          </BrandCard>

          <div className="space-y-lg">
            <BrandCard variant="elevated">
              <h3 className="text-xl font-heading text-neutral-900 mb-lg">Quick Actions</h3>
              <div className="flex flex-col space-y-md">
                <BrandButton onClick={handleTestWebhook} variant="secondary" size="md">
                  Test Booking API
                </BrandButton>
                <BrandButton onClick={handleResetState} variant="secondary" size="md">
                  Reset All Metrics to Zero
                </BrandButton>
              </div>
            </BrandCard>

            <AuditLog entries={auditLog} />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AdminPage;