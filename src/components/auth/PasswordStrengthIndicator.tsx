import React from 'react';
import { motion } from 'framer-motion';
import {
  calculatePasswordStrength,
  getStrengthLabel,
  getStrengthColor,
} from '../../utilities/auth/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const score = calculatePasswordStrength(password);
  const strength = getStrengthLabel(score);
  const color = getStrengthColor(strength);

  // Calculate fill percentage for each segment (3 segments total)
  const segmentsFilled = strength === 'weak' ? 1 : strength === 'medium' ? 2 : 3;

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2">
      {/* Strength bar with 3 segments */}
      <div
        className="flex gap-1 mb-1"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={6}
        aria-label="Password strength"
      >
        {[1, 2, 3].map((segment) => (
          <motion.div
            key={segment}
            className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: segment <= segmentsFilled ? color : 'transparent' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: segment <= segmentsFilled ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Strength label */}
      <p className="text-xs" style={{ color }}>
        {strength === 'weak' && 'Weak'}
        {strength === 'medium' && 'Medium'}
        {strength === 'strong' && 'Strong'}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
