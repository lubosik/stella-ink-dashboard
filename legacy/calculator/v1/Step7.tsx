/* ⚠️ LEGACY FILE - DO NOT IMPORT */
/**
 * Stella's Ink Chamber - Step 7: Contact Information
 * 
 * Contact details and CASL-compliant consent
 */

import React, { useState } from 'react';

interface Step7Props {
  answers: Partial<any>;
  onAnswerChange: (step: number, field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (contactInfo: { name: string; email: string; phone: string; consent: boolean }) => void;
}

const Step7: React.FC<Step7Props> = ({
  answers,
  onAnswerChange,
  onNext,
  onBack,
  errors,
  isSubmitting,
  onSubmit
}) => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false,
    preferredContact: 'email'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contactInfo.name && contactInfo.email && contactInfo.phone && contactInfo.consent) {
      onSubmit(contactInfo);
    }
  };

  const canSubmit = contactInfo.name && contactInfo.email && contactInfo.phone && contactInfo.consent;

  return (
    <div className="step step-7">
      <div className="step-header">
        <h3>Get your instant estimate</h3>
        <p>Provide your contact information to reveal your personalized pricing estimate.</p>
      </div>

      <div className="step-content">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className="error-message" role="alert">
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="form-input"
              placeholder="your.email@example.com"
              required
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="error-message" role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="form-input"
              placeholder="(555) 123-4567"
              required
              disabled={isSubmitting}
            />
            {errors.phone && (
              <div className="error-message" role="alert">
                {errors.phone}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Preferred Contact Method
            </label>
            <div className="contact-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="preferredContact"
                  value="email"
                  checked={contactInfo.preferredContact === 'email'}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  disabled={isSubmitting}
                />
                <span>Email</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="preferredContact"
                  value="phone"
                  checked={contactInfo.preferredContact === 'phone'}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  disabled={isSubmitting}
                />
                <span>Phone</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="preferredContact"
                  value="whatsapp"
                  checked={contactInfo.preferredContact === 'whatsapp'}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  disabled={isSubmitting}
                />
                <span>WhatsApp</span>
              </label>
            </div>
          </div>

          <div className="form-group consent-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={contactInfo.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                required
                disabled={isSubmitting}
              />
              <span className="consent-text">
                I agree to receive messages about my estimate and booking options. 
                You can unsubscribe anytime. *
              </span>
            </label>
            <p className="consent-note">
              <strong>CASL Compliant:</strong> We follow Canadian Anti-Spam Legislation. 
              Your information is protected and you can opt out at any time.
            </p>
          </div>

          <div className="disclaimer-box">
            <h4>Important Disclaimer</h4>
            <p>
              <strong>This is an estimate only.</strong> Final pricing requires an in-person consultation 
              and may vary based on individual factors such as skin type, hair characteristics, 
              and specific requirements.
            </p>
          </div>
        </form>
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        
        <button
          type="submit"
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? 'Generating Estimate...' : 'Get My Instant Estimate'}
        </button>
      </div>
    </div>
  );
};

export default Step7;
