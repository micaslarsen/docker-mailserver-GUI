import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable loading spinner component
 * @param {Object} props Component props
 * @param {string} props.size Size of the spinner: 'sm' or default
 * @param {string} props.color Bootstrap color: 'primary', 'secondary', etc.
 * @param {string} props.customText Custom text for screen readers (if not using translation)
 */
const LoadingSpinner = ({ size, color = 'primary', customText }) => {
  const { t } = useTranslation();
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  return (
    <div className="d-flex justify-content-center">
      <div className={`spinner-border text-${color} ${sizeClass}`} role="status">
        <span className="visually-hidden">
          {customText || t('dashboard.loading')}
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;