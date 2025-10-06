/**
 * Calculator Acceptance Harness
 * Visual testing page for all calculator states
 */

import React from 'react';
import { InstantQuote } from '@/components/calculator';

export default function CalculatorHarness() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Libre Baskerville', marginBottom: '40px' }}>
        Calculator Acceptance Harness
      </h1>

      <section style={{ marginBottom: '60px' }}>
        <h2>Variant: Inline (Guide Page)</h2>
        <InstantQuote
          variant="inline"
          onComplete={(estimate, inputs) => {
            console.log('Estimate:', estimate);
            console.log('Inputs:', inputs);
          }}
        />
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>Variant: Inline (Resource Page)</h2>
        <InstantQuote
          variant="inline"
        />
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>Variant: Inline (City Page)</h2>
        <InstantQuote
          variant="inline"
        />
      </section>
    </div>
  );
}
