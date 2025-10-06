'use client';

import React, { useEffect, useState } from 'react';
import { DashboardState } from '@/lib/state/store';
import { AnalyticsEvents } from '@/lib/analytics';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { MetricTile } from '@/components/dashboard/MetricTile';
import { FlipNumber } from '@/components/dashboard/FlipNumber';
import { MoneyTicker } from '@/components/dashboard/MoneyTicker';
import { Section } from '@/components/brand/Section';
import { BrandButton } from '@/components/brand/BrandButton';
import { CalendarDays, DollarSign, TrendingUp, Target, Settings } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [dashboardState, setDashboardState] = useState<DashboardState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track dashboard view
    AnalyticsEvents.dashboardView();

    // Fetch initial state
    const fetchInitialState = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const state: DashboardState = await res.json();
          setDashboardState(state);
        }
      } catch (error) {
        console.error('Failed to fetch initial state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialState();

    // Set up SSE connection
    const eventSource = new EventSource('/api/stream');

    eventSource.onopen = () => {
      console.log('SSE connection opened.');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const { type, state } = JSON.parse(event.data);
      if (type === 'state:update') {
        setDashboardState(state);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      setIsConnected(false);

      // Fallback to polling if SSE fails
      console.log('Falling back to polling...');
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/state');
          if (res.ok) {
            const state: DashboardState = await res.json();
            setDashboardState(state);
            setIsConnected(true); // Re-establish connection status if polling works
          } else {
            setIsConnected(false);
          }
        } catch (pollError) {
          console.error('Polling error:', pollError);
          setIsConnected(false);
        }
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(pollInterval);
    };

    return () => {
      eventSource.close();
      console.log('SSE connection closed on unmount.');
    };
  }, []);

  if (isLoading || !dashboardState) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-body text-neutral-900">
      <Section className="py-xl">
        <div className="flex justify-between items-start mb-xl">
          <h1 className="text-4xl font-heading text-neutral-900">
            Live Consultations Dashboard
          </h1>
          <BrandButton
            variant="secondary"
            size="md"
            onClick={() => window.location.href = '/admin'}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            Admin Panel
          </BrandButton>
        </div>

        <div className="flex items-center text-sm text-neutral-600 mb-lg">
          <span
            className={`relative flex h-2 w-2 rounded-full ${
              isConnected ? 'bg-success' : 'bg-accent'
            }`}
          >
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isConnected ? 'bg-success' : 'bg-accent'
              } opacity-75`}
            ></span>
          </span>
          <span className="ml-2" aria-live="polite">
            Connection: {isConnected ? 'Live' : 'Disconnected (polling active)'}
          </span>
        </div>

        <DashboardGrid>
          <MetricTile
            label="Booked Appointments"
            value={dashboardState.bookedAppointments}
            icon={<CalendarDays size={20} />}
          />
          <MetricTile
            label="Revenue Autopilot"
            value={dashboardState.revenueAutopilot}
            type="money"
            icon={<DollarSign size={20} />}
          />
          <MetricTile
            label="Consultation Booking Rate"
            value={dashboardState.bookingRate}
            type="percentage"
            icon={<TrendingUp size={20} />}
          />
          <MetricTile
            label="Estimated Revenue for Stella"
            value={dashboardState.estimatedRevenueForClient}
            type="money"
            icon={<Target size={20} />}
          />
        </DashboardGrid>
      </Section>
    </div>
  );
};

export default DashboardPage;
