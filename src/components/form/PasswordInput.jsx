import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Input from './Input';
import '../../styles/components.css';

/**
 * Password input component with visibility toggle
 */
const PasswordInput = ({ name, value, onChange, onBlur, error, placeholder, autoComplete, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="password-input-wrapper">
      <Input
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error}
        autoComplete={autoComplete}
        {...rest}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
