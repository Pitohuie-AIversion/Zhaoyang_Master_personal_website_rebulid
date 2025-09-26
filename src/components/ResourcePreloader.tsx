import React, { useEffect } from 'react';
import { useResourcePreloader, preloadCriticalRoutes } from './PerformanceOptimization';

interface ResourcePreloaderProps {
  children: React.ReactNode;
}

const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({ children }) => {
  const { preloadImages, preloadFonts } = useResourcePreloader();

  useEffect(() => {
    // 预加载关键图片
    const criticalImages = [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20researcher%20portrait%20in%20modern%20laboratory%20setting&image_size=portrait_4_3',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20AI%20research%20visualization%20with%20neural%20networks&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20development%20project%20interface&image_size=landscape_4_3'
    ];

    preloadImages(criticalImages);

    // 预加载字体
    const criticalFonts = [
      'Inter',
      'system-ui',
      '-apple-system'
    ];

    preloadFonts(criticalFonts);

    // 预加载关键路由
    preloadCriticalRoutes();
  }, [preloadImages, preloadFonts]);

  return <>{children}</>;
};

export default ResourcePreloader;