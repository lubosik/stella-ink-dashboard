# SMP Canada Guide & Resources - Build Documentation

## Project Overview

This project delivers a comprehensive **Scalp Micropigmentation (SMP) Guide for Canada** plus a programmatic SEO resource library for **Stella's Ink Chamber**, Edmonton, Alberta.

**Goal:** Drive bookings by answering every common SMP question, neutralizing objections, showcasing Stella's expertise, and providing clear conversion paths.

---

## Data Sources

### Research Inputs
All content is based on keyword research and competitive analysis stored in `/outputs/smp-canada/`:

- **`smp_canada_keywords.csv`** - 27 target keywords with volume, CPC, intent, and top domains
- **`smp_canada_clusters.csv`** - 16 topic clusters mapped to page types and target keywords
- **`smp_canada_content_plan.md`** - 90-day content calendar with CTAs and lead magnets
- **`smp_canada_trends.md`** - Google Trends analysis showing seasonality and growth
- **`smp_canada_serp_summary.md`** - SERP feature analysis and content gaps
- **`smp_canada_competitor_gaps.md`** - Competitive weaknesses we can exploit

### Brand & Business Information

**Stella's Ink Chamber** (source: [stellasinkchamber.com](https://stellasinkchamber.com))

- **Location:** 12505 102 Avenue NW, Edmonton, Alberta T5N 0M4, Canada
- **Phone:** (780) 932-9541
- **Experience:** 20+ years in beauty industry; 500+ SMP procedures
- **Services:** Male pattern baldness, female density, scar camouflage, SMP correction
- **Pricing:**
  - Full hairline/shaved look: $2,550 avg (3 sessions)
  - Density build: From $850/session (usually 4 sessions)
  - Scar cover-up: From $150+ (1-2 sessions)
  - Touch-ups (3-5 years): $250/hour
  - **Free touch-ups within 6 months**
- **Financing:** Medicard available
- **Referral Program:** $100 credit per referred client

### Aftercare Protocol (Stella's Standard)

- **Days 1-4:** No water, no sweating, no products, no scratching
- **Days 5-9:** Gentle rinsing, natural shampoo, light workouts
- **Day 10+:** Normal routine, but always sun protection (SPF 30+)

---

## Architecture

### Directory Structure

```
/
├── guides/
│   └── smp-canada/
│       └── index.html          # Main 4,500-word guide (lead magnet + hub)
├── resources/
│   ├── index.html              # Resource library with filters
│   ├── cost.html               # SMP pricing guide
│   ├── pain.html               # Pain & comfort guide
│   ├── longevity.html          # Fading & touch-ups
│   ├── aftercare.html          # Day-by-day aftercare
│   ├── women.html              # Women's SMP (placeholder)
│   ├── alopecia.html           # Alopecia coverage (placeholder)
│   ├── scars.html              # Scar camouflage (placeholder)
│   ├── hairline.html           # Hairline design (placeholder)
│   ├── safety.html             # Safety & side effects (placeholder)
│   └── alternatives.html       # SMP vs transplant/PRP (placeholder)
├── public/
│   ├── stella/
│   │   ├── styles.css          # Brand CSS (dark green #293919, Source Sans Pro/Libre Baskerville)
│   │   └── app.js              # Interactive components & analytics
│   └── downloads/
│       └── smp-canada-guide.pdf  # PDF export (generated)
├── sitemap.xml                  # SEO sitemap (12 URLs)
├── robots.txt                   # Crawler directives
├── pdf-export.js                # Puppeteer script to generate PDF
├── package.json                 # Node dependencies
└── README_SMP_BUILD.md          # This file
```

---

## Key Features Implemented

### Main Guide (`/guides/smp-canada/`)

✅ **4,500+ words** covering 13 major sections:
1. What is SMP?
2. Cost & Pricing (transparent Stella's pricing)
3. Pain & Comfort (objection handling)
4. Longevity & Fading (realistic expectations)
5. Aftercare Guide (Stella's protocol)
6. SMP for Women (density focus)
7. Alopecia & Scar Camouflage
8. Safety & Side Effects (trust-building)
9. Hairline Design (natural vs sharp)
10. SMP vs Alternatives (comparison matrix)
11. Choosing an Artist (red flags & green lights)
12. Why Stella's Ink Chamber (credentials & proof)
13. FAQ (10 common questions)

✅ **Sticky TOC:**
- Desktop: Right-side sticky nav, auto-highlights current section
- Mobile: Floating button opens slide-up sheet

✅ **Lead Magnet:**
- Two form placements (top + bottom)
- Email capture for PDF download
- Consent language included

✅ **CTAs:**
- Sticky bottom bar: "Book Free Consultation" + phone
- Inline CTAs after major sections
- Final CTA with address

✅ **SEO:**
- JSON-LD: Article, FAQPage, BreadcrumbList
- Meta titles/descriptions with "Canada" keywords
- Canonical URLs
- Internal links to resources

### Resource Library (`/resources/`)

✅ **10 Resource Pages:**
- 4 fully developed (cost, pain, longevity, aftercare)
- 6 placeholders (women, alopecia, scars, hairline, safety, alternatives)

✅ **Filterable Index:**
- Search box (live filtering)
- Category filters: All, Cost, Procedure, Aftercare, Specialized, Comparison
- Responsive card grid

✅ **Schema:** Article + FAQPage on each resource

### Interactive Components (`app.js`)

✅ **Table of Contents:** Auto-highlight active section, smooth scroll
✅ **Mobile TOC:** Slide-up sheet with backdrop
✅ **Sticky CTA:** Hide on scroll down, show on scroll up
✅ **Lead Magnet Forms:** Email validation, submission tracking
✅ **Analytics Events:**
- `cta_book_click` (location, text)
- `leadmagnet_submit` (email domain, form location)
- `toc_link_click` (section)
- `toc_open_mobile`
- `resource_nav_click` (target, text)
- `contact_phone_click` / `contact_whatsapp_click`
- `page_performance` (load time)

### PDF Export

✅ **Puppeteer script** (`pdf-export.js`):
- Converts guide HTML to PDF
- Removes sticky elements and TOC for clean print layout
- Outputs to `/public/downloads/smp-canada-guide.pdf`
- Run: `npm run pdf` (requires `npm install puppeteer`)

### Technical SEO

✅ **Sitemap.xml:** 12 URLs with priority/changefreq
✅ **Robots.txt:** Allows all, includes sitemap, polite crawl-delay
✅ **Performance:** Lazy-load images, WebP format ready, explicit sizing for CLS prevention

---

## Brand Guidelines

### Colors
- **Primary:** `#293919` (dark green)
- **Primary Light:** `#3d5226`
- **Primary Dark:** `#1a2410`
- **White/Gray Scale:** Standard neutral palette

### Typography
- **Body:** Source Sans Pro (sans-serif)
- **Headings:** Libre Baskerville (serif)
- **Weights:** 400 (regular), 600 (semi-bold), 700 (bold)

### Tone & Voice
- **Empathetic & Reassuring:** "Hair loss is horrible. Your SMP doesn't have to be."
- **Transparent & Honest:** Clear pricing, realistic expectations
- **Educational:** Avoid hype; focus on facts and client experience
- **Professional but Approachable:** Conversational without being casual

---

## Extending the Resources Programmatically

### Adding a New Resource Page

1. **Create HTML file** in `/resources/` (e.g., `hairline.html`)
2. **Use this template structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] | Stella's Ink Chamber</title>
  <meta name="description" content="[150-160 char description]">
  <link rel="canonical" href="https://stellasinkchamber.com/resources/[slug].html">
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/stella/styles.css">

  <!-- JSON-LD Schema (Article + FAQPage) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[Headline]",
    "author": { "@type": "Person", "name": "Stella Chamberlain" }
  }
  </script>
</head>
<body>
  <div class="sticky-cta">
    <div class="sticky-cta-content">
      <span class="sticky-cta-text">[CTA text]</span>
      <a href="https://forms.gle/your-booking-form" class="btn btn-primary" data-booking-cta>Book Consultation</a>
    </div>
  </div>

  <div class="container">
    <div class="page-layout">
      <main class="page-content">
        <!-- Breadcrumbs -->
        <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem;">
          <a href="/">Home</a> / <a href="/resources/">Resources</a> / <span>[Topic]</span>
        </nav>

        <h1>[Page Title]</h1>
        <!-- Content here -->

        <!-- FAQ Section -->
        <h2>FAQ</h2>
        <div class="faq-item">
          <h3 class="faq-question">[Question]</h3>
          <div class="faq-answer"><p>[Answer]</p></div>
        </div>

        <!-- CTA -->
        <div style="background: var(--color-gray-50); padding: 2rem; border-radius: 0.75rem; margin: 2rem 0;">
          <h3>Ready to Learn More?</h3>
          <p>Book a free consultation to discuss your specific needs.</p>
          <p><a href="https://forms.gle/your-booking-form" class="btn btn-primary btn-large" data-booking-cta>Book Consultation</a></p>
        </div>

        <!-- Related Resources -->
        <h3>Related Resources</h3>
        <ul>
          <li><a href="/guides/smp-canada/">Complete SMP Guide</a></li>
          <li><a href="/resources/cost.html">SMP Cost</a></li>
        </ul>
      </main>

      <aside class="page-sidebar">
        <nav class="toc"><h3 class="toc-title">On This Page</h3><ul class="toc-list"><!-- Links --></ul></nav>
      </aside>
    </div>
  </div>

  <script src="/public/stella/app.js"></script>
</body>
</html>
```

3. **Add to Resources index** (`/resources/index.html`):

```html
<article class="resource-card" data-tags="all [category]">
  <div class="resource-tags">
    <span class="resource-tag">[Tag]</span>
  </div>
  <h3>[Title]</h3>
  <p>[Description]</p>
  <a href="/resources/[slug].html" data-resource-link>Read More →</a>
</article>
```

4. **Update sitemap.xml:**

```xml
<url>
  <loc>https://stellasinkchamber.com/resources/[slug].html</loc>
  <lastmod>[date]</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

### Programmatic Generation (Future)

For scaling to 50+ pages, consider:

1. **Data-driven approach:** Store content in JSON/CSV
2. **Template engine:** Use Handlebars, EJS, or similar
3. **Build script:** Generate HTML from templates + data
4. **Example:**

```javascript
const data = require('./resources-data.json');
const template = fs.readFileSync('./templates/resource.hbs', 'utf8');

data.resources.forEach(resource => {
  const html = Handlebars.compile(template)(resource);
  fs.writeFileSync(`./resources/${resource.slug}.html`, html);
});
```

---

## Asset Management

### Images

**Current Status:** Placeholders only

**TODO (requires client approval):**

1. **Before/After Gallery:**
   - Source from [stellasinkchamber.com](https://stellasinkchamber.com) (with consent)
   - Store in `/public/stella/gallery/`
   - Use WebP format, lazy-load, explicit width/height
   - Alt text: "SMP before and after [description], Stella's Ink Chamber Edmonton"

2. **Diagrams:**
   - Hairline types (natural vs sharp)
   - Fading timeline (visual chart)
   - Aftercare calendar
   - Create in Figma/Canva, export as SVG or WebP

3. **Stella's Headshot/Credentials:**
   - Professional photo for "Why Stella" section
   - Certification badges (if applicable)

### Logo

**TODO:** Extract Stella's logo from website and store in `/public/stella/logo.svg` (or .png)

---

## Analytics Setup

### Google Analytics 4

Add to `<head>` of all pages:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with Stella's GA4 Measurement ID.

### Tracked Events (via `app.js`)

All events are already wired; they will automatically flow to GA4 once the tag is installed:

- **cta_book_click** → Track conversion funnel
- **leadmagnet_submit** → Lead generation metric
- **toc_open_mobile** → Mobile UX engagement
- **resource_nav_click** → Content discovery patterns

---

## Deployment

### Local Testing

1. **Serve locally:**
   ```bash
   npm run serve
   # or
   python3 -m http.server 8000
   ```
   Open: `http://localhost:8000/guides/smp-canada/`

2. **Generate PDF:**
   ```bash
   npm install
   npm run pdf
   ```
   Output: `/public/downloads/smp-canada-guide.pdf`

### Production Deployment

**Options:**

1. **Netlify / Vercel:**
   - Drop folder into deploy dashboard
   - Set build command: `npm run pdf` (optional)
   - Set publish directory: root (`/`)

2. **Traditional Host (cPanel / FTP):**
   - Upload all files to web root
   - Ensure `.htaccess` enables gzip and caching:
     ```apache
     # Enable Gzip
     <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
     </IfModule>

     # Cache static assets
     <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/webp "access plus 1 year"
     </IfModule>
     ```

3. **Domain/Subdomain:**
   - Option A: Deploy to `stellasinkchamber.com` (main site)
   - Option B: Deploy to `guide.stellasinkchamber.com` (subdomain)
   - Update all canonical URLs accordingly

---

## Performance Optimization

### Lighthouse Targets (Mobile)

- **Performance:** ≥90
- **Accessibility:** ≥90
- **SEO:** ≥90
- **Best Practices:** ≥90

### Optimization Checklist

✅ **Images:**
- Convert to WebP format
- Lazy-load with `loading="lazy"`
- Explicit `width` and `height` attributes (prevent CLS)
- Compressed to <200KB each

✅ **CSS/JS:**
- Minify before production
- Inline critical CSS for above-fold content
- Defer non-critical JavaScript

✅ **Fonts:**
- Preconnect to Google Fonts
- `font-display: swap` to prevent FOIT (Flash of Invisible Text)

✅ **Caching:**
- Set cache headers (1 year for static assets)
- Enable Gzip/Brotli compression

---

## Outstanding TODOs (Client Approval Required)

### High Priority

1. **Replace Booking CTA Link:**
   - Current placeholder: `https://forms.gle/your-booking-form`
   - Action: Update with Stella's actual Google Form or booking page URL
   - Files to update: All HTML files (search/replace)

2. **Before/After Images:**
   - Pull high-quality images from Stella's website or files
   - Obtain client consent for each image used
   - Add to `/public/stella/gallery/` with descriptive filenames
   - Update image `src` attributes in guide and resource pages

3. **Google Reviews:**
   - Extract 3-5 top reviews from Stella's Google Business Profile
   - Add to "Why Stella" section and review snippets
   - Include reviewer name (first name + last initial), rating, date

### Medium Priority

4. **Expand Placeholder Pages:**
   - Women's SMP (`/resources/women.html`)
   - Alopecia (`/resources/alopecia.html`)
   - Scar Camouflage (`/resources/scars.html`)
   - Hairline Design (`/resources/hairline.html`)
   - Safety & Risks (`/resources/safety.html`)
   - SMP vs Alternatives (`/resources/alternatives.html`)

5. **PDF Lead Magnet:**
   - Test PDF generation: `npm run pdf`
   - Review PDF layout and formatting
   - Set up email automation (Mailchimp, ConvertKit, etc.) to deliver PDF on form submission

6. **Google Analytics:**
   - Create GA4 property for Stella's Ink Chamber
   - Add measurement ID to all pages
   - Set up conversion goals (form submissions, phone clicks)

### Low Priority

7. **French Content (Quebec):**
   - Translate guide and key resources to French
   - Target Montreal market (`micropigmentation capillaire Montreal`)

8. **Local Landing Pages:**
   - Create city-specific pages: Toronto, Vancouver, Calgary
   - Optimize for `scalp micropigmentation [city]` keywords

9. **Video Content:**
   - Embed YouTube videos (if Stella has any) showing procedure, testimonials
   - Alt: Create simple explainer video for "What is SMP?" section

---

## SEO Keywords Targeted

**Primary Keywords (National):**
- scalp micropigmentation (2,100 vol)
- SMP (1,650 vol)
- scalp micropigmentation cost (880 vol)
- hair tattoo (890 vol)
- scalp micropigmentation Canada (450 vol)

**Secondary Keywords (Long-tail):**
- does SMP hurt
- scalp micropigmentation women
- scalp micropigmentation before and after
- scalp micropigmentation side effects
- scalp micropigmentation regrets
- SMP vs hair transplant
- SMP aftercare
- scalp micropigmentation fading

**Local Keywords:**
- scalp micropigmentation Edmonton (140 vol)
- scalp micropigmentation Toronto (590 vol)
- scalp micropigmentation Vancouver (420 vol)
- scalp micropigmentation Calgary (320 vol)

**Competitor Gaps We Address:**
✅ Transparent pricing (most hide costs)
✅ Detailed aftercare (most provide basic instructions)
✅ Women's SMP focus (underserved)
✅ French content opportunity (Quebec)
✅ Objection handling (pain, regrets, side effects)

---

## Success Metrics

### Content Performance (90 Days)

**Targets (from content plan):**
- Organic traffic: +150%
- Keyword rankings: Top 3 for 50+ keywords
- Conversion rate: +25%
- Lead generation: +200%

### User Engagement

**Targets:**
- Time on page: +40%
- Bounce rate: -30%
- Page views per session: +50%

### Business Impact

**Targets:**
- Consultation bookings: +300%
- Lead quality: +40%
- Customer acquisition cost: -25%

---

## Support & Maintenance

### Updating Content

- **Pricing Changes:** Update `/resources/cost.html` and guide pricing section
- **New Services:** Add to "Why Stella" section and services list
- **FAQ Additions:** Add to guide FAQ section with proper schema markup

### Monitoring

- **Google Search Console:** Track keyword rankings, CTR, impressions
- **GA4:** Monitor traffic sources, conversion funnels, user behavior
- **Page Speed:** Run quarterly Lighthouse audits to maintain 90+ scores

### Backups

- **Git Version Control:** Commit changes regularly
- **Full Backups:** Monthly full-site backups (store offsite)

---

## Contact & Credits

**Project Built For:**
Stella Chamberlain, Stella's Ink Chamber
12505 102 Avenue NW, Edmonton, AB T5N 0M4
(780) 932-9541

**Research Sources:**
- Keyword data: DataForSEO API
- Competitor analysis: Manual SERP review
- Trends: Google Trends (2024 data)

**Technologies Used:**
- HTML5, CSS3, JavaScript (Vanilla)
- Puppeteer (PDF generation)
- JSON-LD (Structured data)
- Google Fonts (Libre Baskerville, Source Sans Pro)

---

## Changelog

See `CHANGELOG.md` for detailed list of files created/modified and version history.
