import React from 'react';

export interface ResponsiveSpacingProps {
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
