/**
 * Step 2: Hair Situation (Concern + Current Hair Length)
 */

import React from 'react';
import OptionCard from './OptionCard';

export interface Step2HairSituationProps {
  concern?: string;
  hairLength?: string;
  onUpdate: (field: string, value: any) => void;
}

export default function Step2HairSituation({ concern, hairLength, onUpdate }: Step2HairSituationProps) {
  return (
    <div className="calculator-step">
      <h2 className="step__title">What brings you to SMP?</h2>
      <p className="step__subtitle">Select the option that best describes your situation.</p>

      <div className="step__section">
        <h3 className="step__section-title">Primary Concern</h3>
        <div className="step__options">
          <OptionCard
            id="concern-receding"
            label="Receding hairline"
            description="Hairline moving back or thinning at temples"
            selected={concern === 'receding'}
            onClick={() => onUpdate('concern', 'receding')}
          />
          <OptionCard
            id="concern-thinning"
            label="Thinning/diffuse hair loss"
            description="Overall thinning or patchy areas"
            selected={concern === 'thinning'}
            onClick={() => onUpdate('concern', 'thinning')}
          />
          <OptionCard
            id="concern-alopecia"
            label="Alopecia"
            description="Medical hair loss condition"
            selected={concern === 'alopecia'}
            onClick={() => onUpdate('concern', 'alopecia')}
          />
          <OptionCard
            id="concern-scars"
            label="Scar camouflage"
            description="Cover scars from surgery, injury, or hair transplant"
            selected={concern === 'scars'}
            onClick={() => onUpdate('concern', 'scars')}
          />
          <OptionCard
            id="concern-full-shave"
            label="Full shaved look"
            description="Want a completely shaved head appearance"
            selected={concern === 'full-shave'}
            onClick={() => onUpdate('concern', 'full-shave')}
          />
          <OptionCard
            id="concern-not-sure"
            label="Not sure / Need guidance"
            description="Let us help determine the best approach"
            selected={concern === 'not-sure'}
            onClick={() => onUpdate('concern', 'not-sure')}
          />
        </div>
      </div>

      <div className="step__section">
        <h3 className="step__section-title">Current Hair Length (Optional)</h3>
        <div className="step__options step__options--grid-3">
          <OptionCard
            id="hair-shaved"
            label="Shaved"
            selected={hairLength === 'shaved'}
            onClick={() => onUpdate('current_hair_length', 'shaved')}
          />
          <OptionCard
            id="hair-buzzed"
            label="Buzzed (short)"
            selected={hairLength === 'buzzed'}
            onClick={() => onUpdate('current_hair_length', 'buzzed')}
          />
          <OptionCard
            id="hair-medium"
            label="Medium/Long"
            selected={hairLength === 'medium'}
            onClick={() => onUpdate('current_hair_length', 'medium')}
          />
        </div>
      </div>
    </div>
  );
}
