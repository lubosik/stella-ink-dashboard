/**
 * Sticky bottom CTA for mobile navigation
 */

import React from 'react';

export interface StickyCTAProps {
  currentStep: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
}

export default function StickyCTA({
  currentStep,
  canProceed,
  isSubmitting,
  onNext,
  onBack
}: StickyCTAProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 7;

  const nextButtonText = isLastStep 
    ? (isSubmitting ? 'Calculating...' : 'Get My Estimate') 
    : 'Continue';

  return (
    <div className="sticky-cta">
      <div className="sticky-cta__container">
        {!isFirstStep && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onBack}
            disabled={isSubmitting}
            aria-label="Go back to previous step"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Back
          </button>
        )}

        <button
          type="button"
          className="btn btn--primary btn--large"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          aria-label={nextButtonText}
        >
          {isSubmitting ? (
            <>
              <span className="btn__spinner" aria-hidden="true"></span>
              {nextButtonText}
            </>
          ) : (
            <>
              {nextButtonText}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
