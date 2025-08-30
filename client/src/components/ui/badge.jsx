import React from 'react';
import clsx from 'clsx';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const base = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 text-gray-700',
  };

  return (
    <span className={clsx(base, variants[variant], className)}>
      {children}
    </span>
  );
};
