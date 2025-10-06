import React, { useState, useEffect } from 'react';
import { BrandCard } from '@/components/brand/BrandCard';
import { cn } from '@/lib/utils';

interface FlipNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function FlipNumber({ value, duration = 600, className }: FlipNumberProps) {
  const [displayedValue, setDisplayedValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayedValue !== value) {
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setDisplayedValue(value);
        setIsAnimating(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [value, duration]);

  return (
    <div 
      className={cn(
        'flip-number font-bold text-4xl text-primary',
        isAnimating && 'animate-flip',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <span className="sr-only">Count: {displayedValue}</span>
      {displayedValue.toLocaleString()}
    </div>
  );
}
