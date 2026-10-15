import { ReactNode } from 'react';

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
  '7xl': 'max-w-7xl',
};

const paddingClasses = {
  sm: 'px-4 py-8',
  md: 'px-6 py-12',
  lg: 'px-8 py-16',
};

export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '7xl',
  padding = 'md',
}: ResponsiveContainerProps) {
  return (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

export {
  ResponsiveGrid,
  MobileOptimizedCard,
  MobileButton,
  MobileInput,
  type ResponsiveGridProps,
  type MobileOptimizedCardProps,
  type MobileButtonProps,
  type MobileInputProps,
} from './responsive-grid';