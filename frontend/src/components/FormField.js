import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable form field component with error handling
 * @param {Object} props Component props
 * @param {string} props.type Input type: 'text', 'email', 'password', etc.
 * @param {string} props.id Input ID
 * @param {string} props.name Input name
 * @param {string} props.label Label text (translation key)
 * @param {string} props.value Input value
 * @param {function} props.onChange Handle change event
 * @param {string} [props.placeholder] Placeholder text
 * @param {string} [props.error] Error message (translation key)
 * @param {string} [props.helpText] Help text (translation key)
 * @param {boolean} [props.required] Whether the field is required
 */
const FormField = ({
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {t(label)}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && (
        <div className="invalid-feedback">{t(error)}</div>
      )}
      {helpText && (
        <small className="form-text text-muted">
          {t(helpText)}
        </small>
      )}
    </div>
  );
};

export default FormField;