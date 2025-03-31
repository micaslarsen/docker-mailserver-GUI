import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable select field component with error handling
 * @param {Object} props Component props
 * @param {string} props.id Input ID
 * @param {string} props.name Input name
 * @param {string} props.label Label text (translation key)
 * @param {string} props.value Selected value
 * @param {function} props.onChange Handle change event
 * @param {Array} props.options Array of options with value and label
 * @param {string} [props.placeholder] Placeholder text/option (translation key)
 * @param {string} [props.error] Error message (translation key)
 * @param {string} [props.helpText] Help text (translation key)
 * @param {boolean} [props.required] Whether the field is required
 */
const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
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
      <select
        className={`form-select ${error ? 'is-invalid' : ''}`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value="">{t(placeholder)}</option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default SelectField;