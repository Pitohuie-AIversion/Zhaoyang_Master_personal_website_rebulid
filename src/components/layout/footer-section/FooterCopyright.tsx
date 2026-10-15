import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../common/TranslationProvider';

export const FooterCopyright: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      viewport={{ once: true }}
      className="border-t border-primary-dark theme-transition mt-12 pt-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-tertiary-dark theme-transition text-sm mb-4 md:mb-0">
          &copy; {currentYear} {t('footer.legal.copyright') as string}
        </p>
        <div className="text-sm text-tertiary-dark theme-transition">
          <a
            href="/sitemap.xml"
            className="hover:text-blue-600 dark:hover:text-blue-400 theme-transition"
          >
            {t('footer.legal.sitemap') as string}
          </a>
        </div>
      </div>
    </motion.div>
  );
};
