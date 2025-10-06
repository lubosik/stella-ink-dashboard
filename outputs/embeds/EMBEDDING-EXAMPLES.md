# Calculator Embedding Examples

**Purpose**: Show exactly how to embed calculator across all page types
**Copy/Paste Ready**: Use these code snippets directly

---

## Component Imports

```tsx
import InstantQuote from '@/components/calculator/InstantQuote';
import InlineBlock from '@/components/calculator/InlineBlock';
import SmartQuotePopup from '@/components/popups/SmartQuotePopup';
```

---

## 1. Big Guide Page (`/guides/smp-canada/`)

### A) Hero Sub-CTA (Above Fold)

```tsx
{/* After hero heading, before first paragraph */}
<div className="hero-cta-row">
  <a href="#instant-estimate" className="btn btn--primary">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l2.5 5 5.5.5-4 4 1 5.5L8 13l-5 3 1-5.5-4-4 5.5-.5L8 1z"/>
    </svg>
    Instant estimate — see your price now
  </a>
  <a href="/book-consultation" className="btn btn--secondary">
    Book Free Consultation
  </a>
</div>
```

### B) After Cost Section (Inline Widget)

```tsx
{/* After </section> with data-section="cost" */}
<section id="instant-estimate" data-section="pricing">
  <InlineBlock
    variant="guide"
    prefill={{ topic: 'cost' }}
    leadIn="Most clients want a ballpark now — get yours instantly."
    showBadge={true}
  />
</section>
```

### C) Within Longevity Section (Modal Link)

```tsx
{/* After first 2 paragraphs in Longevity section */}
<p>
  SMP typically lasts 3-5 years before requiring touch-ups. Factors like skin type,
  sun exposure, and aftercare affect longevity.{' '}
  <button
    onClick={() => setShowModal(true)}
    className="inline-link"
  >
    Check your price now (instant)
  </button>{' '}
  to understand the long-term investment.
</p>

{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <InstantQuote variant="inline" />
      <button onClick={() => setShowModal(false)}>Close</button>
    </div>
  </div>
)}
```

### D) Bottom Banner (Before Final CTA)

```tsx
{/* Before footer/final CTA section */}
<div className="guide-bottom-banner" data-section="final-cta">
  <div className="banner-content">
    <span className="badge-instant">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1l2.5 5 5.5.5-4 4 1 5.5L8 13l-5 3 1-5.5-4-4 5.5-.5L8 1z"/>
      </svg>
      Instant
    </span>
    <h3>Ready to see your personalized estimate?</h3>
    <p>Get your SMP pricing in 60 seconds — no waiting, no email required.</p>
    <button
      onClick={() => setShowModal(true)}
      className="btn btn--primary btn--large"
    >
      Get Instant Estimate
    </button>
  </div>
</div>
```

---

## 2. Resource Pages (6 Topics)

### A) Women's SMP (`/resources/smp-for-women`)

#### After "Sessions, timeline, and comfort" H2

```tsx
<section data-section="women">
  <h2>Sessions, Timeline, and Comfort</h2>
  {/* ... existing content ... */}

  <InlineBlock
    variant="resource"
    prefill={{ topic: 'women' }}
    leadIn="No waiting. Get your SMP estimate instantly."
    showBadge={true}
  />
</section>
```

#### Above FAQs Block (Small Variant)

```tsx
{/* Before FAQs section */}
<div className="inline-block inline-block--compact">
  <div className="inline-block__header">
    <span className="inline-block__badge">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1l2.5 5 5.5.5-4 4 1 5.5L8 13l-5 3 1-5.5-4-4 5.5-.5L8 1z"/>
      </svg>
      Instant
    </span>
    <strong>Quick estimate available</strong>
  </div>
  <button onClick={() => setShowModal(true)} className="btn btn--secondary btn--small">
    Get Your Price Now
  </button>
</div>
```

#### First Paragraph Link (Modal)

```tsx
<p>
  SMP for women focuses on density restoration rather than full hairline recreation.{' '}
  <button onClick={() => setShowModal(true)} className="inline-link">
    Check your price now (instant)
  </button>{' '}
  to understand the investment for your specific needs.
</p>
```

### B) Alopecia (`/resources/alopecia-smp`)

```tsx
{/* After "Patch blending strategies" H2 */}
<section data-section="alopecia">
  <h2>Patch Blending Strategies</h2>
  {/* ... content ... */}

  <InlineBlock
    variant="resource"
    prefill={{ topic: 'alopecia' }}
    leadIn="See your estimate now — then book a consult for a firm quote."
  />
</section>

{/* Before "Realistic expectations" summary */}
<div className="compact-cta">
  <span className="badge-instant">Instant</span>
  <button onClick={() => setShowModal(true)} className="btn btn--primary">
    Get Instant Estimate
  </button>
</div>

{/* In candidacy table caption */}
<figcaption>
  Alopecia candidacy criteria.{' '}
  <button onClick={() => setShowModal(true)} className="inline-link">
    Instant estimate
  </button>
</figcaption>
```

### C) Scar Camouflage (`/resources/scar-camouflage-smp`)

```tsx
{/* After "FUT vs FUE specifics" H2 */}
<section data-section="scars">
  <h2>FUT vs FUE Scar Specifics</h2>
  {/* ... content ... */}

  <InlineBlock
    variant="resource"
    prefill={{ topic: 'scars' }}
    leadIn="Most clients want a ballpark now — get yours in seconds."
  />
</section>

{/* After "Session count & spacing" */}
<div className="inline-cta-small">
  <span className="badge-instant">Instant</span>
  <button onClick={() => setShowModal(true)}>See Your Price</button>
</div>

{/* Under first image figure */}
<figcaption>
  Before and after FUT scar camouflage.{' '}
  <button onClick={() => setShowModal(true)} className="inline-link">
    See your estimate now
  </button>
</figcaption>
```

### D) Hairline Design (`/resources/hairline-design-smp`)

```tsx
{/* After "Hairline philosophies" H2 */}
<section data-section="hairline">
  <h2>Hairline Design Philosophies</h2>
  {/* ... content ... */}

  <InlineBlock
    variant="resource"
    prefill={{ topic: 'hairline' }}
    leadIn="No waiting. Get your SMP estimate instantly."
  />
</section>

{/* After "Consult & templating" H2 */}
<div className="compact-cta">
  <span className="badge-instant">Instant</span>
  <button onClick={() => setShowModal(true)}>Get Instant Estimate</button>
</div>

{/* Near face-shape diagram */}
<figure>
  <img src="/images/face-shapes.jpg" alt="Face shapes" />
  <figcaption>
    Face shape considerations.{' '}
    <button onClick={() => setShowModal(true)} className="inline-link">
      What would this cost?
    </button>
  </figcaption>
</figure>
```

### E) Safety (`/resources/is-smp-safe-canada`)

```tsx
{/* After "Pigments 101" H2 */}
<section data-section="safety">
  <h2>Pigments 101: Carbon vs Organic</h2>
  {/* ... content ... */}

  <InlineBlock
    variant="resource"
    prefill={{ topic: 'safety' }}
    leadIn="Curious about cost as well? Get your instant estimate."
  />
</section>

{/* After "What reputable studios won't do" */}
<div className="inline-cta-small">
  <span className="badge-instant">Instant</span>
  <button onClick={() => setShowModal(true)}>See Your Price</button>
</div>

{/* In disclaimer area */}
<aside className="disclaimer-box">
  <p>
    Always verify studio certifications and pigment quality.{' '}
    <button onClick={() => setShowModal(true)} className="inline-link">
      Get instant pricing estimate
    </button>{' '}
    to compare costs at reputable studios.
  </p>
</aside>
```

### F) VS Comparison (`/resources/smp-vs-hair-transplant-vs-prp`)

```tsx
{/* Immediately after comparison table */}
<section data-section="vs">
  <table>
    {/* ... comparison table ... */}
  </table>

  <InlineBlock
    variant="resource"
    prefill={{ topic: 'vs' }}
    leadIn="Most clients want a ballpark now — get yours in seconds."
  />
</section>

{/* After "Combo pathways" section */}
<div className="compact-cta">
  <span className="badge-instant">Instant</span>
  <button onClick={() => setShowModal(true)}>Get Instant Estimate</button>
</div>

{/* In "At-a-glance" caption */}
<figcaption>
  At-a-glance comparison.{' '}
  <button onClick={() => setShowModal(true)} className="inline-link">
    See SMP pricing
  </button>
</figcaption>
```

---

## 3. Gallery & Reviews Pages

### Sidebar (Desktop) + Inline (Mobile)

```tsx
{/* Desktop: Right rail */}
<aside className="sidebar-calculator hidden-mobile">
  <div className="sticky-container">
    <InlineBlock
      variant="sidebar"
      leadIn="See what your transformation would cost"
      showBadge={true}
    />
  </div>
</aside>

{/* Mobile: After hero, before gallery grid */}
<div className="mobile-calculator visible-mobile">
  <InlineBlock
    variant="guide"
    leadIn="Get your instant estimate"
    showBadge={true}
  />
</div>

{/* Under first Before/After figure */}
<figure>
  <img src="/gallery/before-after-1.jpg" alt="Before and after" />
  <figcaption>
    Norwood V, 3 sessions.{' '}
    <button onClick={() => setShowModal(true)} className="inline-link">
      What would this cost for me? (instant)
    </button>
  </figcaption>
</figure>
```

---

## 4. Alberta Location Pages

### Province Hub (`/ab/`)

```tsx
<section data-section="alberta">
  <h2>Why Alberta Clients Choose Stella</h2>
  <p>
    Serving Edmonton, Calgary, Red Deer, and surrounding areas with Canada's
    leading SMP expertise.
  </p>

  <InlineBlock
    variant="city"
    leadIn="Alberta clients: Get your instant estimate now"
    showBadge={true}
  />
</section>
```

### City Hubs (Edmonton, Calgary, etc.)

```tsx
<section data-section="edmonton">
  <h2>SMP in Edmonton</h2>
  <p>Travel directions, parking, and local accommodation guide...</p>

  <InlineBlock
    variant="city"
    prefill={{ city: 'edmonton' }}
    leadIn="Edmonton pricing estimate — see your personalized cost"
    showBadge={true}
  />
</section>

{/* Desktop: Sticky sidebar */}
<aside className="sidebar-calculator-sticky">
  <InlineBlock
    variant="sidebar"
    prefill={{ city: 'edmonton' }}
    leadIn="Quick estimate for Edmonton clients"
  />
</aside>
```

---

## 5. Site-Wide Popup

### Root Layout

```tsx
// app/layout.tsx
import SmartQuotePopup from '@/components/popups/SmartQuotePopup';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SmartQuotePopup
          triggers={{
            scrollPercent: 60,
            exitIntent: true,
            dwellSeconds: 20,
            sections: ['cost', 'longevity', 'pricing', 'vs']
          }}
          suppress={{
            hours: 24,
            key: 'stella_quote_popup_suppressed'
          }}
          variant="popup"
          label="See Your Instant Estimate"
        />
      </body>
    </html>
  );
}
```

### Conditional Popup (Guide + Resources Only)

```tsx
// app/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import SmartQuotePopup from '@/components/popups/SmartQuotePopup';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showPopup = pathname?.startsWith('/guides/') || pathname?.startsWith('/resources/');

  return (
    <html>
      <body>
        {children}
        {showPopup && <SmartQuotePopup />}
      </body>
    </html>
  );
}
```

---

## 6. Add Semantic Anchors

### Guide Page

```tsx
<article>
  <section data-section="intro">
    <h2>What is SMP?</h2>
    {/* ... */}
  </section>

  <section data-section="cost">
    <h2>How Much Does SMP Cost in Canada?</h2>
    {/* ... */}
  </section>

  <section data-section="longevity">
    <h2>How Long Does SMP Last?</h2>
    {/* ... */}
  </section>

  <section data-section="pricing">
    <h2>Pricing Breakdown by Coverage Area</h2>
    {/* ... */}
  </section>
</article>
```

### Resource Page

```tsx
<article>
  <section data-section="women">
    <h2>SMP for Women: Density Enhancement</h2>
    {/* ... */}
  </section>

  <section data-section="women">
    <h2>Sessions, Timeline, and Comfort</h2>
    {/* Inline calculator here */}
  </section>
</article>
```

---

## 7. Modal Pattern (Reusable)

### Create Modal Component

```tsx
// components/CalculatorModal.tsx
'use client';

import { useState } from 'react';
import InstantQuote from './calculator/InstantQuote';

export function useCalculatorModal() {
  const [isOpen, setIsOpen] = useState(false);

  const CalculatorModal = () => {
    if (!isOpen) return null;

    return (
      <div
        className="modal-overlay"
        onClick={() => setIsOpen(false)}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <InstantQuote
            variant="inline"
            onComplete={() => setIsOpen(false)}
          />
        </div>
      </div>
    );
  };

  return {
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
    CalculatorModal
  };
}
```

### Usage

```tsx
// Any page component
import { useCalculatorModal } from '@/components/CalculatorModal';

export default function ResourcePage() {
  const { openModal, CalculatorModal } = useCalculatorModal();

  return (
    <article>
      <p>
        SMP costs vary by coverage area.{' '}
        <button onClick={openModal} className="inline-link">
          Check your price now (instant)
        </button>
      </p>

      <CalculatorModal />
    </article>
  );
}
```

---

## 8. CSS for Inline CTAs

```css
/* Inline link style */
.inline-link {
  background: none;
  border: none;
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-fast);
}

.inline-link:hover {
  color: var(--color-primary-light);
}

/* Compact CTA */
.inline-cta-small,
.compact-cta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
}

/* Bottom banner */
.guide-bottom-banner {
  margin: var(--spacing-3xl) 0;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-white);
}

.guide-bottom-banner h3 {
  font-family: var(--font-heading);
  font-size: var(--font-size-2xl);
  margin: var(--spacing-md) 0;
}

.guide-bottom-banner .btn--primary {
  background: var(--color-white);
  color: var(--color-primary);
  margin-top: var(--spacing-lg);
}
```

---

## Testing Checklist

For each page:

- [ ] Inline widget renders correctly
- [ ] Lead-in copy makes sense in context
- [ ] "Instant" badge visible
- [ ] Modal opens on link click
- [ ] Modal closes on "X" or overlay click
- [ ] Popup triggers at 60% scroll in target sections
- [ ] Popup suppressed for 24h after close
- [ ] Analytics events fire (check GTM Preview)
- [ ] Mobile responsive (test on 375px width)
- [ ] Accessibility: keyboard nav works, focus traps in modal

---

**Status**: ✅ All embedding patterns documented
**Next**: Copy/paste into actual pages
**Estimated Time**: 3-4 hours for all pages

