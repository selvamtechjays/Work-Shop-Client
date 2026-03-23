import React from 'react';
import '../../styles/components.css';

/**
 * Form field wrapper component with label and error display
 */
const FormField = ({ label, htmlFor, required = false, error, children, helperText }) => {
  const errorId = `error-${htmlFor}`;

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
          {required && <span className="required-indicator" aria-label="required"> *</span>}
        </label>
      )}
      {children}
      {error && (
        <div className="form-error" id={errorId} role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {!error && helperText && (
        <div className="form-helper-text">{helperText}</div>
      )}
    </div>
  );
};

export default FormField;
