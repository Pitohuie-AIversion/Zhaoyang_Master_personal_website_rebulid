import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../common/TranslationProvider';
import { socialLinks } from './socialLinks';

export const FooterPersonalInfo: React.FC = () => {
  const { t } = useTranslation();

  const researchAreas = [
    t('footer.researchAreas.areas.0') as string,
    t('footer.researchAreas.areas.1') as string,
    t('footer.researchAreas.areas.2') as string,
    t('footer.researchAreas.areas.3') as string,
    t('footer.researchAreas.areas.4') as string,
  ].filter((area) => area && !area.startsWith('footer.'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="lg:col-span-2"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
          <img
            src="/favicon.svg"
            alt={t('common.logoAlt') as string}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="text-2xl font-bold text-primary-dark theme-transition">
            {t('footer.personalInfo.name') as string}
          </div>
          <div className="text-secondary-dark theme-transition">
            {t('footer.personalInfo.nameEn') as string}
          </div>
        </div>
      </div>
      <p className="text-secondary-dark theme-transition mb-6 leading-relaxed max-w-md">
        {t('footer.personalInfo.description') as string}
      </p>
      <h3 className="font-semibold text-primary-dark theme-transition mb-4">
        {t('footer.researchAreas.title') as string}
      </h3>
      <ul className="space-y-2">
        {researchAreas.map((area: string, index: number) => (
          <li key={index} className="text-secondary-dark theme-transition">
            {area}
          </li>
        ))}
      </ul>
      <div className="flex space-x-4 mt-6">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white"
            aria-label={
              link.name === 'GitHub'
                ? (t('common.social.github') as string)
                : link.name === 'LinkedIn'
                ? (t('common.social.linkedin') as string)
                : link.name === 'ResearchGate'
                ? (t('common.social.researchgate') as string)
                : link.name === 'Google Scholar'
                ? (t('common.social.googleScholar') as string)
                : link.name
            }
          >
            {link.icon}
          </a>
        ))}
      </div>
    </motion.div>
  );
};
