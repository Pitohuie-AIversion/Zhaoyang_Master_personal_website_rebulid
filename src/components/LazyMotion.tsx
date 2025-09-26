import React, { lazy, Suspense } from 'react';
import { useOptimization } from './GlobalOptimizationManager';

// 懒加载framer-motion组件
const LazyMotionDiv = lazy(() => 
  import('framer-motion').then(module => ({ 
    default: module.motion.div 
  }))
);

const LazyMotionSection = lazy(() => 
  import('framer-motion').then(module => ({ 
    default: module.motion.section 
  }))
);

const LazyMotionSpan = lazy(() => 
  import('framer-motion').then(module => ({ 
    default: module.motion.span 
  }))
);

const LazyMotionButton = lazy(() => 
  import('framer-motion').then(module => ({ 
    default: module.motion.button 
  }))
);

const LazyAnimatePresence = lazy(() => 
  import('framer-motion').then(module => ({ 
    default: module.AnimatePresence 
  }))
);

// Motion骨架屏
const MotionSkeleton: React.FC<{ 
  className?: string;
  as?: 'div' | 'section' | 'span' | 'button';
  children?: React.ReactNode;
}> = ({ className = '', as = 'div', children }) => {
  const Component = as;
  return <Component className={`${className}`}>{children}</Component>;
};

// Motion包装器组件
const MotionWrapper: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
  as?: 'div' | 'section' | 'span' | 'button';
}> = ({ children, delay = 0, fallback, as = 'div' }) => {
  const { config } = useOptimization();
  const [shouldLoad, setShouldLoad] = React.useState(delay === 0);
  
  React.useEffect(() => {
    if (delay > 0 && !config.reducedMotion) {
      const timer = setTimeout(() => setShouldLoad(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, config.reducedMotion]);
  
  // 如果禁用动画，直接返回静态元素
  if (config.reducedMotion) {
    return <MotionSkeleton className="" as={as}>{children}</MotionSkeleton>;
  }
  
  if (!shouldLoad) {
    return <>{fallback || <MotionSkeleton as={as} />}</>;
  }
  
  return (
    <Suspense fallback={fallback || <MotionSkeleton as={as} />}>
      {children}
    </Suspense>
  );
};

// 创建motion对象，包含所有子组件
const createLazyMotion = () => {
  const LazyMotionObject = {
    div: (props: any) => (
      <MotionWrapper delay={0} as="div">
        <Suspense fallback={<MotionSkeleton as="div" />}>
          <LazyMotionDiv {...props} />
        </Suspense>
      </MotionWrapper>
    ),
    section: (props: any) => (
      <MotionWrapper delay={100} as="section">
        <Suspense fallback={<MotionSkeleton as="section" />}>
          <LazyMotionSection {...props} />
        </Suspense>
      </MotionWrapper>
    ),
    span: (props: any) => (
      <MotionWrapper delay={0} as="span">
        <Suspense fallback={<MotionSkeleton as="span" />}>
          <LazyMotionSpan {...props} />
        </Suspense>
      </MotionWrapper>
    ),
    button: (props: any) => (
      <MotionWrapper delay={0} as="button">
        <Suspense fallback={<MotionSkeleton as="button" />}>
          <LazyMotionButton {...props} />
        </Suspense>
      </MotionWrapper>
    )
  };
  
  return LazyMotionObject;
};

// 导出懒加载Motion组件
export const LazyMotionDivComponent = createLazyMotion();
export const LazyMotionSectionComponent = createLazyMotion();
export const LazyMotionSpanComponent = createLazyMotion();
export const LazyMotionButtonComponent = createLazyMotion();

export const LazyAnimatePresenceComponent: React.FC<React.ComponentProps<typeof LazyAnimatePresence>> = (props) => {
  const { config } = useOptimization();
  
  // 如果禁用动画，直接返回children
  if (config.reducedMotion) {
    return <>{props.children}</>;
  }
  
  return (
    <Suspense fallback={<>{props.children}</>}>
      <LazyAnimatePresence {...props} />
    </Suspense>
  );
};

// 简化的motion组件，用于基本动画
export const SimpleMotion: React.FC<{
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  as?: 'div' | 'section' | 'span' | 'button';
}> = ({ children, className = '', initial, animate, transition, as = 'div' }) => {
  const { config } = useOptimization();
  const Component = as;
  
  // 如果禁用动画，返回静态组件
  if (config.reducedMotion) {
    return <Component className={className}>{children}</Component>;
  }
  
  // 使用CSS动画替代framer-motion
  const animationClass = React.useMemo(() => {
    if (initial?.opacity === 0 && animate?.opacity === 1) {
      return 'animate-fade-in';
    }
    if (initial?.y && animate?.y === 0) {
      return 'animate-slide-up';
    }
    if (initial?.x && animate?.x === 0) {
      return 'animate-slide-right';
    }
    return '';
  }, [initial, animate]);
  
  return (
    <Component className={`${className} ${animationClass}`}>
      {children}
    </Component>
  );
};

export { MotionWrapper, MotionSkeleton };