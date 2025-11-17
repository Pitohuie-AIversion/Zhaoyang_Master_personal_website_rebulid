import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useResponsive } from './ResponsiveEnhancements';

interface TouchGestureConfig {
  enableSwipe: boolean;
  enablePinch: boolean;
  enableRotate: boolean;
  swipeThreshold: number;
  pinchThreshold: number;
}

interface TouchPoint {
  x: number;
  y: number;
  identifier: number;
}

interface TouchGesture {
  type: 'swipe' | 'pinch' | 'rotate' | 'tap' | 'longpress';
  direction?: 'left' | 'right' | 'up' | 'down';
  scale?: number;
  rotation?: number;
  duration?: number;
}

// 触摸手势识别Hook
export const useTouchGestures = (config: Partial<TouchGestureConfig> = {}) => {
  const { isMobile, isTablet } = useResponsive();
  const [gesture, setGesture] = useState<TouchGesture | null>(null);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const touchStartTime = useRef<number>(0);
  const touchStartPoints = useRef<TouchPoint[]>([]);
  const lastTouchDistance = useRef<number>(0);
  const lastTouchAngle = useRef<number>(0);

  const finalConfig: TouchGestureConfig = {
    enableSwipe: true,
    enablePinch: true,
    enableRotate: false,
    swipeThreshold: 50,
    pinchThreshold: 10,
    ...config
  };

  // 计算两点距离
  const getDistance = (p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // 计算两点角度 - 预留函数
  // const getAngle = (p1: TouchPoint, p2: TouchPoint): number => {
  //   return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  // };

  // 识别滑动手势
  const recognizeSwipe = (startPoints: TouchPoint[], endPoints: TouchPoint[]): TouchGesture | null => {
    if (!finalConfig.enableSwipe || startPoints.length !== 1 || endPoints.length !== 1) return null;

    const start = startPoints[0];
    const end = endPoints[0];
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < finalConfig.swipeThreshold) return null;

    let direction: 'left' | 'right' | 'up' | 'down';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      type: 'swipe',
      direction,
      duration: Date.now() - touchStartTime.current
    };
  };

  // 识别缩放手势
  const recognizePinch = (startPoints: TouchPoint[], endPoints: TouchPoint[]): TouchGesture | null => {
    if (!finalConfig.enablePinch || startPoints.length !== 2 || endPoints.length !== 2) return null;

    const startDistance = getDistance(startPoints[0], startPoints[1]);
    const endDistance = getDistance(endPoints[0], endPoints[1]);
    const scale = endDistance / startDistance;

    if (Math.abs(endDistance - startDistance) < finalConfig.pinchThreshold) return null;

    return {
      type: 'pinch',
      scale,
      duration: Date.now() - touchStartTime.current
    };
  };

  // 触摸开始
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile && !isTablet) return;

    const touches = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      identifier: touch.identifier
    }));

    touchStartTime.current = Date.now();
    touchStartPoints.current = touches;
    setTouchPoints(touches);
  }, [isMobile, isTablet]);

  // 触摸移动
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile && !isTablet) return;

    const touches = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      identifier: touch.identifier
    }));

    setTouchPoints(touches);

    // 实时手势识别
    if (touches.length === 2 && touchStartPoints.current.length === 2) {
      if (finalConfig.enablePinch) {
        const currentDistance = getDistance(touches[0], touches[1]);
        if (lastTouchDistance.current > 0) {
          const deltaDistance = Math.abs(currentDistance - lastTouchDistance.current);
          if (deltaDistance > finalConfig.pinchThreshold) {
            const scale = currentDistance / getDistance(touchStartPoints.current[0], touchStartPoints.current[1]);
            setGesture({
              type: 'pinch',
              scale,
              duration: Date.now() - touchStartTime.current
            });
          }
        }
        lastTouchDistance.current = currentDistance;
      }
    }
  }, [isMobile, isTablet, finalConfig]);

  // 触摸结束
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isMobile && !isTablet) return;

    const touches = Array.from(e.changedTouches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      identifier: touch.identifier
    }));

    // 识别手势
    const swipe = recognizeSwipe(touchStartPoints.current, touches);
    const pinch = recognizePinch(touchStartPoints.current, touches);

    if (swipe) {
      setGesture(swipe);
    } else if (pinch) {
      setGesture(pinch);
    } else if (touchStartPoints.current.length === 1 && touches.length === 1) {
      const duration = Date.now() - touchStartTime.current;
      if (duration > 500) {
        setGesture({
          type: 'longpress',
          duration
        });
      } else {
        setGesture({
          type: 'tap',
          duration
        });
      }
    }

    // 重置状态
    setTimeout(() => setGesture(null), 100);
    touchStartPoints.current = [];
    lastTouchDistance.current = 0;
    lastTouchAngle.current = 0;
  }, [isMobile, isTablet, recognizeSwipe, recognizePinch]);

  // 添加事件监听器
  useEffect(() => {
    if (!isMobile && !isTablet) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isTablet, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    gesture,
    touchPoints,
    isTouchDevice: isMobile || isTablet
  };
};

// 移动端触摸优化组件
export const MobileTouchOptimization: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { gesture } = useTouchGestures();
  const [touchFeedback, _setTouchFeedback] = useState<{ x: number; y: number; type: string } | null>(null);

  // 触摸反馈效果
  useEffect(() => {
    if (gesture) {
      // 这里可以添加触摸反馈视觉效果
      console.log('Touch gesture detected:', gesture);
    }
  }, [gesture]);

  return (
    <div className="mobile-touch-container">
      {children}
      
      {/* 触摸反馈指示器 */}
      {touchFeedback && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: touchFeedback.x - 20,
            top: touchFeedback.y - 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            transform: 'scale(0)',
            animation: 'touch-feedback 0.6s ease-out'
          }}
        />
      )}
      
      <style>{`
        @keyframes touch-feedback {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .mobile-touch-container {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        @media (hover: hover) {
          .mobile-touch-container {
            touch-action: auto;
            -webkit-user-select: auto;
            user-select: auto;
          }
        }
      `}</style>
    </div>
  );
};

// 移动端导航手势组件
export const MobileNavigationGestures: React.FC<{ 
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown 
}) => {
  const { gesture } = useTouchGestures({ enableSwipe: true });

  useEffect(() => {
    if (gesture?.type === 'swipe') {
      switch (gesture.direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    }
  }, [gesture, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return null;
};

// 移动端优化按钮组件
export const MobileOptimizedButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  touchFeedback?: boolean;
}> = ({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  touchFeedback = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 移动端触摸优化
  const handleTouchStart = useCallback(() => {
    if (touchFeedback) {
      setIsPressed(true);
    }
  }, [touchFeedback]);

  const handleTouchEnd = useCallback(() => {
    if (touchFeedback) {
      setIsPressed(false);
    }
    onClick?.();
  }, [touchFeedback, onClick]);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
  };

  return (
    <button
      ref={buttonRef}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${className}
        rounded-lg font-medium transition-all duration-150 
        transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${isPressed ? 'scale-95 shadow-inner' : 'shadow-sm hover:shadow-md'}
        touch-manipulation
      `}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={!touchFeedback ? onClick : undefined}
      disabled={disabled}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      {children}
    </button>
  );
};

export default MobileTouchOptimization;