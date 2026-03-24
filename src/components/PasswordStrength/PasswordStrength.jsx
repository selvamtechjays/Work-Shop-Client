import React from 'react';
import { validatePassword } from '../../utils/validation';
import styles from './PasswordStrength.module.css';

/**
 * Password strength indicator component
 * @param {Object} props - Component props
 * @param {string} props.password - Password to evaluate
 */
const PasswordStrength = ({ password }) => {
  const {
    strength,
    meetsLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  } = validatePassword(password);

  if (!password) {
    return null;
  }

  const getStrengthColor = () => {
    switch (strength) {
      case 'strong':
        return styles.strong;
      case 'medium':
        return styles.medium;
      case 'weak':
      default:
        return styles.weak;
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case 'strong':
        return '100%';
      case 'medium':
        return '66%';
      case 'weak':
      default:
        return '33%';
    }
  };

  const getStrengthLabel = () => {
    return strength.charAt(0).toUpperCase() + strength.slice(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.barContainer}>
        <div
          className={`${styles.bar} ${getStrengthColor()}`}
          style={{ width: getStrengthWidth() }}
          role="progressbar"
          aria-valuenow={strength === 'weak' ? 33 : strength === 'medium' ? 66 : 100}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className={styles.labelContainer}>
        <span className={`${styles.label} ${getStrengthColor()}`} aria-live="polite">
          {getStrengthLabel()}
        </span>
      </div>
      <ul className={styles.requirements}>
        <li className={meetsLength ? styles.met : styles.unmet}>
          <span className={styles.checkmark}>{meetsLength ? '✓' : '○'}</span>
          At least 8 characters
        </li>
        <li className={hasUpper ? styles.met : styles.unmet}>
          <span className={styles.checkmark}>{hasUpper ? '✓' : '○'}</span>
          One uppercase letter
        </li>
        <li className={hasLower ? styles.met : styles.unmet}>
          <span className={styles.checkmark}>{hasLower ? '✓' : '○'}</span>
          One lowercase letter
        </li>
        <li className={hasNumber ? styles.met : styles.unmet}>
          <span className={styles.checkmark}>{hasNumber ? '✓' : '○'}</span>
          One number
        </li>
        <li className={hasSpecial ? styles.met : styles.unmet}>
          <span className={styles.checkmark}>{hasSpecial ? '✓' : '○'}</span>
          One special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrength;
