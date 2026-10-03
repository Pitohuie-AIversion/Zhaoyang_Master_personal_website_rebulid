import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';

export const ContactInfoCards: React.FC = () => {
  const { t } = useTranslation();

  const phoneDisplay = t('contact.info.phone') as string;
  const phoneHref = phoneDisplay.replace(/[^\d+]/g, '') || phoneDisplay;

  return (
    <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition">
      <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">
        {t('contact.contactInfo') as string}
      </h2>
      
      <address className="space-y-6 not-italic">
        {/* 邮箱信息 */}
        <div className="flex items-start sm:items-center">
          <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-900 rounded-md flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0" aria-hidden="true">
            <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-primary-dark theme-transition leading-snug text-base sm:text-sm">
              {t('contact.email') as string}
            </h3>
            <a 
              href={`mailto:${t('contact.info.email') as string}`} 
              className="text-sm sm:text-sm text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 theme-transition leading-relaxed break-all underline-offset-2 hover:underline"
            >
              {t('contact.info.email') as string}
            </a>
          </div>
        </div>
        
        {/* 电话信息 */}
        <div className="flex items-start sm:items-center">
          <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-900 rounded-md flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0" aria-hidden="true">
            <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-primary-dark theme-transition leading-snug text-base sm:text-sm">
              {t('contact.phone') as string}
            </h3>
            <a
              href={`tel:${phoneHref}`}
              className="text-sm sm:text-sm text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 theme-transition leading-relaxed underline-offset-2 hover:underline"
            >
              {phoneDisplay}
            </a>
          </div>
        </div>
        
        {/* 地址信息 */}
        <div className="flex items-start">
          <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-900 rounded-md flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0" aria-hidden="true">
            <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-primary-dark theme-transition leading-snug text-base sm:text-sm">
              {t('contact.address') as string}
            </h3>
            <div className="space-y-1">
              <p className="text-sm sm:text-sm text-secondary-dark theme-transition leading-relaxed break-words">
                {t('contact.info.location') as string}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 theme-transition leading-relaxed">
                {t('contact.info.university') as string} {t('contact.info.department') as string}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 theme-transition leading-relaxed">
                {t('contact.info.office') as string}
              </p>
            </div>
          </div>
        </div>
      </address>
    </article>
  );
};

export default ContactInfoCards;
