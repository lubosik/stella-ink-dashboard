/**
 * Instant SMP Price Calculator
 * Calculates personalized pricing estimates based on user inputs
 * Uses JSON-driven pricing rules from /data/pricing/engine.json
 */

import pricingEngine from '../../data/pricing/engine.json';

export interface QuoteInputs {
  // Step 1: Demographics
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  age_band: 'under-25' | '25-34' | '35-44' | '45-54' | '55-plus';

  // Step 2: Hair Situation
  concern: 'receding' | 'thinning' | 'alopecia' | 'scars' | 'full-shave' | 'not-sure';
  current_hair_length?: 'shaved' | 'buzzed' | 'short' | 'medium' | 'long';

  // Step 3: Coverage Area
  coverage_area: 'hairline_temples' | 'crown' | 'full_top' | 'patchy_areas' | 'scars_only' | 'full_scalp';
  norwood?: 'II' | 'III' | 'III-V' | 'IV' | 'IV-V' | 'V' | 'V-VI' | 'VI' | 'VII';

  // Step 4: Finish Preference
  finish: 'natural' | 'barbershop_crisp' | 'density_only' | 'need_guidance';

  // Step 5: Timing
  timing: 'asap' | '2-4-weeks' | '1-3-months' | 'researching';

  // Step 6: Add-ons
  scar_addon?: boolean;
  womens_density_addon?: boolean;

  // Step 7: Contact Info (not used in calculation)
  name?: string;
  email?: string;
  phone?: string;
  consent?: boolean;
}

export interface PriceEstimate {
  low: number;
  high: number;
  mid: number;
  currency: string;
  sessions: {
    count: number;
    description: string;
  };
  factors: string[];
  disclaimer: string;
}

/**
 * Calculate personalized SMP price estimate
 */
export function calculatePrice(inputs: QuoteInputs): PriceEstimate {
  // Start with base price for coverage area
  let price = pricingEngine.base[inputs.coverage_area];
  const factors: string[] = [];

  // Apply Norwood scale multiplier (if applicable)
  if (inputs.norwood && pricingEngine.norwood_multiplier[inputs.norwood]) {
    const multiplier = pricingEngine.norwood_multiplier[inputs.norwood];
    price *= multiplier;
    const pct = ((multiplier - 1) * 100).toFixed(0);
    factors.push('Norwood stage ' + inputs.norwood + ' (' + pct + '% adjustment)');
  }

  // Apply finish adjustment
  const finishAdj = pricingEngine.finish_adjustment[inputs.finish];
  price *= (1 + finishAdj);
  if (finishAdj !== 0) {
    const pct = (finishAdj * 100).toFixed(0);
    const sign = finishAdj > 0 ? '+' : '';
    factors.push(inputs.finish.replace('_', ' ') + ' finish (' + sign + pct + '%)');
  }

  // Add scar camouflage addon
  if (inputs.scar_addon) {
    price += pricingEngine.add_ons.scar_camouflage;
    factors.push('Scar camouflage (+' + pricingEngine.add_ons.scar_camouflage + ')');
  }

  // Add women's density addon
  if (inputs.womens_density_addon) {
    price += pricingEngine.add_ons.womens_density_focus;
    factors.push("Women's density focus (+" + pricingEngine.add_ons.womens_density_focus + ')');
  }

  // Calculate session count
  let sessionCount = pricingEngine.session_rules.base_sessions;

  // Add bonus sessions for advanced Norwood stages
  if (inputs.norwood && inputs.norwood in pricingEngine.session_rules.norwood_bonus) {
    sessionCount += pricingEngine.session_rules.norwood_bonus[inputs.norwood as keyof typeof pricingEngine.session_rules.norwood_bonus];
  }

  // Add bonus sessions for full scalp coverage
  if (inputs.coverage_area in pricingEngine.session_rules.coverage_bonus) {
    sessionCount += pricingEngine.session_rules.coverage_bonus[inputs.coverage_area as keyof typeof pricingEngine.session_rules.coverage_bonus];
  }

  // Add sessions for scar work
  if (inputs.scar_addon) {
    sessionCount += pricingEngine.session_rules.scar_addon_sessions;
  }

  // Calculate price range (±15% spread)
  const spread = pricingEngine.range_spread;
  let low = Math.round(price * (1 - spread));
  let high = Math.round(price * (1 + spread));
  const mid = Math.round(price);

  // Apply min/max clamps
  low = Math.max(low, pricingEngine.min_price);
  high = Math.min(high, pricingEngine.max_price);

  // Build session description
  const plural = sessionCount > 1 ? 's' : '';
  const sessionDescription = sessionCount + ' session' + plural + ' recommended (spaced 2-4 weeks apart)';

  return {
    low,
    high,
    mid,
    currency: pricingEngine.currency,
    sessions: {
      count: sessionCount,
      description: sessionDescription
    },
    factors: factors.length > 0 ? factors : ['Standard coverage area'],
    disclaimer: 'This is an estimate only. Final pricing will be determined during your free consultation based on your specific needs and goals.'
  };
}

/**
 * Validate user inputs before calculation
 */
export function validateInputs(inputs: Partial<QuoteInputs>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!inputs.gender) errors.push('Gender selection is required');
  if (!inputs.age_band) errors.push('Age band is required');
  if (!inputs.concern) errors.push('Hair concern is required');
  if (!inputs.coverage_area) errors.push('Coverage area is required');
  if (!inputs.finish) errors.push('Finish preference is required');
  if (!inputs.timing) errors.push('Timing preference is required');

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get human-readable label for option values
 */
export function getLabelForOption(field: keyof QuoteInputs, value: string): string {
  const labels: Record<string, Record<string, string>> = {
    gender: {
      'male': 'Male',
      'female': 'Female',
      'non-binary': 'Non-binary',
      'prefer-not-to-say': 'Prefer not to say'
    },
    concern: {
      'receding': 'Receding hairline',
      'thinning': 'Thinning/diffuse',
      'alopecia': 'Alopecia',
      'scars': 'Scar camouflage',
      'full-shave': 'Full shaved look',
      'not-sure': 'Not sure'
    },
    coverage_area: {
      'hairline_temples': 'Hairline/Temples only',
      'crown': 'Crown area',
      'full_top': 'Full top of head',
      'patchy_areas': 'Patchy areas',
      'scars_only': 'Scars only',
      'full_scalp': 'Full scalp'
    },
    finish: {
      'natural': 'Natural soft hairline',
      'barbershop_crisp': 'Defined crisp look',
      'density_only': 'Density enhancement only',
      'need_guidance': 'Need guidance'
    },
    timing: {
      'asap': 'As soon as possible',
      '2-4-weeks': 'Within 2-4 weeks',
      '1-3-months': '1-3 months',
      'researching': 'Just researching'
    }
  };

  return labels[field]?.[value] || value;
}
