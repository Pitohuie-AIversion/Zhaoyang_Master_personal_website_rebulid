import React, { lazy, Suspense } from 'react';
import { useOptimization } from './GlobalOptimizationManager';

// 懒加载动画组件
const LazyParticleBackground = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.ParticleBackground 
  }))
);

const LazyMagneticButton = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.MagneticButton 
  }))
);

const LazyAdvancedTypewriter = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.AdvancedTypewriter 
  }))
);

const LazyCountUpAnimation = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.CountUpAnimation 
  }))
);

const LazyRippleEffect = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.RippleEffect 
  }))
);

const LazyFlipCard = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.FlipCard 
  }))
);

const LazyFloatingElement = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.FloatingElement 
  }))
);

const LazyGradientText = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.GradientText 
  }))
);

const LazyAnimationContainer = lazy(() => 
  import('./AdvancedAnimations').then(module => ({ 
    default: module.AnimationContainer 
  }))
);

// 动画加载骨架屏
const AnimationSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

// 动画容器组件，支持延迟加载
const AnimationWrapper: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
}> = ({ children, delay = 0, fallback = <AnimationSkeleton /> }) => {
  const { config } = useOptimization();
  const [shouldLoad, setShouldLoad] = React.useState(delay === 0);
  
  React.useEffect(() => {
    if (delay > 0 && !config.reducedMotion) {
      const timer = setTimeout(() => setShouldLoad(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, config.reducedMotion]);
  
  if (config.reducedMotion) {
    return <div>{children}</div>;
  }
  
  if (!shouldLoad) {
    return <>{fallback}</>;
  }
  
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// 导出懒加载组件
export const LazyParticleBackgroundComponent: React.FC<React.ComponentProps<typeof LazyParticleBackground>> = (props) => (
  <AnimationWrapper delay={100}>
    <LazyParticleBackground {...props} />
  </AnimationWrapper>
);

export const LazyMagneticButtonComponent: React.FC<React.ComponentProps<typeof LazyMagneticButton>> = (props) => (
  <AnimationWrapper delay={0}>
    <LazyMagneticButton {...props} />
  </AnimationWrapper>
);

export const LazyAdvancedTypewriterComponent: React.FC<React.ComponentProps<typeof LazyAdvancedTypewriter>> = (props) => (
  <AnimationWrapper delay={200}>
    <LazyAdvancedTypewriter {...props} />
  </AnimationWrapper>
);

export const LazyCountUpAnimationComponent: React.FC<React.ComponentProps<typeof LazyCountUpAnimation>> = (props) => (
  <AnimationWrapper delay={300}>
    <LazyCountUpAnimation {...props} />
  </AnimationWrapper>
);

export const LazyRippleEffectComponent: React.FC<React.ComponentProps<typeof LazyRippleEffect>> = (props) => (
  <AnimationWrapper delay={0}>
    <LazyRippleEffect {...props} />
  </AnimationWrapper>
);

export const LazyFlipCardComponent: React.FC<React.ComponentProps<typeof LazyFlipCard>> = (props) => (
  <AnimationWrapper delay={400}>
    <LazyFlipCard {...props} />
  </AnimationWrapper>
);

export const LazyFloatingElementComponent: React.FC<React.ComponentProps<typeof LazyFloatingElement>> = (props) => (
  <AnimationWrapper delay={500}>
    <LazyFloatingElement {...props} />
  </AnimationWrapper>
);

export const LazyGradientTextComponent: React.FC<React.ComponentProps<typeof LazyGradientText>> = (props) => (
  <AnimationWrapper delay={0}>
    <LazyGradientText {...props} />
  </AnimationWrapper>
);

export const LazyAnimationContainerComponent: React.FC<React.ComponentProps<typeof LazyAnimationContainer>> = (props) => (
  <AnimationWrapper delay={100}>
    <LazyAnimationContainer {...props} />
  </AnimationWrapper>
);

// 导出useScrollAnimation hook（不需要懒加载）
export { useScrollAnimation } from './AdvancedAnimations';

export { AnimationWrapper, AnimationSkeleton };