import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// 按钮变体类型
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface UnifiedButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRadius;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon | React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  title?: string;
  as?: string;
  href?: string;
  target?: string;
  rel?: string;
}

// 按钮变体样式
const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105',
  secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white shadow-md hover:shadow-lg',
  outline: 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20',
  ghost: 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
};

// 按钮尺寸样式
const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
  xl: 'px-8 py-5 text-xl'
};

// 按钮圆角样式
const buttonRadius: Record<ButtonRadius, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
};

// 禁用状态样式
const disabledStyles = 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:shadow-none';

// 加载状态样式
const loadingStyles = 'cursor-wait opacity-75';

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  title,
  as,
  href,
  target,
  rel
}) => {
  const baseStyles = 'font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 flex items-center justify-center gap-2';
  
  const variantStyles = buttonVariants[variant];
  const sizeStyles = buttonSizes[size];
  const radiusStyles = buttonRadius[rounded];
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const finalStyles = [
    baseStyles,
    variantStyles,
    sizeStyles,
    radiusStyles,
    widthStyles,
    disabled || loading ? disabledStyles : '',
    loading ? loadingStyles : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const Component = href ? motion.a : motion.button;
  const componentProps = href ? {
    href,
    target,
    rel,
    onClick: handleClick
  } : {
    type,
    onClick: handleClick,
    disabled: disabled || loading
  };

  return (
    <Component
      {...componentProps}
      className={finalStyles}
      aria-label={ariaLabel}
      title={title}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex items-center">
          {React.isValidElement(icon) ? icon : 
           typeof icon === 'function' ? React.createElement(icon as React.ComponentType<any>, { className: 'w-4 h-4' }) : 
           typeof icon === 'object' && icon !== null ? null : icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex items-center">
          {React.isValidElement(icon) ? icon : 
           typeof icon === 'function' ? React.createElement(icon as React.ComponentType<any>, { className: 'w-4 h-4' }) : 
           typeof icon === 'object' && icon !== null ? null : icon}
        </span>
      )}
    </Component>
  );
};

// 预设按钮组件
export const PrimaryButton: React.FC<Omit<UnifiedButtonProps, 'variant'>> = (props) => (
  <UnifiedButton variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<UnifiedButtonProps, 'variant'>> = (props) => (
  <UnifiedButton variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<UnifiedButtonProps, 'variant'>> = (props) => (
  <UnifiedButton variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<UnifiedButtonProps, 'variant'>> = (props) => (
  <UnifiedButton variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<UnifiedButtonProps, 'variant'>> = (props) => (
  <UnifiedButton variant="danger" {...props} />
);

// 按钮组组件
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spacingStyles = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6'
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className = ''
}) => {
  const orientationStyles = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
  const spacingClass = spacingStyles[spacing];
  
  return (
    <div className={`flex ${orientationStyles} ${spacingClass} ${className}`}>
      {children}
    </div>
  );
};

export default UnifiedButton;