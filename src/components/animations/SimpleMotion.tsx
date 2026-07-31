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
  type?: 'button' | 'submit' | 'reset';
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  ariaModal?: boolean;
  ariaLabelledby?: string;
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
  type,
  role,
  tabIndex,
  ariaLabel,
  ariaModal,
  ariaLabelledby,
  initial: _initial,
  animate: _animate,
  transition: _transition
}) => {
  const ElementComponent = Component as React.ElementType;
  void _initial;
  void _animate;
  void _transition;
  
  return (
    <ElementComponent
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      id={id}
      type={type}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-modal={ariaModal}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </ElementComponent>
  );
};

export default SimpleMotion;
