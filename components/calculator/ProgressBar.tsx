/**
 * Progress indicator for 7-step calculator flow
 */

import React from 'react';

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels
}: ProgressBarProps) {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const percentageStyle = { width: percentage + '%' };

  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className="progress-bar__header">
        <span className="progress-bar__step">
          Step {currentStep} of {totalSteps}
        </span>
        {stepLabels && stepLabels[currentStep - 1] && (
          <span className="progress-bar__label">{stepLabels[currentStep - 1]}</span>
        )}
      </div>

      <div className="progress-bar__track">
        <div 
          className="progress-bar__fill" 
          style={percentageStyle}
          aria-hidden="true"
        />
      </div>

      <div className="progress-bar__dots" aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const dotClass = 'progress-bar__dot' + 
            (index + 1 <= currentStep ? ' completed' : '') + 
            (index + 1 === currentStep ? ' active' : '');
          return <div key={index} className={dotClass} />;
        })}
      </div>
    </div>
  );
}
