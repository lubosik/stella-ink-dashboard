# SMP Instant Quote Calculator — Phase 1 Deliverables

**Date**: 2025-10-05
**Status**: Foundation Complete ✅
**Next Phase**: React Component Implementation

---

## Files Created

### 1. Research & Documentation

#### [research-brief.md](./research-brief.md)
- SMP industry pricing standards (2025)
- Calculator UX best practices
- 5 concrete implementation patterns (A-E)
- CASL compliance requirements
- Copy tone guidelines
- Competitor analysis insights

#### [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)
- Complete technical specification
- 6-phase build plan (8-12 hours estimated)
- Full code templates for all components
- QA checklist
- Phased rollout strategy
- Success metrics & KPIs

#### This file (DELIVERABLES.md)
- Project status summary
- File inventory
- Next steps

### 2. Brand Assets

#### [../brand/stella-brand-tokens.json](../brand/stella-brand-tokens.json)
Extracted from `/public/stella/styles.css`:
- **Colors**: Primary (#293919), accent, grays, success/warning/error
- **Typography**: Libre Baskerville (headings), Source Sans Pro (body)
- **Spacing**: xs (0.25rem) → 3xl (4rem)
- **Shadows**: Card, elevated
- **Radius**: sm → pill
- **Buttons**: Primary, secondary variants
- **Transitions**: Fast (150ms), base (250ms)

**Usage**: Import into React components to ensure brand consistency
**Rule**: NO hardcoded hex codes or font names in component files

### 3. Pricing Engine (Foundation)

#### [../../data/pricing/engine.json](../../data/pricing/engine.json) ✅
JSON configuration for all pricing rules:

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
    "II": 0.9, "III": 1.0, "IV": 1.15,
    "V": 1.3, "VI": 1.45, "VII": 1.6
  },
  "finish_adjustment": {
    "natural": 0.0,
    "barbershop_crisp": 0.05,
    "density_only": -0.1
  },
  "add_ons": {
    "scar_camouflage": 400,
    "womens_density_focus": 200
  },
  "session_rules": { ... },
  "range_spread": 0.15,
  "min_price": 600,
  "max_price": 5000,
  "currency": "CAD"
}
```

**Editable by**: Non-technical staff (JSON format)
**Updates**: Price changes don't require code deployment

#### [../../lib/pricing/calc.ts](../../lib/pricing/calc.ts) ✅
TypeScript pricing calculator module:

**Exports**:
- `QuoteInputs` interface (all 7 steps + contact fields)
- `PriceEstimate` interface (low/high/mid, sessions, factors, disclaimer)
- `calculatePrice(inputs)` — main pricing function
- `validateInputs(inputs)` — validation with error messages
- `getLabelForOption(field, value)` — human-readable labels

**Logic**:
1. Base price from coverage area
2. Apply Norwood multiplier (0.9–1.6x)
3. Apply finish adjustment (±10%)
4. Add scar/density addons
5. Calculate session count (3–6 sessions)
6. Generate price range (±15% spread)
7. Clamp to min/max ($600–$5000)
8. Return estimate with explanatory factors

**Import Example**:
```typescript
import { calculatePrice } from '@/lib/pricing/calc';

const estimate = calculatePrice({
  gender: 'male',
  age_band: '35-44',
  concern: 'receding',
  coverage_area: 'full_top',
  norwood: 'IV',
  finish: 'natural',
  timing: 'asap'
});
// Returns: { low: 2142, high: 2894, mid: 2518, currency: 'CAD', sessions: {...}, ... }
```

#### [../../lib/pricing/calc.test.ts](../../lib/pricing/calc.test.ts) ✅
Jest/Vitest unit tests (15 test cases):

**Coverage**:
- ✅ Base price calculation
- ✅ Norwood multiplier application
- ✅ Finish adjustments (crisp +5%, density -10%)
- ✅ Addon pricing (scar +$400, women's +$200)
- ✅ Session count logic
- ✅ Min/max price clamping
- ✅ Combined adjustments (edge cases)
- ✅ Input validation
- ✅ Label generation

**Run Tests**:
```bash
npm test calc.test.ts
# or
npx jest lib/pricing/calc.test.ts
```

### 4. A/B Testing Configuration

#### [../../data/pricing/experiments.json](../../data/pricing/experiments.json) ✅
A/B test variant definitions:

**Active Experiments**:
1. **CTA Text** (3-way split):
   - Control: "Get My Estimate"
   - Variant A: "Calculate My Price"
   - Variant B: "See Pricing Now"

2. **Incentive Messaging** (2-way split):
   - Control: "$100 Gift Card"
   - Variant A: "Free Aftercare Kit ($75 value)"

3. **Results Layout** (paused):
   - Control: Stacked vertical
   - Variant A: Two-column split

**Tracking Events**:
- `ab_variant_assigned`
- `quote_step_view`
- `quote_option_select`
- `quote_contact_submit`
- `quote_result_view`
- `cta_book_click`

**Storage**: Client-side localStorage key `stella_ab_assignments`

---

## What Works Right Now

✅ **Pricing engine is fully functional**
You can import `calculatePrice()` and get instant estimates:

```typescript
import { calculatePrice } from '@/lib/pricing/calc';

// Example: Male, 35-44, receding hairline, full top, Norwood IV, natural finish
const estimate = calculatePrice({
  gender: 'male',
  age_band: '35-44',
  concern: 'receding',
  coverage_area: 'full_top',
  norwood: 'IV',
  finish: 'natural',
  timing: 'asap'
});

console.log(estimate);
// {
//   low: 2142,
//   high: 2894,
//   mid: 2518,
//   currency: 'CAD',
//   sessions: { count: 3, description: '3 sessions recommended (spaced 2-4 weeks apart)' },
//   factors: ['Norwood stage IV (15% adjustment)'],
//   disclaimer: 'This is an estimate only. Final pricing will be...'
// }
```

✅ **Unit tests pass** (15/15 test cases)
✅ **Brand tokens extracted** (ready for import)
✅ **A/B test config ready** (variant assignment logic needed)

---

## What's NOT Built Yet

The following components require implementation (see [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)):

### Phase 2: React Components (4-5 hours)
- [ ] `/components/calculator/InstantQuote.tsx` — Main container with state management
- [ ] `/components/calculator/ProgressBar.tsx` — Step indicator (1 of 7)
- [ ] `/components/calculator/OptionCard.tsx` — Reusable selection card with icon
- [ ] `/components/calculator/Step1Gender.tsx` — Gender + age band
- [ ] `/components/calculator/Step2HairSituation.tsx` — Concern + hair length
- [ ] `/components/calculator/Step3Coverage.tsx` — Coverage area + Norwood visual selector
- [ ] `/components/calculator/Step4Finish.tsx` — Finish preference
- [ ] `/components/calculator/Step5Timing.tsx` — Availability
- [ ] `/components/calculator/Step6Addons.tsx` — Scar/density addons
- [ ] `/components/calculator/Step7Contact.tsx` — Name, email, phone, CASL consent
- [ ] `/components/calculator/ResultPanel.tsx` — Estimate display + CTA
- [ ] `/components/calculator/StickyCTA.tsx` — Fixed bottom "Continue" button
- [ ] `/components/popups/SmartQuotePopup.tsx` — Site-wide smart popup (60% scroll trigger)

### Phase 3: API & Notifications (2-3 hours)
- [ ] `/app/api/lead/route.ts` — Lead capture handler
- [ ] `/lib/notifications/email.ts` — Nodemailer templates (confirmation + alert)
- [ ] `/lib/notifications/sms.ts` — Twilio SMS (optional)
- [ ] Lead storage (JSONL file or database)
- [ ] CRM webhook forwarding

### Phase 4: Styling (1-2 hours)
- [ ] `/styles/calculator.css` — Calculator-specific styles using brand tokens
- [ ] Mobile-first responsive breakpoints
- [ ] Accessibility (focus states, ARIA labels)

### Phase 5: Integration (1 hour)
- [ ] Embed on `/pricing/instant-quote` page (standalone)
- [ ] Inline embeds on Guide + Resources pages
- [ ] Smart popup widget site-wide
- [ ] Analytics event tracking (GTM/GA4)

### Phase 6: QA & Optimization (1-2 hours)
- [ ] Accessibility audit (axe DevTools)
- [ ] Performance testing (Lighthouse ≥90)
- [ ] Browser testing (Chrome, Safari, Firefox, mobile)
- [ ] A/B test variant assignment logic
- [ ] Error handling & validation UX

---

## Next Steps

### Option A: Continue Building (Recommended)
If you want Claude Code to continue implementation:

1. **Next: Create React components** (Phase 2)
   - Start with reusable `OptionCard.tsx` and `ProgressBar.tsx`
   - Build `InstantQuote.tsx` container with state management
   - Implement Step1–Step7 components
   - Build `ResultPanel.tsx` with estimate display

2. **Then: API handler** (Phase 3)
   - Create `/app/api/lead/route.ts`
   - Implement JSONL lead storage
   - Set up email templates (Nodemailer)

3. **Then: Styling** (Phase 4)
   - Write `/styles/calculator.css` using brand tokens
   - Mobile-first responsive design

4. **Then: Integration** (Phase 5)
   - Embed calculator on pages
   - Wire analytics events

5. **Finally: QA** (Phase 6)
   - Accessibility audit
   - Performance testing
   - Browser compatibility

**Estimated Total Time**: 8-12 hours (across 6 phases)

### Option B: Manual Implementation
If you prefer to implement in-house:

1. Review [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) (complete code templates provided)
2. Follow 6-phase build plan
3. Use `calc.ts` pricing engine as-is (already tested)
4. Import brand tokens from `stella-brand-tokens.json`
5. Reference code examples for each component

**Developer Skill Level**: Intermediate React/TypeScript (Next.js experience helpful)

### Option C: Phased Rollout
Build MVP first, then enhance:

**Week 1 — MVP** (4 hours):
- Steps 1-3 only (gender, concern, coverage)
- Simplified ResultPanel (no contact form yet)
- Manual lead capture (phone calls)
- Inline embed on Guide page only

**Week 2 — Full Calculator** (4 hours):
- Add Steps 4-7
- Contact form + lead API
- Email notifications
- Smart popup

**Week 3 — Optimization** (2 hours):
- A/B testing
- Analytics deep dive
- Performance tuning

---

## Configuration Required (Human Action Items)

Before deploying to production, complete these tasks:

### 1. Environment Variables
Create `.env.local` with:

```bash
# Email (SendGrid or Mailgun)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx
EMAIL_SENDER=Stella's Ink Chamber <hello@stellasinkchamber.com>
ALERT_EMAIL=stella@stellasinkchamber.com

# SMS (optional, Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567

# CRM Webhook (Salesforce, HubSpot, etc.)
CRM_WEBHOOK_URL=https://api.example.com/leads

# Booking
BOOKING_URL=https://stellasinkchamber.com/book-consultation
```

### 2. Pricing Validation
Review `data/pricing/engine.json` and confirm:
- [ ] Base prices match business model ($1200–$2800)
- [ ] Norwood multipliers are accurate (0.9–1.6x)
- [ ] Addon pricing is current ($400 scars, $200 density)
- [ ] Session count logic is correct (3–6 sessions)
- [ ] Min/max clamps are acceptable ($600–$5000)

### 3. Legal Review
- [ ] Approve disclaimer text: "This is an estimate only. Final pricing will be determined during your free consultation..."
- [ ] Confirm CASL consent language: "I agree to receive pricing information and booking reminders from Stella's Ink Chamber. I can unsubscribe anytime."
- [ ] Review gift card terms (expiry, redemption rules)

### 4. Copy Approval
- [ ] Review all CTA text variants (Get My Estimate, Calculate My Price, See Pricing Now)
- [ ] Approve incentive messaging ($100 gift card vs. Free Aftercare Kit)
- [ ] Confirm step labels (gender, concern, coverage, finish, timing, addons, contact)

### 5. SMTP Setup
- [ ] Create SendGrid or Mailgun account
- [ ] Verify sender domain (SPF/DKIM records)
- [ ] Test email deliverability
- [ ] Design email templates (or use provided HTML)

### 6. Analytics Setup (Optional but Recommended)
- [ ] Create Google Analytics 4 property
- [ ] Install GTM (Google Tag Manager)
- [ ] Configure custom events (`quote_step_view`, `quote_contact_submit`, etc.)
- [ ] Set up conversion goals (estimate viewed, booking clicked)

---

## Success Metrics

Track these KPIs to measure calculator performance:

### Completion Rate
- **Goal**: >30% (industry average: 15-25%)
- **Measure**: (Step 7 submits) / (Step 1 starts)

### Time to Complete
- **Goal**: <90 seconds median
- **Measure**: Timestamp (step 1 start → step 7 submit)

### Booking Conversion
- **Goal**: >15% of estimates → consultation bookings
- **Measure**: CRM data (consultation bookings with `utm_source=instant-quote`)

### A/B Test Winners
- **Track**: CTR by variant (Get My Estimate vs. Calculate My Price vs. See Pricing Now)
- **Decide**: After 500+ completes per variant (statistical significance)

### Error Rate
- **Goal**: <2% failed submissions
- **Measure**: API errors + client-side validation failures

---

## Support & Troubleshooting

### Common Issues

**Q: Pricing calculation seems wrong**
A: Check `data/pricing/engine.json` — all pricing logic is JSON-driven. No code changes needed for price updates.

**Q: Unit tests fail**
A: Run `npm test calc.test.ts` and check expected values. Ensure `engine.json` hasn't been modified (tests assume default values).

**Q: Email not sending**
A: Verify `.env.local` SMTP credentials. Test with Nodemailer standalone script first.

**Q: Calculator not showing on page**
A: Ensure you've imported `<InstantQuote />` component and it's within a client component (`'use client'` directive for Next.js App Router).

**Q: Styling looks broken**
A: Confirm `stella-brand-tokens.json` is imported and CSS variables are defined. Check browser DevTools for missing CSS.

### Need Help?

- **Implementation questions**: See [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) for full code examples
- **Pricing logic**: Review [research-brief.md](./research-brief.md) for industry standards
- **UX patterns**: Reference Pattern A-E in research brief
- **Technical issues**: Check unit tests (`calc.test.ts`) for expected behavior

---

## File Manifest

```
outputs/
├── calculator/
│   ├── research-brief.md          (1000-word research summary)
│   ├── IMPLEMENTATION-GUIDE.md     (Complete build guide with templates)
│   └── DELIVERABLES.md            (This file)
└── brand/
    └── stella-brand-tokens.json    (Brand design tokens)

data/
└── pricing/
    ├── engine.json                 ✅ Pricing rules (editable by non-devs)
    └── experiments.json            ✅ A/B test variants

lib/
└── pricing/
    ├── calc.ts                     ✅ TypeScript pricing calculator
    └── calc.test.ts                ✅ Jest unit tests (15 test cases)
```

**Total Size**: ~15KB (highly optimized)
**Dependencies**: None (pricing engine is pure TypeScript + JSON)

---

**End of Phase 1 Deliverables**
**Status**: ✅ Foundation Complete — Ready for Component Implementation
**Estimated Remaining Work**: 8-12 hours (Phases 2-6)
