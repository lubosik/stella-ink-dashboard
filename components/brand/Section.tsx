import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'full';
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}) => {
  const baseStyles = 'w-full';
  const variantStyles = {
    default: 'max-w-7xl mx-auto px-lg',
    centered: 'max-w-4xl mx-auto px-lg text-center',
    full: 'w-full px-lg',
  };

  return (
    <section 
      className={cn(baseStyles, variantStyles[variant], className)} 
      {...props}
    >
      {children}
    </section>
  );
};

export { Section };
