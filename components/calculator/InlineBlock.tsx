'use client';

/**
 * InlineBlock - Wrapper for embedding calculator inline with lead-in copy
 * Includes "Instant" badge and contextual messaging
 */

import React from 'react';
import InstantQuote from './InstantQuote';

export interface InlineBlockProps {
  variant?: 'guide' | 'resource' | 'city' | 'sidebar' | 'sticky';
  prefill?: {
    topic?: 'women' | 'alopecia' | 'scars' | 'hairline' | 'safety' | 'vs' | 'cost' | 'longevity';
    city?: string;
  };
  leadIn?: string;
  showBadge?: boolean;
  className?: string;
  onOpen?: () => void;
}

const DEFAULT_LEAD_INS = {
  guide: 'Most clients want a ballpark now — get yours in seconds.',
  resource: 'No waiting. Get your SMP estimate instantly.',
  city: 'See your estimate now — then book a consult for a firm quote.',
  sidebar: 'Get your instant price estimate',
  sticky: 'Quick estimate available now'
};

export default function InlineBlock({
  variant = 'guide',
  prefill,
  leadIn,
  showBadge = true,
  className = '',
  onOpen
}: InlineBlockProps) {
  const displayLeadIn = leadIn || DEFAULT_LEAD_INS[variant];

  return (
    <div className={`inline-block inline-block--${variant} ${className}`}>
      <div className="inline-block__header">
        {showBadge && (
          <span className="inline-block__badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 1l2.5 5 5.5.5-4 4 1 5.5L8 13l-5 3 1-5.5-4-4 5.5-.5L8 1z"/>
            </svg>
            Instant
          </span>
        )}
        <h3 className="inline-block__title">Get Your Personalized SMP Estimate</h3>
      </div>
      
      {displayLeadIn && (
        <p className="inline-block__lead-in">{displayLeadIn}</p>
      )}

      <div className="inline-block__calculator">
        <InstantQuote 
          variant="inline"
          onComplete={() => {
            if (onOpen) onOpen();
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'quote_widget_open', {
                event_category: 'calculator',
                event_label: variant,
                prefill_topic: prefill?.topic,
                prefill_city: prefill?.city
              });
            }
          }}
        />
      </div>

      <p className="inline-block__disclaimer">
        This is an estimate based on your answers. Final price follows a short consultation.
      </p>
    </div>
  );
}
