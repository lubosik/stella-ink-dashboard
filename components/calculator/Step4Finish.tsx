/**
 * Step 4: Finish Preference
 */

import React from 'react';
import OptionCard from './OptionCard';

export interface Step4FinishProps {
  finish?: string;
  onUpdate: (field: string, value: any) => void;
}

export default function Step4Finish({ finish, onUpdate }: Step4FinishProps) {
  return (
    <div className="calculator-step">
      <h2 className="step__title">What look are you going for?</h2>
      <p className="step__subtitle">Tell us about your desired finish style.</p>

      <div className="step__section">
        <div className="step__options">
          <OptionCard
            id="finish-natural"
            label="Natural soft hairline"
            description="Soft, organic hairline that blends seamlessly. Most popular choice."
            selected={finish === 'natural'}
            onClick={() => onUpdate('finish', 'natural')}
          />
          <OptionCard
            id="finish-crisp"
            label="Defined crisp look"
            description="Sharp, barbershop-fresh appearance. Clean and defined."
            selected={finish === 'barbershop_crisp'}
            onClick={() => onUpdate('finish', 'barbershop_crisp')}
          />
          <OptionCard
            id="finish-density"
            label="Density enhancement only"
            description="Add fullness to existing hair, not a hairline. For thinning areas."
            selected={finish === 'density_only'}
            onClick={() => onUpdate('finish', 'density_only')}
          />
          <OptionCard
            id="finish-guidance"
            label="Need guidance"
            description="Not sure yet? We'll help you decide during consultation."
            selected={finish === 'need_guidance'}
            onClick={() => onUpdate('finish', 'need_guidance')}
          />
        </div>
      </div>
    </div>
  );
}
