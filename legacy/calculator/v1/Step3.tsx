/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 3: Coverage Area
 * 
 * Coverage area selection and Norwood scale reference
 */

import React from 'react';
import OptionCard from './OptionCard';

interface Step3Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const Step3: React.FC<Step3Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting
}) => {
  const coverageOptions = [
    { 
      value: 'hairline_temples', 
      label: 'Hairline & temples', 
      description: 'Front hairline and temple areas',
      icon: '👨‍🦲'
    },
    { 
      value: 'crown', 
      label: 'Crown', 
      description: 'Top of head, crown area',
      icon: '🔝'
    },
    { 
      value: 'full_top', 
      label: 'Full top', 
      description: 'Complete top of head',
      icon: '🎯'
    },
    { 
      value: 'patchy', 
      label: 'Patchy areas', 
      description: 'Multiple small areas',
      icon: '🧩'
    },
    { 
      value: 'scars_only', 
      label: 'Scars only', 
      description: 'Just scar camouflage',
      icon: '🔧'
    }
  ];

  const norwoodOptions = [
    { value: 'II', label: 'Norwood II', description: 'Slight recession', icon: '2️⃣' },
    { value: 'III', label: 'Norwood III', description: 'Moderate recession', icon: '3️⃣' },
    { value: 'IV', label: 'Norwood IV', description: 'Advanced recession', icon: '4️⃣' },
    { value: 'V', label: 'Norwood V', description: 'Significant loss', icon: '5️⃣' },
    { value: 'VI+', label: 'Norwood VI+', description: 'Extensive loss', icon: '6️⃣' }
  ];

  const handleCoverageChange = (value: string) => {
    onAnswerChange(3, 'coverageArea', value);
  };

  const handleNorwoodChange = (value: string) => {
    onAnswerChange(3, 'norwoodScale', value);
  };

  const canProceed = answers.coverageArea && answers.norwoodScale;

  return (
    <div className="step step-3">
      <div className="step-header">
        <h3>What areas need coverage?</h3>
        <p>Select the areas you'd like to address with SMP.</p>
      </div>

      <div className="step-content">
        <fieldset className="question-group">
          <legend className="question-title">
            Which areas are you most concerned about?
          </legend>
          <div className="options-grid">
            {coverageOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.coverageArea === option.value}
                onClick={handleCoverageChange}
              />
            ))}
          </div>
          {errors.coverageArea && (
            <div className="error-message" role="alert">
              {errors.coverageArea}
            </div>
          )}
        </fieldset>

        <fieldset className="question-group">
          <legend className="question-title">
            Which Norwood scale best describes your hair loss?
          </legend>
          <div className="norwood-reference">
            <p className="reference-text">
              <strong>Reference:</strong> The Norwood scale measures male pattern baldness progression. 
              Choose the stage that most closely matches your current hair loss pattern.
            </p>
          </div>
          <div className="options-grid norwood-grid">
            {norwoodOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.norwoodScale === option.value}
                onClick={handleNorwoodChange}
              />
            ))}
          </div>
          {errors.norwoodScale && (
            <div className="error-message" role="alert">
              {errors.norwoodScale}
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
          Next: Goals & Finish
        </button>
      </div>
    </div>
  );
};

export default Step3;
