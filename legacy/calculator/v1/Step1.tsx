/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 1: Who You Are
 * 
 * Gender identity and age band selection
 */

import React from 'react';
import OptionCard from './OptionCard';

interface Step1Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const Step1: React.FC<Step1Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting
}) => {
  const genderOptions = [
    { value: 'male', label: 'Male', icon: '👨' },
    { value: 'female', label: 'Female', icon: '👩' },
    { value: 'non-binary', label: 'Non-binary', icon: '⚧' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '👤' }
  ];

  const ageOptions = [
    { value: 'under-25', label: 'Under 25', description: '18-24 years old' },
    { value: '25-34', label: '25-34', description: 'Young adult' },
    { value: '35-44', label: '35-44', description: 'Mid-career' },
    { value: '45-54', label: '45-54', description: 'Established' },
    { value: '55-plus', label: '55+', description: 'Mature' }
  ];

  const handleGenderChange = (value: string) => {
    onAnswerChange(1, 'gender', value);
  };

  const handleAgeChange = (value: string) => {
    onAnswerChange(1, 'age', value);
  };

  const canProceed = answers.gender && answers.age;

  return (
    <div className="step step-1">
      <div className="step-header">
        <h3>Tell us about yourself</h3>
        <p>This helps us provide the most accurate estimate for your situation.</p>
      </div>

      <div className="step-content">
        <fieldset className="question-group">
          <legend className="question-title">
            What's your gender identity?
          </legend>
          <div className="options-grid">
            {genderOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                icon={option.icon}
                selected={answers.gender === option.value}
                onClick={handleGenderChange}
              />
            ))}
          </div>
          {errors.gender && (
            <div className="error-message" role="alert">
              {errors.gender}
            </div>
          )}
        </fieldset>

        <fieldset className="question-group">
          <legend className="question-title">
            What's your age range?
          </legend>
          <div className="options-grid">
            {ageOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                selected={answers.age === option.value}
                onClick={handleAgeChange}
              />
            ))}
          </div>
          {errors.age && (
            <div className="error-message" role="alert">
              {errors.age}
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
          Next: Your Hair Situation
        </button>
      </div>
    </div>
  );
};

export default Step1;
