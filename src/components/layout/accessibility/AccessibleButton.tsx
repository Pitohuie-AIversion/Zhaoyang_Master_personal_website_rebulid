import React from 'react';
import { useAccessibility } from './AccessibilityContext';

export interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

// 可访问的按钮组件
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  className = '',
  ariaLabel,
  disabled = false,
  variant = 'primary'
}) => {
  const { config, speakText } = useAccessibility();

  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-400 disabled:text-gray-400'
  };

  const handleClick = () => {
    if (disabled) return;

    if (config.textToSpeech && ariaLabel) {
      speakText(ariaLabel);
    }

    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
      role="button"
      tabIndex={0}
    >
      {children}
    </button>
  );
};
