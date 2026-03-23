import React from 'react';
import '../../styles/components.css';

/**
 * Reusable Input component with validation and accessibility features
 */
const Input = ({
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete,
  ariaLabel,
  ...rest
}) => {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;

  return (
    <>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-label={ariaLabel || placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`form-input ${error ? 'error' : ''}`}
        {...rest}
      />
    </>
  );
};

export default Input;
