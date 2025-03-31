import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard card component with icon and value display
 * @param {Object} props Component props
 * @param {string} props.title Card title (translation key)
 * @param {string} props.icon Bootstrap icon class name (without 'bi-' prefix)
 * @param {string|number} props.value Value to display
 * @param {string} props.iconColor Bootstrap text color class
 * @param {string} props.badgeColor Bootstrap badge color (if value should be displayed as badge)
 * @param {string} props.badgeText Text for badge (translation key)
 */
const DashboardCard = ({
  title,
  icon,
  value,
  iconColor = 'primary',
  badgeColor,
  badgeText
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="card dashboard-card">
      <div className={`dashboard-icon text-${iconColor}`}>
        <i className={`bi bi-${icon}`}></i>
      </div>
      <h5>{t(title)}</h5>
      {badgeColor ? (
        <p className={`badge bg-${badgeColor}`}>
          {badgeText ? t(badgeText) : value}
        </p>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};

export default DashboardCard;