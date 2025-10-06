import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const brandCardVariants = cva(
  'rounded-xl border bg-white shadow-card',
  {
    variants: {
      variant: {
        flat: 'shadow-none border-neutral-200',
        elevated: 'shadow-elevated border-neutral-200',
      },
    },
    defaultVariants: {
      variant: 'flat',
    },
  }
);

export interface BrandCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brandCardVariants> {}

export function BrandCard({ className, variant, ...props }: BrandCardProps) {
  return (
    <div
      className={cn(brandCardVariants({ variant }), className)}
      {...props}
    />
  );
}
