/**
 * Step 6: Add-ons (Scar Camouflage + Women's Density)
 */

import React from 'react';
import OptionCard from './OptionCard';

export interface Step6AddonsProps {
  scarAddon?: boolean;
  womensDensityAddon?: boolean;
  onUpdate: (field: string, value: any) => void;
}

export default function Step6Addons({ scarAddon, womensDensityAddon, onUpdate }: Step6AddonsProps) {
  return (
    <div className="calculator-step">
      <h2 className="step__title">Any additional treatments?</h2>
      <p className="step__subtitle">Select any add-ons you're interested in. (Optional—skip if none apply.)</p>

      <div className="step__section">
        <div className="step__options">
          <OptionCard
            id="addon-scar"
            label="Scar camouflage"
            description="Cover surgical scars, injury scars, or hair transplant scarring (+$400)"
            selected={scarAddon === true}
            onClick={() => onUpdate('scar_addon', !scarAddon)}
          />
          <OptionCard
            id="addon-womens-density"
            label="Women's density focus"
            description="Specialized technique for female-pattern thinning and density restoration (+$200)"
            selected={womensDensityAddon === true}
            onClick={() => onUpdate('womens_density_addon', !womensDensityAddon)}
          />
        </div>
      </div>

      <p className="step__help-text">
        You can skip this step if no add-ons apply to you.
      </p>
    </div>
  );
}
