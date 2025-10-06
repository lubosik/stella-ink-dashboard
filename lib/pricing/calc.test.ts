/**
 * Unit tests for SMP pricing calculator
 * Run with: npm test or npx jest calc.test.ts
 */

import { calculatePrice, validateInputs, getLabelForOption, QuoteInputs } from './calc';

describe('calculatePrice', () => {
  test('calculates base price for hairline/temples coverage', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '35-44',
      concern: 'receding',
      coverage_area: 'hairline_temples',
      finish: 'natural',
      timing: 'asap'
    };

    const estimate = calculatePrice(inputs);

    // Base price is $1200, with ±15% spread
    expect(estimate.mid).toBe(1200);
    expect(estimate.low).toBe(1020); // 1200 * 0.85
    expect(estimate.high).toBe(1380); // 1200 * 1.15
    expect(estimate.currency).toBe('CAD');
    expect(estimate.sessions.count).toBe(3);
  });

  test('applies Norwood multiplier correctly', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '45-54',
      concern: 'receding',
      coverage_area: 'full_top',
      norwood: 'V',
      finish: 'natural',
      timing: '2-4-weeks'
    };

    const estimate = calculatePrice(inputs);

    // Base: $2200, Norwood V: 1.3x = $2860
    expect(estimate.mid).toBe(2860);
    expect(estimate.factors).toContain('Norwood stage V (30% adjustment)');
    expect(estimate.sessions.count).toBe(4); // Base 3 + 1 for Norwood V
  });

  test('applies finish adjustment for barbershop crisp', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '25-34',
      concern: 'full-shave',
      coverage_area: 'full_scalp',
      finish: 'barbershop_crisp',
      timing: 'asap'
    };

    const estimate = calculatePrice(inputs);

    // Base: $2800, Finish: +5% = $2940
    expect(estimate.mid).toBe(2940);
    expect(estimate.factors).toContain('barbershop crisp finish (+5%)');
  });

  test('applies density-only discount', () => {
    const inputs: QuoteInputs = {
      gender: 'female',
      age_band: '35-44',
      concern: 'thinning',
      coverage_area: 'full_top',
      finish: 'density_only',
      timing: 'researching'
    };

    const estimate = calculatePrice(inputs);

    // Base: $2200, Finish: -10% = $1980
    expect(estimate.mid).toBe(1980);
    expect(estimate.factors).toContain('density only finish (-10%)');
  });

  test('adds scar camouflage addon', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '35-44',
      concern: 'scars',
      coverage_area: 'scars_only',
      finish: 'natural',
      timing: 'asap',
      scar_addon: true
    };

    const estimate = calculatePrice(inputs);

    // Base: $700, Scar addon: +$400 = $1100
    expect(estimate.mid).toBe(1100);
    expect(estimate.factors).toContain('Scar camouflage (+$400)');
    expect(estimate.sessions.count).toBe(4); // Base 3 + 1 for scar work
  });

  test('adds women\'s density addon', () => {
    const inputs: QuoteInputs = {
      gender: 'female',
      age_band: '25-34',
      concern: 'thinning',
      coverage_area: 'patchy_areas',
      finish: 'natural',
      timing: '1-3-months',
      womens_density_addon: true
    };

    const estimate = calculatePrice(inputs);

    // Base: $1400, Women's density: +$200 = $1600
    expect(estimate.mid).toBe(1600);
    expect(estimate.factors).toContain('Women\'s density focus (+$200)');
  });

  test('combines multiple adjustments correctly', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '55-plus',
      concern: 'receding',
      coverage_area: 'full_scalp',
      norwood: 'VII',
      finish: 'barbershop_crisp',
      timing: 'asap',
      scar_addon: true
    };

    const estimate = calculatePrice(inputs);

    // Base: $2800
    // Norwood VII: 1.6x = $4480
    // Finish: +5% = $4704
    // Scar addon: +$400 = $5104
    expect(estimate.mid).toBe(5104);
    expect(estimate.factors).toContain('Norwood stage VII (60% adjustment)');
    expect(estimate.factors).toContain('barbershop crisp finish (+5%)');
    expect(estimate.factors).toContain('Scar camouflage (+$400)');

    // However, max clamp is $5000
    expect(estimate.high).toBe(5000);

    // Sessions: Base 3 + Norwood VII (1) + Full scalp (1) + Scar (1) = 6
    expect(estimate.sessions.count).toBe(6);
  });

  test('respects minimum price clamp', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: 'under-25',
      concern: 'scars',
      coverage_area: 'scars_only',
      norwood: 'II',
      finish: 'density_only',
      timing: 'researching'
    };

    const estimate = calculatePrice(inputs);

    // Base: $700, Norwood II: 0.9x = $630, Finish: -10% = $567
    // Low end: $567 * 0.85 = $482
    // Min clamp: $600
    expect(estimate.low).toBe(600);
  });

  test('includes disclaimer in all estimates', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '35-44',
      concern: 'receding',
      coverage_area: 'hairline_temples',
      finish: 'natural',
      timing: 'asap'
    };

    const estimate = calculatePrice(inputs);

    expect(estimate.disclaimer).toContain('estimate only');
    expect(estimate.disclaimer).toContain('consultation');
  });
});

describe('validateInputs', () => {
  test('validates complete inputs', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '35-44',
      concern: 'receding',
      coverage_area: 'hairline_temples',
      finish: 'natural',
      timing: 'asap'
    };

    const result = validateInputs(inputs);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('catches missing required fields', () => {
    const inputs: Partial<QuoteInputs> = {
      gender: 'male',
      age_band: '35-44'
      // Missing: concern, coverage_area, finish, timing
    };

    const result = validateInputs(inputs);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Hair concern is required');
    expect(result.errors).toContain('Coverage area is required');
    expect(result.errors).toContain('Finish preference is required');
    expect(result.errors).toContain('Timing preference is required');
  });

  test('allows optional Norwood scale', () => {
    const inputs: QuoteInputs = {
      gender: 'female',
      age_band: '25-34',
      concern: 'thinning',
      coverage_area: 'patchy_areas',
      finish: 'density_only',
      timing: 'researching'
      // norwood is optional
    };

    const result = validateInputs(inputs);

    expect(result.valid).toBe(true);
  });
});

describe('getLabelForOption', () => {
  test('returns human-readable labels for options', () => {
    expect(getLabelForOption('gender', 'male')).toBe('Male');
    expect(getLabelForOption('concern', 'receding')).toBe('Receding hairline');
    expect(getLabelForOption('coverage_area', 'full_scalp')).toBe('Full scalp');
    expect(getLabelForOption('finish', 'barbershop_crisp')).toBe('Defined crisp look');
    expect(getLabelForOption('timing', 'asap')).toBe('As soon as possible');
  });

  test('returns original value if no label defined', () => {
    expect(getLabelForOption('concern', 'unknown-value')).toBe('unknown-value');
  });
});
