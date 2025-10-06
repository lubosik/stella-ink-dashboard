/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 5: Sessions & Timing
 * 
 * Availability and speed preferences
 */

import React from 'react';
import OptionCard from './OptionCard';

interface Step5Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const Step5: React.FC<Step5Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting
}) => {
  const availabilityOptions = [
    { value: 'weekdays', label: 'Weekdays', description: 'Monday to Friday', icon: '📅' },
    { value: 'evenings', label: 'Evenings', description: 'After 5 PM', icon: '🌙' },
    { value: 'weekends', label: 'Weekends', description: 'Saturday & Sunday', icon: '🏖️' }
  ];

  const speedOptions = [
    { value: 'asap', label: 'As soon as possible', description: 'Within 1-2 weeks', icon: '⚡' },
    { value: 'next-month', label: 'Next 2-4 weeks', description: 'Flexible timing', icon: '📆' },
    { value: 'researching', label: 'Still researching', description: 'No rush', icon: '🔍' }
  ];

  const handleAvailabilityChange = (value: string) => {
    onAnswerChange(5, 'availability', value);
  };

  const handleSpeedChange = (value: string) => {
    onAnswerChange(5, 'speed', value);
  };

  const canProceed = answers.availability && answers.speed;

  return (
    <div className="step step-5">
      <div className="step-header">
        <h3>When works best for you?</h3>
        <p>Help us understand your schedule and timeline preferences.</p>
      </div>

      <div className="step-content">
        <fieldset className="question-group">
          <legend className="question-title">
            What's your preferred availability?
          </legend>
          <div className="options-grid">
            {availabilityOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.availability === option.value}
                onClick={handleAvailabilityChange}
              />
            ))}
          </div>
          {errors.availability && (
            <div className="error-message" role="alert">
              {errors.availability}
            </div>
          )}
        </fieldset>

        <fieldset className="question-group">
          <legend className="question-title">
            How quickly would you like to proceed?
          </legend>
          <div className="options-grid">
            {speedOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.speed === option.value}
                onClick={handleSpeedChange}
              />
            ))}
          </div>
          {errors.speed && (
            <div className="error-message" role="alert">
              {errors.speed}
            </div>
          )}
        </fieldset>
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
        >
          Next: Add-ons
        </button>
      </div>
    </div>
  );
};

export default Step5;
