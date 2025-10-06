/**
 * Results Panel - Display estimate + CTA
 */

import React from 'react';
import { PriceEstimate, QuoteInputs } from '@/lib/pricing/calc';

export interface ResultPanelProps {
  estimate: PriceEstimate;
  answers: QuoteInputs;
}

export default function ResultPanel({ estimate, answers }: ResultPanelProps) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/book-consultation';

  const handleBookClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_book_click', {
        event_category: 'calculator',
        event_label: 'result_panel',
        value: estimate.mid
      });
    }
  };

  return (
    <div className="result-panel">
      <div className="result-panel__success-icon" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="#10b981" opacity="0.1"/>
          <path d="M20 32l8 8 16-16" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h2 className="result-panel__title">Your Personalized SMP Estimate</h2>
      <p className="result-panel__subtitle">
        Hi {answers.name}! Based on your answers, here's your custom pricing estimate.
      </p>

      <div className="result-panel__estimate-card">
        <div className="estimate-card__range">
          <span className="estimate-card__currency">{estimate.currency}</span>
          <span className="estimate-card__low">{estimate.low.toLocaleString()}</span>
          <span className="estimate-card__separator">-</span>
          <span className="estimate-card__high">{estimate.high.toLocaleString()}</span>
        </div>
        
        <div className="estimate-card__mid">
          Typical: {estimate.currency} {estimate.mid.toLocaleString()}
        </div>

        <div className="estimate-card__sessions">
          {estimate.sessions.description}
        </div>
      </div>

      {estimate.factors && estimate.factors.length > 0 && (
        <div className="result-panel__factors">
          <h3 className="factors__title">Your estimate includes:</h3>
          <ul className="factors__list">
            {estimate.factors.map((factor, index) => (
              <li key={index} className="factors__item">{factor}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-panel__gift-card">
        <div className="gift-card__icon" aria-hidden="true">✨</div>
        <div className="gift-card__content">
          <h3 className="gift-card__title">$100 Gift Card Included</h3>
          <p className="gift-card__text">
            Book your free consultation this month and receive a $100 gift card toward your first session.
          </p>
        </div>
      </div>

      <div className="result-panel__cta">
        <a 
          href={bookingUrl}
          className="btn btn--primary btn--large"
          onClick={handleBookClick}
        >
          Book Free Consultation
        </a>
        <p className="cta__subtext">
          Free 30-minute consultation • No obligation • Expert guidance
        </p>
      </div>

      <div className="result-panel__disclaimer">
        <p>{estimate.disclaimer}</p>
      </div>

      <div className="result-panel__next-steps">
        <h3 className="next-steps__title">What happens next?</h3>
        <ol className="next-steps__list">
          <li>Check your email for your estimate and booking link</li>
          <li>Book a free 30-minute consultation at your convenience</li>
          <li>We'll create a custom treatment plan during your visit</li>
          <li>Start your transformation with confidence</li>
        </ol>
      </div>
    </div>
  );
}
