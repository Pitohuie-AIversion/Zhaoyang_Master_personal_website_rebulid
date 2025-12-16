import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();
  const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    if (!gaId) return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Load the script if not already loaded
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      gtag('js', new Date());
      gtag('config', gaId);
    }
  }, [gaId]);

  useEffect(() => {
    if (!gaId || !window.gtag) return;

    // Send pageview on route change
    window.gtag('config', gaId, {
      page_path: location.pathname + location.search,
    });
  }, [location, gaId]);

  return null;
};
