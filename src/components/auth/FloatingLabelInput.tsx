import React, { useState } from 'react';

interface FloatingLabelInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  onBlur?: () => void;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative mb-4">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full px-4 pt-6 pb-2 border rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error ? 'border-red-500' : 'border-white/20'
        }`}
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all pointer-events-none ${
          shouldFloat
            ? 'top-2 text-xs text-blue-400'
            : 'top-1/2 -translate-y-1/2 text-base text-white/60'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-red-400 text-xs mt-1 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
