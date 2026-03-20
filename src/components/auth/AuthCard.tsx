import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
    >
      {children}
    </motion.div>
  );
};

export default AuthCard;
