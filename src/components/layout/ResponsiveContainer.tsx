import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  padding?: 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-7xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl'
};

const paddingClasses = {
  sm: 'px-4 py-8',
  md: 'px-6 py-12',
  lg: 'px-8 py-16'
};

export default function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = 'md'
}: ResponsiveContainerProps) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

// 响应式网格组件
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-8'
};

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className = ''
}: ResponsiveGridProps) {
  const gridCols = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${gridCols} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// 移动端优化的卡片组件
interface MobileOptimizedCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const cardPaddingClasses = {
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8'
};

export function MobileOptimizedCard({ 
  children, 
  className = '',
  padding = 'md',
  hover = true,
  onClick
}: MobileOptimizedCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 
        ${cardPaddingClasses[padding]}
        ${hover ? 'hover:border-gray-300 hover:shadow-sm' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// 移动端友好的按钮组件
interface MobileButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const buttonVariants = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
};

const buttonSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
  lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'
};

export function MobileButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  className = ''
}: MobileButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

// 移动端优化的输入框组件
interface MobileInputProps {
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
  className = ''
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