import React from 'react';
import '../../styles/components.css';

/**
 * Reusable Button component with loading states
 */
const Button = ({
  type = 'button',
  onClick,
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  ...rest
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    fullWidth ? 'btn-full-width' : '',
    loading ? 'btn-loading' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={buttonClasses}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className="btn-content">
          <span className="spinner" aria-hidden="true"></span>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
