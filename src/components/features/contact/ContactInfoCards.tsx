import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
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
          <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0 theme-transition" aria-hidden="true">
            <Mail className="w-6 h-6 sm:w-5 sm:h-5" />
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
          <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0 theme-transition" aria-hidden="true">
            <Phone className="w-6 h-6 sm:w-5 sm:h-5" />
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
          <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0 theme-transition" aria-hidden="true">
            <MapPin className="w-6 h-6 sm:w-5 sm:h-5" />
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

