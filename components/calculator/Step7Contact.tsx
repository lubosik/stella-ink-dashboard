/**
 * Step 7: Contact Information + CASL Consent
 */

import React from 'react';

export interface Step7ContactProps {
  name?: string;
  email?: string;
  phone?: string;
  consent?: boolean;
  onUpdate: (field: string, value: any) => void;
}

export default function Step7Contact({ name, email, phone, consent, onUpdate }: Step7ContactProps) {
  return (
    <div className="calculator-step">
      <h2 className="step__title">Almost there! How can we reach you?</h2>
      <p className="step__subtitle">
        We'll send your personalized estimate and details about our $100 gift card offer.
      </p>

      <div className="step__section">
        <div className="step__form">
          <div className="form-group">
            <label htmlFor="contact-name" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              className="form-input"
              value={name || ''}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="John Smith"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              className="form-input"
              value={email || ''}
              onChange={(e) => onUpdate('email', e.target.value)}
              placeholder="john@example.com"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-phone" className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="contact-phone"
              className="form-input"
              value={phone || ''}
              onChange={(e) => onUpdate('phone', e.target.value)}
              placeholder="(555) 123-4567"
              required
              aria-required="true"
            />
            <p className="form-help">We'll text you a link to book your free consultation</p>
          </div>

          <div className="form-group form-group--checkbox">
            <label htmlFor="contact-consent" className="checkbox-label">
              <input
                type="checkbox"
                id="contact-consent"
                className="checkbox-input"
                checked={consent || false}
                onChange={(e) => onUpdate('consent', e.target.checked)}
                required
                aria-required="true"
              />
              <span className="checkbox-text">
                I agree to receive pricing information and booking reminders from Stella's Ink Chamber. 
                I understand I can unsubscribe anytime. <span className="required">*</span>
              </span>
            </label>
            <p className="form-help form-help--small">
              We respect your privacy. Your information will never be shared. See our privacy policy.
            </p>
          </div>
        </div>
      </div>

      <div className="step__gift-card-banner">
        <div className="gift-card-icon" aria-hidden="true">✨</div>
        <div className="gift-card-content">
          <h4 className="gift-card-title">$100 Gift Card Offer</h4>
          <p className="gift-card-text">
            Book your free consultation this month and receive a $100 gift card toward your first SMP session.
          </p>
        </div>
      </div>
    </div>
  );
}
