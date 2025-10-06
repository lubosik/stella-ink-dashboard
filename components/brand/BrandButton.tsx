import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const brandButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-elevated',
        secondary: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
        danger: 'bg-error text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-elevated',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandButtonVariants> {}

export function BrandButton({ className, variant, size, ...props }: BrandButtonProps) {
  return (
    <button
      className={cn(brandButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
