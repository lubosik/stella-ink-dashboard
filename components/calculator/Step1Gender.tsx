/**
 * Step 1: Gender and Age Band Selection
 */

import React from 'react';
import OptionCard from './OptionCard';

export interface Step1GenderProps {
  gender?: string;
  ageBand?: string;
  onUpdate: (field: string, value: any) => void;
}

export default function Step1Gender({ gender, ageBand, onUpdate }: Step1GenderProps) {
  return (
    <div className="calculator-step">
      <h2 className="step__title">Let's start with a few basics</h2>
      <p className="step__subtitle">This helps us provide the most accurate estimate for you.</p>

      <div className="step__section">
        <h3 className="step__section-title">Gender</h3>
        <div className="step__options step__options--grid-2">
          <OptionCard
            id="gender-male"
            label="Male"
            selected={gender === 'male'}
            onClick={() => onUpdate('gender', 'male')}
          />
          <OptionCard
            id="gender-female"
            label="Female"
            selected={gender === 'female'}
            onClick={() => onUpdate('gender', 'female')}
          />
          <OptionCard
            id="gender-nonbinary"
            label="Non-binary"
            selected={gender === 'non-binary'}
            onClick={() => onUpdate('gender', 'non-binary')}
          />
          <OptionCard
            id="gender-prefer-not"
            label="Prefer not to say"
            selected={gender === 'prefer-not-to-say'}
            onClick={() => onUpdate('gender', 'prefer-not-to-say')}
          />
        </div>
      </div>

      <div className="step__section">
        <h3 className="step__section-title">Age Range</h3>
        <div className="step__options step__options--grid-2">
          <OptionCard
            id="age-under-25"
            label="Under 25"
            selected={ageBand === 'under-25'}
            onClick={() => onUpdate('age_band', 'under-25')}
          />
          <OptionCard
            id="age-25-34"
            label="25-34"
            selected={ageBand === '25-34'}
            onClick={() => onUpdate('age_band', '25-34')}
          />
          <OptionCard
            id="age-35-44"
            label="35-44"
            selected={ageBand === '35-44'}
            onClick={() => onUpdate('age_band', '35-44')}
          />
          <OptionCard
            id="age-45-54"
            label="45-54"
            selected={ageBand === '45-54'}
            onClick={() => onUpdate('age_band', '45-54')}
          />
          <OptionCard
            id="age-55-plus"
            label="55+"
            selected={ageBand === '55-plus'}
            onClick={() => onUpdate('age_band', '55-plus')}
          />
        </div>
      </div>
    </div>
  );
}
