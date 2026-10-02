import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Download } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { ResponsiveContainer } from '../../common/ResponsiveEnhancements';
import type { TranslationFn } from './homeData';

interface HomeCollaborationCTAProps {
  t: TranslationFn;
  language: string;
}

export const HomeCollaborationCTA: React.FC<HomeCollaborationCTAProps> = ({ t, language }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 text-white theme-transition dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950">
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" aria-hidden="true" />
      <ResponsiveContainer maxWidth="xl" className="text-center">
        <SimpleMotion
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.startCollaboration')}
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            {t('home.collaborationDesc')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Mail className="h-5 w-5" />
              {t('home.contactMe')}
            </Link>
            <a
              href={language === 'zh' ? '/cn_resume.pdf' : '/en_resume.pdf'}
              download
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <Download className="h-5 w-5" />
              {t('home.downloadResume')}
            </a>
          </div>
        </SimpleMotion>
      </ResponsiveContainer>
    </section>
  );
};
