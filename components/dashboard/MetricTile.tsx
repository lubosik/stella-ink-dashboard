import React from 'react';
import { BrandCard } from '@/components/brand/BrandCard';
import { FlipNumber } from './FlipNumber';
import { MoneyTicker } from './MoneyTicker';
import { cn } from '@/lib/utils';

interface MetricTileProps {
  label: string;
  value: number;
  trend?: string;
  icon?: React.ReactNode;
  type?: 'number' | 'money' | 'percentage';
  className?: string;
}

export function MetricTile({ 
  label, 
  value, 
  trend, 
  icon, 
  type = 'number',
  className 
}: MetricTileProps) {
  const renderValue = () => {
    switch (type) {
      case 'money':
        return <MoneyTicker value={value} />;
      case 'percentage':
        return (
          <div className="font-bold text-4xl text-primary" aria-live="polite" role="status">
            <span className="sr-only">Percentage: {value.toFixed(1)}%</span>
            {value.toFixed(1)}%
          </div>
        );
      default:
        return <FlipNumber value={value} />;
    }
  };

  return (
    <BrandCard variant="elevated" className={cn('p-6', className)}>
      <div className="metric-tile">
        <div className="metric-tile__header flex items-center gap-3 mb-4">
          {icon && (
            <div className="text-primary">
              {icon}
            </div>
          )}
          <span className="metric-tile__label text-neutral-600 font-medium text-lg">
            {label}
          </span>
        </div>
        
        <div className="metric-tile__value">
          {renderValue()}
          {trend && (
            <span className="metric-tile__trend ml-2 text-sm text-success font-medium">
              +{trend}
            </span>
          )}
        </div>
      </div>
    </BrandCard>
  );
}
