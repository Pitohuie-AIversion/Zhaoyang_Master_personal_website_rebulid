import React from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { useTranslation } from '../components/common/TranslationProvider';
import SEOOptimization from '../components/seo/SEOOptimization';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen relative theme-transition">
      <SEOOptimization 
        title={t('common.notFound.title') as string}
        description={t('common.notFound.description') as string}
        robots="noindex, nofollow"
      />
      <div className="max-w-3xl mx-auto px-6" style={{ paddingTop: '160px', paddingBottom: '80px' }}>
        <SimpleMotion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark theme-transition mb-4">
            {t('common.notFound.title') as string}
          </h1>
          <p className="text-lg text-secondary-dark theme-transition mb-6">
            {t('common.notFound.description') as string}
          </p>
          <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            {t('common.notFound.backHome') as string}
          </a>
        </SimpleMotion>
      </div>
    </div>
  );
}
