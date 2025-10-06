'use client';

/**
 * Main container for SMP Instant Price Calculator
 * Manages state flow across 7 steps + results
 */

import React, { useState } from 'react';
import { calculatePrice, validateInputs, QuoteInputs, PriceEstimate } from '@/lib/pricing/calc';
import ProgressBar from './ProgressBar';
import Step1Gender from './Step1Gender';
import Step2HairSituation from './Step2HairSituation';
import Step3Coverage from './Step3Coverage';
import Step4Finish from './Step4Finish';
import Step5Timing from './Step5Timing';
import Step6Addons from './Step6Addons';
import Step7Contact from './Step7Contact';
import ResultPanel from './ResultPanel';
import StickyCTA from './StickyCTA';

export interface InstantQuoteProps {
  variant?: 'standalone' | 'inline' | 'popup';
  onComplete?: (estimate: PriceEstimate, inputs: QuoteInputs) => void;
}

const STEP_LABELS = [
  'About You',
  'Hair Situation',
  'Coverage Area',
  'Finish Preference',
  'Timing',
  'Add-ons',
  'Contact Info'
];

export default function InstantQuote({ variant = 'standalone', onComplete }: InstantQuoteProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuoteInputs>>({});
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAnswers = (field: string, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    setError(null);

    // Step 7: Submit and show results
    if (currentStep === 7) {
      const validation = validateInputs(answers);
      
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return;
      }

      setIsSubmitting(true);

      try {
        // Calculate estimate
        const result = calculatePrice(answers as QuoteInputs);
        setEstimate(result);

        // Submit lead to API
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputs: answers,
            estimate: result,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit lead');
        }

        // Move to results
        setCurrentStep(8);

        // Callback for parent components
        if (onComplete) {
          onComplete(result, answers as QuoteInputs);
        }

        // Track analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'quote_contact_submit', {
            event_category: 'calculator',
            event_label: variant
          });
        }
      } catch (err) {
        console.error('Submit error:', err);
        setError('Failed to submit. Please try again or call us at (555) 123-4567.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Advance to next step
      setCurrentStep(prev => prev + 1);

      // Track step completion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quote_step_view', {
          event_category: 'calculator',
          event_label: 'step_' + (currentStep + 1)
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!(answers.gender && answers.age_band);
      case 2: return !!answers.concern;
      case 3: return !!answers.coverage_area;
      case 4: return !!answers.finish;
      case 5: return !!answers.timing;
      case 6: return true; // Addons are optional
      case 7: return !!(answers.name && answers.email && answers.phone && answers.consent);
      default: return false;
    }
  };

  const containerClass = 'instant-quote' + (variant !== 'standalone' ? ' instant-quote--' + variant : '');

  return (
    <div className={containerClass}>
      {currentStep <= 7 && (
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={7}
          stepLabels={STEP_LABELS}
        />
      )}

      <div className="instant-quote__content">
        {currentStep === 1 && (
          <Step1Gender 
            gender={answers.gender}
            ageBand={answers.age_band}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 2 && (
          <Step2HairSituation
            concern={answers.concern}
            hairLength={answers.current_hair_length}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 3 && (
          <Step3Coverage
            coverageArea={answers.coverage_area}
            norwood={answers.norwood}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 4 && (
          <Step4Finish
            finish={answers.finish}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 5 && (
          <Step5Timing
            timing={answers.timing}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 6 && (
          <Step6Addons
            scarAddon={answers.scar_addon}
            womensDensityAddon={answers.womens_density_addon}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 7 && (
          <Step7Contact
            name={answers.name}
            email={answers.email}
            phone={answers.phone}
            consent={answers.consent}
            onUpdate={updateAnswers}
          />
        )}

        {currentStep === 8 && estimate && (
          <ResultPanel
            estimate={estimate}
            answers={answers as QuoteInputs}
          />
        )}

        {error && (
          <div className="instant-quote__error" role="alert">
            {error}
          </div>
        )}
      </div>

      {currentStep <= 7 && (
        <StickyCTA
          currentStep={currentStep}
          canProceed={canProceed()}
          isSubmitting={isSubmitting}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
