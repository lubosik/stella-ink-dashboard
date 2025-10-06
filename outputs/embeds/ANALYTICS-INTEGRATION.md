# Analytics Integration Guide

**Purpose**: Wire all calculator events to Google Analytics 4 (GA4) via Google Tag Manager (GTM)
**Tracking**: User behavior, conversion funnel, A/B test performance

---

## Events to Track

### Core Calculator Events

#### 1. `quote_widget_open`
**When**: User begins calculator (inline or modal)
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: 'guide' | 'resource' | 'city' | 'sidebar' | 'popup',
  prefill_topic: 'women' | 'alopecia' | 'scars' | 'hairline' | 'safety' | 'vs' | 'cost' | 'longevity',
  prefill_city: 'edmonton' | 'calgary' | ...,
  page_path: window.location.pathname
}
```

#### 2. `quote_step_view`
**When**: User advances to next step
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: 'step_1' | 'step_2' | ... | 'step_7',
  step_name: 'gender' | 'hair_situation' | 'coverage' | 'finish' | 'timing' | 'addons' | 'contact'
}
```

#### 3. `quote_option_select`
**When**: User selects an option card
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: 'step_' + currentStep,
  option_field: 'gender' | 'coverage_area' | 'norwood' | ...,
  option_value: 'male' | 'full_top' | 'IV' | ...
}
```

#### 4. `quote_contact_submit`
**When**: User submits Step 7 (contact form)
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: variant,
  topic: prefill?.topic,
  city: prefill?.city,
  timing: inputs.timing,
  has_addons: !!(inputs.scar_addon || inputs.womens_density_addon)
}
```

#### 5. `quote_result_view`
**When**: Estimate panel displayed
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: variant,
  estimate_low: estimate.low,
  estimate_high: estimate.high,
  estimate_mid: estimate.mid,
  sessions: estimate.sessions.count,
  value: estimate.mid  // For conversion value tracking
}
```

#### 6. `cta_book_click`
**When**: User clicks "Book Free Consultation" from result panel
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: 'result_panel',
  estimate_mid: estimate.mid,
  value: estimate.mid
}
```

### Popup Events

#### 7. `popup_open`
**When**: Smart popup triggers
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: 'smart_popup',
  section: 'cost' | 'longevity' | 'pricing' | 'vs' | 'unknown',
  trigger: 'scroll' | 'exit' | 'dwell'
}
```

#### 8. `popup_close`
**When**: User closes popup without submitting
**Parameters**:
```javascript
{
  event_category: 'calculator',
  event_label: 'smart_popup',
  step_abandoned: currentStep
}
```

### Navigation Events

#### 9. `resource_crosslink_click`
**When**: User clicks link from Guide to Resource or vice versa
**Parameters**:
```javascript
{
  event_category: 'navigation',
  event_label: 'guide_to_resource' | 'resource_to_guide',
  from_page: window.location.pathname,
  to_page: href,
  link_text: anchorText
}
```

### A/B Test Events

#### 10. `ab_variant_assigned`
**When**: User sees a variant (popup, CTA text, etc.)
**Parameters**:
```javascript
{
  event_category: 'ab_test',
  event_label: 'quote_embeds',
  variant: 'A' | 'B',
  test_element: 'cta_text' | 'popup_trigger' | 'banner_placement'
}
```

---

## GTM Setup

### Step 1: Create GA4 Configuration Tag

1. **GTM Dashboard** → Tags → New
2. **Tag Type**: Google Analytics: GA4 Configuration
3. **Measurement ID**: `G-XXXXXXXXXX` (from GA4 property)
4. **Trigger**: All Pages

### Step 2: Create Custom Event Tags

Create one tag per event (10 tags total):

**Example: `quote_widget_open` Tag**

1. **Tag Type**: Google Analytics: GA4 Event
2. **Configuration Tag**: Select GA4 Config tag from Step 1
3. **Event Name**: `quote_widget_open`
4. **Event Parameters**:
   - `event_category`: `{{Event - Category}}`
   - `event_label`: `{{Event - Label}}`
   - `prefill_topic`: `{{DLV - Prefill Topic}}`
   - `prefill_city`: `{{DLV - Prefill City}}`
   - `page_path`: `{{Page Path}}`
5. **Trigger**: Custom Event → `quote_widget_open`

Repeat for all 10 events.

### Step 3: Create Data Layer Variables

Create variables to capture event parameters:

1. **GTM Dashboard** → Variables → User-Defined Variables → New
2. **Variable Type**: Data Layer Variable

**Variables Needed**:
- `DLV - Event Category` → `event_category`
- `DLV - Event Label` → `event_label`
- `DLV - Prefill Topic` → `prefill_topic`
- `DLV - Prefill City` → `prefill_city`
- `DLV - Estimate Low` → `estimate_low`
- `DLV - Estimate High` → `estimate_high`
- `DLV - Estimate Mid` → `estimate_mid`
- `DLV - Sessions` → `sessions`
- `DLV - Step Name` → `step_name`
- `DLV - Option Field` → `option_field`
- `DLV - Option Value` → `option_value`
- `DLV - Section` → `section`
- `DLV - Trigger` → `trigger`
- `DLV - Variant` → `variant`

### Step 4: Create Custom Event Triggers

1. **GTM Dashboard** → Triggers → New
2. **Trigger Type**: Custom Event

**Triggers Needed** (10):
- `quote_widget_open`
- `quote_step_view`
- `quote_option_select`
- `quote_contact_submit`
- `quote_result_view`
- `cta_book_click`
- `popup_open`
- `popup_close`
- `resource_crosslink_click`
- `ab_variant_assigned`

### Step 5: Test with GTM Preview Mode

1. **GTM Dashboard** → Preview
2. Navigate to site with calculator
3. Interact with calculator (open, select options, submit)
4. Verify events fire in GTM Preview panel
5. Check DebugView in GA4 (Real-time → DebugView)

### Step 6: Publish GTM Container

1. **GTM Dashboard** → Submit
2. **Version Name**: "SMP Calculator Analytics"
3. **Version Description**: "Added 10 events for Instant Quote Calculator"
4. **Publish**

---

## Code Integration

### Already Implemented

All events are already wired in the components:

**InstantQuote.tsx**:
```typescript
window.gtag('event', 'quote_step_view', {
  event_category: 'calculator',
  event_label: 'step_' + (currentStep + 1)
});
```

**InlineBlock.tsx**:
```typescript
window.gtag('event', 'quote_widget_open', {
  event_category: 'calculator',
  event_label: variant,
  prefill_topic: prefill?.topic,
  prefill_city: prefill?.city
});
```

**SmartQuotePopup.tsx**:
```typescript
window.gtag('event', 'popup_open', {
  event_category: 'calculator',
  event_label: variant,
  section: section || 'unknown'
});
```

**ResultPanel.tsx**:
```typescript
window.gtag('event', 'cta_book_click', {
  event_category: 'calculator',
  event_label: 'result_panel',
  value: estimate.mid
});
```

### Add GTM Script to Site

**Option 1: Next.js App Router** (app/layout.tsx)
```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

**Option 2: Next.js Pages Router** (_app.tsx)
```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: url
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

---

## GA4 Reporting

### Custom Reports to Create

#### 1. Calculator Funnel
**Metrics**: Step views, drop-off rates
**Dimensions**: Step name, variant, topic, city

**Path**:
1. Step 1 (Gender) → Step 2 (Hair Situation) → ... → Step 7 (Contact) → Result View → Book Click

**KPIs**:
- Completion rate: (Result views / Step 1 views) × 100
- Booking rate: (Book clicks / Result views) × 100
- Overall conversion: (Book clicks / Step 1 views) × 100

#### 2. Variant Performance
**Metrics**: Widget opens, submissions, booking clicks
**Dimensions**: Variant (guide, resource, city, sidebar, popup)

**Questions**:
- Which placement has highest completion rate?
- Which drives most bookings?
- What's the cost-per-lead by variant?

#### 3. Popup Effectiveness
**Metrics**: Opens, closes, submissions
**Dimensions**: Section (cost, longevity, pricing, vs), trigger type

**Questions**:
- Which section triggers convert best?
- Scroll vs. exit vs. dwell: which performs better?
- What's the abandonment rate?

#### 4. Topic Attribution
**Metrics**: Widget opens, estimate values
**Dimensions**: Prefill topic (women, alopecia, scars, hairline, safety, vs)

**Questions**:
- Which topics drive highest estimate values?
- Which have lowest drop-off?
- Where to focus content efforts?

---

## Conversion Goals

### Set up in GA4

1. **GA4 Property** → Admin → Events → Mark as conversion

**Events to Mark as Conversions**:
- `quote_contact_submit` (Primary conversion: lead captured)
- `cta_book_click` (Secondary conversion: booking intent)
- `quote_result_view` (Micro-conversion: estimate delivered)

### Ecommerce Tracking (Optional)

Track estimate value as virtual purchase:

```typescript
window.gtag('event', 'purchase', {
  currency: 'CAD',
  value: estimate.mid,
  items: [{
    item_id: 'instant_quote',
    item_name: 'SMP Instant Estimate',
    price: estimate.mid,
    quantity: 1
  }]
});
```

---

## A/B Testing with GA4

### Read Variant from Config

```typescript
import experimentConfig from '@/data/experiments/quote-embeds.json';

const variant = experimentConfig.variant; // 'A' or 'B'
const ctaText = experimentConfig.cta[variant]; // "Get Instant Estimate" or "See Your Price Now"

// Fire assignment event
window.gtag('event', 'ab_variant_assigned', {
  event_category: 'ab_test',
  event_label: 'quote_embeds',
  variant: variant,
  test_element: 'cta_text'
});
```

### Analyze in GA4

1. **Explore** → Blank
2. **Dimensions**: Event name, Variant (custom dimension)
3. **Metrics**: Event count, Conversions
4. **Segment**: Variant A vs. Variant B

**Winner Criteria**:
- Statistical significance (≥95% confidence)
- Sample size (≥500 users per variant)
- Primary metric: Booking clicks
- Secondary metric: Completion rate

---

## Dashboard Example (Google Data Studio)

### Widgets to Include

1. **Scorecard**: Total quote submissions (today)
2. **Time Series**: Submissions over last 30 days
3. **Funnel Chart**: Step 1 → Step 7 drop-off
4. **Bar Chart**: Submissions by variant
5. **Pie Chart**: Traffic source (popup vs. inline)
6. **Table**: Top cities by submission count
7. **Scorecard**: Average estimate value
8. **Conversion Rate**: Book clicks / Result views

---

## Testing Checklist

Before launch:

- [ ] GTM container published
- [ ] All 10 events firing in Preview mode
- [ ] Events visible in GA4 DebugView
- [ ] Data Layer variables populated correctly
- [ ] Conversion goals marked in GA4
- [ ] Custom reports created
- [ ] Team has access to GA4 property
- [ ] No PII (personal info) in event parameters
- [ ] GDPR/CCPA consent respected (if applicable)

---

## Troubleshooting

**Events not firing?**
- Check GTM Preview mode: Are triggers firing?
- Check browser console: `window.dataLayer` should contain events
- Verify `window.gtag` exists (GTM script loaded)

**Events firing but not in GA4?**
- Wait 24-48 hours for processing
- Check DebugView (real-time) instead
- Verify Measurement ID correct in GTM config

**Duplicate events?**
- Check for multiple GTM containers
- Ensure triggers fire "Once per page" not "Once per event"

---

**Status**: ✅ All events pre-wired in components
**Next Step**: Set up GTM container + create GA4 custom reports
**Estimated Setup Time**: 2 hours

