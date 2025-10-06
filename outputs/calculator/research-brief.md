# Instant SMP Price Calculator — Research Brief

**Date**: 2025-10-05
**Project**: Production-ready instant price estimator for Stella's Ink Chamber
**Research Sources**: Web research on SMP pricing + calculator UX best practices (2025)

---

## Executive Summary

Based on analysis of SMP industry pricing (2025) and calculator UX best practices, users expect:
- **Instant estimates** with no waiting or form submission delays
- **Multiple-choice simplicity** (3-7 steps max, <30 seconds to complete)
- **Transparent pricing ranges** with clear explanations of what affects cost
- **Low-friction contact capture** positioned AFTER value delivery (showing estimate)
- **Trust signals**: disclaimers, expert positioning, realistic expectations

---

## 1. SMP Industry Pricing Standards (2025)

### Typical Price Ranges
- **Full scalp treatment**: $2,500–$4,200 CAD (3 sessions average)
- **Partial/Crown work**: $1,500–$2,500 CAD
- **Scar camouflage**: $1,200–$2,000 CAD per scar/area
- **Per-session pricing**: $995–$1,095 USD average

### Key Pricing Factors
1. **Treatment area size** (hairline only vs full scalp)
2. **Norwood scale** (stage II–VII affects density/sessions)
3. **Session count** (2–4 sessions typical)
4. **Add-ons** (scar work, density enhancement, women's parting)
5. **Geographic location** (urban premium vs smaller markets)

### Industry Messaging Patterns
- "Invest in quality, not cheapest option" (positioning against low-cost competitors)
- Transparent session breakdown (vs opaque "package" pricing)
- Photo upload for personalized estimates (Norwood assessment)
- Emphasis on "estimate only, consultation required for final quote"

---

## 2. Calculator UX Best Practices (Cross-Industry, 2025)

### Pattern 1: Progressive Disclosure (Multi-Step)
**What it is**: Break complex questions into 3–7 sequential steps with visual progress indicator
**Why it works**: Reduces cognitive load, increases completion rate vs single long form
**Implementation**:
- Show 1 question per screen (mobile-first)
- Progress bar (e.g., "Step 3 of 7")
- Back button always visible
- Auto-save answers (no data loss)

**Example**: Baremetrics pricing calculator uses slider inputs with real-time price updates per step

### Pattern 2: Visual Option Cards (Icon-Driven Selection)
**What it is**: Replace radio buttons/dropdowns with large, iconographic clickable cards
**Why it works**: Faster scanning, more engaging, better mobile touch targets
**Implementation**:
- 2–4 options per step (avoid choice paralysis)
- Icons/illustrations for each option
- Selected state with accent color + checkmark
- Descriptive labels (2–5 words) + optional helper text

**Example**: Teamdeck's seat calculator uses evolving illustrations (boat → yacht → cruise ship) as user adjusts inputs

### Pattern 3: Instant Results (No Email Gate Before Estimate)
**What it is**: Show pricing range/estimate IMMEDIATELY after final question, THEN ask for contact info
**Why it works**: Delivers value first, reduces abandonment, builds trust
**Implementation**:
- Display estimate on dedicated results screen
- Range format (low–high) vs single number (manages expectations)
- "What affects your price" explainer bullets
- Contact form below estimate (not before)

**Industry stat**: Automated quote tools that deliver instant results see 40%+ higher conversion vs "we'll email you"

### Pattern 4: Sticky CTA & Micro-Commitments
**What it is**: Persistent "Next" button, secondary actions like "Email me this estimate"
**Why it works**: Reduces decision fatigue, keeps momentum through flow
**Implementation**:
- Fixed bottom bar with "Continue" button (mobile)
- Optional "Skip" for non-required steps
- "Email estimate" checkbox (checked by default) on results screen

### Pattern 5: Trust & Compliance Signals
**What it is**: Disclaimers, privacy notes, "estimate only" language, expert positioning
**Why it works**: Manages expectations, builds credibility, meets legal requirements (CASL in Canada)
**Implementation**:
- "This is an estimate; final price requires consultation" (above estimate)
- CASL-compliant consent: "I agree to receive messages... unsubscribe anytime"
- Privacy link, testimonial snippet, or credential badge
- Optional: Live chat widget ("Questions? Ask now")

---

## 3. Conversion Enhancers (Tested Tactics)

### Incentive Positioning
- **Gift cards**: "$100 off when you book consultation this month" (limited-time urgency)
- **ROI messaging**: "Compare to hair transplant: Save $8,000+"
- **Risk reversal**: "Free patch test" or "Money-back guarantee on session 1"

### Urgency (Non-Deceptive)
- "3 consultation slots available this week" (real scarcity)
- "Intro pricing ends [EOM date]" (if true)
- "Book today, start next week" (speed to value)

### Social Proof Micro-Moments
- Testimonial snippet on results screen
- "500+ happy clients in Alberta"
- Before/after thumbnail gallery link

---

## 4. Compliance & Disclaimers (Canada-Specific)

### CASL Requirements
- **Explicit consent**: Checkbox (not pre-checked) for marketing messages
- **Clear language**: "You will receive pricing info and booking reminders. Unsubscribe anytime."
- **Identification**: Who's sending (Stella's Ink Chamber) + contact info
- **Opt-out**: Link to unsubscribe in all emails

### Medical/Cosmetic Disclaimers
- "Results vary" (standard cosmetic disclaimer)
- "This is an estimate only; final pricing determined during consultation"
- "SMP is a cosmetic procedure; consult a doctor for medical hair loss"

---

## 5. Five Concrete UX Patterns to Implement

### ✅ Pattern A: 7-Step Visual Flow
- Step 1: Gender/Age (2 cards: Male/Female/Non-binary + age dropdown)
- Step 2: Hair situation (6 cards with icons: Receding, Thinning, Alopecia, Scars, Full shave, Not sure)
- Step 3: Coverage area + Norwood (visual selector with illustrations)
- Step 4: Finish preference (3 cards: Natural, Defined, Need guidance)
- Step 5: Timing (3 cards: ASAP, 2–4 weeks, Researching)
- Step 6: Add-ons (checkboxes: Scar camouflage, Women's density)
- Step 7: Contact info (name, email, phone, consent checkbox)
- **Results**: Instant estimate range + session plan + booking CTA

### ✅ Pattern B: Real-Time Price Preview
- Floating price chip (top-right corner) updates as user selects options
- Shows running estimate: "$2,200–$2,800" (before contact submission)
- Builds anticipation, reduces surprise

### ✅ Pattern C: Smart Popup Trigger
- Trigger: 60% scroll on Cost section OR exit-intent (desktop) OR 20s dwell on Pricing page
- Popup shows condensed Step 1–3, then links to full calculator
- 24-hour suppression cookie (localStorage key: `stella_quote_popup_closed`)

### ✅ Pattern D: Email-First Results Delivery
- On contact submit: Show estimate immediately on-screen
- Simultaneously send email with estimate PDF + booking link + $100 gift card note
- Optional SMS if consented (short nudge: "Your SMP estimate: $X–$Y. Book now: [link]")

### ✅ Pattern E: A/B Test Hooks
- JSON config for variants:
  - CTA text: "Get My Estimate" vs "Calculate My Price" vs "See Pricing Now"
  - Incentive: "$100 gift card" vs "Free aftercare kit" vs "Priority booking"
  - Results layout: Table vs card grid vs side-by-side comparison
- Fire `ab_variant` event on page load with variant ID

---

## 6. Friction Points to Avoid

Based on competitor analysis and UX audits:

❌ **Don't**: Ask for contact info before showing estimate (kills conversion)
✅ **Do**: Deliver value first (estimate), then capture contact

❌ **Don't**: Use free-text inputs ("Describe your hair loss...") — confusing & slow
✅ **Do**: Multiple-choice only (faster, easier, better data)

❌ **Don't**: Show vague ranges ("$1,000–$5,000") without explanation
✅ **Do**: Narrow range ($2,200–$2,800) + bullets explaining what affects it

❌ **Don't**: "We'll email you within 24 hours"
✅ **Do**: Instant on-screen estimate + confirmation email sent immediately

❌ **Don't**: Auto-play video or chatbot popup during calculator (distracting)
✅ **Do**: Minimal UI, focus on flow, offer help after completion

---

## 7. Technical Recommendations

### Mobile-First Design
- Single-column layout
- Large touch targets (48px min)
- Fixed bottom CTA bar
- Minimal scrolling per step

### Performance
- Lazy-load popup bundle (not on page load)
- Inline critical CSS
- Optimize icons (SVG, <5KB each)
- Target: <2s load, <100ms interaction response

### Accessibility
- WCAG AA: 4.5:1 contrast, keyboard navigable, focus visible
- Labels linked to inputs (`aria-describedby` for helper text)
- Error states with clear messaging
- Screen reader announcements for step changes

### Analytics Events
Track these for optimization:
- `quote_step_view` (step_number, variant)
- `quote_option_select` (step, option, value)
- `quote_contact_submit` (has_phone, has_consent)
- `quote_result_view` (estimate_low, estimate_high, recommended_sessions)
- `cta_book_click`, `popup_open`, `popup_close`

---

## 8. Competitive Gaps (Opportunities)

Most SMP sites DON'T have:
- Instant calculator (rely on consultation forms)
- Visual Norwood selector (use text descriptions)
- Gift card incentive positioning
- A/B testing infrastructure
- Automated email/SMS follow-up

**Stella's advantage**: First-to-market with instant, visual, incentivized calculator in Canadian SMP space.

---

## 9. Copy Tone & Voice (Canada-Localized)

**Brand voice**: Calm, expert, empathetic, no hype, Canadian spelling
**Do's**:
- "Get your personalized estimate in 30 seconds"
- "This is an estimate; final pricing requires a quick consultation"
- "Join 500+ Albertans who've restored their confidence"

**Don'ts**:
- ❌ "Limited time!" (unless true)
- ❌ Medical claims ("cure baldness")
- ❌ Overpromising ("guaranteed results")

**CASL-compliant consent**:
"I agree to receive pricing information and booking reminders from Stella's Ink Chamber. I can unsubscribe anytime."

---

## 10. Next Steps (Build Phase)

1. ✅ Create pricing engine (`/data/pricing/engine.json` + `/lib/pricing/calc.ts`)
2. ✅ Build 7-step component flow (`/components/calculator/Step1.tsx` ... `Step7.tsx`)
3. ✅ Implement results panel with estimate + CTA
4. ✅ Wire API lead handler (`/api/lead`) + email/SMS notifications
5. ✅ Style with Stella brand tokens (no hardcoded colors/fonts)
6. ✅ Embed inline (Guide, Resources) + smart popup
7. ✅ Add analytics events + A/B test hooks
8. ✅ QA: accessibility audit, performance test, unit tests
9. ✅ Deploy + monitor conversion funnel

---

**End of Research Brief**
**Approved patterns**: 5 (A–E above)
**Estimated build time**: 8–12 hours (including QA)
**Success metric**: >30% completion rate (step 1 → contact submit)
