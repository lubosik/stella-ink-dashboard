# 🎯 Handoff to Cursor: Calculator Embedding Guide

**Status**: ✅ Production Ready  
**Date**: October 5, 2025  
**Architecture Locked**: Yes (CI guard active)

---

## 📦 The Only Import You Need

```typescript
import { InstantQuote } from '@/components/calculator';
```

**That's it.** Everything else is internal and forbidden by CI.

---

## 🚀 Quick Start (3 Examples)

### 1. Guide Page (Big SMP Guide)

```tsx
import { InstantQuote } from '@/components/calculator';

export default function SMPGuidePage() {
  return (
    <article>
      <h1>Complete SMP Guide</h1>
      
      {/* After "How Much Does SMP Cost?" section */}
      <section data-section="pricing">
        <InstantQuote
          variant="guide"
          prefill={{ topic: 'cost' }}
          onComplete={(estimate) => {
            // Optional: track conversion
            gtag('event', 'calculator_complete', { value: estimate.mid });
          }}
        />
      </section>
    </article>
  );
}
```

### 2. Resource Page (SMP for Women)

```tsx
import { InstantQuote } from '@/components/calculator';

export default function WomenSMPPage() {
  return (
    <article>
      <h1>SMP for Women in Canada</h1>
      
      {/* After "Results & Longevity" section */}
      <section data-section="longevity">
        <InstantQuote
          variant="resource"
          prefill={{ topic: 'women' }}
        />
      </section>
    </article>
  );
}
```

### 3. City Hub Page (Edmonton)

```tsx
import { InstantQuote } from '@/components/calculator';

export default function EdmontonPage() {
  return (
    <article>
      <h1>SMP in Edmonton, Alberta</h1>
      
      {/* After "Pricing" section */}
      <section data-section="pricing">
        <InstantQuote
          variant="city"
          prefill={{ city: 'edmonton' }}
        />
      </section>
    </article>
  );
}
```

---

## 📋 Full API Reference

```typescript
interface InstantQuoteProps {
  // Display variant (affects styling & copy)
  variant?: 'standalone' | 'inline' | 'popup';
  
  // Prefill data (optional)
  prefill?: {
    topic?: 'women' | 'alopecia' | 'scars' | 'hairline' | 'safety' | 'vs' | 'cost' | 'longevity';
    city?: string; // e.g., 'edmonton', 'calgary'
  };
  
  // Callbacks
  onComplete?: (estimate: PriceEstimate, inputs: QuoteInputs) => void;
}
```

---

## 🎨 Placement Strategy

### Guide Page (4 Placements)

1. **Hero CTA** (top of page)
   ```tsx
   <InstantQuote variant="inline" prefill={{ topic: 'cost' }} />
   ```

2. **After "Cost" Section** (mid-page)
   ```tsx
   <section data-section="cost">
     <InstantQuote variant="guide" prefill={{ topic: 'cost' }} />
   </section>
   ```

3. **After "Longevity" Section** (mid-page)
   ```tsx
   <section data-section="longevity">
     <InstantQuote variant="guide" prefill={{ topic: 'longevity' }} />
   </section>
   ```

4. **Bottom Banner** (end of page)
   ```tsx
   <InstantQuote variant="inline" />
   ```

### Resource Pages (3 Placements Each)

- **SMP for Women**: After "Process" → After "Longevity" → Bottom
- **SMP for Alopecia**: After "Results" → After "Cost" → Bottom
- **Scar Camouflage**: After "Pricing" → After "Results" → Bottom
- **Hairline Restoration**: After "Cost" → After "vs Hair Transplant" → Bottom
- **Safety Guide**: After "Risks" → After "Aftercare" → Bottom
- **SMP vs Alternatives**: After each comparison → Bottom

### City Hub Pages (1-2 Placements Each)

- **Province Hub** (Alberta): After "Pricing Across Alberta" section
- **City Pages** (Edmonton, Calgary, etc.): After "Local Pricing" section

---

## 🚫 What NOT to Do (CI Will Fail)

```typescript
// ❌ WRONG - Direct step import
import Step1Gender from '@/components/calculator/Step1Gender';

// ❌ WRONG - Legacy import
import { Step1 } from '@/legacy/calculator/v1/Step1';

// ❌ WRONG - Demo HTML reference
<script src="instant-quote-demo.html">

// ❌ WRONG - Custom import path
import { InstantQuote } from '@/components/calculator/InstantQuote';
```

All of the above will **fail CI** via `scripts/ban-demo-imports.mjs`.

---

## 📊 Data Flow

```
User Input (7 Steps)
      ↓
InstantQuote.tsx
      ↓
/lib/pricing/calc.ts
      ↓
/data/pricing/engine.json
      ↓
Price Estimate (low/mid/high)
      ↓
ResultPanel.tsx
      ↓
API POST /api/lead
      ↓
Email/SMS Notifications
```

**Key**: The pricing engine reads from `/data/pricing/engine.json` — no hardcoded prices in components.

---

## ✅ Pre-Deployment Checklist

Before embedding calculator:

- [ ] Verify `@/components/calculator/index.ts` exists
- [ ] Run `node scripts/ban-demo-imports.mjs` (should pass)
- [ ] Confirm `/data/pricing/engine.json` is deployed
- [ ] Test `/api/lead` endpoint is live
- [ ] Update booking URL in `ResultPanel.tsx` (line 14)
- [ ] Configure environment variables:
  - `NEXT_PUBLIC_BOOKING_URL`
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (for email)
  - `TWILIO_SID`, `TWILIO_TOKEN` (for SMS)

---

## 🎯 Success Metrics

Track these events in Google Analytics:

1. `quote_widget_open` - Calculator starts
2. `quote_step_view` - Step advances
3. `quote_contact_submit` - Lead captured (**PRIMARY CONVERSION**)
4. `cta_book_click` - Booking CTA clicked (**SECONDARY CONVERSION**)

**Goal**: 15%+ conversion rate (visitors → leads) within 30 days.

---

## 📁 File Structure

```
/components/calculator/
├── index.ts                    ← THE ONLY IMPORT PATH
├── InstantQuote.tsx           ← Main component
├── OptionCard.tsx             ← UI component
├── ProgressBar.tsx            ← UI component
├── ResultPanel.tsx            ← UI component
├── StickyCTA.tsx              ← UI component
├── InlineBlock.tsx            ← Wrapper component
├── Step1Gender.tsx            ← Step component (internal)
├── Step2HairSituation.tsx     ← Step component (internal)
├── Step3Coverage.tsx          ← Step component (internal)
├── Step4Finish.tsx            ← Step component (internal)
├── Step5Timing.tsx            ← Step component (internal)
├── Step6Addons.tsx            ← Step component (internal)
└── Step7Contact.tsx           ← Step component (internal)

/legacy/calculator/            ← ⚠️ QUARANTINED - DO NOT IMPORT
├── v1/                        ← Old step components
└── demos/                     ← Static HTML demos

/scripts/
└── ban-demo-imports.mjs       ← CI guard (run in precommit)

/data/pricing/
└── engine.json                ← Pricing rules (read by calc.ts)
```

---

## 🛠️ Troubleshooting

**Issue**: Calculator doesn't render  
**Fix**: Check that `/data/pricing/engine.json` exists and is valid JSON

**Issue**: CI fails with "Import from /legacy/calculator/ is forbidden"  
**Fix**: Change import to `import { InstantQuote } from '@/components/calculator'`

**Issue**: API POST fails  
**Fix**: Verify `/api/lead/route.ts` is deployed and environment variables are set

**Issue**: Styles not applying  
**Fix**: Confirm `/styles/calculator.css` is imported in root layout

---

## 📞 Support

- **Architecture Questions**: See `/outputs/calculator/component-inventory.md`
- **Brand Guidelines**: See `/outputs/calculator/brand-a11y-audit.md`
- **Recovery Notes**: See `/outputs/calculator/RECOVERY-NOTE.md`

---

**That's it. Use `InstantQuote` from `@/components/calculator` everywhere. CI will block anything else.**

✅ **You're ready to embed.**
