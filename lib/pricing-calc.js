/**
 * SMP Pricing Calculator Engine (Standalone JavaScript)
 */

const pricingEngine = {
  base: {
    hairline_temples: 1200,
    crown: 1500,
    full_top: 2200,
    patchy_areas: 1400,
    scars_only: 700,
    full_scalp: 2800
  },
  norwood_multiplier: {
    "II": 0.9,
    "III": 1.0,
    "III-V": 1.05,
    "IV": 1.15,
    "IV-V": 1.25,
    "V": 1.3,
    "V-VI": 1.4,
    "VI": 1.45,
    "VII": 1.6
  },
  finish_adjustment: {
    natural: 0.0,
    barbershop_crisp: 0.05,
    density_only: -0.1,
    need_guidance: 0.0
  },
  add_ons: {
    scar_camouflage: 400,
    womens_density_focus: 200
  },
  session_rules: {
    base_sessions: 3,
    norwood_bonus: {
      "VI": 1,
      "VII": 1
    },
    coverage_bonus: {
      full_scalp: 1
    },
    scar_addon_sessions: 1
  },
  range_spread: 0.15,
  min_price: 600,
  max_price: 5000,
  currency: "CAD"
};

function calculatePrice(inputs) {
  let price = pricingEngine.base[inputs.coverage_area];
  const factors = [];

  if (inputs.norwood && pricingEngine.norwood_multiplier[inputs.norwood]) {
    const multiplier = pricingEngine.norwood_multiplier[inputs.norwood];
    price *= multiplier;
    const pct = ((multiplier - 1) * 100).toFixed(0);
    factors.push('Norwood stage ' + inputs.norwood + ' (' + pct + '% adjustment)');
  }

  const finishAdj = pricingEngine.finish_adjustment[inputs.finish];
  price *= (1 + finishAdj);
  if (finishAdj !== 0) {
    const pct = (finishAdj * 100).toFixed(0);
    const sign = finishAdj > 0 ? '+' : '';
    const finishLabel = inputs.finish.replace(/_/g, ' ');
    factors.push(finishLabel + ' finish (' + sign + pct + '%)');
  }

  if (inputs.scar_addon) {
    price += pricingEngine.add_ons.scar_camouflage;
    factors.push('Scar camouflage (+' + pricingEngine.add_ons.scar_camouflage + ')');
  }

  if (inputs.womens_density_addon) {
    price += pricingEngine.add_ons.womens_density_focus;
    factors.push("Women's density focus (+" + pricingEngine.add_ons.womens_density_focus + ')');
  }

  let sessionCount = pricingEngine.session_rules.base_sessions;

  if (inputs.norwood && pricingEngine.session_rules.norwood_bonus[inputs.norwood]) {
    sessionCount += pricingEngine.session_rules.norwood_bonus[inputs.norwood];
  }

  if (pricingEngine.session_rules.coverage_bonus[inputs.coverage_area]) {
    sessionCount += pricingEngine.session_rules.coverage_bonus[inputs.coverage_area];
  }

  if (inputs.scar_addon) {
    sessionCount += pricingEngine.session_rules.scar_addon_sessions;
  }

  const spread = pricingEngine.range_spread;
  let low = Math.round(price * (1 - spread));
  let high = Math.round(price * (1 + spread));
  const mid = Math.round(price);

  low = Math.max(low, pricingEngine.min_price);
  high = Math.min(high, pricingEngine.max_price);

  const plural = sessionCount > 1 ? 's' : '';
  const sessionDescription = sessionCount + ' session' + plural + ' recommended (spaced 2-4 weeks apart)';

  return {
    low: low,
    high: high,
    mid: mid,
    currency: pricingEngine.currency,
    sessions: {
      count: sessionCount,
      description: sessionDescription
    },
    factors: factors.length > 0 ? factors : ['Standard coverage area'],
    disclaimer: 'This is an estimate only. Final pricing will be determined during your free consultation based on your specific needs and goals.'
  };
}

window.calculateSMPPrice = calculatePrice;
