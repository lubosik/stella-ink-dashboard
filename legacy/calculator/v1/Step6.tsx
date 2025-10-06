/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 6: Add-ons
 * 
 * Optional add-on services
 */

import React from 'react';
import OptionCard from './OptionCard';

interface Step6Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const Step6: React.FC<Step6Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting
}) => {
  const addOnOptions = [
    { 
      value: 'scar-camouflage', 
      label: 'Scar camouflage add-on', 
      description: 'Specialized technique for FUE/FUT scars (+$400)',
      icon: '🔧'
    },
    { 
      value: 'womens-density', 
      label: 'Women\'s density focus', 
      description: 'Enhanced density techniques (+$200)',
      icon: '💇‍♀️'
    }
  ];

  const handleAddOnChange = (value: string) => {
    const currentAddOns = answers.addOns || {};
    const newAddOns = { ...currentAddOns };
    
    if (newAddOns[value]) {
      delete newAddOns[value];
    } else {
      newAddOns[value] = true;
    }
    
    onAnswerChange(6, 'addOns', newAddOns);
  };

  const canProceed = true; // Add-ons are optional

  return (
    <div className="step step-6">
      <div className="step-header">
        <h3>Any additional services?</h3>
        <p>These optional add-ons can enhance your results (all optional).</p>
      </div>

      <div className="step-content">
        <fieldset className="question-group">
          <legend className="question-title">
            Select any add-ons that interest you:
          </legend>
          <div className="options-grid">
            {addOnOptions.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={answers.addOns?.[option.value] || false}
                onClick={handleAddOnChange}
              />
            ))}
          </div>
          <div className="addon-note">
            <p><strong>Note:</strong> All add-ons are optional. You can always discuss these during your consultation.</p>
          </div>
          {errors.addOns && (
            <div className="error-message" role="alert">
              {errors.addOns}
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
          Get Your Estimate
        </button>
      </div>
    </div>
  );
};

export default Step6;
