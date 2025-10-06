import React from 'react';
import { BrandCard } from '@/components/brand/BrandCard';
import { BrandButton } from '@/components/brand/BrandButton';
import { DashboardState } from '@/lib/state/store';

interface MetricsEditorProps {
  state: DashboardState;
  onUpdate: (field: keyof DashboardState, value: number) => Promise<void>;
  onRecalculate: () => Promise<void>;
  onTestWebhook: () => Promise<void>;
  onReset: () => Promise<void>;
}

export function MetricsEditor({ 
  state, 
  onUpdate, 
  onRecalculate, 
  onTestWebhook, 
  onReset 
}: MetricsEditorProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const websiteClicks = parseInt(formData.get('websiteClicks') as string);
      const valuePerBooking = parseInt(formData.get('valuePerBooking') as string);
      const estimatedRevenueForClient = parseInt(formData.get('estimatedRevenueForClient') as string);
      const bookedAppointments = parseInt(formData.get('bookedAppointments') as string);

      await Promise.all([
        onUpdate('websiteClicks', websiteClicks),
        onUpdate('valuePerBooking', valuePerBooking),
        onUpdate('estimatedRevenueForClient', estimatedRevenueForClient),
        onUpdate('bookedAppointments', bookedAppointments),
      ]);
    } catch (error) {
      console.error('Failed to update metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrandCard variant="elevated" className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Metrics Editor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="websiteClicks" className="block text-sm font-medium text-neutral-600 mb-1">
              Website Clicks
            </label>
            <input
              type="number"
              id="websiteClicks"
              name="websiteClicks"
              defaultValue={state.websiteClicks}
              min="0"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="valuePerBooking" className="block text-sm font-medium text-neutral-600 mb-1">
              Value Per Booking (CAD)
            </label>
            <input
              type="number"
              id="valuePerBooking"
              name="valuePerBooking"
              defaultValue={state.valuePerBooking}
              min="0"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="estimatedRevenueForClient" className="block text-sm font-medium text-neutral-600 mb-1">
              Estimated Revenue for Stella (CAD)
            </label>
            <input
              type="number"
              id="estimatedRevenueForClient"
              name="estimatedRevenueForClient"
              defaultValue={state.estimatedRevenueForClient}
              min="0"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="bookedAppointments" className="block text-sm font-medium text-neutral-600 mb-1">
              Booked Appointments (Manual Adjust)
            </label>
            <input
              type="number"
              id="bookedAppointments"
              name="bookedAppointments"
              defaultValue={state.bookedAppointments}
              min="0"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <BrandButton type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </BrandButton>
          
          <BrandButton type="button" variant="secondary" onClick={onRecalculate}>
            Recalculate All
          </BrandButton>
          
          <BrandButton type="button" variant="secondary" onClick={onTestWebhook}>
            Test Webhook
          </BrandButton>
          
          <BrandButton type="button" variant="danger" onClick={onReset}>
            Reset to Zero
          </BrandButton>
        </div>
      </form>
    </BrandCard>
  );
}
