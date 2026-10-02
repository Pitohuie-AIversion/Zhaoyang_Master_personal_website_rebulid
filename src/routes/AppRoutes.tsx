import React, { Suspense, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from '../components/common/TranslationProvider';
import { SmartPageTransition } from '../components/animations/PageTransitions';
import { LoadingFallback } from '../components/common/PerformanceOptimization';
import { routesConfig } from './routes.config';
import { PrivateRouteSEO } from './PrivateRouteSEO';

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const focusFrame = window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [location.pathname]);

  return (
    <SmartPageTransition>
      <Routes location={location} key={location.pathname}>
        {routesConfig.map((route) => {
          const loadingMsg = t('common.loading') as string;
          const content = (
            <Suspense fallback={<LoadingFallback message={loadingMsg} />}>
              {route.isPrivate && route.privateDescriptionKey && (
                <PrivateRouteSEO description={t(route.privateDescriptionKey) as string} />
              )}
              {route.element}
            </Suspense>
          );

          return (
            <Route
              key={route.path}
              path={route.path}
              element={content}
            />
          );
        })}
      </Routes>
    </SmartPageTransition>
  );
};

export default AppRoutes;
