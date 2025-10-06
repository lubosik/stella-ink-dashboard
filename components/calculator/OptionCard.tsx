/**
 * Reusable option card component for multi-choice selections
 * Used across Steps 1-6 for visual icon-driven selections
 */

import React from 'react';

export interface OptionCardProps {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  iconSrc?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function OptionCard({
  id,
  label,
  description,
  icon,
  iconSrc,
  selected,
  onClick,
  disabled = false
}: OptionCardProps) {
  const cardClass = 'option-card' + (selected ? ' selected' : '') + (disabled ? ' disabled' : '');

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={cardClass}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {(icon || iconSrc) && (
        <div className="option-card__icon">
          {icon || (iconSrc && <img src={iconSrc} alt="" role="presentation" />)}
        </div>
      )}

      <div className="option-card__content">
        <div className="option-card__label">{label}</div>
        {description && (
          <div className="option-card__description">{description}</div>
        )}
      </div>

      <div className="option-card__checkmark" aria-hidden="true">
        {selected && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        )}
      </div>
    </button>
  );
}
