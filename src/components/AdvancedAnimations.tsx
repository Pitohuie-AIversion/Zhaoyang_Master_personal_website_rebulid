import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useOptimization } from './GlobalOptimizationManager';

// 动画配置接口
interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  repeat?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// 使用AnimationConfig接口确保类型安全
const _defaultAnimationConfig: AnimationConfig = {
  duration: 1000,
  delay: 0,
  easing: 'ease-out',
  repeat: false,
  direction: 'normal',
  fillMode: 'both'
};

// 粒子效果组件
export const ParticleBackground: React.FC<{
  particleCount?: number;
  color?: string;
  size?: number;
  speed?: number;
}> = ({ 
  particleCount = 50, 
  color = '#3b82f6', 
  size = 2, 
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>>([]);
  const { config } = useOptimization();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 如果启用了减少动画，则不显示粒子效果
    if (config.reducedMotion) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化粒子
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * size + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, color, size, speed, config.reducedMotion]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: config.reducedMotion ? 0 : 0.6 }}
    />
  );
};

// 磁性按钮效果
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  magnetStrength?: number;
}> = ({ children, className = '', onClick, magnetStrength = 0.3 }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { config } = useOptimization();
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!buttonRef.current || config.reducedMotion) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;
    
    button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${isHovered ? 1.05 : 1})`;
  }, [isHovered, magnetStrength, config.reducedMotion]);
  
  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;
    
    buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    setIsHovered(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // 确保点击事件不被阻止
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  }, [onClick]);
  
  useEffect(() => {
    const button = buttonRef.current;
    if (!button || config.reducedMotion) return;
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', () => setIsHovered(true));
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, config.reducedMotion]);
  
  return (
    <button
      ref={buttonRef}
      className={`transition-all duration-200 ease-out cursor-pointer relative ${className}`}
      onClick={handleClick}
      style={{ zIndex: 'auto' }}
    >
      {children}
    </button>
  );
};

// 文字打字机效果（增强版）
export const AdvancedTypewriter: React.FC<{
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  cursor?: boolean;
  className?: string;
}> = ({ 
  texts, 
  speed = 100, 
  deleteSpeed = 50, 
  pauseDuration = 2000, 
  cursor = true, 
  className = '' 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const { config } = useOptimization();
  
  useEffect(() => {
    if (config.reducedMotion) {
      setCurrentText(texts[0] || '');
      return;
    }
    
    const targetText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseDuration, config.reducedMotion]);
  
  useEffect(() => {
    if (!cursor) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [cursor]);
  
  return (
    <span className={className}>
      {currentText}
      {cursor && (
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
          |
        </span>
      )}
    </span>
  );
};

// 滚动触发动画Hook
export const useScrollAnimation = (threshold = 0.1) => {
  const { ref, inView } = useInView({ threshold });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);
  
  return { ref, inView, hasAnimated };
};

// 数字计数动画
export const CountUpAnimation: React.FC<{
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}> = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  decimals = 0, 
  suffix = '', 
  prefix = '', 
  className = '' 
}) => {
  const [count, setCount] = useState(start);
  const { ref, hasAnimated } = useScrollAnimation();
  const { config } = useOptimization();
  
  useEffect(() => {
    if (!hasAnimated) return;
    
    if (config.reducedMotion) {
      setCount(end);
      return;
    }
    
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用easeOutCubic缓动函数
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [hasAnimated, start, end, duration, config.reducedMotion]);
  
  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

// 波纹效果组件
export const RippleEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = 'rgba(255, 255, 255, 0.6)' }) => {
  const [ripples, setRipples] = useState<Array<{
    x: number;
    y: number;
    size: number;
    id: number;
  }>>([]);
  const { config } = useOptimization();
  
  const createRipple = useCallback((e: React.MouseEvent) => {
    if (config.reducedMotion) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, [config.reducedMotion]);
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: '600ms'
          }}
        />
      ))}
    </div>
  );
};

// 3D卡片翻转效果
export const FlipCard: React.FC<{
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  trigger?: 'hover' | 'click';
}> = ({ frontContent, backContent, className = '', trigger = 'hover' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { config } = useOptimization();
  
  const handleInteraction = () => {
    if (config.reducedMotion) return;
    
    if (trigger === 'click') {
      setIsFlipped(!isFlipped);
    }
  };
  
  const handleMouseEnter = () => {
    if (trigger === 'hover' && !config.reducedMotion) {
      setIsFlipped(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (trigger === 'hover' && !config.reducedMotion) {
      setIsFlipped(false);
    }
  };
  
  return (
    <div
      className={`relative w-full h-full perspective-1000 ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* 正面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        
        {/* 背面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
};

// 浮动动画组件
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}> = ({ children, intensity = 10, duration = 3, className = '' }) => {
  const { config } = useOptimization();
  
  if (config.reducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        '--float-intensity': `${intensity}px`,
        '--float-duration': `${duration}s`,
        animation: `float ${duration}s ease-in-out infinite`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// 渐变文字效果
export const GradientText: React.FC<{
  children: React.ReactNode;
  gradient?: string;
  animate?: boolean;
  className?: string;
}> = ({ 
  children, 
  gradient = 'from-blue-600 via-purple-600 to-pink-600', 
  animate = false, 
  className = '' 
}) => {
  const { config } = useOptimization();
  
  return (
    <span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${
        animate && !config.reducedMotion ? 'animate-gradient-x' : ''
      } ${className}`}
    >
      {children}
    </span>
  );
};

// 动画容器组件
export const AnimationContainer: React.FC<{
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  animation = 'fadeIn', 
  duration = 0.6, 
  delay = 0, 
  className = '' 
}) => {
  const { ref, hasAnimated } = useScrollAnimation();
  const { config } = useOptimization();
  
  const getAnimationClass = () => {
    if (config.reducedMotion) return 'opacity-100';
    
    const baseClass = hasAnimated ? 'animate-in' : 'opacity-0';
    const animationClass = {
      fadeIn: 'fade-in',
      slideUp: 'slide-in-from-bottom-4',
      slideDown: 'slide-in-from-top-4',
      slideLeft: 'slide-in-from-right-4',
      slideRight: 'slide-in-from-left-4',
      scale: 'zoom-in-95',
      rotate: 'spin-in-180'
    }[animation];
    
    return `${baseClass} ${hasAnimated ? animationClass : ''}`;
  };
  
  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{
        '--animate-duration': `${duration}s`,
        '--animate-delay': `${delay}s`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default {
  ParticleBackground,
  MagneticButton,
  AdvancedTypewriter,
  CountUpAnimation,
  RippleEffect,
  FlipCard,
  FloatingElement,
  GradientText,
  AnimationContainer,
  useScrollAnimation
};