/**
 * Step 3: Coverage Area + Norwood Scale
 */

import React from 'react';
import OptionCard from './OptionCard';

export interface Step3CoverageProps {
  coverageArea?: string;
  norwood?: string;
  onUpdate: (field: string, value: any) => void;
}

export default function Step3Coverage({ coverageArea, norwood, onUpdate }: Step3CoverageProps) {
  const showNorwood = coverageArea && ['full_top', 'crown', 'full_scalp'].includes(coverageArea);

  return (
    <div className="calculator-step">
      <h2 className="step__title">Which area needs treatment?</h2>
      <p className="step__subtitle">Select the primary area you want to address.</p>

      <div className="step__section">
        <h3 className="step__section-title">Coverage Area</h3>
        <div className="step__options">
          <OptionCard
            id="coverage-hairline"
            label="Hairline / Temples only"
            description="Front hairline and temple areas"
            selected={coverageArea === 'hairline_temples'}
            onClick={() => onUpdate('coverage_area', 'hairline_temples')}
          />
          <OptionCard
            id="coverage-crown"
            label="Crown area"
            description="Top/back of head"
            selected={coverageArea === 'crown'}
            onClick={() => onUpdate('coverage_area', 'crown')}
          />
          <OptionCard
            id="coverage-full-top"
            label="Full top of head"
            description="Hairline through crown"
            selected={coverageArea === 'full_top'}
            onClick={() => onUpdate('coverage_area', 'full_top')}
          />
          <OptionCard
            id="coverage-patchy"
            label="Patchy areas"
            description="Multiple small areas"
            selected={coverageArea === 'patchy_areas'}
            onClick={() => onUpdate('coverage_area', 'patchy_areas')}
          />
          <OptionCard
            id="coverage-scars"
            label="Scars only"
            description="Scar camouflage treatment"
            selected={coverageArea === 'scars_only'}
            onClick={() => onUpdate('coverage_area', 'scars_only')}
          />
          <OptionCard
            id="coverage-full-scalp"
            label="Full scalp"
            description="Complete head coverage"
            selected={coverageArea === 'full_scalp'}
            onClick={() => onUpdate('coverage_area', 'full_scalp')}
          />
        </div>
      </div>

      {showNorwood && (
        <div className="step__section">
          <h3 className="step__section-title">Hair Loss Stage (Norwood Scale)</h3>
          <p className="step__help-text">
            This helps us estimate the treatment area more accurately. Not sure? No problem—we can assess during consultation.
          </p>
          <div className="step__options step__options--grid-3">
            <OptionCard
              id="norwood-ii"
              label="Stage II"
              description="Slight recession"
              selected={norwood === 'II'}
              onClick={() => onUpdate('norwood', 'II')}
            />
            <OptionCard
              id="norwood-iii"
              label="Stage III"
              description="Deeper temples"
              selected={norwood === 'III'}
              onClick={() => onUpdate('norwood', 'III')}
            />
            <OptionCard
              id="norwood-iv"
              label="Stage IV"
              description="Crown thinning starts"
              selected={norwood === 'IV'}
              onClick={() => onUpdate('norwood', 'IV')}
            />
            <OptionCard
              id="norwood-v"
              label="Stage V"
              description="Larger balding areas"
              selected={norwood === 'V'}
              onClick={() => onUpdate('norwood', 'V')}
            />
            <OptionCard
              id="norwood-vi"
              label="Stage VI"
              description="Bridge between areas thin"
              selected={norwood === 'VI'}
              onClick={() => onUpdate('norwood', 'VI')}
            />
            <OptionCard
              id="norwood-vii"
              label="Stage VII"
              description="Most advanced"
              selected={norwood === 'VII'}
              onClick={() => onUpdate('norwood', 'VII')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
