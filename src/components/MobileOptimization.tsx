import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronUp, Wifi, WifiOff, Battery } from 'lucide-react';
import { useResponsive } from './ResponsiveEnhancements';
import { useOptimization } from './GlobalOptimizationManager';

// 移动端导航菜单组件
export const MobileNavMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const { isMobile } = useResponsive();
  
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
  
  if (!isMobile || !isOpen) return null;
  
  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* 菜单内容 */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">菜单</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          {children}
        </div>
      </div>
    </>
  );
};

// 移动端底部导航栏
export const MobileBottomNav: React.FC<{
  items: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
  }>;
}> = ({ items }) => {
  const { isMobile } = useResponsive();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="flex items-center justify-around py-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              item.active 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <div className="w-5 h-5 mb-1">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// 移动端回到顶部按钮
export const MobileScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useResponsive();
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  if (!isMobile || !isVisible) return null;
  
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      aria-label="回到顶部"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

// 移动端触摸手势处理
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);
  
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;
    
    return {
      isLeftSwipe,
      isRightSwipe,
      isUpSwipe,
      isDownSwipe,
      distanceX: Math.abs(distanceX),
      distanceY: Math.abs(distanceY)
    };
  }, [touchStart, touchEnd, minSwipeDistance]);
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// 移动端网络状态指示器
export const MobileNetworkIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const { isMobile } = useResponsive();
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 检测连接类型
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
        
        const handleConnectionChange = () => {
          setConnectionType(connection.effectiveType || 'unknown');
        };
        
        (connection as any).addEventListener('change', handleConnectionChange);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          (connection as any).removeEventListener('change', handleConnectionChange);
        };
      }
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed top-4 right-16 z-30">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-600" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-600" />
        )}
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {isOnline ? connectionType : '离线'}
        </span>
      </div>
    </div>
  );
};

// 移动端电池状态指示器
export const MobileBatteryIndicator: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const { isMobile } = useResponsive();
  
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean; addEventListener?: (event: string, callback: () => void) => void; removeEventListener?: (event: string, callback: () => void) => void }> }).getBattery()?.then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        
        const handleLevelChange = () => {
          setBatteryLevel(Math.round(battery.level * 100));
        };
        
        const handleChargingChange = () => {
          setIsCharging(battery.charging);
        };
        
        if (battery.addEventListener) {
          battery.addEventListener('levelchange', handleLevelChange);
          battery.addEventListener('chargingchange', handleChargingChange);
        }
        
        return () => {
          if (battery.removeEventListener) {
            battery.removeEventListener('levelchange', handleLevelChange);
            battery.removeEventListener('chargingchange', handleChargingChange);
          }
        };
      });
    }
  }, []);
  
  if (!isMobile || batteryLevel === null) return null;
  
  const getBatteryColor = () => {
    if (isCharging) return 'text-green-600';
    if (batteryLevel <= 20) return 'text-red-600';
    if (batteryLevel <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  return (
    <div className="fixed top-4 right-32 z-30">
      <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
        <Battery className={`w-4 h-4 ${getBatteryColor()}`} />
        <span className={`text-xs font-medium ${getBatteryColor()}`}>
          {batteryLevel}%
        </span>
      </div>
    </div>
  );
};

// 移动端性能优化Hook
export const useMobileOptimization = () => {
  const { isMobile, deviceType } = useResponsive();
  const { updateConfig } = useOptimization();
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  
  useEffect(() => {
    if (!isMobile) return;
    
    // 检测低电量模式
    if ('getBattery' in navigator) {
      (navigator as Navigator & { getBattery?: () => Promise<any> }).getBattery()?.then((battery) => {
        const checkLowPower = () => {
          const lowPower = battery.level < 0.2 && !battery.charging;
          setIsLowPowerMode(lowPower);
          
          if (lowPower) {
            // 启用省电模式
            updateConfig({
              reducedMotion: true,
              enableImageOptimization: true,
              loadingAnimationVariant: 'minimal',
              pageTransitionDuration: 0.1
            });
          }
        };
        
        checkLowPower();
        battery.addEventListener('levelchange', checkLowPower);
        battery.addEventListener('chargingchange', checkLowPower);
      });
    }
    
    // 移动端特定优化
    updateConfig({
      enableLazyLoading: true,
      enableImageOptimization: true
    });
    
    // 触摸设备优化
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
    }
    
    // 视口高度修复（移动端地址栏问题）
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, [isMobile, updateConfig]);
  
  return {
    isLowPowerMode,
    deviceType
  };
};

// 移动端手势导航组件
export const MobileGestureNavigation: React.FC<{
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  children: React.ReactNode;
}> = ({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, children }) => {
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();
  const { isMobile } = useResponsive();
  
  const handleTouchEnd = () => {
    const gesture = onTouchEnd();
    if (!gesture) return;
    
    if (gesture.isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    } else if (gesture.isRightSwipe && onSwipeRight) {
      onSwipeRight();
    } else if (gesture.isUpSwipe && onSwipeUp) {
      onSwipeUp();
    } else if (gesture.isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }
  };
  
  if (!isMobile) {
    return <>{children}</>;
  }
  
  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleTouchEnd}
      className="touch-pan-y"
    >
      {children}
    </div>
  );
};

// 移动端优化容器组件
export const MobileOptimizedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isMobile } = useResponsive();
  useMobileOptimization();
  
  return (
    <div className={`${isMobile ? 'mobile-optimized' : ''} ${className}`}>
      {children}
      <MobileScrollToTop />
      <MobileNetworkIndicator />
      <MobileBatteryIndicator />
    </div>
  );
};

export default MobileOptimizedContainer;