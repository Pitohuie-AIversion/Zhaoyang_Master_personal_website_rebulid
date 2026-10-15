import React, { ReactNode } from 'react';

export interface MobileInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function MobileInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  fullWidth = true,
  className = '',
}: MobileInputProps) {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 sm:py-2
          border border-gray-200 rounded-lg
          focus:ring-2 focus:ring-gray-900 focus:border-transparent
          outline-none transition-all duration-200
          text-base sm:text-sm
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
      />
    </div>
  );
}
