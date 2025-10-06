import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div 
      className={cn(
        'dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
