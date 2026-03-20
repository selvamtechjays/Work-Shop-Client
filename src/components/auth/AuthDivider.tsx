import React from 'react';

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text = 'or' }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/20"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-transparent text-white/60">{text}</span>
      </div>
    </div>
  );
};

export default AuthDivider;
