import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable alert component for displaying error and success messages
 * @param {Object} props Component props
 * @param {string} props.type Type of alert: 'success', 'danger', 'warning', 'info'
 * @param {string} props.message Message to display (can be a translation key)
 * @param {boolean} props.translate Whether to translate the message (defaults to true)
 */
const AlertMessage = ({ type = 'info', message, translate = true }) => {
  const { t } = useTranslation();
  
  if (!message) return null;
  
  return (
    <div className={`alert alert-${type}`} role="alert">
      {translate ? t(message) : message}
    </div>
  );
};

export default AlertMessage;