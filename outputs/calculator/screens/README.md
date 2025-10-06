# Calculator Screenshots

**Purpose**: Visual reference for acceptance testing  
**Location**: `/outputs/calculator/screens/`

## How to Generate Screenshots

Since this is a static HTML + React hybrid project, screenshots should be captured from:

### Option 1: Standalone HTML Version
1. Open `instant-quote.html` in browser
2. Complete Steps 1-7
3. Capture:
   - `step1-gender-age.png` - Step 1 (Gender + Age selection)
   - `step3-coverage.png` - Step 3 (Coverage area selection)
   - `step7-contact.png` - Step 7 (Contact form)
   - `results-panel.png` - Results screen with estimate

### Option 2: React Version (Next.js)
1. Run `npm run dev` and visit `http://localhost:3000/pricing/_harness`
2. Capture:
   - `variant-guide.png` - Guide page variant
   - `variant-resource.png` - Resource page variant
   - `variant-city.png` - City page variant

### Option 3: Automated (Puppeteer)
```javascript
// Use pdf-export.js as template
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  await page.goto('file:///path/to/instant-quote.html');
  await page.screenshot({ path: 'outputs/calculator/screens/step1.png' });
  
  // Click through steps and capture
  await page.click('button[onclick*="selectOption"]');
  await page.screenshot({ path: 'outputs/calculator/screens/step2.png' });
  
  await browser.close();
})();
```

## Screenshot Checklist

- [ ] Step 1: Gender + Age selection (both fields filled)
- [ ] Step 3: Coverage area (one option selected)
- [ ] Step 7: Contact form (all fields filled)
- [ ] Results: Estimate panel (showing CAD range + sessions)
- [ ] Mobile: Step 1 on iPhone viewport (375px wide)
- [ ] Tablet: Step 3 on iPad viewport (768px wide)

## Notes

Screenshots are **optional** for this static project. The acceptance harness at `/app/pricing/_harness` provides live visual reference for Cursor to use when embedding.

**Current Status**: Placeholder - screenshots can be generated when Next.js dev server is running.
