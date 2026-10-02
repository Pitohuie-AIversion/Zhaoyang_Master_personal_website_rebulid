import React from 'react';

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

export interface ResponsiveTextProps {
  children: React.ReactNode;
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
  preset?: 'hero-title' | 'section-title' | 'card-title' | 'body' | 'caption' | 'subtitle' | 'small-title';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  as: Component = 'div',
  sizes,
  preset,
  className = ''
}) => {
  // 使用预设或自定义尺寸
  const finalSizes = preset
    ? textPresets[preset]
    : (sizes || { mobile: 'text-sm leading-loose', tablet: 'text-base leading-loose', desktop: 'text-lg leading-loose' });
  const responsiveClasses = `${finalSizes.mobile} md:${finalSizes.tablet} lg:${finalSizes.desktop}`;

  // 为中英文混排添加优化样式
  const mixedTextClasses = 'break-words hyphens-auto';

  return (
    <Component className={`${responsiveClasses} ${mixedTextClasses} ${className}`}>
      {children}
    </Component>
  );
};
