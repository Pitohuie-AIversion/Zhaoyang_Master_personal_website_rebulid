import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trophy, Folder, Calendar, ArrowRight } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { ScrollReveal } from '../../animations/InteractiveEffects';
import type { NewsItem, TranslationFn } from './homeData';

interface HomeLatestNewsProps {
  newsItems: NewsItem[];
  t: TranslationFn;
}

const NewsIcon = ({ type }: { type: NewsItem['type'] }) => {
  switch (type) {
    case 'publication':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'award':
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    case 'project':
      return <Folder className="w-4 h-4 text-green-500" />;
    default:
      return <Calendar className="w-4 h-4 text-gray-500" />;
  }
};

export const HomeLatestNews: React.FC<HomeLatestNewsProps> = ({ newsItems, t }) => {
  return (
    <div className="lg:col-span-4">
      <div className="sticky top-24">
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-primary-dark theme-transition">
            {t('home.latestNews.title')}
          </h2>
        </SimpleMotion>

        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="left" delay={0.3 + index * 0.1}>
              <div className="group relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 py-1">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 transition-colors duration-300" />
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <span className="font-mono">{item.date}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center gap-1 capitalize">
                    <NewsIcon type={item.type} />
                    {item.type}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <Link
          to="/publications"
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-primary-dark transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700"
        >
          {t('navigation.publications')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
