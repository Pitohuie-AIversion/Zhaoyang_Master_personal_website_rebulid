import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../common/TranslationProvider';

export const FooterQuickLinks: React.FC = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('footer.quickLinks.home') as string, href: '/' },
    { name: t('footer.quickLinks.research') as string, href: '/research' },
    { name: t('footer.quickLinks.projects') as string, href: '/projects' },
    { name: t('footer.quickLinks.publications') as string, href: '/publications' },
    { name: t('navigation.skills') as string, href: '/skills' },
    { name: t('navigation.contact') as string, href: '/contact' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <h3 className="font-semibold text-primary-dark theme-transition mb-4">
        {t('footer.quickLinks.title') as string}
      </h3>
      <ul className="space-y-2">
        {quickLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.href}
              className="text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 theme-transition"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
