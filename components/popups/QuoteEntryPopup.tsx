/**
 * QuoteEntryPopup - Site-wide popup for calculator entry
 * 
 * This component creates a popup that links to /pricing/instant-quote
 * with proper trigger conditions and suppression logic.
 * 
 * DO NOT import calculator components - this is link-only.
 */

import React, { useState, useEffect, useRef } from 'react';

interface QuoteEntryPopupProps {
  /** Context for analytics tracking */
  context: string;
  /** Trigger conditions from experiments config */
  triggerConfig?: {
    scroll60?: boolean;
    exitIntent?: boolean;
    dwell20s?: boolean;
  };
  /** Suppression settings */
  suppressionConfig?: {
    hours: number;
    storageKey: string;
  };
  /** A/B variant */
  variant?: 'A' | 'B';
}

export default function QuoteEntryPopup({
  context,
  triggerConfig = {
    scroll60: true,
    exitIntent: true,
    dwell20s: true
  },
  suppressionConfig = {
    hours: 24,
    storageKey: 'stella_quote_popup_suppressed'
  },
  variant = 'A'
}: QuoteEntryPopupProps) {
  
  const [isVisible, setIsVisible] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);
  const scrollTriggered = useRef(false);
  const dwellTimer = useRef<NodeJS.Timeout | null>(null);
  const exitIntentTriggered = useRef(false);
  
  // Check suppression on mount
  useEffect(() => {
    const checkSuppression = () => {
      try {
        const suppressed = localStorage.getItem(suppressionConfig.storageKey);
        if (suppressed) {
          const suppressedTime = parseInt(suppressed);
          const hoursSinceSuppression = (Date.now() - suppressedTime) / (1000 * 60 * 60);
          
          if (hoursSinceSuppression < suppressionConfig.hours) {
            setIsSuppressed(true);
            return;
          } else {
            // Suppression expired, remove from storage
            localStorage.removeItem(suppressionConfig.storageKey);
          }
        }
      } catch (error) {
        console.warn('Could not check popup suppression:', error);
      }
    };
    
    checkSuppression();
  }, [suppressionConfig]);
  
  // Scroll trigger (60% scroll)
  useEffect(() => {
    if (!triggerConfig.scroll60 || isSuppressed) return;
    
    const handleScroll = () => {
      if (scrollTriggered.current) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      
      if (scrollPercent >= 60) {
        scrollTriggered.current = true;
        showPopup('scroll60');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerConfig.scroll60, isSuppressed]);
  
  // Dwell trigger (20 seconds)
  useEffect(() => {
    if (!triggerConfig.dwell20s || isSuppressed) return;
    
    dwellTimer.current = setTimeout(() => {
      showPopup('dwell20s');
    }, 20000);
    
    return () => {
      if (dwellTimer.current) {
        clearTimeout(dwellTimer.current);
      }
    };
  }, [triggerConfig.dwell20s, isSuppressed]);
  
  // Exit intent trigger (desktop only)
  useEffect(() => {
    if (!triggerConfig.exitIntent || isSuppressed || window.innerWidth < 768) return;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (exitIntentTriggered.current) return;
      
      // Check if mouse is leaving the viewport from the top
      if (e.clientY <= 0) {
        exitIntentTriggered.current = true;
        showPopup('exitIntent');
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [triggerConfig.exitIntent, isSuppressed]);
  
  const showPopup = (trigger: string) => {
    if (isSuppressed || isVisible) return;
    
    setIsVisible(true);
    
    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_open', {
        context: context,
        trigger: trigger,
        variant: variant
      });
    }
  };
  
  const handleClose = () => {
    setIsVisible(false);
    
    // Suppress for configured hours
    try {
      localStorage.setItem(suppressionConfig.storageKey, Date.now().toString());
    } catch (error) {
      console.warn('Could not save popup suppression:', error);
    }
    
    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_close', {
        context: context,
        variant: variant
      });
    }
  };
  
  const handleCTAClick = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quote_entry_click', {
        context: context,
        trigger: 'popup',
        variant: variant
      });
    }
    
    // Close popup and navigate
    handleClose();
  };
  
  // Don't render if suppressed or not visible
  if (isSuppressed || !isVisible) {
    return null;
  }
  
  // Get CTA text from variant
  const ctaText = variant === 'A' ? 'Get Instant Estimate' : 'See Your Price Now';
  const leadInText = variant === 'A' 
    ? 'Most clients want a ballpark now — get yours in seconds.'
    : 'No waiting. Get your SMP estimate instantly.';
  
  return (
    <div 
      className="quote-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Instant estimate popup"
      onClick={handleClose}
    >
      <div 
        className="quote-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="quote-popup-close"
          onClick={handleClose}
          aria-label="Close popup"
        >
          ×
        </button>
        
        <div className="quote-popup-body">
          <h3 className="quote-popup-title">Get Your SMP Estimate</h3>
          <p className="quote-popup-lead">{leadInText}</p>
          
          <a
            href={`/pricing/instant-quote?src=popup_${context}`}
            className="btn btn-primary btn-lg quote-popup-cta"
            onClick={handleCTAClick}
          >
            <span className="cta-text">{ctaText}</span>
            <span className="instant-badge">Instant</span>
          </a>
          
          <p className="quote-popup-disclaimer">
            Takes 2 minutes • No commitment required
          </p>
        </div>
      </div>
    </div>
  );
}

// Export types for TypeScript
export type { QuoteEntryPopupProps };
