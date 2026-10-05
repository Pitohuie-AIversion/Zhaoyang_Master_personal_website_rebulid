import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';

export const AsciiDemoDocs: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 theme-transition ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('ascii.docs.title') as string}
      </h3>
      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.display.title') as string}</h4>
          <ul className="space-y-1">
            <li>• <strong>{t('ascii.display.staticText') as string}</strong>: {t('ascii.docs.display.static') as string}</li>
            <li>• <strong>{t('ascii.display.rhythmEffect') as string}</strong>: {t('ascii.docs.display.rhythm') as string}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.theme.title') as string}</h4>
          <ul className="space-y-1">
            <li>• <strong>{t('ascii.theme.matrix') as string}</strong>: {t('ascii.docs.theme.matrix') as string}</li>
            <li>• <strong>{t('ascii.theme.cyber') as string}</strong>: {t('ascii.docs.theme.cyber') as string}</li>
            <li>• <strong>{t('ascii.theme.neon') as string}</strong>: {t('ascii.docs.theme.neon') as string}</li>
            <li>• <strong>{t('ascii.theme.rainbow') as string}</strong>: {t('ascii.docs.theme.rainbow') as string}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.rhythm.title') as string}</h4>
          <ul className="space-y-1">
            <li>• <strong>{t('ascii.rhythm.heartbeat.label') as string}</strong>: {t('ascii.docs.rhythm.heartbeat') as string}</li>
            <li>• <strong>{t('ascii.rhythm.wave.label') as string}</strong>: {t('ascii.docs.rhythm.wave') as string}</li>
            <li>• <strong>{t('ascii.rhythm.pulse.label') as string}</strong>: {t('ascii.docs.rhythm.pulse') as string}</li>
            <li>• <strong>{t('ascii.rhythm.glitch.label') as string}</strong>: {t('ascii.docs.rhythm.glitch') as string}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ascii.docs.tech.title') as string}</h4>
          <ul className="space-y-1">
            <li>• {t('ascii.docs.tech.canvas') as string}</li>
            <li>• {t('ascii.docs.tech.responsive') as string}</li>
            <li>• {t('ascii.docs.tech.controls') as string}</li>
            <li>• {t('ascii.docs.tech.effects') as string}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
