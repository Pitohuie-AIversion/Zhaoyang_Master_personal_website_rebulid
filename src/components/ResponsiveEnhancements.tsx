import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// 响应式断点Hook
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // 根据屏幕宽度判断设备类型
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isSmallScreen: screenSize.width < 1024
  };
};

// 响应式容器组件
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
  style
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  };

  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`} style={style}>
      {children}
    </div>
  );
};

// 响应式网格组件
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  };

  const gridCols = `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;

  return (
    <div className={`grid ${gridCols} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

// 响应式文本组件
interface ResponsiveTextProps {
  children: React.ReactNode;
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
  preset?: 'hero-title' | 'section-title' | 'card-title' | 'body' | 'caption';
}

// 预设的响应式文字大小
const textPresets = {
  'hero-title': { mobile: 'text-4xl leading-tight', tablet: 'text-5xl leading-tight', desktop: 'text-6xl leading-tight' },
  'section-title': { mobile: 'text-2xl leading-tight', tablet: 'text-3xl leading-tight', desktop: 'text-4xl leading-tight' },
  'card-title': { mobile: 'text-lg leading-snug', tablet: 'text-xl leading-snug', desktop: 'text-2xl leading-snug' },
  'body': { mobile: 'text-sm leading-loose', tablet: 'text-base leading-loose', desktop: 'text-lg leading-loose' },
  'caption': { mobile: 'text-xs leading-relaxed', tablet: 'text-sm leading-relaxed', desktop: 'text-base leading-relaxed' },
  'subtitle': { mobile: 'text-base leading-relaxed', tablet: 'text-lg leading-relaxed', desktop: 'text-xl leading-relaxed' },
  'small-title': { mobile: 'text-sm leading-snug', tablet: 'text-base leading-snug', desktop: 'text-lg leading-snug' }
};

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  as: Component = 'div',
  sizes,
  preset,
  className = ''
}) => {
  // 使用预设或自定义尺寸
  const finalSizes = preset ? textPresets[preset] : (sizes || { mobile: 'text-sm leading-loose', tablet: 'text-base leading-loose', desktop: 'text-lg leading-loose' });
  const responsiveClasses = `${finalSizes.mobile} md:${finalSizes.tablet} lg:${finalSizes.desktop}`;
  
  // 为中英文混排添加优化样式
  const mixedTextClasses = 'break-words hyphens-auto';
  
  return (
    <Component className={`${responsiveClasses} ${mixedTextClasses} ${className}`}>
      {children}
    </Component>
  );
};

// 移动端导航菜单组件
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
  }>;
}

import { useTranslation } from './TranslationProvider';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, items }) => {
  const { t } = useTranslation();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 菜单内容 */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 lg:hidden overflow-y-auto"
      >
        <div className="p-6 h-full flex flex-col">
          {/* 关闭按钮 */}
          <div className="flex justify-end mb-8">
            <button
              onClick={onClose}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('common.close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 导航菜单 */}
          <div className="flex-1">
            <nav className="space-y-3">
              {items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center space-x-4 px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 break-words ${
                        item.isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                      }`}
                    >
                      <IconComponent className="w-6 h-6 flex-shrink-0" />
                      <span className="leading-relaxed">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
          
          {/* 底部装饰 */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <img src="/favicon.svg" alt="ZY Logo" className="w-full h-full object-contain" />
              </div>
              <p className="leading-relaxed">Zhaoyang Mu</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// 响应式图片组件
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = { mobile: '100vw', tablet: '50vw', desktop: '33vw' },
  className = '',
  loading = 'lazy'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      {imageError ? (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          sizes={`(max-width: 768px) ${sizes.mobile}, (max-width: 1024px) ${sizes.tablet}, ${sizes.desktop}`}
        />
      )}
    </div>
  );
};

// 响应式卡片组件
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  hover?: boolean;
  background?: boolean;
  onClick?: () => void;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true,
  background = true,
  onClick
}) => {
  let paddingClasses = '';
  
  if (typeof padding === 'string') {
    const paddingMap = {
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8'
    };
    paddingClasses = paddingMap[padding];
  } else {
    // 自定义响应式padding
    const { mobile = 'p-4', tablet = 'p-6', desktop = 'p-6' } = padding;
    paddingClasses = `${mobile} md:${tablet} lg:${desktop}`;
  }

  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105' : '';
  const backgroundClasses = background ? 'bg-white dark:bg-gray-800' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      onClick={onClick}
      className={`
        ${backgroundClasses}
        rounded-lg shadow-md 
        transition-all duration-300 
        ${paddingClasses} 
        ${hoverClasses} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// 响应式间距组件
interface ResponsiveSpacingProps {
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  type?: 'margin' | 'padding';
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y' | 'all';
  className?: string;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  size = { mobile: '4', tablet: '6', desktop: '8' },
  type = 'margin',
  direction = 'all',
  className = ''
}) => {
  const prefix = type === 'margin' ? 'm' : 'p';
  const directionMap = {
    top: 't',
    bottom: 'b',
    left: 'l',
    right: 'r',
    x: 'x',
    y: 'y',
    all: ''
  };

  const dir = directionMap[direction];
  const spacingClass = `${prefix}${dir}-${size.mobile} md:${prefix}${dir}-${size.tablet} lg:${prefix}${dir}-${size.desktop}`;

  return <div className={`${spacingClass} ${className}`} />;
};