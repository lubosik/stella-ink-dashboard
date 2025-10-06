import React from 'react';

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ 
  value, 
  label, 
  description, 
  icon,
  selected = false, 
  onClick 
}) => {
  return (
    <div 
      className={`option-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(value)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(value);
        }
      }}
    >
      <div className="option-card__content">
        {icon && <div className="option-card__icon">{icon}</div>}
        <h3 className="option-card__label">{label}</h3>
        {description && (
          <p className="option-card__description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default OptionCard;
