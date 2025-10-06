'use client';

/**
 * Smart popup that triggers based on user behavior
 * - 60% scroll
 * - Exit intent
 * - 20 second dwell time
 * - 24-hour suppression after close
 */

import React, { useState, useEffect } from 'react';
import InstantQuote from '../calculator/InstantQuote';

export interface SmartQuotePopupProps {
  triggers?: {
    scrollPercent?: number;
    exitIntent?: boolean;
    dwellSeconds?: number;
    sections?: string[];
  };
  suppress?: {
    hours?: number;
    key?: string;
  };
  variant?: string;
  label?: string;
  prefillFromContext?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const DEFAULT_TRIGGERS = {
  scrollPercent: 60,
  exitIntent: true,
  dwellSeconds: 20,
  sections: ['cost', 'longevity', 'pricing', 'vs']
};

export default function SmartQuotePopup({
  triggers = DEFAULT_TRIGGERS,
  suppress = { hours: 24, key: 'stella_quote_popup_suppressed' },
  variant = 'popup',
  label = 'Get Your Instant SMP Price Estimate',
  prefillFromContext = false,
  onOpen,
  onClose
}: SmartQuotePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const suppressionKey = suppress.key || 'stella_quote_popup_suppressed';
    const lastSuppressed = localStorage.getItem(suppressionKey);

    if (lastSuppressed) {
      const suppressedUntil = new Date(lastSuppressed);
      if (new Date() < suppressedUntil) {
        return;
      }
    }

    let dwellTimer: NodeJS.Timeout | null = null;

    const getCurrentSection = () => {
      const sections = document.querySelectorAll('[data-section]');
      const viewportMiddle = window.scrollY + window.innerHeight / 2;

      for (const section of Array.from(sections)) {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;

        if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
          return section.getAttribute('data-section');
        }
      }
      return null;
    };

    const handleScroll = () => {
      if (hasShown) return;

      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      const currentSection = getCurrentSection();

      const targetSections = triggers.sections || ['cost', 'longevity', 'pricing', 'vs'];
      const isInTargetSection = currentSection && targetSections.includes(currentSection);

      if (scrollPercent >= (triggers.scrollPercent || 60) && isInTargetSection) {
        showPopup(currentSection);
      }
    };

    const handleExitIntent = (e: MouseEvent) => {
      if (hasShown) return;
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    const showPopup = (section?: string | null) => {
      setIsOpen(true);
      setHasShown(true);

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'popup_open', {
          event_category: 'calculator',
          event_label: variant,
          section: section || 'unknown'
        });
      }

      if (onOpen) onOpen();
    };

    if (triggers.dwellSeconds) {
      dwellTimer = setTimeout(() => {
        if (!hasShown) {
          const currentSection = getCurrentSection();
          showPopup(currentSection);
        }
      }, triggers.dwellSeconds * 1000);
    }

    if (triggers.scrollPercent) {
      window.addEventListener('scroll', handleScroll);
    }

    if (triggers.exitIntent) {
      document.addEventListener('mouseleave', handleExitIntent);
    }

    return () => {
      if (dwellTimer) clearTimeout(dwellTimer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleExitIntent);
    };
  }, [hasShown, triggers]);

  const handleClose = () => {
    setIsOpen(false);

    const suppressionKey = suppress.key || 'stella_quote_popup_suppressed';
    const suppressUntil = new Date();
    suppressUntil.setHours(suppressUntil.getHours() + (suppress.hours || 24));
    localStorage.setItem(suppressionKey, suppressUntil.toISOString());

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_close', {
        event_category: 'calculator',
        event_label: variant
      });
    }

    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="smart-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="smart-popup">
        <button
          type="button"
          className="smart-popup__close"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
          </svg>
        </button>

        <div className="smart-popup__header">
          <h2 id="popup-title" className="smart-popup__title">
            {label}
          </h2>
          <p className="smart-popup__subtitle">
            Answer 7 quick questions and receive your personalized pricing — no waiting.
          </p>
        </div>

        <div className="smart-popup__content">
          <InstantQuote variant="popup" onComplete={handleClose} />
        </div>
      </div>
    </div>
  );
}
