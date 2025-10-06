# Calculator Component Inventory

**Date**: October 5, 2025  
**Status**: Architecture & Quarantine Complete

## Classification Summary

| Type | Count | Status |
|------|-------|--------|
| ✅ GOOD (Production) | 20 files | Approved for use |
| ⚠️ DEMO (Static HTML) | 2 files | Quarantined to `/legacy/` |
| 📊 Data/Config | 3 files | Stable |
| 🔧 Utilities | 2 files | Stable |

---

## ✅ GOOD - Production React Components

### Core Container
| File | Type | Purpose | Uses Brand Components | Has A11y | Reads Data |
|------|------|---------|---------------------|----------|-----------|
| `components/calculator/InstantQuote.tsx` | Container | Main wizard orchestrator | ✅ | ✅ | ✅ `/data/pricing/engine.json` |

### UI Components
| File | Type | Purpose | Brand Tokens | A11y |
|------|------|---------|-------------|------|
| `components/calculator/OptionCard.tsx` | UI | Multi-choice card button | ✅ CSS vars | ✅ aria-pressed, keyboard |
| `components/calculator/ProgressBar.tsx` | UI | Step progress indicator | ✅ CSS vars | ✅ aria-valuenow |
| `components/calculator/ResultPanel.tsx` | UI | Estimate display + CTAs | ✅ CSS vars | ✅ Semantic HTML |
| `components/calculator/StickyCTA.tsx` | UI | Fixed bottom nav | ✅ CSS vars | ✅ Focus management |
| `components/calculator/InlineBlock.tsx` | Wrapper | Embed wrapper (guide/resource/city) | ✅ CSS vars | ✅ |

### Step Components (Version A - Used by InstantQuote.tsx)
| File | Purpose | Uses OptionCard | A11y |
|------|---------|------------------|------|
| `components/calculator/Step1Gender.tsx` | Gender + Age selection | ✅ | ✅ |
| `components/calculator/Step2HairSituation.tsx` | Concern + hair length | ✅ | ✅ |
| `components/calculator/Step3Coverage.tsx` | Coverage area + Norwood | ✅ | ✅ |
| `components/calculator/Step4Finish.tsx` | Finish preference | ✅ | ✅ |
| `components/calculator/Step5Timing.tsx` | Timeline selection | ✅ | ✅ |
| `components/calculator/Step6Addons.tsx` | Optional add-ons | ✅ | ✅ |
| `components/calculator/Step7Contact.tsx` | Lead capture + CASL | ✅ | ✅ |

### Step Components (Version B - Older)
| File | Status | Notes |
|------|--------|-------|
| `components/calculator/Step1.tsx` | 🔄 Duplicate | Older implementation, move to legacy |
| `components/calculator/Step2.tsx` | 🔄 Duplicate | Older implementation, move to legacy |
| `components/calculator/Step3.tsx` | 🔄 Duplicate | Older implementation, move to legacy |
| `components/calculator/Step4.tsx` | 🔄 Duplicate | Older implementation, move to legacy |
| `components/calculator/Step5.tsx` | 🔄 Duplicate | Older implementation, move to legacy |
| `components/calculator/Step6.tsx` | 🔄 Duplicate | Older implementation, move to legacy |
| `components/calculator/Step7.tsx` | 🔄 Duplicate | Older implementation, move to legacy |

### Popups & Modals
| File | Purpose | Brand | A11y |
|------|---------|-------|------|
| `components/popups/SmartQuotePopup.tsx` | Site-wide popup trigger | ✅ | ✅ |

---

## ⚠️ DEMO - Static HTML (Quarantined)

| File | Issue | Action Taken |
|------|-------|--------------|
| `instant-quote-demo.html` | Contains `alert()` popups, no real logic | ➡️ Moved to `/legacy/calculator/DEMO-instant-quote.html` |
| `outputs/calculator/_backup/instant-quote-demo-original.html` | Backup of broken demo | ➡️ Moved to `/legacy/calculator/BACKUP-instant-quote-demo.html` |

**Current Production HTML**: `instant-quote.html` (vanilla JS, fully functional)

---

## 📊 Data & Configuration

| File | Purpose | Format | Stable |
|------|---------|--------|--------|
| `data/pricing/engine.json` | Pricing rules (base, multipliers, add-ons) | JSON | ✅ |
| `data/pricing/experiments.json` | A/B test config | JSON | ✅ |
| `data/experiments/quote-embeds.json` | Embed variants config | JSON | ✅ |

---

## 🔧 Utilities & Logic

| File | Purpose | Tests | Used By |
|------|---------|-------|---------|
| `lib/pricing/calc.ts` | Price calculation engine | ✅ `calc.test.ts` | React components |
| `lib/pricing-calc.js` | Standalone JS version | ❌ | `instant-quote.html` |

---

## API Routes

| File | Purpose | Status |
|------|---------|--------|
| `app/api/lead/route.ts` | Lead submission endpoint | ✅ Production ready |

---

## Pages & Routes

| File | Purpose | Status |
|------|---------|--------|
| `app/pricing/instant-quote/page.tsx` | Next.js page (calculator route) | ✅ Uses `InstantQuote.tsx` |

---

## Decision: Canonical Build

### ✅ **Approved for Production**

**Main Component**: `components/calculator/InstantQuote.tsx`

**Step Components** (Version A - `Step1Gender.tsx` through `Step7Contact.tsx`):
- ✅ Uses modern `onUpdate` callback pattern
- ✅ Properly typed with TypeScript
- ✅ Imports from approved `OptionCard.tsx`
- ✅ Brand compliant (CSS vars only)
- ✅ Fully accessible

**Reasoning**: The `Step*Gender.tsx` naming convention is more descriptive and the components use a cleaner API design.

### 🔄 **Move to Legacy**

**Older Step Components** (`Step1.tsx` through `Step7.tsx`):
- Different callback pattern (`onAnswerChange` with step number)
- Less clear naming
- Functionally equivalent but older architecture

**Action**: Quarantine to `/legacy/calculator/v1/` for reference

---

## Import Rules

### ✅ **ALLOWED** (after index.ts created)

```ts
import { InstantQuote } from '@/components/calculator';
import { OptionCard } from '@/components/calculator';
import { ProgressBar } from '@/components/calculator';
import { ResultPanel } from '@/components/calculator';
import { SmartQuotePopup } from '@/components/popups';
```

### ❌ **BANNED** (CI will fail)

```ts
// NO direct step imports
import Step1 from '@/components/calculator/Step1';

// NO legacy imports
import { Step1 } from '@/legacy/calculator/v1/Step1';

// NO demo HTML
<script src="instant-quote-demo.html">
```

---

## Files Summary

### Keep (27 files):
- ✅ 1× Main container (`InstantQuote.tsx`)
- ✅ 5× UI components (OptionCard, ProgressBar, ResultPanel, StickyCTA, InlineBlock)
- ✅ 7× Step components (Step1Gender → Step7Contact)
- ✅ 1× Popup component (SmartQuotePopup)
- ✅ 3× Data files (engine.json, experiments.json, quote-embeds.json)
- ✅ 2× Logic files (calc.ts, pricing-calc.js)
- ✅ 1× API route (route.ts)
- ✅ 1× Page route (page.tsx)
- ✅ 1× Production HTML (instant-quote.html)
- ✅ 3× Styles (calculator.css, smart-popup.css, inline-block.css)
- ✅ 1× Test file (calc.test.ts)

### Quarantine (9 files):
- ⚠️ 7× Old step components (Step1.tsx → Step7.tsx) → `/legacy/calculator/v1/`
- ⚠️ 2× Demo HTML (instant-quote-demo.html, backup) → `/legacy/calculator/`

---

**Total Production Files**: 27  
**Total Quarantined Files**: 9

**Status**: ✅ Ready for canonical index.ts creation
