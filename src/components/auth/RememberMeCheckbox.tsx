import React from 'react';
import { setRememberMePreference } from '../../utilities/auth/rememberMe';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ checked, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    onChange(isChecked);
    setRememberMePreference(isChecked);
  };

  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        id="rememberMe"
        checked={checked}
        onChange={handleChange}
        aria-label="Remember me for 30 days"
        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer"
      />
      <label
        htmlFor="rememberMe"
        className="ml-2 text-sm text-white/80 cursor-pointer select-none"
      >
        Remember me for 30 days
      </label>
    </div>
  );
};

export default RememberMeCheckbox;
