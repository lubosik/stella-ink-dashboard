import React from 'react';
import { cn } from '@/lib/utils';

interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg';
}

const Prose: React.FC<ProseProps> = ({ 
  children, 
  className, 
  size = 'base',
  ...props 
}) => {
  const baseStyles = 'prose prose-neutral max-w-none';
  const sizeStyles = {
    sm: 'prose-sm',
    base: 'prose-base',
    lg: 'prose-lg',
  };

  return (
    <div 
      className={cn(baseStyles, sizeStyles[size], className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Prose;
