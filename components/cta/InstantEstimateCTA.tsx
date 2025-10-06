/**
 * InstantEstimateCTA - Brand-styled link component for calculator entry points
 * 
 * This component creates styled CTAs that link to /pricing/instant-quote
 * with proper src parameters for analytics tracking.
 * 
 * DO NOT import calculator components - this is link-only.
 */

import React from 'react';

interface InstantEstimateCTAProps {
  /** Source parameter for analytics tracking */
  src: string;
  /** CTA text variant (A/B tested) */
  variant?: 'A' | 'B';
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Additional CSS classes */
  className?: string;
  /** Analytics event data */
  analyticsData?: {
    page?: string;
    anchor?: string;
    section?: string;
  };
  /** Children content (optional) */
  children?: React.ReactNode;
}

export default function InstantEstimateCTA({
  src,
  variant = 'A',
  size = 'medium',
  className = '',
  analyticsData = {},
  children
}: InstantEstimateCTAProps) {
  
  // Get CTA text from A/B variant
  const ctaText = variant === 'A' ? 'Get Instant Estimate' : 'See Your Price Now';
  
  // Build analytics event data
  const eventData = {
    page: analyticsData.page || 'unknown',
    anchor: analyticsData.anchor || 'unknown',
    src: src,
    ...analyticsData
  };
  
  // Handle click analytics
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quote_entry_click', eventData);
    }
  };
  
  // Size-based CSS classes
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn',
    large: 'btn-lg'
  };
  
  // Build final URL with src parameter
  const href = `/pricing/instant-quote?src=${encodeURIComponent(src)}`;
  
  return (
    <a
      href={href}
      className={`btn btn-primary ${sizeClasses[size]} instant-estimate-cta ${className}`}
      onClick={handleClick}
      data-src={src}
      data-analytics={JSON.stringify(eventData)}
      aria-label={`${ctaText} - Opens instant pricing calculator`}
    >
      {children || (
        <>
          <span className="cta-text">{ctaText}</span>
          <span className="instant-badge">Instant</span>
        </>
      )}
    </a>
  );
}

// Export types for TypeScript
export type { InstantEstimateCTAProps };
