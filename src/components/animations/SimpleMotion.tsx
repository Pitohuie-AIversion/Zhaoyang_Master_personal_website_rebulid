import React from 'react';

interface SimpleMotionProps {
  children: React.ReactNode;
  className?: string;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  as?: 'button' | 'div' | 'section' | 'span' | 'p';
  onClick?: (e?: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
  id?: string;
  key?: string | number;
}

export const SimpleMotion: React.FC<SimpleMotionProps> = ({
  children,
  className = '',
  as: Component = 'div',
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  id,
  ...props
}) => {
  const ElementComponent = Component as React.ElementType;
  
  return (
    <ElementComponent
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      id={id}
      {...props}
    >
      {children}
    </ElementComponent>
  );
};

export default SimpleMotion;