import React from 'react';
import styles from './Input.module.css';

/**
 * Reusable Input component with label, icon, error state, and accessibility features
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler (optional)
 * @param {string} props.placeholder - Input placeholder (optional)
 * @param {React.ReactNode} props.icon - Icon component to display (optional)
 * @param {string} props.error - Error message to display (optional)
 * @param {string} props.label - Input label (required)
 * @param {boolean} props.required - Whether input is required (optional)
 * @param {string} props.autoComplete - Autocomplete attribute (optional)
 * @param {boolean} props.autoFocus - Whether to autofocus (optional)
 */
const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  error,
  label,
  required = false,
  autoComplete,
  autoFocus = false,
}) => {
  const inputId = `input-${name}`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${styles.input} ${hasError ? styles.error : ''} ${icon ? styles.hasIcon : ''}`}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        />
      </div>
      {hasError && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
