import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable card component with optional header
 * @param {Object} props Component props
 * @param {string} props.title Card title (translation key)
 * @param {React.ReactNode} props.children Card content
 * @param {string} props.className Additional CSS classes
 * @param {boolean} props.noPadding Remove padding from card body
 */
const Card = ({ title, children, className = '', noPadding = false }) => {
  const { t } = useTranslation();
  const bodyClassName = `card-body${noPadding ? ' p-0' : ''}`;
  
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h5 className="mb-0">{t(title)}</h5>
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

export default Card;