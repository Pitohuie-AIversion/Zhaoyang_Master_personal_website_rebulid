import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from './TranslationProvider';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/zhaoyangmou',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/zhaoyangmou',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    name: 'ResearchGate',
    href: 'https://researchgate.net/profile/Zhaoyang-Mou',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68-.242.744-.364 1.627-.364 2.647 0 1.098.122 2.05.364 2.854.243.804.65 1.402 1.213 1.795.565.394 1.255.59 2.073.59.818 0 1.508-.196 2.073-.59.563-.393.97-.991 1.213-1.795.242-.804.364-1.756.364-2.854 0-1.02-.122-1.903-.364-2.647-.243-.744-.65-1.303-1.213-1.68C21.094.19 20.404 0 19.586 0zm0 1.608c.394 0 .728.083.999.248.271.165.48.407.625.727.145.319.218.708.218 1.167 0 .458-.073.847-.218 1.167-.145.319-.354.561-.625.727-.271.165-.605.248-.999.248-.394 0-.728-.083-.999-.248-.271-.166-.48-.408-.625-.727-.145-.32-.218-.709-.218-1.167 0-.459.073-.848.218-1.167.145-.32.354-.562.625-.727.271-.165.605-.248.999-.248z"/>
      </svg>
    )
  },
  {
    name: 'ORCID',
    href: 'https://orcid.org/0000-0000-0000-0000',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.516.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.925-1.303 3.925-3.722 0-2.016-1.284-3.722-3.925-3.722h-2.297z"/>
      </svg>
    )
  }
];

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: t('footer.quickLinks.home'), href: '/' },
    { name: t('footer.quickLinks.research'), href: '/research' },
    { name: t('footer.quickLinks.projects'), href: '/projects' },
    { name: t('footer.quickLinks.publications'), href: '/publications' }
  ];

  const researchAreas = [
    t('footer.researchAreas.areas.0'),
    t('footer.researchAreas.areas.1'),
    t('footer.researchAreas.areas.2'),
    t('footer.researchAreas.areas.3'),
    t('footer.researchAreas.areas.4')
  ].filter(area => area && !area.startsWith('footer.'));

  return (
    <footer className="bg-secondary-dark border-t border-primary-dark theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* 个人信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZY</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-dark theme-transition">{t('footer.personalInfo.name')}</div>
                <div className="text-secondary-dark theme-transition">{t('footer.personalInfo.nameEn')}</div>
              </div>
            </div>
            <p className="text-secondary-dark theme-transition mb-6 leading-relaxed max-w-md">
              {t('footer.personalInfo.description')}
            </p>
            <h3 className="font-semibold text-primary-dark theme-transition mb-4">{t('footer.researchAreas.title')}</h3>
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
                  className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* 快速链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-primary-dark theme-transition mb-4">{t('footer.quickLinks.title')}</h3>
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

          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-primary-dark theme-transition mb-4">{t('footer.contact.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-tertiary-dark theme-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href={`mailto:${t('footer.contact.email')}`}
                  className="text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 theme-transition"
                >
                  {t('footer.contact.email')}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-tertiary-dark theme-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-secondary-dark theme-transition">{t('footer.contact.address')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部分割线和版权信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-primary-dark theme-transition mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-tertiary-dark theme-transition text-sm mb-4 md:mb-0">
              &copy; {currentYear} {t('footer.legal.copyright')}
            </p>
            <div className="flex space-x-6 text-sm text-tertiary-dark theme-transition">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 theme-transition">
                {t('footer.legal.privacy')}
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 theme-transition">
                {t('footer.legal.terms')}
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 theme-transition">
                {t('footer.legal.sitemap')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}