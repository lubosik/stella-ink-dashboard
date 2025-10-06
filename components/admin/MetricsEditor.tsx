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
  const [formData, setFormData] = React.useState({
    websiteClicks: state.websiteClicks,
    valuePerBooking: state.valuePerBooking,
    estimatedRevenueForClient: state.estimatedRevenueForClient,
    bookedAppointments: state.bookedAppointments,
  });

  // Update form data when state changes
  React.useEffect(() => {
    setFormData({
      websiteClicks: state.websiteClicks,
      valuePerBooking: state.valuePerBooking,
      estimatedRevenueForClient: state.estimatedRevenueForClient,
      bookedAppointments: state.bookedAppointments,
    });
  }, [state]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await Promise.all([
        onUpdate('websiteClicks', formData.websiteClicks),
        onUpdate('valuePerBooking', formData.valuePerBooking),
        onUpdate('estimatedRevenueForClient', formData.estimatedRevenueForClient),
        onUpdate('bookedAppointments', formData.bookedAppointments),
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
              value={formData.websiteClicks}
              onChange={(e) => handleInputChange('websiteClicks', e.target.value)}
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
              value={formData.valuePerBooking}
              onChange={(e) => handleInputChange('valuePerBooking', e.target.value)}
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
              value={formData.estimatedRevenueForClient}
              onChange={(e) => handleInputChange('estimatedRevenueForClient', e.target.value)}
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
              value={formData.bookedAppointments}
              onChange={(e) => handleInputChange('bookedAppointments', e.target.value)}
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
