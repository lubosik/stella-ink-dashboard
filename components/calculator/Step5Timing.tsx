/**
 * Step 5: Timing Preference
 */

import React from 'react';
import OptionCard from './OptionCard';

export interface Step5TimingProps {
  timing?: string;
  onUpdate: (field: string, value: any) => void;
}

export default function Step5Timing({ timing, onUpdate }: Step5TimingProps) {
  return (
    <div className="calculator-step">
      <h2 className="step__title">When are you looking to get started?</h2>
      <p className="step__subtitle">This helps us prioritize your consultation booking.</p>

      <div className="step__section">
        <div className="step__options">
          <OptionCard
            id="timing-asap"
            label="As soon as possible"
            description="Ready to book within the next 2 weeks"
            selected={timing === 'asap'}
            onClick={() => onUpdate('timing', 'asap')}
          />
          <OptionCard
            id="timing-2-4-weeks"
            label="Within 2-4 weeks"
            description="Looking to start soon but flexible"
            selected={timing === '2-4-weeks'}
            onClick={() => onUpdate('timing', '2-4-weeks')}
          />
          <OptionCard
            id="timing-1-3-months"
            label="1-3 months"
            description="Planning ahead for later this year"
            selected={timing === '1-3-months'}
            onClick={() => onUpdate('timing', '1-3-months')}
          />
          <OptionCard
            id="timing-researching"
            label="Just researching"
            description="Exploring options, no rush"
            selected={timing === 'researching'}
            onClick={() => onUpdate('timing', 'researching')}
          />
        </div>
      </div>
    </div>
  );
}
