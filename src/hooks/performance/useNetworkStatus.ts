import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  isSlowConnection: boolean;
}

/**
 * 网络连通性与连接质量监测 Hook (支持 navigator.connection API)
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('unknown');
  const [downlink, setDownlink] = useState<number>(0);

  const updateConnectionInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (
        navigator as unknown as {
          connection?: { type?: string; effectiveType?: string; downlink?: number };
        }
      ).connection;
      setConnectionType(connection?.type || 'unknown');
      setEffectiveType(connection?.effectiveType || 'unknown');
      setDownlink(connection?.downlink || 0);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      const connection = (
        navigator as unknown as {
          connection?: {
            type?: string;
            effectiveType?: string;
            downlink?: number;
            addEventListener?: (event: string, handler: () => void) => void;
          };
        }
      ).connection;
      if (connection?.addEventListener) {
        connection.addEventListener('change', updateConnectionInfo);
      }
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        const connection = (
          navigator as unknown as {
            connection?: { removeEventListener?: (event: string, handler: () => void) => void };
          }
        ).connection;
        if (connection?.removeEventListener) {
          connection.removeEventListener('change', updateConnectionInfo);
        }
      }
    };
  }, [updateConnectionInfo]);

  return {
    isOnline,
    connectionType,
    effectiveType,
    downlink,
    isSlowConnection: effectiveType === '2g' || effectiveType === 'slow-2g',
  };
};
