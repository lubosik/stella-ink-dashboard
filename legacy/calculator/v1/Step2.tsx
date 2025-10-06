/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 2: Your Hair Situation
 * 
 * Primary concern and current hair length
 */

import React from 'react';
import OptionCard from './OptionCard';

interface Step2Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const Step2: React.FC<Step2Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting
}) => {
  const concernOptions = [
    { 
      value: 'receding-hairline', 
      label: 'Receding hairline', 
      description: 'Temples and forehead area',
      icon: '👨‍🦲'
    },
    { 
      value: 'thinning-density', 
      label: 'Thinning & density', 
      description: 'Overall hair thinning',
      icon: '💇‍♂️'
    },
    { 
      value: 'alopecia', 
      label: 'Alopecia (AA/AT/AU)', 
      description: 'Autoimmune hair loss',
      icon: '🔄'
    },
    { 
      value: 'scar-camouflage', 
      label: 'Scar camouflage (FUE/FUT)', 
      description: 'Hiding transplant scars',
      icon: '🔧'
    },
    { 
      value: 'full-shave', 
      label: 'Full shave look', 
      description: 'Complete scalp coverage',
      icon: '🪒'
    },
    { 
      value: 'not-sure', 
      label: 'Not sure', 
      description: 'I need guidance',
      icon: '❓'
    }
  ];

  const lengthOptions = [
    { value: 'shaved', label: 'Shaved', description: 'Bald or very short', icon: '🪒' },
    { value: 'short', label: 'Short', description: 'Buzz cut or short style', icon: '✂️' },
    { value: 'medium', label: 'Medium', description: 'Regular length', icon: '💇‍♂️' },
    { value: 'long', label: 'Long', description: 'Longer than usual', icon: '💇‍♀️' }
  ];

  const handleConcernChange = (value: string) => {
    onAnswerChange(2, 'primaryConcern', value);
  };

  const handleLengthChange = (value: string) => {
    onAnswerChange(2, 'currentLength', value);
  };

  const canProceed = answers.primaryConcern && answers.currentLength;

  return (
    <div className="step step-2">
      <div className="step-header">
        <h3>What's your primary hair concern?</h3>
        <p>Understanding your situation helps us recommend the best approach.</p>
      </div>

      <div className="step-content">
        <fieldset className="question-group">
          <legend className="question-title">
            What's your main concern?
          </legend>
          <div className="options-grid">
            {concernOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.primaryConcern === option.value}
                onClick={handleConcernChange}
              />
            ))}
          </div>
          {errors.primaryConcern && (
            <div className="error-message" role="alert">
              {errors.primaryConcern}
            </div>
          )}
        </fieldset>

        <fieldset className="question-group">
          <legend className="question-title">
            What's your current hair length?
          </legend>
          <div className="options-grid">
            {lengthOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.currentLength === option.value}
                onClick={handleLengthChange}
              />
            ))}
          </div>
          {errors.currentLength && (
            <div className="error-message" role="alert">
              {errors.currentLength}
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
          Next: Coverage Area
        </button>
      </div>
    </div>
  );
};

export default Step2;
