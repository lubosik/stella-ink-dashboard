import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MoneyTickerProps {
  value: number;
  currency?: string;
  duration?: number;
  className?: string;
}

export function MoneyTicker({ value, currency = 'CAD', duration = 1000, className }: MoneyTickerProps) {
  const [displayedValue, setDisplayedValue] = useState(value);

  useEffect(() => {
    const start = displayedValue;
    const delta = value - start;
    const startTime = performance.now();
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setDisplayedValue(Math.round(start + delta * easeOutCubic));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span 
      className={cn('font-bold text-3xl text-success', className)}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <span className="sr-only">Revenue: ${displayedValue.toLocaleString()}</span>
      ${displayedValue.toLocaleString()}
    </span>
  );
}
