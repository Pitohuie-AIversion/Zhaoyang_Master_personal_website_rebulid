import React from 'react';
import { useTranslation } from '../../common/TranslationProvider';

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export const SocialLinks: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks: SocialLinkItem[] = [
    {
      name: t('contact.social.github') as string,
      url: 'https://github.com/Pitohuie',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.linkedin') as string,
      url: 'https://www.linkedin.com/in/zhaoyang-mou/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.csdn') as string,
      url: 'https://blog.csdn.net/zhaoyangmou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.researchgate') as string,
      url: 'https://researchgate.net/profile/Zhaoyang-Mou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68-.242.744-.364 1.627-.364 2.647 0 1.098.122 2.05.364 2.854.243.804.65 1.402 1.213 1.795.565.394 1.255.59 2.073.59.818 0 1.508-.196 2.073-.59.563-.393.97-.991 1.213-1.795.242-.804.364-1.756.364-2.854 0-1.02-.122-1.903-.364-2.647-.243-.744-.65-1.303-1.213-1.68C21.094.19 20.404 0 19.586 0zm0 1.608c.394 0 .728.083.999.248.271.165.48.407.625.727.145.319.218.708.218 1.167 0 .458-.073.847-.218 1.167-.145.319-.354.561-.625.727-.271.165-.605.248-.999.248-.394 0-.728-.083-.999-.248-.271-.166-.48-.408-.625-.727-.145-.32-.218-.709-.218-1.167 0-.459.073-.848.218-1.167.145-.32.354-.562.625-.727.271-.165.605-.248.999-.248zM7.541 5.455c-1.624 0-2.956.394-3.997 1.181C2.503 7.423 1.982 8.52 1.982 9.927c0 1.407.521 2.504 1.562 3.291 1.041.787 2.373 1.181 3.997 1.181.818 0 1.508-.122 2.073-.364.563-.243.97-.607 1.213-1.092.242-.485.364-1.077.364-1.775 0-.698-.122-1.29-.364-1.775-.243-.485-.65-.849-1.213-1.092-.565-.242-1.255-.364-2.073-.364zm0 1.608c.394 0 .728.083.999.248.271.165.48.407.625.727.145.319.218.708.218 1.167 0 .458-.073.847-.218 1.167-.145.319-.354.561-.625.727-.271.165-.605.248-.999.248-.394 0-.728-.083-.999-.248-.271-.166-.48-.408-.625-.727-.145-.32-.218-.709-.218-1.167 0-.459.073-.848.218-1.167.145-.32.354-.562.625-.727.271-.165.605-.248.999-.248z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.scholar') as string,
      url: 'https://scholar.google.com/citations?user=T3AV5RgAAAAJ',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5 12 0z"/>
        </svg>
      )
    }
  ];

  return (
    <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition">
      <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">
        {t('contact.academicSocial') as string}
      </h2>
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" aria-label={t('common.aria.socialLinks') as string}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group theme-transition min-h-[60px] sm:min-h-[56px]"
            aria-label={t('common.aria.visitSocial', { fallback: `访问我的${link.name}主页` }) as string}
          >
            <div className="text-gray-600 dark:text-gray-400 mr-3 sm:mr-4 theme-transition flex-shrink-0" aria-hidden="true">
              {link.icon}
            </div>
            <span className="font-medium text-sm sm:text-base text-primary-dark theme-transition leading-snug break-words flex-1 min-w-0">
              {link.name}
            </span>
          </a>
        ))}
      </nav>
    </article>
  );
};

export default SocialLinks;
