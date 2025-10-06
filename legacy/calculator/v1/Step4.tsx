/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 4: Goal & Finish
 * 
 * Finish preference and priority selection
 */

import React from 'react';
import OptionCard from './OptionCard';

interface Step4Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const Step4: React.FC<Step4Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting
}) => {
  const finishOptions = [
    { 
      value: 'natural', 
      label: 'Natural/feathered', 
      description: 'Soft, realistic hairline',
      icon: '🌿'
    },
    { 
      value: 'barbershop', 
      label: 'Barbershop crisp', 
      description: 'Sharp, defined edges',
      icon: '✂️'
    },
    { 
      value: 'density_only', 
      label: 'Density only', 
      description: 'Focus on thickness',
      icon: '💪'
    }
  ];

  const priorityOptions = [
    { value: 'natural', label: 'As natural as possible', icon: '🌱' },
    { value: 'defined', label: 'As defined as possible', icon: '🎯' },
    { value: 'guidance', label: 'I need guidance', icon: '🤝' }
  ];

  const handleFinishChange = (value: string) => {
    onAnswerChange(4, 'finishPreference', value);
  };

  const handlePriorityChange = (value: string) => {
    onAnswerChange(4, 'priority', value);
  };

  const canProceed = answers.finishPreference && answers.priority;

  return (
    <div className="step step-4">
      <div className="step-header">
        <h3>What's your ideal finish?</h3>
        <p>Help us understand your aesthetic preferences.</p>
      </div>

      <div className="step-content">
        <fieldset className="question-group">
          <legend className="question-title">
            What type of finish do you prefer?
          </legend>
          <div className="options-grid">
            {finishOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.finishPreference === option.value}
                onClick={handleFinishChange}
              />
            ))}
          </div>
          {errors.finishPreference && (
            <div className="error-message" role="alert">
              {errors.finishPreference}
            </div>
          )}
        </fieldset>

        <fieldset className="question-group">
          <legend className="question-title">
            What's your priority?
          </legend>
          <div className="options-grid">
            {priorityOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                icon={option.icon}
                selected={answers.priority === option.value}
                onClick={handlePriorityChange}
              />
            ))}
          </div>
          {errors.priority && (
            <div className="error-message" role="alert">
              {errors.priority}
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
          Next: Sessions & Timing
        </button>
      </div>
    </div>
  );
};

export default Step4;
