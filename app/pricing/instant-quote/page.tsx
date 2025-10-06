'use client';

/**
 * Stella's Ink Chamber - Instant Quote Page
 * 
 * Standalone page for the SMP price calculator
 */

import React from 'react';
import Head from 'next/head';
import InstantQuote from '../../../components/calculator/InstantQuote';
import { PriceEstimate, QuoteInputs } from '../../../lib/pricing/calc';

const InstantQuotePage: React.FC = () => {
  const handleQuoteComplete = (estimate: PriceEstimate, inputs: QuoteInputs) => {
    // Track completion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quote_complete', {
        price_range: `${estimate.low}-${estimate.high}`,
        sessions: estimate.sessions.count,
        page: 'instant-quote'
      });
    }
  };

  return (
    <>
      <Head>
        <title>SMP Price Calculator (Canada) — Instant Quote | Stella's Ink Chamber</title>
        <meta 
          name="description" 
          content="Get your scalp micropigmentation estimate in seconds. Personalized range, session plan, and $100 gift card with consultation." 
        />
        <meta name="keywords" content="SMP price calculator, scalp micropigmentation cost, SMP Canada, hair loss treatment pricing" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="SMP Price Calculator (Canada) — Instant Quote | Stella's Ink Chamber" />
        <meta property="og:description" content="Get your personalized SMP estimate in seconds. See your pricing range and book a consultation with $100 gift card." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stellasinkchamber.com/pricing/instant-quote" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SMP Price Calculator (Canada) — Instant Quote" />
        <meta name="twitter:description" content="Get your personalized SMP estimate in seconds. See your pricing range and book a consultation." />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "SMP Price Calculator (Canada) — Instant Quote",
              "description": "Get your scalp micropigmentation estimate in seconds. Personalized range, session plan, and $100 gift card with consultation.",
              "url": "https://stellasinkchamber.com/pricing/instant-quote",
              "mainEntity": {
                "@type": "Service",
                "name": "Scalp Micropigmentation",
                "provider": {
                  "@type": "Organization",
                  "name": "Stella's Ink Chamber",
                  "url": "https://stellasinkchamber.com"
                },
                "areaServed": "Canada",
                "serviceType": "Cosmetic Treatment"
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://stellasinkchamber.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Pricing",
                    "item": "https://stellasinkchamber.com/pricing"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Instant Quote",
                    "item": "https://stellasinkchamber.com/pricing/instant-quote"
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <div className="instant-quote-page">
        <div className="page-header">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol className="breadcrumb-list">
                <li><a href="/">Home</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li aria-current="page">Instant Quote</li>
              </ol>
            </nav>
            
            <div className="page-title">
              <h1>SMP Price Calculator (Canada)</h1>
              <p className="page-subtitle">
                Get your personalized scalp micropigmentation estimate in seconds. 
                See your pricing range, recommended sessions, and claim your $100 gift card.
              </p>
            </div>
          </div>
        </div>

        <div className="page-content">
          <div className="container">
            <InstantQuote 
              variant="standalone"
              onComplete={handleQuoteComplete}
            />
          </div>
        </div>

        <div className="page-footer">
          <div className="container">
            <div className="trust-signals">
              <h3>Why Choose Stella's Ink Chamber?</h3>
              <div className="trust-grid">
                <div className="trust-item">
                  <div className="trust-icon">🏆</div>
                  <h4>Expert Practitioner</h4>
                  <p>Certified SMP specialist with years of experience</p>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">🇨🇦</div>
                  <h4>Canadian Based</h4>
                  <p>Serving clients across Canada with local expertise</p>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">✨</div>
                  <h4>Natural Results</h4>
                  <p>Realistic, long-lasting hairline restoration</p>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">🛡️</div>
                  <h4>Safe & Professional</h4>
                  <p>Sterile environment with proper safety protocols</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstantQuotePage;
