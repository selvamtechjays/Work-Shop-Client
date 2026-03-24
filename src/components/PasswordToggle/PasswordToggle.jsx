import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordToggle.module.css';

/**
 * Password visibility toggle component
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether password is currently visible
 * @param {Function} props.onToggle - Callback when toggle is clicked
 */
const PasswordToggle = ({ isVisible, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.toggleButton}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
    >
      {isVisible ? (
        <EyeOff size={20} aria-hidden="true" />
      ) : (
        <Eye size={20} aria-hidden="true" />
      )}
    </button>
  );
};

export default PasswordToggle;
