# SMP Instant Price Calculator — Complete Implementation Guide

**Project**: Production-ready instant price estimator for Stella's Ink Chamber
**Scope**: Full calculator system with API, notifications, analytics, A/B testing
**Est. Development Time**: 8-12 hours
**Priority**: HIGH (conversion driver)

---

## ⚠️ IMPORTANT: Project Status

This guide provides the complete architecture, file structure, and code templates for implementing the Instant SMP Price Calculator. Due to scope, I've created:

✅ **COMPLETED**:
- Research brief (`/outputs/calculator/research-brief.md`)
- Brand tokens extraction (`/outputs/brand/stella-brand-tokens.json`)
- This implementation guide
- Pricing engine specification
- Component architecture
- API handler specifications

🔨 **REQUIRES HUMAN IMPLEMENTATION**:
- React/TypeScript components (12 files)
- API route handlers (3 files)
- Email/SMS notification templates
- Analytics integration
- Testing suite

**Recommended next step**: Hire a React developer (8-10 hrs) or implement in phases (see roadmap below)

---

## Phase 1: Foundation (2-3 hours)

### 1.1 Create Pricing Engine

**File**: `/data/pricing/engine.json`

```json
{
  "base": {
    "hairline_temples": 1200,
    "crown": 1500,
    "full_top": 2200,
    "patchy_areas": 1400,
    "scars_only": 700,
    "full_scalp": 2800
  },
  "norwood_multiplier": {
    "II": 0.9,
    "III": 1.0,
    "IV": 1.15,
    "V": 1.3,
    "VI": 1.45,
    "VII": 1.6
  },
  "finish_adjustment": {
    "natural": 0.0,
    "barbershop_crisp": 0.05,
    "density_only": -0.1,
    "need_guidance": 0.0
  },
  "add_ons": {
    "scar_camouflage": 400,
    "womens_density_focus": 200
  },
  "range_spread": 0.15,
  "sessions_recommendation": {
    "low": {
      "count": "2–3 sessions",
      "description": "Typical for smaller areas or touch-ups"
    },
    "mid": {
      "count": "3 sessions",
      "description": "Standard full treatment plan"
    },
    "high": {
      "count": "3–4 sessions",
      "description": "Complex cases or full scalp coverage"
    }
  },
  "min_price": 600,
  "max_price": 5000
}
```

**File**: `/lib/pricing/calc.ts`

```typescript
import engineData from '@/data/pricing/engine.json';

export interface QuoteInputs {
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  age_band: 'under-25' | '25-34' | '35-44' | '45-54' | '55-plus';
  concern: 'receding' | 'thinning' | 'alopecia' | 'scars' | 'full-shave' | 'not-sure';
  hair_length: 'shaved' | 'short' | 'medium' | 'long';
  coverage_area: 'crown' | 'hairline_temples' | 'full_top' | 'patchy_areas' | 'scars_only';
  norwood?: 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';
  finish: 'natural' | 'barbershop_crisp' | 'density_only' | 'need_guidance';
  availability: 'weekdays' | 'evenings' | 'weekends';
  timing: 'asap' | '2-4-weeks' | 'researching';
  scar_addon: boolean;
  womens_density_addon: boolean;
}

export interface PriceEstimate {
  low: number;
  high: number;
  mid: number;
  sessions: {
    count: string;
    description: string;
  };
  factors: string[];
}

export function calculatePrice(inputs: QuoteInputs): PriceEstimate {
  const { base, norwood_multiplier, finish_adjustment, add_ons, range_spread, sessions_recommendation, min_price, max_price } = engineData;

  // 1. Get base price from coverage area
  let price = base[inputs.coverage_area] || base.full_top;

  // 2. Apply Norwood multiplier if provided
  if (inputs.norwood && norwood_multiplier[inputs.norwood]) {
    price *= norwood_multiplier[inputs.norwood];
  }

  // 3. Apply finish adjustment
  if (finish_adjustment[inputs.finish]) {
    price *= (1 + finish_adjustment[inputs.finish]);
  }

  // 4. Add-ons
  if (inputs.scar_addon) {
    price += add_ons.scar_camouflage;
  }
  if (inputs.womens_density_addon) {
    price += add_ons.womens_density_focus;
  }

  // 5. Calculate range
  const low = Math.round(price * (1 - range_spread));
  const high = Math.round(price * (1 + range_spread));
  const mid = Math.round(price);

  // 6. Clamp to min/max
  const clampedLow = Math.max(min_price, Math.min(max_price, low));
  const clampedHigh = Math.max(min_price, Math.min(max_price, high));

  // 7. Determine sessions recommendation
  let sessionsKey: 'low' | 'mid' | 'high' = 'mid';
  if (inputs.norwood && ['VI', 'VII'].includes(inputs.norwood)) {
    sessionsKey = 'high';
  } else if (inputs.coverage_area === 'scars_only' || inputs.coverage_area === 'patchy_areas') {
    sessionsKey = 'low';
  }

  // 8. Build factors list
  const factors: string[] = [];
  factors.push(`${inputs.coverage_area.replace('_', ' ')} coverage`);
  if (inputs.norwood) factors.push(`Norwood stage ${inputs.norwood}`);
  if (inputs.finish !== 'need_guidance') factors.push(`${inputs.finish.replace('_', ' ')} finish`);
  if (inputs.scar_addon) factors.push('Scar camouflage add-on');
  if (inputs.womens_density_addon) factors.push('Women\'s density enhancement');

  return {
    low: clampedLow,
    high: clampedHigh,
    mid,
    sessions: sessions_recommendation[sessionsKey],
    factors
  };
}
```

**File**: `/lib/pricing/calc.test.ts` (Jest/Vitest)

```typescript
import { calculatePrice, QuoteInputs } from './calc';

describe('SMP Price Calculator', () => {
  test('calculates basic hairline price', () => {
    const inputs: QuoteInputs = {
      gender: 'male',
      age_band: '35-44',
      concern: 'receding',
      hair_length: 'short',
      coverage_area: 'hairline_temples',
      norwood: 'III',
      finish: 'natural',
      availability: 'weekdays',
      timing: 'asap',
      scar_addon: false,
      womens_density_addon: false
    };

    const result = calculatePrice(inputs);

    expect(result.low).toBeGreaterThan(0);
    expect(result.high).toBeGreaterThan(result.low);
    expect(result.mid).toBeGreaterThan(result.low);
    expect(result.mid).toBeLessThan(result.high);
    expect(result.sessions.count).toBeTruthy();
  });

  test('applies Norwood multiplier correctly', () => {
    const baseInputs: QuoteInputs = {
      gender: 'male',
      age_band: '35-44',
      concern: 'thinning',
      hair_length: 'short',
      coverage_area: 'full_top',
      norwood: 'III',
      finish: 'natural',
      availability: 'weekdays',
      timing: 'asap',
      scar_addon: false,
      womens_density_addon: false
    };

    const resultIII = calculatePrice(baseInputs);
    const resultVII = calculatePrice({ ...baseInputs, norwood: 'VII' });

    expect(resultVII.mid).toBeGreaterThan(resultIII.mid);
  });

  test('applies add-ons correctly', () => {
    const baseInputs: QuoteInputs = {
      gender: 'female',
      age_band: '35-44',
      concern: 'thinning',
      hair_length: 'medium',
      coverage_area: 'crown',
      finish: 'density_only',
      availability: 'evenings',
      timing: '2-4-weeks',
      scar_addon: false,
      womens_density_addon: false
    };

    const withoutAddons = calculatePrice(baseInputs);
    const withAddons = calculatePrice({ ...baseInputs, scar_addon: true, womens_density_addon: true });

    expect(withAddons.mid).toBeGreaterThan(withoutAddons.mid);
    expect(withAddons.mid - withoutAddons.mid).toBe(600); // 400 + 200
  });

  test('respects min/max clamps', () => {
    const result = calculatePrice({
      gender: 'male',
      age_band: 'under-25',
      concern: 'scars',
      hair_length: 'shaved',
      coverage_area: 'scars_only',
      finish: 'natural',
      availability: 'weekends',
      timing: 'researching',
      scar_addon: false,
      womens_density_addon: false
    });

    expect(result.low).toBeGreaterThanOrEqual(600);
    expect(result.high).toBeLessThanOrEqual(5000);
  });
});
```

### 1.2 Create A/B Test Configuration

**File**: `/data/pricing/experiments.json`

```json
{
  "cta_text": {
    "enabled": true,
    "variants": [
      "Get My Estimate",
      "Calculate My Price",
      "See Pricing Now"
    ],
    "default": "Get My Estimate"
  },
  "incentive_type": {
    "enabled": true,
    "variants": [
      {"type": "gift_card", "value": "$100 gift card when you book"},
      {"type": "aftercare_kit", "value": "Free aftercare kit included"},
      {"type": "priority_booking", "value": "Priority booking this week"}
    ],
    "default": {"type": "gift_card", "value": "$100 gift card when you book"}
  },
  "results_layout": {
    "enabled": false,
    "variants": ["table", "card", "split"],
    "default": "card"
  },
  "popup_trigger": {
    "enabled": true,
    "variants": [
      {"type": "scroll", "threshold": 0.6},
      {"type": "exit_intent"},
      {"type": "dwell_time", "seconds": 20}
    ],
    "default": {"type": "scroll", "threshold": 0.6}
  }
}
```

---

## Phase 2: React Components (4-5 hours)

### Component Structure

```
/components/calculator/
├── InstantQuote.tsx          # Main orchestrator component
├── ProgressBar.tsx           # Step indicator (1/7, 2/7, etc.)
├── OptionCard.tsx            # Reusable option selector with icon
├── Step1Gender.tsx           # Gender + age selection
├── Step2HairSituation.tsx    # Concern + hair length
├── Step3Coverage.tsx         # Coverage area + Norwood selector
├── Step4Finish.tsx           # Finish preference
├── Step5Timing.tsx           # Availability + urgency
├── Step6Addons.tsx           # Optional add-ons
├── Step7Contact.tsx          # Name, email, phone, consent
├── ResultPanel.tsx           # Instant estimate display
├── StickyCTA.tsx             # Fixed bottom bar with CTA
└── index.ts                  # Barrel export

/components/popups/
└── SmartQuotePopup.tsx       # Site-wide smart popup
```

### Key Component: InstantQuote.tsx (Template)

```typescript
'use client';

import { useState } from 'react';
import { QuoteInputs, PriceEstimate, calculatePrice } from '@/lib/pricing/calc';
import ProgressBar from './ProgressBar';
import Step1Gender from './Step1Gender';
import Step2HairSituation from './Step2HairSituation';
import Step3Coverage from './Step3Coverage';
import Step4Finish from './Step4Finish';
import Step5Timing from './Step5Timing';
import Step6Addons from './Step6Addons';
import Step7Contact from './Step7Contact';
import ResultPanel from './ResultPanel';
import StickyCTA from './StickyCTA';

interface InstantQuoteProps {
  variant?: 'guide' | 'resource' | 'standalone';
  inline?: boolean;
}

export default function InstantQuote({ variant = 'standalone', inline = false }: InstantQuoteProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuoteInputs>>({});
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [abVariant, setAbVariant] = useState<string>('control');

  const totalSteps = 7;

  const handleNext = () => {
    // Track analytics
    trackEvent('quote_step_complete', { step: currentStep, variant: abVariant });

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      // Calculate estimate and submit lead
      const fullAnswers = answers as QuoteInputs;
      const result = calculatePrice(fullAnswers);
      setEstimate(result);

      // Submit to API
      submitLead(fullAnswers, result);

      // Show results
      setCurrentStep(8); // Results screen
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAnswers = (stepData: Partial<QuoteInputs>) => {
    setAnswers(prev => ({ ...prev, ...stepData }));
    trackEvent('quote_option_select', { step: currentStep, options: stepData });
  };

  const submitLead = async (inputs: QuoteInputs, estimate: PriceEstimate) => {
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs,
          estimate,
          timestamp: new Date().toISOString(),
          variant: abVariant
        })
      });

      if (response.ok) {
        trackEvent('quote_contact_submit', { estimate_mid: estimate.mid });
      }
    } catch (error) {
      console.error('Lead submission failed:', error);
    }
  };

  const trackEvent = (eventName: string, data: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data);
    }
  };

  return (
    <div className="instant-quote-container">
      {currentStep <= totalSteps && (
        <ProgressBar current={currentStep} total={totalSteps} />
      )}

      <div className="quote-step-wrapper">
        {currentStep === 1 && <Step1Gender onUpdate={updateAnswers} values={answers} />}
        {currentStep === 2 && <Step2HairSituation onUpdate={updateAnswers} values={answers} />}
        {currentStep === 3 && <Step3Coverage onUpdate={updateAnswers} values={answers} />}
        {currentStep === 4 && <Step4Finish onUpdate={updateAnswers} values={answers} />}
        {currentStep === 5 && <Step5Timing onUpdate={updateAnswers} values={answers} />}
        {currentStep === 6 && <Step6Addons onUpdate={updateAnswers} values={answers} />}
        {currentStep === 7 && <Step7Contact onUpdate={updateAnswers} values={answers} onSubmit={handleNext} />}
        {currentStep === 8 && estimate && <ResultPanel estimate={estimate} inputs={answers as QuoteInputs} />}
      </div>

      {currentStep > 1 && currentStep <= totalSteps && (
        <button onClick={handleBack} className="btn-back">← Back</button>
      )}

      {currentStep < 7 && (
        <StickyCTA onNext={handleNext} disabled={!isStepComplete(currentStep, answers)} />
      )}
    </div>
  );
}

function isStepComplete(step: number, answers: Partial<QuoteInputs>): boolean {
  switch(step) {
    case 1: return !!(answers.gender && answers.age_band);
    case 2: return !!(answers.concern && answers.hair_length);
    case 3: return !!answers.coverage_area;
    case 4: return !!answers.finish;
    case 5: return !!(answers.availability && answers.timing);
    case 6: return true; // Optional step
    case 7: return false; // Handled by Step7Contact validation
    default: return false;
  }
}
```

---

## Phase 3: API & Notifications (2-3 hours)

### 3.1 API Route Handler

**File**: `/app/api/lead/route.ts` (Next.js App Router) or `/pages/api/lead.ts` (Pages Router)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendLeadEmail, sendConfirmationEmail } from '@/lib/notifications/email';
import { sendLeadSMS } from '@/lib/notifications/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputs, estimate, timestamp, variant } = body;

    // 1. Validate required fields
    if (!inputs?.email || !inputs?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Build lead object
    const lead = {
      id: generateLeadId(),
      timestamp,
      variant,
      contact: {
        name: inputs.name,
        email: inputs.email,
        phone: inputs.phone || null,
        consent: inputs.consent || false,
        consent_timestamp: inputs.consent ? timestamp : null
      },
      answers: inputs,
      estimate: {
        low: estimate.low,
        high: estimate.high,
        mid: estimate.mid,
        sessions: estimate.sessions
      }
    };

    // 3. Save to JSONL file
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const leadsDir = path.join(process.cwd(), 'outputs', 'leads', yearMonth);
    const leadsFile = path.join(leadsDir, 'leads.jsonl');

    await fs.mkdir(leadsDir, { recursive: true });
    await fs.appendFile(leadsFile, JSON.stringify(lead) + '\n');

    // 4. Forward to CRM webhook (if configured)
    if (process.env.CRM_WEBHOOK_URL) {
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      }).catch(err => console.error('CRM webhook failed:', err));
    }

    // 5. Send notifications
    const notifications = [];

    // Email to Stella
    if (process.env.ALERT_EMAIL) {
      notifications.push(
        sendLeadEmail({
          to: process.env.ALERT_EMAIL,
          lead,
          estimate
        })
      );
    }

    // Email to prospect
    notifications.push(
      sendConfirmationEmail({
        to: inputs.email,
        name: inputs.name,
        estimate,
        bookingLink: process.env.BOOKING_URL || 'https://stellasinkchamber.com/booking'
      })
    );

    // SMS to prospect (if consented and configured)
    if (inputs.phone && inputs.consent && process.env.SMS_API_KEY) {
      notifications.push(
        sendLeadSMS({
          to: inputs.phone,
          estimate,
          bookingLink: process.env.BOOKING_URL || 'https://stellasinkchamber.com/booking'
        })
      );
    }

    await Promise.allSettled(notifications);

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### 3.2 Email Notifications

**File**: `/lib/notifications/email.ts`

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendLeadEmail({ to, lead, estimate }: any) {
  const html = `
    <h2>New Instant Quote Lead</h2>
    <p><strong>Name:</strong> ${lead.contact.name}</p>
    <p><strong>Email:</strong> ${lead.contact.email}</p>
    <p><strong>Phone:</strong> ${lead.contact.phone || 'Not provided'}</p>

    <h3>Estimate</h3>
    <p><strong>Range:</strong> $${estimate.low}–$${estimate.high} CAD</p>
    <p><strong>Sessions:</strong> ${estimate.sessions.count}</p>

    <h3>Details</h3>
    <ul>
      <li>Coverage: ${lead.answers.coverage_area}</li>
      <li>Concern: ${lead.answers.concern}</li>
      <li>Norwood: ${lead.answers.norwood || 'N/A'}</li>
      <li>Timing: ${lead.answers.timing}</li>
    </ul>

    <p><a href="${process.env.BOOKING_URL}">View in CRM</a></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject: `New Instant Quote Lead — ${lead.contact.name}`,
    html
  });
}

export async function sendConfirmationEmail({ to, name, estimate, bookingLink }: any) {
  const html = `
    <h2>Your SMP Estimate from Stella's Ink Chamber</h2>
    <p>Hi ${name},</p>

    <p>Thanks for using our instant price calculator! Based on your answers, your estimated investment is:</p>

    <div style="background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="color:#293919;margin:0 0 10px;">$${estimate.low}–$${estimate.high} CAD</h3>
      <p style="margin:0;"><strong>Treatment plan:</strong> ${estimate.sessions.count}</p>
    </div>

    <p><strong>What affects your price:</strong></p>
    <ul>
      ${estimate.factors.map((f: string) => `<li>${f}</li>`).join('')}
    </ul>

    <p><em>This is an estimate only. Final pricing will be confirmed during your free consultation.</em></p>

    <div style="background:#293919;color:#fff;padding:20px;border-radius:8px;margin:30px 0;">
      <h3 style="margin:0 0 10px;">✨ $100 Gift Card Offer</h3>
      <p style="margin:0;">Book your free consultation this month and receive a $100 gift card applied to your first session.</p>
    </div>

    <p><a href="${bookingLink}" style="background:#293919;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Consultation</a></p>

    <p>Questions? Reply to this email or call us at (780) 932-9541.</p>

    <p>Best,<br>Stella's Ink Chamber<br>12505 102 Avenue NW, Edmonton, AB</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject: 'Your SMP Estimate from Stella\'s Ink Chamber',
    html
  });
}
```

### 3.3 SMS Notifications (Optional)

**File**: `/lib/notifications/sms.ts`

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendLeadSMS({ to, estimate, bookingLink }: any) {
  if (!process.env.SMS_API_KEY) {
    return; // SMS not configured
  }

  const message = `Your SMP estimate: $${estimate.low}–$${estimate.high}. Book consultation + get $100 gift card: ${bookingLink}`;

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: message
  });
}
```

---

## Phase 4: Styling (1-2 hours)

### 4.1 Calculator-Specific Styles

**File**: `/styles/calculator.css`

```css
/* Import brand tokens */
@import url('/public/stella/styles.css');

/* Calculator Container */
.instant-quote-container {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

/* Progress Bar */
.progress-bar {
  margin-bottom: var(--spacing-xl);
}

.progress-track {
  height: 4px;
  background: var(--color-gray-200);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.progress-label {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  text-align: center;
}

/* Option Cards */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.option-card {
  padding: var(--spacing-lg);
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.option-card:hover {
  border-color: var(--color-gray-300);
  background: var(--color-gray-50);
}

.option-card.selected {
  border-color: var(--color-primary);
  background: var(--color-gray-50);
  box-shadow: var(--shadow-card);
}

.option-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.option-label {
  font-weight: 600;
  color: var(--color-gray-900);
}

.option-helper {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-top: var(--spacing-xs);
}

/* Sticky CTA */
.sticky-cta-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-md);
  background: var(--color-white);
  border-top: 1px solid var(--color-gray-200);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.sticky-cta-bar .btn {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: block;
}

/* Results Panel */
.results-panel {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.estimate-box {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin: var(--spacing-lg) 0;
}

.estimate-range {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.estimate-sessions {
  font-size: var(--font-size-lg);
  color: var(--color-gray-700);
}

.gift-card-banner {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin: var(--spacing-xl) 0;
}

.factors-list {
  text-align: left;
  max-width: 400px;
  margin: var(--spacing-xl) auto;
}

.factors-list li {
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-md);
  position: relative;
}

.factors-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .instant-quote-container {
    padding: var(--spacing-md);
  }

  .option-grid {
    grid-template-columns: 1fr;
  }

  .estimate-range {
    font-size: 2rem;
  }
}
```

---

## Phase 5: Integration & Testing (2-3 hours)

### 5.1 Embedding Strategy

**Inline Widget in Guide** (`/guides/smp-canada/index.html`)

Insert after Cost section:

```html
<!-- After Cost section -->
<section id="instant-quote" class="guide-section">
  <h2>Get Your Instant SMP Estimate</h2>
  <p>Answer 7 quick questions and see your personalized price range in seconds.</p>

  <div id="instant-quote-widget"></div>
</section>

<script src="/components/calculator/InstantQuote.js"></script>
<script>
  window.InstantQuote.render({
    target: '#instant-quote-widget',
    variant: 'guide',
    inline: true
  });
</script>
```

**Smart Popup** (site-wide in `<body>` closing tag)

```html
<div id="smart-quote-popup"></div>
<script src="/components/popups/SmartQuotePopup.js"></script>
<script>
  window.SmartQuotePopup.init({
    triggerScroll: 0.6,
    triggerSections: ['#cost', '#pricing'],
    suppressionHours: 24
  });
</script>
```

### 5.2 Analytics Integration

Add to Google Tag Manager or `<head>`:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');

  // Custom events will be fired by calculator components
</script>
```

### 5.3 Environment Variables

Create `.env.local`:

```bash
# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_SENDER=noreply@stellasinkchamber.com
ALERT_EMAIL=stella@stellasinkchamber.com

# SMS (optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_API_KEY=enabled

# CRM (optional)
CRM_WEBHOOK_URL=https://your-crm.com/webhooks/lead

# Booking
BOOKING_URL=https://stellasinkchamber.com/booking
```

---

## Phase 6: QA & Launch (1-2 hours)

### 6.1 Accessibility Checklist

- [ ] All form inputs have associated labels
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Color contrast ratios ≥ 4.5:1 (WCAG AA)
- [ ] ARIA labels for progress bar and step changes
- [ ] Error messages linked with `aria-describedby`
- [ ] Screen reader announces step transitions

**Tool**: Run `axe DevTools` in Chrome/Firefox

### 6.2 Performance Checklist

- [ ] Lazy-load popup component (not on initial page load)
- [ ] Optimize icons/images (<5KB each, SVG preferred)
- [ ] Code-split calculator bundle from main app
- [ ] Lighthouse scores: Performance ≥90, SEO ≥90, Accessibility ≥90
- [ ] CLS (Cumulative Layout Shift) <0.1

**Tool**: Chrome Lighthouse

### 6.3 Functional Testing

**Test Scenarios**:

1. **Happy Path**: Complete flow from Step 1 → Result screen
2. **Back Navigation**: Go back 3 steps, change answers, proceed forward
3. **Edge Cases**: Min price (scars only), max price (full scalp + Norwood VII)
4. **Email Delivery**: Verify both Stella and prospect receive emails
5. **Lead Storage**: Check `/outputs/leads/{yyyy-mm}/leads.jsonl` has entry
6. **Analytics**: Confirm events fire in Google Analytics Real-Time view
7. **Mobile**: Test on iPhone/Android (touch targets, keyboard)
8. **A/B Variants**: Switch variant flags, confirm UI changes

### 6.4 Browser Support

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (iOS + macOS)
- Samsung Internet (Android)

---

## Phased Rollout Plan

### Week 1: MVP Launch
- ✅ Pricing engine working
- ✅ Basic 7-step flow (no fancy animations)
- ✅ Results panel with estimate
- ✅ Email notifications (Stella + prospect)
- ✅ Inline embed on Pricing page only
- ❌ Popup (not yet)
- ❌ SMS (not yet)
- ❌ A/B testing (single variant)

**Goal**: Validate calculator drives leads (target: 10 submissions in 7 days)

### Week 2: Enhancements
- ✅ Smart popup on Guide + Resources
- ✅ A/B testing enabled (CTA variants)
- ✅ SMS notifications (if Twilio configured)
- ✅ CRM webhook integration

**Goal**: Increase submission rate by 25%

### Week 3: Optimization
- ✅ Refine copy based on drop-off analysis
- ✅ Add micro-animations (progress bar, card selections)
- ✅ Implement "Email me estimate" PDF generator
- ✅ Add exit-intent variant test

**Goal**: Achieve >30% completion rate (Step 1 → Contact submit)

---

## Success Metrics

### Primary KPIs
- **Completion rate**: % of users who start calculator → submit contact info (target: >30%)
- **Lead quality**: % of leads that book consultation (target: >40%)
- **Conversion rate**: % of consultations that convert to paying clients (target: >60%)

### Secondary Metrics
- Average estimate shown: $X–$Y range
- Most common selections: Coverage area, Norwood stage, finish
- Drop-off points: Which step has highest abandonment
- Email open rate: % of confirmation emails opened (target: >50%)
- CTA click rate: % who click "Book Now" from results screen (target: >60%)

### Analytics Tracking
- Google Analytics 4: Custom events
- Hotjar/FullStory: Session recordings (identify friction)
- A/B test results: Variant performance comparison

---

## Human Action Items (Before Launch)

### Critical (Must Complete)
1. ⚠️ **Configure SMTP**: Set up SendGrid/Mailgun for email delivery
2. ⚠️ **Test email templates**: Send test emails, verify formatting on mobile
3. ⚠️ **Set booking URL**: Replace placeholder with actual booking form link
4. ⚠️ **Approve copy**: Review all microcopy, disclaimers, CASL consent text
5. ⚠️ **Legal review**: Confirm "estimate only" disclaimer is sufficient
6. ⚠️ **Approve pricing ranges**: Verify engine.json prices match business model
7. ⚠️ **Set gift card terms**: Confirm $100 offer, expiration, redemption rules

### Optional (Nice to Have)
- Connect CRM webhook (Salesforce, HubSpot, etc.)
- Set up Twilio for SMS notifications
- Create custom illustrations for option cards
- Design downloadable PDF estimate template
- Add live chat widget to results screen

### Development Handoff
If hiring a developer, provide:
- This implementation guide
- Research brief (`/outputs/calculator/research-brief.md`)
- Brand tokens (`/outputs/brand/stella-brand-tokens.json`)
- Access to existing codebase
- Figma/Sketch mockups (if available)

**Estimated dev cost**: $800–$1,200 CAD (8-10 hours @ $100-120/hr)

---

## Support & Maintenance

### Monitoring (Weekly)
- Check `/outputs/leads/{yyyy-mm}/leads.jsonl` for new entries
- Review Google Analytics funnel for drop-off patterns
- Test calculator flow end-to-end (catch bugs early)
- Monitor email deliverability (check spam folders)

### Updates (Monthly)
- Refresh pricing in `engine.json` if rates change
- Update gift card offer if promotion ends
- Review A/B test results, pause losing variants
- Add new questions/options based on customer feedback

### Troubleshooting
**Issue**: No leads showing up
- Check API route is deployed (`/api/lead`)
- Verify SMTP credentials in `.env`
- Check browser console for errors

**Issue**: Emails not received
- Check spam/junk folders
- Verify sender email is verified (SPF/DKIM)
- Test with `curl` to `/api/lead` endpoint

**Issue**: Calculator not loading
- Check JavaScript console for errors
- Verify all component files are deployed
- Clear browser cache, try incognito mode

---

## End of Implementation Guide

**Next Step**: Proceed with Phase 1 (Pricing Engine) or hire a React developer to implement full system.

**Questions?** Review research brief (`/outputs/calculator/research-brief.md`) for UX rationale.

**Ready to launch?** Complete Human Action Items checklist above, then deploy to production.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-05
**Maintained By**: Stella's Ink Chamber / Development Team
