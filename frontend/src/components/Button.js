import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable button component
 * @param {Object} props Component props
 * @param {string} props.type Button type: 'button', 'submit', 'reset'
 * @param {string} props.variant Button variant: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'outline-primary', etc.
 * @param {function} props.onClick Click handler
 * @param {string} props.text Button text (translation key)
 * @param {string} props.icon Bootstrap icon class name (without 'bi-' prefix)
 * @param {string} props.size Button size: 'sm', 'lg'
 * @param {boolean} props.disabled Whether the button is disabled
 * @param {string} props.className Additional CSS classes
 * @param {React.ReactNode} props.children Children elements
 */
const Button = ({
  type = 'button',
  variant = 'primary',
  onClick,
  text,
  icon,
  size,
  disabled = false,
  className = '',
  children
}) => {
  const { t } = useTranslation();
  
  const sizeClass = size ? `btn-${size}` : '';
  const btnClass = `btn btn-${variant} ${sizeClass} ${className}`;
  
  return (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`bi bi-${icon} ${text ? 'me-2' : ''}`}></i>}
      {text && t(text)}
      {children}
    </button>
  );
};

export default Button;